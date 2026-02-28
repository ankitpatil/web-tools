import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IPv4 Subnet Calculator — CIDR, Host Range, Broadcast Address",
  description: "Calculate IPv4 subnet details from any CIDR notation: network address, broadcast, host range, subnet mask, and number of usable hosts. Free and browser-based.",
  keywords: ["subnet calculator", "cidr calculator", "ipv4 subnet", "subnet mask", "network address", "broadcast address", "ip range calculator"],
  alternates: { canonical: "/subnet-calculator" },
  openGraph: {
    title: "IPv4 Subnet Calculator — CIDR, Host Range, Broadcast Address",
    description: "Calculate IPv4 subnet details: network, broadcast, host range, and usable hosts from CIDR notation.",
    url: "https://onlinefreetools.dev/subnet-calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPv4 Subnet Calculator — CIDR, Host Range, Broadcast Address",
    description: "Calculate IPv4 subnet details: network, broadcast, host range, and usable hosts from CIDR notation.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
