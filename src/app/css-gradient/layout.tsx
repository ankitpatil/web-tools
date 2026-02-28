import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Gradient Generator — Free Online Tool",
  description: "Generate CSS linear and radial gradients visually with a live preview. Copy the generated CSS code in one click. Free, instant, and fully browser-based.",
  keywords: ["css gradient generator", "gradient maker", "linear gradient", "radial gradient", "css gradient online"],
  alternates: { canonical: "/css-gradient" },
  openGraph: {
    title: "CSS Gradient Generator — Free Online Tool",
    description: "Build CSS gradients visually with live code output. Free and private.",
    url: "https://onlinefreetools.dev/css-gradient",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSS Gradient Generator — Free Online Tool",
    description: "Build CSS gradients visually with live code output. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
