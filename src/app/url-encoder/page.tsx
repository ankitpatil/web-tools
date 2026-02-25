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
    </div>
  );
}
