"use client";
import { useState, useRef } from "react";
import { CopyButton } from "@/components/CopyButton";

export default function ImageToBase64() {
  const [output, setOutput] = useState("");
  const [preview, setPreview] = useState("");
  const [filename, setFilename] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setOutput(result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="tool-page">
      <h1>Image to Base64</h1>
      <p className="desc">Convert images to Base64 encoding for embedding in HTML/CSS.</p>
      
      <div className="btn-group mb-4">
        <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>📁 Upload Image</button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      {preview && (
        <div className="mb-4">
          <img src={preview} alt="Preview" className="max-w-xs border rounded" />
        </div>
      )}

      {output && (
        <>
          <textarea className="tool-input font-mono text-xs" value={output} readOnly rows={6} />
          <div className="btn-group mt-3">
            <CopyButton text={output} />
          </div>
          <p className="text-sm mt-2 text-[var(--text-secondary)]">
            Use in HTML: &lt;img src="{output.slice(0, 50)}..." /&gt;
          </p>
        </>
      )}
    </div>
  );
}
