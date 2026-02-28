"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

type Perm = { r: boolean; w: boolean; x: boolean };
type Entity = "owner" | "group" | "others";

const PRESETS: { label: string; desc: string; value: string }[] = [
  { label: "644", desc: "File: owner rw, group/others r", value: "644" },
  { label: "755", desc: "Dir/executable: owner rwx, group/others rx", value: "755" },
  { label: "600", desc: "Private file: owner rw only", value: "600" },
  { label: "700", desc: "Private dir: owner rwx only", value: "700" },
  { label: "777", desc: "Full access (not recommended)", value: "777" },
  { label: "444", desc: "Read-only for everyone", value: "444" },
  { label: "664", desc: "Group-writable file", value: "664" },
  { label: "775", desc: "Group-writable directory", value: "775" },
];

function octalToPerm(digit: number): Perm {
  return { r: !!(digit & 4), w: !!(digit & 2), x: !!(digit & 1) };
}

function permToOctal(p: Perm): number {
  return (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0);
}

function permToSymbolic(p: Perm): string {
  return `${p.r ? "r" : "-"}${p.w ? "w" : "-"}${p.x ? "x" : "-"}`;
}

function octalStringToPerms(s: string): { owner: Perm; group: Perm; others: Perm } | null {
  if (!/^[0-7]{3}$/.test(s)) return null;
  return {
    owner:  octalToPerm(parseInt(s[0])),
    group:  octalToPerm(parseInt(s[1])),
    others: octalToPerm(parseInt(s[2])),
  };
}

export default function ChmodCalculator() {
  const [owner,  setOwner]  = useState<Perm>({ r: true,  w: true,  x: false });
  const [group,  setGroup]  = useState<Perm>({ r: true,  w: false, x: false });
  const [others, setOthers] = useState<Perm>({ r: true,  w: false, x: false });
  const [octalInput, setOctalInput] = useState("644");

  const octal = `${permToOctal(owner)}${permToOctal(group)}${permToOctal(others)}`;
  const symbolic = `-${permToSymbolic(owner)}${permToSymbolic(group)}${permToSymbolic(others)}`;
  const command = `chmod ${octal} filename`;

  const applyOctal = (val: string) => {
    setOctalInput(val);
    const perms = octalStringToPerms(val);
    if (perms) {
      setOwner(perms.owner);
      setGroup(perms.group);
      setOthers(perms.others);
    }
  };

  const toggleBit = (entity: Entity, bit: keyof Perm) => {
    const setter = entity === "owner" ? setOwner : entity === "group" ? setGroup : setOthers;
    const current = entity === "owner" ? owner : entity === "group" ? group : others;
    const updated = { ...current, [bit]: !current[bit] };
    setter(updated);
    const newOctal =
      `${permToOctal(entity === "owner"  ? updated : owner)}` +
      `${permToOctal(entity === "group"  ? updated : group)}` +
      `${permToOctal(entity === "others" ? updated : others)}`;
    setOctalInput(newOctal);
  };

  const applyPreset = (val: string) => applyOctal(val);

  const BIT_LABEL: Record<keyof Perm, string> = { r: "Read", w: "Write", x: "Execute" };
  const BIT_OCTAL: Record<keyof Perm, number> = { r: 4, w: 2, x: 1 };

  const rows: { entity: Entity; label: string; perm: Perm }[] = [
    { entity: "owner",  label: "Owner (u)", perm: owner  },
    { entity: "group",  label: "Group (g)", perm: group  },
    { entity: "others", label: "Others (o)", perm: others },
  ];

  return (
    <div className="tool-page">
      <h1>Chmod Calculator</h1>
      <p className="desc">Calculate Linux and Unix file permissions visually. Get the octal value, symbolic notation, and ready-to-run chmod command.</p>

      {/* Presets */}
      <div className="btn-group mb-4">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            className={`btn ${octal === p.value ? "btn-primary" : ""}`}
            onClick={() => applyPreset(p.value)}
            title={p.desc}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Permission checkboxes */}
      <div className="card mb-4" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 12px", borderBottom: "1px solid var(--border)", width: "140px" }}>Entity</th>
              {(["r", "w", "x"] as (keyof Perm)[]).map((bit) => (
                <th key={bit} style={{ textAlign: "center", padding: "8px 16px", borderBottom: "1px solid var(--border)" }}>
                  {BIT_LABEL[bit]}
                  <span style={{ color: "var(--text-secondary)", fontWeight: 400, marginLeft: "6px" }}>({BIT_OCTAL[bit]})</span>
                </th>
              ))}
              <th style={{ textAlign: "center", padding: "8px 16px", borderBottom: "1px solid var(--border)" }}>Octal</th>
              <th style={{ textAlign: "center", padding: "8px 16px", borderBottom: "1px solid var(--border)" }}>Symbolic</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ entity, label, perm }) => (
              <tr key={entity}>
                <td style={{ padding: "12px", fontWeight: 500 }}>{label}</td>
                {(["r", "w", "x"] as (keyof Perm)[]).map((bit) => (
                  <td key={bit} style={{ textAlign: "center", padding: "12px" }}>
                    <input
                      type="checkbox"
                      checked={perm[bit]}
                      onChange={() => toggleBit(entity, bit)}
                      style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "var(--accent)" }}
                    />
                  </td>
                ))}
                <td style={{ textAlign: "center", padding: "12px", fontFamily: "var(--font-geist-mono), monospace", fontSize: "18px", fontWeight: 700 }}>
                  {permToOctal(perm)}
                </td>
                <td style={{ textAlign: "center", padding: "12px", fontFamily: "var(--font-geist-mono), monospace" }}>
                  {permToSymbolic(perm)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Octal input */}
      <label>Octal value (type directly)</label>
      <div className="flex gap-2 items-center mb-4">
        <input
          type="text"
          value={octalInput}
          onChange={(e) => applyOctal(e.target.value)}
          maxLength={3}
          className="font-mono"
          style={{ width: "80px", fontSize: "24px", textAlign: "center", padding: "8px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--input-bg)", color: "var(--text)", outline: "none" }}
          spellCheck={false}
        />
        {!/^[0-7]{3}$/.test(octalInput) && (
          <span className="error-text">Must be 3 octal digits (0–7)</span>
        )}
      </div>

      {/* Results */}
      <div className="card mb-4">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Octal</p>
            <p style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-geist-mono), monospace" }}>{octal}</p>
          </div>
          <div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Symbolic</p>
            <p style={{ fontSize: "20px", fontWeight: 600, fontFamily: "var(--font-geist-mono), monospace" }}>{symbolic}</p>
          </div>
          <div>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Command</p>
            <p style={{ fontSize: "14px", fontFamily: "var(--font-geist-mono), monospace" }}>{command}</p>
          </div>
        </div>
        <div className="btn-group mt-3">
          <CopyButton text={octal} />
          <CopyButton text={command} />
        </div>
      </div>

      <section className="tool-prose">
        <h2>About the Chmod Calculator</h2>
        <p>The Chmod Calculator converts between visual permission checkboxes, octal notation, and symbolic notation for Linux and Unix file permissions. Toggle read, write, and execute for owner, group, and others — the octal value and <code>chmod</code> command update instantly. You can also type an octal value directly (e.g., <code>755</code>) to see what it means.</p>
        <p>Every file and directory on a Unix system has three permission sets: <strong>owner</strong> (the user who created the file), <strong>group</strong> (users in the file&apos;s assigned group), and <strong>others</strong> (everyone else). Each set has three bits: <strong>read</strong> (r = 4), <strong>write</strong> (w = 2), and <strong>execute</strong> (x = 1). The octal value is the sum of the bits for each set — for example, <code>rwx</code> = 4+2+1 = 7, <code>r-x</code> = 4+0+1 = 5.</p>
        <p>Common values: <code>644</code> for regular files (owner can edit, others can read), <code>755</code> for executables and directories (owner can do everything, others can read and traverse), <code>600</code> for private files like SSH keys. All calculation runs locally in your browser.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What does chmod 755 mean?</summary>
          <p><code>755</code> means: owner has read+write+execute (7 = 4+2+1), group has read+execute (5 = 4+0+1), others have read+execute (5 = 4+0+1). This is the standard permission for executable files and directories — the owner can modify them, while everyone else can read and execute/traverse them.</p>
        </details>
        <details>
          <summary>What does chmod 644 mean?</summary>
          <p><code>644</code> means: owner has read+write (6 = 4+2+0), group has read-only (4), others have read-only (4). This is the standard permission for regular files — the owner can edit the file, but others can only read it.</p>
        </details>
        <details>
          <summary>What is the execute bit for a directory?</summary>
          <p>For directories, the execute bit means &ldquo;traverse&rdquo; — the ability to <code>cd</code> into the directory and access files within it. A directory without the execute bit cannot be entered even if you have read permission. This is why directories typically need the execute bit set (e.g., <code>755</code> rather than <code>644</code>).</p>
        </details>
        <details>
          <summary>What permissions should I set on SSH keys?</summary>
          <p>Private keys (<code>~/.ssh/id_rsa</code>, <code>~/.ssh/id_ed25519</code>) should be <code>600</code> — readable and writable only by the owner. The <code>~/.ssh</code> directory should be <code>700</code>. SSH will refuse to use keys with overly permissive settings.</p>
        </details>
        <details>
          <summary>What is the difference between octal and symbolic notation?</summary>
          <p>Octal notation uses three digits (e.g., <code>755</code>), one per entity. Symbolic notation uses letters (e.g., <code>rwxr-xr-x</code>), with a <code>-</code> for unset bits. Both represent the same permissions. The <code>chmod</code> command accepts both: <code>chmod 755 file</code> and <code>chmod u=rwx,g=rx,o=rx file</code> are equivalent.</p>
        </details>
      </section>
    </div>
  );
}
