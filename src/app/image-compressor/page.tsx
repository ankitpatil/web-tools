"use client";


import { useState, useRef } from "react";
import { CopyButton } from "@/components/CopyButton";

export default function ImageCompressor() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [quality, setQuality] = useState(0.8);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInput(ev.target?.result as string);
      compress(ev.target?.result as string, quality);
    };
    reader.readAsDataURL(file);
  };

  const compress = (dataUrl: string, q: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const compressed = canvas.toDataURL(format, q);
      setOutput(compressed);
      setCompressedSize(Math.round((compressed.length - "data:image/jpeg;base64,".length) * 0.75));
    };
    img.src = dataUrl;
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = output;
    a.download = `compressed.${format.split("/")[1]}`;
    a.click();
  };

  return (
    <div className="tool-page">
      <h1>Image Compressor</h1>
      <p className="desc">Compress images in your browser. No server uploads.</p>
      
      <div className="btn-group mb-4">
        <button className="btn" onClick={() => fileInputRef.current?.click()}>📁 Upload Image</button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      <div className="flex gap-4 mb-4">
        <div>
          <label className="text-sm">Format:</label>
          <select value={format} onChange={(e) => { setFormat(e.target.value as any); input && compress(input, quality); }} className="btn ml-2">
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
        <div>
          <label className="text-sm">Quality: {Math.round(quality * 100)}%</label>
          <input type="range" min="0.1" max="1" step="0.1" value={quality} onChange={(e) => { setQuality(parseFloat(e.target.value)); input && compress(input, parseFloat(e.target.value)); }} className="ml-2" />
        </div>
      </div>

      {input && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm mb-2">Original: {formatBytes(originalSize)}</p>
            <img src={input} alt="Original" className="max-w-full border rounded" />
          </div>
          <div>
            <p className="text-sm mb-2">Compressed: {formatBytes(compressedSize)} ({originalSize ? Math.round((1 - compressedSize/originalSize) * 100) : 0}% smaller)</p>
            <img src={output} alt="Compressed" className="max-w-full border rounded" />
          </div>
        </div>
      )}

      {output && (
        <div className="btn-group mt-4">
          <button className="btn btn-primary" onClick={download}>💾 Download</button>
          <CopyButton text={output} />
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
