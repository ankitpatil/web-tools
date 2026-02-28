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

      <section className="tool-prose">
        <h2>About the YAML ↔ JSON Converter</h2>
        <p>The YAML ↔ JSON Converter bidirectionally converts between YAML and JSON with validation. Paste YAML to get JSON, or paste JSON to get YAML. Both directions validate the input format and display clear error messages for any syntax issues.</p>
        <p>YAML (YAML Ain&apos;t Markup Language) and JSON are both human-readable data serialization formats, but they serve different audiences. YAML uses indentation and minimal punctuation, making it preferred for configuration files — Kubernetes manifests, Docker Compose files, GitHub Actions workflows, and Ansible playbooks all use YAML. JSON uses explicit braces and quotes, making it preferred for API payloads and programmatic data exchange.</p>
        <p>Converting between them is a frequent task when adapting configuration for different tools or debugging YAML files by inspecting their JSON equivalent. All conversion runs locally in your browser using the js-yaml library — no data is sent to any server.</p>
      </section>
    </div>
  );
}
