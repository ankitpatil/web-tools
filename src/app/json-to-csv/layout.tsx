import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to CSV Converter — Free Online Tool",
  description: "Convert JSON arrays to CSV format instantly in your browser. No server upload required. Free and private.",
  keywords: ["json to csv", "json converter", "csv export", "convert json to csv online"],
  alternates: { canonical: "/json-to-csv" },
  openGraph: {
    title: "JSON to CSV Converter — Free Online Tool",
    description: "Convert JSON arrays to CSV format instantly in your browser. Free and private.",
    url: "https://onlinefreetools.dev/json-to-csv",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to CSV Converter — Free Online Tool",
    description: "Convert JSON arrays to CSV format instantly in your browser. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
