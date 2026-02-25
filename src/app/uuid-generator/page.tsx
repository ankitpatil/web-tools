"use client";


import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CopyButton } from "@/components/CopyButton";

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([uuidv4()]);
  const [count, setCount] = useState(1);

  const generate = () => setUuids(Array.from({ length: count }, () => uuidv4()));

  return (
    <div className="tool-page">
      <h1>UUID Generator</h1>
      <p className="desc">Generate UUID v4 values. Supports bulk generation.</p>
      <div className="btn-group items-center">
        <label className="mr-2">Count:</label>
        <input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))} className="w-24" />
        <button className="btn btn-primary" onClick={generate}>Generate</button>
        <CopyButton text={uuids.join("\n")} />
      </div>
      <div className="output-box">{uuids.join("\n")}</div>
    </div>
  );
}
