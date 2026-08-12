"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { cn } from "@/lib/utils";

export interface BendingMarqueeProps {
  /** Phrases repeated along the strip. */
  items?: string[];
  /** Glyph printed between phrases. */
  separator?: string;
  /** Width of the flat centre panel in pixels. */
  panelWidth?: number;
  /** Height of every panel in pixels. */
  panelHeight?: number;
  /** Angle the outer wings fold back by, in degrees. */
  bend?: number;
  /** How far the whole triptych sits behind the screen, in pixels. */
  depth?: number;
  /** Perspective depth of the scene, in pixels. */
  perspective?: number;
  /** Seconds the strip takes to travel one full repeat. */
  speed?: number;
  /** Travel direction of the strip. */
  direction?: "left" | "right";
  /** Number of stacked bands per panel. */
  rows?: number;
  /** Vertical space between bands in pixels. */
  rowGap?: number;
  /** Horizontal space between phrases in pixels. */
  itemGap?: number;
  /** Vertical padding inside a band in pixels. */
  bandPadding?: number;
  /** Font size of the phrases in pixels. */
  fontSize?: number;
  /** Font weight of the phrases. */
  fontWeight?: number;
  /** Letter spacing of the phrases in pixels. */
  letterSpacing?: number;
  /** Text colour. */
  color?: string;
  /** Solid fill behind each band. */
  bandColor?: string;
  /** Degrees the separator rocks back and forth, 0 holds it still. */
  markSway?: number;
  /** Ease the strip to a halt while the pointer is over the scene. */
  pauseOnHover?: boolean;
  /** Seconds the strip takes to settle when hover starts or ends. */
  pauseDamping?: number;
  /** Scale the triptych so the panels fill the container height. */
  fit?: boolean;
  /** Upper bound applied to the fit scale. */
  maxScale?: number;
  /** Optional className applied to the root. */
  className?: string;
  /** Optional inline style applied to the root. */
  style?: CSSProperties;
}

const DEFAULT_ITEMS = [
  "designed in the open",
  "shipped every week",
  "built for the web",
];

const SEAM = 1;
const RAD = Math.PI / 180;

interface Facet {
  id: string;
  width: number;
  tilt: number;
  origin: string;
  nudge: CSSProperties;
  offset: number;
}

const wrap = (value: number, span: number) =>
  span > 0 ? ((value % span) + span) % span : 0;

const buildFacets = (width: number, reach: number, bend: number): Facet[] => [
  {
    id: "west",
    width: reach + SEAM,
    tilt: bend,
    origin: "right center",
    nudge: { marginRight: -SEAM },
    offset: -reach,
  },
  {
    id: "core",
    width,
    tilt: 0,
    origin: "center",
    nudge: {},
    offset: 0,
  },
  {
    id: "east",
    width: reach + SEAM,
    tilt: -bend,
    origin: "left center",
    nudge: { marginLeft: -SEAM },
    offset: width - SEAM,
  },
];

interface SequenceProps {
  items: string[];
  separator: string;
  gap: number;
  sway: number;
  spin: string;
}

const Sequence = ({ items, separator, gap, sway, spin }: SequenceProps) => (
  <div className="flex shrink-0 items-center" style={{ gap }}>
    {items.map((phrase, index) => (
      <span
        key={`${phrase}-${index}`}
        className="flex shrink-0 items-center whitespace-nowrap"
        style={{ gap }}
      >
        <span
          className="inline-block"
          style={
            sway > 0
              ? {
                  animation: `${spin} 1.6s ease-in-out infinite alternate`,
                  animationDelay: `${index * -0.4}s`,
                }
              : undefined
          }
        >
          {separator}
        </span>
        <span>{phrase}</span>
      </span>
    ))}
  </div>
);

const BendingMarquee = ({
  items = DEFAULT_ITEMS,
  separator = "✳︎",
  panelWidth = 420,
  panelHeight = 520,
  bend = 50,
  depth = -200,
  perspective = 800,
  speed = 16,
  direction = "left",
  rows = 1,
  rowGap = 22,
  itemGap = 26,
  bandPadding = 18,
  fontSize = 34,
  fontWeight = 600,
  letterSpacing = 1,
  color = "#fafafa",
  bandColor = "#111111",
  markSway = 14,
  pauseOnHover = true,
  pauseDamping = 0.7,
  fit = true,
  maxScale = 1,
  className,
  style,
}: BendingMarqueeProps) => {
  const shell = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rate = useRef(1);
  const frame = useRef(0);

  const [unit, setUnit] = useState(0);
  const [box, setBox] = useState({ width: 0, height: 0 });

  const token = useId().replace(/[^a-zA-Z0-9]/g, "");
  const runName = `bmRun${token}`;
  const swayName = `bmSway${token}`;

  const strip = items.length > 0 ? items : DEFAULT_ITEMS;
  const bands = Math.max(Math.round(rows), 1);

  useEffect(() => {
    const node = probe.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect || rect.width === 0) return;
      setUnit(rect.width + itemGap);
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [itemGap]);

  useEffect(() => {
    const node = shell.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      setBox({ width: rect.width, height: rect.height });
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const scale = useMemo(() => {
    if (!fit || box.height === 0) return maxScale;
    const next = Math.min(maxScale, box.height / panelHeight);
    return Number.isFinite(next) && next > 0 ? next : maxScale;
  }, [fit, maxScale, box.height, panelHeight]);

  const reach = useMemo(() => {
    const edge = box.width > 0 ? box.width / 2 : panelWidth;
    const mean = bend * RAD;
    const across = Math.cos(mean);
    const toward = Math.sin(mean);
    const eye = perspective - depth;
    const hinge = (panelWidth / 2) * scale;

    let span = panelWidth;
    const divisor = scale * perspective * across + edge * toward;
    if (divisor > 0) {
      span = (edge * eye - scale * perspective * hinge) / divisor;
    }
    if (toward > 0) span = Math.min(span, (eye * 0.82) / toward);

    return Math.min(Math.max(span * 1.12, panelWidth * 0.5, 120), 6000);
  }, [box.width, panelWidth, bend, perspective, depth, scale]);

  const facets = useMemo(
    () => buildFacets(panelWidth, reach, bend),
    [panelWidth, reach, bend],
  );

  const glide = useCallback(
    (target: number) => {
      const node = stage.current;
      if (!node) return;
      cancelAnimationFrame(frame.current);

      const clips = node.getAnimations({ subtree: true });
      if (clips.length === 0) return;

      const from = rate.current;
      const span = Math.max(pauseDamping, 0) * 1000;
      if (span === 0) {
        rate.current = target;
        clips.forEach((clip) => (clip.playbackRate = target));
        return;
      }

      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / span, 1);
        const eased = t * t * (3 - 2 * t);
        rate.current = from + (target - from) * eased;
        clips.forEach((clip) => (clip.playbackRate = rate.current));
        if (t < 1) frame.current = requestAnimationFrame(step);
      };
      frame.current = requestAnimationFrame(step);
    },
    [pauseDamping],
  );

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const keyframes = `@keyframes ${runName}{to{transform:translate3d(calc(var(--bm-unit) * -1),0,0)}}@keyframes ${swayName}{from{transform:rotate(${-markSway}deg)}to{transform:rotate(${markSway}deg)}}`;

  return (
    <div
      ref={shell}
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        className,
      )}
      style={{ perspective: `${perspective}px`, ...style }}
      onPointerEnter={() => pauseOnHover && glide(0)}
      onPointerLeave={() => pauseOnHover && glide(1)}
    >
      <style>{keyframes}</style>

      <div
        ref={probe}
        className="pointer-events-none absolute flex items-center opacity-0"
        style={{
          left: -99999,
          top: 0,
          gap: itemGap,
          fontSize,
          fontWeight,
          letterSpacing,
        }}
        aria-hidden
      >
        <Sequence
          items={strip}
          separator={separator}
          gap={itemGap}
          sway={0}
          spin={swayName}
        />
      </div>

      <div
        ref={stage}
        className="flex"
        style={{
          transformStyle: "preserve-3d",
          transform: `scale(${scale})`,
        }}
      >
        {facets.map((facet) => (
          <div
            key={facet.id}
            className="relative shrink-0 overflow-hidden"
            style={{
              width: facet.width,
              height: panelHeight,
              transformOrigin: facet.origin,
              transform: `translateZ(${depth}px) rotateY(${facet.tilt}deg)`,
              ...facet.nudge,
            }}
          >
            <div
              className="flex h-full w-full flex-col justify-center"
              style={{ gap: rowGap }}
            >
              {Array.from({ length: bands }).map((_, band) => {
                const flipped = band % 2 === 1;
                const heading =
                  direction === "left"
                    ? flipped
                      ? "right"
                      : "left"
                    : flipped
                      ? "left"
                      : "right";
                const pace = speed * (1 + band * 0.14);
                const travel = unit > 0 ? wrap(facet.offset, unit) / unit : 0;
                const phase = heading === "left" ? travel : 1 - travel;
                const copies = unit > 0 ? Math.ceil(facet.width / unit) + 2 : 3;

                return (
                  <div
                    key={band}
                    className="relative w-full overflow-hidden"
                    style={{
                      paddingTop: bandPadding,
                      paddingBottom: bandPadding,
                      background: bandColor,
                      color,
                      fontSize,
                      fontWeight,
                      letterSpacing,
                    }}
                  >
                    <div
                      className="flex w-max items-center"
                      style={
                        {
                          gap: itemGap,
                          paddingLeft: itemGap,
                          "--bm-unit": `${unit}px`,
                          animationName: unit > 0 ? runName : "none",
                          animationDuration: `${pace}s`,
                          animationTimingFunction: "linear",
                          animationIterationCount: "infinite",
                          animationDirection:
                            heading === "left" ? "normal" : "reverse",
                          animationDelay: `${-pace * phase}s`,
                          willChange: "transform",
                        } as CSSProperties
                      }
                    >
                      {Array.from({ length: copies }).map((__, copy) => (
                        <Sequence
                          key={copy}
                          items={strip}
                          separator={separator}
                          gap={itemGap}
                          sway={markSway}
                          spin={swayName}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BendingMarquee;
