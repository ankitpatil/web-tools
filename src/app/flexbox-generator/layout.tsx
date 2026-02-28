import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flexbox & Grid Generator — Free Online Tool",
  description: "Generate CSS Flexbox and Grid layout code visually with live preview. Adjust alignment, gaps, and direction without writing a line of CSS. Free and browser-based.",
  keywords: ["flexbox generator", "css grid generator", "css layout tool", "flexbox online", "css grid builder"],
  alternates: { canonical: "/flexbox-generator" },
  openGraph: {
    title: "Flexbox & Grid Generator — Free Online Tool",
    description: "Build CSS Flexbox and Grid layouts visually with live code output. Free.",
    url: "https://onlinefreetools.dev/flexbox-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flexbox & Grid Generator — Free Online Tool",
    description: "Build CSS Flexbox and Grid layouts visually with live code output. Free.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
