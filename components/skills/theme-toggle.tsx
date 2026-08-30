"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Matches the contract the rest of the site already uses: the `.dark` class
// on <html>, persisted under "ai-devkit-theme", pre-applied by the no-flash
// script in app/layout.tsx. Initial state is read from the DOM the script
// already touched rather than kept in a provider, so there's nothing to
// desync and no flash on first paint.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("ai-devkit-theme", next ? "dark" : "light");
    } catch {
      // localStorage unavailable (private mode, etc.) — theme just won't persist
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] ${className}`}
    >
      {isDark ? <Sun size={15} strokeWidth={1.75} /> : <Moon size={15} strokeWidth={1.75} />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export default ThemeToggle;
