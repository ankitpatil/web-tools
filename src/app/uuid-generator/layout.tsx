import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UUID Generator — Free Online Tool",
  description: "Generate cryptographically random UUID v4 values individually or in bulk. Copy-ready output. No sign-up, no install — runs entirely in your browser.",
  keywords: ["uuid generator", "guid generator", "uuid v4", "generate uuid online", "random uuid"],
  alternates: { canonical: "/uuid-generator" },
  openGraph: {
    title: "UUID Generator — Free Online Tool",
    description: "Generate UUID v4 values individually or in bulk. Free and instant.",
    url: "https://onlinefreetools.dev/uuid-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "UUID Generator — Free Online Tool",
    description: "Generate UUID v4 values individually or in bulk. Free and instant.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
