import Link from "next/link";

const tools = [
  { name: "JSON Formatter", desc: "Format, minify, validate, tree view, CSV/XML", href: "/json-formatter", icon: "{ }" },
  { name: "JSON to CSV", desc: "Convert JSON array to CSV", href: "/json-to-csv", icon: "📊" },
  { name: "CSV to JSON", desc: "Convert CSV to JSON array", href: "/csv-to-json", icon: "📋" },
  { name: "Base64 Encode/Decode", desc: "Encode or decode Base64 strings & files", href: "/base64", icon: "🔤" },
  { name: "UUID Generator", desc: "Generate UUID v4 individually or in bulk", href: "/uuid-generator", icon: "🆔" },
  { name: "URL Encoder/Decoder", desc: "Encode or decode URL components", href: "/url-encoder", icon: "🔗" },
  { name: "Timestamp Converter", desc: "Convert timestamps with timezone support", href: "/timestamp-converter", icon: "⏱️" },
  { name: "Regex Tester", desc: "Test regex patterns with live highlighting", href: "/regex-tester", icon: "🔍" },
  { name: "JWT Decoder", desc: "Decode JWT header, payload & check expiry", href: "/jwt-decoder", icon: "🔐" },
  { name: "Hash Generator", desc: "MD5, SHA-1, SHA-256, SHA-512 hashing", href: "/hash-generator", icon: "#️⃣" },
  { name: "Color Converter", desc: "Convert between HEX, RGB & HSL", href: "/color-converter", icon: "🎨" },
  { name: "QR Code Generator", desc: "Generate QR codes with custom colors & sizes", href: "/qr-generator", icon: "📱" },
  { name: "YAML ↔ JSON", desc: "Convert between YAML and JSON", href: "/yaml-json", icon: "🔄" },
  { name: "Markdown Preview", desc: "Write Markdown and preview it live", href: "/markdown-preview", icon: "📝" },
  { name: "Text Diff", desc: "Compare two texts side by side", href: "/text-diff", icon: "📊" },
  { name: "SQL Formatter", desc: "Format and beautify SQL queries", href: "/sql-formatter", icon: "🗃️" },
  { name: "Lorem Ipsum", desc: "Generate placeholder text", href: "/lorem-ipsum", icon: "📄" },
  { name: "HTML/CSS/JS Minifier", desc: "Minify code with size comparison", href: "/html-minifier", icon: "📦" },
  { name: "CSS Gradient Generator", desc: "Build CSS gradients visually", href: "/css-gradient", icon: "🌈" },
  { name: "Number to Words", desc: "Convert numbers to English words", href: "/number-to-words", icon: "🔢" },
  { name: "Image Compressor", desc: "Compress images in the browser", href: "/image-compressor", icon: "🖼️" },
  { name: "Image to Base64", desc: "Convert images to Base64 for embedding", href: "/image-to-base64", icon: "📷" },
  { name: "Base64 to Image", desc: "Convert Base64 back to image", href: "/base64-to-image", icon: "🖼️" },
  { name: "XML ↔ JSON", desc: "Convert between XML and JSON", href: "/xml-to-json", icon: "📋" },
  { name: "Hex Converter", desc: "Convert between Hex, Dec, Bin, Oct", href: "/hex-converter", icon: "🔢" },
  { name: "SVG Optimizer", desc: "Optimize SVG markup and reduce size", href: "/svg-optimizer", icon: "✨" },
  { name: "Flexbox/Grid Generator", desc: "Build CSS layouts visually", href: "/flexbox-generator", icon: "📐" },
  { name: "Crontab Generator", desc: "Build cron expressions with schedule preview", href: "/crontab-generator", icon: "⏰" },
  { name: "JSON to TypeScript", desc: "Generate TypeScript interfaces from JSON", href: "/json-to-typescript", icon: "🔷" },
  { name: "Chmod Calculator", desc: "Calculate Linux file permissions visually", href: "/chmod-calculator", icon: "🔒" },
  { name: "bcrypt Generator", desc: "Hash and verify passwords with bcrypt", href: "/bcrypt-generator", icon: "🔑" },
  { name: "HMAC Generator", desc: "Generate HMAC-SHA256/384/512 signatures", href: "/hmac-generator", icon: "✍️" },
  { name: "Password Strength", desc: "Analyze password entropy and crack time", href: "/password-strength", icon: "🛡️" },
  { name: "HTTP Status Codes", desc: "Complete reference for all HTTP status codes", href: "/http-status-codes", icon: "🌐" },
  { name: "Subnet Calculator", desc: "Calculate IPv4 CIDR subnets and host ranges", href: "/subnet-calculator", icon: "🌍" },
  { name: "User Agent Parser", desc: "Detect browser, OS, and device from UA string", href: "/user-agent-parser", icon: "🔎" },
  { name: "WiFi QR Generator", desc: "Share WiFi password as a scannable QR code", href: "/wifi-qr-generator", icon: "📶" },
  { name: "JWT Encoder", desc: "Create and sign JWT tokens with HS256/384/512", href: "/jwt-encoder", icon: "🔏" },
  { name: "Meta Tag Generator", desc: "Generate SEO and Open Graph meta tags", href: "/meta-tag-generator", icon: "🏷️" },
  { name: "Docker → Compose", desc: "Convert docker run to docker-compose.yml", href: "/docker-compose-converter", icon: "🐳" },
  { name: "curl to Code", desc: "Convert curl to Python, JS, Go, PHP", href: "/curl-to-code", icon: "⚡" },
  { name: "Contrast Checker", desc: "Check WCAG AA/AAA color contrast ratios", href: "/contrast-checker", icon: "👁️" },
  { name: "ASCII / Hex Converter", desc: "Encode text to hex, binary, octal, Base64", href: "/ascii-hex", icon: "🔡" },
  { name: "HTML Entities", desc: "Encode and decode HTML entities", href: "/html-entities", icon: "🏷️" },
  { name: "Semver Comparator", desc: "Compare and sort semantic version numbers", href: "/semver", icon: "📦" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">⚡ OnlineFreeTools.dev</h1>
        <p className="text-lg text-[var(--text-secondary)]">
          45+ free developer tools that run entirely in your browser. Fast, private, no sign-up.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((t) => (
          <Link key={t.href} href={t.href} className="card group block">
            <div className="mb-2 text-2xl">{t.icon}</div>
            <h2 className="mb-1 font-semibold group-hover:text-[var(--accent)]">{t.name}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
