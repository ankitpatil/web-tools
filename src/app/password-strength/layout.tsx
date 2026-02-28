import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Strength Checker — Free Online Tool",
  description: "Analyze password strength instantly. See entropy score, estimated crack time, character set analysis, and specific improvement tips. 100% client-side — your password never leaves the browser.",
  keywords: ["password strength checker", "password strength meter", "password analyzer", "how strong is my password", "password security checker"],
  alternates: { canonical: "/password-strength" },
  openGraph: {
    title: "Password Strength Checker — Free Online Tool",
    description: "Analyze password strength with entropy score, crack time estimate, and improvement tips. 100% client-side.",
    url: "https://onlinefreetools.dev/password-strength",
  },
  twitter: {
    card: "summary_large_image",
    title: "Password Strength Checker — Free Online Tool",
    description: "Analyze password strength with entropy score, crack time estimate, and improvement tips. 100% client-side.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
