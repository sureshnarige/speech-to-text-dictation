<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="FrmSpeechToText.aspx.vb" MasterPageFile="~/HmsMain.Master" Inherits="eHMS.FrmSpeechToText" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
    
    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <ContentTemplate>
            <style>
                /* ── Base ── */
                html body {
                    min-height: 95%;
                    max-height: 95%;
                    min-width: 100%;
                    max-width: 100%;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }

                /* ── Card ── */
                .card {
                    border: none;
                    border-radius: 10px;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
                    background: #fff;
                    margin-bottom: 8px;
                    overflow: hidden;
                }

                .card-header {
                    padding: 10px 16px;
                    background: linear-gradient(135deg, #003A70 0%, #005EB8 100%);
                    border-bottom: none;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                }

                .card-header-title {
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: 0.03em;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .card-header-title::before {
                    content: '';
                    display: inline-block;
                    width: 3px;
                    height: 16px;
                    background: #4fc3f7;
                    border-radius: 2px;
                }

                .card-body {
                    padding: 0;
                    min-height: 300px;
                }

                .card-footer {
                    border-top: 1px solid rgba(0,0,0,0.07);
                    padding: 10px 16px;
                    background: #f8f9fa;
                }

                .card-footer .btn {
                    background-color: #003A70;
                    color: #fff;
                    border: none;
                    border-radius: 6px;
                    padding: 6px 18px;
                    font-size: 13px;
                    font-weight: 600;
                    transition: background-color 0.2s;
                }

                .card-footer .btn:hover {
                    background-color: #0056b3;
                }

                /* ── HtmlEditor overrides ── */
                .ajax__html_editor_extender_buttoncontainer {
                    background: #f0f4f8 !important;
                    border-bottom: 1px solid #dde3ea !important;
                    padding: 4px 6px !important;
                }

                .ajax__html_editor_extender_texteditor {
                    border: none !important;
                    padding: 16px !important;
                    width: 100% !important;
                    font-size: 14px;
                    line-height: 1.8;
                    color: #1a1a2e;
                    min-height: 320px;
                }

                .ajax__html_editor_extender_texteditor:focus {
                    outline: none !important;
                }

                .A4SizePage {
                    width: 100%;
                    min-height: 320px;
                    margin: 0;
                }

                /* ── STT Toolbar ── */
                .stt-toolbar {
                    background: linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 100%);
                    border-bottom: 1px solid #c9dff5;
                    padding: 10px 14px;
                }

                .stt-toolbar-row {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 8px;
                }

                /* Language select */
                .stt-select {
                    padding: 6px 10px;
                    border: 1px solid #b8cfe8;
                    border-radius: 6px;
                    font-size: 12px;
                    background: #fff;
                    color: #003A70;
                    font-weight: 500;
                    cursor: pointer;
                    outline: none;
                    transition: border-color 0.2s;
                }

                .stt-select:focus {
                    border-color: #005EB8;
                }

                /* Buttons */
                .stt-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 6px 14px;
                    border: none;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: opacity 0.15s, transform 0.1s, box-shadow 0.15s;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.12);
                    letter-spacing: 0.02em;
                }

                .stt-btn:active {
                    transform: scale(0.97);
                }

                .stt-btn:disabled {
                    opacity: .4;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .stt-btn-start {
                    background: linear-gradient(135deg, #1a7a4a, #198754);
                    color: #fff;
                }

                .stt-btn-start:hover:not(:disabled) {
                    box-shadow: 0 3px 10px rgba(25,135,84,0.4);
                }

                .stt-btn-stop {
                    background: linear-gradient(135deg, #c0392b, #dc3545);
                    color: #fff;
                }

                .stt-btn-stop:hover:not(:disabled) {
                    box-shadow: 0 3px 10px rgba(220,53,69,0.4);
                }

                .stt-btn-clear {
                    background: linear-gradient(135deg, #555, #6c757d);
                    color: #fff;
                }

                .stt-btn-clear:hover:not(:disabled) {
                    box-shadow: 0 3px 10px rgba(108,117,125,0.35);
                }

                /* Status */
                .stt-status {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    font-size: 12px;
                    color: #4a5568;
                    font-weight: 500;
                    padding: 4px 10px;
                    background: #fff;
                    border: 1px solid #d1dce8;
                    border-radius: 20px;
                }

                .stt-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                .stt-dot-idle {
                    background: #adb5bd;
                }

                .stt-dot-active {
                    background: #dc3545;
                    animation: sttPulse 1s infinite;
                }

                .stt-dot-ok {
                    background: #198754;
                }

                @keyframes sttPulse {
                    0%,100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: .3;
                        transform: scale(0.8);
                    }
                }

                /* REC badge */
                #sttRecordingBadge {
                    display: none;
                    align-items: center;
                    gap: 5px;
                    font-size: 11px;
                    color: #dc3545;
                    font-weight: 700;
                    padding: 4px 10px;
                    background: #fff0f0;
                    border: 1px solid #f5c2c7;
                    border-radius: 20px;
                    letter-spacing: 0.06em;
                }

                #sttRecordingBadge.active {
                    display: inline-flex;
                }

                #sttRecordingBadge::before {
                    content: '';
                    width: 7px;
                    height: 7px;
                    background: #dc3545;
                    border-radius: 50%;
                    animation: sttPulse 1s infinite;
                }

                /* No-support warning */
                .stt-no-support {
                    display: none;
                    padding: 8px 12px;
                    background: #fff3cd;
                    border: 1px solid #ffc107;
                    border-radius: 6px;
                    font-size: 12px;
                    color: #856404;
                    margin-bottom: 8px;
                }

                /* Live interim bar below toolbar */
                .stt-live-bar {
                    display: none;
                    align-items: center;
                    gap: 10px;
                    padding: 7px 14px;
                    background: #e8f5e9;
                    border-top: 1px solid #c8e6c9;
                    font-size: 13px;
                    color: #1b5e20;
                    font-style: italic;
                    min-height: 34px;
                    animation: barSlideIn 0.15s ease;
                }

                .stt-live-bar.active {
                    display: flex;
                }

                @keyframes barSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-4px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Mic pulse icon inside live bar */
                .stt-mic-icon {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    flex-shrink: 0;
                }

                .stt-mic-icon span {
                    display: inline-block;
                    width: 3px;
                    background: #2e7d32;
                    border-radius: 2px;
                    animation: sttWave 0.8s ease-in-out infinite;
                }

                .stt-mic-icon span:nth-child(1) {
                    height: 8px;
                    animation-delay: 0.0s;
                }
                .stt-mic-icon span:nth-child(2) {
                    height: 14px;
                    animation-delay: 0.1s;
                }
                .stt-mic-icon span:nth-child(3) {
                    height: 18px;
                    animation-delay: 0.2s;
                }
                .stt-mic-icon span:nth-child(4) {
                    height: 14px;
                    animation-delay: 0.1s;
                }
                .stt-mic-icon span:nth-child(5) {
                    height: 8px;
                    animation-delay: 0.0s;
                }

                @keyframes sttWave {
                    0%,100% {
                        transform: scaleY(0.4);
                        opacity: 0.5;
                    }
                    50% {
                        transform: scaleY(1);
                        opacity: 1;
                    }
                }

                #sttLiveText {
                    flex: 1;
                    font-weight: 500;
                    color: #a0a0a0;
                    font-style: italic;
                }

                .editstyle {
                    font-size: 15px;
                }

                .ModelButtonStyle {
                    color: #205081 !important;
                }

                .btn {
                    text-align: justify;
                }

                /* ─── Partial text styling ─────────────────────────────────── */
                .stt-partial-text {
                    color: #a0a0a0 !important;
                    font-style: italic;
                    opacity: 0.7;
                }

                .stt-final-text {
                    color: #000000 !important;
                }

                .stt-editor-content p {
                    margin: 0 0 4px 0;
                }

                .stt-editor-content .partial {
                    color: #a0a0a0;
                    font-style: italic;
                    opacity: 0.7;
                }

                .stt-editor-content .final {
                    color: #000000;
                }
            </style>

            <div class="row">
                <div class="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-xs-12">
                    <div class="card">

                        <div class="card-header">
                            <span class="card-header-title">📋 Speech To Text </span>
                        </div>

                        <div class="card-body">

                            <div class="stt-toolbar">

                                <div id="sttNoSupport" class="stt-no-support">
                                    ⚠ Speech recognition requires Chrome or Edge browser.
                                </div>

                                <div class="stt-toolbar-row">
 

                                    <button type="button" id="sttBtnStart" class="stt-btn stt-btn-start" onclick="stt_start()">
                                        🎙 Dictate
                                    </button>
                                    <button type="button" id="sttBtnStop" class="stt-btn stt-btn-stop" onclick="stt_stop()" disabled>
                                        ⏹ Stop
                                    </button>
                                    <button type="button" id="sttBtnClear" class="stt-btn stt-btn-clear" onclick="stt_clear()">
                                        🗑 Clear
                                    </button>

                                    <span class="stt-divider"></span>

                                    <span class="stt-status">
                                        <span class="stt-dot stt-dot-idle" id="sttDot"></span>
                                        <span id="sttStatusText">Ready</span>
                                    </span>

                                    <span id="sttRecordingBadge">REC</span>

                                </div>

                            </div>

                            <div class="stt-live-bar" id="sttLiveBar">
                                <div class="stt-mic-icon" aria-hidden="true">
                                    <span></span><span></span><span></span><span></span><span></span>
                                </div>
                                <span id="sttLiveText">Listening…</span>
                            </div>

                            <div class="row">
                                <div class="col-sm-12">
                                    <asp:TextBox ID="TxtEditor" CssClass="form-control A4SizePage" runat="server"></asp:TextBox>
                                    <ajaxToolkit:HtmlEditorExtender ID="htmlEditorExtender1"
                                        TargetControlID="TxtEditor"
                                        runat="server"
                                        EnableSanitization="true">
                                        <Toolbar>
                                            <ajaxToolkit:Undo />
                                            <ajaxToolkit:Redo />
                                            <ajaxToolkit:Bold />
                                            <ajaxToolkit:Italic />
                                            <ajaxToolkit:Underline />
                                            <ajaxToolkit:StrikeThrough />
                                            <ajaxToolkit:FontNameSelector />
                                            <ajaxToolkit:FontSizeSelector />
                                            <ajaxToolkit:ForeColorSelector />
                                            <ajaxToolkit:BackgroundColorSelector />
                                            <ajaxToolkit:JustifyLeft />
                                            <ajaxToolkit:JustifyCenter />
                                            <ajaxToolkit:JustifyRight />
                                            <ajaxToolkit:JustifyFull />
                                            <ajaxToolkit:InsertOrderedList />
                                            <ajaxToolkit:InsertUnorderedList />
                                            <ajaxToolkit:InsertHorizontalRule />
                                            <ajaxToolkit:InsertImage />
                                        </Toolbar>
                                    </ajaxToolkit:HtmlEditorExtender>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </ContentTemplate>
    </asp:UpdatePanel>
    <script src="../../../js_hms/speechtotext/stt_script_complete.js"></script>
    <!-- Include the STT JavaScript -->


    <!-- Small initialization script -->
    <script>

        // Ensure the editor is ready before STT starts
        document.addEventListener('DOMContentLoaded', function () {
            // Any additional initialization if needed
            console.log('STT Hybrid system ready');
        });
    </script>

</asp:Content>
