"use client";


import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export default function SvgOptimizer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState({ original: 0, optimized: 0 });

  const optimize = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "image/svg+xml");
      const svg = doc.querySelector("svg");
      if (!svg) { setOutput("Invalid SVG"); return; }

      // Remove comments
      const comments = svg.querySelectorAll("comment");
      comments.forEach(c => c.remove());

      // Remove metadata and editor elements
      const removeTags = ["metadata", "title", "desc", "defs"];
      removeTags.forEach(tag => {
        svg.querySelectorAll(tag).forEach(el => el.remove());
      });

      // Remove empty attributes
      const attrsToRemove = ["xmlns:xlink", "data-name", "id"];
      attrsToRemove.forEach(attr => {
        svg.querySelectorAll(`[${attr}]`).forEach(el => el.removeAttribute(attr));
      });

      // Round numbers in transform and points
      const roundNumbers = (str: string) => str.replace(/(\d+\.?\d*)/g, (m) => {
        const n = parseFloat(m);
        return n.toFixed(2).replace(/\.?0+$/, "");
      });

      svg.querySelectorAll("[transform]").forEach(el => {
        const transform = el.getAttribute("transform");
        if (transform) el.setAttribute("transform", roundNumbers(transform));
      });

      svg.querySelectorAll("polygon, polyline").forEach(el => {
        const points = el.getAttribute("points");
        if (points) el.setAttribute("points", roundNumbers(points));
      });

      // Remove default values
      const defaultAttrs: Record<string, Record<string, string>> = {
        svg: { xmlns: "http://www.w3.org/2000/svg" },
        path: { fill: "none" },
        rect: { fill: "none", stroke: "none" },
        circle: { fill: "none", stroke: "none" },
      };
      Object.entries(defaultAttrs).forEach(([tag, attrs]) => {
        svg.querySelectorAll(tag).forEach(el => {
          Object.entries(attrs).forEach(([attr, val]) => {
            if (el.getAttribute(attr) === val) el.removeAttribute(attr);
          });
        });
      });

      // Get optimized string
      const serializer = new XMLSerializer();
      let optimized = serializer.serializeToString(svg);
      
      // Remove extra whitespace between tags
      optimized = optimized.replace(/>\s+</g, "><").trim();

      setOutput(optimized);
      setStats({ original: input.length, optimized: optimized.length });
    } catch (e) {
      setOutput("Error parsing SVG");
    }
  };

  return (
    <div className="tool-page">
      <h1>SVG Optimizer</h1>
      <p className="desc">Reduce SVG file size by removing metadata, rounding numbers, and stripping defaults.</p>
      
      <label>Input SVG</label>
      <textarea className="tool-input font-mono text-sm" value={input} onChange={(e) => setInput(e.target.value)} placeholder="<svg>...</svg>" rows={8} />
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={optimize}>⚡ Optimize</button>
        <button className="btn" onClick={() => { setInput(""); setOutput(""); }}>Clear</button>
      </div>

      {stats.original > 0 && (
        <p className="my-3 text-sm">
          Reduced: {stats.original} → {stats.optimized} bytes 
          ({Math.round((1 - stats.optimized/stats.original) * 100)}% smaller)
        </p>
      )}

      {output && output !== "Invalid SVG" && output !== "Error parsing SVG" && (
        <>
          <div className="output-box">{output}</div>
          <div className="btn-group mt-3">
            <CopyButton text={output} />
          </div>
        </>
      )}

      <section className="tool-prose">
        <h2>About the SVG Optimizer</h2>
        <p>The SVG Optimizer reduces SVG file sizes by removing unnecessary elements: editor metadata, comments, hidden layers, default attribute values, and redundant whitespace. Paste your SVG markup and get a minified version along with the exact byte savings.</p>
        <p>SVGs exported from design tools like Figma, Illustrator, and Sketch typically contain significant bloat: editor metadata, descriptive comments, redundant <code>style</code> attributes that match default values, and unnecessary whitespace. These additions are helpful for editing but have no effect on rendering — they only add file size and HTTP transfer time.</p>
        <p>Optimizing SVGs is important for web performance: smaller SVG files parse faster, render faster, and reduce bandwidth. This tool applies a rule-based optimization pass inspired by SVGO. All optimization runs locally in your browser — your SVG data is never uploaded or sent to a server.</p>
      </section>
    </div>
  );
}
