import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XML to JSON Converter — Free Online Tool",
  description: "Convert XML data to JSON format online. Handles attributes and nested elements. Free, private, and 100% client-side — no uploads or server processing required.",
  keywords: ["xml to json", "json to xml", "xml converter", "xml json converter", "convert xml online"],
  alternates: { canonical: "/xml-to-json" },
  openGraph: {
    title: "XML to JSON Converter — Free Online Tool",
    description: "Convert between XML and JSON formats instantly. Free and private.",
    url: "https://onlinefreetools.dev/xml-to-json",
  },
  twitter: {
    card: "summary_large_image",
    title: "XML to JSON Converter — Free Online Tool",
    description: "Convert between XML and JSON formats instantly. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
