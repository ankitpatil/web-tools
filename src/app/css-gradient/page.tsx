"use client";


import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export default function CssGradient() {
  const [color1, setColor1] = useState("#2563eb");
  const [color2, setColor2] = useState("#7c3aed");
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<"linear" | "radial">("linear");

  const css = type === "linear"
    ? `background: linear-gradient(${angle}deg, ${color1}, ${color2});`
    : `background: radial-gradient(circle, ${color1}, ${color2});`;

  const style = type === "linear"
    ? { background: `linear-gradient(${angle}deg, ${color1}, ${color2})` }
    : { background: `radial-gradient(circle, ${color1}, ${color2})` };

  return (
    <div className="tool-page">
      <h1>CSS Gradient Generator</h1>
      <p className="desc">Build beautiful CSS gradients visually.</p>
      <div className="w-full h-48 rounded-lg border border-[var(--border)] mb-4" style={style} />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-4">
        <div>
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="w-full">
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>
        {type === "linear" && (
          <div>
            <label>Angle: {angle}°</label>
            <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(+e.target.value)} className="w-full" />
          </div>
        )}
        <div>
          <label>Color 1</label>
          <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-full h-10" />
        </div>
        <div>
          <label>Color 2</label>
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full h-10" />
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="output-box flex-1" style={{ minHeight: "auto" }}>{css}</div>
        <CopyButton text={css} />
      </div>

      <section className="tool-prose">
        <h2>About the CSS Gradient Generator</h2>
        <p>The CSS Gradient Generator lets you build beautiful linear and radial CSS gradients with a visual color picker and live preview. Adjust colors, positions, and angles, then copy the generated <code>background: linear-gradient(...)</code> or <code>background: radial-gradient(...)</code> CSS in one click.</p>
        <p>CSS gradients are a powerful way to create rich backgrounds, button effects, and overlays without using image files. Linear gradients transition between colors along a straight line at any angle; radial gradients radiate outward from a center point. Both are hardware-accelerated by modern browsers and render crisply at any resolution, unlike raster images.</p>
        <p>Browser support for CSS gradients is universal across all modern browsers. Generated CSS is production-ready and can be pasted directly into any stylesheet. All processing runs locally in your browser — no data is sent to any server.</p>
      </section>
    </div>
  );
}
