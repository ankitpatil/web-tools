"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  subnetMask: string;
  wildcardMask: string;
  totalHosts: number;
  usableHosts: number;
  cidr: number;
  ipClass: string;
  binary: {
    ip: string;
    mask: string;
  };
  subnets?: SubnetSplit[];
}

interface SubnetSplit {
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
}

function ipToInt(ip: string): number {
  return ip.split(".").reduce((acc, octet) => (acc << 8) | parseInt(octet, 10), 0) >>> 0;
}

function intToIp(n: number): string {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff].join(".");
}

function toBinary(ip: string): string {
  return ip
    .split(".")
    .map((o) => parseInt(o, 10).toString(2).padStart(8, "0"))
    .join(".");
}

function getClass(ip: string): string {
  const first = parseInt(ip.split(".")[0], 10);
  if (first < 128) return "A";
  if (first < 192) return "B";
  if (first < 224) return "C";
  if (first < 240) return "D (Multicast)";
  return "E (Reserved)";
}

function calcSubnet(cidrInput: string): SubnetInfo | null {
  const match = cidrInput.trim().match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
  if (!match) return null;

  const ip = match[1];
  const prefix = parseInt(match[2], 10);

  const octets = ip.split(".").map(Number);
  if (octets.some((o) => o < 0 || o > 255) || prefix < 0 || prefix > 32) return null;

  const ipInt = ipToInt(ip);
  const maskInt = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;

  const firstHostInt = prefix < 31 ? networkInt + 1 : networkInt;
  const lastHostInt = prefix < 31 ? broadcastInt - 1 : broadcastInt;
  const totalHosts = Math.pow(2, 32 - prefix);
  const usableHosts = prefix < 31 ? Math.max(0, totalHosts - 2) : totalHosts;

  const subnetMask = intToIp(maskInt);
  const wildcardInt = (~maskInt) >>> 0;
  const wildcardMask = intToIp(wildcardInt);

  return {
    networkAddress: intToIp(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    firstHost: intToIp(firstHostInt),
    lastHost: intToIp(lastHostInt),
    subnetMask,
    wildcardMask,
    totalHosts,
    usableHosts,
    cidr: prefix,
    ipClass: getClass(ip),
    binary: {
      ip: toBinary(ip),
      mask: toBinary(subnetMask),
    },
  };
}

function calcSubnets(info: SubnetInfo, splitPrefix: number): SubnetSplit[] {
  if (splitPrefix <= info.cidr || splitPrefix > 30) return [];
  const networkInt = ipToInt(info.networkAddress);
  const count = Math.pow(2, splitPrefix - info.cidr);
  const size = Math.pow(2, 32 - splitPrefix);
  const results: SubnetSplit[] = [];
  for (let i = 0; i < Math.min(count, 256); i++) {
    const netInt = (networkInt + i * size) >>> 0;
    const bcInt = (netInt + size - 1) >>> 0;
    results.push({
      network: intToIp(netInt) + "/" + splitPrefix,
      broadcast: intToIp(bcInt),
      firstHost: intToIp((netInt + 1) >>> 0),
      lastHost: intToIp((bcInt - 1) >>> 0),
    });
  }
  return results;
}

const EXAMPLES = ["192.168.1.0/24", "10.0.0.0/8", "172.16.0.0/12", "192.168.100.50/27", "10.10.10.0/30"];

export default function SubnetCalculator() {
  const [input, setInput]         = useState("192.168.1.0/24");
  const [splitPrefix, setSplitPrefix] = useState(26);

  const info = useMemo(() => calcSubnet(input), [input]);
  const subnets = useMemo(() => (info ? calcSubnets(info, splitPrefix) : []), [info, splitPrefix]);

  const Row = ({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) => (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "12px", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{label}</span>
      <span style={{ fontSize: "14px", fontFamily: mono ? "var(--font-geist-mono), monospace" : "inherit", wordBreak: "break-all" }}>{value}</span>
    </div>
  );

  return (
    <div className="tool-page">
      <h1>IPv4 Subnet Calculator</h1>
      <p className="desc">Enter an IPv4 address in CIDR notation to calculate network address, broadcast, host range, subnet mask, and more.</p>

      <div className="btn-group mb-4" style={{ flexWrap: "wrap" }}>
        {EXAMPLES.map((ex) => (
          <button key={ex} className={`btn ${input === ex ? "btn-primary" : ""}`} onClick={() => setInput(ex)}>{ex}</button>
        ))}
      </div>

      <div className="flex gap-2 items-center mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 192.168.1.0/24"
          className="font-mono"
          style={{ flex: 1 }}
          spellCheck={false}
          autoFocus
        />
        <CopyButton text={input} />
      </div>

      {info ? (
        <>
          <div className="card mb-6">
            <Row label="Network Address"   value={info.networkAddress} />
            <Row label="Broadcast Address" value={info.broadcastAddress} />
            <Row label="First Usable Host" value={info.firstHost} />
            <Row label="Last Usable Host"  value={info.lastHost} />
            <Row label="Subnet Mask"       value={info.subnetMask} />
            <Row label="Wildcard Mask"     value={info.wildcardMask} />
            <Row label="CIDR Prefix"       value={`/${info.cidr}`} />
            <Row label="IP Class"          value={info.ipClass} mono={false} />
            <Row label="Total Hosts"       value={info.totalHosts.toLocaleString()} mono={false} />
            <Row label="Usable Hosts"      value={info.usableHosts.toLocaleString()} mono={false} />
          </div>

          <div className="card mb-6">
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>Binary representation</p>
            <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "13px", lineHeight: "1.8" }}>
              <div><span style={{ color: "var(--text-secondary)", display: "inline-block", width: "80px" }}>IP:</span>{info.binary.ip}</div>
              <div><span style={{ color: "var(--text-secondary)", display: "inline-block", width: "80px" }}>Mask:</span>{info.binary.mask}</div>
            </div>
          </div>

          {info.cidr < 30 && (
            <div className="card mb-6">
              <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>Subnet Splitter</p>
              <div className="flex gap-2 items-center mb-4">
                <span style={{ fontSize: "14px" }}>Split into /{splitPrefix} subnets:</span>
                <input
                  type="number"
                  min={info.cidr + 1}
                  max={30}
                  value={splitPrefix}
                  onChange={(e) => setSplitPrefix(Math.min(30, Math.max(info.cidr + 1, parseInt(e.target.value) || info.cidr + 1)))}
                  style={{ width: "70px" }}
                />
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  ({Math.pow(2, splitPrefix - info.cidr)} subnets, {Math.max(0, Math.pow(2, 32 - splitPrefix) - 2).toLocaleString()} hosts each)
                </span>
              </div>
              <div style={{ maxHeight: "300px", overflow: "auto" }}>
                <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border)" }}>
                      <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500 }}>#</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500 }}>Network</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500 }}>First Host</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500 }}>Last Host</th>
                      <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 500 }}>Broadcast</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subnets.map((s, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "6px 8px", color: "var(--text-secondary)" }}>{i + 1}</td>
                        <td style={{ padding: "6px 8px", fontFamily: "var(--font-geist-mono), monospace" }}>{s.network}</td>
                        <td style={{ padding: "6px 8px", fontFamily: "var(--font-geist-mono), monospace" }}>{s.firstHost}</td>
                        <td style={{ padding: "6px 8px", fontFamily: "var(--font-geist-mono), monospace" }}>{s.lastHost}</td>
                        <td style={{ padding: "6px 8px", fontFamily: "var(--font-geist-mono), monospace" }}>{s.broadcast}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        input.trim() && (
          <p className="error-text mb-4">Invalid CIDR notation. Use format: 192.168.1.0/24</p>
        )
      )}

      <section className="tool-prose">
        <h2>About the IPv4 Subnet Calculator</h2>
        <p>This tool calculates all key properties of an IPv4 subnet from CIDR (Classless Inter-Domain Routing) notation — the standard format for specifying an IP address and its network prefix length (e.g., <code>192.168.1.0/24</code>). Enter any valid IPv4 CIDR and instantly get the network address, broadcast address, first and last usable host, subnet mask, wildcard mask, total hosts, and usable host count.</p>
        <p>CIDR notation replaced the older class-based addressing system (Class A/B/C) and is used universally in modern networking: router configurations, cloud VPC setup (AWS, GCP, Azure), firewall rules, and Kubernetes network policies all use CIDR ranges. A <code>/24</code> gives 254 usable hosts; a <code>/27</code> gives 30; a <code>/30</code> gives 2 (point-to-point links). The subnet splitter shows how to divide a larger network into equal-sized subnets.</p>
        <p>All calculations run locally in your browser using pure JavaScript bitwise arithmetic. No IP addresses are sent to any server.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What is CIDR notation?</summary>
          <p>CIDR (Classless Inter-Domain Routing) notation expresses an IP address and its network prefix as <code>address/prefix</code>, e.g., <code>192.168.1.0/24</code>. The prefix length (0–32) specifies how many bits are fixed for the network — the remaining bits identify individual hosts within that network.</p>
        </details>
        <details>
          <summary>What is the difference between network address and broadcast address?</summary>
          <p>The network address is the first address in a subnet (all host bits set to 0) and identifies the subnet itself — it cannot be assigned to a host. The broadcast address is the last address (all host bits set to 1) and is used to send packets to all hosts in the subnet simultaneously. Neither is usable for individual hosts.</p>
        </details>
        <details>
          <summary>How many hosts can a /24 subnet hold?</summary>
          <p>A /24 subnet has 256 total addresses (2⁸), with 254 usable hosts — the network address and broadcast address are reserved. Common subnet sizes: /30 = 2 hosts, /29 = 6, /28 = 14, /27 = 30, /26 = 62, /25 = 126, /24 = 254, /23 = 510, /22 = 1022.</p>
        </details>
        <details>
          <summary>What is a wildcard mask?</summary>
          <p>A wildcard mask is the bitwise inverse of the subnet mask. Where the subnet mask has 1s (network bits), the wildcard mask has 0s, and vice versa. Wildcard masks are used in Cisco ACLs and OSPF configurations to match a range of IP addresses.</p>
        </details>
        <details>
          <summary>What are private IP address ranges?</summary>
          <p>RFC 1918 defines three private address ranges not routable on the public internet: <code>10.0.0.0/8</code> (Class A, 16M hosts), <code>172.16.0.0/12</code> (Class B-equivalent, 1M hosts), and <code>192.168.0.0/16</code> (Class C-equivalent, 65K hosts). These are used in home networks, corporate LANs, and cloud VPCs with NAT for internet access.</p>
        </details>
      </section>
    </div>
  );
}
