"use client";
import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

const FLAG_DESCRIPTIONS: Record<string, string> = {
  g: "Global - find all matches",
  i: "Case insensitive",
  m: "Multiline - ^ and $ match line boundaries",
  s: "Dotall - . matches newlines",
  u: "Unicode - enable Unicode support",
  y: "Sticky - match from lastIndex",
};

const QUICK_REFERENCE = [
  { pattern: ".", desc: "Any character except newline" },
  { pattern: "\\d", desc: "Digit (0-9)" },
  { pattern: "\\w", desc: "Word character (a-z, A-Z, 0-9, _)" },
  { pattern: "\\s", desc: "Whitespace" },
  { pattern: "^", desc: "Start of string/line" },
  { pattern: "$", desc: "End of string/line" },
  { pattern: "*", desc: "0 or more" },
  { pattern: "+", desc: "1 or more" },
  { pattern: "?", desc: "0 or 1" },
  { pattern: "{n}", desc: "Exactly n times" },
  { pattern: "{n,m}", desc: "Between n and m times" },
  { pattern: "[abc]", desc: "Character class" },
  { pattern: "[^abc]", desc: "Negated class" },
  { pattern: "(abc)", desc: "Capturing group" },
  { pattern: "(?:abc)", desc: "Non-capturing group" },
  { pattern: "a|b", desc: "Alternation (or)" },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");
  const [replacement, setReplacement] = useState("");
  const [showRef, setShowRef] = useState(false);

  const { matches, error, highlighted, groups, replaced } = useMemo(() => {
    if (!pattern) return { matches: [], error: "", highlighted: text, groups: [], replaced: "" };
    try {
      const re = new RegExp(pattern, flags);
      const m: { text: string; index: number; groups: string[] }[] = [];
      const g: { match: string; groups: Record<string, string> }[] = [];
      let match;
      const parts: { text: string; isMatch: boolean; groupIndex?: number }[] = [];
      let lastIndex = 0;

      if (flags.includes("g")) {
        while ((match = re.exec(text)) !== null) {
          if (match.index > lastIndex) parts.push({ text: text.slice(lastIndex, match.index), isMatch: false });
          parts.push({ text: match[0], isMatch: true, groupIndex: m.length });
          m.push({ text: match[0], index: match.index, groups: match.slice(1) });
          
          const groupObj: Record<string, string> = {};
          match.forEach((gVal, i) => { if (i > 0) groupObj[`$${i}`] = gVal || ""; });
          if (match.groups) Object.assign(groupObj, match.groups);
          g.push({ match: match[0], groups: groupObj });
          
          lastIndex = re.lastIndex;
          if (!match[0]) re.lastIndex++;
        }
      } else {
        match = re.exec(text);
        if (match) {
          if (match.index > 0) parts.push({ text: text.slice(0, match.index), isMatch: false });
          parts.push({ text: match[0], isMatch: true, groupIndex: 0 });
          m.push({ text: match[0], index: match.index, groups: match.slice(1) });
          
          const groupObj: Record<string, string> = {};
          match.forEach((gVal, i) => { if (i > 0) groupObj[`$${i}`] = gVal || ""; });
          if (match.groups) Object.assign(groupObj, match.groups);
          g.push({ match: match[0], groups: groupObj });
          
          lastIndex = match.index + match[0].length;
        }
      }
      if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex), isMatch: false });

      const replaced = replacement ? text.replace(re, replacement) : "";
      return { matches: m, error: "", highlighted: parts, groups: g, replaced };
    } catch (e: unknown) {
      return { matches: [], error: (e as Error).message, highlighted: text, groups: [], replaced: "" };
    }
  }, [pattern, flags, text, replacement]);

  const explainPattern = (p: string): string[] => {
    const explanations: string[] = [];
    let i = 0;
    while (i < p.length) {
      const char = p[i];
      const next = p[i + 1];
      if (char === "\\" && next) {
        const map: Record<string, string> = {
          d: "Digit (0-9)", D: "Non-digit", w: "Word character", W: "Non-word",
          s: "Whitespace", S: "Non-whitespace", b: "Word boundary", B: "Non-boundary",
          n: "Newline", r: "Carriage return", t: "Tab", 0: "Null character",
        };
        explanations.push(`\\${next} - ${map[next] || "escaped " + next}`);
        i += 2;
      } else if (char === "[") {
        const end = p.indexOf("]", i);
        const content = p.slice(i + 1, end > i + 1 ? end : p.length);
        explanations.push(`[${content}] - Character class${content.startsWith("^") ? " (negated)" : ""}`);
        i = end > i + 1 ? end + 1 : i + 1;
      } else if (char === "(") {
        if (p[i + 1] === "?") {
          if (p[i + 2] === ":") { explanations.push("(?:...) - Non-capturing group"); i += 3; }
          else if (p[i + 2] === "=") { explanations.push("(?=...) - Positive lookahead"); i += 3; }
          else if (p[i + 2] === "!") { explanations.push("(?!...) - Negative lookahead"); i += 3; }
          else if (p[i + 2] === "<" && p[i + 3] === "=") { explanations.push("(?<=...) - Positive lookbehind"); i += 4; }
          else if (p[i + 2] === "<" && p[i + 3] === "!") { explanations.push("(?<!...) - Negative lookbehind"); i += 4; }
          else { i++; }
        } else {
          explanations.push(`(...) - Capturing group #${(p.slice(0, i).match(/\(/g) || []).length + 1}`);
          i++;
        }
      } else if (char === "|") explanations.push("| - Alternation (or)");
      else if (char === "^") explanations.push("^ - Start of string/line");
      else if (char === "$") explanations.push("$ - End of string/line");
      else if (char === ".") explanations.push(". - Any character (except newline)");
      else if (char === "*") explanations.push("* - 0 or more (greedy)");
      else if (char === "+") explanations.push("+ - 1 or more (greedy)");
      else if (char === "?") explanations.push("? - 0 or 1 / makes previous quantifier lazy");
      else if (char === "{") {
        const end = p.indexOf("}", i);
        if (end > i) {
          const quant = p.slice(i + 1, end);
          explanations.push(`{${quant}} - Repeat ${quant} times`);
          i = end + 1;
        } else i++;
      } else {
        i++;
      }
    }
    return explanations;
  };

  return (
    <div className="tool-page">
      <h1>Regex Tester</h1>
      <p className="desc">Test regular expressions with live matching, highlighting, and substitution.</p>
      
      <div className="flex gap-2 mb-3 flex-wrap items-center">
        <span className="font-mono text-lg">/</span>
        <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="pattern" className="flex-1 min-w-[200px] font-mono" />
        <span className="font-mono text-lg">/</span>
        <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="flags" className="w-20 font-mono" />
        <button className="btn" onClick={() => setShowRef(!showRef)}>📖 {showRef ? "Hide" : "Show"} Reference</button>
      </div>

      {showRef && (
        <div className="mb-4 p-3 bg-[var(--card-bg)] border border-[var(--border)] rounded text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {QUICK_REFERENCE.map(r => (
              <div key={r.pattern}><code className="text-[var(--accent)]">{r.pattern}</code> - {r.desc}</div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-2 flex-wrap">
        {Object.entries(FLAG_DESCRIPTIONS).map(([flag, desc]) => (
          <button key={flag} className={`btn text-xs ${flags.includes(flag) ? "btn-primary" : ""}`} onClick={() => setFlags(f => f.includes(flag) ? f.replace(flag, "") : f + flag)} title={desc}>{flag}</button>
        ))}
      </div>

      {error && <p className="error-text">❌ {error}</p>}

      <label>Test String</label>
      <textarea className="tool-input font-mono" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter test string..." rows={5} />
      
      {Array.isArray(highlighted) && highlighted.length > 0 && (
        <div className="output-box mt-3 font-mono whitespace-pre-wrap">
          {highlighted.map((p, i) => p.isMatch ? <mark key={i} className="bg-yellow-300 dark:bg-yellow-600 rounded px-0.5">{p.text}</mark> : <span key={i}>{p.text}</span>)}
        </div>
      )}

      {matches.length > 0 && (
        <div className="mt-3">
          <label className="font-semibold">{matches.length} match{matches.length !== 1 ? "es" : ""}</label>
          <div className="output-box text-sm max-h-40 overflow-auto">
            {matches.map((m, i) => <div key={i} className="font-mono"><span className="text-[var(--text-secondary)]">[{m.index}]</span> {m.text}</div>)}
          </div>
        </div>
      )}

      {groups.length > 0 && groups.some(g => Object.keys(g.groups).length > 0) && (
        <div className="mt-3">
          <label className="font-semibold">Capture Groups</label>
          <div className="output-box text-sm max-h-40 overflow-auto">
            {groups.map((g, i) => (
              <div key={i} className="mb-2">
                <div className="font-mono font-semibold">Match {i + 1}: {g.match}</div>
                {Object.entries(g.groups).map(([k, v]) => (
                  <div key={k} className="ml-2 font-mono text-[var(--text-secondary)]">{k}: {v}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {pattern && (
        <div className="mt-4">
          <label className="font-semibold">Pattern Explanation</label>
          <div className="output-box text-sm">
            {explainPattern(pattern).map((exp, i) => <div key={i}>{exp}</div>)}
          </div>
        </div>
      )}

      <div className="mt-4">
        <label>Substitution (replace with)</label>
        <input type="text" value={replacement} onChange={(e) => setReplacement(e.target.value)} placeholder="Replacement string (use $1, $2, $&)" className="tool-input font-mono" />
        {replaced && (
          <div className="mt-2">
            <div className="btn-group"><CopyButton text={replaced} /></div>
            <div className="output-box font-mono mt-2">{replaced}</div>
          </div>
        )}
      </div>
    </div>
  );
}
