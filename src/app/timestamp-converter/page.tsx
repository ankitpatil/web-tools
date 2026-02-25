"use client";
import { useState, useEffect } from "react";
import { CopyButton } from "@/components/CopyButton";

export default function TimestampConverter() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [ts, setTs] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    const i = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(i);
  }, []);

  const fromTimestamp = () => {
    const n = parseInt(ts);
    if (isNaN(n)) { setResult("Invalid timestamp"); return; }
    const ms = ts.length > 10 ? n : n * 1000;
    setResult(new Date(ms).toISOString() + "\n" + new Date(ms).toLocaleString());
  };

  const fromDate = () => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) { setResult("Invalid date"); return; }
    setResult(`Unix (seconds): ${Math.floor(d.getTime() / 1000)}\nUnix (ms): ${d.getTime()}`);
  };

  return (
    <div className="tool-page">
      <h1>Unix Timestamp Converter</h1>
      <p className="desc">Convert between Unix timestamps and human-readable dates.</p>
      <div className="card mb-4">
        <p className="text-sm text-[var(--text-secondary)]">Current Unix Timestamp</p>
        <p className="text-2xl font-mono font-bold">{now}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label>Timestamp → Date</label>
          <input type="text" value={ts} onChange={(e) => setTs(e.target.value)} placeholder="1700000000" className="w-full mb-2" />
          <button className="btn btn-primary" onClick={fromTimestamp}>Convert</button>
        </div>
        <div>
          <label>Date → Timestamp</label>
          <input type="text" value={dateStr} onChange={(e) => setDateStr(e.target.value)} placeholder="2024-01-01T00:00:00Z" className="w-full mb-2" />
          <button className="btn btn-primary" onClick={fromDate}>Convert</button>
        </div>
      </div>
      {result && (
        <div className="mt-4">
          <div className="btn-group"><CopyButton text={result} /></div>
          <div className="output-box">{result}</div>
        </div>
      )}
    </div>
  );
}
