"use client";
import { useState, useEffect } from "react";
import { CopyButton } from "@/components/CopyButton";

const timezones = [
  { value: "UTC", label: "UTC" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "America/Denver", label: "Mountain (MT)" },
  { value: "America/Chicago", label: "Central (CT)" },
  { value: "America/New_York", label: "Eastern (ET)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

export default function TimestampConverter() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [ts, setTs] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const i = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(i);
  }, []);

  const fromTimestamp = () => {
    const n = parseInt(ts);
    if (isNaN(n)) { setResult(null); return; }
    const ms = ts.length > 10 ? n : n * 1000;
    const d = new Date(ms);
    setResult({
      unix_sec: Math.floor(ms / 1000),
      unix_ms: ms,
      iso: d.toISOString(),
      utc: d.toUTCString(),
      local: d.toLocaleString("en-US", { timeZone: timezone }),
      date: d.toLocaleDateString("en-US", { timeZone: timezone }),
      time: d.toLocaleTimeString("en-US", { timeZone: timezone }),
      relative: d.toLocaleString("en-US", { timeZone: timezone, timeZoneName: "short" }),
    });
  };

  const fromDate = () => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) { setResult(null); return; }
    const ms = d.getTime();
    setResult({
      unix_sec: Math.floor(ms / 1000),
      unix_ms: ms,
      iso: d.toISOString(),
      utc: d.toUTCString(),
      local: d.toLocaleString("en-US", { timeZone: timezone }),
      date: d.toLocaleDateString("en-US", { timeZone: timezone }),
      time: d.toLocaleTimeString("en-US", { timeZone: timezone }),
      relative: d.toLocaleString("en-US", { timeZone: timezone, timeZoneName: "short" }),
    });
  };

  const parseNaturalLanguage = () => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) { setResult(null); return; }
    const ms = d.getTime();
    setResult({
      unix_sec: Math.floor(ms / 1000),
      unix_ms: ms,
      iso: d.toISOString(),
      utc: d.toUTCString(),
      local: d.toLocaleString("en-US", { timeZone: timezone }),
      date: d.toLocaleDateString("en-US", { timeZone: timezone }),
      time: d.toLocaleTimeString("en-US", { timeZone: timezone }),
      relative: d.toLocaleString("en-US", { timeZone: timezone, timeZoneName: "short" }),
    });
  };

  return (
    <div className="tool-page">
      <h1>Unix Timestamp Converter</h1>
      <p className="desc">Convert between Unix timestamps and human-readable dates with timezone support.</p>
      
      <div className="card mb-4">
        <p className="text-sm text-[var(--text-secondary)]">Current Unix Timestamp</p>
        <p className="text-2xl font-mono font-bold">{now}</p>
      </div>

      <div className="mb-4">
        <label className="text-sm">Timezone</label>
        <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="tool-input">
          {timezones.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label>Timestamp → Date</label>
          <input type="text" value={ts} onChange={(e) => setTs(e.target.value)} placeholder="1700000000 or 1700000000000" className="tool-input mb-2" />
          <button className="btn btn-primary" onClick={fromTimestamp}>Convert</button>
        </div>
        <div>
          <label>Date/Time → Timestamp</label>
          <input type="text" value={dateStr} onChange={(e) => setDateStr(e.target.value)} placeholder="2024-01-01T00:00:00Z or tomorrow" className="tool-input mb-2" />
          <button className="btn btn-primary" onClick={fromDate}>Convert</button>
          <button className="btn ml-2" onClick={parseNaturalLanguage}>Parse</button>
        </div>
      </div>

      {result && (
        <div className="mt-4">
          <div className="btn-group mb-2">
            <CopyButton text={`Unix: ${result.unix_sec}\nISO: ${result.iso}\nLocal: ${result.local}`} />
          </div>
          <div className="output-box space-y-2">
            <div className="flex justify-between"><span>Unix (seconds):</span> <code>{result.unix_sec}</code></div>
            <div className="flex justify-between"><span>Unix (ms):</span> <code>{result.unix_ms}</code></div>
            <div className="flex justify-between"><span>ISO 8601:</span> <code className="text-xs">{result.iso}</code></div>
            <div className="flex justify-between"><span>UTC:</span> <code>{result.utc}</code></div>
            <div className="flex justify-between"><span>{timezone}:</span> <code>{result.local}</code></div>
            <div className="flex justify-between"><span>Date:</span> <code>{result.date}</code></div>
            <div className="flex justify-between"><span>Time:</span> <code>{result.time}</code></div>
          </div>
        </div>
      )}
    </div>
  );
}
