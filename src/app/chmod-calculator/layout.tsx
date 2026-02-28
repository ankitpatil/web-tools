import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chmod Calculator — File Permission Calculator for Linux & Unix",
  description: "Calculate Linux file permissions visually. Toggle read, write, and execute for owner, group, and others to get the octal chmod value and symbolic notation. Free and browser-based.",
  keywords: ["chmod calculator", "linux file permissions", "chmod 755", "chmod 644", "octal permission calculator", "unix permissions", "chmod online"],
  alternates: { canonical: "/chmod-calculator" },
  openGraph: {
    title: "Chmod Calculator — File Permission Calculator for Linux & Unix",
    description: "Calculate Linux file permissions visually. Get octal and symbolic notation instantly. Free and browser-based.",
    url: "https://onlinefreetools.dev/chmod-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chmod Calculator — File Permission Calculator for Linux & Unix",
    description: "Calculate Linux file permissions visually. Get octal and symbolic notation instantly. Free and browser-based.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
