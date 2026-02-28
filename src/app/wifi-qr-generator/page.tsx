"use client";

import { useState, useEffect, useRef } from "react";

// QRCode.js loaded via CDN in the component
declare global {
  interface Window {
    QRCode: new (el: HTMLElement, options: object) => void;
  }
}

type Security = "WPA" | "WEP" | "nopass";

function escapeWifi(s: string): string {
  // Escape special characters in WiFi QR format
  return s.replace(/([\\;,":!])/g, "\\$1");
}

function buildWifiString(ssid: string, password: string, security: Security, hidden: boolean): string {
  if (security === "nopass") {
    return `WIFI:S:${escapeWifi(ssid)};T:nopass;P:;;H:${hidden ? "true" : "false"};;`;
  }
  return `WIFI:S:${escapeWifi(ssid)};T:${security};P:${escapeWifi(password)};;H:${hidden ? "true" : "false"};;`;
}

export default function WifiQrGenerator() {
  const [ssid, setSsid]         = useState("");
  const [password, setPassword] = useState("");
  const [security, setSecurity] = useState<Security>("WPA");
  const [hidden, setHidden]     = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [fgColor, setFgColor]   = useState("#000000");
  const [bgColor, setBgColor]   = useState("#ffffff");
  const [size, setSize]         = useState(256);

  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<unknown>(null);
  const scriptLoaded = useRef(false);

  const wifiString = ssid.trim()
    ? buildWifiString(ssid.trim(), password, security, hidden)
    : "";

  // Load QRCode library
  useEffect(() => {
    if (scriptLoaded.current || document.getElementById("qrcode-script")) {
      scriptLoaded.current = true;
      return;
    }
    const script = document.createElement("script");
    script.id = "qrcode-script";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.onload = () => { scriptLoaded.current = true; renderQr(); };
    document.head.appendChild(script);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderQr() {
    if (!qrRef.current || !wifiString || typeof window.QRCode === "undefined") return;
    qrRef.current.innerHTML = "";
    qrInstance.current = new window.QRCode(qrRef.current, {
      text: wifiString,
      width: size,
      height: size,
      colorDark: fgColor,
      colorLight: bgColor,
      correctLevel: 2, // Q
    });
  }

  useEffect(() => {
    if (!scriptLoaded.current || typeof window.QRCode === "undefined") return;
    renderQr();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wifiString, fgColor, bgColor, size]);

  function downloadQr() {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `wifi-${ssid || "qr"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="tool-page">
      <h1>WiFi QR Code Generator</h1>
      <p className="desc">Generate a QR code for your WiFi network. Guests can scan it to connect instantly — no typing required. Your password never leaves your browser.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "32px", alignItems: "start" }}>
        <div>
          <label>Network Name (SSID)</label>
          <input
            type="text"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            placeholder="Your WiFi network name"
            style={{ width: "100%", marginBottom: "12px" }}
            autoFocus
          />

          <label>Security Type</label>
          <div className="btn-group mb-3">
            {(["WPA", "WEP", "nopass"] as Security[]).map((s) => (
              <button key={s} className={`btn ${security === s ? "btn-primary" : ""}`} onClick={() => setSecurity(s)}>
                {s === "nopass" ? "None (open)" : s}
              </button>
            ))}
          </div>

          {security !== "nopass" && (
            <>
              <label>Password</label>
              <div className="flex gap-2 items-center mb-3">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="WiFi password"
                  style={{ flex: 1 }}
                  autoComplete="off"
                />
                <button className="btn" onClick={() => setShowPass(!showPass)}>{showPass ? "Hide" : "Show"}</button>
              </div>
            </>
          )}

          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "16px" }}>
            <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />
            <span style={{ fontSize: "14px" }}>Hidden network (SSID not broadcast)</span>
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label>Foreground color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ width: "44px", height: "36px", padding: "2px", cursor: "pointer" }} />
                <input type="text" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ flex: 1 }} className="font-mono" />
              </div>
            </div>
            <div>
              <label>Background color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: "44px", height: "36px", padding: "2px", cursor: "pointer" }} />
                <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ flex: 1 }} className="font-mono" />
              </div>
            </div>
          </div>

          <label>Size: {size}×{size}px</label>
          <input
            type="range" min={128} max={512} step={32}
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            style={{ width: "100%", marginBottom: "16px" }}
          />

          {wifiString && (
            <div className="card" style={{ marginBottom: "12px" }}>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>WiFi QR string</p>
              <p style={{ fontSize: "12px", fontFamily: "var(--font-geist-mono), monospace", wordBreak: "break-all", color: "var(--text-secondary)" }}>{wifiString}</p>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <div
            ref={qrRef}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {!wifiString && (
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", textAlign: "center", padding: "16px" }}>
                Enter SSID to generate QR code
              </p>
            )}
          </div>
          {wifiString && (
            <button className="btn btn-primary" onClick={downloadQr}>
              Download PNG
            </button>
          )}
        </div>
      </div>

      <section className="tool-prose">
        <h2>About the WiFi QR Code Generator</h2>
        <p>This tool generates a QR code that encodes your WiFi network credentials in the standard <code>WIFI:</code> URI format (<code>WIFI:S:NetworkName;T:WPA;P:password;;</code>). When scanned by a smartphone — Android or iOS — it prompts the user to join the network immediately, without typing the password. This is ideal for guest networks, offices, cafes, and events where many people need to connect quickly.</p>
        <p>The tool supports WPA/WPA2 (the most common home and office security), WEP (legacy), and open networks with no password. For hidden networks where the SSID is not broadcast, enable the "Hidden network" toggle to include the <code>H:true</code> flag in the QR payload. You can customize the QR code foreground and background colors and adjust the size for print or display use.</p>
        <p>Your WiFi password is never transmitted anywhere — all QR code generation runs locally in your browser using the QRCode.js library. The generated QR code can be downloaded as a PNG and printed, displayed on a screen, or embedded in a document.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>How do I scan a WiFi QR code?</summary>
          <p>On iOS (11+), open the Camera app and point it at the QR code — a notification will appear to join the network. On Android (10+), go to Settings → Network → WiFi and tap "Add network" or use the camera app. QR code scanner apps also work on older devices.</p>
        </details>
        <details>
          <summary>Is my WiFi password safe?</summary>
          <p>Yes. The password is encoded directly in the QR code and never sent to any server — all processing happens in your browser. However, anyone who scans the QR code will be able to read the password from the encoded string, so treat a printed WiFi QR code like a written password.</p>
        </details>
        <details>
          <summary>What security type should I choose?</summary>
          <p>Choose WPA for modern routers using WPA2 or WPA3 — this covers the vast majority of home and business networks. Choose WEP only for very old routers (WEP is not secure and should be upgraded). Choose "None" for open guest networks with no password.</p>
        </details>
        <details>
          <summary>Can I print the QR code?</summary>
          <p>Yes. Download the QR code as a PNG and print it. For best results at print size, increase the size to 512px before downloading. The error correction level (Q — 25% redundancy) ensures the code remains scannable even if part of the printout is damaged or dirty.</p>
        </details>
      </section>
    </div>
  );
}
