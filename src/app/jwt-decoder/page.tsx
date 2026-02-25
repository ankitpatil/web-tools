"use client";


import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

function decodeBase64Url(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  return decodeURIComponent(escape(atob(padded)));
}

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");
  const [expiry, setExpiry] = useState("");

  const decode = () => {
    try {
      setError("");
      const parts = input.trim().split(".");
      if (parts.length < 2) throw new Error("Invalid JWT format");
      const h = JSON.parse(decodeBase64Url(parts[0]));
      const p = JSON.parse(decodeBase64Url(parts[1]));
      setHeader(JSON.stringify(h, null, 2));
      setPayload(JSON.stringify(p, null, 2));
      if (p.exp) {
        const d = new Date(p.exp * 1000);
        const isExpired = d < new Date();
        setExpiry(`${d.toISOString()} (${isExpired ? "EXPIRED" : "valid"})`);
      } else {
        setExpiry("No expiry claim");
      }
    } catch (e: unknown) {
      setError((e as Error).message);
      setHeader("");
      setPayload("");
      setExpiry("");
    }
  };

  return (
    <div className="tool-page">
      <h1>JWT Decoder</h1>
      <p className="desc">Decode JWT tokens to inspect header, payload, and expiry.</p>
      <textarea className="tool-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste JWT token here..." />
      <div className="btn-group">
        <button className="btn btn-primary" onClick={decode}>Decode</button>
        <button className="btn" onClick={() => { setInput(""); setHeader(""); setPayload(""); setError(""); setExpiry(""); }}>Clear</button>
      </div>
      {error && <p className="error-text">❌ {error}</p>}
      {header && (
        <>
          <label>Header</label>
          <div className="output-box mb-3">{header}</div>
          <CopyButton text={header} />
          <label className="mt-3">Payload</label>
          <div className="output-box mb-3">{payload}</div>
          <CopyButton text={payload} />
          <label className="mt-3">Expiry</label>
          <p className={`text-sm font-mono ${expiry.includes("EXPIRED") ? "text-[var(--error)]" : "text-[var(--success)]"}`}>{expiry}</p>
        </>
      )}
    </div>
  );
}
