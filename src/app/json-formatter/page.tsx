"use client";


import { useState, useRef } from "react";
import { CopyButton } from "@/components/CopyButton";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState<"text" | "tree">("text");
  const [treeExpanded, setTreeExpanded] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInput(ev.target?.result as string);
      format(2);
    };
    reader.readAsText(file);
  };

  const download = () => {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const jsonToCsv = () => {
    try {
      const parsed = JSON.parse(output);
      const flatten = (obj: any, prefix = ""): Record<string, string> => {
        const result: Record<string, string> = {};
        for (const key in obj) {
          const newKey = prefix ? `${prefix}.${key}` : key;
          if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(result, flatten(obj[key], newKey));
          } else {
            result[newKey] = String(obj[key]);
          }
        }
        return result;
      };
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const flat = arr.map(item => flatten(item));
      if (flat.length === 0) { setError("No data to convert"); return; }
      const headers = Object.keys(flat[0]);
      const csv = [headers.join(","), ...flat.map(row => headers.map(h => `"${(row[h] || "").replace(/"/g, '""')}"`).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { setError("Failed to convert to CSV"); }
  };

  const jsonToXml = () => {
    try {
      const parsed = JSON.parse(output);
      const toXml = (obj: any, tag = "root"): string => {
        if (typeof obj === "object" && obj !== null) {
          if (Array.isArray(obj)) {
            return obj.map((item, i) => toXml(item, `${tag}_item`)).join("");
          }
          return `<${tag}>${Object.entries(obj).map(([k, v]) => toXml(v, k)).join("")}</${tag}>`;
        }
        return `<${tag}>${String(obj).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</${tag}>`;
      };
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(parsed)}`;
      const blob = new Blob([xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.xml";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) { setError("Failed to convert to XML"); }
  };

  const renderTree = (data: any, path = ""): React.ReactNode => {
    const isExpanded = treeExpanded[path] ?? true;
    const toggle = () => setTreeExpanded(prev => ({ ...prev, [path]: !isExpanded }));
    
    if (data === null) return <span className="text-yellow-500">null</span>;
    if (typeof data === "boolean") return <span className="text-purple-500">{String(data)}</span>;
    if (typeof data === "number") return <span className="text-green-500">{data}</span>;
    if (typeof data === "string") return <span className="text-blue-500">"{data}"</span>;
    
    if (Array.isArray(data)) {
      return (
        <span>
          <span className="cursor-pointer text-gray-500" onClick={toggle}>[{isExpanded ? "▼" : "▶"}]</span>
          {isExpanded && <span className="ml-2">{data.map((item, i) => <div key={i} className="ml-4">{renderTree(item, `${path}.${i}`)}</div>)}</span>}
        </span>
      );
    }
    
    if (typeof data === "object") {
      const entries = Object.entries(data);
      return (
        <span>
          <span className="cursor-pointer text-gray-500" onClick={toggle}>{`{${isExpanded ? "▼" : "▶"}}`}</span>
          {isExpanded && <span className="ml-2">{entries.map(([k, v]) => <div key={k} className="ml-4"><span className="text-red-500">"{k}"</span>: {renderTree(v, `${path}.${k}`)}</div>)}</span>}
        </span>
      );
    }
    return <span>{String(data)}</span>;
  };

  return (
    <div className="tool-page">
      <h1>JSON Formatter & Validator</h1>
      <p className="desc">Format, minify, validate, convert JSON to CSV/XML, or view as tree.</p>
      
      <div className="btn-group mb-3">
        <button className="btn" onClick={() => fileInputRef.current?.click()}>📁 Upload File</button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
      </div>

      <label>Input JSON</label>
      <textarea className="tool-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"key": "value"}' rows={8} />
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={() => format(2)}>Format (2 spaces)</button>
        <button className="btn" onClick={() => format(4)}>Format (4 spaces)</button>
        <button className="btn" onClick={() => format(null)}>Minify</button>
        <button className="btn" onClick={() => setView(view === "text" ? "tree" : "text")}>{view === "text" ? "🌳 Tree View" : "📄 Text View"}</button>
        <button className="btn" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
      </div>

      {error && <p className="error-text">❌ {error}</p>}

      {output && (
        <>
          {view === "text" ? (
            <div className="output-box">{output}</div>
          ) : (
            <div className="output-box font-mono text-sm whitespace-pre-wrap">{renderTree(JSON.parse(output))}</div>
          )}
          <div className="btn-group mt-3">
            <CopyButton text={output} />
            <button className="btn" onClick={download}>💾 Download JSON</button>
            <button className="btn" onClick={jsonToCsv}>📊 JSON to CSV</button>
            <button className="btn" onClick={jsonToXml}>📋 JSON to XML</button>
          </div>
        </>
      )}

      <section className="tool-prose">
        <h2>About the JSON Formatter & Validator</h2>
        <p>The JSON Formatter and Validator instantly beautifies, validates, and minifies JSON data right in your browser. Paste any JSON string to check its syntax, apply 2- or 4-space indentation, or strip whitespace for a compact output. It also converts JSON to CSV or XML with a single click.</p>
        <p>JSON (JavaScript Object Notation) is the most widely used data format for APIs, configuration files, and data storage. Readable, well-formatted JSON accelerates debugging and speeds up code review. Malformed JSON — a missing comma, an unquoted key — can silently break an application, making instant validation essential.</p>
        <p>Everything runs 100% in your browser using native JavaScript. No JSON data is ever uploaded or sent to a server. You can format confidential API responses, production database exports, or private config files safely.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What is JSON?</summary>
          <p>JSON (JavaScript Object Notation) is a lightweight text format for storing and exchanging structured data. It uses key-value pairs and supports strings, numbers, booleans, arrays, and nested objects. It&apos;s the standard format for REST APIs and configuration files.</p>
        </details>
        <details>
          <summary>What&apos;s the difference between pretty print and minified JSON?</summary>
          <p>Pretty-printed JSON has indentation and newlines that make it readable for humans. Minified JSON removes all whitespace, reducing file size. Both are semantically identical — a JSON parser treats them the same way.</p>
        </details>
        <details>
          <summary>Is my JSON data safe?</summary>
          <p>Yes. All formatting and validation runs entirely in your browser using JavaScript. No data is sent to any server at any point.</p>
        </details>
        <details>
          <summary>Can this tool fix invalid JSON?</summary>
          <p>This tool validates JSON and shows where errors occur, but it does not automatically repair malformed JSON. If your JSON is invalid, the error message will indicate the position of the issue so you can fix it manually.</p>
        </details>
        <details>
          <summary>What is JSON tree view?</summary>
          <p>Tree view renders your JSON as a collapsible, explorable hierarchy rather than raw text. It&apos;s useful for navigating deeply nested objects or large arrays without having to scroll through a wall of text.</p>
        </details>
      </section>
    </div>
  );
}
