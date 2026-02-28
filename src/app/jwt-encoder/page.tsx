"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/CopyButton";

type Algo = "HS256" | "HS384" | "HS512";

const ALGO_MAP: Record<Algo, string> = {
  HS256: "SHA-256",
  HS384: "SHA-384",
  HS512: "SHA-512",
};

function base64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function encodeJSON(obj: object): string {
  return base64url(new TextEncoder().encode(JSON.stringify(obj)).buffer as ArrayBuffer);
}

async function signJwt(header: object, payload: object, secret: string, algo: Algo): Promise<string> {
  const headerB64 = encodeJSON(header);
  const payloadB64 = encodeJSON(payload);
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: ALGO_MAP[algo] },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signingInput));
  return `${signingInput}.${base64url(sig)}`;
}

const DEFAULT_PAYLOAD = JSON.stringify({
  sub: "1234567890",
  name: "John Doe",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
}, null, 2);

const PRESETS = [
  {
    label: "Auth token",
    payload: { sub: "user_123", name: "Alice", role: "admin", iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86400 },
  },
  {
    label: "API access",
    payload: { iss: "api.example.com", sub: "client_abc", scope: "read:users write:posts", iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 },
  },
  {
    label: "Email verify",
    payload: { purpose: "email-verification", email: "user@example.com", iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 1800 },
  },
];

export default function JwtEncoder() {
  const [algo, setAlgo]         = useState<Algo>("HS256");
  const [secret, setSecret]     = useState("your-256-bit-secret");
  const [payload, setPayload]   = useState(DEFAULT_PAYLOAD);
  const [token, setToken]       = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const generate = useCallback(async () => {
    setError(""); setLoading(true);
    try {
      let parsed: object;
      try {
        parsed = JSON.parse(payload);
      } catch {
        setError("Payload is not valid JSON.");
        return;
      }
      if (!secret) { setError("Enter a secret key."); return; }
      const header = { alg: algo, typ: "JWT" };
      const jwt = await signJwt(header, parsed, secret, algo);
      setToken(jwt);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [algo, secret, payload]);

  const parts = token ? token.split(".") : [];
  const COLORS = ["#6366f1", "#22c55e", "#f59e0b"];
  const LABELS = ["Header", "Payload", "Signature"];

  return (
    <div className="tool-page">
      <h1>JWT Encoder</h1>
      <p className="desc">Create and sign JSON Web Tokens with a custom payload. Uses the browser&apos;s Web Crypto API — your secret key never leaves your device.</p>

      {/* Algorithm */}
      <label>Algorithm</label>
      <div className="btn-group mb-4">
        {(["HS256", "HS384", "HS512"] as Algo[]).map((a) => (
          <button key={a} className={`btn ${algo === a ? "btn-primary" : ""}`} onClick={() => setAlgo(a)}>{a}</button>
        ))}
      </div>

      {/* Secret */}
      <label>Secret Key</label>
      <div className="flex gap-2 items-center mb-4">
        <input
          type={showSecret ? "text" : "password"}
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Enter your secret key..."
          style={{ flex: 1 }}
          className="font-mono"
          spellCheck={false}
        />
        <button className="btn" onClick={() => setShowSecret(!showSecret)}>{showSecret ? "Hide" : "Show"}</button>
      </div>

      {/* Payload */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <label style={{ margin: 0 }}>Payload (JSON)</label>
        <div className="btn-group">
          {PRESETS.map((p) => (
            <button key={p.label} className="btn" style={{ fontSize: "12px" }} onClick={() => setPayload(JSON.stringify(p.payload, null, 2))}>{p.label}</button>
          ))}
        </div>
      </div>
      <textarea
        className="tool-input font-mono"
        rows={8}
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        spellCheck={false}
        style={{ marginBottom: "12px" }}
      />

      <div className="btn-group mb-4">
        <button className="btn btn-primary" onClick={generate} disabled={loading}>
          {loading ? "Signing…" : "Generate JWT"}
        </button>
        <button className="btn" onClick={() => { setToken(""); setError(""); }}>Clear</button>
        {token && <CopyButton text={token} />}
      </div>

      {error && <p className="error-text mb-3">❌ {error}</p>}

      {token && (
        <>
          <label>Signed JWT</label>
          <div className="output-box mb-4" style={{ wordBreak: "break-all", fontFamily: "var(--font-geist-mono), monospace", fontSize: "13px", lineHeight: "1.7" }}>
            {parts.map((part, i) => (
              <span key={i}>
                <span style={{ color: COLORS[i] }}>{part}</span>
                {i < parts.length - 1 && <span style={{ color: "var(--text-secondary)" }}>.</span>}
              </span>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "16px" }}>
            {parts.map((part, i) => (
              <div key={i} className="card" style={{ padding: "10px 12px", borderColor: COLORS[i] + "55" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, color: COLORS[i], marginBottom: "6px" }}>{LABELS[i]}</p>
                {i < 2 ? (
                  <pre style={{ fontSize: "11px", margin: 0, overflow: "auto", color: "var(--text-secondary)" }}>
                    {JSON.stringify(JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/") + "==")), null, 2)}
                  </pre>
                ) : (
                  <p style={{ fontSize: "11px", color: "var(--text-secondary)", wordBreak: "break-all", fontFamily: "var(--font-geist-mono), monospace" }}>{part}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <section className="tool-prose">
        <h2>About the JWT Encoder</h2>
        <p>This tool creates and signs JSON Web Tokens (JWTs) using HMAC-based symmetric algorithms: HS256 (HMAC-SHA256), HS384 (HMAC-SHA384), and HS512 (HMAC-SHA512). Enter a JSON payload, a secret key, and click Generate to produce a signed, production-ready JWT. The generated token is color-coded into its three dot-separated parts — header, payload, and signature — for easy inspection.</p>
        <p>JWTs are used extensively in authentication systems. After a successful login, a server issues a signed JWT to the client; the client includes it in subsequent requests (typically as a <code>Bearer</code> token in the <code>Authorization</code> header). The server verifies the signature using the shared secret — if it matches, the token is authentic and the claims (like user ID and role) can be trusted. Common payload claims include <code>sub</code> (subject/user ID), <code>iat</code> (issued at), <code>exp</code> (expiration), and <code>iss</code> (issuer).</p>
        <p>All signing runs locally using the browser&apos;s native Web Crypto API (<code>crypto.subtle.sign</code>). Your secret key is never transmitted. To decode and inspect an existing JWT, use the companion JWT Decoder tool.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What is the difference between HS256, HS384, and HS512?</summary>
          <p>All three use HMAC (Hash-based Message Authentication Code) with a shared secret. The number indicates the SHA hash length: 256, 384, or 512 bits. HS256 is the most widely used and is sufficient for most applications. HS384 and HS512 produce longer signatures and are used when higher security margins are required. The choice is often dictated by the library or API you are integrating with.</p>
        </details>
        <details>
          <summary>What is the difference between HS256 and RS256?</summary>
          <p>HS256 uses a single shared secret for both signing and verification — simpler but requires all verifiers to know the secret. RS256 uses an asymmetric key pair: the private key signs the token, and the public key verifies it. RS256 is preferred for distributed systems where tokens are verified by multiple services that should not have access to the signing key.</p>
        </details>
        <details>
          <summary>Should JWTs be stored in localStorage or cookies?</summary>
          <p>Cookies with <code>HttpOnly</code> and <code>Secure</code> flags are generally safer. <code>HttpOnly</code> prevents JavaScript from accessing the token (protecting against XSS), and <code>Secure</code> ensures it&apos;s only sent over HTTPS. <code>localStorage</code> is accessible to all JavaScript on the page, making it vulnerable to XSS attacks that steal the token.</p>
        </details>
        <details>
          <summary>How do I set a token expiration time?</summary>
          <p>Add an <code>exp</code> claim to the payload with a Unix timestamp value (seconds since epoch). For example, <code>"exp": 1700000000</code>. Servers should always validate the <code>exp</code> claim and reject expired tokens. The JWT Encoder preset examples include <code>iat</code> (issued at) and <code>exp</code> (1 hour from now) by default.</p>
        </details>
      </section>
    </div>
  );
}
