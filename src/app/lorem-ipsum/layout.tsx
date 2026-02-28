import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator — Free Online Tool",
  description: "Generate Lorem Ipsum placeholder text in paragraphs, sentences, or words. Customize the amount and format. Free, instant, and fully browser-based.",
  keywords: ["lorem ipsum generator", "placeholder text", "dummy text generator", "lorem ipsum online", "filler text"],
  alternates: { canonical: "/lorem-ipsum" },
  openGraph: {
    title: "Lorem Ipsum Generator — Free Online Tool",
    description: "Generate Lorem Ipsum placeholder text in paragraphs, sentences, or words. Free.",
    url: "https://onlinefreetools.dev/lorem-ipsum",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lorem Ipsum Generator — Free Online Tool",
    description: "Generate Lorem Ipsum placeholder text in paragraphs, sentences, or words. Free.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
