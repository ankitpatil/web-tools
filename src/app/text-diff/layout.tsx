import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Diff — Free Online Tool",
  description: "Compare two text blocks side by side and highlight the differences. Supports line-by-line and character-level diffing.",
  keywords: ["text diff", "text compare", "diff tool", "compare text online", "text difference checker"],
  alternates: { canonical: "/text-diff" },
  openGraph: {
    title: "Text Diff — Free Online Tool",
    description: "Compare two text blocks and highlight differences. Free and private.",
    url: "https://onlinefreetools.dev/text-diff",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Diff — Free Online Tool",
    description: "Compare two text blocks and highlight differences. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
