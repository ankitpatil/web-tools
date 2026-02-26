import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator — Free Online Tool",
  description: "Format, validate, and beautify JSON instantly in your browser. Supports pretty print, minify, and tree view. Free and private — no data leaves your browser.",
  keywords: ["json formatter", "json validator", "json beautifier", "json pretty print", "format json online"],
  alternates: { canonical: "/json-formatter" },
  openGraph: {
    title: "JSON Formatter & Validator — Free Online Tool",
    description: "Format, validate, and beautify JSON instantly in your browser. Free and private.",
    url: "https://onlinefreetools.dev/json-formatter",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Formatter & Validator — Free Online Tool",
    description: "Format, validate, and beautify JSON instantly in your browser. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
