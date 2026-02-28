import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator — Free Online Tool",
  description: "Format, validate, and beautify JSON online. Supports pretty print, minify, tree view, and converts to CSV or XML. 100% client-side — your data never leaves the browser.",
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
