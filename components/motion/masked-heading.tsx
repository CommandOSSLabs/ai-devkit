"use client";

import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
} from "react";

import "./masked-heading.css";

/**
 * Ported from a MaskedHeading component whose text was clipped to reveal
 * an <img>/<video> underneath (background-clip via SVG clip-path), with
 * brightness/saturation/parallax controls on that media.
 *
 * That "reveal the backdrop through the glyphs" construction was tried
 * here first too (via backdrop-filter instead of a duplicate media
 * element, since the "media" is this site's own live GlowingWave canvas
 * already rendering behind the heading). It didn't hold up in practice:
 * the fill's own visibility still depended on what was behind it, so any
 * approach built that way loses to *some* backdrop state — a solid
 * blue patch made the glyphs read as a hollow outline with nothing
 * inside.
 *
 * This version drops that dependency entirely. Each word is real SVG
 * text with a solid ink fill (same --text-primary/--text-secondary the
 * rest of the site uses) and a white stroke halo underneath it — the
 * same construction as a video caption. A dark-on-light patch of the
 * animation reads off the fill; a dark or vivid patch reads off the
 * halo. Legibility never depends on sampling the backdrop, so there's no
 * background state left to lose to.
 *
 * The SVG-per-word layout (each word measured against a hidden "measure"
 * span so glyphs land at the right position on whichever line they wrap
 * to) is kept from the original — real text can't do a staggered
 * per-word reveal-on-view animation, and that wrapping-aware positioning
 * is the part worth keeping from the source component.
 */

export interface MaskedHeadingSegment {
  text: string;
  /** "primary" (default) gets the --text-primary fill and a thicker
   *  stroke; "secondary" gets --text-secondary and a thinner one —
   *  carries the same emphasis hierarchy the plain-color version
   *  conveyed through text color alone. */
  variant?: "primary" | "secondary";
}

export interface MaskedHeadingProps {
  segments: MaskedHeadingSegment[];
  /** Intrinsic tag only (h1/h2/div/...) — kept narrow so JSX prop checking
   *  on the root element (ref/className/style/children) stays sound. */
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: CSSProperties;
}

const STAGGER_STEP = 0.045;

interface WordEntry {
  text: string;
  variant: "primary" | "secondary";
  key: string;
}

export function MaskedHeading({
  segments,
  tag = "h2",
  className = "",
  style,
}: MaskedHeadingProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const baseRefs = useRef<(HTMLElement | null)[]>([]);
  const glyphRefs = useRef<(SVGTextElement | null)[]>([]);
  const [revealed, setRevealed] = useState(false);

  const words = useMemo<WordEntry[]>(() => {
    const out: WordEntry[] = [];
    segments.forEach((seg, si) => {
      const variant = seg.variant ?? "primary";
      seg.text
        .split(/\s+/)
        .filter(Boolean)
        .forEach((w, wi) => {
          out.push({ text: w, variant, key: `${si}-${wi}-${w}` });
        });
    });
    return out;
  }, [segments]);

  const sync = useCallback(() => {
    const measure = measureRef.current;
    if (!measure) return;
    const cs = window.getComputedStyle(measure);
    for (let i = 0; i < wordRefs.current.length; i += 1) {
      const box = wordRefs.current[i];
      const base = baseRefs.current[i];
      const glyph = glyphRefs.current[i];
      if (!box || !base || !glyph) continue;
      glyph.setAttribute("x", `${box.offsetLeft}`);
      glyph.setAttribute("y", `${base.offsetTop}`);
      glyph.style.fontFamily = cs.fontFamily;
      glyph.style.fontSize = cs.fontSize;
      glyph.style.fontWeight = cs.fontWeight;
      glyph.style.fontStyle = cs.fontStyle;
      glyph.style.letterSpacing = cs.letterSpacing;
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(root);
    document.fonts?.ready?.then(sync).catch(() => {});
    return () => ro.disconnect();
  }, [sync, words]);

  useEffect(() => {
    const root = rootRef.current;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root || typeof IntersectionObserver === "undefined" || reduce) {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return createElement(
    tag,
    {
      ref: rootRef,
      className: `masked-heading ${className}`.trim(),
      style,
    },
    <span key="measure" ref={measureRef} className="masked-heading__measure">
      {words.map((word, i) => (
        <span
          key={word.key}
          ref={(el) => {
            wordRefs.current[i] = el;
          }}
          className={
            word.variant === "secondary"
              ? "masked-heading__word masked-heading__word--secondary"
              : "masked-heading__word"
          }
        >
          {word.text}
          <i
            ref={(el) => {
              baseRefs.current[i] = el;
            }}
            className="masked-heading__baseline"
          />
        </span>
      ))}
    </span>,

    <svg key="glyphs" className="masked-heading__stroke" aria-hidden="true" focusable="false">
      {words.map((word, i) => (
        <text
          key={word.key}
          ref={(el) => {
            glyphRefs.current[i] = el;
          }}
          className={
            word.variant === "secondary"
              ? "masked-heading__glyph masked-heading__glyph--secondary"
              : "masked-heading__glyph masked-heading__glyph--primary"
          }
          style={{
            transitionDelay: `${i * STAGGER_STEP}s`,
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(0.4em)",
          }}
        >
          {word.text}
        </text>
      ))}
    </svg>,
  );
}

export default MaskedHeading;
