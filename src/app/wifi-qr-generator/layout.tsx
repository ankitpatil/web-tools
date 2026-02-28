import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WiFi QR Code Generator — Share WiFi Password as a Scannable QR Code",
  description: "Generate a QR code for your WiFi network. Anyone can scan it to connect instantly — no typing required. Supports WPA, WPA2, WEP, and open networks. Free and private.",
  keywords: ["wifi qr code", "wifi qr generator", "share wifi password qr", "wifi qr code maker", "wpa2 qr code", "scan to connect wifi"],
  alternates: { canonical: "/wifi-qr-generator" },
  openGraph: {
    title: "WiFi QR Code Generator — Share WiFi Password as a Scannable QR Code",
    description: "Generate a WiFi QR code that lets anyone connect to your network by scanning — no password typing needed.",
    url: "https://onlinefreetools.dev/wifi-qr-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "WiFi QR Code Generator — Share WiFi Password as a Scannable QR Code",
    description: "Generate a WiFi QR code that lets anyone connect to your network by scanning — no password typing needed.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
