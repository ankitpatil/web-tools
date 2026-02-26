import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YAML to JSON Converter — Free Online Tool",
  description: "Convert between YAML and JSON formats instantly in your browser. Bidirectional conversion with syntax validation.",
  keywords: ["yaml to json", "json to yaml", "yaml converter", "yaml json converter", "convert yaml online"],
  alternates: { canonical: "/yaml-json" },
  openGraph: {
    title: "YAML to JSON Converter — Free Online Tool",
    description: "Convert between YAML and JSON formats instantly. Free and private.",
    url: "https://onlinefreetools.dev/yaml-json",
  },
  twitter: {
    card: "summary_large_image",
    title: "YAML to JSON Converter — Free Online Tool",
    description: "Convert between YAML and JSON formats instantly. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
