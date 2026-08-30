"use client";

import React, { useRef, useState, useMemo } from "react";
import { motion, useInView, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

// Licensed copy of React Bits Pro's "Blur Highlight" (the registry install
// needs a components.json and REACTBITS_LICENSE_KEY, neither of which this
// repo has). One correctness fix against the reference: HighlightWrapper was
// declared inside the render map, so it was a new component identity on every
// render and React remounted it each time, restarting the highlight sweep.
// It is hoisted to module scope here and takes its config as props.

export interface HighlightBit {
  /** Text to highlight */
  text: string;
  /** Which occurrence to highlight (1-based index, or undefined for all) */
  occurrence?: number;
}

type BackgroundMetrics = { initial: string; animated: string; position: string };

function HighlightWrapper({
  children,
  metrics,
  highlightColor,
  highlightClassName,
  transition,
}: {
  children: React.ReactNode;
  metrics: BackgroundMetrics;
  highlightColor: string;
  highlightClassName?: string;
  transition: Transition;
}) {
  const highlightRef = useRef<HTMLSpanElement>(null);
  const highlightInView = useInView(highlightRef, { once: false, initial: false, amount: 0.1 });

  const highlightStyles: React.CSSProperties = {
    backgroundImage: `linear-gradient(${highlightColor}, ${highlightColor})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: metrics.position,
    backgroundSize: highlightInView ? metrics.animated : metrics.initial,
    boxDecorationBreak: "clone",
    WebkitBoxDecorationBreak: "clone",
  };

  return (
    <span ref={highlightRef} className="inline">
      <motion.span
        className={cn("inline", highlightClassName)}
        style={highlightStyles}
        animate={{ backgroundSize: highlightInView ? metrics.animated : metrics.initial }}
        initial={{ backgroundSize: metrics.initial }}
        transition={transition}
      >
        {children}
      </motion.span>
    </span>
  );
}

export interface BlurHighlightProps {
  children: React.ReactNode;
  highlightedBits?: (string | HighlightBit)[];
  highlightColor?: string;
  highlightClassName?: string;
  blurAmount?: number;
  inactiveOpacity?: number;
  blurDelay?: number;
  blurDuration?: number;
  highlightDelay?: number;
  highlightDuration?: number;
  highlightDirection?: "left" | "right" | "top" | "bottom";
  viewportOptions?: { once?: boolean; amount?: number };
  className?: string;
}

export interface BlurHighlightRef {
  trigger: () => void;
  reset: () => void;
}

export const BlurHighlight = React.forwardRef<BlurHighlightRef, BlurHighlightProps>(function BlurHighlight(
  {
    children,
    highlightedBits = [],
    highlightColor = "hsl(80, 100%, 50%)",
    highlightClassName,
    blurAmount = 8,
    inactiveOpacity = 0.3,
    blurDelay = 0,
    blurDuration = 0.8,
    highlightDelay = 0.4,
    highlightDuration = 1,
    highlightDirection = "left",
    viewportOptions = { once: false, amount: 0.5 },
    className,
  },
  ref,
) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [manualTrigger, setManualTrigger] = useState(false);
  const inViewport = useInView(containerRef, { ...viewportOptions, margin: "-20%" });

  const isActive = manualTrigger || inViewport;

  React.useImperativeHandle(ref, () => ({
    trigger: () => setManualTrigger(true),
    reset: () => setManualTrigger(false),
  }));

  const processedContent = useMemo(() => {
    const textContent =
      typeof children === "string"
        ? children
        : React.Children.toArray(children)
            .map((child) => {
              if (typeof child === "string") return child;
              if (React.isValidElement(child)) {
                const props = child.props as { children?: unknown };
                if (props.children) return typeof props.children === "string" ? props.children : "";
              }
              return "";
            })
            .join(" ");

    if (!textContent || highlightedBits.length === 0) {
      return { parts: [{ text: textContent, highlight: false }] };
    }

    const normalizedBits = highlightedBits.map((bit) =>
      typeof bit === "string" ? { text: bit, occurrence: undefined } : bit,
    );

    const matches: Array<{ start: number; end: number; text: string; occurrence: number }> = [];

    normalizedBits.forEach((bit) => {
      const searchText = bit.text;
      let position = 0;
      let occurrence = 0;

      while (position < textContent.length) {
        const index = textContent.indexOf(searchText, position);
        if (index === -1) break;
        occurrence++;
        if (bit.occurrence === undefined || bit.occurrence === occurrence) {
          matches.push({ start: index, end: index + searchText.length, text: searchText, occurrence });
        }
        position = index + 1;
      }
    });

    matches.sort((a, b) => a.start - b.start);

    const parts: Array<{ text: string; highlight: boolean }> = [];
    let currentPos = 0;

    matches.forEach((match, index) => {
      if (match.start > currentPos) {
        parts.push({ text: textContent.slice(currentPos, match.start), highlight: false });
      }

      if (index > 0 && match.start < matches[index - 1].end) {
        if (match.end > matches[index - 1].end) {
          parts.push({ text: textContent.slice(matches[index - 1].end, match.end), highlight: true });
          currentPos = match.end;
        }
      } else {
        parts.push({ text: textContent.slice(match.start, match.end), highlight: true });
        currentPos = match.end;
      }
    });

    if (currentPos < textContent.length) {
      parts.push({ text: textContent.slice(currentPos), highlight: false });
    }

    return { parts };
  }, [children, highlightedBits]);

  const metrics: BackgroundMetrics = useMemo(() => {
    switch (highlightDirection) {
      case "right":
        return { initial: "0% 100%", animated: "100% 100%", position: "100% 0%" };
      case "top":
        return { initial: "100% 0%", animated: "100% 100%", position: "0% 0%" };
      case "bottom":
        return { initial: "100% 0%", animated: "100% 100%", position: "0% 100%" };
      case "left":
      default:
        return { initial: "0% 100%", animated: "100% 100%", position: "0% 0%" };
    }
  }, [highlightDirection]);

  const highlightTransition: Transition = {
    type: "spring",
    duration: highlightDuration,
    delay: highlightDelay,
    bounce: 0,
  };

  return (
    <motion.span
      ref={containerRef}
      style={{ display: "block" }}
      initial={{ opacity: 0, filter: `blur(${blurAmount}px)` }}
      animate={
        isActive
          ? { opacity: 1, filter: "blur(0px)" }
          : { opacity: inactiveOpacity, filter: `blur(${blurAmount * 0.75}px)` }
      }
      transition={{ duration: blurDuration, delay: isActive ? blurDelay : 0, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn("will-change-[filter,opacity]", className)}
    >
      {processedContent.parts.map((part, index) =>
        part.highlight ? (
          <HighlightWrapper
            key={index}
            metrics={metrics}
            highlightColor={highlightColor}
            highlightClassName={highlightClassName}
            transition={highlightTransition}
          >
            {part.text}
          </HighlightWrapper>
        ) : (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        ),
      )}
    </motion.span>
  );
});

BlurHighlight.displayName = "BlurHighlight";

export default BlurHighlight;
