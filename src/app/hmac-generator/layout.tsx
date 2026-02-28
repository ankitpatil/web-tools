import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HMAC Generator — Free Online HMAC-SHA256 / SHA512 Tool",
  description: "Generate HMAC signatures using SHA-256, SHA-384, or SHA-512. Enter your message and secret key to get the hex or Base64 digest. 100% client-side — no data sent to any server.",
  keywords: ["hmac generator", "hmac sha256", "hmac sha512", "hmac online", "hmac calculator", "message authentication code"],
  alternates: { canonical: "/hmac-generator" },
  openGraph: {
    title: "HMAC Generator — Free Online HMAC-SHA256 / SHA512 Tool",
    description: "Generate HMAC signatures online. SHA-256, SHA-384, SHA-512. 100% client-side.",
    url: "https://onlinefreetools.dev/hmac-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "HMAC Generator — Free Online HMAC-SHA256 / SHA512 Tool",
    description: "Generate HMAC signatures online. SHA-256, SHA-384, SHA-512. 100% client-side.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
