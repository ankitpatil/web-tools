import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hex Converter — Free Online Tool",
  description: "Convert numbers between hexadecimal, decimal, binary, and octal bases online. Instant multi-base conversion with copy-ready output. Free and fully browser-based.",
  keywords: ["hex converter", "hexadecimal converter", "binary converter", "octal converter", "number base converter"],
  alternates: { canonical: "/hex-converter" },
  openGraph: {
    title: "Hex Converter — Free Online Tool",
    description: "Convert between Hex, Decimal, Binary, and Octal formats instantly. Free and private.",
    url: "https://onlinefreetools.dev/hex-converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hex Converter — Free Online Tool",
    description: "Convert between Hex, Decimal, Binary, and Octal formats instantly. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
