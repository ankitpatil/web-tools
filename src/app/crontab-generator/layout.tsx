import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crontab Generator — Free Online Cron Expression Builder",
  description: "Build and validate cron expressions visually. See a human-readable schedule description and the next 5 run times. Free, instant, and fully browser-based.",
  keywords: ["crontab generator", "cron expression generator", "cron job builder", "cron schedule", "cron syntax", "crontab online"],
  alternates: { canonical: "/crontab-generator" },
  openGraph: {
    title: "Crontab Generator — Free Online Cron Expression Builder",
    description: "Build cron expressions visually with human-readable descriptions and next run times. Free and browser-based.",
    url: "https://onlinefreetools.dev/crontab-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crontab Generator — Free Online Cron Expression Builder",
    description: "Build cron expressions visually with human-readable descriptions and next run times. Free and browser-based.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
