import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SVG Optimizer — Free Online Tool",
  description: "Optimize and minify SVG files by removing metadata, comments, and unnecessary attributes. See the exact byte savings. Free, private, and 100% client-side.",
  keywords: ["svg optimizer", "svg minifier", "svg compressor", "optimize svg online", "svgo online"],
  alternates: { canonical: "/svg-optimizer" },
  openGraph: {
    title: "SVG Optimizer — Free Online Tool",
    description: "Optimize and minify SVG markup to reduce file size. Free and private.",
    url: "https://onlinefreetools.dev/svg-optimizer",
  },
  twitter: {
    card: "summary_large_image",
    title: "SVG Optimizer — Free Online Tool",
    description: "Optimize and minify SVG markup to reduce file size. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
