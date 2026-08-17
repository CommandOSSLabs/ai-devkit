"use client";

import { useEffect, useRef, useState } from "react";
import { Arcade } from "./engine";

const TOTAL_MS = 5000;
const FADE_MS = 600;
const HOLD_MS = TOTAL_MS - FADE_MS;

/** Full-viewport intro: the arcade-pixel word holds, then fades to reveal the page. */
export function ArcadeSplash() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }
    setMounted(true);

    const fadeTimer = setTimeout(() => setFading(true), HOLD_MS);
    const removeTimer = setTimeout(() => setVisible(false), TOTAL_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!mounted || !host) return;

    const engine = new Arcade(host);
    if (engine.ok) engine.start();

    return () => engine.destroy();
  }, [mounted]);

  if (!mounted || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 transition-opacity"
      style={{
        opacity: fading ? 0 : 1,
        transitionDuration: `${FADE_MS}ms`,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <div ref={hostRef} className="relative h-full w-full" />
    </div>
  );
}
