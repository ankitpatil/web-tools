import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Tag Generator — Generate SEO and Open Graph Meta Tags",
  description: "Generate HTML meta tags for SEO, Open Graph (Facebook), and Twitter Cards. Live preview shows how your page will appear in Google search results and social media shares.",
  keywords: ["meta tag generator", "og tag generator", "open graph generator", "twitter card generator", "seo meta tags", "html meta tags"],
  alternates: { canonical: "/meta-tag-generator" },
  openGraph: {
    title: "Meta Tag Generator — Generate SEO and Open Graph Meta Tags",
    description: "Generate SEO, Open Graph, and Twitter Card meta tags with a live SERP and social share preview. Copy ready-to-paste HTML.",
    url: "https://onlinefreetools.dev/meta-tag-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meta Tag Generator — Generate SEO and Open Graph Meta Tags",
    description: "Generate SEO, Open Graph, and Twitter Card meta tags with a live SERP and social share preview. Copy ready-to-paste HTML.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
