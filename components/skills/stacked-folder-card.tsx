"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { type CuratedSkillRef } from "@/lib/skill-collections";
import { useResolvedXMedia } from "@/lib/use-x-thumbnail";

const PAGE_VARIANTS = [
  {
    initial: { rotate: -4, x: -34, y: 4 },
    open: { rotate: -9, x: -58, y: -44 },
    transition: {
      type: "spring" as const,
      bounce: 0.15,
      stiffness: 160,
      damping: 22,
    },
    className: "z-10 shadow-md",
  },
  {
    initial: { rotate: 0, x: 0, y: -2 },
    open: { rotate: 1, x: 2, y: -62 },
    transition: {
      type: "spring" as const,
      duration: 0.55,
      bounce: 0.12,
      stiffness: 190,
      damping: 24,
    },
    className: "z-20 shadow-lg",
  },
  {
    initial: { rotate: 4, x: 36, y: 3 },
    open: { rotate: 9.5, x: 60, y: -48 },
    transition: {
      type: "spring" as const,
      duration: 0.58,
      bounce: 0.17,
      stiffness: 170,
      damping: 21,
    },
    className: "z-10 shadow-md",
  },
];

const FOLDER_PATH =
  "M104.615 0.350494L33.1297 0.838776C32.7542 0.841362 32.3825 0.881463 32.032 0.918854C31.6754 0.956907 31.3392 0.992086 31.0057 0.992096H31.0047C30.6871 0.99235 30.3673 0.962051 30.0272 0.929596C29.6927 0.897686 29.3384 0.863802 28.9803 0.866119L13.2693 0.967682H13.2527L13.2352 0.969635C13.1239 0.981406 13.0121 0.986674 12.9002 0.986237H9.91388C8.33299 0.958599 6.76052 1.22345 5.27423 1.76651H5.27325C4.33579 2.11246 3.48761 2.66213 2.7879 3.37393L2.49689 3.68839L2.492 3.69424C1.62667 4.73882 1.00023 5.96217 0.656067 7.27725C0.653324 7.28773 0.654065 7.29886 0.652161 7.30948C0.3098 8.62705 0.257231 10.0048 0.499817 11.3446L12.2147 114.399L12.2156 114.411L12.2176 114.423C12.6046 116.568 13.7287 118.508 15.3934 119.902C17.058 121.297 19.1572 122.056 21.3231 122.049V122.05H215.379C217.76 122.02 220.064 121.192 221.926 119.698V119.697C223.657 118.384 224.857 116.485 225.305 114.35L225.307 114.339L235.914 53.3798L235.968 53.1093L235.97 53.0985L235.971 53.0888C236.134 51.8978 236.044 50.685 235.705 49.5321C235.307 48.1669 234.63 46.9005 233.717 45.8144L233.383 45.4296C232.58 44.5553 231.614 43.8449 230.539 43.3398C229.311 42.7628 227.971 42.4685 226.616 42.4774H146.746C144.063 42.4705 141.423 41.8004 139.056 40.5263C136.691 39.2522 134.671 37.4127 133.175 35.1689L113.548 5.05948L113.544 5.05362L113.539 5.04776C112.545 3.65165 111.238 2.51062 109.722 1.72061C108.266 0.886502 106.627 0.422235 104.952 0.365143V0.364166L104.633 0.350494H104.615Z";

function FolderXThumbnailCard({
  item,
  accent,
}: {
  item: CuratedSkillRef;
  accent?: string;
}) {
  const media = useResolvedXMedia(item);
  const [imgSrc, setImgSrc] = useState(media.thumbnailUrl);

  useEffect(() => {
    setImgSrc(media.thumbnailUrl);
  }, [media.thumbnailUrl]);

  return (
    <div className="relative h-[74px] w-24 overflow-hidden rounded-xl border border-white/25 bg-[#121017] p-[3px] shadow-[0_10px_22px_rgba(0,0,0,0.45)] sm:h-[80px] sm:w-28">
      <div className="relative h-full w-full overflow-hidden rounded-[9px] bg-[#1A1721]">
        {media.videoUrl ? (
          <video
            src={media.videoUrl}
            poster={imgSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover object-center"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imgSrc}
            alt={item.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => {
              if (imgSrc !== media.fallbackThumbnailUrl) {
                setImgSrc(media.fallbackThumbnailUrl);
              } else if (imgSrc !== media.avatarUrl) {
                setImgSrc(media.avatarUrl);
              }
            }}
            className="h-full w-full object-cover object-center"
          />
        )}

        {/* Subtle gradient scrim so X handle & skill name remain legible */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10, 9, 14, 0.55) 0%, rgba(10, 9, 14, 0.1) 45%, rgba(10, 9, 14, 0.82) 100%)",
          }}
        />

        {/* Top X creator pill */}
        <div className="pointer-events-none absolute left-1.5 right-1.5 top-1.5 flex items-center justify-between gap-1">
          <span className="inline-flex max-w-[82%] items-center gap-1 truncate rounded-full border border-white/20 bg-black/60 px-1.5 py-0.5 text-[8px] font-medium leading-none text-white/95 backdrop-blur-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.avatarUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="h-2.5 w-2.5 shrink-0 rounded-full object-cover"
            />
            <span className="truncate">@{media.handle}</span>
          </span>
          <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-black/65 text-[7.5px] font-bold text-white/90">
            𝕏
          </span>
        </div>

        {/* Bottom title + accent bar */}
        <div className="pointer-events-none absolute bottom-1.5 left-1.5 right-1.5 flex items-center gap-1">
          {accent && (
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: accent }}
            />
          )}
          <span className="truncate font-mono text-[8.5px] font-medium leading-tight text-white/95">
            {item.name}
          </span>
        </div>
      </div>
    </div>
  );
}

function FolderPage({
  accent,
  isNewFront,
}: {
  accent?: string;
  isNewFront?: boolean;
}) {
  return (
    <div className="relative h-[74px] w-24 overflow-hidden rounded-xl border border-white/25 bg-gradient-to-b from-[#ECEBF3] to-[#DCDAE8] p-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.35)] sm:h-[80px] sm:w-28 sm:p-3">
      {accent && (
        <div
          className="mb-2 h-1.5 w-10 rounded-full opacity-90"
          style={{ background: accent }}
        />
      )}
      {isNewFront ? (
        <div className="flex h-12 items-center justify-center text-[#525066]">
          <Plus size={18} strokeWidth={2.2} />
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {!accent && <div className="h-1.5 w-full rounded-full bg-[#CFCDE0]" />}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-1.5">
              <div className="h-1 flex-1 rounded-full bg-[#CFCDE0]" />
              <div className="h-1 flex-1 rounded-full bg-[#CFCDE0]" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function StackedFolderIllustration({
  variant = "collection",
  active = false,
  isOpen = false,
  previewAccents,
  previewItems,
}: {
  variant?: "collection" | "new";
  active?: boolean;
  isOpen?: boolean;
  previewAccents?: string[];
  previewItems?: CuratedSkillRef[];
}) {
  const rawId = useId().replace(/:/g, "");
  const clipId = `folder_clip_${rawId}`;
  const fillGradId = `folder_fill_${rawId}`;
  const strokeGradId = `folder_stroke_${rawId}`;
  const opened = isOpen || active;

  // Arrange up to 3 items so the featured/first ref sits in the center slot (index 1)
  const slotItems: Array<CuratedSkillRef | undefined> =
    variant === "collection" && previewItems && previewItems.length > 0
      ? [
          previewItems[1] ?? previewItems[0],
          previewItems[0],
          previewItems[2] ?? previewItems[1] ?? previewItems[0],
        ]
      : [undefined, undefined, undefined];

  return (
    <div
      className="relative mx-auto flex h-40 w-60 select-none items-center justify-center"
      style={{ perspective: "900px" }}
      aria-hidden="true"
    >
      {/* Back Folder Plate */}
      <div
        className="relative mx-auto flex h-full w-[87.5%] items-center justify-center overflow-visible"
        style={{
          background: "#18151B",
          boxShadow:
            "0px 0px 15.7px 16px rgba(79, 73, 85, 0.30) inset, 0 12px 28px rgba(0, 0, 0, 0.45)",
          borderRadius: 10,
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {PAGE_VARIANTS.map((page, i) => {
          const item = slotItems[i];
          return (
            <motion.div
              key={item ? `${item.id}-${i}` : i}
              initial={page.initial}
              animate={opened ? page.open : page.initial}
              transition={page.transition}
              className={`absolute top-2 h-fit rounded-xl ${page.className}`}
            >
              {item ? (
                <FolderXThumbnailCard
                  item={item}
                  accent={previewAccents?.[i]}
                />
              ) : (
                <FolderPage
                  accent={variant === "collection" ? previewAccents?.[i] : undefined}
                  isNewFront={variant === "new" && i === 1}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Translucent Frosted-Glass Front Pocket Flap */}
      <motion.div
        animate={{ rotateX: opened ? -40 : 0 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
        style={{ transformStyle: "preserve-3d" }}
        className="pointer-events-none absolute -bottom-[1px] -left-[1px] -right-[1px] z-30 flex h-32 origin-bottom items-center justify-center overflow-visible rounded-3xl"
      >
        <div className="relative h-full w-full">
          <svg
            className="h-full w-full overflow-visible drop-shadow-[0_10px_24px_rgba(0,0,0,0.4)]"
            viewBox="0 0 235 121"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <foreignObject x="-13" y="-13" width="262.4" height="148.4">
              <div
                style={{
                  backdropFilter: "blur(6.5px)",
                  WebkitBackdropFilter: "blur(6.5px)",
                  clipPath: `url(#${clipId})`,
                  height: "100%",
                  width: "100%",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                }}
              />
            </foreignObject>
            <path
              d={FOLDER_PATH}
              fill={`url(#${fillGradId})`}
              fillOpacity="0.3"
              stroke={`url(#${strokeGradId})`}
              strokeWidth="0.9"
            />
            <defs>
              <clipPath id={clipId} transform="translate(13 13)">
                <path d={FOLDER_PATH} />
              </clipPath>
              <linearGradient
                id={fillGradId}
                x1="114.7"
                y1="0.700104"
                x2="114.7"
                y2="121.7"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2D2535" />
                <stop offset="1" stopColor="#2A2A2A" />
              </linearGradient>
              <linearGradient
                id={strokeGradId}
                x1="114.7"
                y1="0.700104"
                x2="114.7"
                y2="121.7"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFFFFF" stopOpacity="0.32" />
                <stop offset="0.5" stopColor="#7C738A" stopOpacity="0.22" />
                <stop offset="1" stopColor="#212121" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Subtle glass pocket crease / smile detail */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-7">
            {variant === "new" ? (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 backdrop-blur-md">
                <Plus size={15} strokeWidth={2.2} />
              </span>
            ) : (
              <>
                <div className="mb-2 flex gap-9">
                  <div className="h-2 w-2 rounded-full bg-white/25" />
                  <div className="h-2 w-2 rounded-full bg-white/25" />
                </div>
                <div className="h-1 w-7 rounded-full bg-white/25" />
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CollectionCreatorAvatarStrip({ items }: { items: CuratedSkillRef[] }) {
  const uniqueCreators = Array.from(
    new Map(items.map((item) => [item.creator.xHandle.toLowerCase(), item])).values(),
  ).slice(0, 3);

  if (uniqueCreators.length === 0) return null;

  return (
    <span className="inline-flex items-center gap-1.5" title={uniqueCreators.map((c) => `@${c.creator.xHandle}`).join(", ")}>
      <span className="flex -space-x-1.5">
        {uniqueCreators.map((item) => (
          <CreatorMiniAvatar key={item.id} item={item} />
        ))}
      </span>
      <span className="text-[11px] font-medium text-[color:var(--md-ink-muted)]">
        𝕏
      </span>
    </span>
  );
}

function CreatorMiniAvatar({ item }: { item: CuratedSkillRef }) {
  const media = useResolvedXMedia(item);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={media.avatarUrl}
      alt={`@${media.handle}`}
      referrerPolicy="no-referrer"
      className="h-4 w-4 rounded-full border border-[color:var(--md-surface-card)] bg-[#18151B] object-cover"
    />
  );
}

export function StackedFolderCard({
  title,
  countLabel,
  active = false,
  variant = "collection",
  previewAccents,
  previewItems,
  onClick,
}: {
  title: string;
  countLabel?: string;
  subtitle?: string;
  active?: boolean;
  variant?: "collection" | "new";
  previewAccents?: string[];
  previewItems?: CuratedSkillRef[];
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  if (variant === "new") {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="md-collection-add-card group"
      >
        <div className="pt-5">
          <StackedFolderIllustration variant="new" isOpen={hovered} />
        </div>
        <span className="md-collection-add-label">{title}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      data-active={active ? "true" : undefined}
      aria-pressed={active}
      className="md-collection-card group"
    >
      <div className="pt-5">
        <StackedFolderIllustration
          variant="collection"
          active={active}
          isOpen={hovered}
          previewAccents={previewAccents}
          previewItems={previewItems}
        />
      </div>

      <span className="md-collection-card-text">
        <span className="md-collection-card-name">{title}</span>
        <span className="inline-flex items-center gap-2">
          {previewItems && previewItems.length > 0 && (
            <CollectionCreatorAvatarStrip items={previewItems} />
          )}
          {countLabel && (
            <span className="md-collection-card-count">{countLabel}</span>
          )}
        </span>
      </span>
    </button>
  );
}
