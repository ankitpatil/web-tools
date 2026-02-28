import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Tester — Free Online Tool",
  description: "Test regular expressions online with live match highlighting and capture group display. Supports global, case-insensitive, and multiline flags. Fully client-side.",
  keywords: ["regex tester", "regular expression tester", "regex online", "regex debugger", "test regex"],
  alternates: { canonical: "/regex-tester" },
  openGraph: {
    title: "Regex Tester — Free Online Tool",
    description: "Test regular expressions with live match highlighting. Free and private.",
    url: "https://onlinefreetools.dev/regex-tester",
  },
  twitter: {
    card: "summary_large_image",
    title: "Regex Tester — Free Online Tool",
    description: "Test regular expressions with live match highlighting. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
