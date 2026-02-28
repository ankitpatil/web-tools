import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTTP Status Codes Reference — Complete List with Descriptions",
  description: "Complete reference for all HTTP status codes: 1xx informational, 2xx success, 3xx redirection, 4xx client errors, 5xx server errors. Search by code or name. Free and browser-based.",
  keywords: ["http status codes", "http status code list", "404 meaning", "http error codes", "rest api status codes", "http response codes"],
  alternates: { canonical: "/http-status-codes" },
  openGraph: {
    title: "HTTP Status Codes Reference — Complete List with Descriptions",
    description: "Complete HTTP status code reference with descriptions and use cases. Search by code or keyword.",
    url: "https://onlinefreetools.dev/http-status-codes",
  },
  twitter: {
    card: "summary_large_image",
    title: "HTTP Status Codes Reference — Complete List with Descriptions",
    description: "Complete HTTP status code reference with descriptions and use cases. Search by code or keyword.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
