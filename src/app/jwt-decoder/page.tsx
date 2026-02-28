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

      <section className="tool-prose">
        <h2>About the JWT Decoder</h2>
        <p>The JWT Decoder parses any JSON Web Token and displays the decoded header, payload, and expiry status in a readable format. Paste a JWT to instantly inspect every claim — including the issuer (<code>iss</code>), subject (<code>sub</code>), audience (<code>aud</code>), and expiration time (<code>exp</code>). The tool highlights whether the token is currently valid or expired.</p>
        <p>JSON Web Tokens (JWTs) are a compact, self-contained format for transmitting authentication and authorization information. A JWT consists of three Base64URL-encoded parts separated by dots: the header (algorithm and token type), the payload (claims), and the signature. They are widely used in OAuth 2.0, OpenID Connect, and REST API authentication flows.</p>
        <p>Important: this tool only decodes a JWT — it does not verify the cryptographic signature. The header and payload are readable by anyone who has the token; only the signature verification requires the secret key. Your token is never sent to any server — all decoding runs locally in your browser.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What is a JWT?</summary>
          <p>A JSON Web Token (JWT) is a compact, URL-safe token format for transmitting claims between parties. It consists of three Base64URL-encoded parts separated by dots: <code>header.payload.signature</code>. JWTs are used for authentication and authorization in web applications and APIs.</p>
        </details>
        <details>
          <summary>What does a JWT contain?</summary>
          <p>The header contains the signing algorithm (e.g., <code>HS256</code>, <code>RS256</code>) and token type. The payload contains claims: standard ones like <code>sub</code> (subject), <code>iss</code> (issuer), <code>exp</code> (expiration), and <code>iat</code> (issued at), plus any custom claims your application adds.</p>
        </details>
        <details>
          <summary>Is it safe to decode JWTs publicly?</summary>
          <p>Decoding is safe — the header and payload are just Base64URL-encoded, not encrypted. Anyone with a JWT can read its contents. This is by design: JWTs are verified via the signature, not concealed. Never put sensitive secrets in a JWT payload.</p>
        </details>
        <details>
          <summary>What does the <code>exp</code> claim mean?</summary>
          <p>The <code>exp</code> claim is the expiration time — a Unix timestamp (seconds since epoch) after which the token should not be accepted. This tool compares <code>exp</code> against the current time and highlights whether the token is still valid or has expired.</p>
        </details>
        <details>
          <summary>What is the difference between HS256 and RS256?</summary>
          <p>HS256 (HMAC-SHA256) uses a single shared secret key for both signing and verification — simpler but requires sharing the secret. RS256 (RSA-SHA256) uses a private key to sign and a public key to verify — more secure for distributed systems since verifiers only need the public key.</p>
        </details>
      </section>
    </div>
  );
}
