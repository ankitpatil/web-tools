"use client";


import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CopyButton } from "@/components/CopyButton";

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([uuidv4()]);
  const [count, setCount] = useState(1);

  const generate = () => setUuids(Array.from({ length: count }, () => uuidv4()));

  return (
    <div className="tool-page">
      <h1>UUID Generator</h1>
      <p className="desc">Generate UUID v4 values. Supports bulk generation.</p>
      <div className="btn-group items-center">
        <label className="mr-2">Count:</label>
        <input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))} className="w-24" />
        <button className="btn btn-primary" onClick={generate}>Generate</button>
        <CopyButton text={uuids.join("\n")} />
      </div>
      <div className="output-box">{uuids.join("\n")}</div>

      <section className="tool-prose">
        <h2>About the UUID Generator</h2>
        <p>The UUID Generator instantly creates cryptographically random Version 4 UUIDs (Universally Unique Identifiers). Generate a single UUID or up to 1,000 in bulk and copy them all at once. No installation, no sign-up, and no data is sent anywhere.</p>
        <p>A UUID is a 128-bit identifier formatted as 32 hexadecimal characters grouped by hyphens (e.g., <code>550e8400-e29b-41d4-a716-446655440000</code>). UUID v4 uses a cryptographically secure random number generator, making collisions astronomically unlikely — the probability of generating two identical v4 UUIDs is lower than one in a quintillion. UUIDs are the standard choice for database primary keys, session tokens, file names, and any scenario where unique IDs must be generated across distributed systems without coordination.</p>
        <p>All UUIDs are generated using the browser&apos;s native <code>crypto.randomUUID()</code> function, which uses a cryptographically secure pseudorandom number generator (CSPRNG). Nothing leaves your browser.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What is a UUID?</summary>
          <p>A UUID (Universally Unique Identifier) is a 128-bit identifier standardized by RFC 4122, formatted as 32 hexadecimal characters in 5 groups separated by hyphens: <code>xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code>.</p>
        </details>
        <details>
          <summary>What is UUID v4?</summary>
          <p>UUID v4 is randomly generated using a cryptographically secure random number generator, with two specific bits set to mark it as version 4. It has no meaning encoded in the bits — it is purely random, unlike v1 (timestamp-based) or v5 (name-based).</p>
        </details>
        <details>
          <summary>Are UUIDs truly unique?</summary>
          <p>In practice, yes. The probability of generating two identical v4 UUIDs is approximately 1 in 2¹²² (about 5.3 × 10³⁶). Generating a billion UUIDs per second for the next 100 years would still yield a collision probability less than one in a billion.</p>
        </details>
        <details>
          <summary>Can I use UUIDs as database primary keys?</summary>
          <p>Yes. UUIDs are widely used as primary keys in distributed databases where auto-increment integers would require coordination across shards. The tradeoff is larger storage size (16 bytes vs. 4–8 bytes for integers) and potentially worse index locality on sequential scans.</p>
        </details>
        <details>
          <summary>What is the difference between UUID and GUID?</summary>
          <p>GUID (Globally Unique Identifier) is Microsoft&apos;s implementation of the UUID standard. A GUID is a UUID. The terms are interchangeable — GUIDs follow the same RFC 4122 format and are commonly generated as v4.</p>
        </details>
      </section>
    </div>
  );
}
