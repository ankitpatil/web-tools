import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Number to Words Converter — Free Online Tool",
  description: "Convert numbers to English words instantly. Supports large numbers including millions, billions, and beyond.",
  keywords: ["number to words", "number converter", "words converter", "number spelling", "convert number to words"],
  alternates: { canonical: "/number-to-words" },
  openGraph: {
    title: "Number to Words Converter — Free Online Tool",
    description: "Convert numbers to English words instantly. Free and private.",
    url: "https://onlinefreetools.dev/number-to-words",
  },
  twitter: {
    card: "summary_large_image",
    title: "Number to Words Converter — Free Online Tool",
    description: "Convert numbers to English words instantly. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
