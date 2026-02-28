import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash Generator — Free Online Tool",
  description: "Generate SHA-1, SHA-256, SHA-384, and SHA-512 cryptographic hashes using the browser's native Web Crypto API. Instant, private, no data sent to any server.",
  keywords: ["hash generator", "md5 generator", "sha256 generator", "sha512 generator", "sha1 generator", "hash online"],
  alternates: { canonical: "/hash-generator" },
  openGraph: {
    title: "Hash Generator — Free Online Tool",
    description: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes instantly. Free and private.",
    url: "https://onlinefreetools.dev/hash-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hash Generator — Free Online Tool",
    description: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes instantly. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
