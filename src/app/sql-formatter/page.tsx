"use client";
import { useState } from "react";
import { format } from "sql-formatter";
import { CopyButton } from "@/components/CopyButton";

export default function SqlFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [lang, setLang] = useState<"sql" | "mysql" | "postgresql">("sql");

  const fmt = () => {
    try {
      setOutput(format(input, { language: lang }));
      setError("");
    } catch (e: unknown) { setError((e as Error).message); }
  };

  return (
    <div className="tool-page">
      <h1>SQL Formatter</h1>
      <p className="desc">Format and beautify SQL queries.</p>
      <div className="btn-group items-center">
        <label>Dialect:</label>
        <select value={lang} onChange={(e) => setLang(e.target.value as typeof lang)}>
          <option value="sql">Standard SQL</option>
          <option value="mysql">MySQL</option>
          <option value="postgresql">PostgreSQL</option>
        </select>
      </div>
      <textarea className="tool-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="SELECT * FROM users WHERE id = 1" />
      <div className="btn-group">
        <button className="btn btn-primary" onClick={fmt}>Format</button>
        <button className="btn" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
        <CopyButton text={output} />
      </div>
      {error && <p className="error-text">❌ {error}</p>}
      {output && <div className="output-box">{output}</div>}
    </div>
  );
}
