"use client";

import { useState, useMemo } from "react";

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance([r, g, b]: [number, number, number]): number {
  const ch = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

function contrast(hex1: string, hex2: string): number | null {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return null;
  const l1 = luminance(rgb1);
  const l2 = luminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker  = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

// Suggest a darker/lighter version that passes AA
function suggestFg(bg: string, target: number): string | null {
  const bgRgb = hexToRgb(bg);
  if (!bgRgb) return null;
  const bgL = luminance(bgRgb);
  // Try black and white first
  const black: [number, number, number] = [0, 0, 0];
  const white: [number, number, number] = [255, 255, 255];
  const cBlack = (Math.max(bgL, luminance(black)) + 0.05) / (Math.min(bgL, luminance(black)) + 0.05);
  const cWhite = (Math.max(bgL, luminance(white)) + 0.05) / (Math.min(bgL, luminance(white)) + 0.05);
  if (cBlack >= target) return rgbToHex(black);
  if (cWhite >= target) return rgbToHex(white);
  return null;
}

const PASS = "var(--success)";
const FAIL = "var(--error)";

interface BadgeProps { label: string; pass: boolean; ratio: number; required: number; }
function Badge({ label, pass, ratio, required }: BadgeProps) {
  return (
    <div style={{ textAlign: "center", padding: "12px 16px", borderRadius: "8px", border: `1px solid ${pass ? PASS : FAIL}`, background: pass ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)" }}>
      <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>{label}</p>
      <p style={{ fontSize: "20px", fontWeight: 700, color: pass ? PASS : FAIL }}>{pass ? "Pass" : "Fail"}</p>
      <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>requires {required}:1</p>
    </div>
  );
}

const PAIRS = [
  { label: "Black on White",    fg: "#000000", bg: "#ffffff" },
  { label: "White on Black",    fg: "#ffffff", bg: "#000000" },
  { label: "Blue on White",     fg: "#2563eb", bg: "#ffffff" },
  { label: "White on Blue",     fg: "#ffffff", bg: "#2563eb" },
  { label: "Dark on Yellow",    fg: "#1a1a1a", bg: "#fde047" },
  { label: "Red on White",      fg: "#dc2626", bg: "#ffffff" },
];

export default function ContrastChecker() {
  const [fg, setFg] = useState("#1a1a1a");
  const [bg, setBg] = useState("#ffffff");

  const ratio = useMemo(() => contrast(fg, bg), [fg, bg]);
  const ratioStr = ratio ? ratio.toFixed(2) : "—";

  const aa_normal   = ratio ? ratio >= 4.5  : false;
  const aa_large    = ratio ? ratio >= 3.0  : false;
  const aaa_normal  = ratio ? ratio >= 7.0  : false;
  const aaa_large   = ratio ? ratio >= 4.5  : false;
  const aa_ui       = ratio ? ratio >= 3.0  : false;

  const suggestion = useMemo(() => (!aa_normal && bg ? suggestFg(bg, 4.5) : null), [aa_normal, bg]);

  const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div>
      <label>{label}</label>
      <div className="flex gap-2 items-center">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
          style={{ width: "48px", height: "40px", padding: "2px", cursor: "pointer", borderRadius: "6px" }} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          className="font-mono" style={{ flex: 1 }} />
      </div>
    </div>
  );

  return (
    <div className="tool-page">
      <h1>WCAG Contrast Checker</h1>
      <p className="desc">Check foreground/background color contrast ratios against WCAG 2.1 AA and AAA accessibility standards.</p>

      {/* Quick pairs */}
      <div className="btn-group mb-4" style={{ flexWrap: "wrap" }}>
        {PAIRS.map((p) => (
          <button key={p.label} className="btn" style={{ fontSize: "12px" }} onClick={() => { setFg(p.fg); setBg(p.bg); }}>{p.label}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <ColorInput label="Foreground (text)" value={fg} onChange={setFg} />
        <ColorInput label="Background" value={bg} onChange={setBg} />
      </div>

      {/* Preview */}
      <div className="card mb-6" style={{ background: bg, borderColor: "transparent", padding: "24px" }}>
        <p style={{ color: fg, fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Large Text (24px bold)</p>
        <p style={{ color: fg, fontSize: "16px", marginBottom: "8px" }}>Normal body text at 16px. This is how your text will appear on this background color.</p>
        <p style={{ color: fg, fontSize: "14px" }}>Smaller text at 14px — often used for captions and UI labels.</p>
      </div>

      {/* Ratio */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Contrast ratio</p>
        <p style={{ fontSize: "52px", fontWeight: 800, letterSpacing: "-2px", color: aa_normal ? PASS : FAIL }}>{ratioStr}:1</p>
        <button className="btn" style={{ marginTop: "8px" }} onClick={() => { const tmp = fg; setFg(bg); setBg(tmp); }}>⇄ Swap colors</button>
      </div>

      {/* Badges */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", marginBottom: "24px" }}>
        <Badge label="AA Normal"  pass={aa_normal}  ratio={ratio ?? 0} required={4.5} />
        <Badge label="AA Large"   pass={aa_large}   ratio={ratio ?? 0} required={3.0} />
        <Badge label="AAA Normal" pass={aaa_normal} ratio={ratio ?? 0} required={7.0} />
        <Badge label="AAA Large"  pass={aaa_large}  ratio={ratio ?? 0} required={4.5} />
        <Badge label="AA UI"      pass={aa_ui}      ratio={ratio ?? 0} required={3.0} />
      </div>

      {suggestion && !aa_normal && (
        <div className="card mb-4" style={{ borderColor: "var(--accent)" }}>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>
            Suggestion: use <strong>{suggestion}</strong> as foreground on <strong>{bg}</strong> to pass AA
          </p>
          <div style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
            <div style={{ width: "32px", height: "32px", background: suggestion, borderRadius: "6px", border: "1px solid var(--border)" }} />
            <span className="font-mono" style={{ fontSize: "14px" }}>{suggestion}</span>
            <button className="btn" style={{ fontSize: "12px" }} onClick={() => setFg(suggestion!)}>Use this</button>
          </div>
        </div>
      )}

      <section className="tool-prose">
        <h2>About WCAG Contrast Requirements</h2>
        <p>WCAG (Web Content Accessibility Guidelines) 2.1 defines minimum contrast ratios to ensure text is readable for people with low vision or color blindness. The contrast ratio is calculated from the relative luminance of the two colors using the formula <code>(L1 + 0.05) / (L2 + 0.05)</code>, where L1 is the lighter color's luminance. A ratio of 1:1 is no contrast (identical colors); 21:1 is maximum contrast (black on white).</p>
        <p>There are two conformance levels: <strong>AA</strong> (the legal minimum in most jurisdictions) requires 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold), and 3:1 for UI components and graphical elements. <strong>AAA</strong> (enhanced) requires 7:1 for normal text and 4.5:1 for large text — recommended for critical content. Many jurisdictions including the EU, UK, and US federal government legally require at least WCAG AA compliance.</p>
        <p>Relative luminance accounts for gamma correction and the non-linear sensitivity of human vision. Pure chromatic colors like red (<code>#ff0000</code> on white = 4.0:1) often fail AA — always verify with this tool before finalizing color choices.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What counts as "large text" in WCAG?</summary>
          <p>WCAG defines large text as 18 point (24px) or larger for normal weight, or 14 point (approximately 18.67px) or larger for bold text. Large text only needs a 3:1 contrast ratio for AA compliance, compared to 4.5:1 for smaller text.</p>
        </details>
        <details>
          <summary>Do placeholder text and disabled elements need to meet contrast requirements?</summary>
          <p>No. WCAG explicitly exempts text or images of text that are part of an inactive UI component (disabled), decorative, or not visible to anyone. Placeholder text in form fields is technically also exempt, though many accessibility practitioners recommend meeting at least 3:1 for placeholder text as good practice.</p>
        </details>
        <details>
          <summary>What is the difference between AA and AAA?</summary>
          <p>AA is the minimum acceptable standard (4.5:1 for normal text). AAA (7:1) is the enhanced standard, recommended for text-heavy content and critical interfaces. AAA is not required for full WCAG 2.1 conformance — it is an optional enhancement. Many government and healthcare sites target AAA for maximum accessibility.</p>
        </details>
        <details>
          <summary>Does contrast ratio apply to icons and images?</summary>
          <p>Yes — WCAG 1.4.11 (Non-text Contrast, AA) requires that UI components and graphical elements meaningful for understanding content meet a 3:1 contrast ratio against adjacent colors. This includes icons, form borders, focus indicators, and chart lines.</p>
        </details>
      </section>
    </div>
  );
}
