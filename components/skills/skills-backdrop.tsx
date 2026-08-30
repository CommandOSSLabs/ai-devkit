"use client";

import { usePathname } from "next/navigation";
import { PixelLiquidBg } from "@/components/motion/pixel-liquid-bg";

// The fluid is an accent on the surfaces you scan, and absent from the one you
// read and type in: a workspace is a long-form reading and editing session, so
// it gets a still gradient instead of a running WebGL simulation. That
// gradient is also the fallback everywhere else — PixelLiquidBg renders
// nothing under prefers-reduced-motion or without a WebGL context, and it sits
// on top of this, so a browser that cannot run it still gets a coloured wash
// rather than a flat rectangle.
export function SkillsBackdrop() {
  const pathname = usePathname();
  const animated = !pathname.includes("/workspace");

  return (
    <div
      aria-hidden="true"
      className="skills-backdrop pointer-events-none absolute inset-x-0 top-0 z-0 h-[380px] opacity-50 [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(130,170,255,0.35),transparent_60%),radial-gradient(ellipse_at_80%_10%,rgba(244,114,182,0.22),transparent_55%)]" />
      {animated && <PixelLiquidBg pixelSize={22} resolution={0.3} cursorSize={90} />}
    </div>
  );
}

export default SkillsBackdrop;
