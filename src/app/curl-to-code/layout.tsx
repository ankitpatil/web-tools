import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "curl to Code Converter — Convert curl to Python, JavaScript, Go, PHP",
  description: "Convert curl commands to Python requests, JavaScript fetch, Axios, Go net/http, and PHP code instantly. Supports headers, auth, JSON body, form data, and cookies.",
  keywords: ["curl to python", "curl to javascript", "curl to fetch", "curl to go", "curl to php", "curl converter", "curl command to code"],
  alternates: { canonical: "/curl-to-code" },
  openGraph: {
    title: "curl to Code Converter — Convert curl to Python, JavaScript, Go, PHP",
    description: "Convert curl commands to Python requests, JavaScript fetch, Go, and PHP instantly. Handles headers, auth, JSON, and form data.",
    url: "https://onlinefreetools.dev/curl-to-code",
  },
  twitter: {
    card: "summary_large_image",
    title: "curl to Code Converter — Convert curl to Python, JavaScript, Go, PHP",
    description: "Convert curl commands to Python requests, JavaScript fetch, Go, and PHP instantly. Handles headers, auth, JSON, and form data.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
