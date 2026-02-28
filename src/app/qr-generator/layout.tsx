import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator — Free Online Tool",
  description: "Generate QR codes online with custom colors, sizes, and error correction levels. Download as PNG or SVG. Free, private, and 100% client-side — no uploads required.",
  keywords: ["qr code generator", "qr generator", "qr code maker", "create qr code online", "free qr code"],
  alternates: { canonical: "/qr-generator" },
  openGraph: {
    title: "QR Code Generator — Free Online Tool",
    description: "Generate QR codes with custom colors and sizes. Download as PNG. Free.",
    url: "https://onlinefreetools.dev/qr-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator — Free Online Tool",
    description: "Generate QR codes with custom colors and sizes. Download as PNG. Free.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
