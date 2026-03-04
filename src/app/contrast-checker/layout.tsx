import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WCAG Contrast Ratio Checker — AA and AAA Accessibility Compliance",
  description: "Check color contrast ratios for WCAG 2.1 AA and AAA compliance. Enter foreground and background colors to instantly see pass/fail for normal text, large text, and UI components.",
  keywords: ["wcag contrast checker", "color contrast ratio", "accessibility contrast", "wcag aa aaa", "contrast ratio calculator", "color accessibility checker"],
  alternates: { canonical: "/contrast-checker" },
  openGraph: {
    title: "WCAG Contrast Ratio Checker — AA and AAA Accessibility Compliance",
    description: "Check WCAG 2.1 contrast ratios for AA and AAA compliance. Live preview with pass/fail for normal text, large text, and UI components.",
    url: "https://onlinefreetools.dev/contrast-checker",
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG Contrast Ratio Checker — AA and AAA Accessibility Compliance",
    description: "Check WCAG 2.1 contrast ratios for AA and AAA compliance. Live preview with pass/fail for normal text, large text, and UI components.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
