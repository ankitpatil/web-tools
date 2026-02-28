"use client";


import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const scales = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion"];

function numberToWords(n: number): string {
  if (n === 0) return "zero";
  const isNegative = n < 0;
  n = Math.abs(Math.floor(n));
  
  const words: string[] = [];
  let scaleIndex = 0;
  
  while (n > 0) {
    const chunk = n % 1000;
    if (chunk > 0) {
      let chunkWords = "";
      const hundreds = Math.floor(chunk / 100);
      const remainder = chunk % 100;
      
      if (hundreds > 0) {
        chunkWords += ones[hundreds] + " hundred";
        if (remainder > 0) chunkWords += " ";
      }
      
      if (remainder < 20) {
        chunkWords += ones[remainder];
      } else {
        chunkWords += tens[Math.floor(remainder / 10)];
        if (remainder % 10 > 0) chunkWords += "-" + ones[remainder % 10];
      }
      
      if (scaleIndex > 0) chunkWords += " " + scales[scaleIndex];
      words.unshift(chunkWords);
    }
    n = Math.floor(n / 1000);
    scaleIndex++;
  }
  
  return (isNegative ? "negative " : "") + words.join(" ");
}

export default function NumberToWords() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [currency, setCurrency] = useState<"none" | "usd">("none");

  const convert = () => {
    const n = parseFloat(input.replace(/,/g, ""));
    if (isNaN(n)) { setOutput(""); return; }
    let words = numberToWords(Math.floor(n));
    const decimals = Math.round((n % 1) * 100);
    
    if (currency === "usd") {
      const cents = decimals > 0 ? ` and ${decimals}/100` : "";
      words = `${words} dollars${cents}`;
    } else if (decimals > 0) {
      words += ` and ${decimals}/100`;
    }
    
    setOutput(words);
  };

  return (
    <div className="tool-page">
      <h1>Number to Words Converter</h1>
      <p className="desc">Convert numbers to written English words.</p>
      
      <label>Enter a number</label>
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="1234567" className="tool-input" />
      
      <div className="btn-group">
        <button className="btn btn-primary" onClick={convert}>🔄 Convert</button>
        <select value={currency} onChange={(e) => setCurrency(e.target.value as typeof currency)} className="btn">
          <option value="none">Plain Number</option>
          <option value="usd">USD Currency</option>
        </select>
        <button className="btn" onClick={() => { setInput(""); setOutput(""); }}>Clear</button>
      </div>

      {output && (
        <div className="output-box text-lg capitalize">{output}</div>
      )}
      {output && <div className="btn-group mt-3"><CopyButton text={output} /></div>}

      <section className="tool-prose">
        <h2>About the Number to Words Converter</h2>
        <p>The Number to Words converter translates any integer into its written English equivalent instantly. Enter a number — from small values to billions and beyond — and get the full written form. Useful for invoices, legal documents, accessibility labels, and financial reporting.</p>
        <p>Converting numbers to words is a requirement in many formal and legal contexts where numeric figures must be spelled out to prevent ambiguity or fraud — such as on checks (&ldquo;one hundred dollars&rdquo;), contracts, and government forms. It is also used in text-to-speech applications for accessibility (ARIA labels) and in generating human-readable content programmatically.</p>
        <p>All conversion runs locally in your browser using a JavaScript implementation. No data is sent to any server. The tool supports positive integers and handles comma separators in large numbers automatically.</p>
      </section>
    </div>
  );
}
