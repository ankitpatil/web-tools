import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Preview — Free Online Tool",
  description: "Write Markdown on the left and see a live rendered HTML preview on the right. Supports GitHub-flavored Markdown. Free, instant, and fully browser-based.",
  keywords: ["markdown preview", "markdown editor", "markdown renderer", "markdown live preview", "online markdown"],
  alternates: { canonical: "/markdown-preview" },
  openGraph: {
    title: "Markdown Preview — Free Online Tool",
    description: "Write Markdown and preview rendered HTML in real-time. Free and private.",
    url: "https://onlinefreetools.dev/markdown-preview",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Preview — Free Online Tool",
    description: "Write Markdown and preview rendered HTML in real-time. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
