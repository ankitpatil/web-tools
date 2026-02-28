"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

interface MetaFields {
  title: string;
  description: string;
  keywords: string;
  author: string;
  canonical: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
}

const DEFAULT: MetaFields = {
  title: "My Awesome Page",
  description: "A short description of this page that appears in search engine results.",
  keywords: "keyword1, keyword2, keyword3",
  author: "",
  canonical: "https://example.com/my-page",
  robots: "index, follow",
  ogTitle: "",
  ogDescription: "",
  ogImage: "https://example.com/og-image.png",
  ogUrl: "",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  twitterSite: "@yourtwitterhandle",
};

function generateTags(f: MetaFields): string {
  const lines: string[] = [];
  const og = (prop: string, content: string) => content && lines.push(`<meta property="og:${prop}" content="${content}" />`);
  const tw = (name: string, content: string) => content && lines.push(`<meta name="twitter:${name}" content="${content}" />`);
  const meta = (name: string, content: string) => content && lines.push(`<meta name="${name}" content="${content}" />`);
  const link = (rel: string, href: string) => href && lines.push(`<link rel="${rel}" href="${href}" />`);

  lines.push(`<title>${f.title}</title>`);
  meta("description", f.description);
  if (f.keywords) meta("keywords", f.keywords);
  if (f.author)   meta("author", f.author);
  if (f.robots)   meta("robots", f.robots);
  link("canonical", f.canonical);

  lines.push("");
  og("title",       f.ogTitle || f.title);
  og("description", f.ogDescription || f.description);
  og("url",         f.ogUrl || f.canonical);
  og("type",        f.ogType);
  og("image",       f.ogImage);

  lines.push("");
  tw("card",        f.twitterCard);
  tw("title",       f.twitterTitle || f.ogTitle || f.title);
  tw("description", f.twitterDescription || f.ogDescription || f.description);
  tw("image",       f.twitterImage || f.ogImage);
  if (f.twitterSite) tw("site", f.twitterSite);

  return lines.join("\n");
}

export default function MetaTagGenerator() {
  const [fields, setFields] = useState<MetaFields>(DEFAULT);
  const [tab, setTab] = useState<"basic" | "og" | "twitter">("basic");

  const set = (key: keyof MetaFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const tags = useMemo(() => generateTags(fields), [fields]);

  const titleLen = fields.title.length;
  const descLen  = fields.description.length;

  const serpTitle  = fields.title.length > 60  ? fields.title.slice(0, 60) + "…"  : fields.title;
  const serpDesc   = fields.description.length > 160 ? fields.description.slice(0, 160) + "…" : fields.description;
  const serpUrl    = fields.canonical || "https://example.com/my-page";

  return (
    <div className="tool-page">
      <h1>Meta Tag Generator</h1>
      <p className="desc">Generate SEO, Open Graph, and Twitter Card meta tags with a live search result preview. Copy the HTML and paste it into your <code>&lt;head&gt;</code>.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
        {/* Left: inputs */}
        <div>
          <div className="btn-group mb-4">
            <button className={`btn ${tab === "basic" ? "btn-primary" : ""}`}   onClick={() => setTab("basic")}>Basic SEO</button>
            <button className={`btn ${tab === "og" ? "btn-primary" : ""}`}       onClick={() => setTab("og")}>Open Graph</button>
            <button className={`btn ${tab === "twitter" ? "btn-primary" : ""}`}  onClick={() => setTab("twitter")}>Twitter Card</button>
          </div>

          {tab === "basic" && (
            <>
              <label>
                Title
                <span style={{ float: "right", fontSize: "12px", color: titleLen > 60 ? "var(--error)" : titleLen > 50 ? "#f59e0b" : "var(--text-secondary)" }}>
                  {titleLen}/60
                </span>
              </label>
              <input type="text" value={fields.title} onChange={set("title")} style={{ width: "100%", marginBottom: "12px" }} />

              <label>
                Description
                <span style={{ float: "right", fontSize: "12px", color: descLen > 160 ? "var(--error)" : descLen > 140 ? "#f59e0b" : "var(--text-secondary)" }}>
                  {descLen}/160
                </span>
              </label>
              <textarea className="tool-input" rows={3} value={fields.description} onChange={set("description")} style={{ marginBottom: "12px" }} />

              <label>Keywords (comma-separated)</label>
              <input type="text" value={fields.keywords} onChange={set("keywords")} style={{ width: "100%", marginBottom: "12px" }} />

              <label>Author</label>
              <input type="text" value={fields.author} onChange={set("author")} placeholder="Jane Smith" style={{ width: "100%", marginBottom: "12px" }} />

              <label>Canonical URL</label>
              <input type="text" value={fields.canonical} onChange={set("canonical")} placeholder="https://example.com/page" style={{ width: "100%", marginBottom: "12px" }} />

              <label>Robots</label>
              <select value={fields.robots} onChange={set("robots")} style={{ width: "100%", marginBottom: "12px" }}>
                <option value="index, follow">index, follow (default)</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </>
          )}

          {tab === "og" && (
            <>
              <label>OG Title (leave blank to inherit)</label>
              <input type="text" value={fields.ogTitle} onChange={set("ogTitle")} placeholder={fields.title} style={{ width: "100%", marginBottom: "12px" }} />

              <label>OG Description (leave blank to inherit)</label>
              <textarea className="tool-input" rows={3} value={fields.ogDescription} onChange={set("ogDescription")} placeholder={fields.description} style={{ marginBottom: "12px" }} />

              <label>OG Image URL</label>
              <input type="text" value={fields.ogImage} onChange={set("ogImage")} placeholder="https://example.com/og.png" style={{ width: "100%", marginBottom: "12px" }} />
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "12px" }}>Recommended: 1200×630px. JPG or PNG.</p>

              <label>OG URL (leave blank to use canonical)</label>
              <input type="text" value={fields.ogUrl} onChange={set("ogUrl")} placeholder={fields.canonical} style={{ width: "100%", marginBottom: "12px" }} />

              <label>OG Type</label>
              <select value={fields.ogType} onChange={set("ogType")} style={{ width: "100%", marginBottom: "12px" }}>
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="product">product</option>
                <option value="profile">profile</option>
                <option value="video">video</option>
              </select>
            </>
          )}

          {tab === "twitter" && (
            <>
              <label>Twitter Card Type</label>
              <select value={fields.twitterCard} onChange={set("twitterCard")} style={{ width: "100%", marginBottom: "12px" }}>
                <option value="summary_large_image">summary_large_image (large image preview)</option>
                <option value="summary">summary (small thumbnail)</option>
                <option value="app">app</option>
                <option value="player">player</option>
              </select>

              <label>Twitter Title (leave blank to inherit)</label>
              <input type="text" value={fields.twitterTitle} onChange={set("twitterTitle")} placeholder={fields.ogTitle || fields.title} style={{ width: "100%", marginBottom: "12px" }} />

              <label>Twitter Description (leave blank to inherit)</label>
              <textarea className="tool-input" rows={3} value={fields.twitterDescription} onChange={set("twitterDescription")} placeholder={fields.ogDescription || fields.description} style={{ marginBottom: "12px" }} />

              <label>Twitter Image URL (leave blank to use OG image)</label>
              <input type="text" value={fields.twitterImage} onChange={set("twitterImage")} placeholder={fields.ogImage} style={{ width: "100%", marginBottom: "12px" }} />

              <label>Twitter Site Handle</label>
              <input type="text" value={fields.twitterSite} onChange={set("twitterSite")} placeholder="@yourtwitterhandle" style={{ width: "100%", marginBottom: "12px" }} />
            </>
          )}
        </div>

        {/* Right: previews */}
        <div>
          {/* SERP preview */}
          <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Google Search Preview</p>
          <div className="card mb-4" style={{ padding: "16px" }}>
            <p style={{ fontSize: "13px", color: "#1a0dab", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{serpTitle}</p>
            <p style={{ fontSize: "12px", color: "#006621", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{serpUrl}</p>
            <p style={{ fontSize: "13px", color: "#545454", lineHeight: "1.5" }}>{serpDesc}</p>
          </div>

          {/* OG preview */}
          <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Open Graph / Social Share Preview</p>
          <div className="card mb-4" style={{ padding: 0, overflow: "hidden" }}>
            {fields.ogImage && (
              <div style={{ background: "var(--bg-secondary)", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid var(--border)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fields.ogImage} alt="OG preview" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
            <div style={{ padding: "12px 16px" }}>
              <p style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "4px" }}>
                {(fields.ogUrl || fields.canonical || "example.com").replace(/^https?:\/\//, "").split("/")[0]}
              </p>
              <p style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>{fields.ogTitle || fields.title}</p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{fields.ogDescription || fields.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Generated HTML */}
      <div style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <label style={{ margin: 0 }}>Generated HTML</label>
          <CopyButton text={tags} />
        </div>
        <pre className="output-box" style={{ fontSize: "12px", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{tags}</pre>
      </div>

      <section className="tool-prose">
        <h2>About the Meta Tag Generator</h2>
        <p>Meta tags are HTML elements placed in the <code>&lt;head&gt;</code> section of a page that provide metadata to search engines, social media platforms, and browsers. This tool generates three sets of tags: <strong>basic SEO tags</strong> (<code>title</code>, <code>description</code>, <code>keywords</code>, <code>canonical</code>, <code>robots</code>), <strong>Open Graph tags</strong> (used by Facebook, LinkedIn, Slack, and most social platforms), and <strong>Twitter Card tags</strong> (used by X/Twitter for rich link previews).</p>
        <p>The title tag (50–60 characters) and meta description (120–160 characters) are the two most important for SEO — they directly determine how your page appears in Google search results. The Open Graph image (<code>og:image</code>) controls the preview image shown when your page is shared on social media; the recommended size is 1200×630px. Canonical tags prevent duplicate content issues by telling search engines which URL is the authoritative version of a page.</p>
        <p>Open Graph tags are also consumed by messaging apps (iMessage, WhatsApp, Telegram) and link unfurlers. Twitter Cards are validated by Twitter&apos;s card validator. All tag generation runs locally — no data is sent to any server.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What is the ideal meta description length?</summary>
          <p>Google typically truncates meta descriptions at around 155–160 characters in search results. Descriptions shorter than 120 characters often leave wasted space; descriptions longer than 160 are cut off with "…". Aim for 120–155 characters with the most important information at the start, in case truncation occurs.</p>
        </details>
        <details>
          <summary>What size should the Open Graph image be?</summary>
          <p>Facebook and most platforms recommend 1200×630px at a minimum of 600×315px. Use JPG or PNG format. Avoid images with important content in the corners, as some platforms may crop or overlay UI elements there. Twitter uses a 2:1 aspect ratio for <code>summary_large_image</code> cards (1200×600px is ideal).</p>
        </details>
        <details>
          <summary>What does the robots meta tag do?</summary>
          <p><code>index, follow</code> (the default) allows search engines to index the page and follow its links. <code>noindex</code> prevents the page from appearing in search results. <code>nofollow</code> tells crawlers not to follow links on the page. Use <code>noindex, nofollow</code> for admin pages, thank-you pages, and duplicate content that should not appear in search results.</p>
        </details>
        <details>
          <summary>What is a canonical URL and why does it matter?</summary>
          <p>A canonical URL tells search engines which URL is the "preferred" version of a page when the same content is accessible at multiple URLs (e.g., with and without trailing slashes, with different query parameters). Without canonical tags, search engines may split ranking signals across duplicate URLs or penalize the site for duplicate content.</p>
        </details>
      </section>
    </div>
  );
}
