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

      <section className="tool-prose">
        <h2>About the HTML / CSS / JS Minifier</h2>
        <p>The HTML/CSS/JS Minifier removes whitespace, comments, and unnecessary characters from your code to reduce file size and improve page load speed. Paste your HTML, CSS, or JavaScript, select the type, and click Minify to see the compressed output alongside the exact byte savings.</p>
        <p>Minification is a standard step in modern web production pipelines. Smaller files transfer faster over the network and reduce both Time to First Byte (TTFB) and Total Blocking Time (TBT) — two Core Web Vitals that directly affect Google search ranking. CSS minification removes comments and collapses whitespace; JavaScript minification additionally removes semicolons and shortens code where possible.</p>
        <p>For production workflows, minification is typically automated via bundlers like Webpack or Vite. This tool is ideal for quick one-off minification, verifying minifier output, or working with standalone files outside of a build pipeline. All processing runs locally in your browser.</p>
      </section>
    </div>
  );
}
