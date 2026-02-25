"use client";
import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      setError("");
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError("Invalid input for " + mode);
      setOutput("");
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (mode === "encode") {
        setOutput(result.split(",")[1] || "");
      } else {
        setInput(result.split(",")[1] || "");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="tool-page">
      <h1>Base64 Encode / Decode</h1>
      <p className="desc">Encode or decode Base64 strings. Supports text and file input.</p>
      <div className="btn-group">
        <button className={`btn ${mode === "encode" ? "btn-primary" : ""}`} onClick={() => setMode("encode")}>Encode</button>
        <button className={`btn ${mode === "decode" ? "btn-primary" : ""}`} onClick={() => setMode("decode")}>Decode</button>
      </div>
      <textarea className="tool-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."} />
      <div className="btn-group">
        <button className="btn btn-primary" onClick={convert}>Convert</button>
        <input type="file" onChange={handleFile} className="text-sm" />
        <button className="btn" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
        <CopyButton text={output} />
      </div>
      {error && <p className="error-text">❌ {error}</p>}
      {output && <div className="output-box">{output}</div>}
    </div>
  );
}
