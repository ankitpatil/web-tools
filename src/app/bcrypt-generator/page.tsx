"use client";

import { useState } from "react";
import bcrypt from "bcryptjs";
import { CopyButton } from "@/components/CopyButton";

export default function BcryptGenerator() {
  const [password, setPassword]   = useState("");
  const [rounds, setRounds]       = useState(10);
  const [hash, setHash]           = useState("");
  const [hashing, setHashing]     = useState(false);

  const [verifyPass, setVerifyPass]   = useState("");
  const [verifyHash, setVerifyHash]   = useState("");
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [verifying, setVerifying]     = useState(false);

  const [error, setError] = useState("");

  const generate = async () => {
    if (!password) { setError("Enter a password to hash."); return; }
    setError(""); setHashing(true); setHash("");
    try {
      const salt = await bcrypt.genSalt(rounds);
      const h = await bcrypt.hash(password, salt);
      setHash(h);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setHashing(false);
    }
  };

  const verify = async () => {
    if (!verifyPass || !verifyHash) { setError("Enter both password and hash to verify."); return; }
    setError(""); setVerifying(true); setVerifyResult(null);
    try {
      const match = await bcrypt.compare(verifyPass, verifyHash);
      setVerifyResult(match);
    } catch {
      setError("Invalid bcrypt hash format.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="tool-page">
      <h1>bcrypt Hash Generator & Verifier</h1>
      <p className="desc">Generate bcrypt password hashes and verify passwords against hashes. Runs entirely in your browser — no passwords are ever transmitted.</p>

      <div className="card mb-6">
        <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Generate Hash</h2>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password to hash..."
          onKeyDown={(e) => e.key === "Enter" && generate()}
          style={{ width: "100%", marginBottom: "12px" }}
        />
        <div className="btn-group items-center mb-3">
          <label style={{ marginRight: "8px", whiteSpace: "nowrap" }}>Salt rounds:</label>
          <input
            type="number"
            min={4} max={14}
            value={rounds}
            onChange={(e) => setRounds(Math.min(14, Math.max(4, parseInt(e.target.value) || 10)))}
            style={{ width: "70px" }}
          />
          <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            (~{Math.round(2 ** rounds / 1000)}K hashes/s on modern hardware)
          </span>
        </div>
        <button className="btn btn-primary" onClick={generate} disabled={hashing}>
          {hashing ? "Hashing…" : "Generate Hash"}
        </button>
        {hash && (
          <div className="mt-3">
            <label>bcrypt Hash</label>
            <div className="output-box" style={{ minHeight: "auto", wordBreak: "break-all" }}>{hash}</div>
            <div className="btn-group mt-2"><CopyButton text={hash} /></div>
          </div>
        )}
      </div>

      <div className="card mb-4">
        <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Verify Password</h2>
        <label>Password</label>
        <input
          type="password"
          value={verifyPass}
          onChange={(e) => { setVerifyPass(e.target.value); setVerifyResult(null); }}
          placeholder="Enter password to verify..."
          style={{ width: "100%", marginBottom: "12px" }}
        />
        <label>bcrypt Hash</label>
        <input
          type="text"
          value={verifyHash}
          onChange={(e) => { setVerifyHash(e.target.value); setVerifyResult(null); }}
          placeholder="$2b$10$..."
          className="font-mono"
          style={{ width: "100%", marginBottom: "12px" }}
        />
        <button className="btn btn-primary" onClick={verify} disabled={verifying}>
          {verifying ? "Verifying…" : "Verify Password"}
        </button>
        {verifyResult !== null && (
          <p className={`mt-3 font-mono text-sm ${verifyResult ? "success-text" : "error-text"}`} style={{ fontSize: "15px" }}>
            {verifyResult ? "✅ Password matches the hash." : "❌ Password does not match."}
          </p>
        )}
      </div>

      {error && <p className="error-text mb-3">❌ {error}</p>}

      <section className="tool-prose">
        <h2>About the bcrypt Hash Generator</h2>
        <p>bcrypt is a password hashing algorithm designed by Niels Provos and David Mazières in 1999. It is intentionally slow — the cost factor (salt rounds) controls how many iterations the algorithm performs, making brute-force attacks exponentially more expensive as hardware improves. A salt rounds value of 10 performs 2¹⁰ = 1,024 iterations; 12 performs 4,096. This tool uses bcryptjs, a pure-JavaScript implementation that runs entirely in your browser.</p>
        <p>bcrypt hashes are not reversible. Verification works by running the same algorithm with the same salt (embedded in the hash) and comparing the result. The full hash string (e.g., <code>$2b$10$...</code>) encodes the algorithm version, salt rounds, salt, and digest — everything needed for verification.</p>
        <p>Your password never leaves your browser. This tool is safe to use with real passwords for testing purposes, but treat any generated hash as you would any sensitive value.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What salt rounds should I use?</summary>
          <p>10 is the current industry default and a good starting point. Higher rounds are more secure but slower — 12 takes roughly 4× longer than 10. OWASP recommends at least 10 for bcrypt. Avoid values below 10 in production. Values above 12 may cause noticeable UI lag in the browser.</p>
        </details>
        <details>
          <summary>Is bcrypt the same as hashing with SHA-256?</summary>
          <p>No. SHA-256 is a fast general-purpose hash — it can compute billions of hashes per second on modern GPUs, making brute-force attacks feasible. bcrypt is intentionally slow and adaptive. For password storage, always use a slow algorithm: bcrypt, scrypt, or Argon2.</p>
        </details>
        <details>
          <summary>What does the $2b$10$ prefix mean?</summary>
          <p><code>$2b$</code> identifies the bcrypt algorithm version (2b is the current standard). <code>10</code> is the cost factor (salt rounds). The next 22 characters are the Base64-encoded salt, followed by the 31-character hash. The full string is 60 characters.</p>
        </details>
        <details>
          <summary>Can I reverse a bcrypt hash to get the original password?</summary>
          <p>No. bcrypt is a one-way function — there is no mathematical way to reverse it. Attackers must try candidate passwords one at a time (brute force or dictionary attack), which is exactly what the high cost factor is designed to prevent.</p>
        </details>
      </section>
    </div>
  );
}
