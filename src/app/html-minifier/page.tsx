"use client";


import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

function minifyHTML(s: string): string {
  return s.replace(/\s+/g, " ").replace(/>\s+</g, "><").replace(/<!--[\s\S]*?-->/g, "").trim();
}
function minifyCSS(s: string): string {
  return s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,])\s*/g, "$1").replace(/;}/g, "}").trim();
}
function minifyJS(s: string): string {
  return s.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}();,=+\-*/<>!&|?:])\s*/g, "$1").trim();
}

export default function HtmlMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [type, setType] = useState<"html" | "css" | "js">("html");

  const minify = () => {
    const fns = { html: minifyHTML, css: minifyCSS, js: minifyJS };
    setOutput(fns[type](input));
  };

  const origSize = new Blob([input]).size;
  const minSize = new Blob([output]).size;
  const saved = origSize > 0 ? ((1 - minSize / origSize) * 100).toFixed(1) : "0";

  return (
    <div className="tool-page">
      <h1>HTML / CSS / JS Minifier</h1>
      <p className="desc">Minify code and see size comparison.</p>
      <div className="btn-group">
        {(["html", "css", "js"] as const).map((t) => (
          <button key={t} className={`btn ${type === t ? "btn-primary" : ""}`} onClick={() => setType(t)}>{t.toUpperCase()}</button>
        ))}
      </div>
      <textarea className="tool-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Paste ${type.toUpperCase()} here...`} />
      <div className="btn-group">
        <button className="btn btn-primary" onClick={minify}>Minify</button>
        <button className="btn" onClick={() => { setInput(""); setOutput(""); }}>Clear</button>
        <CopyButton text={output} />
      </div>
      {output && (
        <>
          <p className="text-sm text-[var(--text-secondary)] my-2">
            Original: {origSize}B → Minified: {minSize}B ({saved}% saved)
          </p>
          <div className="output-box">{output}</div>
        </>
      )}
    </div>
  );
}
