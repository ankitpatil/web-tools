import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Converter — Free Online Tool",
  description: "Convert colors between HEX, RGB, and HSL formats instantly. Paste any color value and get all three formats in one click. Free and fully browser-based.",
  keywords: ["color converter", "hex to rgb", "rgb to hex", "hsl converter", "color format converter"],
  alternates: { canonical: "/color-converter" },
  openGraph: {
    title: "Color Converter — Free Online Tool",
    description: "Convert colors between HEX, RGB, and HSL formats instantly. Free and private.",
    url: "https://onlinefreetools.dev/color-converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Converter — Free Online Tool",
    description: "Convert colors between HEX, RGB, and HSL formats instantly. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
