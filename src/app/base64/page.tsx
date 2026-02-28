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

      <section className="tool-prose">
        <h2>About the Base64 Encoder / Decoder</h2>
        <p>The Base64 encoder and decoder converts text or binary data to and from Base64 format instantly in your browser. Paste a plain-text string to encode it, or paste a Base64 string to decode it back to readable text. You can also upload a file to encode its binary content.</p>
        <p>Base64 is a binary-to-text encoding scheme that represents binary data using 64 printable ASCII characters. It is widely used to embed binary files — images, fonts, PDFs — directly into HTML, CSS, or JSON payloads, and to safely transmit data in environments that only support text, like HTTP headers and email attachments. HTTP Basic Auth credentials are Base64-encoded before being sent in the Authorization header.</p>
        <p>Note that Base64 is an encoding, not encryption — the encoded output can be trivially decoded by anyone. Never use Base64 as a security measure. All processing runs locally in your browser; no data is sent to any server.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What is Base64 encoding?</summary>
          <p>Base64 is an encoding scheme that converts binary data to a string of 64 printable ASCII characters (A–Z, a–z, 0–9, +, /). It&apos;s used to safely transmit binary data through text-only channels like email, HTTP headers, and JSON.</p>
        </details>
        <details>
          <summary>Is Base64 the same as encryption?</summary>
          <p>No. Base64 is encoding, not encryption. Anyone can decode a Base64 string without a key. Never use Base64 to protect sensitive data — use proper encryption (AES, RSA) instead.</p>
        </details>
        <details>
          <summary>When should I use Base64?</summary>
          <p>Use Base64 when you need to embed binary data in a text context: images in HTML/CSS (<code>data:image/png;base64,...</code>), Basic Auth credentials in HTTP headers, or binary payloads in JSON APIs that don&apos;t support multipart encoding.</p>
        </details>
        <details>
          <summary>Is my data safe when using this tool?</summary>
          <p>Yes. All encoding and decoding runs entirely in your browser. Nothing is sent to any server at any point.</p>
        </details>
        <details>
          <summary>What is the difference between Base64 and Base64URL?</summary>
          <p>Base64URL replaces <code>+</code> with <code>-</code> and <code>/</code> with <code>_</code>, and omits padding (<code>=</code>). It&apos;s used in JWTs, URL-safe tokens, and file names. Standard Base64 uses <code>+</code> and <code>/</code> which require percent-encoding in URLs.</p>
        </details>
      </section>
    </div>
  );
}
