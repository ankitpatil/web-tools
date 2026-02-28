import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to Base64 Converter — Free Online Tool",
  description: "Convert any image to a Base64-encoded data URI for embedding directly in HTML, CSS, or JavaScript. No uploads required — conversion runs entirely in your browser.",
  keywords: ["image to base64", "base64 image encoder", "data url generator", "embed image base64", "image encoder online"],
  alternates: { canonical: "/image-to-base64" },
  openGraph: {
    title: "Image to Base64 Converter — Free Online Tool",
    description: "Convert images to Base64 data URLs for embedding in HTML or CSS. Free and private.",
    url: "https://onlinefreetools.dev/image-to-base64",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to Base64 Converter — Free Online Tool",
    description: "Convert images to Base64 data URLs for embedding in HTML or CSS. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
