import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Agent Parser — Detect Browser, OS, and Device from UA String",
  description: "Parse any User-Agent string to extract browser name, version, operating system, device type, and engine. Your current UA is auto-detected. Free and browser-based.",
  keywords: ["user agent parser", "ua parser", "browser detection", "user agent string", "detect browser", "detect os", "device detection"],
  alternates: { canonical: "/user-agent-parser" },
  openGraph: {
    title: "User Agent Parser — Detect Browser, OS, and Device from UA String",
    description: "Parse User-Agent strings to extract browser, OS, device type, and rendering engine. Auto-detects your current UA.",
    url: "https://onlinefreetools.dev/user-agent-parser",
  },
  twitter: {
    card: "summary_large_image",
    title: "User Agent Parser — Detect Browser, OS, and Device from UA String",
    description: "Parse User-Agent strings to extract browser, OS, device type, and rendering engine. Auto-detects your current UA.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
