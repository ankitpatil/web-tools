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

      <section className="tool-prose">
        <h2>About the Image to Base64 Converter</h2>
        <p>The Image to Base64 converter encodes any image file into a Base64 data URI, ready for embedding directly in HTML <code>&lt;img&gt;</code> tags, CSS <code>background-image</code> properties, or JSON payloads. Upload an image and get the <code>data:image/...;base64,...</code> string instantly.</p>
        <p>Embedding images as Base64 data URIs eliminates the extra HTTP request that a separate image file would require. This technique is useful for small icons, loading spinners, and inline email images where the cost of an additional network request outweighs the overhead of encoding. It is also commonly used to pass images through JSON APIs without multipart form encoding.</p>
        <p>Keep in mind that Base64 encoding increases file size by approximately 33% compared to the original binary. For large images, a separate file with proper caching headers is almost always the better choice. All conversion runs locally in your browser using the FileReader API.</p>
      </section>
    </div>
  );
}
