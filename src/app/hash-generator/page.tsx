"use client";


import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

async function hash(algo: string, text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const algos = [
  { name: "SHA-1", id: "SHA-1" },
  { name: "SHA-256", id: "SHA-256" },
  { name: "SHA-384", id: "SHA-384" },
  { name: "SHA-512", id: "SHA-512" },
];

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});

  const generate = async () => {
    const r: Record<string, string> = {};
    for (const a of algos) {
      r[a.name] = await hash(a.id, input);
    }
    setResults(r);
  };

  return (
    <div className="tool-page">
      <h1>Hash Generator</h1>
      <p className="desc">Generate cryptographic hashes using the Web Crypto API.</p>
      <textarea className="tool-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to hash..." />
      <div className="btn-group">
        <button className="btn btn-primary" onClick={generate}>Generate Hashes</button>
        <button className="btn" onClick={() => { setInput(""); setResults({}); }}>Clear</button>
      </div>
      {Object.entries(results).map(([name, val]) => (
        <div key={name} className="mt-3">
          <div className="flex items-center gap-2">
            <label>{name}</label>
            <CopyButton text={val} />
          </div>
          <div className="output-box text-sm" style={{ minHeight: "auto" }}>{val}</div>
        </div>
      ))}
    </div>
  );
}
