"use client";
import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function genWords(n: number): string {
  return Array.from({ length: n }, (_, i) => WORDS[i % WORDS.length]).join(" ");
}
function genSentences(n: number): string {
  return Array.from({ length: n }, () => {
    const len = 8 + Math.floor(Math.random() * 12);
    const s = genWords(len);
    return s.charAt(0).toUpperCase() + s.slice(1) + ".";
  }).join(" ");
}
function genParagraphs(n: number): string {
  return Array.from({ length: n }, () => genSentences(4 + Math.floor(Math.random() * 4))).join("\n\n");
}

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [output, setOutput] = useState("");

  const generate = () => {
    const fns = { paragraphs: genParagraphs, sentences: genSentences, words: genWords };
    setOutput(fns[type](count));
  };

  return (
    <div className="tool-page">
      <h1>Lorem Ipsum Generator</h1>
      <p className="desc">Generate placeholder text in paragraphs, sentences, or words.</p>
      <div className="btn-group items-center">
        <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} className="w-20" />
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
          <option value="paragraphs">Paragraphs</option>
          <option value="sentences">Sentences</option>
          <option value="words">Words</option>
        </select>
        <button className="btn btn-primary" onClick={generate}>Generate</button>
        <CopyButton text={output} />
      </div>
      {output && <div className="output-box mt-3 whitespace-pre-wrap">{output}</div>}
    </div>
  );
}
