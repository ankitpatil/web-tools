import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML Entity Encoder / Decoder — Escape and Unescape HTML Online",
  description: "Encode text to HTML entities (&lt; &gt; &amp; &quot;) and decode HTML entities back to plain text. Shows named and numeric entities. Free and fully browser-based.",
  keywords: ["html entity encoder", "html entity decoder", "html escape online", "html unescape", "encode html entities", "html special characters"],
  alternates: { canonical: "/html-entities" },
  openGraph: {
    title: "HTML Entity Encoder / Decoder — Escape and Unescape HTML Online",
    description: "Encode text to HTML entities and decode HTML entities back to plain text. Shows named and numeric entity equivalents.",
    url: "https://onlinefreetools.dev/html-entities",
  },
  twitter: {
    card: "summary_large_image",
    title: "HTML Entity Encoder / Decoder — Escape and Unescape HTML Online",
    description: "Encode text to HTML entities and decode HTML entities back to plain text. Shows named and numeric entity equivalents.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
