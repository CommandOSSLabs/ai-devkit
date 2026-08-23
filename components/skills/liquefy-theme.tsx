"use client";

import { useEffect, useState } from "react";
import { LiquefyProvider } from "@liquefy-ui/react";

// Liquefy has its own theme prop, and this site already has a theme: the
// `.dark` class on <html>, set pre-paint by app/layout.tsx and flipped by
// ThemeToggle. Rather than run two sources of truth that can disagree, this
// observes that class and feeds it to LiquefyProvider, so the existing
// toggle drives the --lq-* tokens too.
//
// Note the stylesheet imported here is styles.css, not tailwind.css: the
// latter is explicitly a Tailwind v4 interop layer (`@import 'tailwindcss'`)
// and this project is on v3.4, so the token sheet is used directly and the
// --lq-* values are referenced as plain CSS variables.
import "@liquefy-ui/react/styles.css";

export function LiquefyTheme({ children, tint = "#82AAFF" }: { children: React.ReactNode; tint?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const read = () => setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <LiquefyProvider theme={theme} tint={tint} className="contents">
      {children}
    </LiquefyProvider>
  );
}

export default LiquefyTheme;
