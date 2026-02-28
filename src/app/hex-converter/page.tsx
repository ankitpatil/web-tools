"use client";


import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export default function HexConverter() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{hex?: string; dec?: string; bin?: string; oct?: string}>({});

  const convert = () => {
    const val = input.trim();
    if (!val) { setResults({}); return; }

    try {
      let dec: number;
      if (val.startsWith("0x") || val.startsWith("0X")) {
        dec = parseInt(val, 16);
      } else if (/^[01]+$/.test(val)) {
        dec = parseInt(val, 2);
      } else if (/^[0-7]+$/.test(val)) {
        dec = parseInt(val, 8);
      } else if (/^-?\d+$/.test(val)) {
        dec = parseInt(val, 10);
      } else if (/^[0-9a-fA-F]+$/.test(val)) {
        dec = parseInt(val, 16);
      } else {
        setResults({});
        return;
      }

      setResults({
        hex: "0x" + dec.toString(16).toUpperCase(),
        dec: dec.toString(10),
        bin: "0b" + dec.toString(2),
        oct: "0o" + dec.toString(8),
      });
    } catch {
      setResults({});
    }
  };

  return (
    <div className="tool-page">
      <h1>Hex / Decimal Converter</h1>
      <p className="desc">Convert between Hex, Decimal, Binary, and Octal.</p>
      
      <label>Enter a number (any format)</label>
      <input 
        className="tool-input font-mono" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="e.g., 255, 0xFF, 0b11111111, 377" 
      />
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={convert}>🔄 Convert</button>
        <button className="btn" onClick={() => { setInput(""); setResults({}); }}>Clear</button>
      </div>

      {results.hex && (
        <div className="output-box space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)]">Hex:</span>
            <code className="text-lg">{results.hex}</code>
            <CopyButton text={results.hex || ""} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)]">Decimal:</span>
            <code className="text-lg">{results.dec}</code>
            <CopyButton text={results.dec || ""} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)]">Binary:</span>
            <code className="text-lg">{results.bin}</code>
            <CopyButton text={results.bin || ""} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-secondary)]">Octal:</span>
            <code className="text-lg">{results.oct}</code>
            <CopyButton text={results.oct || ""} />
          </div>
        </div>
      )}

      <section className="tool-prose">
        <h2>About the Hex / Decimal Converter</h2>
        <p>The Hex Converter instantly translates numbers between hexadecimal (base 16), decimal (base 10), binary (base 2), and octal (base 8). Enter a value in any base and see the equivalent in all four systems simultaneously.</p>
        <p>Number base conversion is a fundamental skill in computer science and embedded systems programming. Hexadecimal is the standard notation for memory addresses, color codes, byte values in network packets, and CPU registers — making it essential for low-level programming and debugging. Binary is the native language of digital hardware. Octal appears in Unix file permission notation (e.g., <code>chmod 755</code>).</p>
        <p>All conversion runs locally in your browser using JavaScript&apos;s built-in <code>parseInt()</code> and <code>toString()</code> methods with explicit radix values. No data is sent to any server.</p>
      </section>
    </div>
  );
}
