"use client";

// Persistent version of the Arcade pixel engine — same field/grain/moire
// texture ArcadeSplash uses for the 5s intro reveal, but running
// continuously as the page background instead of fading out. Uses the dark
// colorway variant (see arcade/params.ts) so it recedes behind real content
// instead of reading as a bright logo.

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Arcade } from "./engine";
import { COLORWAYS } from "./params";

const DARK_COLORWAY = COLORWAYS.findIndex((c) => c.name === "Cyanide Dark");

export interface ArcadeBackgroundProps {
  className?: string;
  word?: string;
  /** Index into arcade/params.ts COLORWAYS. Defaults to the dark variant. */
  colorway?: number;
  /** Quantization edge — same param ArcadeSplash exposes. */
  threshold?: number;
  /** Surface texture (moire/grain/dust) strength, 0..1. */
  texture?: number;
  opacity?: number;
}

export function ArcadeBackground({
  className,
  word = "changelog",
  colorway = DARK_COLORWAY,
  threshold = 0.588,
  texture = 0.25,
  opacity = 1,
}: ArcadeBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const engine = new Arcade(host);
    if (!engine.ok) return;
    engine.setParams({ word, colorway, threshold, texture });
    engine.start();

    // The engine only reads the host's size at construction and at start()
    // — no internal ResizeObserver, so a first read that races ahead of
    // layout (or an actual window resize, since a 5s splash never lives
    // long enough for that to matter but a persistent background does)
    // would otherwise stick forever. A rAF re-read catches the common case
    // fast (the host is 0×0 on the very first synchronous read, every load);
    // the ResizeObserver is the ongoing fallback for anything after that.
    const raf = requestAnimationFrame(() => engine.resize());
    const ro = new ResizeObserver(() => engine.resize());
    ro.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      engine.destroy();
    };
  }, [word, colorway, threshold, texture]);

  return <div ref={hostRef} className={cn("relative", className)} style={{ opacity }} />;
}
