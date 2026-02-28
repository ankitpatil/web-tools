import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL Formatter — Free Online Tool",
  description: "Format and beautify SQL queries online for improved readability. Supports SELECT, INSERT, UPDATE, DELETE, and more. Free, instant, and fully browser-based.",
  keywords: ["sql formatter", "sql beautifier", "sql pretty print", "format sql online", "sql indenter"],
  alternates: { canonical: "/sql-formatter" },
  openGraph: {
    title: "SQL Formatter — Free Online Tool",
    description: "Format and beautify SQL queries with proper indentation. Free and private.",
    url: "https://onlinefreetools.dev/sql-formatter",
  },
  twitter: {
    card: "summary_large_image",
    title: "SQL Formatter — Free Online Tool",
    description: "Format and beautify SQL queries with proper indentation. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
