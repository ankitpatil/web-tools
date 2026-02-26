import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML/CSS/JS Minifier — Free Online Tool",
  description: "Minify HTML, CSS, and JavaScript code with size comparison. Reduce file sizes for faster page loads. Free and private.",
  keywords: ["html minifier", "css minifier", "js minifier", "code minifier", "minify html online", "minify css online"],
  alternates: { canonical: "/html-minifier" },
  openGraph: {
    title: "HTML/CSS/JS Minifier — Free Online Tool",
    description: "Minify HTML, CSS, and JavaScript code with size comparison. Free and private.",
    url: "https://onlinefreetools.dev/html-minifier",
  },
  twitter: {
    card: "summary_large_image",
    title: "HTML/CSS/JS Minifier — Free Online Tool",
    description: "Minify HTML, CSS, and JavaScript code with size comparison. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
