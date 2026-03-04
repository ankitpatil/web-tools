import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ASCII / Hex / Binary Text Converter — Encode and Decode Text Online",
  description: "Convert text to hexadecimal, binary, octal, decimal bytes, and Base64 encoding instantly. Decode hex strings back to readable ASCII text. Free and browser-based.",
  keywords: ["ascii to hex", "hex to ascii", "text to hex", "hex to text", "text to binary", "binary to text", "ascii hex converter online"],
  alternates: { canonical: "/ascii-hex" },
  openGraph: {
    title: "ASCII / Hex / Binary Text Converter — Encode and Decode Text Online",
    description: "Convert text to hex, binary, octal, and Base64, or decode hex back to readable text. Supports all ASCII and UTF-8 characters.",
    url: "https://onlinefreetools.dev/ascii-hex",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASCII / Hex / Binary Text Converter — Encode and Decode Text Online",
    description: "Convert text to hex, binary, octal, and Base64, or decode hex back to readable text. Supports all ASCII and UTF-8 characters.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
