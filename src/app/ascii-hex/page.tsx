"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

type Mode = "encode" | "decode";
type Format = "hex" | "binary" | "octal" | "decimal" | "base64";

const FORMAT_LABELS: Record<Format, string> = {
  hex: "Hex", binary: "Binary", octal: "Octal", decimal: "Decimal", base64: "Base64",
};

function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

function encode(text: string, fmt: Format): string {
  if (fmt === "base64") {
    try { return btoa(unescape(encodeURIComponent(text))); } catch { return "Error: invalid input"; }
  }
  const bytes = textToBytes(text);
  const base = fmt === "hex" ? 16 : fmt === "binary" ? 2 : fmt === "octal" ? 8 : 10;
  const pad   = fmt === "hex" ? 2 : fmt === "binary" ? 8 : fmt === "octal" ? 3 : 3;
  return Array.from(bytes).map((b) => b.toString(base).padStart(pad, "0")).join(" ");
}

function decode(raw: string, fmt: Format): string {
  try {
    if (fmt === "base64") {
      return decodeURIComponent(escape(atob(raw.trim())));
    }
    const base = fmt === "hex" ? 16 : fmt === "binary" ? 2 : fmt === "octal" ? 8 : 10;
    const tokens = raw.trim().split(/[\s,]+/).filter(Boolean);
    const bytes = tokens.map((t) => {
      const n = parseInt(t, base);
      if (isNaN(n) || n < 0 || n > 255) throw new Error(`Invalid value: ${t}`);
      return n;
    });
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch (e: unknown) {
    return `Error: ${(e as Error).message}`;
  }
}

const EXAMPLES = [
  "Hello, World!",
  "The quick brown fox jumps over the lazy dog",
  "admin:password",
  '{"key":"value"}',
];

export default function AsciiHex() {
  const [mode, setMode]   = useState<Mode>("encode");
  const [fmt, setFmt]     = useState<Format>("hex");
  const [input, setInput] = useState("Hello, World!");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return mode === "encode" ? encode(input, fmt) : decode(input, fmt);
  }, [input, fmt, mode]);

  // Show char table for short encode inputs
  const charTable = useMemo(() => {
    if (mode !== "encode" || fmt !== "hex" || input.length > 32) return null;
    const bytes = textToBytes(input);
    return Array.from(bytes).map((b, i) => ({
      char: input[i] ?? "?",
      dec: b,
      hex: b.toString(16).padStart(2, "0"),
      bin: b.toString(2).padStart(8, "0"),
    }));
  }, [input, mode, fmt]);

  return (
    <div className="tool-page">
      <h1>ASCII / Hex / Binary Text Converter</h1>
      <p className="desc">Encode text as hexadecimal, binary, octal, decimal bytes, or Base64. Decode hex / binary / Base64 strings back to readable text.</p>

      <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
        <div className="btn-group">
          <button className={`btn ${mode === "encode" ? "btn-primary" : ""}`} onClick={() => setMode("encode")}>Text → Bytes</button>
          <button className={`btn ${mode === "decode" ? "btn-primary" : ""}`} onClick={() => setMode("decode")}>Bytes → Text</button>
        </div>
        <div className="btn-group">
          {(Object.keys(FORMAT_LABELS) as Format[]).map((f) => (
            <button key={f} className={`btn ${fmt === f ? "btn-primary" : ""}`} onClick={() => setFmt(f)}>{FORMAT_LABELS[f]}</button>
          ))}
        </div>
      </div>

      {mode === "encode" && (
        <div className="btn-group mb-3" style={{ flexWrap: "wrap" }}>
          {EXAMPLES.map((ex) => (
            <button key={ex} className="btn" style={{ fontSize: "12px" }} onClick={() => setInput(ex)}>{ex.slice(0, 20)}{ex.length > 20 ? "…" : ""}</button>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <label style={{ margin: 0 }}>{mode === "encode" ? "Text input" : `${FORMAT_LABELS[fmt]} input`}</label>
            <button className="btn" style={{ fontSize: "12px" }} onClick={() => setInput("")}>Clear</button>
          </div>
          <textarea
            className="tool-input font-mono"
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode…" : `Enter ${FORMAT_LABELS[fmt].toLowerCase()} values separated by spaces…`}
            spellCheck={false}
          />
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <label style={{ margin: 0 }}>{mode === "encode" ? `${FORMAT_LABELS[fmt]} output` : "Decoded text"}</label>
            <CopyButton text={output} />
          </div>
          <pre className="output-box font-mono" style={{ fontSize: "13px", minHeight: "220px", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {output || "Output will appear here…"}
          </pre>
        </div>
      </div>

      {charTable && charTable.length > 0 && (
        <div className="card mt-4" style={{ overflowX: "auto" }}>
          <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "10px" }}>Character breakdown</p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", fontFamily: "var(--font-geist-mono), monospace" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 500 }}>Char</th>
                <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 500 }}>Dec</th>
                <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 500 }}>Hex</th>
                <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 500 }}>Binary</th>
              </tr>
            </thead>
            <tbody>
              {charTable.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "5px 10px" }}>{row.char === " " ? "⎵" : row.char}</td>
                  <td style={{ padding: "5px 10px", color: "var(--text-secondary)" }}>{row.dec}</td>
                  <td style={{ padding: "5px 10px", color: "#6366f1" }}>{row.hex}</td>
                  <td style={{ padding: "5px 10px", color: "var(--text-secondary)" }}>{row.bin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="tool-prose">
        <h2>About the ASCII / Hex Converter</h2>
        <p>This tool converts between human-readable text and its byte-level representations: hexadecimal, binary, octal, decimal, and Base64. Every character in a string has a numeric byte value (its ASCII or UTF-8 code point). For example, the letter <code>A</code> is decimal 65, hex <code>41</code>, binary <code>01000001</code>. This tool shows those encodings for every byte in your input, and can reverse the process to decode byte sequences back to readable text.</p>
        <p>Common use cases include inspecting network packets and binary protocols (where payloads appear as hex dumps), debugging encoding issues in HTTP requests and API responses, learning how character encodings like ASCII and UTF-8 work, and converting values for embedded systems and low-level programming where registers and memory addresses are expressed in hex or binary. The character breakdown table makes it easy to see the individual code point for each character.</p>
        <p>All conversion runs locally in your browser using JavaScript&apos;s <code>TextEncoder</code> and <code>TextDecoder</code> APIs. Full UTF-8 is supported — emoji and non-ASCII characters are encoded as their multi-byte UTF-8 sequences.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What is the difference between ASCII and UTF-8?</summary>
          <p>ASCII defines 128 characters (codes 0–127) using 7 bits — the basic Latin alphabet, digits, and punctuation. UTF-8 is a superset: for code points 0–127 it produces the same single-byte encoding as ASCII. For code points above 127 (accented characters, emoji, CJK), UTF-8 uses 2–4 bytes. This tool uses UTF-8, so multi-byte characters will produce multiple hex values.</p>
        </details>
        <details>
          <summary>How do I decode a hex dump from Wireshark or a packet capture?</summary>
          <p>Copy the hex bytes (space-separated, e.g., <code>48 65 6c 6c 6f</code>) and paste them into the "Bytes → Text" decode mode with Hex format selected. The tool will decode them to their ASCII / UTF-8 string representation.</p>
        </details>
        <details>
          <summary>Why does "Hello" produce 5 hex values but an emoji produces more?</summary>
          <p>Each hex value represents one byte. ASCII characters each fit in one byte (e.g., H = <code>48</code>). Emoji and many non-Latin characters require multiple bytes in UTF-8: the 😀 emoji is 4 bytes: <code>f0 9f 98 80</code>. This is why string length in bytes can differ from the number of visible characters.</p>
        </details>
        <details>
          <summary>What is Base64 encoding?</summary>
          <p>Base64 encodes binary data as a string of 64 printable ASCII characters (A–Z, a–z, 0–9, +, /). It increases size by about 33% but guarantees the output is safe to transmit through text-only channels like HTTP headers, JSON, and email. It is not encryption — anyone can decode it.</p>
        </details>
      </section>
    </div>
  );
}
