import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "OnlineFreeTools.dev — Free Online Developer Tools", template: "%s | OnlineFreeTools" },
  description: "24+ free, fast, client-side developer tools. JSON formatter, Base64 encoder, UUID generator, and more. No data leaves your browser.",
  keywords: ["developer tools", "json formatter", "base64", "uuid generator", "online tools", "free tools", "browser tools"],
  openGraph: {
    title: "OnlineFreeTools.dev — Free Online Developer Tools",
    description: "24+ free, fast, client-side developer tools. No data leaves your browser.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Analytics />
        <SpeedInsights />
        <ThemeProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-120px)]">{children}</main>
          <footer className="border-t border-[var(--border)] py-6 text-center text-sm text-[var(--text-secondary)]">
            <p>OnlineFreeTools.dev — All tools run 100% in your browser. No data is sent to any server.</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
