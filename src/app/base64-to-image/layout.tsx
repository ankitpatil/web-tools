import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 to Image Converter — Free Online Tool",
  description: "Convert Base64 strings back to viewable and downloadable images. Supports data URLs and raw Base64. Free and private.",
  keywords: ["base64 to image", "base64 decoder", "base64 image viewer", "decode base64 image", "base64 to png"],
  alternates: { canonical: "/base64-to-image" },
  openGraph: {
    title: "Base64 to Image Converter — Free Online Tool",
    description: "Convert Base64 strings to viewable and downloadable images. Free and private.",
    url: "https://onlinefreetools.dev/base64-to-image",
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 to Image Converter — Free Online Tool",
    description: "Convert Base64 strings to viewable and downloadable images. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
