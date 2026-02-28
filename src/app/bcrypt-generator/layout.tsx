import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "bcrypt Hash Generator & Verifier — Free Online Tool",
  description: "Generate and verify bcrypt password hashes online. Choose salt rounds, hash any string, and verify passwords against hashes. 100% client-side — no passwords sent to any server.",
  keywords: ["bcrypt generator", "bcrypt hash", "bcrypt online", "password hash generator", "bcrypt verifier", "bcrypt hash checker"],
  alternates: { canonical: "/bcrypt-generator" },
  openGraph: {
    title: "bcrypt Hash Generator & Verifier — Free Online Tool",
    description: "Generate and verify bcrypt password hashes online. 100% client-side — no passwords sent to any server.",
    url: "https://onlinefreetools.dev/bcrypt-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "bcrypt Hash Generator & Verifier — Free Online Tool",
    description: "Generate and verify bcrypt password hashes online. 100% client-side — no passwords sent to any server.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
