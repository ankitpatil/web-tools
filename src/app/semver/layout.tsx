import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Semver Comparator — Compare and Sort Semantic Version Numbers",
  description: "Compare semantic version numbers (semver) and sort multiple versions in order. Supports pre-release identifiers and build metadata. Free, instant, and browser-based.",
  keywords: ["semver comparator", "semantic version compare", "semver sort", "version number comparator", "npm version compare", "semver checker online"],
  alternates: { canonical: "/semver" },
  openGraph: {
    title: "Semver Comparator — Compare and Sort Semantic Version Numbers",
    description: "Compare and sort semantic version numbers (semver). Supports pre-release tags and build metadata per RFC 2119.",
    url: "https://onlinefreetools.dev/semver",
  },
  twitter: {
    card: "summary_large_image",
    title: "Semver Comparator — Compare and Sort Semantic Version Numbers",
    description: "Compare and sort semantic version numbers (semver). Supports pre-release tags and build metadata per RFC 2119.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
