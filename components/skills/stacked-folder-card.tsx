"use client";

import type { CSSProperties } from "react";
import { Plus } from "lucide-react";

const PILE_SLOTS = [
  { x: -7, y: -3, rotate: -7, peekX: -11, peekY: -11, peekR: -10, peekS: 1 },
  { x: 7, y: -4, rotate: 6, peekX: 11, peekY: -12, peekR: 9, peekS: 1 },
  { x: 0, y: 3, rotate: 0, peekX: 0, peekY: 7, peekR: 0, peekS: 1.02 },
];

export function StackedFolderIllustration({
  variant = "collection",
  previewAccents,
}: {
  variant?: "collection" | "new";
  active?: boolean;
  previewAccents?: string[];
}) {
  return (
    <span className="md-ref-pile" aria-hidden="true">
      {PILE_SLOTS.map((slot, index) => {
        const isFront = index === PILE_SLOTS.length - 1;
        const accent = previewAccents?.[index];
        const style = {
          "--x": slot.x,
          "--y": slot.y,
          "--r": slot.rotate,
          "--peek-x": slot.peekX,
          "--peek-y": slot.peekY,
          "--peek-r": slot.peekR,
          "--peek-s": slot.peekS,
          zIndex: index,
        } as CSSProperties;

        return (
          <span key={index} className="md-ref-pile-print" style={style}>
            <span className="md-ref-pile-media">
              {variant === "new" && isFront && (
                <span className="inline-flex items-center justify-center text-[var(--md-text-tertiary)]">
                  <Plus size={16} strokeWidth={2} />
                </span>
              )}
              {variant === "collection" && accent && (
                <span
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{ background: accent }}
                />
              )}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function StackedFolderCard({
  title,
  countLabel,
  active = false,
  variant = "collection",
  previewAccents,
  onClick,
}: {
  title: string;
  countLabel?: string;
  subtitle?: string;
  active?: boolean;
  variant?: "collection" | "new";
  previewAccents?: string[];
  onClick?: () => void;
}) {
  if (variant === "new") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="md-collection-add-card"
      >
        <StackedFolderIllustration variant="new" />
        <span className="md-collection-add-label">{title}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active ? "true" : undefined}
      aria-pressed={active}
      className="md-collection-card"
    >
      <StackedFolderIllustration
        variant="collection"
        active={active}
        previewAccents={previewAccents}
      />

      <span className="md-collection-card-text">
        <span className="md-collection-card-name">{title}</span>
        {countLabel && (
          <span className="md-collection-card-count">{countLabel}</span>
        )}
      </span>
    </button>
  );
}
