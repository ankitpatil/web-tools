"use client";


import { useState } from "react";
import yaml from "js-yaml";
import { CopyButton } from "@/components/CopyButton";

export default function YamlJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const toJson = () => {
    try {
      const parsed = yaml.load(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e: unknown) { setError((e as Error).message); setOutput(""); }
  };

  const toYaml = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(yaml.dump(parsed));
      setError("");
    } catch (e: unknown) { setError((e as Error).message); setOutput(""); }
  };

  return (
    <div className="tool-page">
      <h1>YAML ↔ JSON Converter</h1>
      <p className="desc">Convert between YAML and JSON formats.</p>
      <textarea className="tool-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste YAML or JSON here..." />
      <div className="btn-group">
        <button className="btn btn-primary" onClick={toJson}>YAML → JSON</button>
        <button className="btn btn-primary" onClick={toYaml}>JSON → YAML</button>
        <button className="btn" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
        <CopyButton text={output} />
      </div>
      {error && <p className="error-text">❌ {error}</p>}
      {output && <div className="output-box">{output}</div>}
    </div>
  );
}
