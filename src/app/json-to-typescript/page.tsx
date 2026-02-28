"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";

// Capitalise first letter for interface names
function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

type TSType = string;

function inferType(value: unknown, key: string, interfaces: Map<string, string>, optional: boolean): TSType {
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  const type = typeof value;

  if (type === "boolean") return "boolean";
  if (type === "number") return Number.isInteger(value as number) ? "number" : "number";
  if (type === "string") return "string";

  if (Array.isArray(value)) {
    if ((value as unknown[]).length === 0) return "unknown[]";
    // Infer element type from first element
    const elemType = inferType((value as unknown[])[0], key + "Item", interfaces, optional);
    return `${elemType}[]`;
  }

  if (type === "object") {
    const interfaceName = toPascalCase(key);
    buildInterface(value as Record<string, unknown>, interfaceName, interfaces, optional);
    return interfaceName;
  }

  return "unknown";
}

function buildInterface(
  obj: Record<string, unknown>,
  name: string,
  interfaces: Map<string, string>,
  optional: boolean,
): void {
  if (interfaces.has(name)) return;

  const lines: string[] = [`export interface ${name} {`];
  for (const [k, v] of Object.entries(obj)) {
    const tsType = inferType(v, toPascalCase(k), interfaces, optional);
    const optMark = optional && (v === null || v === undefined) ? "?" : "";
    lines.push(`  ${k}${optMark}: ${tsType};`);
  }
  lines.push("}");

  interfaces.set(name, lines.join("\n"));
}

function jsonToTs(json: string, rootName: string, optional: boolean): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return "";
  }

  const interfaces = new Map<string, string>();

  if (Array.isArray(parsed)) {
    const sample = (parsed as unknown[])[0];
    if (sample && typeof sample === "object" && !Array.isArray(sample)) {
      buildInterface(sample as Record<string, unknown>, toPascalCase(rootName), interfaces, optional);
    } else {
      return `export type ${toPascalCase(rootName)} = ${inferType(parsed, rootName, interfaces, optional)};`;
    }
  } else if (parsed && typeof parsed === "object") {
    buildInterface(parsed as Record<string, unknown>, toPascalCase(rootName), interfaces, optional);
  } else {
    return `export type ${toPascalCase(rootName)} = ${typeof parsed};`;
  }

  // Return interfaces in reverse order so nested types appear first
  return Array.from(interfaces.values()).reverse().join("\n\n");
}

const EXAMPLE = `{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "active": true,
  "score": 98.5,
  "tags": ["admin", "user"],
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "zip": "12345"
  }
}`;

export default function JsonToTypescript() {
  const [input, setInput]       = useState(EXAMPLE);
  const [rootName, setRootName] = useState("Root");
  const [optional, setOptional] = useState(false);
  const [error, setError]       = useState("");

  let output = "";
  let err = "";
  try {
    JSON.parse(input);
    output = jsonToTs(input, rootName || "Root", optional);
    err = "";
  } catch (e: unknown) {
    err = (e as Error).message;
  }

  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${rootName || "types"}.ts`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tool-page">
      <h1>JSON to TypeScript Generator</h1>
      <p className="desc">Convert JSON objects to TypeScript interfaces instantly. Supports nested objects and arrays.</p>

      <div className="btn-group items-center mb-3">
        <label className="mr-1" style={{ whiteSpace: "nowrap" }}>Root name:</label>
        <input
          type="text"
          value={rootName}
          onChange={(e) => setRootName(e.target.value)}
          placeholder="Root"
          style={{ width: "140px" }}
        />
        <label className="flex items-center gap-1 ml-2" style={{ fontWeight: 400, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={optional}
            onChange={(e) => setOptional(e.target.checked)}
            style={{ width: "14px", height: "14px" }}
          />
          Mark null fields optional
        </label>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <label>JSON Input</label>
          <textarea
            className="tool-input"
            rows={16}
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            placeholder='{ "key": "value" }'
            spellCheck={false}
          />
        </div>
        <div>
          <label>TypeScript Output</label>
          <div className="output-box" style={{ minHeight: "300px", whiteSpace: "pre", overflowX: "auto" }}>
            {err ? <span style={{ color: "var(--error)" }}>❌ {err}</span> : output}
          </div>
        </div>
      </div>

      {!err && output && (
        <div className="btn-group mt-3">
          <CopyButton text={output} />
          <button className="btn" onClick={download}>💾 Download .ts</button>
        </div>
      )}

      {error && <p className="error-text">❌ {error}</p>}

      <section className="tool-prose">
        <h2>About the JSON to TypeScript Generator</h2>
        <p>The JSON to TypeScript Generator converts any JSON object or array into fully typed TypeScript <code>interface</code> definitions. Paste your JSON, set the root interface name, and get copy-ready TypeScript types in one click. Nested objects are automatically extracted into their own named interfaces; arrays are typed based on the first element.</p>
        <p>TypeScript interfaces are the standard way to describe the shape of data in TypeScript projects. When working with REST APIs, the response body is often JSON — manually writing interfaces for it is tedious and error-prone. This tool eliminates that work: paste the API response and immediately get a correctly typed interface that you can drop into your codebase.</p>
        <p>All conversion runs entirely in your browser — no JSON data is sent to any server. The output is valid TypeScript and can be downloaded as a <code>.ts</code> file. For production use, review the generated types and add JSDoc comments where needed.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What is a TypeScript interface?</summary>
          <p>A TypeScript interface defines the shape of an object — the names and types of its properties. Unlike classes, interfaces are erased at compile time and have no runtime cost. They are used to type-check objects throughout your code and provide autocomplete in editors.</p>
        </details>
        <details>
          <summary>How are nested JSON objects handled?</summary>
          <p>Each nested object is extracted into its own <code>interface</code> with a name derived from the parent key (converted to PascalCase). For example, a key <code>&quot;address&quot;</code> with an object value generates an <code>Address</code> interface and types the field as <code>address: Address</code>.</p>
        </details>
        <details>
          <summary>How are JSON arrays typed?</summary>
          <p>Arrays are typed based on the first element. If the first element is an object, that object is used as the array item interface. An empty array is typed as <code>unknown[]</code> since the element type cannot be inferred.</p>
        </details>
        <details>
          <summary>What does &quot;mark null fields optional&quot; do?</summary>
          <p>When enabled, any field whose value is <code>null</code> or <code>undefined</code> in the JSON is marked as optional (<code>field?: type</code>) in the generated interface. This is useful when some fields may be absent in real API responses.</p>
        </details>
        <details>
          <summary>Should I use <code>interface</code> or <code>type</code>?</summary>
          <p><code>interface</code> is preferred for describing object shapes — it supports declaration merging and is more idiomatic. <code>type</code> is more flexible (it can describe unions, intersections, and primitives) but cannot be merged. For JSON API types, <code>interface</code> is the standard choice.</p>
        </details>
      </section>
    </div>
  );
}
