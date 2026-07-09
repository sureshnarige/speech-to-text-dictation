
import asyncio, json, logging, re
from concurrent.futures import ThreadPoolExecutor
import numpy as np
import websockets
from faster_whisper import WhisperModel

# ─────────────────────────────────────────────────────────────────────────
# SINGLE-MODEL WHISPER SERVER WITH "LOCAL AGREEMENT" STREAMING
#
# Whisper isn't natively streaming — it transcribes whatever buffer you give
# it as one batch. To get a real-time FEEL out of it without switching
# models, we re-run the same model on the growing utterance buffer every
# PARTIAL_EVERY_MS. Each pass returns a full guess for everything spoken so
# far. We compare the new guess to the previous guess word-by-word: any
# words that match across two consecutive passes are "confirmed" (Whisper
# has now agreed with itself twice in a row on those words, so they're very
# unlikely to change) and get displayed as stable/near-final text. Words
# past that point are still "tentative" and may still change as more audio
# arrives — those are the ones shown as the live grey partial.
#
# When real silence is detected, we do one last full pass on the CURRENT
# utterance only, then APPEND that text onto a per-connection
# `session_transcript` that persists across pauses. Every "final" message
# sent to the client carries the FULL session transcript so far (not just
# the latest utterance), so a pause never wipes earlier text. The
# session_transcript is only reset when the client sends {cmd: "stop"}
# (i.e. dictation session ended / Stop button pressed).
#
# Spoken commands "new line" / "next line" and "new paragraph" /
# "next paragraph" are converted into actual line breaks before being
# appended to the session transcript.
#
# Two extra layers guard transcription quality:
#   1. An RMS silence gate + hallucination-phrase filter, since Whisper is
#      trained on huge amounts of YouTube audio and will sometimes
#      "complete" silence or noise with generic outro phrases like
#      "Thanks for watching, see you in the next video, bye" instead of
#      returning nothing.
#   2. A domain `initial_prompt` that biases decoding toward radiology /
#      medical vocabulary, to reduce mishears like "echotexture" being
#      heard as "Echocardiogram texture".
#
# Only ONE Whisper model is used throughout, for both the repeated partial
# passes and the final pass — no browser SpeechRecognition, no second
# model.
# ─────────────────────────────────────────────────────────────────────────


class _SuppressHandshakeNoise(logging.Filter):
    def filter(self, record):
        return "opening handshake failed" not in record.getMessage()


logging.getLogger("websockets.server").addFilter(_SuppressHandshakeNoise())
logging.getLogger("websockets").addFilter(_SuppressHandshakeNoise())

SAMPLE_RATE = 16000
FRAME_MS = 30
FRAME_BYTES = int(SAMPLE_RATE * FRAME_MS / 1000) * 2  # int16 = 2 bytes/sample

SILENCE_MS_TO_COMMIT = 350
PARTIAL_EVERY_MS = 350          # how often we re-run the model on the growing buffer
MAX_UTTERANCE_MS = 12000        # hard cap so continuous speech still gets chunked

MIN_AUDIO_MS_FOR_PARTIAL = 450
MIN_AUDIO_MS_FOR_FINAL = 300

RMS_SPEECH_THRESHOLD = 400
SPEECH_ONSET_FRAMES = 3         # 3 * 30ms = 90ms of sustained sound required to start capturing

NO_SPEECH_PROB_MAX = 0.6
AVG_LOGPROB_MIN = -1.0
MIN_COMPRESSION_RATIO = 0.4     # very low ratio => repetitive/low-info => likely hallucination

LANG_MAP = {"en-IN": "en", "en-US": "en", "en-GB": "en", "hi-IN": "hi", "te-IN": "te"}

# ─────────────────────────────────────────────────────────────────────────
# DOMAIN PROMPT — biases Whisper's decoding toward radiology/medical
# vocabulary so ambiguous audio is more likely resolved to the correct
# clinical term instead of a generic mishear. Extend this with whatever
# terms you dictate most often (cardiology, discharge summaries, etc.).
# ─────────────────────────────────────────────────────────────────────────
RADIOLOGY_PROMPT = (
    "Radiology ultrasound report. Liver, spleen, kidney, gallbladder, pancreas, "
    "echotexture, echogenicity, echogenic, hypoechoic, hyperechoic, "
    "intrahepatic biliary radicle dilatation, portal vein, common bile duct, "
    "space occupying lesion, focal lesion, hepatomegaly, splenomegaly, "
    "cholelithiasis, cholecystitis, ascites, calculus, cortex, parenchyma."
)

# ─────────────────────────────────────────────────────────────────────────
# VOICE COMMANDS — spoken phrases converted into formatting before being
# appended to the session transcript.
# ─────────────────────────────────────────────────────────────────────────
VOICE_COMMANDS = [
    (re.compile(r'\b(new paragraph|next paragraph)\b', re.IGNORECASE), '\n\n'),
    (re.compile(r'\b(new line|next line|newline)\b', re.IGNORECASE), '\n'),
]

# ─────────────────────────────────────────────────────────────────────────
# KNOWN WHISPER HALLUCINATION PHRASES — generic YouTube-training artifacts
# that sometimes appear on silence/noise instead of an empty transcript.
# ─────────────────────────────────────────────────────────────────────────
HALLUCINATION_PATTERNS = [
    re.compile(r'thanks? for watching', re.IGNORECASE),
    re.compile(r"i'?ll see you (in the )?next (video|time|one)", re.IGNORECASE),
    re.compile(r'see you in the next one', re.IGNORECASE),
    re.compile(r'\bsubscribe\b', re.IGNORECASE),
    re.compile(r'like and subscribe', re.IGNORECASE),
    re.compile(r'please subscribe', re.IGNORECASE),
    re.compile(r'thank you for watching', re.IGNORECASE),
    re.compile(r'^\s*bye\.?\s*$', re.IGNORECASE),
    re.compile(r'^\s*thank you\.?\s*$', re.IGNORECASE),
]


def apply_voice_commands(text):
    """Replace spoken formatting commands with actual line breaks and
    tidy up any resulting whitespace."""
    for pattern, replacement in VOICE_COMMANDS:
        text = pattern.sub(replacement, text)
    text = re.sub(r'[ \t]*\n[ \t]*', '\n', text)   # trim spaces around line breaks
    text = re.sub(r'\n{3,}', '\n\n', text)          # cap consecutive blank lines at one
    return text.strip()


def strip_hallucinations(text):
    """Remove known Whisper YouTube-training hallucination phrases."""
    if not text:
        return text
    for pattern in HALLUCINATION_PATTERNS:
        text = pattern.sub('', text)
    return re.sub(r'\s{2,}', ' ', text).strip()


def append_to_session(session_text, new_text):
    """Append a newly committed utterance onto the running session
    transcript. Never overwrites what came before a pause."""
    new_text = apply_voice_commands(new_text)
    if not new_text:
        return session_text
    if not session_text:
        return new_text
    if new_text.startswith('\n'):
        # Voice command already supplies the separator (new line/paragraph)
        return session_text + new_text
    return session_text + ' ' + new_text


print("Loading Whisper model...")
# Single model used for BOTH partial (repeated) passes and final passes.
# "small" is the accuracy/speed sweet spot for medical vocabulary on CPU.
# If partial passes feel too slow/laggy on your hardware, try "base" —
# you lose a bit of accuracy on rare terms but gain noticeable speed.
# For GPU: WhisperModel("small", device="cuda", compute_type="float16", cpu_threads=4)
model = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=4)
print("Model ready.")

executor = ThreadPoolExecutor(max_workers=4)


def frame_is_speech(frame_bytes):
    samples = np.frombuffer(frame_bytes, dtype=np.int16).astype(np.float32)
    rms = np.sqrt(np.mean(samples ** 2)) if len(samples) else 0.0
    return rms > RMS_SPEECH_THRESHOLD, rms


def run_transcribe(pcm_bytes, lang, min_ms):
    min_bytes = int(SAMPLE_RATE * 2 * min_ms / 1000)
    if len(pcm_bytes) < min_bytes:
        return ""

    samples = np.frombuffer(pcm_bytes, dtype=np.int16).astype(np.float32)

    # Skip transcription entirely on near-silent audio — this is the #1
    # trigger for hallucinated outro phrases like "Thanks for watching".
    rms = np.sqrt(np.mean(samples ** 2)) if len(samples) else 0.0
    if rms < RMS_SPEECH_THRESHOLD * 0.8:
        return ""

    audio = samples / 32768.0
    segments, _ = model.transcribe(
        audio, language=lang, beam_size=1, condition_on_previous_text=False,
        vad_filter=True,
        vad_parameters={"min_silence_duration_ms": 200},
        no_speech_threshold=NO_SPEECH_PROB_MAX,
        initial_prompt=RADIOLOGY_PROMPT if lang == "en" else None,
    )
    kept = []
    for s in segments:
        if getattr(s, "no_speech_prob", 0.0) > NO_SPEECH_PROB_MAX:
            continue
        if getattr(s, "avg_logprob", 0.0) < AVG_LOGPROB_MIN:
            continue
        # Hallucinations are often highly repetitive/low information — a
        # low compression_ratio flags that.
        if getattr(s, "compression_ratio", 1.0) < MIN_COMPRESSION_RATIO:
            continue
        kept.append(s.text)

    text = "".join(kept).strip()
    return strip_hallucinations(text)


async def run_transcribe_async(pcm_bytes, lang, min_ms):
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(executor, run_transcribe, pcm_bytes, lang, min_ms)


def longest_common_prefix_len(words_a, words_b):
    n = min(len(words_a), len(words_b))
    i = 0
    while i < n and words_a[i] == words_b[i]:
        i += 1
    return i


async def safe_send(websocket, payload):
    try:
        await websocket.send(payload)
    except websockets.exceptions.ConnectionClosed:
        pass


async def handler(websocket):
    lang = "en"
    try:
        path = websocket.request.path
    except AttributeError:
        path = getattr(websocket, "path", "")
    if "?" in path:
        for kv in path.split("?", 1)[1].split("&"):
            if kv.startswith("lang="):
                lang = LANG_MAP.get(kv.split("=", 1)[1], "en")
    print(f"[ws] new connection, path={path}, lang={lang}")

    buf = bytearray()
    pending = bytearray()
    silence_ms = 0
    speaking = False
    bytes_since_partial = 0
    frame_count = 0
    consecutive_speech_frames = 0

    # Cumulative transcript for this connection/dictation session.
    # Persists across pauses (utterance boundaries) and is only cleared
    # when the client sends {cmd: "stop"}.
    session_transcript = ""

    # Local-agreement state for the utterance currently in progress.
    prev_words = []       # words from the previous partial pass
    confirmed_count = 0   # how many leading words have agreed across 2 passes

    def reset_utterance_state():
        nonlocal prev_words, confirmed_count
        prev_words = []
        confirmed_count = 0

    try:
        async for message in websocket:
            if isinstance(message, (bytes, bytearray)):
                pending.extend(message)

                while len(pending) >= FRAME_BYTES:
                    frame = bytes(pending[:FRAME_BYTES])
                    del pending[:FRAME_BYTES]

                    is_speech, rms = frame_is_speech(frame)
                    frame_count += 1
                    if frame_count % 20 == 0:
                        print(f"[audio] rms={rms:.1f} threshold={RMS_SPEECH_THRESHOLD} speaking={speaking}")

                    if is_speech:
                        consecutive_speech_frames += 1
                    else:
                        consecutive_speech_frames = 0

                    if not speaking:
                        if consecutive_speech_frames >= SPEECH_ONSET_FRAMES:
                            speaking = True
                            buf.extend(frame)
                            silence_ms = 0
                            bytes_since_partial += FRAME_BYTES
                    elif is_speech:
                        buf.extend(frame)
                        silence_ms = 0
                        bytes_since_partial += FRAME_BYTES
                    else:
                        buf.extend(frame)
                        silence_ms += FRAME_MS

                    # ── Local-agreement partial pass ──────────────────────
                    if speaking and bytes_since_partial >= int(SAMPLE_RATE * 2 * PARTIAL_EVERY_MS / 1000):
                        bytes_since_partial = 0
                        text = await run_transcribe_async(bytes(buf), lang, MIN_AUDIO_MS_FOR_PARTIAL)
                        if text:
                            words = text.split()
                            agree_len = longest_common_prefix_len(words, prev_words)
                            # Words that matched the previous pass AND are
                            # beyond what we'd already confirmed become newly
                            # confirmed (Whisper agreed with itself twice).
                            if agree_len > confirmed_count:
                                confirmed_count = agree_len
                            prev_words = words

                            confirmed_text = " ".join(words[:confirmed_count])
                            tentative_text = " ".join(words[confirmed_count:])

                            await safe_send(websocket, json.dumps({
                                "type": "partial",
                                "confirmed": confirmed_text,
                                "tentative": tentative_text,
                            }))

                    # ── Silence -> commit final for this utterance ────────
                    if speaking and silence_ms >= SILENCE_MS_TO_COMMIT:
                        text = await run_transcribe_async(bytes(buf), lang, MIN_AUDIO_MS_FOR_FINAL)
                        if text:
                            session_transcript = append_to_session(session_transcript, text)
                            await safe_send(websocket, json.dumps({
                                "type": "final",
                                "text": session_transcript,
                            }))
                        buf = bytearray()
                        silence_ms = 0
                        speaking = False
                        bytes_since_partial = 0
                        consecutive_speech_frames = 0
                        reset_utterance_state()

                    elif speaking and len(buf) >= int(SAMPLE_RATE * 2 * MAX_UTTERANCE_MS / 1000):
                        # Continuous speech, no real pause — force a commit so
                        # nothing is lost, then keep listening as a fresh utterance.
                        text = await run_transcribe_async(bytes(buf), lang, MIN_AUDIO_MS_FOR_FINAL)
                        if text:
                            session_transcript = append_to_session(session_transcript, text)
                            await safe_send(websocket, json.dumps({
                                "type": "final",
                                "text": session_transcript,
                            }))
                        print(f"[forced-commit] buffer hit {MAX_UTTERANCE_MS}ms, chunked and continuing")
                        buf = bytearray()
                        silence_ms = 0
                        bytes_since_partial = 0
                        reset_utterance_state()
                        # speaking stays True — still mid-speech, just starting a new chunk
            else:
                try:
                    data = json.loads(message)
                except Exception:
                    continue

                if data.get("cmd") == "stop":
                    if buf:
                        text = await run_transcribe_async(bytes(buf), lang, MIN_AUDIO_MS_FOR_FINAL)
                        if text:
                            session_transcript = append_to_session(session_transcript, text)
                    await safe_send(websocket, json.dumps({
                        "type": "final",
                        "text": session_transcript,
                        "done": True,
                    }))
                    buf, speaking, silence_ms = bytearray(), False, 0
                    consecutive_speech_frames = 0
                    session_transcript = ""       # reset only on explicit stop
                    reset_utterance_state()

                elif data.get("cmd") == "setlang":
                    lang = LANG_MAP.get(data.get("lang", "en-IN"), "en")

    except websockets.exceptions.ConnectionClosed:
        pass
    except (ConnectionAbortedError, ConnectionResetError):
        pass
    finally:
        print(f"[disconnect] client disconnected, lang={lang}")


async def main():
    print("STT server (Whisper, local-agreement streaming) listening on ws://0.0.0.0:8765")
    async with websockets.serve(handler, "0.0.0.0", 8765, max_size=None):
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
