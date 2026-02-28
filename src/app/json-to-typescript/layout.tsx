import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to TypeScript Interface Generator — Free Online Tool",
  description: "Convert JSON objects to TypeScript interfaces and type definitions instantly. Supports nested objects, arrays, and optional fields. Free, private, and fully browser-based.",
  keywords: ["json to typescript", "json to ts", "typescript interface generator", "json type generator", "generate typescript from json", "json to interface"],
  alternates: { canonical: "/json-to-typescript" },
  openGraph: {
    title: "JSON to TypeScript Interface Generator — Free Online Tool",
    description: "Convert JSON to TypeScript interfaces instantly. Supports nested objects and arrays. Free and browser-based.",
    url: "https://onlinefreetools.dev/json-to-typescript",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to TypeScript Interface Generator — Free Online Tool",
    description: "Convert JSON to TypeScript interfaces instantly. Supports nested objects and arrays. Free and browser-based.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
