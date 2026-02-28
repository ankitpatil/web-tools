"use client";

import { useState, useMemo } from "react";

const COMMON = new Set([
  "password","123456","123456789","qwerty","abc123","password1","iloveyou",
  "admin","letmein","monkey","1234567890","dragon","master","sunshine","princess",
  "welcome","shadow","superman","michael","football","baseball","soccer","starwars",
  "trustno1","hello","charlie","donald","password123","qwerty123","iloveyou1",
]);

interface Analysis {
  score: number;         // 0–100
  label: string;
  color: string;
  entropy: number;
  crackTime: string;
  charsets: string[];
  tips: string[];
  length: number;
}

function analyze(pw: string): Analysis {
  const len = pw.length;
  const tips: string[] = [];

  // Charsets
  const hasLower  = /[a-z]/.test(pw);
  const hasUpper  = /[A-Z]/.test(pw);
  const hasDigit  = /[0-9]/.test(pw);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pw);

  const charsets: string[] = [];
  if (hasLower)  charsets.push("lowercase (26)");
  if (hasUpper)  charsets.push("uppercase (26)");
  if (hasDigit)  charsets.push("digits (10)");
  if (hasSymbol) charsets.push("symbols (~32)");

  const poolSize = (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasDigit ? 10 : 0) + (hasSymbol ? 32 : 0) || 1;
  const entropy = Math.log2(Math.pow(poolSize, len));

  // Penalties
  let penalty = 0;
  if (/^(.)\1+$/.test(pw))         penalty += 40;  // all same char
  if (/(.)\1{2,}/.test(pw))        penalty += 15;  // long repeated chars
  if (/012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(pw)) penalty += 15;
  if (COMMON.has(pw.toLowerCase())) penalty += 50;
  if (len < 8)                      penalty += 20;

  // Base score from entropy
  const raw = Math.min(100, (entropy / 80) * 100) - penalty;
  const score = Math.max(0, Math.round(raw));

  // Crack time estimate (assuming 10B hashes/sec — offline GPU attack)
  const combinations = Math.pow(poolSize, len);
  const avgGuesses = combinations / 2;
  const hashesPerSec = 1e10;
  const seconds = avgGuesses / hashesPerSec;

  let crackTime: string;
  if (seconds < 1)           crackTime = "Instantly";
  else if (seconds < 60)     crackTime = `~${Math.round(seconds)} seconds`;
  else if (seconds < 3600)   crackTime = `~${Math.round(seconds / 60)} minutes`;
  else if (seconds < 86400)  crackTime = `~${Math.round(seconds / 3600)} hours`;
  else if (seconds < 2.628e6) crackTime = `~${Math.round(seconds / 86400)} days`;
  else if (seconds < 3.156e7) crackTime = `~${Math.round(seconds / 2.628e6)} months`;
  else if (seconds < 3.156e9) crackTime = `~${Math.round(seconds / 3.156e7)} years`;
  else                       crackTime = "Centuries+";

  // Tips
  if (len < 12)       tips.push("Use at least 12 characters — longer is the single biggest improvement.");
  if (!hasUpper)      tips.push("Add uppercase letters (A–Z).");
  if (!hasLower)      tips.push("Add lowercase letters (a–z).");
  if (!hasDigit)      tips.push("Add numbers (0–9).");
  if (!hasSymbol)     tips.push("Add symbols (!@#$%^&*) for a larger character pool.");
  if (COMMON.has(pw.toLowerCase())) tips.push("This is a commonly known password — avoid it entirely.");
  if (/(.)\1{2,}/.test(pw)) tips.push("Avoid repeating characters (e.g. aaa, 111).");
  if (/012|123|234|345|456|789|abc|qwe/i.test(pw)) tips.push("Avoid sequential patterns (123, abc, qwerty).");
  if (tips.length === 0 && score < 80) tips.push("Consider a passphrase: 4+ random words are easy to remember and very strong.");

  const label =
    score >= 80 ? "Very Strong" :
    score >= 60 ? "Strong" :
    score >= 40 ? "Moderate" :
    score >= 20 ? "Weak" : "Very Weak";

  const color =
    score >= 80 ? "var(--success)" :
    score >= 60 ? "#22c55e" :
    score >= 40 ? "#f59e0b" :
    score >= 20 ? "#f97316" : "var(--error)";

  return { score, label, color, entropy: Math.round(entropy * 10) / 10, crackTime, charsets, tips, length: len };
}

export default function PasswordStrength() {
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);

  const result = useMemo(() => (password ? analyze(password) : null), [password]);

  return (
    <div className="tool-page">
      <h1>Password Strength Checker</h1>
      <p className="desc">Analyze your password&apos;s strength — entropy score, crack time estimate, and specific improvement tips. Your password never leaves your browser.</p>

      <label>Password</label>
      <div className="flex gap-2 items-center mb-4">
        <input
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type a password to analyze..."
          style={{ flex: 1 }}
          autoComplete="off"
          spellCheck={false}
        />
        <button className="btn" onClick={() => setShow(!show)} style={{ whiteSpace: "nowrap" }}>
          {show ? "Hide" : "Show"}
        </button>
      </div>

      {result && (
        <>
          {/* Strength bar */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontWeight: 600, color: result.color, fontSize: "16px" }}>{result.label}</span>
              <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{result.score}/100</span>
            </div>
            <div style={{ height: "10px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${result.score}%`, background: result.color, borderRadius: "99px", transition: "width 0.3s ease" }} />
            </div>
          </div>

          {/* Stats grid */}
          <div className="card mb-4" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Length</p>
              <p style={{ fontSize: "22px", fontWeight: 700 }}>{result.length}</p>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Entropy</p>
              <p style={{ fontSize: "22px", fontWeight: 700 }}>{result.entropy} <span style={{ fontSize: "14px", fontWeight: 400 }}>bits</span></p>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Crack time (offline GPU)</p>
              <p style={{ fontSize: "16px", fontWeight: 700 }}>{result.crackTime}</p>
            </div>
          </div>

          {/* Character sets */}
          <div className="card mb-4">
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>Character sets detected</p>
            {result.charsets.length > 0 ? (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {result.charsets.map((c) => (
                  <span key={c} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "6px", padding: "3px 10px", fontSize: "13px" }}>{c}</span>
                ))}
              </div>
            ) : <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>None detected</p>}
          </div>

          {/* Tips */}
          {result.tips.length > 0 && (
            <div className="card mb-4" style={{ borderColor: "var(--accent)" }}>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>Improvement tips</p>
              <ul style={{ paddingLeft: "18px", margin: 0 }}>
                {result.tips.map((t, i) => (
                  <li key={i} style={{ fontSize: "14px", marginBottom: "6px" }}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <section className="tool-prose">
        <h2>About the Password Strength Checker</h2>
        <p>This tool analyzes a password&apos;s strength by computing its <strong>entropy</strong> — a measure of unpredictability in bits. Entropy is calculated as <code>log₂(poolSize^length)</code>, where pool size is the number of unique characters in the character classes used. A 12-character password using all four character classes (lower, upper, digits, symbols) has a pool of ~94 characters and approximately 79 bits of entropy.</p>
        <p>The crack time estimate assumes an offline brute-force attack at 10 billion hashes per second — a realistic figure for a GPU cluster attacking a fast hash. Against bcrypt or Argon2 with proper parameters, actual crack times would be millions of times longer. The estimate here represents the worst-case scenario: a leaked fast hash.</p>
        <p>Your password is analyzed entirely in your browser using JavaScript. It is never stored, logged, or transmitted. As a rule of thumb: aim for at least 12 characters with mixed character classes, or use a passphrase of 4+ random words (e.g., <em>correct-horse-battery-staple</em>) for something both strong and memorable.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What is password entropy?</summary>
          <p>Entropy (measured in bits) quantifies how unpredictable a password is. Each additional bit doubles the number of guesses required. 40 bits = ~1 trillion combinations; 60 bits = ~1 quintillion. A good password should have at least 60–80 bits of entropy.</p>
        </details>
        <details>
          <summary>Why does length matter more than complexity?</summary>
          <p>Adding one character multiplies the search space by the pool size. A 20-character lowercase-only password has more entropy than a 10-character mixed-case password. Length scales exponentially; complexity scales linearly. The best passwords are long <em>and</em> complex.</p>
        </details>
        <details>
          <summary>Is a passphrase better than a random password?</summary>
          <p>Yes, for human-memorized passwords. Four random common words (e.g., <em>tree-lamp-river-cloud</em>) give ~50 bits of entropy and are easy to remember. Six words give ~77 bits — stronger than most random complex passwords, and far more memorable.</p>
        </details>
        <details>
          <summary>What makes a password &quot;commonly known&quot;?</summary>
          <p>This tool checks against a list of the most frequently used passwords (e.g., <em>password</em>, <em>123456</em>, <em>qwerty</em>). Real attackers use dictionaries of millions of known passwords — these are tried before brute force. Any word from a dictionary or pop culture reference is at risk.</p>
        </details>
      </section>
    </div>
  );
}
