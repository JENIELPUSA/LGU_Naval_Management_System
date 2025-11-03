import React, { useState, useEffect, useCallback } from "react";
import { Mic, MicOff, History } from "lucide-react";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";

const VoiceController = () => {
  const { isListening, transcript, lastCommand, startListening, stopListening, isSupported } = useSpeechRecognition();

  const [commandHistory, setCommandHistory] = useState([]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [headsetKey, setHeadsetKey] = useState("F8");
  const [showPanel, setShowPanel] = useState(false);
  const [collapsed, setCollapsed] = useState(true); // <- collapsed by default

  // Load saved state
  useEffect(() => {
    const savedVoiceState = localStorage.getItem("voiceControlEnabled");
    const savedHeadsetKey = localStorage.getItem("headsetKey");
    if (savedVoiceState !== null) setIsVoiceEnabled(JSON.parse(savedVoiceState));
    if (savedHeadsetKey) setHeadsetKey(savedHeadsetKey);
  }, []);

  // Save state
  useEffect(() => localStorage.setItem("voiceControlEnabled", JSON.stringify(isVoiceEnabled)), [isVoiceEnabled]);
  useEffect(() => localStorage.setItem("headsetKey", headsetKey), [headsetKey]);

  // Start/stop listening
  useEffect(() => {
    if (isVoiceEnabled) startListening();
    else stopListening();
  }, [isVoiceEnabled, startListening, stopListening]);

  // Voice command listener
  useEffect(() => {
    const handleVoiceCommand = (event) => {
      const command = event.detail?.command;
      if (command) {
        const newEntry = { command, timestamp: new Date().toLocaleTimeString() };
        setCommandHistory((prev) => [newEntry, ...prev.slice(0, 14)]);
      }
    };
    window.addEventListener("voice-command", handleVoiceCommand);
    return () => window.removeEventListener("voice-command", handleVoiceCommand);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (
        event.code === `Key${headsetKey.toUpperCase().replace("F", "")}` ||
        event.key === headsetKey ||
        event.code === headsetKey
      ) {
        event.preventDefault();
        setIsVoiceEnabled((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [headsetKey]);

  const toggleVoiceControl = useCallback(() => setIsVoiceEnabled((prev) => !prev), []);
  const toggleHistoryPanel = useCallback(() => setShowPanel((prev) => !prev), []);
  const toggleCollapse = useCallback(() => setCollapsed((prev) => !prev), []);
  const clearHistory = useCallback(() => setCommandHistory([]), []);
  const handleHeadsetKeyChange = (e) => setHeadsetKey(e.target.value);

  if (!isSupported) {
    return (
      <div style={{ position: "fixed", bottom: 10, right: 10, background: "#dc3545", color: "white", padding: "4px 6px", borderRadius: "16px", fontSize: "10px", display: "flex", alignItems: "center", gap: "4px", zIndex: 10000 }}>
        <MicOff size={12} />
        Speech Not Supported
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        right: 10,
        transform: "translateY(-50%)",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "4px",
      }}
    >
      {/* Collapsed/Expand Button */}
      <button
        onClick={toggleCollapse}
        style={{
          background: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "32px",
          height: "32px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label={collapsed ? "Expand" : "Collapse"}
      >
        {collapsed ? <MicOff size={16} /> : <Mic size={16} />}
      </button>

      {/* Expanded Controls */}
      {!collapsed && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            background: "rgba(0,0,0,0.8)",
            padding: "6px 4px",
            borderRadius: "14px",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {/* Status */}
          <div
            style={{
              background: isVoiceEnabled ? (isListening ? "#28a745" : "#ffc107") : "#dc3545",
              color: "white",
              padding: "4px 6px",
              borderRadius: "14px",
              fontSize: "9px",
              fontWeight: "bold",
              minWidth: "60px",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              textAlign: "center",
            }}
          >
            {isVoiceEnabled ? (isListening ? "🎤 LISTENING" : "⚠️ STANDBY") : "🔴 DISABLED"}
          </div>

          {/* Mic Button */}
          <button
            onClick={toggleVoiceControl}
            style={{
              background: isVoiceEnabled ? (isListening ? "#28a745" : "#17a2b8") : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isVoiceEnabled ? <Mic size={16} style={{ animation: isListening ? "pulse 1.5s infinite" : "none" }} /> : <MicOff size={16} />}
          </button>

          {/* History Toggle */}
          <button
            onClick={toggleHistoryPanel}
            style={{
              background: showPanel ? "#495057" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <History size={14} />
          </button>
        </div>
      )}

      {/* History Panel */}
      {showPanel && !collapsed && (
        <div
          style={{
            position: "absolute",
            right: "40px",
            top: 0,
            background: "rgba(0,0,0,0.95)",
            color: "white",
            padding: "8px",
            borderRadius: "10px",
            width: "240px",
            fontSize: "12px",
            backdropFilter: "blur(6px)",
            border: "1px solid #333",
            zIndex: 999,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <strong>History</strong>
            <button onClick={toggleHistoryPanel} style={{ background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: "14px" }}>×</button>
          </div>

          {commandHistory.length > 0 ? (
            <div style={{ maxHeight: "100px", overflowY: "auto", background: "#1a1a1a", borderRadius: "4px", padding: "4px" }}>
              {commandHistory.map((item, i) => (
                <div key={i} style={{ fontSize: "10px", padding: "2px 4px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"{item.command}"</span>
                  <span style={{ opacity: 0.6, fontSize: "9px", flexShrink: 0 }}>{item.timestamp}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: "10px", opacity: 0.7 }}>No commands yet</div>
          )}
        </div>
      )}

      <style>
        {`@keyframes pulse {0% {opacity:1;}50% {opacity:0.5;}100% {opacity:1;}}`}
      </style>
    </div>
  );
};

export default VoiceController;
