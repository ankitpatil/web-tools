"use client";


import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encodeComponent" | "decodeComponent" | "encodeURI" | "decodeURI">("encodeComponent");

  const convert = () => {
    try {
      const fns = { encodeComponent: encodeURIComponent, decodeComponent: decodeURIComponent, encodeURI: encodeURI, decodeURI: decodeURI };
      setOutput(fns[mode](input));
    } catch {
      setOutput("Invalid input");
    }
  };

  return (
    <div className="tool-page">
      <h1>URL Encoder / Decoder</h1>
      <p className="desc">Encode or decode URLs and URL components.</p>
      <div className="btn-group">
        {(["encodeComponent", "decodeComponent", "encodeURI", "decodeURI"] as const).map((m) => (
          <button key={m} className={`btn ${mode === m ? "btn-primary" : ""}`} onClick={() => setMode(m)}>{m}</button>
        ))}
      </div>
      <textarea className="tool-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text or URL..." />
      <div className="btn-group">
        <button className="btn btn-primary" onClick={convert}>Convert</button>
        <button className="btn" onClick={() => { setInput(""); setOutput(""); }}>Clear</button>
        <CopyButton text={output} />
      </div>
      {output && <div className="output-box">{output}</div>}

      <section className="tool-prose">
        <h2>About the URL Encoder / Decoder</h2>
        <p>The URL Encoder/Decoder encodes special characters in URLs using percent-encoding (e.g., space becomes <code>%20</code>) and decodes percent-encoded strings back to plain text. Supports both full URL encoding and component-level encoding for query parameters.</p>
        <p>URL encoding (also called percent-encoding) is required by the HTTP specification: URLs may only contain a restricted set of ASCII characters. Any character outside that set — spaces, ampersands, equal signs, Unicode characters — must be encoded as a percent sign followed by two hexadecimal digits. This is essential when constructing query strings, embedding URLs in other URLs, or generating API request parameters programmatically.</p>
        <p><code>encodeURIComponent()</code> encodes everything except letters, digits, and <code>-_.!~*&apos;()</code>, making it ideal for encoding individual query parameter values. <code>encodeURI()</code> preserves structural characters like <code>/</code>, <code>?</code>, and <code>&amp;</code>. All encoding and decoding runs locally in your browser.</p>
      </section>
    </div>
  );
}
