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

      <section className="tool-prose">
        <h2>About the Base64 to Image Converter</h2>
        <p>The Base64 to Image converter decodes a Base64-encoded image string back into a viewable image and lets you download it as a file. Paste a complete data URI (<code>data:image/png;base64,...</code>) or just the raw Base64 string to preview and download the image.</p>
        <p>Base64 image strings appear frequently in API responses, CSS stylesheets, HTML source code, and database records where binary image data is stored as text. Decoding them back to viewable images is useful for debugging API payloads, inspecting CSS sprites, or recovering images embedded in source code.</p>
        <p>This tool supports all common image formats encoded as Base64: JPEG, PNG, GIF, WebP, and SVG. All decoding runs locally in your browser — no Base64 data is sent to any server, making it safe to decode confidential or internal images.</p>
      </section>
    </div>
  );
}
