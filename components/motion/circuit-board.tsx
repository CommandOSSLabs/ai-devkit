"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface CircuitNode {
  id: string;
  x: number;
  y: number;
  label?: string;
  icon?: React.ReactNode;
  status?: "active" | "inactive" | "processing" | "error";
  size?: "sm" | "md" | "lg";
}

interface CircuitConnection {
  from: string;
  to: string;
  animated?: boolean;
  bidirectional?: boolean;
  color?: string;
  pulseColor?: string;
}

interface CircuitBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: CircuitNode[];
  connections: CircuitConnection[];
  width?: number;
  height?: number;
  gridSize?: number;
  showGrid?: boolean;
  gridColor?: string;
  traceColor?: string;
  pulseColor?: string;
  nodeColor?: string;
  pulseSpeed?: number;
  traceWidth?: number;
  /** Force a specific theme variant. Defaults to auto-detect from system. */
  variant?: "light" | "dark" | "auto";
}

function CircuitBoard({
  nodes,
  connections,
  width = 600,
  height = 400,
  gridSize = 20,
  showGrid = true,
  gridColor,
  traceColor,
  pulseColor,
  nodeColor,
  pulseSpeed = 2,
  traceWidth = 2,
  variant = "auto",
  className,
  ...props
}: CircuitBoardProps) {
  // Theme-aware color defaults
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    if (variant !== "auto") {
      setIsDark(variant === "dark");
      return;
    }

    // Check for dark class on html/body
    const checkTheme = () => {
      const isDarkMode =
        document.documentElement.classList.contains("dark") || document.body.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    checkTheme();

    // Listen for changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", checkTheme);
    };
  }, [variant]);

  // Compute theme-aware colors
  const computedGridColor = gridColor || (isDark ? "rgba(163, 163, 163, 0.08)" : "rgba(64, 64, 64, 0.12)");
  const computedTraceColor = traceColor || (isDark ? "rgba(163, 163, 163, 0.25)" : "rgba(64, 64, 64, 0.35)");
  const computedPulseColor = pulseColor || (isDark ? "rgba(130, 170, 255, 0.7)" : "rgba(79, 70, 229, 0.7)");
  const computedNodeColor = nodeColor || (isDark ? "rgba(163, 163, 163, 0.5)" : "rgba(64, 64, 64, 0.6)");
  const nodeMap = React.useMemo(() => {
    return new Map(nodes.map((node) => [node.id, node]));
  }, [nodes]);

  const getNodeSize = React.useCallback((size?: CircuitNode["size"]) => {
    switch (size) {
      case "sm":
        return 24;
      case "lg":
        return 48;
      default:
        return 36;
    }
  }, []);

  const calculatePath = React.useCallback(
    (from: CircuitNode, to: CircuitNode): string => {
      const fromSize = getNodeSize(from.size) / 2 + 4;
      const toSize = getNodeSize(to.size) / 2 + 4;

      const dx = to.x - from.x;
      const dy = to.y - from.y;

      // Calculate start and end points offset from node centers
      let startX = from.x;
      const startY = from.y;
      let endX = to.x;
      const endY = to.y;

      // Create circuit-like paths with right angles
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal first, then vertical
        startX = from.x + (dx > 0 ? fromSize : -fromSize);
        endX = to.x + (dx > 0 ? -toSize : toSize);
        const midX = from.x + dx / 2;
        return `M ${startX} ${startY} H ${midX} V ${endY} H ${endX}`;
      } else {
        // Vertical first, then horizontal
        const sY = from.y + (dy > 0 ? fromSize : -fromSize);
        const eY = to.y + (dy > 0 ? -toSize : toSize);
        const midY = from.y + dy / 2;
        return `M ${startX} ${sY} V ${midY} H ${endX} V ${eY}`;
      }
    },
    [getNodeSize]
  );

  const getStatusColor = (status?: CircuitNode["status"]) => {
    if (isDark) {
      switch (status) {
        case "active":
          return "rgba(130, 170, 255, 0.8)";
        case "processing":
          return "rgba(255, 203, 107, 0.8)";
        case "error":
          return "rgba(240, 113, 120, 0.8)";
        default:
          return computedNodeColor;
      }
    } else {
      switch (status) {
        case "active":
          return "rgba(79, 70, 229, 0.85)";
        case "processing":
          return "rgba(202, 138, 4, 0.8)";
        case "error":
          return "rgba(220, 38, 38, 0.8)";
        default:
          return computedNodeColor;
      }
    }
  };

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ width, height }} {...props}>
      <svg width={width} height={height} className="absolute inset-0" style={{ overflow: "visible" }}>
        <defs>
          {/* Glow filter for the pulse effect */}
          <filter id="circuitGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Grid pattern */}
          {showGrid && (
            <pattern id="circuitGrid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
              <circle cx={gridSize / 2} cy={gridSize / 2} r="0.5" fill={computedGridColor} />
            </pattern>
          )}
        </defs>

        {/* Grid background */}
        {showGrid && <rect width={width} height={height} fill="url(#circuitGrid)" />}

        {/* Connection traces */}
        {connections.map((conn, i) => {
          const fromNode = nodeMap.get(conn.from);
          const toNode = nodeMap.get(conn.to);
          if (!fromNode || !toNode) return null;

          const path = calculatePath(fromNode, toNode);
          const pathLength = 500; // Approximate path length for animation

          return (
            <g key={`connection-${i}`}>
              {/* Base trace */}
              <motion.path
                d={path}
                fill="none"
                stroke={conn.color || computedTraceColor}
                strokeWidth={traceWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.2 }}
              />

              {/* Animated electricity pulse */}
              {conn.animated !== false && (
                <motion.path
                  d={path}
                  fill="none"
                  stroke={conn.pulseColor || computedPulseColor}
                  strokeWidth={traceWidth + 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#circuitGlow)"
                  strokeDasharray={`${pathLength * 0.1} ${pathLength * 0.9}`}
                  initial={{ strokeDashoffset: pathLength }}
                  animate={{ strokeDashoffset: -pathLength }}
                  transition={{
                    duration: pulseSpeed,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.3,
                  }}
                />
              )}

              {/* Bidirectional pulse */}
              {conn.bidirectional && (
                <motion.path
                  d={path}
                  fill="none"
                  stroke={conn.pulseColor || computedPulseColor}
                  strokeWidth={traceWidth + 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#circuitGlow)"
                  strokeDasharray={`${pathLength * 0.1} ${pathLength * 0.9}`}
                  initial={{ strokeDashoffset: -pathLength }}
                  animate={{ strokeDashoffset: pathLength }}
                  transition={{
                    duration: pulseSpeed,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.3 + pulseSpeed / 2,
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => {
        const size = getNodeSize(node.size);
        const statusColor = getStatusColor(node.status);

        return (
          <motion.div
            key={node.id}
            className="absolute flex items-center justify-center"
            style={{
              left: node.x - size / 2,
              top: node.y - size / 2,
              width: size,
              height: size,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 + 0.5, type: "spring" }}
          >
            {/* Node background with pulse */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              style={{ backgroundColor: statusColor }}
              animate={node.status === "processing" ? { opacity: [0.2, 0.5, 0.2] } : { opacity: 0.2 }}
              transition={node.status === "processing" ? { duration: 1.5, repeat: Infinity } : {}}
            />

            {/* Node border */}
            <div className="absolute inset-0 rounded-lg border-2" style={{ borderColor: statusColor }} />

            {/* Inner glow for active nodes */}
            {node.status === "active" && (
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{
                  boxShadow: `0 0 20px ${statusColor}40, inset 0 0 10px ${statusColor}20`,
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Node content */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              {node.icon && <div style={{ color: statusColor }}>{node.icon}</div>}
            </div>

            {/* Label */}
            {node.label && (
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium"
                style={{ color: statusColor }}
              >
                {node.label}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// Interactive circuit node for building custom circuits
interface CircuitNodeComponentProps {
  status?: "active" | "inactive" | "processing" | "error";
  size?: "sm" | "md" | "lg";
  glowColor?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function CircuitNodeStandalone({
  status = "inactive",
  size = "md",
  glowColor,
  children,
  className,
  onClick,
}: CircuitNodeComponentProps) {
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    const checkTheme = () => {
      const isDarkMode =
        document.documentElement.classList.contains("dark") || document.body.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", checkTheme);
    };
  }, []);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const statusColors = isDark
    ? {
        active: "rgba(130, 170, 255, 0.8)",
        inactive: "rgba(115, 115, 115, 0.4)",
        processing: "rgba(255, 203, 107, 0.7)",
        error: "rgba(240, 113, 120, 0.7)",
      }
    : {
        active: "rgba(79, 70, 229, 0.85)",
        inactive: "rgba(100, 100, 100, 0.5)",
        processing: "rgba(202, 138, 4, 0.7)",
        error: "rgba(220, 38, 38, 0.7)",
      };

  const color = glowColor || statusColors[status];

  return (
    <motion.div
      className={cn(
        "relative flex items-center justify-center rounded-lg border",
        isDark ? "bg-neutral-900/50" : "bg-neutral-200/60",
        sizeClasses[size],
        className
      )}
      style={{ borderColor: color }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Pulse animation for processing state */}
      {status === "processing" && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{ backgroundColor: color }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Active glow */}
      {status === "active" && (
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            boxShadow: `0 0 20px ${color}60, 0 0 40px ${color}30`,
          }}
        />
      )}

      {/* Error pulse */}
      {status === "error" && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{ boxShadow: `0 0 20px ${color}80` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}

      <div className="relative z-10" style={{ color }}>
        {children}
      </div>
    </motion.div>
  );
}

export {
  CircuitBoard,
  CircuitNodeStandalone as CircuitNode,
  type CircuitNode as CircuitNodeType,
  type CircuitConnection,
  type CircuitBoardProps,
};
