"use client";


import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export default function JsonToCsv() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      const parsed = JSON.parse(input);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      if (arr.length === 0) { setError("No data to convert"); return; }
      
      const flatten = (obj: any, prefix = ""): Record<string, string> => {
        const result: Record<string, string> = {};
        for (const key in obj) {
          const newKey = prefix ? `${prefix}.${key}` : key;
          if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(result, flatten(obj[key], newKey));
          } else {
            result[newKey] = String(obj[key] ?? "");
          }
        }
        return result;
      };
      
      const flat = arr.map(item => flatten(item));
      const headers = [...new Set(flat.flatMap(row => Object.keys(row)))];
      const csv = [
        headers.map(h => `"${h}"`).join(","),
        ...flat.map(row => headers.map(h => `"${(row[h] || "").replace(/"/g, '""')}"`).join(","))
      ].join("\n");
      
      setOutput(csv);
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
  };

  return (
    <div className="tool-page">
      <h1>JSON to CSV Converter</h1>
      <p className="desc">Convert JSON array to CSV format.</p>
      
      <label>Input JSON</label>
      <textarea className="tool-input font-mono text-sm" value={input} onChange={(e) => setInput(e.target.value)} placeholder='[{"name": "John", "age": 30}]' rows={8} />
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={convert}>🔄 Convert to CSV</button>
        <button className="btn" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
      </div>

      {error && <p className="error-text">❌ {error}</p>}
      {output && <div className="output-box font-mono text-sm whitespace-pre-wrap">{output}</div>}
      {output && <div className="btn-group mt-3"><CopyButton text={output} /><button className="btn" onClick={download}>💾 Download</button></div>}
    </div>
  );
}
