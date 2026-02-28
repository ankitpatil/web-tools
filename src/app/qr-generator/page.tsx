"use client";


import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";

export default function QrGenerator() {
  const [text, setText] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [size, setSize] = useState(300);
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = async () => {
    if (!text.trim()) return;
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: { dark: darkColor, light: lightColor },
        errorCorrectionLevel: errorLevel,
      });
      setDataUrl(url);
    } catch { setDataUrl(""); }
  };

  useEffect(() => {
    if (text) generate();
  }, [size, darkColor, lightColor, errorLevel]);

  const download = (format: "png" | "svg") => {
    if (!dataUrl && format === "png") return;
    if (format === "svg") {
      QRCode.toString(text, {
        type: "svg",
        width: size,
        margin: 2,
        color: { dark: darkColor, light: lightColor },
        errorCorrectionLevel: errorLevel,
      }).then(svg => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "qrcode.svg";
        a.click();
        URL.revokeObjectURL(url);
      });
      return;
    }
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="tool-page">
      <h1>QR Code Generator</h1>
      <p className="desc">Generate QR codes with custom colors, size, and error correction.</p>
      
      <textarea className="tool-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text or URL..." style={{ minHeight: 80 }} />
      
      <div className="grid gap-4 md:grid-cols-4 mb-4">
        <div>
          <label className="text-sm">Size (px)</label>
          <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="tool-input">
            <option value={200}>200×200</option>
            <option value={300}>300×300</option>
            <option value={400}>400×400</option>
            <option value={500}>500×500</option>
          </select>
        </div>
        <div>
          <label className="text-sm">Error Correction</label>
          <select value={errorLevel} onChange={(e) => setErrorLevel(e.target.value as any)} className="tool-input">
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>
        <div>
          <label className="text-sm">QR Color</label>
          <input type="color" value={darkColor} onChange={(e) => setDarkColor(e.target.value)} className="tool-input h-10 p-1" />
        </div>
        <div>
          <label className="text-sm">Background</label>
          <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} className="tool-input h-10 p-1" />
        </div>
      </div>

      <div className="btn-group">
        <button className="btn btn-primary" onClick={generate}>Generate</button>
        {dataUrl && <button className="btn" onClick={() => download("png")}>⬇️ PNG</button>}
        {text && <button className="btn" onClick={() => download("svg")}>⬇️ SVG</button>}
        <button className="btn" onClick={() => { setText(""); setDataUrl(""); }}>Clear</button>
      </div>

      {dataUrl && (
        <div className="mt-4 flex justify-center">
          <img src={dataUrl} alt="QR Code" className="rounded-lg border border-[var(--border)]" />
        </div>
      )}

      <section className="tool-prose">
        <h2>About the QR Code Generator</h2>
        <p>The QR Code Generator creates custom QR codes from any text, URL, or data string. Customize the foreground and background colors, set the output size, and choose the error correction level (L, M, Q, or H). Download the QR code as a PNG or SVG file.</p>
        <p>QR codes (Quick Response codes) are two-dimensional barcodes that encode text or URLs and can be scanned by any smartphone camera. They are used for website links, app downloads, contact cards (vCards), payment links, Wi-Fi credentials, and event ticketing. Error correction allows QR codes to remain scannable even when partially obscured or damaged — higher correction levels increase redundancy at the cost of a denser code.</p>
        <p>All QR code generation runs locally in your browser using the qrcode.js library. No data is sent to any server, making it safe to generate QR codes for private URLs or internal content.</p>
      </section>
    </div>
  );
}
