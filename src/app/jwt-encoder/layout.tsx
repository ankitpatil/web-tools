import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Encoder — Sign JWT Tokens with HS256, HS384, or HS512",
  description: "Create signed JWT tokens with custom headers and payloads using HMAC-SHA256, SHA384, or SHA512. Runs entirely in your browser via the Web Crypto API — no keys are transmitted.",
  keywords: ["jwt encoder", "jwt generator", "create jwt token", "sign jwt", "hs256", "json web token generator", "jwt builder"],
  alternates: { canonical: "/jwt-encoder" },
  openGraph: {
    title: "JWT Encoder — Sign JWT Tokens with HS256, HS384, or HS512",
    description: "Create and sign JWT tokens with custom payloads. Browser-based using the Web Crypto API — your secret key never leaves your device.",
    url: "https://onlinefreetools.dev/jwt-encoder",
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Encoder — Sign JWT Tokens with HS256, HS384, or HS512",
    description: "Create and sign JWT tokens with custom payloads. Browser-based using the Web Crypto API — your secret key never leaves your device.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
