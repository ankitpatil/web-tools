"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const ALGOS = ["SHA-256", "SHA-384", "SHA-512"] as const;
type Algo = typeof ALGOS[number];

async function computeHmac(algo: Algo, message: string, secret: string, format: "hex" | "base64"): Promise<string> {
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  const msgData = enc.encode(message);

  const key = await crypto.subtle.importKey(
    "raw", keyData,
    { name: "HMAC", hash: algo },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign("HMAC", key, msgData);
  const bytes = new Uint8Array(sig);

  if (format === "hex") {
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  } else {
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
  }
}

export default function HmacGenerator() {
  const [message, setMessage]   = useState("");
  const [secret, setSecret]     = useState("");
  const [algo, setAlgo]         = useState<Algo>("SHA-256");
  const [format, setFormat]     = useState<"hex" | "base64">("hex");
  const [output, setOutput]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const generate = async () => {
    if (!message) { setError("Enter a message."); return; }
    if (!secret)  { setError("Enter a secret key."); return; }
    setError(""); setLoading(true);
    try {
      const result = await computeHmac(algo, message, secret, format);
      setOutput(result);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-page">
      <h1>HMAC Generator</h1>
      <p className="desc">Generate HMAC signatures using SHA-256, SHA-384, or SHA-512. Uses the browser&apos;s native Web Crypto API — no data is sent anywhere.</p>

      <label>Message</label>
      <textarea
        className="tool-input"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter the message to sign..."
        spellCheck={false}
      />

      <label>Secret Key</label>
      <input
        type="text"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        placeholder="Enter your secret key..."
        className="font-mono"
        style={{ width: "100%", marginBottom: "12px" }}
        spellCheck={false}
      />

      <div className="btn-group items-center mb-4">
        <span style={{ fontSize: "14px", marginRight: "4px" }}>Algorithm:</span>
        {ALGOS.map((a) => (
          <button key={a} className={`btn ${algo === a ? "btn-primary" : ""}`} onClick={() => setAlgo(a)}>{a}</button>
        ))}
        <span style={{ fontSize: "14px", marginLeft: "8px", marginRight: "4px" }}>Output:</span>
        {(["hex", "base64"] as const).map((f) => (
          <button key={f} className={`btn ${format === f ? "btn-primary" : ""}`} onClick={() => setFormat(f)}>{f}</button>
        ))}
      </div>

      <div className="btn-group mb-4">
        <button className="btn btn-primary" onClick={generate} disabled={loading}>
          {loading ? "Computing…" : "Generate HMAC"}
        </button>
        <button className="btn" onClick={() => { setMessage(""); setSecret(""); setOutput(""); setError(""); }}>Clear</button>
        <CopyButton text={output} />
      </div>

      {error && <p className="error-text mb-3">❌ {error}</p>}

      {output && (
        <div>
          <label>HMAC-{algo} ({format})</label>
          <div className="output-box" style={{ wordBreak: "break-all", minHeight: "auto" }}>{output}</div>
        </div>
      )}

      <section className="tool-prose">
        <h2>About the HMAC Generator</h2>
        <p>HMAC (Hash-based Message Authentication Code) is a mechanism for verifying both the integrity and authenticity of a message. It combines a cryptographic hash function (SHA-256, SHA-384, or SHA-512) with a secret key to produce a fixed-length digest. Anyone with the same key can recompute the HMAC and verify that the message has not been tampered with.</p>
        <p>HMACs are used extensively in API authentication — webhook signatures (Stripe, GitHub, Shopify all use HMAC-SHA256), JWT signatures in symmetric mode (HS256 = HMAC-SHA256), signed cookies, and request signing in cloud services (AWS Signature Version 4 uses HMAC-SHA256 chained multiple times). The output format — hex or Base64 — depends on the API or protocol you are working with.</p>
        <p>All computation runs locally using the browser&apos;s native Web Crypto API (<code>crypto.subtle.sign</code>). Your message and secret key are never transmitted.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What is the difference between HMAC and a regular hash?</summary>
          <p>A regular hash (SHA-256, MD5) is computed from the message alone — anyone can compute it. An HMAC requires a secret key, so only parties with the key can produce or verify a valid signature. This prevents tampering and ensures the message came from an authorized source.</p>
        </details>
        <details>
          <summary>Which algorithm should I use — SHA-256, SHA-384, or SHA-512?</summary>
          <p>HMAC-SHA256 is the most widely used and is sufficient for most applications. SHA-384 and SHA-512 produce longer digests and are used when higher security margins are required. All three are considered secure — the choice is usually dictated by the API or protocol you are integrating with.</p>
        </details>
        <details>
          <summary>How do I use HMAC to verify a webhook?</summary>
          <p>Compute HMAC-SHA256 of the raw request body using the webhook secret as the key. Compare the result (hex-encoded) to the signature in the request header. Use a constant-time comparison to prevent timing attacks. Most platforms (Stripe, GitHub, Shopify) document this exact process.</p>
        </details>
        <details>
          <summary>Is hex or Base64 output better?</summary>
          <p>It depends on the system consuming the HMAC. APIs typically specify which format they expect. Hex is easier to read and debug; Base64 is more compact (approximately 33% shorter). Both represent the same underlying bytes.</p>
        </details>
      </section>
    </div>
  );
}
