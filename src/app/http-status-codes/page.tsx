"use client";

import { useState, useMemo } from "react";

interface StatusCode {
  code: number;
  name: string;
  desc: string;
}

const CODES: StatusCode[] = [
  // 1xx
  { code: 100, name: "Continue",             desc: "The server has received the request headers and the client should proceed to send the request body." },
  { code: 101, name: "Switching Protocols",  desc: "The server agrees to upgrade the protocol, e.g. from HTTP/1.1 to WebSocket." },
  { code: 102, name: "Processing",           desc: "The server has received and is processing the request, but no response is available yet (WebDAV)." },
  { code: 103, name: "Early Hints",          desc: "Used with the Link header to allow the client to preload resources while the server prepares a full response." },
  // 2xx
  { code: 200, name: "OK",                   desc: "Standard successful response. The request succeeded and the response body contains the requested data." },
  { code: 201, name: "Created",              desc: "A new resource was successfully created. The Location header typically contains the URL of the new resource." },
  { code: 202, name: "Accepted",             desc: "The request has been received but processing is not yet complete. Used for asynchronous operations." },
  { code: 203, name: "Non-Authoritative Information", desc: "The request succeeded but the response was modified by a proxy or intermediary." },
  { code: 204, name: "No Content",           desc: "The request succeeded but there is no content to return. Common for DELETE requests." },
  { code: 205, name: "Reset Content",        desc: "The request succeeded. The client should reset the document view (e.g. clear a form)." },
  { code: 206, name: "Partial Content",      desc: "The server is returning only part of the resource as requested by a Range header. Used for resumable downloads." },
  { code: 207, name: "Multi-Status",         desc: "Multiple status codes for multiple independent operations (WebDAV)." },
  { code: 208, name: "Already Reported",     desc: "The members of a DAV binding have already been enumerated in a previous reply (WebDAV)." },
  { code: 226, name: "IM Used",              desc: "The server fulfilled a GET request and the response is a representation of the result of instance manipulations applied to the current instance." },
  // 3xx
  { code: 300, name: "Multiple Choices",     desc: "The request has multiple possible responses. The client should choose one." },
  { code: 301, name: "Moved Permanently",    desc: "The resource has permanently moved to a new URL. Browsers and crawlers update their links." },
  { code: 302, name: "Found",                desc: "Temporary redirect. The resource is temporarily at a different URL. Use 307 for strict temporary redirects." },
  { code: 303, name: "See Other",            desc: "Redirects after a POST to a GET request at a different URL. Common after form submissions." },
  { code: 304, name: "Not Modified",         desc: "The cached version of the resource is still valid. The client can use its cached copy." },
  { code: 307, name: "Temporary Redirect",   desc: "The resource is temporarily at a different URL and the method must not change (unlike 302)." },
  { code: 308, name: "Permanent Redirect",   desc: "Permanent redirect where the method must not change (unlike 301 which historically changed POST to GET)." },
  // 4xx
  { code: 400, name: "Bad Request",          desc: "The server cannot process the request due to malformed syntax, invalid parameters, or invalid message framing." },
  { code: 401, name: "Unauthorized",         desc: "Authentication is required and has not been provided or has failed. Misleadingly named — should be 'Unauthenticated'." },
  { code: 403, name: "Forbidden",            desc: "The server understood the request but refuses to authorize it. Authentication won't help — the client lacks permission." },
  { code: 404, name: "Not Found",            desc: "The requested resource could not be found. The most well-known HTTP status code." },
  { code: 405, name: "Method Not Allowed",   desc: "The request method is not supported for the requested resource (e.g. POST to a read-only endpoint)." },
  { code: 406, name: "Not Acceptable",       desc: "The server cannot produce a response matching the Accept headers sent by the client." },
  { code: 407, name: "Proxy Authentication Required", desc: "Authentication with a proxy server is required." },
  { code: 408, name: "Request Timeout",      desc: "The server timed out waiting for the request. The client may repeat the request." },
  { code: 409, name: "Conflict",             desc: "The request conflicts with the current state of the server (e.g. duplicate key, version conflict)." },
  { code: 410, name: "Gone",                 desc: "The resource has been permanently deleted and will not be available again. Stricter than 404." },
  { code: 411, name: "Length Required",      desc: "The server requires a Content-Length header but the client did not provide one." },
  { code: 412, name: "Precondition Failed",  desc: "A precondition in the request headers (e.g. If-Match) evaluated to false on the server." },
  { code: 413, name: "Content Too Large",    desc: "The request body exceeds the server's allowed limit. Often used for file upload size limits." },
  { code: 414, name: "URI Too Long",         desc: "The URL provided is longer than the server is willing to process." },
  { code: 415, name: "Unsupported Media Type", desc: "The request payload format is not supported (e.g. sending XML to an endpoint that only accepts JSON)." },
  { code: 416, name: "Range Not Satisfiable", desc: "The Range header specifies a range that cannot be satisfied by the resource." },
  { code: 417, name: "Expectation Failed",   desc: "The server cannot meet the requirements of the Expect request header." },
  { code: 418, name: "I'm a Teapot",         desc: "An April Fool's joke from RFC 2324 (Hyper Text Coffee Pot Control Protocol). Returned by teapots asked to brew coffee." },
  { code: 422, name: "Unprocessable Content", desc: "The request is well-formed but contains semantic errors (e.g. validation failures). Common in REST APIs." },
  { code: 423, name: "Locked",               desc: "The resource being accessed is locked (WebDAV)." },
  { code: 424, name: "Failed Dependency",    desc: "The request failed because a previous request failed (WebDAV)." },
  { code: 425, name: "Too Early",            desc: "The server is unwilling to process a request that might be replayed (TLS early data)." },
  { code: 426, name: "Upgrade Required",     desc: "The client should upgrade to a different protocol such as TLS/1.3." },
  { code: 428, name: "Precondition Required", desc: "The server requires a conditional request (e.g. If-Match) to prevent lost updates." },
  { code: 429, name: "Too Many Requests",    desc: "The client has sent too many requests in a given time. Used for rate limiting APIs." },
  { code: 431, name: "Request Header Fields Too Large", desc: "The server refuses to process the request because one or more headers are too large." },
  { code: 451, name: "Unavailable For Legal Reasons", desc: "The resource cannot be provided for legal reasons, such as censorship or a court order." },
  // 5xx
  { code: 500, name: "Internal Server Error", desc: "A generic server error. The server encountered an unexpected condition that prevented it from fulfilling the request." },
  { code: 501, name: "Not Implemented",       desc: "The server does not support the functionality required to fulfill the request." },
  { code: 502, name: "Bad Gateway",           desc: "The server, acting as a gateway or proxy, received an invalid response from an upstream server." },
  { code: 503, name: "Service Unavailable",   desc: "The server is temporarily unable to handle the request, usually due to overload or maintenance." },
  { code: 504, name: "Gateway Timeout",       desc: "The server, acting as a gateway or proxy, did not receive a timely response from an upstream server." },
  { code: 505, name: "HTTP Version Not Supported", desc: "The server does not support the HTTP protocol version used in the request." },
  { code: 506, name: "Variant Also Negotiates", desc: "Transparent content negotiation for the request results in a circular reference." },
  { code: 507, name: "Insufficient Storage",  desc: "The server cannot store the representation needed to complete the request (WebDAV)." },
  { code: 508, name: "Loop Detected",         desc: "The server detected an infinite loop while processing the request (WebDAV)." },
  { code: 510, name: "Not Extended",          desc: "Further extensions to the request are required for the server to fulfill it." },
  { code: 511, name: "Network Authentication Required", desc: "The client needs to authenticate to gain network access (e.g. captive portals)." },
];

const CATEGORY_COLORS: Record<number, string> = {
  1: "#6366f1",
  2: "var(--success)",
  3: "#f59e0b",
  4: "var(--error)",
  5: "#ec4899",
};

const CATEGORY_LABELS: Record<number, string> = {
  1: "1xx Informational",
  2: "2xx Success",
  3: "3xx Redirection",
  4: "4xx Client Error",
  5: "5xx Server Error",
};

export default function HttpStatusCodes() {
  const [query, setQuery]   = useState("");
  const [filter, setFilter] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return CODES.filter((c) => {
      const matchesCategory = filter === null || Math.floor(c.code / 100) === filter;
      const matchesQuery = !q || c.code.toString().includes(q) || c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, filter]);

  const grouped = useMemo(() => {
    const g: Record<number, StatusCode[]> = {};
    for (const c of filtered) {
      const cat = Math.floor(c.code / 100);
      if (!g[cat]) g[cat] = [];
      g[cat].push(c);
    }
    return g;
  }, [filtered]);

  return (
    <div className="tool-page">
      <h1>HTTP Status Codes</h1>
      <p className="desc">Complete reference for all HTTP status codes with descriptions and use cases. Search by code, name, or keyword.</p>

      {/* Search */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by code, name, or description…"
        style={{ width: "100%", marginBottom: "12px" }}
        autoFocus
      />

      {/* Category filter */}
      <div className="btn-group mb-6">
        <button className={`btn ${filter === null ? "btn-primary" : ""}`} onClick={() => setFilter(null)}>All</button>
        {[1,2,3,4,5].map((cat) => (
          <button
            key={cat}
            className={`btn ${filter === cat ? "btn-primary" : ""}`}
            onClick={() => setFilter(filter === cat ? null : cat)}
          >
            {cat}xx
          </button>
        ))}
      </div>

      {/* Results */}
      {Object.keys(grouped).sort().map((catStr) => {
        const cat = parseInt(catStr);
        const color = CATEGORY_COLORS[cat];
        return (
          <div key={cat} className="mb-6">
            <h2 style={{ fontSize: "15px", fontWeight: 600, color, marginBottom: "8px", paddingBottom: "6px", borderBottom: "1px solid var(--border)" }}>
              {CATEGORY_LABELS[cat]}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {grouped[cat].map((c) => (
                <div key={c.code} style={{ display: "grid", gridTemplateColumns: "60px 200px 1fr", gap: "12px", padding: "10px 12px", borderRadius: "8px", alignItems: "baseline" }}
                  className="card" onMouseEnter={() => {}} >
                  <code style={{ fontWeight: 700, fontSize: "15px", color }}>{c.code}</code>
                  <span style={{ fontWeight: 500, fontSize: "14px" }}>{c.name}</span>
                  <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{c.desc}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "32px" }}>No status codes match your search.</p>
      )}

      <section className="tool-prose">
        <h2>About HTTP Status Codes</h2>
        <p>HTTP status codes are three-digit numbers returned by a server in response to an HTTP request. They indicate whether the request succeeded, failed, or requires further action. Status codes are grouped into five classes: <strong>1xx</strong> (informational — request received, continuing), <strong>2xx</strong> (success — request received and accepted), <strong>3xx</strong> (redirection — further action needed), <strong>4xx</strong> (client error — the request has a problem), and <strong>5xx</strong> (server error — the server failed to fulfill a valid request).</p>
        <p>The most commonly encountered codes are <strong>200</strong> (OK), <strong>201</strong> (Created — resource created successfully), <strong>301</strong>/<strong>302</strong> (redirects), <strong>400</strong> (Bad Request), <strong>401</strong> (Unauthorized — authentication required), <strong>403</strong> (Forbidden — authenticated but not permitted), <strong>404</strong> (Not Found), <strong>422</strong> (Unprocessable Content — validation error), <strong>429</strong> (Too Many Requests — rate limited), <strong>500</strong> (Internal Server Error), and <strong>503</strong> (Service Unavailable).</p>
        <p>Status codes are defined by IANA and documented in several RFCs — primarily RFC 9110 (HTTP Semantics, 2022), which supersedes the earlier RFC 7231.</p>
      </section>
    </div>
  );
}
