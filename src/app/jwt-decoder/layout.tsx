import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder — Free Online Tool",
  description: "Decode JWT tokens and inspect the header, payload, and expiry status. No data sent to any server — fully client-side.",
  keywords: ["jwt decoder", "jwt parser", "json web token", "decode jwt online", "jwt inspector"],
  alternates: { canonical: "/jwt-decoder" },
  openGraph: {
    title: "JWT Decoder — Free Online Tool",
    description: "Decode JWT tokens and inspect header, payload, and expiry. Free and private.",
    url: "https://onlinefreetools.dev/jwt-decoder",
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Decoder — Free Online Tool",
    description: "Decode JWT tokens and inspect header, payload, and expiry. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
