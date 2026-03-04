"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/CopyButton";

type Lang = "python" | "fetch" | "axios" | "go" | "php";

interface ParsedCurl {
  url: string;
  method: string;
  headers: [string, string][];
  body: string;
  isJson: boolean;
  isForm: boolean;
  formFields: [string, string][];
  auth: { user: string; pass: string } | null;
  cookies: string;
  followRedirects: boolean;
  insecure: boolean;
  compressed: boolean;
}

function tokenize(cmd: string): string[] {
  const tokens: string[] = [];
  let cur = "";
  let inSingle = false;
  let inDouble = false;
  let i = 0;
  while (i < cmd.length) {
    const c = cmd[i];
    const next = cmd[i + 1];
    if (c === "\\" && inDouble && next !== undefined) {
      cur += next; i += 2; continue;
    }
    if (c === "'" && !inDouble) { inSingle = !inSingle; i++; continue; }
    if (c === '"' && !inSingle) { inDouble = !inDouble; i++; continue; }
    if ((c === " " || c === "\t" || c === "\n") && !inSingle && !inDouble) {
      if (cur) { tokens.push(cur); cur = ""; }
      // skip line continuation
      if (c === "\n" && tokens[tokens.length - 1] === "\\") tokens.pop();
      i++; continue;
    }
    if (c === "\\" && !inSingle && !inDouble && (next === "\n" || next === " ")) {
      i += 2; continue;
    }
    cur += c; i++;
  }
  if (cur) tokens.push(cur);
  return tokens;
}

function parseCurl(raw: string): ParsedCurl | null {
  const cmd = raw.trim().replace(/\\\s*\n/g, " ");
  const tokens = tokenize(cmd);
  if (!tokens.length) return null;

  // Strip 'curl' from start
  let start = 0;
  if (tokens[start] === "curl") start++;

  const result: ParsedCurl = {
    url: "", method: "GET", headers: [], body: "", isJson: false, isForm: false,
    formFields: [], auth: null, cookies: "", followRedirects: false,
    insecure: false, compressed: false,
  };

  let i = start;
  while (i < tokens.length) {
    const t = tokens[i];

    const nextVal = () => {
      i++;
      return tokens[i] ?? "";
    };

    const getVal = (flag: string, short?: string): string | null => {
      if (t === flag || (short && t === short)) return nextVal();
      if (t.startsWith(flag + "=")) return t.slice(flag.length + 1);
      if (short && t.startsWith(short) && t.length > short.length && !t.startsWith(short + "-"))
        return t.slice(short.length);
      return null;
    };

    let v: string | null;

    if ((v = getVal("--request", "-X")) !== null) {
      result.method = v.toUpperCase();
    } else if ((v = getVal("--url")) !== null || (!t.startsWith("-") && !result.url)) {
      result.url = v ?? t;
    } else if ((v = getVal("--header", "-H")) !== null) {
      const colon = v.indexOf(":");
      if (colon > -1) {
        result.headers.push([v.slice(0, colon).trim(), v.slice(colon + 1).trim()]);
      }
    } else if ((v = getVal("--data-raw")) !== null || (v = getVal("--data-binary")) !== null
            || (v = getVal("--data", "-d")) !== null || (v = getVal("--data-urlencode")) !== null) {
      result.body = v!;
      if (result.method === "GET") result.method = "POST";
    } else if ((v = getVal("--form", "-F")) !== null) {
      result.isForm = true;
      if (result.method === "GET") result.method = "POST";
      const eq = v!.indexOf("=");
      if (eq > -1) result.formFields.push([v!.slice(0, eq), v!.slice(eq + 1)]);
    } else if ((v = getVal("--user", "-u")) !== null) {
      const colon = v!.indexOf(":");
      result.auth = colon > -1
        ? { user: v!.slice(0, colon), pass: v!.slice(colon + 1) }
        : { user: v!, pass: "" };
    } else if ((v = getVal("--cookie", "-b")) !== null) {
      result.cookies = v!;
    } else if (t === "-L" || t === "--location") {
      result.followRedirects = true;
    } else if (t === "-k" || t === "--insecure") {
      result.insecure = true;
    } else if (t === "--compressed") {
      result.compressed = true;
    } else if (t === "-G" || t === "--get") {
      result.method = "GET";
    } else if (t === "-s" || t === "--silent" || t === "-v" || t === "--verbose"
            || t === "-i" || t === "--include" || t === "-I" || t === "--head") {
      // ignore
    }
    i++;
  }

  // Detect JSON body
  if (result.body) {
    try { JSON.parse(result.body); result.isJson = true; } catch { /* not json */ }
    const ct = result.headers.find(([k]) => k.toLowerCase() === "content-type");
    if (ct && ct[1].includes("application/json")) result.isJson = true;
  }

  return result.url ? result : null;
}

function q(s: string) { return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}`  + `"`; }
function sq(s: string) { return `'${s.replace(/'/g, "\\'")}'`; }

function toPython(p: ParsedCurl): string {
  const lines: string[] = ["import requests", ""];
  if (p.headers.length) {
    lines.push("headers = {");
    p.headers.forEach(([k, v]) => lines.push(`    ${q(k)}: ${q(v)},`));
    lines.push("}", "");
  }
  const args: string[] = [`    ${q(p.url)}`];
  if (p.headers.length) args.push("    headers=headers");
  if (p.auth) args.push(`    auth=(${q(p.auth.user)}, ${q(p.auth.pass)})`);
  if (p.cookies) args.push(`    cookies=${q(p.cookies)}`);
  if (p.insecure) args.push("    verify=False");
  if (!p.followRedirects) args.push("    allow_redirects=False");
  if (p.isJson) {
    lines.push(`payload = ${p.body}`, "");
    args.push("    json=payload");
  } else if (p.isForm && p.formFields.length) {
    lines.push("files = {");
    p.formFields.forEach(([k, v]) => lines.push(`    ${q(k)}: (None, ${q(v)}),`));
    lines.push("}", "");
    args.push("    files=files");
  } else if (p.body) {
    args.push(`    data=${q(p.body)}`);
  }
  lines.push(`response = requests.${p.method.toLowerCase()}(`);
  args.forEach((a, i) => lines.push(a + (i < args.length - 1 ? "," : "")));
  lines.push(")", "");
  lines.push("print(response.status_code)");
  lines.push("print(response.json())");
  return lines.join("\n");
}

function toFetch(p: ParsedCurl): string {
  const lines: string[] = [];
  const opts: string[] = [];
  if (p.method !== "GET") opts.push(`  method: ${q(p.method)}`);
  if (p.headers.length) {
    const hlines = [`  headers: {`];
    p.headers.forEach(([k, v]) => hlines.push(`    ${q(k)}: ${q(v)},`));
    hlines.push("  }");
    opts.push(hlines.join("\n"));
  }
  if (p.auth) {
    const cred = btoa(`${p.auth.user}:${p.auth.pass}`);
    opts.push(`  headers: { "Authorization": "Basic ${cred}" }`);
  }
  if (p.isJson) {
    opts.push(`  body: JSON.stringify(${p.body})`);
  } else if (p.body) {
    opts.push(`  body: ${q(p.body)}`);
  }
  if (p.insecure) lines.push("// Warning: certificate verification disabled (--insecure) is not supported in browser fetch");
  lines.push(`const response = await fetch(${q(p.url)}${opts.length ? ", {\n" + opts.join(",\n") + "\n}" : ""});`);
  lines.push("const data = await response.json();");
  lines.push("console.log(data);");
  return lines.join("\n");
}

function toAxios(p: ParsedCurl): string {
  const lines: string[] = ["import axios from 'axios';", ""];
  const config: string[] = [`  url: ${q(p.url)}`, `  method: ${q(p.method.toLowerCase())}`];
  if (p.headers.length) {
    const hlines = ["  headers: {"];
    p.headers.forEach(([k, v]) => hlines.push(`    ${q(k)}: ${q(v)},`));
    hlines.push("  }");
    config.push(hlines.join("\n"));
  }
  if (p.auth) config.push(`  auth: { username: ${q(p.auth.user)}, password: ${q(p.auth.pass)} }`);
  if (p.isJson) config.push(`  data: ${p.body}`);
  else if (p.body) config.push(`  data: ${q(p.body)}`);
  lines.push("const response = await axios({");
  config.forEach((c, i) => lines.push(c + (i < config.length - 1 ? "," : "")));
  lines.push("});", "");
  lines.push("console.log(response.data);");
  return lines.join("\n");
}

function toGo(p: ParsedCurl): string {
  const lines: string[] = ['package main', '', 'import ('];
  const imports = new Set(["\"fmt\"", "\"io\"", "\"net/http\""]);
  if (p.isJson || p.body) imports.add("\"strings\"");
  if (p.auth) imports.add("\"encoding/base64\"");
  imports.forEach((imp) => lines.push(`\t${imp}`));
  lines.push(")", "");
  lines.push("func main() {");

  if (p.body) {
    lines.push(`\tbody := strings.NewReader(${q(p.body)})`);
    lines.push(`\treq, _ := http.NewRequest(${q(p.method)}, ${q(p.url)}, body)`);
  } else {
    lines.push(`\treq, _ := http.NewRequest(${q(p.method)}, ${q(p.url)}, nil)`);
  }

  p.headers.forEach(([k, v]) => lines.push(`\treq.Header.Set(${q(k)}, ${q(v)})`));
  if (p.auth) {
    lines.push(`\tcreds := base64.StdEncoding.EncodeToString([]byte(${q(p.auth.user + ":" + p.auth.pass)}))`);
    lines.push('\treq.Header.Set("Authorization", "Basic "+creds)');
  }
  if (p.cookies) lines.push(`\treq.Header.Set("Cookie", ${q(p.cookies)})`);

  lines.push("");
  if (p.insecure) {
    lines.push('\tclient := &http.Client{Transport: &http.Transport{TLSClientConfig: &tls.Config{InsecureSkipVerify: true}}}');
  } else {
    lines.push("\tclient := &http.Client{}");
  }
  lines.push("\tresp, _ := client.Do(req)");
  lines.push("\tdefer resp.Body.Close()");
  lines.push("");
  lines.push("\tbody2, _ := io.ReadAll(resp.Body)");
  lines.push('\tfmt.Println(string(body2))');
  lines.push("}");
  return lines.join("\n");
}

function toPhp(p: ParsedCurl): string {
  const lines: string[] = ["<?php", "", "$ch = curl_init();", ""];
  lines.push(`curl_setopt($ch, CURLOPT_URL, ${sq(p.url)});`);
  lines.push("curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);");
  if (p.method !== "GET") lines.push(`curl_setopt($ch, CURLOPT_CUSTOMREQUEST, ${sq(p.method)});`);
  if (p.headers.length) {
    lines.push("curl_setopt($ch, CURLOPT_HTTPHEADER, [");
    p.headers.forEach(([k, v]) => lines.push(`    ${sq(k + ": " + v)},`));
    lines.push("]);");
  }
  if (p.auth) lines.push(`curl_setopt($ch, CURLOPT_USERPWD, ${sq(p.auth.user + ":" + p.auth.pass)});`);
  if (p.body) lines.push(`curl_setopt($ch, CURLOPT_POSTFIELDS, ${sq(p.body)});`);
  if (p.insecure) lines.push("curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);");
  if (p.followRedirects) lines.push("curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);");
  lines.push("", "$response = curl_exec($ch);");
  lines.push("curl_close($ch);", "echo $response;");
  return lines.join("\n");
}

const LANG_LABELS: Record<Lang, string> = {
  python: "Python", fetch: "JS fetch", axios: "Axios", go: "Go", php: "PHP",
};

const EXAMPLES = [
  {
    label: "POST JSON",
    cmd: `curl -X POST https://api.example.com/users \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer TOKEN" \\\n  -d '{"name":"Alice","email":"alice@example.com"}'`,
  },
  {
    label: "GET with headers",
    cmd: `curl https://api.github.com/repos/owner/repo \\\n  -H "Accept: application/vnd.github+json" \\\n  -H "Authorization: Bearer ghp_token"`,
  },
  {
    label: "Basic auth",
    cmd: `curl -X GET https://api.example.com/data \\\n  -u username:password \\\n  -H "Accept: application/json"`,
  },
  {
    label: "Form upload",
    cmd: `curl -X POST https://api.example.com/upload \\\n  -F "file=@photo.jpg" \\\n  -F "title=My Photo"`,
  },
];

export default function CurlToCode() {
  const [input, setInput] = useState(EXAMPLES[0].cmd);
  const [lang, setLang]   = useState<Lang>("python");

  const parsed = useMemo(() => parseCurl(input), [input]);

  const output = useMemo(() => {
    if (!parsed) return input.trim() ? "# Could not parse curl command. Make sure it starts with 'curl'." : "";
    if (lang === "python") return toPython(parsed);
    if (lang === "fetch")  return toFetch(parsed);
    if (lang === "axios")  return toAxios(parsed);
    if (lang === "go")     return toGo(parsed);
    if (lang === "php")    return toPhp(parsed);
    return "";
  }, [parsed, lang, input]);

  return (
    <div className="tool-page">
      <h1>curl to Code Converter</h1>
      <p className="desc">Convert <code>curl</code> commands to Python, JavaScript (fetch &amp; Axios), Go, or PHP code. Handles headers, JSON body, form data, auth, and cookies.</p>

      <div className="btn-group mb-3" style={{ flexWrap: "wrap" }}>
        {EXAMPLES.map((ex) => (
          <button key={ex.label} className={`btn ${input === ex.cmd ? "btn-primary" : ""}`} onClick={() => setInput(ex.cmd)}>{ex.label}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <label style={{ margin: 0 }}>curl command</label>
            <button className="btn" style={{ fontSize: "12px" }} onClick={() => setInput("")}>Clear</button>
          </div>
          <textarea
            className="tool-input font-mono"
            rows={14}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"curl https://api.example.com \\\n  -H \"Authorization: Bearer TOKEN\""}
            spellCheck={false}
          />
          {parsed && (
            <div className="card mt-3" style={{ padding: "10px 14px" }}>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>Parsed</p>
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "4px 8px", fontSize: "13px" }}>
                <span style={{ color: "var(--text-secondary)" }}>Method</span><span className="font-mono">{parsed.method}</span>
                <span style={{ color: "var(--text-secondary)" }}>URL</span><span className="font-mono" style={{ wordBreak: "break-all" }}>{parsed.url}</span>
                {parsed.headers.length > 0 && <><span style={{ color: "var(--text-secondary)" }}>Headers</span><span>{parsed.headers.length}</span></>}
                {parsed.auth && <><span style={{ color: "var(--text-secondary)" }}>Auth</span><span>{parsed.auth.user}:***</span></>}
                {parsed.body && <><span style={{ color: "var(--text-secondary)" }}>Body</span><span>{parsed.isJson ? "JSON" : "raw"}</span></>}
              </div>
            </div>
          )}
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <div className="btn-group">
              {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
                <button key={l} className={`btn ${lang === l ? "btn-primary" : ""}`} style={{ fontSize: "12px" }} onClick={() => setLang(l)}>{LANG_LABELS[l]}</button>
              ))}
            </div>
            <CopyButton text={output} />
          </div>
          <pre className="output-box font-mono" style={{ fontSize: "12px", minHeight: "320px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {output || "Enter a curl command to convert…"}
          </pre>
        </div>
      </div>

      <section className="tool-prose">
        <h2>About the curl to Code Converter</h2>
        <p><code>curl</code> is the universal language for HTTP requests — API documentation, Postman exports, browser DevTools, and Stack Overflow answers all express requests as curl commands. But when you need to make that same request in application code, rewriting it manually is tedious and error-prone, especially for requests with multiple headers, JSON bodies, or authentication. This tool converts any curl command into idiomatic code in your language of choice.</p>
        <p>Supported flags include <code>-X</code> (method), <code>-H</code> (headers), <code>-d</code> / <code>--data-raw</code> (body), <code>-u</code> (basic auth), <code>-F</code> (form fields), <code>-b</code> (cookies), <code>-L</code> (follow redirects), <code>-k</code> (insecure), and <code>--compressed</code>. JSON bodies are automatically detected and passed as native objects in Python (<code>json=</code>) and Axios (<code>data:</code>). The output uses the most idiomatic library for each language: <code>requests</code> for Python, native <code>fetch</code> or <code>axios</code> for JavaScript, <code>net/http</code> for Go, and <code>curl_*</code> functions for PHP.</p>
        <p>All parsing runs locally in your browser using JavaScript. No curl commands, headers, or authentication credentials are sent to any server.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>How do I get a curl command from my browser?</summary>
          <p>Open DevTools → Network tab → right-click any request → "Copy as cURL". This copies the exact curl command the browser sent, including all headers and cookies. You can then paste it here to convert it to code.</p>
        </details>
        <details>
          <summary>How do I get a curl command from Postman?</summary>
          <p>In Postman, open a request → click the code icon (&lt;/&gt;) on the right sidebar → select "cURL" from the language dropdown. Postman generates the complete curl command including the current auth and headers.</p>
        </details>
        <details>
          <summary>Why does the Python output use <code>json=</code> instead of <code>data=</code>?</summary>
          <p>When the body is valid JSON, the converter uses the <code>json=</code> parameter in Python's requests library, which automatically sets the <code>Content-Type: application/json</code> header and serializes the Python dict. Using <code>data=</code> with a JSON string works too but requires setting the header manually and is less idiomatic.</p>
        </details>
        <details>
          <summary>Does this support multipart file uploads?</summary>
          <p>Yes — <code>-F key=value</code> form fields are parsed and converted to Python's <code>files=</code> parameter. Note that actual file upload (<code>-F file=@filename.jpg</code>) requires additional handling in your code to open the file — the converter generates the structure but you'll need to replace the string values with file handles.</p>
        </details>
      </section>
    </div>
  );
}
