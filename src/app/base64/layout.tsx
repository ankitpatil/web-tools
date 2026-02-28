import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encode/Decode — Free Online Tool",
  description: "Encode text or files to Base64 and decode Base64 strings back to plain text instantly. Supports binary files and text. Free, private, and fully browser-based.",
  keywords: ["base64 encoder", "base64 decoder", "base64 converter", "encode base64 online", "decode base64 online"],
  alternates: { canonical: "/base64" },
  openGraph: {
    title: "Base64 Encode/Decode — Free Online Tool",
    description: "Encode or decode Base64 strings and files instantly. Free and private.",
    url: "https://onlinefreetools.dev/base64",
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 Encode/Decode — Free Online Tool",
    description: "Encode or decode Base64 strings and files instantly. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
