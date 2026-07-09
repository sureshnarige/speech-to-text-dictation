# 🎙️ Medical Speech-to-Text Dictation Module

A hybrid, real-time speech-to-text dictation tool built for an ASP.NET (VB) Hospital Management System (eHMS). It combines the **browser's built-in Speech Recognition API** (for instant, zero-latency partial text) with a **local Whisper AI model over WebSockets** (for accurate, medically-corrected final text) — plus a large medical terminology correction dictionary for drug names, abbreviations, and clinical terms.

---

## ✨ Features

- **Hybrid dictation engine**
  - Browser `SpeechRecognition` API shows instant grey "live" partial text as you speak.
  - A local Python **faster-whisper** server transcribes the same audio in parallel and produces the accurate, corrected **final** black text once you pause.
- **Medical term correction dictionary** — automatically fixes common mishears for drug names (e.g. "met for min" → *Metformin*), abbreviations (`htn` → *Hypertension*), and clinical phonetic errors (e.g. "new monia" → *Pneumonia*).
- **Voice commands** — say "new line" / "new paragraph" to insert formatting while dictating.
- **Hallucination filtering** — strips out known Whisper artifacts (e.g. "Thanks for watching") that can appear on silence/noise.
- **Session-persistent transcript** — pausing does not erase earlier dictated text; only pressing **Stop** resets the session.
- **Auto-reconnect** — the WebSocket client automatically reconnects if the connection drops mid-dictation.
- **Integrates with an AjaxControlToolkit `HtmlEditorExtender`** rich text box already used in the eHMS UI.

---

## 🏗️ Architecture

```
┌─────────────────────────┐        Mic audio (PCM16, 16kHz)        ┌──────────────────────────┐
│   Browser (Client)      │ ───────────────────────────────────▶  │  Python WebSocket Server │
│                          │            ws://host:8765             │  (faster-whisper)        │
│  • Web Speech API        │                                       │                          │
│    → instant partials    │  ◀─────────────────────────────────   │  • Local-agreement        │
│  • WebSocket audio send  │        {type:"partial" | "final"}     │    streaming partials     │
│  • Correction dictionary │                                       │  • Silence-triggered      │
│  • HtmlEditorExtender    │                                       │    final transcription    │
│    display (ASPX page)   │                                       │  • Hallucination filter   │
└─────────────────────────┘                                       └──────────────────────────┘
```

1. User clicks **🎙 Dictate**.
2. Browser starts both:
   - The native `SpeechRecognition` API (shows grey, italic **partial** text immediately).
   - A WebSocket connection to the local Whisper server, streaming raw 16kHz PCM audio.
3. The Python server buffers audio, detects speech/silence via RMS + VAD, and:
   - Sends **partial** guesses periodically while you're still speaking.
   - Sends a **final**, corrected transcript once it detects a pause.
4. The client applies the medical `CORRECTIONS` dictionary to the final text and renders it as normal (black) text in the editor, replacing the grey partial.
5. Clicking **⏹ Stop** ends the session and resets the server-side transcript buffer.

---

## 📁 Repository Structure

```
speech-to-text-dictation/
├── client/
│   ├── pages/
│   │   └── FrmSpeechToText.aspx        # ASP.NET WebForms page (VB code-behind, ASPX markup)
│   └── js_hms/
│       └── speechtotext/
│           └── stt_script_complete.js  # Client-side hybrid STT logic + medical corrections
├── server/
│   └── stt_server.py                   # Python WebSocket server using faster-whisper
├── requirements.txt                    # Python dependencies
├── .gitignore
├── LICENSE
└── README.md
```

> **Note:** `FrmSpeechToText.aspx` references a VB code-behind file (`FrmSpeechToText.aspx.vb`) and a master page (`HmsMain.Master`) that are part of the larger eHMS solution and are not included here — this repo only contains the speech-to-text module itself. Drop the `.aspx` file into your existing ASP.NET project structure and adjust the `MasterPageFile` / `Inherits` values to match your solution.

---

## ⚙️ Requirements

**Server (Python):**
- Python 3.9+
- `faster-whisper`, `websockets`, `numpy` (see `requirements.txt`)
- ~2GB free disk space for the Whisper "small" model (downloaded automatically on first run)
- Works on CPU (default, `int8` quantization) or GPU (CUDA, optional — see notes in `stt_server.py`)

**Client:**
- Google Chrome or Microsoft Edge (required for the Web Speech API partials)
- An existing ASP.NET WebForms project with `AjaxControlToolkit` installed (for `HtmlEditorExtender`)
- Microphone access (HTTPS or `localhost` required by browsers for `getUserMedia`)

---

## 🚀 Setup & Usage

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/speech-to-text-dictation.git
cd speech-to-text-dictation
```

### 2. Set up and run the Whisper WebSocket server
```bash
cd server
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r ../requirements.txt
python stt_server.py
```
You should see:
```
Loading Whisper model...
Model ready.
STT server (Whisper, local-agreement streaming) listening on ws://0.0.0.0:8765
```
Leave this running — it's the backend the browser client connects to on port `8765`.

### 3. Add the client files to your ASP.NET project
- Copy `client/pages/FrmSpeechToText.aspx` into your site (alongside its `.aspx.vb` code-behind and `HmsMain.Master` master page).
- Copy `client/js_hms/speechtotext/stt_script_complete.js` into your site under the same relative path referenced in the page (`../../../js_hms/speechtotext/stt_script_complete.js`), or update the `<script src="...">` path to match your folder layout.

### 4. Run your ASP.NET site and open the Speech-to-Text page
- Click **🎙 Dictate** to start. Grant microphone permission when prompted.
- Speak — grey italic text appears instantly, then turns into corrected black text after a short pause.
- Say **"new line"** or **"new paragraph"** to format while dictating.
- Click **⏹ Stop** to end the session, or **🗑 Clear** to wipe the editor.

---

## 🔧 Configuration Notes

- **WebSocket URL**: `stt_script_complete.js` builds the WebSocket URL from `window.location.hostname` on port `8765`. If you deploy the Whisper server elsewhere (a different host, behind a reverse proxy, or via a tunnel like ngrok), update `getWebSocketUrl()` in `stt_script_complete.js` accordingly.
- **Language**: Defaults to `en-IN`. The `LANG_MAP` in `stt_server.py` and the `recognition.lang` value in the client can be extended for other locales (Hindi `hi-IN`, Telugu `te-IN`, etc. are already mapped in the server).
- **Model size**: `stt_server.py` uses the `"small"` Whisper model as an accuracy/speed balance for medical vocabulary. Swap to `"base"` for faster but less accurate partials, or `"medium"`/`"large-v3"` for higher accuracy if you have GPU resources.
- **Medical corrections dictionary**: Located in `CORRECTIONS` at the top of `stt_script_complete.js`. Add your own drug names, abbreviations, or phonetic mishears there — matching is case-insensitive and whole-word.

---

## ⚠️ Security & Deployment Notes

- This server has **no authentication** by default — it accepts any WebSocket connection on port `8765`. Restrict access via firewall rules, a reverse proxy with auth, or a VPN before exposing it beyond `localhost`.
- Audio is streamed as raw PCM and is **not stored to disk** by the server — transcription happens in-memory per session.
- Since this handles medical dictation, review your organization's data-handling and compliance requirements (e.g. HIPAA or local equivalents) before deploying beyond a local/testing environment.

---

## 📄 License

See [LICENSE](LICENSE).
