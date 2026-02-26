import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor — Free Online Tool",
  description: "Compress and optimize images in your browser without uploading to any server. Supports JPEG, PNG, and WebP. Free and private.",
  keywords: ["image compressor", "image optimizer", "compress image online", "reduce image size", "free image compression"],
  alternates: { canonical: "/image-compressor" },
  openGraph: {
    title: "Image Compressor — Free Online Tool",
    description: "Compress and optimize images in your browser. No server upload. Free and private.",
    url: "https://onlinefreetools.dev/image-compressor",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Compressor — Free Online Tool",
    description: "Compress and optimize images in your browser. No server upload. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
