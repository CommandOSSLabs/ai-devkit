"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

// TEMPORARY REBUILD NOTE: the original of this file — a click-intercepted,
// createPortal-rendered full-screen transition overlay with a WebGL prism
// shader background and a "SCANNING/INDEXING/ASSEMBLING" TextMorph — was
// lost to an environment/data-loss incident and predates this session's
// visible context, so its exact source couldn't be reconstructed with
// confidence. This is a plain, honest stand-in that preserves the same
// href/className/children API every caller uses (see app/SkillPageClient.tsx)
// so nothing breaks, but it just navigates — no overlay, no shader, no
// TextMorph. Flagged to the user; the fancy version needs rebuilding
// separately with fresh direction rather than guessed back into existence.
export function SkillsTransitionLink({
  href,
  className,
  children,
  ...props
}: LinkProps & { className?: string; children?: ReactNode } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | keyof LinkProps
  >) {
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}

export default SkillsTransitionLink;
