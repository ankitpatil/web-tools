"use client";
import { useState, useMemo } from "react";
import { marked } from "marked";

const defaultMd = `# Hello Markdown

This is a **live preview** editor.

- Item 1
- Item 2
- Item 3

\`\`\`js
console.log("Hello!");
\`\`\`
`;

export default function MarkdownPreview() {
  const [md, setMd] = useState(defaultMd);
  const html = useMemo(() => marked.parse(md, { async: false }) as string, [md]);

  return (
    <div className="tool-page">
      <h1>Markdown Preview</h1>
      <p className="desc">Write Markdown on the left, see the rendered preview on the right.</p>
      <div className="grid gap-4 md:grid-cols-2" style={{ minHeight: 400 }}>
        <textarea className="tool-input h-full" value={md} onChange={(e) => setMd(e.target.value)} style={{ minHeight: 400 }} />
        <div className="output-box prose dark:prose-invert max-w-none" style={{ minHeight: 400 }} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
