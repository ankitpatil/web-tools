"use client";

import { useState, useEffect, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

interface UAResult {
  browser: { name: string; version: string };
  engine:  { name: string; version: string };
  os:      { name: string; version: string };
  device:  { type: string; vendor: string; model: string };
  raw:     string;
}

function parseUA(ua: string): UAResult {
  const s = ua.trim();

  // Browser detection
  let browserName = "Unknown";
  let browserVersion = "";

  if (/Edg\/(\S+)/.test(s)) {
    browserName = "Microsoft Edge";
    browserVersion = s.match(/Edg\/(\S+)/)?.[1] ?? "";
  } else if (/OPR\/(\S+)/.test(s) || /Opera\/(\S+)/.test(s)) {
    browserName = "Opera";
    browserVersion = (s.match(/OPR\/(\S+)/) ?? s.match(/Opera\/(\S+)/))?.[1] ?? "";
  } else if (/SamsungBrowser\/(\S+)/.test(s)) {
    browserName = "Samsung Internet";
    browserVersion = s.match(/SamsungBrowser\/(\S+)/)?.[1] ?? "";
  } else if (/UCBrowser\/(\S+)/.test(s)) {
    browserName = "UC Browser";
    browserVersion = s.match(/UCBrowser\/(\S+)/)?.[1] ?? "";
  } else if (/YaBrowser\/(\S+)/.test(s)) {
    browserName = "Yandex Browser";
    browserVersion = s.match(/YaBrowser\/(\S+)/)?.[1] ?? "";
  } else if (/CriOS\/(\S+)/.test(s)) {
    browserName = "Chrome (iOS)";
    browserVersion = s.match(/CriOS\/(\S+)/)?.[1] ?? "";
  } else if (/FxiOS\/(\S+)/.test(s)) {
    browserName = "Firefox (iOS)";
    browserVersion = s.match(/FxiOS\/(\S+)/)?.[1] ?? "";
  } else if (/Firefox\/(\S+)/.test(s)) {
    browserName = "Firefox";
    browserVersion = s.match(/Firefox\/(\S+)/)?.[1] ?? "";
  } else if (/Chrome\/(\S+)/.test(s) && !/Chromium/.test(s)) {
    browserName = "Chrome";
    browserVersion = s.match(/Chrome\/(\S+)/)?.[1] ?? "";
  } else if (/Chromium\/(\S+)/.test(s)) {
    browserName = "Chromium";
    browserVersion = s.match(/Chromium\/(\S+)/)?.[1] ?? "";
  } else if (/Version\/(\S+).*Safari/.test(s)) {
    browserName = "Safari";
    browserVersion = s.match(/Version\/(\S+)/)?.[1] ?? "";
  } else if (/MSIE (\S+)/.test(s) || /Trident.*rv:(\S+)/.test(s)) {
    browserName = "Internet Explorer";
    browserVersion = (s.match(/MSIE ([\d.]+)/) ?? s.match(/rv:([\d.]+)/))?.[1] ?? "";
  }

  // Engine detection
  let engineName = "Unknown";
  let engineVersion = "";

  if (/Gecko\/(\S+)/.test(s) && /Firefox/.test(s)) {
    engineName = "Gecko";
    engineVersion = s.match(/rv:([\d.]+)/)?.[1] ?? "";
  } else if (/AppleWebKit\/([\d.]+)/.test(s)) {
    engineName = "WebKit";
    engineVersion = s.match(/AppleWebKit\/([\d.]+)/)?.[1] ?? "";
    if (/Chrome/.test(s) || /Chromium/.test(s)) {
      engineName = "Blink";
    }
  } else if (/Trident\/([\d.]+)/.test(s)) {
    engineName = "Trident";
    engineVersion = s.match(/Trident\/([\d.]+)/)?.[1] ?? "";
  } else if (/Presto\/([\d.]+)/.test(s)) {
    engineName = "Presto";
    engineVersion = s.match(/Presto\/([\d.]+)/)?.[1] ?? "";
  }

  // OS detection
  let osName = "Unknown";
  let osVersion = "";

  if (/Windows NT ([\d.]+)/.test(s)) {
    const ntMap: Record<string, string> = {
      "10.0": "10/11", "6.3": "8.1", "6.2": "8", "6.1": "7",
      "6.0": "Vista", "5.2": "XP x64", "5.1": "XP",
    };
    const ntVer = s.match(/Windows NT ([\d.]+)/)?.[1] ?? "";
    osName = "Windows";
    osVersion = ntMap[ntVer] ?? ntVer;
  } else if (/Android ([\d.]+)/.test(s)) {
    osName = "Android";
    osVersion = s.match(/Android ([\d.]+)/)?.[1] ?? "";
  } else if (/iPhone OS ([\d_]+)/.test(s) || /iPad.*OS ([\d_]+)/.test(s) || /iPod.*OS ([\d_]+)/.test(s)) {
    osName = "iOS";
    osVersion = (s.match(/(?:iPhone|iPad|iPod)[^;]*OS ([\d_]+)/))?.[1]?.replace(/_/g, ".") ?? "";
  } else if (/Mac OS X ([\d_.]+)/.test(s)) {
    osName = "macOS";
    osVersion = s.match(/Mac OS X ([\d_.]+)/)?.[1]?.replace(/_/g, ".") ?? "";
  } else if (/Linux/.test(s) && !/Android/.test(s)) {
    osName = "Linux";
    if (/Ubuntu/.test(s)) osName = "Ubuntu";
    else if (/Fedora/.test(s)) osName = "Fedora";
    else if (/CrOS/.test(s)) osName = "Chrome OS";
  } else if (/CrOS/.test(s)) {
    osName = "Chrome OS";
  }

  // Device detection
  let deviceType = "Desktop";
  let deviceVendor = "";
  let deviceModel = "";

  if (/Mobi|Mobile|Android.*Mobile/.test(s)) {
    deviceType = "Mobile";
  } else if (/iPad|Tablet|tablet/.test(s)) {
    deviceType = "Tablet";
  } else if (/Android(?!.*Mobile)/.test(s)) {
    deviceType = "Tablet";
  }

  if (/iPhone/.test(s))      { deviceVendor = "Apple"; deviceModel = "iPhone"; }
  else if (/iPad/.test(s))   { deviceVendor = "Apple"; deviceModel = "iPad"; }
  else if (/iPod/.test(s))   { deviceVendor = "Apple"; deviceModel = "iPod"; }
  else if (/Pixel (\w+)/.test(s)) { deviceVendor = "Google"; deviceModel = "Pixel " + (s.match(/Pixel (\w+)/)?.[1] ?? ""); }
  else if (/SM-(\w+)/.test(s))    { deviceVendor = "Samsung"; deviceModel = s.match(/SM-(\w+)/)?.[1] ?? ""; }
  else if (/Nexus (\d+)/.test(s)) { deviceVendor = "Google"; deviceModel = "Nexus " + (s.match(/Nexus (\d+)/)?.[1] ?? ""); }

  return {
    browser: { name: browserName, version: browserVersion },
    engine:  { name: engineName, version: engineVersion },
    os:      { name: osName, version: osVersion },
    device:  { type: deviceType, vendor: deviceVendor, model: deviceModel },
    raw:     s,
  };
}

const SAMPLES = [
  { label: "Chrome/Mac", ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" },
  { label: "Firefox/Win", ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0" },
  { label: "Safari/iOS", ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1" },
  { label: "Edge/Win", ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0" },
  { label: "Android Chrome", ua: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.105 Mobile Safari/537.36" },
];

export default function UserAgentParser() {
  const [ua, setUa] = useState("");

  useEffect(() => {
    setUa(navigator.userAgent);
  }, []);

  const result = useMemo(() => (ua.trim() ? parseUA(ua) : null), [ua]);

  const Chip = ({ label, value }: { label: string; value: string }) => (
    <div className="card" style={{ padding: "12px 16px" }}>
      <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>{label}</p>
      <p style={{ fontSize: "15px", fontWeight: 600 }}>{value || "—"}</p>
    </div>
  );

  return (
    <div className="tool-page">
      <h1>User Agent Parser</h1>
      <p className="desc">Parse any User-Agent string to extract browser, engine, OS, and device details. Your current UA is pre-loaded automatically.</p>

      <div className="btn-group mb-3" style={{ flexWrap: "wrap" }}>
        <button className="btn" onClick={() => setUa(navigator.userAgent)}>My UA</button>
        {SAMPLES.map((s) => (
          <button key={s.label} className="btn" onClick={() => setUa(s.ua)}>{s.label}</button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <textarea
          className="tool-input"
          rows={3}
          value={ua}
          onChange={(e) => setUa(e.target.value)}
          placeholder="Paste a User-Agent string here..."
          spellCheck={false}
          style={{ flex: 1 }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <CopyButton text={ua} />
          <button className="btn" onClick={() => setUa("")}>Clear</button>
        </div>
      </div>

      {result && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "16px" }}>
            <Chip label="Browser"       value={[result.browser.name, result.browser.version].filter(Boolean).join(" ")} />
            <Chip label="Engine"        value={[result.engine.name, result.engine.version].filter(Boolean).join(" ")} />
            <Chip label="OS"            value={[result.os.name, result.os.version].filter(Boolean).join(" ")} />
            <Chip label="Device Type"   value={result.device.type} />
            <Chip label="Vendor"        value={result.device.vendor} />
            <Chip label="Model"         value={result.device.model} />
          </div>

          <div className="card mb-4">
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>Raw User-Agent</p>
            <p style={{ fontSize: "13px", fontFamily: "var(--font-geist-mono), monospace", wordBreak: "break-all", lineHeight: "1.6" }}>{result.raw}</p>
          </div>
        </>
      )}

      <section className="tool-prose">
        <h2>About the User Agent Parser</h2>
        <p>The User-Agent (UA) string is an HTTP request header sent by every browser with each web request. It identifies the browser, rendering engine, operating system, and sometimes the device model. Web servers and analytics platforms use it to detect the client environment and serve appropriate content — though its reliability has decreased as browsers and privacy tools have modified or spoofed UA strings over the years.</p>
        <p>A typical UA string for Chrome on macOS looks like: <code>Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36</code>. The string contains legacy tokens (like "Mozilla/5.0" in all browsers) for historical compatibility, making regex-based parsing necessary. Browser, engine, OS, and device are extracted by matching known patterns against the raw string.</p>
        <p>This tool pre-loads your current browser's UA automatically. You can also paste any UA string to analyze it, or use the sample buttons to explore common browser UA formats. All parsing runs locally in your browser — no UA strings are transmitted.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What is a User-Agent string?</summary>
          <p>A User-Agent string is a text identifier sent in the <code>User-Agent</code> HTTP header by browsers, crawlers, and apps. It tells the server what software is making the request. All modern browsers include it, though its exact format varies significantly across browser families and versions.</p>
        </details>
        <details>
          <summary>Why do all browsers say "Mozilla/5.0"?</summary>
          <p>This is historical baggage. Netscape (Mozilla) was dominant when the web standardized UA strings, so all browsers began mimicking its prefix to avoid being served degraded content. Every modern browser still includes "Mozilla/5.0" even though none of them are Netscape, making the prefix meaningless for identification purposes.</p>
        </details>
        <details>
          <summary>Can I change or spoof my User-Agent?</summary>
          <p>Yes. All major browsers allow UA spoofing via DevTools (Network → User agent), browser extensions, or command-line flags. Web developers use this to test how their site behaves for different browsers or devices. Privacy tools and browsers like Brave also modify the UA to reduce fingerprinting.</p>
        </details>
        <details>
          <summary>Is UA-based browser detection reliable?</summary>
          <p>Increasingly, no. Chrome 110+ introduced User-Agent Reduction, truncating version numbers. Firefox and Safari are also reducing UA entropy. The modern recommended approach is feature detection using JavaScript (checking if an API exists) rather than UA-based browser detection, as it is more robust and future-proof.</p>
        </details>
      </section>
    </div>
  );
}
