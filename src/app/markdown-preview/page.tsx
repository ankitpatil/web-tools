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

      <section className="tool-prose">
        <h2>About the Markdown Preview Editor</h2>
        <p>The Markdown Preview editor renders Markdown syntax as formatted HTML in real time. Write Markdown on the left and see a live preview on the right — including headings, bold/italic text, code blocks, lists, links, tables, and blockquotes. Supports GitHub-flavored Markdown (GFM).</p>
        <p>Markdown is a lightweight markup language created by John Gruber in 2004. It is the standard format for README files on GitHub, documentation sites, blog posts (via static site generators like Hugo and Jekyll), note-taking apps, and chat messages. Its plain-text syntax is readable without rendering and converts cleanly to HTML.</p>
        <p>This tool uses the marked library for parsing. All rendering runs locally in your browser — no Markdown content is sent to any server. The tool is ideal for drafting READMEs, testing Markdown syntax, and previewing documentation before publishing.</p>
      </section>
    </div>
  );
}
