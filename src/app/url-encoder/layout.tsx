import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Encoder/Decoder — Free Online Tool",
  description: "Encode URLs and URL components using percent-encoding, or decode encoded URLs back to plain text. Instant and fully browser-based. Free, private, no sign-up needed.",
  keywords: ["url encoder", "url decoder", "percent encoding", "urlencode online", "url escape"],
  alternates: { canonical: "/url-encoder" },
  openGraph: {
    title: "URL Encoder/Decoder — Free Online Tool",
    description: "Encode or decode URL components and query strings instantly. Free and private.",
    url: "https://onlinefreetools.dev/url-encoder",
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Encoder/Decoder — Free Online Tool",
    description: "Encode or decode URL components and query strings instantly. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
