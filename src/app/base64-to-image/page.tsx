"use client";
import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export default function Base64ToImage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      let data = input.trim();
      // Add prefix if missing
      if (!data.startsWith("data:image/")) {
        // Try to detect format
        const ext = data.match(/^data:([^;]+);/)?.[1] || "image/png";
        if (!data.startsWith("data:")) {
          // Assume raw base64
          data = `data:image/png;base64,${data}`;
        } else {
          data = `data:${ext};base64,${data.split(";base64,")[1] || data.split(",")[1]}`;
        }
      }
      setOutput(data);
      setError("");
    } catch (e) {
      setError("Invalid Base64 string");
      setOutput("");
    }
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = output;
    a.download = "image.png";
    a.click();
  };

  return (
    <div className="tool-page">
      <h1>Base64 to Image</h1>
      <p className="desc">Convert Base64 strings back to images.</p>
      
      <label>Base64 String</label>
      <textarea className="tool-input font-mono text-sm" value={input} onChange={(e) => setInput(e.target.value)} placeholder="data:image/png;base64,..." rows={6} />
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={convert}>🔄 Convert</button>
        <button className="btn" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
      </div>

      {error && <p className="error-text">❌ {error}</p>}

      {output && (
        <>
          <div className="mt-4">
            <img src={output} alt="Decoded" className="max-w-full border rounded" />
          </div>
          <div className="btn-group mt-3">
            <button className="btn btn-primary" onClick={download}>💾 Download</button>
          </div>
        </>
      )}
    </div>
  );
}
