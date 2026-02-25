"use client";
import { useState, useRef, useCallback } from "react";
import QRCode from "qrcode";

export default function QrGenerator() {
  const [text, setText] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(async () => {
    if (!text.trim()) return;
    try {
      const url = await QRCode.toDataURL(text, { width: 300, margin: 2 });
      setDataUrl(url);
    } catch {
      setDataUrl("");
    }
  }, [text]);

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <div className="tool-page">
      <h1>QR Code Generator</h1>
      <p className="desc">Generate QR codes from text or URLs with download support.</p>
      <textarea className="tool-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text or URL..." style={{ minHeight: 80 }} />
      <canvas ref={canvasRef} className="hidden" />
      <div className="btn-group">
        <button className="btn btn-primary" onClick={generate}>Generate</button>
        {dataUrl && <button className="btn" onClick={download}>⬇️ Download PNG</button>}
        <button className="btn" onClick={() => { setText(""); setDataUrl(""); }}>Clear</button>
      </div>
      {dataUrl && (
        <div className="mt-4 flex justify-center">
          <img src={dataUrl} alt="QR Code" className="rounded-lg border border-[var(--border)]" />
        </div>
      )}
    </div>
  );
}
