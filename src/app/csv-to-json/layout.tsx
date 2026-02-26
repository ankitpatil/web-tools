import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV to JSON Converter — Free Online Tool",
  description: "Convert CSV files to JSON arrays instantly in your browser. No server upload required. Free and private.",
  keywords: ["csv to json", "csv converter", "json converter", "convert csv to json online"],
  alternates: { canonical: "/csv-to-json" },
  openGraph: {
    title: "CSV to JSON Converter — Free Online Tool",
    description: "Convert CSV files to JSON arrays instantly in your browser. Free and private.",
    url: "https://onlinefreetools.dev/csv-to-json",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV to JSON Converter — Free Online Tool",
    description: "Convert CSV files to JSON arrays instantly in your browser. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
