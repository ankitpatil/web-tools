"use client";
import { useState, useMemo } from "react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");

  const { matches, error, highlighted } = useMemo(() => {
    if (!pattern) return { matches: [], error: "", highlighted: text };
    try {
      const re = new RegExp(pattern, flags);
      const m: string[] = [];
      let match;
      const parts: { text: string; isMatch: boolean }[] = [];
      let lastIndex = 0;

      if (flags.includes("g")) {
        while ((match = re.exec(text)) !== null) {
          if (match.index > lastIndex) parts.push({ text: text.slice(lastIndex, match.index), isMatch: false });
          parts.push({ text: match[0], isMatch: true });
          m.push(`[${match.index}] ${match[0]}`);
          lastIndex = re.lastIndex;
          if (!match[0]) re.lastIndex++;
        }
      } else {
        match = re.exec(text);
        if (match) {
          if (match.index > 0) parts.push({ text: text.slice(0, match.index), isMatch: false });
          parts.push({ text: match[0], isMatch: true });
          m.push(`[${match.index}] ${match[0]}`);
          lastIndex = match.index + match[0].length;
        }
      }
      if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex), isMatch: false });
      return { matches: m, error: "", highlighted: parts };
    } catch (e: unknown) {
      return { matches: [], error: (e as Error).message, highlighted: text };
    }
  }, [pattern, flags, text]);

  return (
    <div className="tool-page">
      <h1>Regex Tester</h1>
      <p className="desc">Test regular expressions with live matching and highlighting.</p>
      <div className="flex gap-2 mb-3 flex-wrap items-center">
        <span className="font-mono">/</span>
        <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="pattern" className="flex-1 min-w-[200px]" />
        <span className="font-mono">/</span>
        <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="flags" className="w-20" />
      </div>
      {error && <p className="error-text">❌ {error}</p>}
      <label>Test String</label>
      <textarea className="tool-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter test string..." />
      {Array.isArray(highlighted) && highlighted.length > 0 && (
        <div className="output-box mt-3">
          {highlighted.map((p, i) =>
            p.isMatch ? <mark key={i} className="bg-yellow-300 dark:bg-yellow-600 rounded px-0.5">{p.text}</mark> : <span key={i}>{p.text}</span>
          )}
        </div>
      )}
      {matches.length > 0 && (
        <div className="mt-3">
          <label>{matches.length} match{matches.length !== 1 ? "es" : ""}</label>
          <div className="output-box text-sm">{matches.join("\n")}</div>
        </div>
      )}
    </div>
  );
}
