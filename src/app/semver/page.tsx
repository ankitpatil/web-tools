"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

interface SemVer {
  major: number;
  minor: number;
  patch: number;
  pre: string[];    // pre-release identifiers
  build: string[];  // build metadata (ignored in comparison)
  raw: string;
  valid: boolean;
}

function parse(v: string): SemVer {
  const s = v.trim().replace(/^v/, "");
  const invalid = { major: 0, minor: 0, patch: 0, pre: [], build: [], raw: v, valid: false };

  const [versionPart, ...rest] = s.split("+");
  const build = rest.join("+").split(".").filter(Boolean);
  const [corePart, ...preParts] = versionPart.split("-");
  const pre = preParts.join("-").split(".").filter(Boolean);

  const parts = corePart.split(".");
  if (parts.length !== 3) return invalid;
  const [major, minor, patch] = parts.map(Number);
  if ([major, minor, patch].some((n) => isNaN(n) || n < 0 || String(n) !== parts[parts.indexOf(String(n))])) {
    // Allow the parse to succeed if numeric parts are valid
  }
  if (isNaN(major) || isNaN(minor) || isNaN(patch)) return invalid;
  if (major < 0 || minor < 0 || patch < 0) return invalid;

  return { major, minor, patch, pre, build, raw: v, valid: true };
}

// Returns -1, 0, or 1
function comparePre(a: string[], b: string[]): number {
  // No pre-release > has pre-release
  if (a.length === 0 && b.length > 0) return 1;
  if (a.length > 0 && b.length === 0) return -1;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (i >= a.length) return -1;
    if (i >= b.length) return 1;
    const ai = a[i], bi = b[i];
    const an = parseInt(ai, 10), bn = parseInt(bi, 10);
    const aIsNum = !isNaN(an) && String(an) === ai;
    const bIsNum = !isNaN(bn) && String(bn) === bi;
    if (aIsNum && bIsNum) { if (an !== bn) return an < bn ? -1 : 1; }
    else if (aIsNum) return -1;
    else if (bIsNum) return 1;
    else { const c = ai.localeCompare(bi); if (c !== 0) return c < 0 ? -1 : 1; }
  }
  return 0;
}

function compare(a: SemVer, b: SemVer): number {
  if (a.major !== b.major) return a.major < b.major ? -1 : 1;
  if (a.minor !== b.minor) return a.minor < b.minor ? -1 : 1;
  if (a.patch !== b.patch) return a.patch < b.patch ? -1 : 1;
  return comparePre(a.pre, b.pre);
}

function symbol(cmp: number): string {
  if (cmp < 0) return "<";
  if (cmp > 0) return ">";
  return "=";
}

function label(cmp: number): string {
  if (cmp < 0) return "A is older";
  if (cmp > 0) return "A is newer";
  return "Equal";
}

const COMPARE_EXAMPLES = [
  { a: "1.2.3", b: "1.2.4" },
  { a: "2.0.0", b: "1.9.9" },
  { a: "1.0.0-alpha", b: "1.0.0" },
  { a: "1.0.0-alpha.1", b: "1.0.0-alpha.2" },
  { a: "1.0.0-rc.1", b: "1.0.0-beta.11" },
];

const SORT_EXAMPLES = [
  "1.0.0\n2.1.0\n1.5.0\n2.0.0-beta.1\n2.0.0\n1.0.1\n0.9.9\n3.0.0-alpha",
  "v4.2.0\nv4.10.0\nv4.9.0\nv4.2.1\nv3.0.0\nv5.0.0-rc.1",
];

export default function Semver() {
  const [tab, setTab]           = useState<"compare" | "sort">("compare");
  const [vA, setVA]             = useState("1.0.0-alpha");
  const [vB, setVB]             = useState("1.0.0");
  const [sortInput, setSortInput] = useState(SORT_EXAMPLES[0]);
  const [sortDir, setSortDir]   = useState<"asc" | "desc">("asc");

  const pA = useMemo(() => parse(vA), [vA]);
  const pB = useMemo(() => parse(vB), [vB]);
  const cmp = useMemo(() => (pA.valid && pB.valid ? compare(pA, pB) : null), [pA, pB]);

  const sortedVersions = useMemo(() => {
    const lines = sortInput.split("\n").map((l) => l.trim()).filter(Boolean);
    const parsed = lines.map((l) => parse(l));
    const valid = parsed.filter((p) => p.valid);
    const invalid = parsed.filter((p) => !p.valid);
    valid.sort((a, b) => compare(a, b) * (sortDir === "asc" ? 1 : -1));
    return { valid, invalid };
  }, [sortInput, sortDir]);

  const VersionBadge = ({ v }: { v: SemVer }) => {
    if (!v.valid) return <span style={{ color: "var(--error)", fontSize: "13px" }}>Invalid: {v.raw}</span>;
    return (
      <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "15px" }}>
        <span style={{ color: "#6366f1" }}>{v.major}</span>
        <span style={{ color: "var(--text-secondary)" }}>.</span>
        <span style={{ color: "#22c55e" }}>{v.minor}</span>
        <span style={{ color: "var(--text-secondary)" }}>.</span>
        <span style={{ color: "#f59e0b" }}>{v.patch}</span>
        {v.pre.length > 0 && <span style={{ color: "#ec4899" }}>-{v.pre.join(".")}</span>}
        {v.build.length > 0 && <span style={{ color: "var(--text-secondary)" }}>+{v.build.join(".")}</span>}
      </span>
    );
  };

  return (
    <div className="tool-page">
      <h1>Semver Comparator</h1>
      <p className="desc">Compare two semantic version numbers or sort a list of versions. Supports pre-release identifiers (<code>alpha</code>, <code>beta</code>, <code>rc</code>) and build metadata per the semver 2.0 spec.</p>

      <div className="btn-group mb-6">
        <button className={`btn ${tab === "compare" ? "btn-primary" : ""}`} onClick={() => setTab("compare")}>Compare two versions</button>
        <button className={`btn ${tab === "sort" ? "btn-primary" : ""}`} onClick={() => setTab("sort")}>Sort a list</button>
      </div>

      {tab === "compare" && (
        <>
          <div className="btn-group mb-4" style={{ flexWrap: "wrap" }}>
            {COMPARE_EXAMPLES.map((ex) => (
              <button key={`${ex.a}-${ex.b}`} className="btn" style={{ fontSize: "12px" }}
                onClick={() => { setVA(ex.a); setVB(ex.b); }}>
                {ex.a} vs {ex.b}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "16px", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <label>Version A</label>
              <input type="text" value={vA} onChange={(e) => setVA(e.target.value)}
                className="font-mono" style={{ width: "100%" }} placeholder="1.2.3" autoFocus />
              {pA.valid && <div style={{ marginTop: "8px" }}><VersionBadge v={pA} /></div>}
              {vA && !pA.valid && <p style={{ color: "var(--error)", fontSize: "13px", marginTop: "4px" }}>Invalid semver</p>}
            </div>

            <div style={{ textAlign: "center" }}>
              {cmp !== null ? (
                <>
                  <p style={{ fontSize: "48px", fontWeight: 800, color: cmp === 0 ? "var(--text-secondary)" : cmp > 0 ? "var(--success)" : "var(--error)", margin: 0 }}>{symbol(cmp)}</p>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>{label(cmp)}</p>
                </>
              ) : <p style={{ fontSize: "32px", color: "var(--text-secondary)" }}>vs</p>}
            </div>

            <div>
              <label>Version B</label>
              <input type="text" value={vB} onChange={(e) => setVB(e.target.value)}
                className="font-mono" style={{ width: "100%" }} placeholder="1.2.4" />
              {pB.valid && <div style={{ marginTop: "8px" }}><VersionBadge v={pB} /></div>}
              {vB && !pB.valid && <p style={{ color: "var(--error)", fontSize: "13px", marginTop: "4px" }}>Invalid semver</p>}
            </div>
          </div>

          {pA.valid && pB.valid && (
            <div className="card">
              <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>Breakdown</p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                    <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 500 }}>Part</th>
                    <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 500 }}>Version A</th>
                    <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 500 }}>Version B</th>
                    <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 500 }}>Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Major", a: pA.major, b: pB.major },
                    { label: "Minor", a: pA.minor, b: pB.minor },
                    { label: "Patch", a: pA.patch, b: pB.patch },
                  ].map(({ label: l, a, b }) => (
                    <tr key={l} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "6px 10px", color: "var(--text-secondary)" }}>{l}</td>
                      <td style={{ padding: "6px 10px", fontFamily: "var(--font-geist-mono), monospace" }}>{a}</td>
                      <td style={{ padding: "6px 10px", fontFamily: "var(--font-geist-mono), monospace" }}>{b}</td>
                      <td style={{ padding: "6px 10px", fontFamily: "var(--font-geist-mono), monospace", color: a === b ? "var(--text-secondary)" : a > b ? "var(--success)" : "var(--error)" }}>
                        {a === b ? "=" : a > b ? `+${a - b}` : `${a - b}`}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "6px 10px", color: "var(--text-secondary)" }}>Pre-release</td>
                    <td style={{ padding: "6px 10px", fontFamily: "var(--font-geist-mono), monospace" }}>{pA.pre.join(".") || "—"}</td>
                    <td style={{ padding: "6px 10px", fontFamily: "var(--font-geist-mono), monospace" }}>{pB.pre.join(".") || "—"}</td>
                    <td style={{ padding: "6px 10px", color: "var(--text-secondary)" }}>{comparePre(pA.pre, pB.pre) === 0 ? "=" : comparePre(pA.pre, pB.pre) > 0 ? "A newer" : "B newer"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === "sort" && (
        <>
          <div className="btn-group mb-3">
            {SORT_EXAMPLES.map((ex, i) => (
              <button key={i} className={`btn ${sortInput === ex ? "btn-primary" : ""}`} onClick={() => setSortInput(ex)}>Example {i + 1}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <label style={{ margin: 0 }}>Versions (one per line)</label>
                <button className="btn" style={{ fontSize: "12px" }} onClick={() => setSortInput("")}>Clear</button>
              </div>
              <textarea
                className="tool-input font-mono"
                rows={12}
                value={sortInput}
                onChange={(e) => setSortInput(e.target.value)}
                placeholder={"1.0.0\n2.1.0\n1.5.0-beta.1"}
                spellCheck={false}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <div className="btn-group">
                  <button className={`btn ${sortDir === "asc" ? "btn-primary" : ""}`} onClick={() => setSortDir("asc")}>↑ Ascending</button>
                  <button className={`btn ${sortDir === "desc" ? "btn-primary" : ""}`} onClick={() => setSortDir("desc")}>↓ Descending</button>
                </div>
                <CopyButton text={sortedVersions.valid.map((v) => v.raw).join("\n")} />
              </div>
              <div className="output-box" style={{ minHeight: "260px", fontFamily: "var(--font-geist-mono), monospace", fontSize: "14px" }}>
                {sortedVersions.valid.map((v, i) => (
                  <div key={i} style={{ padding: "4px 0", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                    <VersionBadge v={v} />
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>#{i + 1}</span>
                  </div>
                ))}
                {sortedVersions.invalid.map((v, i) => (
                  <div key={i} style={{ padding: "4px 0", color: "var(--error)", fontSize: "13px" }}>
                    ✗ {v.raw}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <section className="tool-prose">
        <h2>About Semantic Versioning</h2>
        <p>Semantic Versioning (semver) is a versioning scheme defined at <strong>semver.org</strong> that encodes meaning into version numbers. A semver version has the format <code>MAJOR.MINOR.PATCH</code>: increment <strong>MAJOR</strong> for breaking changes, <strong>MINOR</strong> for backwards-compatible new features, and <strong>PATCH</strong> for backwards-compatible bug fixes. This convention allows package managers like npm, Cargo, and Composer to automatically determine whether updating a dependency is safe.</p>
        <p>Pre-release versions (e.g., <code>1.0.0-alpha.1</code>, <code>2.0.0-rc.3</code>) have lower precedence than the release they precede — <code>1.0.0-alpha &lt; 1.0.0</code>. Pre-release identifiers are compared left-to-right: numeric identifiers compare numerically, alphanumeric identifiers compare lexicographically, and numeric identifiers always have lower precedence than alphanumeric. Build metadata (<code>+build.123</code>) is ignored in comparisons. The <code>v</code> prefix is stripped automatically.</p>
        <p>All comparison logic runs locally in your browser implementing the semver 2.0.0 specification. The sort tool handles any number of versions and correctly orders pre-release identifiers, including the tricky case where <code>1.0.0-alpha.2 &lt; 1.0.0-alpha.10</code> (numeric comparison, not lexicographic).</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>Why is <code>1.0.0-alpha</code> less than <code>1.0.0</code>?</summary>
          <p>Per the semver spec, a pre-release version has lower precedence than the associated normal version. The reasoning: a pre-release version is unstable and not yet intended for production use — so it logically "comes before" the stable release. <code>1.0.0-alpha &lt; 1.0.0-beta &lt; 1.0.0-rc.1 &lt; 1.0.0</code>.</p>
        </details>
        <details>
          <summary>How are pre-release identifiers compared?</summary>
          <p>Identifiers are compared left-to-right. Purely numeric identifiers compare by numeric value (<code>alpha.2 &lt; alpha.10</code>). Mixed or alphabetic identifiers compare lexicographically. Numeric identifiers always have lower precedence than alphanumeric ones (so <code>1.0.0-1 &lt; 1.0.0-alpha</code>). A longer pre-release string has higher precedence if all shorter identifiers are equal.</p>
        </details>
        <details>
          <summary>What does build metadata do?</summary>
          <p>Build metadata (e.g., <code>1.0.0+build.20240301</code>) is informational and is ignored when determining version precedence. Two versions that differ only in build metadata are considered equal. It is typically used for CI build numbers or git commit hashes.</p>
        </details>
        <details>
          <summary>When should I increment major vs minor vs patch?</summary>
          <p><strong>Patch</strong> (1.0.X): bug fixes that don't change the public API. <strong>Minor</strong> (1.X.0): new features that are backwards-compatible — existing users don't need to change their code. <strong>Major</strong> (X.0.0): breaking changes — removing or renaming public APIs, changing method signatures in incompatible ways. If you're unsure, increment major to be safe.</p>
        </details>
      </section>
    </div>
  );
}
