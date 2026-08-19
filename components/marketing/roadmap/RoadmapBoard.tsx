"use client";

// Three-column board (Now / Next / Later) plus a Shipped section that
// mirrors the real /changelog. Same bordered-card, mono-label visual
// language as the changelog page — border-subtle cards, "$ ref"-style
// commit/PR chips, accent color reused from there.

import { useState } from "react";
import Link from "next/link";
import { CATEGORIES, ROADMAP_ITEMS, STATUS_DESCRIPTIONS, STATUS_LABELS, type RoadmapCategory, type RoadmapItem, type RoadmapStatus } from "./data";

const COLUMNS: RoadmapStatus[] = ["now", "next", "later"];

const STATUS_DOT: Record<RoadmapStatus, string> = {
  now: "bg-emerald-400 animate-pulse",
  next: "bg-amber-400",
  later: "bg-[var(--text-disabled)]",
  shipped: "bg-emerald-400",
};

function StatusDot({ status }: { status: RoadmapStatus }) {
  return <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />;
}

function RefChip({ label, url }: { label: string; url: string }) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noreferrer"
      className="mt-2 inline-flex w-fit items-center gap-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-base)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
    >
      <span className="select-none text-[var(--text-tertiary)]">$</span>
      {label}
    </Link>
  );
}

function ActiveCard({ item }: { item: Extract<RoadmapItem, { status: "now" | "next" | "later" }> }) {
  return (
    <div className="border border-[var(--border-subtle)] p-4 transition-colors hover:border-[var(--border-strong)]">
      <h3 className="text-[14px] font-medium text-[var(--text-primary)]">{item.title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">{item.description}</p>
      {item.link && (
        <Link
          href={item.link.url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block w-fit text-[11px] text-[var(--text-tertiary)] underline decoration-current/30 underline-offset-4 transition-colors hover:text-[var(--text-secondary)] hover:decoration-current"
        >
          {item.link.label} &rarr;
        </Link>
      )}
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-tertiary)]">{item.category}</span>
        {item.pr && <RefChip label="gh pr" url={item.pr} />}
      </div>
    </div>
  );
}

function ShippedCard({ item }: { item: Extract<RoadmapItem, { status: "shipped" }> }) {
  const content = (
    <>
      <div className="min-w-0 flex-1">
        <h3 className="text-[14px] font-medium text-[var(--text-primary)] transition-colors group-hover:text-[var(--text-primary)]/80">
          {item.title}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)] line-clamp-2">{item.description}</p>
        {/* A ref chip is itself a link — only shown when the card isn't
            already wrapped in one, since an <a> can't nest inside an <a>. */}
        {!item.href && item.ref && <RefChip label={item.ref.label} url={item.ref.url} />}
      </div>
      <span className="mt-0.5 whitespace-nowrap font-mono text-[11px] text-[var(--text-tertiary)]">{item.shippedDate}</span>
    </>
  );

  const className = "group flex items-start gap-3 border border-[var(--border-subtle)] p-4 transition-colors hover:border-[var(--border-strong)]";

  if (item.href) {
    return (
      <Link href={item.href} className={className}>
        {content}
      </Link>
    );
  }
  return <div className={className}>{content}</div>;
}

export function RoadmapBoard() {
  const [filter, setFilter] = useState<RoadmapCategory | null>(null);

  const filtered = filter ? ROADMAP_ITEMS.filter((item) => item.category === filter) : ROADMAP_ITEMS;
  const itemsFor = (status: RoadmapStatus) =>
    filtered.filter((item): item is Extract<RoadmapItem, { status: "now" | "next" | "later" }> => item.status !== "shipped" && item.status === status);
  const shipped = filtered.filter((item): item is Extract<RoadmapItem, { status: "shipped" }> => item.status === "shipped");

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={() => setFilter(null)}
          className={`text-[13px] transition-colors ${filter === null ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
        >
          All
        </button>
        <div className="h-4 w-px bg-[var(--border-subtle)]" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(filter === cat ? null : cat)}
            className={`text-[13px] transition-colors ${filter === cat ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-px border border-[var(--border-subtle)] bg-[var(--border-subtle)] md:grid-cols-3">
        {COLUMNS.map((status) => {
          const items = itemsFor(status);
          return (
            <div key={status} className="bg-[var(--bg-base)]">
              <div className="border-b border-[var(--border-subtle)] px-4 py-3">
                <h2 className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                  <StatusDot status={status} />
                  {STATUS_LABELS[status]}
                  <span className="text-[var(--text-disabled)]">{items.length}</span>
                </h2>
                <p className="mt-1 text-[11px] text-[var(--text-tertiary)]">{STATUS_DESCRIPTIONS[status]}</p>
              </div>
              <div className="flex min-h-[120px] flex-col gap-px bg-[var(--border-subtle)]">
                {items.map((item) => (
                  <div key={item.id} className="bg-[var(--bg-base)]">
                    <ActiveCard item={item} />
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="px-4 py-8 text-center text-[12px] text-[var(--text-disabled)]">Nothing here yet</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {shipped.length > 0 && (
        <div className="mt-12">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
              <StatusDot status="shipped" />
              {STATUS_LABELS.shipped}
              <span className="text-[var(--text-disabled)]">{shipped.length}</span>
            </h2>
            <Link
              href="/changelog"
              className="text-[12px] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Full changelog &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-px border border-[var(--border-subtle)] bg-[var(--border-subtle)] md:grid-cols-2">
            {shipped.map((item) => (
              <div key={item.id} className="bg-[var(--bg-base)]">
                <ShippedCard item={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
