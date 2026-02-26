import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator — Free Online Tool",
  description: "Generate QR codes with custom colors and sizes instantly. Download as PNG. No sign-up required.",
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
