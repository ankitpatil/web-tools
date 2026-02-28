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

      <section className="tool-prose">
        <h2>About the Text Diff Tool</h2>
        <p>The Text Diff tool compares two blocks of text and highlights the differences line by line. Paste the original text on the left and the modified text on the right to see additions, deletions, and unchanged lines clearly distinguished by color.</p>
        <p>Text comparison is essential in many workflows: reviewing changes between two versions of a document, comparing configuration files before and after a change, verifying that a code transformation produced the expected output, or spotting unintended edits in contract language. A visual line-by-line diff is far faster than manual inspection.</p>
        <p>This tool uses the diff library, the same underlying algorithm used by Git, to compute the shortest edit distance between the two texts. All comparison runs locally in your browser — no text is sent to any server, making it safe to compare confidential documents or private code.</p>
      </section>
    </div>
  );
}
