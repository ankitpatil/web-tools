"use client";
import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = (indent: number | null) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(indent === null ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  return (
    <div className="tool-page">
      <h1>JSON Formatter & Validator</h1>
      <p className="desc">Format, minify, and validate JSON with error highlighting.</p>
      <label>Input JSON</label>
      <textarea className="tool-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"key": "value"}' />
      <div className="btn-group">
        <button className="btn btn-primary" onClick={() => format(2)}>Format (2 spaces)</button>
        <button className="btn" onClick={() => format(4)}>Format (4 spaces)</button>
        <button className="btn" onClick={() => format(null)}>Minify</button>
        <button className="btn" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
        <CopyButton text={output} />
      </div>
      {error && <p className="error-text">❌ {error}</p>}
      {output && <div className="output-box">{output}</div>}
    </div>
  );
}
