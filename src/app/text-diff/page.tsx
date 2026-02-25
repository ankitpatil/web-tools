"use client";


import { useState } from "react";
import { diffLines } from "diff";

export default function TextDiff() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [result, setResult] = useState<{ value: string; added?: boolean; removed?: boolean }[]>([]);

  const compare = () => setResult(diffLines(text1, text2));

  return (
    <div className="tool-page">
      <h1>Text Diff / Compare</h1>
      <p className="desc">Compare two texts and see differences highlighted.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label>Original</label>
          <textarea className="tool-input" value={text1} onChange={(e) => setText1(e.target.value)} placeholder="Original text..." />
        </div>
        <div>
          <label>Modified</label>
          <textarea className="tool-input" value={text2} onChange={(e) => setText2(e.target.value)} placeholder="Modified text..." />
        </div>
      </div>
      <div className="btn-group">
        <button className="btn btn-primary" onClick={compare}>Compare</button>
        <button className="btn" onClick={() => { setText1(""); setText2(""); setResult([]); }}>Clear</button>
      </div>
      {result.length > 0 && (
        <div className="output-box mt-3">
          {result.map((part, i) => (
            <span key={i} className={part.added ? "bg-green-200 dark:bg-green-900" : part.removed ? "bg-red-200 dark:bg-red-900" : ""}>
              {part.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
