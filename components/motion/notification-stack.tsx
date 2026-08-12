"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationStackItem = {
  id: string;
  title: string;
  description?: string;
  trailing?: ReactNode;
};

export type NotificationStackClassNames = {
  root?: string;
  trigger?: string;
  card?: string;
  title?: string;
  description?: string;
  footer?: string;
};

const CARD_HEIGHT = 62;
const CARD_GAP = 8;

export function NotificationStack({
  items,
  expanded: controlledExpanded,
  defaultExpanded = false,
  onExpandedChange,
  onViewAll,
  maxVisible = 3,
  collapsedLabel = "Notifications",
  expandedLabel = "View all",
  emptyLabel = "All caught up",
  className,
  classNames = {},
}: {
  items: NotificationStackItem[];
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onViewAll?: () => void;
  maxVisible?: number;
  collapsedLabel?: string;
  expandedLabel?: string;
  emptyLabel?: string;
  className?: string;
  classNames?: NotificationStackClassNames;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultExpanded);
  const isExpanded = controlledExpanded ?? uncontrolled;

  const setExpanded = (next: boolean) => {
    if (controlledExpanded === undefined) setUncontrolled(next);
    onExpandedChange?.(next);
  };

  const visible = items.slice(0, maxVisible);
  const stackHeight = 32 + Math.max(0, visible.length - 1) * 6;
  const expandedHeight = visible.length * (CARD_HEIGHT + CARD_GAP);

  return (
    <div
      tabIndex={0}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
      onClick={() => setExpanded(!isExpanded)}
      className={cn("relative w-60 cursor-pointer select-none outline-none", className, classNames.root)}
    >
      <div
        className={cn(
          "mb-2 flex w-fit items-center gap-2 rounded-full border border-[#1E2127] bg-[#101216]/95 px-3 py-1.5 font-mono text-[11px] text-[#9BA1AC] backdrop-blur-sm",
          classNames.trigger
        )}
      >
        <Bell size={12} className="text-[#82AAFF]" />
        <span>{items.length === 0 ? emptyLabel : collapsedLabel}</span>
        {items.length > 0 && (
          <span className="rounded-full bg-[#82AAFF]/15 px-1.5 text-[#82AAFF]">{items.length}</span>
        )}
      </div>

      <motion.div
        className="relative"
        animate={{ height: isExpanded ? expandedHeight : stackHeight }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
      >
        <AnimatePresence initial={false}>
          {visible.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={false}
              animate={
                isExpanded
                  ? { y: i * (CARD_HEIGHT + CARD_GAP), scale: 1, opacity: 1 }
                  : { y: i * 6, scale: 1 - i * 0.04, opacity: 1 - i * 0.18 }
              }
              style={{ zIndex: visible.length - i }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className={cn(
                "absolute left-0 right-0 rounded-[12px] border border-[#1E2127] bg-[#101216] px-3 py-2.5 shadow-lg",
                classNames.card
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={cn("truncate text-[13px] font-medium text-[#E6E8EB]", classNames.title)}>
                  {item.title}
                </span>
                {item.trailing}
              </div>
              {item.description && (
                <p className={cn("mt-0.5 truncate font-mono text-[11px] text-[#6B7280]", classNames.description)}>
                  {item.description}
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isExpanded && items.length > 0 && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewAll?.();
            }}
            style={{ marginTop: expandedHeight + 4 }}
            className={cn(
              "flex w-full items-center justify-between rounded-lg border border-[#1E2127] bg-[#0A0B0D] px-3 py-2 font-mono text-[11px] text-[#9BA1AC] transition-colors hover:text-[#E6E8EB]",
              classNames.footer
            )}
          >
            <span>{expandedLabel}</span>
            <ChevronRight size={12} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationStack;
