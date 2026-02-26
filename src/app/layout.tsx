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
  metadataBase: new URL("https://onlinefreetools.dev"),
  title: { default: "OnlineFreeTools.dev — Free Online Developer Tools", template: "%s | OnlineFreeTools" },
  description: "27+ free, fast, client-side developer tools. JSON formatter, Base64 encoder, UUID generator, and more. No data leaves your browser.",
  keywords: ["developer tools", "json formatter", "base64", "uuid generator", "online tools", "free tools", "browser tools"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "OnlineFreeTools.dev — Free Online Developer Tools",
    description: "27+ free, fast, client-side developer tools. No data leaves your browser.",
    type: "website",
    url: "https://onlinefreetools.dev",
    siteName: "OnlineFreeTools.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnlineFreeTools.dev — Free Online Developer Tools",
    description: "27+ free, fast, client-side developer tools. No data leaves your browser.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "OnlineFreeTools.dev",
              url: "https://onlinefreetools.dev",
              description: "27+ free, fast, client-side developer tools. No data leaves your browser.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://onlinefreetools.dev/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
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
