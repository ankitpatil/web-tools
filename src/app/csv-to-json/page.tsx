"use client";


import { useState, useRef } from "react";
import { CopyButton } from "@/components/CopyButton";

export default function CsvToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convert = () => {
    try {
      const lines = input.trim().split("\n");
      if (lines.length < 2) { setError("Need at least header + 1 data row"); return; }
      const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ""));
      const data = lines.slice(1).map(line => {
        const values = line.split(delimiter);
        const row: Record<string, string> = {};
        headers.forEach((h, i) => {
          let val = values[i]?.trim() || "";
          val = val.replace(/^"|"$/g, "");
          row[h] = val;
        });
        return row;
      });
      setOutput(JSON.stringify(data, null, 2));
      setError("");
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setInput(ev.target?.result as string); };
    reader.readAsText(file);
  };

  const download = () => {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
  };

  return (
    <div className="tool-page">
      <h1>CSV to JSON Converter</h1>
      <p className="desc">Convert CSV data to JSON array.</p>
      
      <div className="btn-group mb-3">
        <button className="btn" onClick={() => fileInputRef.current?.click()}>📁 Upload CSV</button>
        <input ref={fileInputRef} type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
        <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="btn">
          <option value=",">Comma</option>
          <option value=";">Semicolon</option>
          <option value="\t">Tab</option>
        </select>
      </div>

      <label>Input CSV</label>
      <textarea className="tool-input font-mono text-sm" value={input} onChange={(e) => setInput(e.target.value)} placeholder="name,email,age&#10;John,john@email.com,30" rows={8} />
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={convert}>🔄 Convert to JSON</button>
        <button className="btn" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
      </div>

      {error && <p className="error-text">❌ {error}</p>}
      {output && <div className="output-box">{output}</div>}
      {output && <div className="btn-group mt-3"><CopyButton text={output} /><button className="btn" onClick={download}>💾 Download</button></div>}

      <section className="tool-prose">
        <h2>About the CSV to JSON Converter</h2>
        <p>The CSV to JSON Converter transforms comma-separated values (CSV) data into a JSON array of objects. Paste your CSV — including the header row — and get a clean, formatted JSON output instantly. Ideal for importing data into JavaScript applications, REST APIs, or NoSQL databases.</p>
        <p>CSV is the most common format for data exported from spreadsheets (Excel, Google Sheets) and relational databases. JSON is the standard format for web APIs and modern data pipelines. Converting between them is a frequent task when migrating data, seeding a database, or feeding data into a front-end application.</p>
        <p>The converter uses the first row as the field names for each JSON object. All conversion runs locally in your browser — no CSV data is uploaded or sent to any server. For large files, you can paste the content directly without any upload size limits.</p>
      </section>
    </div>
  );
}
