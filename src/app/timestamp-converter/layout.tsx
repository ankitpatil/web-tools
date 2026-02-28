import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter — Free Online Tool",
  description: "Convert Unix timestamps to human-readable dates and vice versa. Supports all major timezones. Free, instant, and fully browser-based — no sign-up required.",
  keywords: ["timestamp converter", "unix timestamp", "epoch converter", "unix time converter", "timestamp to date"],
  alternates: { canonical: "/timestamp-converter" },
  openGraph: {
    title: "Unix Timestamp Converter — Free Online Tool",
    description: "Convert Unix timestamps to readable dates with timezone support. Free and private.",
    url: "https://onlinefreetools.dev/timestamp-converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unix Timestamp Converter — Free Online Tool",
    description: "Convert Unix timestamps to readable dates with timezone support. Free and private.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
