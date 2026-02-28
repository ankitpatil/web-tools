"use client";

import { useState, useEffect } from "react";
import { CopyButton } from "@/components/CopyButton";

const PRESETS = [
  { label: "Every minute",       expr: "* * * * *" },
  { label: "Every hour",         expr: "0 * * * *" },
  { label: "Every day midnight", expr: "0 0 * * *" },
  { label: "Every day noon",     expr: "0 12 * * *" },
  { label: "Every weekday 9am",  expr: "0 9 * * 1-5" },
  { label: "Every Sunday",       expr: "0 0 * * 0" },
  { label: "Every Monday",       expr: "0 0 * * 1" },
  { label: "1st of month",       expr: "0 0 1 * *" },
  { label: "Every 5 minutes",    expr: "*/5 * * * *" },
  { label: "Every 15 minutes",   expr: "*/15 * * * *" },
  { label: "Every 2 hours",      expr: "0 */2 * * *" },
  { label: "Once a year",        expr: "0 0 1 1 *" },
];

const DOW_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_NAMES = ["","January","February","March","April","May","June","July","August","September","October","November","December"];

function parseField(field: string, min: number, max: number): Set<number> | null {
  const values = new Set<number>();
  if (field === "*") {
    for (let i = min; i <= max; i++) values.add(i);
    return values;
  }
  for (const part of field.split(",")) {
    if (part.includes("/")) {
      const [range, step] = part.split("/");
      const stepNum = parseInt(step);
      if (isNaN(stepNum) || stepNum <= 0) return null;
      const start = range === "*" ? min : parseInt(range);
      if (isNaN(start) || start < min || start > max) return null;
      for (let i = start; i <= max; i += stepNum) values.add(i);
    } else if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      if (isNaN(a) || isNaN(b) || a > b || a < min || b > max) return null;
      for (let i = a; i <= b; i++) values.add(i);
    } else {
      const n = parseInt(part);
      if (isNaN(n) || n < min || n > max) return null;
      values.add(n);
    }
  }
  return values.size > 0 ? values : null;
}

function getNextRuns(expr: string, count: number): string[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  const [mF, hF, domF, monF, dowF] = parts;
  const mins   = parseField(mF,   0, 59);
  const hours  = parseField(hF,   0, 23);
  const dom    = parseField(domF, 1, 31);
  const months = parseField(monF, 1, 12);
  const dow    = parseField(dowF, 0, 6);
  if (!mins || !hours || !dom || !months || !dow) return [];

  const runs: string[] = [];
  const cursor = new Date();
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  let i = 0;
  while (runs.length < count && i < 527040) {
    if (
      months.has(cursor.getMonth() + 1) &&
      dom.has(cursor.getDate()) &&
      dow.has(cursor.getDay()) &&
      hours.has(cursor.getHours()) &&
      mins.has(cursor.getMinutes())
    ) {
      runs.push(cursor.toLocaleString(undefined, {
        weekday: "short", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit",
      }));
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
    i++;
  }
  return runs;
}

function describe(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid expression";
  const [min, hour, dom, month, dow] = parts;

  const known: Record<string, string> = {
    "* * * * *":   "Every minute",
    "0 * * * *":   "Every hour, at the start of the hour",
    "0 0 * * *":   "Every day at midnight (00:00)",
    "0 12 * * *":  "Every day at noon (12:00)",
    "0 0 * * 0":   "Every Sunday at midnight",
    "0 0 * * 1":   "Every Monday at midnight",
    "0 9 * * 1-5": "Every weekday (Mon–Fri) at 9:00 AM",
    "0 0 1 * *":   "First day of every month at midnight",
    "0 0 1 1 *":   "Once a year on January 1st at midnight",
    "*/5 * * * *":  "Every 5 minutes",
    "*/15 * * * *": "Every 15 minutes",
    "0 */2 * * *":  "Every 2 hours, at the start of the hour",
  };
  if (known[expr]) return known[expr];

  const descParts: string[] = [];

  // Time description
  if (min === "*" && hour === "*") {
    descParts.push("every minute");
  } else if (min.startsWith("*/")) {
    descParts.push(`every ${min.slice(2)} minutes`);
  } else if (hour.startsWith("*/")) {
    descParts.push(`every ${hour.slice(2)} hours at minute ${min}`);
  } else if (hour !== "*" && !hour.includes(",") && !hour.includes("-") && !hour.includes("/")) {
    const h = parseInt(hour);
    const m = parseInt(min);
    if (!isNaN(h) && !isNaN(m)) {
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      descParts.push(`at ${h12}:${m.toString().padStart(2, "0")} ${ampm}`);
    } else {
      descParts.push(`at hour ${hour}, minute ${min}`);
    }
  } else if (min !== "*") {
    descParts.push(`at minute ${min}`);
  }

  // Day of week
  if (dow !== "*") {
    if (dow === "1-5") descParts.push("on weekdays (Mon–Fri)");
    else if (dow === "0,6" || dow === "6,0") descParts.push("on weekends");
    else {
      const days = dow.split(",").map((d) => DOW_NAMES[parseInt(d)] ?? d).join(", ");
      descParts.push(`on ${days}`);
    }
  }

  // Month
  if (month !== "*") {
    const ms = month.split(",").map((m) => MONTH_NAMES[parseInt(m)] ?? m).join(", ");
    descParts.push(`in ${ms}`);
  }

  // Day of month (only if dow is wildcard to avoid confusion)
  if (dom !== "*" && dow === "*") {
    descParts.push(`on day ${dom} of the month`);
  }

  if (descParts.length === 0) return expr;
  const result = descParts.join(", ");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function validate(expr: string): string | null {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "A cron expression must have exactly 5 fields separated by spaces.";
  const [min, hour, dom, month, dow] = parts;
  if (!parseField(min,   0, 59)) return "Invalid minute field (valid: 0–59)";
  if (!parseField(hour,  0, 23)) return "Invalid hour field (valid: 0–23)";
  if (!parseField(dom,   1, 31)) return "Invalid day-of-month field (valid: 1–31)";
  if (!parseField(month, 1, 12)) return "Invalid month field (valid: 1–12)";
  if (!parseField(dow,   0, 6))  return "Invalid day-of-week field (valid: 0–6, Sunday=0)";
  return null;
}

function exprFromFields(m: string, h: string, dom: string, mon: string, dow: string) {
  return `${m || "*"} ${h || "*"} ${dom || "*"} ${mon || "*"} ${dow || "*"}`;
}

export default function CrontabGenerator() {
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const [minute, setMinute]   = useState("0");
  const [hour,   setHour]     = useState("9");
  const [dom,    setDom]      = useState("*");
  const [month,  setMonth]    = useState("*");
  const [dow,    setDow]      = useState("1-5");

  const error    = validate(expr);
  const desc     = error ? "—" : describe(expr);
  const nextRuns = error ? [] : getNextRuns(expr, 5);

  // Sync fields → expr
  const syncFromFields = (m: string, h: string, d: string, mo: string, dw: string) => {
    setExpr(exprFromFields(m, h, d, mo, dw));
  };

  // Sync expr → fields (best-effort: only update if the expr is valid)
  useEffect(() => {
    if (!validate(expr)) {
      const parts = expr.trim().split(/\s+/);
      if (parts.length === 5) {
        setMinute(parts[0]); setHour(parts[1]); setDom(parts[2]);
        setMonth(parts[3]);  setDow(parts[4]);
      }
    }
  }, [expr]);

  const applyPreset = (e: string) => {
    const p = e.trim().split(/\s+/);
    setExpr(e);
    if (p.length === 5) {
      setMinute(p[0]); setHour(p[1]); setDom(p[2]); setMonth(p[3]); setDow(p[4]);
    }
  };

  const fieldProps = (value: string, set: (v: string) => void, placeholder: string) => ({
    value,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      set(e.target.value);
      syncFromFields(
        value === minute ? e.target.value : minute,
        value === hour   ? e.target.value : hour,
        value === dom    ? e.target.value : dom,
        value === month  ? e.target.value : month,
        value === dow    ? e.target.value : dow,
      );
    },
  });

  return (
    <div className="tool-page">
      <h1>Crontab Generator</h1>
      <p className="desc">Build cron expressions visually — see a plain-English description and the next 5 scheduled run times.</p>

      {/* Presets */}
      <div className="btn-group mb-2">
        {PRESETS.map((p) => (
          <button key={p.expr} className={`btn ${expr === p.expr ? "btn-primary" : ""}`} onClick={() => applyPreset(p.expr)}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Raw expression input */}
      <label>Cron Expression</label>
      <div className="flex gap-2 items-center mb-4">
        <input
          type="text"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          className="tool-input font-mono"
          style={{ minHeight: "auto", padding: "10px 12px", resize: "none" }}
          spellCheck={false}
        />
        <CopyButton text={expr} />
      </div>

      {/* Five visual field inputs */}
      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        {[
          { label: "Minute",       value: minute, set: (v: string) => { setMinute(v); syncFromFields(v, hour, dom, month, dow); }, hint: "0–59" },
          { label: "Hour",         value: hour,   set: (v: string) => { setHour(v);   syncFromFields(minute, v, dom, month, dow); }, hint: "0–23" },
          { label: "Day (month)",  value: dom,    set: (v: string) => { setDom(v);    syncFromFields(minute, hour, v, month, dow); }, hint: "1–31" },
          { label: "Month",        value: month,  set: (v: string) => { setMonth(v);  syncFromFields(minute, hour, dom, v, dow); }, hint: "1–12" },
          { label: "Day (week)",   value: dow,    set: (v: string) => { setDow(v);    syncFromFields(minute, hour, dom, month, v); }, hint: "0–6 (Sun=0)" },
        ].map(({ label, value, set, hint }) => (
          <div key={label}>
            <label style={{ fontSize: "13px" }}>{label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder="*"
              className="font-mono"
              style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--input-bg)", color: "var(--text)", fontSize: "14px", outline: "none" }}
              spellCheck={false}
            />
            <p style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "3px" }}>{hint}</p>
          </div>
        ))}
      </div>

      {/* Syntax legend */}
      <div className="output-box mb-4" style={{ minHeight: "auto", fontSize: "13px", lineHeight: "1.8" }}>
        <span style={{ color: "var(--text-secondary)" }}>Syntax: </span>
        <code>*</code> = any &nbsp;|&nbsp; <code>*/n</code> = every n &nbsp;|&nbsp; <code>a-b</code> = range &nbsp;|&nbsp; <code>a,b</code> = list
      </div>

      {/* Error or results */}
      {error ? (
        <p className="error-text">❌ {error}</p>
      ) : (
        <>
          <div className="card mb-4">
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Human-readable schedule</p>
            <p style={{ fontWeight: 600, fontSize: "16px" }}>{desc}</p>
          </div>

          <div className="card">
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>Next 5 scheduled runs</p>
            {nextRuns.length > 0 ? (
              <ol style={{ paddingLeft: "20px", margin: 0 }}>
                {nextRuns.map((r, i) => (
                  <li key={i} style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: "13px", marginBottom: "4px" }}>{r}</li>
                ))}
              </ol>
            ) : (
              <p className="error-text">No runs found in the next year</p>
            )}
          </div>
        </>
      )}

      <section className="tool-prose">
        <h2>About the Crontab Generator</h2>
        <p>The Crontab Generator builds and validates cron expressions with instant visual feedback. Enter an expression manually or click a preset, and the tool shows a plain-English description of the schedule and the next 5 exact run times. Edit any of the 5 individual fields — minute, hour, day-of-month, month, day-of-week — and the expression updates automatically.</p>
        <p>Cron is the standard Unix job scheduler. A cron expression is a string of 5 space-separated fields that define when a job runs. Each field accepts: <code>*</code> (any value), <code>*/n</code> (every n units), <code>a-b</code> (a range), or <code>a,b,c</code> (a list). For example, <code>0 9 * * 1-5</code> means &ldquo;at 9:00 AM, Monday through Friday.&rdquo; Cron expressions appear in crontab files, Kubernetes CronJobs, GitHub Actions schedules, AWS EventBridge rules, and CI/CD pipelines.</p>
        <p>All calculation runs entirely in your browser — no expression is sent to any server. The next-run previews use your local system clock and timezone.</p>
      </section>

      <section className="tool-faq">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What do the 5 cron fields represent?</summary>
          <p>Left to right: <strong>minute</strong> (0–59), <strong>hour</strong> (0–23), <strong>day of month</strong> (1–31), <strong>month</strong> (1–12), <strong>day of week</strong> (0–6, where 0 = Sunday). A <code>*</code> in any field means &ldquo;every valid value for that field.&rdquo;</p>
        </details>
        <details>
          <summary>What does */5 mean?</summary>
          <p><code>*/5</code> means &ldquo;every 5 units.&rdquo; In the minute field, <code>*/5</code> means every 5 minutes (0, 5, 10, 15…). In the hour field, <code>*/2</code> means every 2 hours (0, 2, 4, 6…).</p>
        </details>
        <details>
          <summary>How do I run a job every weekday?</summary>
          <p>Use <code>1-5</code> in the day-of-week field. For example, <code>0 9 * * 1-5</code> runs at 9:00 AM Monday through Friday. Day 0 = Sunday, 1 = Monday, …, 6 = Saturday.</p>
        </details>
        <details>
          <summary>What is the difference between day-of-month and day-of-week?</summary>
          <p>If both are set to non-wildcard values, most cron implementations run the job when <em>either</em> condition is true (OR logic). To avoid confusion, set one to <code>*</code> and only specify the other.</p>
        </details>
        <details>
          <summary>How do I use cron in GitHub Actions?</summary>
          <p>In your workflow YAML, use the <code>schedule</code> trigger with a <code>cron</code> key: <code>on: &#123; schedule: [&#123; cron: &apos;0 9 * * 1-5&apos; &#125;] &#125;</code>. Note that GitHub Actions cron schedules are in UTC and the minimum interval is every 5 minutes.</p>
        </details>
      </section>
    </div>
  );
}
