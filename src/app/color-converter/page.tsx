"use client";


import { useState, useEffect } from "react";
import { CopyButton } from "@/components/CopyButton";

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#2563eb");
  const [rgb, setRgb] = useState({ r: 37, g: 99, b: 235 });
  const [hsl, setHsl] = useState({ h: 221, s: 83, l: 53 });

  const updateFromHex = (h: string) => {
    setHex(h);
    const c = hexToRgb(h);
    if (c) {
      setRgb({ r: c[0], g: c[1], b: c[2] });
      const [hh, ss, ll] = rgbToHsl(c[0], c[1], c[2]);
      setHsl({ h: hh, s: ss, l: ll });
    }
  };

  useEffect(() => { updateFromHex(hex); }, []); // eslint-disable-line

  const hexStr = hex;
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <div className="tool-page">
      <h1>Color Converter</h1>
      <p className="desc">Convert between HEX, RGB, and HSL color formats.</p>
      <div className="flex gap-4 items-start flex-wrap mb-4">
        <div className="w-24 h-24 rounded-lg border border-[var(--border)]" style={{ background: hex }} />
        <input type="color" value={hex} onChange={(e) => updateFromHex(e.target.value)} className="w-16 h-16 cursor-pointer" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label>HEX</label>
          <div className="flex gap-2">
            <input type="text" value={hexStr} onChange={(e) => updateFromHex(e.target.value)} className="w-full" />
            <CopyButton text={hexStr} />
          </div>
        </div>
        <div>
          <label>RGB</label>
          <div className="flex gap-2">
            <input type="text" value={rgbStr} readOnly className="w-full" />
            <CopyButton text={rgbStr} />
          </div>
        </div>
        <div>
          <label>HSL</label>
          <div className="flex gap-2">
            <input type="text" value={hslStr} readOnly className="w-full" />
            <CopyButton text={hslStr} />
          </div>
        </div>
      </div>

      <section className="tool-prose">
        <h2>About the Color Converter</h2>
        <p>The Color Converter transforms any color value between HEX, RGB, and HSL formats instantly. Enter a hex code like <code>#2563eb</code>, an RGB value like <code>rgb(37, 99, 235)</code>, or an HSL value and get all three equivalent representations in one click.</p>
        <p>Different color formats serve different purposes in web development. HEX (<code>#rrggbb</code>) is the most compact and is ubiquitous in CSS and design tools. RGB (<code>rgb(r, g, b)</code>) is useful for dynamic color manipulation in JavaScript, since each channel is a separate numeric value. HSL (Hue, Saturation, Lightness) is the most human-readable format — it makes it easy to create variations of a color by adjusting lightness or saturation while keeping the hue constant, which is ideal for generating accessible color palettes.</p>
        <p>All conversion runs locally in your browser using standard math transformations. No color data is sent to any server.</p>
      </section>
    </div>
  );
}
