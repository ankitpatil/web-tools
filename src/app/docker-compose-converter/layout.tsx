import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docker Run to Compose Converter — Convert docker run Commands to docker-compose.yml",
  description: "Convert docker run commands to docker-compose.yml format instantly. Supports ports, volumes, environment variables, networks, restart policies, and more. Free and browser-based.",
  keywords: ["docker run to compose", "docker compose converter", "docker run to docker-compose", "docker compose generator", "docker-compose.yml generator"],
  alternates: { canonical: "/docker-compose-converter" },
  openGraph: {
    title: "Docker Run to Compose Converter — Convert docker run to docker-compose.yml",
    description: "Instantly convert docker run commands to docker-compose.yml. Supports all common flags: ports, volumes, env vars, networks, restart policies.",
    url: "https://onlinefreetools.dev/docker-compose-converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Docker Run to Compose Converter — Convert docker run to docker-compose.yml",
    description: "Instantly convert docker run commands to docker-compose.yml. Supports all common flags: ports, volumes, env vars, networks, restart policies.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
