"use client";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const { dark, toggle } = useTheme();
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          ⚡ DevToolBox
        </Link>
        <button onClick={toggle} className="btn" aria-label="Toggle theme">
          {dark ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}
