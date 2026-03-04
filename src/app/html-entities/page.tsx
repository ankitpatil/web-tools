"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

type Mode = "encode" | "decode";
type EncodeStyle = "named" | "decimal" | "hex";

// Named entities map for common characters
const NAMED: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  "©": "&copy;", "®": "&reg;", "™": "&trade;", "€": "&euro;", "£": "&pound;",
  "¥": "&yen;", "°": "&deg;", "±": "&plusmn;", "×": "&times;", "÷": "&divide;",
  "½": "&frac12;", "¼": "&frac14;", "¾": "&frac34;", "…": "&hellip;",
  "—": "&mdash;", "–": "&ndash;", " ": "&nbsp;", "«": "&laquo;", "»": "&raquo;",
  "→": "&rarr;", "←": "&larr;", "↑": "&uarr;", "↓": "&darr;", "↔": "&harr;",
  "♠": "&spades;", "♣": "&clubs;", "♥": "&hearts;", "♦": "&diams;",
  "∞": "&infin;", "√": "&radic;", "∑": "&sum;", "∫": "&int;", "≠": "&ne;",
  "≤": "&le;", "≥": "&ge;", "α": "&alpha;", "β": "&beta;", "γ": "&gamma;",
  "δ": "&delta;", "π": "&pi;", "μ": "&mu;", "σ": "&sigma;", "Ω": "&Omega;",
};

const REVERSE_NAMED: Record<string, string> = Object.fromEntries(
  Object.entries(NAMED).map(([k, v]) => [v, k])
);

function encodeEntities(text: string, style: EncodeStyle): string {
  return text.split("").map((ch) => {
    const code = ch.codePointAt(0)!;
    if (style === "named" && NAMED[ch]) return NAMED[ch];
    if (ch === "&") return style === "named" ? "&amp;" : style === "decimal" ? "&#38;" : "&#x26;";
    if (ch === "<") return style === "named" ? "&lt;" : style === "decimal" ? "&#60;" : "&#x3C;";
    if (ch === ">") return style === "named" ? "&gt;" : style === "decimal" ? "&#62;" : "&#x3E;";
    if (ch === '"') return style === "named" ? "&quot;" : style === "decimal" ? "&#34;" : "&#x22;";
    if (code > 127) {
      if (style === "decimal") return `&#${code};`;
      if (style === "hex") return `&#x${code.toString(16).toUpperCase()};`;
      if (style === "named" && NAMED[ch]) return NAMED[ch];
      return `&#${code};`;
    }
    return ch;
  }).join("");
}

function decodeEntities(html: string): string {
  // Named entities
  let out = html.replace(/&[a-zA-Z]+;/g, (m) => REVERSE_NAMED[m] ?? m);
  // Decimal numeric
  out = out.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)));
  // Hex numeric
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)));
  return out;
}

// Highlight changed characters in encode output
function getChangedPairs(text: string, style: EncodeStyle): { original: string; encoded: string }[] {
  const seen = new Set<string>();
  const pairs: { original: string; encoded: string }[] = [];
  for (const ch of text) {
    const enc = encodeEntities(ch, style);
    if (enc !== ch && !seen.has(ch)) {
      seen.add(ch);
      pairs.push({ original: ch, encoded: enc });
    }
  }
  return pairs;
}

const EXAMPLES = [
  { label: "HTML chars", text: '<div class="box">Hello & "World" <br/> it\'s fine</div>' },
  { label: "Special symbols", text: "© 2024 Company™ — All rights reserved. €99.99 × 3 = €299.97" },
  { label: "Math & Greek", text: "∑(α + β) = π × r² ≠ ∞ and √2 ≈ 1.414" },
  { label: "Arrows & cards", text: "→ ← ↑ ↓ ♠ ♣ ♥ ♦" },
];

const DECODE_EXAMPLES = [
  { label: "Named", text: "&lt;div&gt;Hello &amp; &quot;World&quot;&lt;/div&gt;" },
  { label: "Decimal", text: "&#60;div&#62;&#169; 2024 &#8212; All rights reserved&#46;&#60;/div&#62;" },
  { label: "Mixed", text: "&copy; 2024 &mdash; Price: &euro;99&period;99 &amp; &lt;free shipping&gt;" },
];

export default function HtmlEntities() {
  const [mode, setMode]         = useState<Mode>("encode");
  const [style, setStyle]       = useState<EncodeStyle>("named");
  const [input, setInput]       = useState(EXAMPLES[0].text);

  const output = useMemo(() => {
    if (!input) return "";
    return mode === "encode" ? encodeEntities(input, style) : decodeEntities(input);
  }, [input, mode, style]);

  const changedPairs = useMemo(() => {
    if (mode !== "encode") return [];
    return getChangedPairs(input, style);
  }, [input, mode, style]);

  return (
    <div className="tool-page">
      <h1>HTML Entity Encoder / Decoder</h1>
      <p className="desc">Encode text to HTML entities and decode HTML entities back to plain text. Supports named, decimal, and hexadecimal entity formats.</p>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <div className="btn-group">
          <button className={`btn ${mode === "encode" ? "btn-primary" : ""}`} onClick={() => { setMode("encode"); setInput(EXAMPLES[0].text); }}>Encode</button>
          <button className={`btn ${mode === "decode" ? "btn-primary" : ""}`} onClick={() => { setMode("decode"); setInput(DECODE_EXAMPLES[0].text); }}>Decode</button>
        </div>
        {mode === "encode" && (
          <div className="btn-group">
            <button className={`btn ${style === "named" ? "btn-primary" : ""}`} onClick={() => setStyle("named")}>Named (&amp;amp;)</button>
            <button className={`btn ${style === "decimal" ? "btn-primary" : ""}`} onClick={() => setStyle("decimal")}>Decimal (&#38;#38;)</button>
            <button className={`btn ${style === "hex" ? "btn-primary" : ""}`} onClick={() => setStyle("hex")}>Hex (&#38;#x26;)</button>
          </div>
        )}
      </div>

      <div className="btn-group mb-3" style={{ flexWrap: "wrap" }}>
        {(mode === "encode" ? EXAMPLES : DECODE_EXAMPLES).map((ex) => (
          <button key={ex.label} className="btn" style={{ fontSize: "12px" }} onClick={() => setInput(ex.text)}>{ex.label}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <label style={{ margin: 0 }}>{mode === "encode" ? "Plain text input" : "HTML entity input"}</label>
            <button className="btn" style={{ fontSize: "12px" }} onClick={() => setInput("")}>Clear</button>
          </div>
          <textarea
            className="tool-input font-mono"
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? 'Enter text with <, >, &, " characters…' : "Enter HTML entities to decode…"}
            spellCheck={false}
          />
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <label style={{ margin: 0 }}>{mode === "encode" ? "Encoded HTML" : "Decoded text"}</label>
            <CopyButton text={output} />
          </div>
          <pre className="output-box font-mono" style={{ fontSize: "13px", minHeight: "220px", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {output || "Output will appear here…"}
          </pre>
        </div>
      </div>

      {changedPairs.length > 0 && (
        <div className="card mt-4" style={{ overflowX: "auto" }}>
          <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "10px" }}>Encoded characters</p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 500 }}>Character</th>
                <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 500 }}>Entity</th>
                <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 500 }}>Named</th>
                <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 500 }}>Decimal</th>
                <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 500 }}>Hex</th>
              </tr>
            </thead>
            <tbody>
              {changedPairs.map(({ original, encoded }) => {
                const code = original.codePointAt(0)!;
                return (
                  <tr key={original} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "5px 10px", fontFamily: "var(--font-geist-mono), monospace" }}>{original}</td>
                    <td style={{ padding: "5px 10px", fontFamily: "var(--font-geist-mono), monospace", color: "#6366f1" }}>{encoded}</td>
                    <td style={{ padding: "5px 10px", fontFamily: "var(--font-geist-mono), monospace", color: "var(--text-secondary)" }}>{NAMED[original] ?? "—"}</td>
                    <td style={{ padding: "5px 10px", fontFamily: "var(--font-geist-mono), monospace", color: "var(--text-secondary)" }}>&#{code};</td>
                    <td style={{ padding: "5px 10px", fontFamily: "var(--font-geist-mono), monospace", color: "var(--text-secondary)" }}>&#x{code.toString(16).toUpperCase()};</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <section className="tool-prose">
        <h2>About HTML Entity Encoding</h2>
        <p>HTML entities are sequences that represent characters with special meaning in HTML. The five reserved HTML characters — <code>&lt;</code>, <code>&gt;</code>, <code>&amp;</code>, <code>&quot;</code>, and <code>&#39;</code> — must be escaped as entities when they appear in text content or attribute values, otherwise the browser will misinterpret them as HTML markup. Failing to escape user-provided content is one of the most common causes of XSS (Cross-Site Scripting) vulnerabilities.</p>
        <p>HTML supports three entity formats: <strong>named entities</strong> (<code>&amp;amp;</code>, <code>&amp;lt;</code>, <code>&amp;copy;</code>) are the most readable and cover common symbols; <strong>decimal numeric</strong> (<code>&amp;#38;</code>) and <strong>hexadecimal numeric</strong> (<code>&amp;#x26;</code>) entities can represent any Unicode code point. Named entities only exist for a predefined set of characters; for everything else, numeric entities are required. The character breakdown table shows all three formats side by side for each encoded character.</p>
        <p>All encoding and decoding runs locally in your browser. The tool supports the full Unicode range — emoji, accented characters, CJK, Greek, and mathematical symbols are all handled correctly.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>When do I need to encode HTML entities?</summary>
          <p>Whenever you insert untrusted text into HTML. This includes user input displayed in a page, API data rendered in templates, and any content that might contain <code>&lt;</code>, <code>&gt;</code>, or <code>&amp;</code>. Modern templating engines (React JSX, Jinja2, Handlebars) auto-escape by default. If you bypass auto-escaping (e.g., <code>dangerouslySetInnerHTML</code> in React), you must escape manually.</p>
        </details>
        <details>
          <summary>What is the difference between named and numeric entities?</summary>
          <p>Named entities (<code>&amp;amp;</code>, <code>&amp;copy;</code>) are human-readable aliases for specific characters. Numeric entities (<code>&amp;#169;</code> or <code>&amp;#xA9;</code>) reference the Unicode code point directly and work for any character. Named entities are defined by the HTML specification; not every character has one. All modern browsers support both formats.</p>
        </details>
        <details>
          <summary>Is <code>&amp;nbsp;</code> the same as a regular space?</summary>
          <p>No. <code>&amp;nbsp;</code> is a non-breaking space (Unicode U+00A0). Unlike a regular space, it prevents line breaks between the words it separates, and multiple <code>&amp;nbsp;</code> characters are not collapsed into one by the browser. It is used to force spacing in HTML or prevent orphaned words at line breaks.</p>
        </details>
        <details>
          <summary>How is HTML entity encoding related to XSS prevention?</summary>
          <p>HTML entity encoding is a key defense against reflected and stored XSS attacks. If an attacker submits <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> as input and your application outputs it without encoding, the browser executes the script. Encoding it as <code>&amp;lt;script&amp;gt;</code> makes the browser render it as visible text, not executable code. Always encode in the context you are outputting to (HTML, attribute, JavaScript, CSS — each has different escaping rules).</p>
        </details>
      </section>
    </div>
  );
}
