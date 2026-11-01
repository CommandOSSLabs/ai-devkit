"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  ExternalLink,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";
import {
  buildShoutoutTweet,
  resolveRefAvatar,
  resolveRefXLink,
  type CuratedSkillRef,
} from "@/lib/skill-collections";
import { useResolvedXMedia } from "@/lib/use-x-thumbnail";

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className ?? "h-3.5 w-3.5 fill-current"}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg
      viewBox="0 0 22 22"
      aria-label="Vetted companion skill"
      className="h-4 w-4 shrink-0 fill-[#1d9bf0]"
    >
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </svg>
  );
}

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #fab12f 0%, #dd0303 100%)",
  "linear-gradient(135deg, #82aaff 0%, #437df5 100%)",
  "linear-gradient(135deg, #c3e88d 0%, #10b981 100%)",
  "linear-gradient(135deg, #f79ad0 0%, #8b5cf6 100%)",
  "linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)",
  "linear-gradient(135deg, #fb923c 0%, #ec4899 100%)",
];

function getHashIndex(id: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h % mod;
}

/**
 * X Link Thumbnail Stage inside each `.md-tile-frame`:
 * Renders the resolved thumbnail from the item's X post/profile link
 * (`pbs.twimg.com` media/video thumb, creator banner, or linked card OG image)
 * with real X creator avatar, handle, and install metadata.
 */
export function TileVisualArtwork({
  item,
  index,
  large = false,
}: {
  item: CuratedSkillRef;
  index: number;
  large?: boolean;
}) {
  const media = useResolvedXMedia(item);
  const [imgSrc, setImgSrc] = useState(media.thumbnailUrl);
  const [imgFailed, setImgFailed] = useState(false);
  const cmdShort = item.installCommand
    ? item.installCommand.replace(/^npx skills add\s+/, "")
    : item.creator.githubRepo;

  useEffect(() => {
    setImgSrc(media.thumbnailUrl);
    setImgFailed(false);
  }, [media.thumbnailUrl]);

  if (!imgFailed && imgSrc) {
    return (
      <div
        className={`relative flex w-full flex-col justify-between overflow-hidden bg-[#111115] ${
          large ? "min-h-[460px] p-5 sm:p-7" : "min-h-[330px] p-4"
        }`}
      >
        {/* Ambient blurred backdrop derived from the X link thumbnail */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            className="h-full w-full scale-125 object-cover blur-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111115]/75 via-[#111115]/65 to-[#111115]/95" />
        </div>

        {/* Top X Source Header */}
        <div className="relative z-10 mb-3 flex items-center justify-between gap-2">
          <div className="inline-flex min-w-0 items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.avatarUrl}
              alt={`@${media.handle}`}
              referrerPolicy="no-referrer"
              className="h-5 w-5 shrink-0 rounded-full border border-white/20 bg-[#18151B] object-cover"
            />
            <span className="truncate font-mono text-[11.5px] font-medium text-white/90">
              @{media.handle}
            </span>
            <VerifiedBadge />
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {item.starsOrInstalls && (
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-white/80">
                {item.starsOrInstalls}
              </span>
            )}
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.08] text-white/85">
              <XLogo className="h-2.5 w-2.5 fill-current" />
            </span>
          </div>
        </div>

        {/* Main X Link Thumbnail / Video Post Frame */}
        <div className="relative z-10 overflow-hidden rounded-[16px] border border-white/[0.12] bg-[#0b0b0e] shadow-[0_14px_32px_rgba(0,0,0,0.55)]">
          {media.videoUrl ? (
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
              <video
                src={media.videoUrl}
                poster={imgSrc}
                controls={large}
                playsInline
                muted
                loop
                autoPlay
                preload="metadata"
                className="h-full w-full bg-black object-cover"
              />
              {!large && (
                <div className="pointer-events-none absolute left-2.5 top-2.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/75 px-2.5 py-0.5 font-mono text-[10px] font-medium text-white backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
                    <span>X Video Post</span>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#16151d]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc}
                alt={`${item.title} X thumbnail`}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => {
                  if (imgSrc !== media.fallbackThumbnailUrl) {
                    setImgSrc(media.fallbackThumbnailUrl);
                  } else {
                    setImgFailed(true);
                  }
                }}
                className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />

              {/* Subtle inner frame vignette */}
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />

              {/* X post indicator badge */}
              <div className="pointer-events-none absolute left-2.5 top-2.5 flex items-center gap-1.5">
                {media.isStatusPost ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/65 px-2 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-md">
                    <span>X Post Media</span>
                  </span>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Caption & CMK Pairing Strip */}
        <div className="relative z-10 mt-3.5 pb-8">
          <div className="flex items-center justify-between gap-2">
            <h4 className="truncate text-[16px] font-medium leading-[1.25] tracking-[-0.015em] text-white">
              {item.title}
            </h4>
            <span className="shrink-0 rounded-md bg-white/[0.07] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/70">
              {item.collectionId}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-[1.45] text-[#a3a3ad]">
            {item.tagline}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1.5 border-t border-white/[0.07] pt-2.5">
            <span className="truncate font-mono text-[10.5px] text-[#c3e88d]">
              $ {item.installCommand ?? cmdShort}
            </span>
            {item.pairsWithCmk.length > 0 && (
              <div className="flex items-center gap-1">
                {item.pairsWithCmk.slice(0, 2).map((cmk) => (
                  <span
                    key={cmk}
                    className="rounded-full bg-white/[0.07] px-2 py-0.5 font-mono text-[10px] text-[#d4d4d8]"
                  >
                    + cmk:{cmk}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const variant = index % 6;

  // Variant 0: Floating App / Studio Window Preview
  if (variant === 0) {
    return (
      <div
        className={`relative flex w-full flex-col justify-between overflow-hidden bg-[#131418] p-6 ${
          large ? "min-h-[460px] sm:p-10" : "min-h-[340px]"
        }`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(85% 70% at 50% 0%, rgba(130, 170, 255, 0.16) 0%, transparent 70%)",
          }}
        />

        {/* Top mini browser/window chrome */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-[#8a8a8a]">
          <span className="inline-flex items-center gap-1.5 font-mono">
            <span className="h-2 w-2 rounded-full bg-[#fab12f]" />
            {item.creator.githubRepo}
          </span>
          {item.starsOrInstalls && (
            <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 font-mono text-[10.5px] text-[#b4b4b4]">
              {item.starsOrInstalls}
            </span>
          )}
        </div>

        {/* Center studio card */}
        <div className="relative z-10 my-5 rounded-[18px] border border-white/[0.08] bg-[#0b0c0e]/90 p-5 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-md bg-white/[0.07] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#9a9a9a]">
              {item.collectionId}
            </span>
            {item.isNew && (
              <span className="rounded-full bg-[#fab12f]/15 px-2 py-0.5 font-mono text-[10px] text-[#fab12f]">
                Featured
              </span>
            )}
          </div>
          <h4 className="text-[19px] font-medium leading-[1.22] tracking-[-0.02em] text-white">
            {item.title}
          </h4>
          <p className="mt-2 line-clamp-3 text-[12.5px] leading-[1.55] text-[#9a9a9a]">
            {item.tagline}
          </p>

          {item.pairsWithCmk.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-white/[0.06] pt-3">
              {item.pairsWithCmk.map((cmk) => (
                <span
                  key={cmk}
                  className="rounded-full bg-white/[0.06] px-2.5 py-0.5 font-mono text-[10.5px] text-[#d4d4d8]"
                >
                  + cmk:{cmk}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="relative z-10 h-6" />
      </div>
    );
  }

  // Variant 1: Editorial High-Contrast Light/Paper Specimen Card (like the light cards in marked.dev/explore)
  if (variant === 1) {
    return (
      <div
        className={`relative flex w-full flex-col justify-between overflow-hidden bg-[#eceae4] p-6 text-[#141413] ${
          large ? "min-h-[460px] sm:p-10" : "min-h-[290px]"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/10 pb-3 font-mono text-[10.5px] uppercase tracking-widest text-black/55">
          <span>SKILL SPECIMEN</span>
          <span>@{item.creator.xHandle}</span>
        </div>

        <div className="my-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-black/50">
            {item.creator.githubRepo}
          </p>
          <h4 className="mt-1.5 text-[24px] font-semibold leading-[1.12] tracking-[-0.03em] text-[#111111]">
            {item.title}
          </h4>
          <p className="mt-2.5 line-clamp-3 text-[13px] leading-[1.5] text-black/70">
            {item.tagline}
          </p>
        </div>

        <div className="mb-7 flex items-center justify-between rounded-xl bg-black/[0.06] px-3 py-2 font-mono text-[11px] text-black/75">
          <span className="truncate">$ {item.installCommand ?? cmdShort}</span>
        </div>
      </div>
    );
  }

  // Variant 2: Obsidian Terminal & Pinned SHA Verification Card
  if (variant === 2) {
    return (
      <div
        className={`relative flex w-full flex-col justify-between overflow-hidden bg-[#0c0d10] p-6 ${
          large ? "min-h-[460px] sm:p-10" : "min-h-[370px]"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <span className="font-mono text-[10.5px] text-[#8a8a8a]">
            SHA · {item.pinnedSha ?? "HEAD"}
          </span>
        </div>

        <div className="my-5 space-y-3 rounded-2xl border border-white/[0.07] bg-[#141519] p-4 font-mono text-[11.5px]">
          <div className="flex items-center gap-2 text-[#9a9a9a]">
            <Terminal size={13} className="text-[#c3e88d]" />
            <span className="truncate text-white">{item.title}</span>
          </div>
          <div className="rounded-lg bg-black/60 p-3 text-[#c3e88d]">
            <span className="select-none text-[#6b7280]">$ </span>
            <span className="break-all">
              {item.installCommand ?? `git clone ${item.creator.githubUrl}`}
            </span>
          </div>
          <p className="font-sans text-[12.5px] leading-[1.55] text-[#b4b4b4]">
            {item.tagline}
          </p>
        </div>

        <div className="mb-7 flex flex-wrap gap-1.5">
          {[item.collectionId, ...item.pairsWithCmk.slice(0, 2)].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10.5px] text-[#9a9a9a]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Variant 3: Bold Display Typography & Monogram Card (like the "Geist / Aa" card in marked.dev)
  if (variant === 3) {
    const monogram = item.title
      .split(/[\s-]+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

    return (
      <div
        className={`relative flex w-full flex-col justify-between overflow-hidden bg-[#151515] p-6 ${
          large ? "min-h-[460px] sm:p-10" : "min-h-[320px]"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[14px] font-medium text-white">{item.title}</span>
            <p className="font-mono text-[11px] text-[#8a8a8a]">@{item.creator.xHandle}</p>
          </div>
          <span className="rounded-full bg-white/[0.08] px-2.5 py-0.5 font-mono text-[10.5px] text-[#b4b4b4]">
            {item.starsOrInstalls ?? "Vetted"}
          </span>
        </div>

        <div className="my-4 flex items-baseline justify-between">
          <span className="select-none font-sans text-[76px] font-semibold leading-none tracking-[-0.05em] text-white/90">
            {monogram}
          </span>
          <div className="max-w-[165px] text-right">
            <p className="line-clamp-3 text-[12px] leading-[1.45] text-[#9a9a9a]">
              {item.tagline}
            </p>
          </div>
        </div>

        <div className="mb-6 h-px w-full bg-white/[0.07]" />
      </div>
    );
  }

  // Variant 4: Better-Together CMK + X Workflow Graph Canvas
  if (variant === 4) {
    return (
      <div
        className={`relative flex w-full flex-col justify-between overflow-hidden bg-[#111318] p-6 ${
          large ? "min-h-[460px] sm:p-10" : "min-h-[350px]"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/[0.08] px-2.5 py-1 font-mono text-[10.5px] text-white">
            Workflow Recipe
          </span>
          <span className="font-mono text-[11px] text-[#9a9a9a]">
            {item.creator.githubRepo}
          </span>
        </div>

        {/* Connected nodes */}
        <div className="my-6 flex flex-col gap-2.5">
          {item.pairsWithCmk.slice(0, 2).map((cmkId) => (
            <div
              key={cmkId}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-white/[0.1] bg-[#0a0b0e] px-3.5 py-2 font-mono text-[11.5px] text-[#82aaff] shadow-lg"
            >
              <span className="h-2 w-2 rounded-full bg-[#82aaff]" />
              cmk:{cmkId}
            </div>
          ))}
          <div className="ml-5 h-4 w-px bg-white/20" />
          <div className="rounded-2xl border border-white/[0.14] bg-[#1b1d24] p-4 shadow-xl">
            <div className="font-mono text-[10.5px] text-[#fab12f]">
              + X Companion Skill
            </div>
            <div className="mt-0.5 text-[16px] font-medium text-white">
              {item.title}
            </div>
            <p className="mt-1 line-clamp-2 text-[12px] text-[#9a9a9a]">
              {item.tagline}
            </p>
          </div>
        </div>

        <div className="h-5" />
      </div>
    );
  }

  // Variant 5: Minimalist Bento Metric & Feature Card
  return (
    <div
      className={`relative flex w-full flex-col justify-between overflow-hidden bg-[#161618] p-6 ${
        large ? "min-h-[460px] sm:p-10" : "min-h-[300px]"
      }`}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-25 blur-2xl"
        style={{ background: AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length] }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <span className="font-mono text-[11px] text-[#9a9a9a]">
          {item.creator.githubRepo}
        </span>
        {item.starsOrInstalls && (
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 font-mono text-[10.5px] text-white">
            {item.starsOrInstalls}
          </span>
        )}
      </div>

      <div className="relative z-10 my-5">
        <h4 className="text-[21px] font-medium leading-[1.2] tracking-[-0.02em] text-white">
          {item.title}
        </h4>
        <p className="mt-2 line-clamp-3 text-[13px] leading-[1.55] text-[#9a9a9a]">
          {item.tagline}
        </p>
      </div>

      <div className="relative z-10 mb-7 flex items-center gap-2 font-mono text-[11px] text-[#b4b4b4]">
        <ShieldCheck size={13} className="text-[#c3e88d]" />
        <span className="truncate">{cmdShort}</span>
      </div>
    </div>
  );
}

/**
 * Single visual masonry tile for `/skills/explore` and `/skills/collections`
 * matching `marked.dev`'s `.tile` & `.tile-frame` with bottom-left creator avatar
 * and top-right hover quick actions.
 */
export function ExploreVisualTile({
  item,
  index,
  onSelect,
}: {
  item: CuratedSkillRef;
  index: number;
  onSelect?: (item: CuratedSkillRef) => void;
}) {
  const [copied, setCopied] = useState(false);
  const media = useResolvedXMedia(item);
  const avatarBg = AVATAR_GRADIENTS[getHashIndex(item.id, AVATAR_GRADIENTS.length)];
  const shoutoutUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
    buildShoutoutTweet(item),
  )}`;

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    const text = item.installCommand ?? item.creator.githubUrl;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="md-ref-grid-item">
      <div className="md-tile group">
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelect?.(item)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect?.(item);
            }
          }}
          className="md-tile-frame"
        >
          <TileVisualArtwork item={item} index={index} />

          {/* Top-right hover actions (.tile-menu) */}
          <div className=" absolute right-3.5 top-3.5 z-20 flex items-center gap-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
            <button
              type="button"
              onClick={handleCopy}
              title={item.installCommand ? `Copy: ${item.installCommand}` : "Copy repo URL"}
              className="inline-flex h-[30px] items-center gap-1.5 rounded-full bg-[#171717]/90 px-3 font-mono text-[11px] font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-md transition-transform active:scale-95"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-[#c3e88d]" />
                  <span className="text-[#c3e88d]">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={11} />
                  <span>{item.installCommand ? "npx add" : "Copy"}</span>
                </>
              )}
            </button>

            <a
              href={shoutoutUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={`Shoutout @${item.creator.xHandle} on X`}
              className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#171717]/90 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_4px_12px_rgba(0,0,0,0.4)] backdrop-blur-md transition-transform hover:scale-105"
            >
              <XLogo className="h-3 w-3 fill-current" />
            </a>
          </div>

          {/* Bottom overlay (.tile-foot): Creator X avatar & X link on left, CMK badge on right */}
          <div className="pointer-events-none absolute inset-x-3.5 bottom-3.5 z-20 flex h-[30px] items-center justify-between">
            <a
              href={media.xLink}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={`Open @${media.handle} on X`}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full pr-2.5 transition-transform duration-200 hover:scale-105"
            >
              <span
                className="relative inline-flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-full font-mono text-[11px] font-semibold uppercase text-white shadow-[0_0_0_1px_rgba(255,255,255,0.22),0_2px_8px_rgba(0,0,0,0.45)]"
                style={{ background: avatarBg }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={media.avatarUrl}
                  alt={`@${media.handle}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#171717]/90 px-2.5 py-1 font-mono text-[11px] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1)] backdrop-blur-md">
                <span>@{media.handle}</span>
                <XLogo className="h-2.5 w-2.5 fill-current opacity-80" />
              </span>
            </a>

            {item.pairsWithCmk[0] && (
              <span className="rounded-full bg-[#171717]/85 px-2.5 py-1 font-mono text-[10.5px] text-[#b4b4b4] shadow-[0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-md">
                cmk:{item.pairsWithCmk[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * marked.dev-style `.ref-detail` overlay modal when clicking any visual tile.
 * Left: large visual stage. Right: 300px metadata, creator credit, tags, and actions.
 */
export function RefDetailModal({
  item,
  index = 0,
  onClose,
}: {
  item: CuratedSkillRef | null;
  index?: number;
  onClose: () => void;
}) {
  const [copiedCmd, setCopiedCmd] = useState(false);

  useEffect(() => {
    if (!item) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const shoutoutText = buildShoutoutTweet(item);
  const tweetIntentUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shoutoutText)}`;
  const avatarBg = AVATAR_GRADIENTS[getHashIndex(item.id, AVATAR_GRADIENTS.length)];

  function handleCopyCommand() {
    if (!item) return;
    const text = item.installCommand ?? item.creator.githubUrl;
    navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 1800);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-8"
      onClick={onClose}
    >
      {/* Top-right close button (.ref-detail-close) */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close detail"
        className="fixed right-5 top-5 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#202020] text-[#9a9a9a] transition-colors hover:bg-[#2a2a2a] hover:text-white"
      >
        <X size={18} />
      </button>

      {/* Stage shell (.ref-detail-stage-shell) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88vh] w-full max-w-[1060px] flex-col items-center gap-8 overflow-y-auto md:flex-row md:items-stretch md:justify-center md:gap-11"
      >
        {/* Left/Center Media Stage (.ref-detail-stage) */}
        <div className="flex w-full max-w-[640px] flex-1 flex-col justify-center">
          <div className="overflow-hidden rounded-[28px] shadow-[0_12px_32px_rgba(0,0,0,0.45),0_2px_6px_rgba(0,0,0,0.3)] outline outline-1 -outline-offset-1 outline-white/[0.08]">
            <TileVisualArtwork item={item} index={index} large />
          </div>
        </div>

        {/* Right Side Panel (.ref-detail-side, width 300px) */}
        <div className="flex w-full shrink-0 flex-col justify-between gap-6 md:w-[310px]">
          <div className="space-y-5 overflow-y-auto pr-1">
            <div>
              <h2 className="text-[20px] font-medium leading-[25px] tracking-[-0.015em] text-white">
                {item.title}
              </h2>

              {/* Creator credit row (.ref-detail-credit) */}
              <div className="mt-3 flex items-center gap-2">
                <a
                  href={resolveRefXLink(item)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[13.5px] font-medium text-white hover:underline"
                >
                  <span
                    className="relative inline-flex h-[22px] w-[22px] items-center justify-center overflow-hidden rounded-full font-mono text-[10px] font-semibold uppercase text-white"
                    style={{ background: avatarBg }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveRefAvatar(item)}
                      alt={`@${item.creator.xHandle}`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span>{item.creator.name}</span>
                  <VerifiedBadge />
                </a>
                <span className="font-mono text-[12px] text-[#8a8a8a]">
                  @{item.creator.xHandle}
                </span>
              </div>
            </div>

            {/* Description (.ref-detail-text) */}
            <p className="text-[13.5px] leading-[20px] text-[#b4b4b4]">
              {item.tagline}
            </p>

            {/* Install command box */}
            {item.installCommand && (
              <div className="space-y-1.5">
                <div className="text-[11.5px] font-medium text-[#8a8a8a]">
                  Install Command
                </div>
                <div className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.06] px-3 py-2.5 font-mono text-[12px] text-white">
                  <code className="truncate">$ {item.installCommand}</code>
                  <button
                    type="button"
                    onClick={handleCopyCommand}
                    className="shrink-0 text-[#9a9a9a] hover:text-white"
                  >
                    {copiedCmd ? <Check size={14} className="text-[#c3e88d]" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}

            {/* Tag Groups (.ref-detail-tag-groups) */}
            <div className="space-y-3 pt-1">
              {item.pairsWithCmk.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11.5px] font-medium text-[#8a8a8a]">
                    Pairs with CMK Skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.pairsWithCmk.map((cmkId) => (
                      <Link
                        key={cmkId}
                        href={`/skills/${cmkId}`}
                        onClick={onClose}
                        className="inline-flex h-[26px] items-center rounded-full bg-white/[0.08] px-2.5 font-mono text-[12px] text-white transition-colors hover:bg-white/[0.15]"
                      >
                        cmk:{cmkId}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="text-[11.5px] font-medium text-[#8a8a8a]">
                  Collection & Provenance
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex h-[26px] items-center rounded-full bg-white/[0.08] px-2.5 text-[12px] text-[#b4b4b4]">
                    {item.collectionId}
                  </span>
                  {item.pinnedSha && (
                    <span className="inline-flex h-[26px] items-center rounded-full bg-white/[0.08] px-2.5 font-mono text-[11.5px] text-[#c3e88d]">
                      SHA:{item.pinnedSha}
                    </span>
                  )}
                  <span className="inline-flex h-[26px] items-center rounded-full bg-white/[0.08] px-2.5 font-mono text-[11.5px] text-[#b4b4b4]">
                    Vetted {item.vettedAt}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Row (.ref-detail-top + .ref-detail-footer-actions) */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleCopyCommand}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 text-[13px] font-medium text-[#141413] transition-colors hover:bg-[#e5e5e3]"
            >
              {copiedCmd ? (
                <>
                  <Check size={15} />
                  <span>Copied Command</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>{item.installCommand ? "Copy npx skills add" : "Copy Repo URL"}</span>
                </>
              )}
            </button>

            <a
              href={tweetIntentUrl}
              target="_blank"
              rel="noreferrer"
              title={`Shoutout @${item.creator.xHandle} on X`}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.1] text-white transition-colors hover:bg-white/[0.16]"
            >
              <XLogo className="h-4 w-4 fill-current" />
            </a>

            <a
              href={item.creator.githubUrl}
              target="_blank"
              rel="noreferrer"
              title={`Open ${item.creator.githubRepo} on GitHub`}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.1] text-white transition-colors hover:bg-white/[0.16]"
            >
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CuratedSkillCard({
  item,
  collectionTitle,
}: {
  item: CuratedSkillRef;
  collectionTitle?: string;
}) {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const shoutoutText = buildShoutoutTweet(item);
  const tweetIntentUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shoutoutText)}`;

  function handleCopyCmd() {
    if (!item.installCommand) return;
    navigator.clipboard.writeText(item.installCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 1800);
  }

  return (
    <article className="group flex flex-col justify-between gap-4 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition-colors duration-200 hover:border-[var(--border-strong)]">
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <a
              href={item.creator.xUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] font-mono text-[12px] font-semibold uppercase text-[var(--text-primary)]"
              title={`@${item.creator.xHandle} on X`}
            >
              {item.creator.xHandle.slice(0, 2)}
            </a>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <a
                  href={item.creator.xUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate font-mono text-[12.5px] font-semibold text-[var(--text-primary)] hover:underline"
                >
                  @{item.creator.xHandle}
                </a>
                <VerifiedBadge />
              </div>
              <p className="truncate text-[11.5px] text-[var(--text-tertiary)]">
                {item.creator.githubRepo}
                {collectionTitle ? ` · ${collectionTitle}` : ""}
              </p>
            </div>
          </div>

          <a
            href={item.creator.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${item.creator.githubRepo} on GitHub`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-tertiary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
          >
            <GitBranch size={13} />
          </a>
        </div>

        <div>
          <h3 className="text-[15.5px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
            {item.title}
          </h3>
          <p className="mt-1.5 text-[13.5px] leading-[1.6] text-[var(--text-secondary)]">
            {item.tagline}
          </p>
        </div>

        {item.pairsWithCmk.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="font-mono text-[11px] text-[var(--text-tertiary)]">Pairs with:</span>
            {item.pairsWithCmk.map((cmkId) => (
              <Link
                key={cmkId}
                href={`/skills/${cmkId}`}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-base)] px-2.5 py-0.5 font-mono text-[11.5px] text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)]"
              >
                cmk:{cmkId}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 border-t border-[var(--border-subtle)] pt-3.5">
        {item.installCommand ? (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 font-mono text-[12px]">
            <code className="min-w-0 truncate text-[var(--text-secondary)]">
              <span className="select-none text-[var(--text-tertiary)]">$ </span>
              {item.installCommand}
            </code>
            <button
              type="button"
              onClick={handleCopyCmd}
              className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              {copiedCmd ? <Check size={12} className="text-[#C3E88D]" /> : <Copy size={12} />}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 font-mono text-[11.5px] text-[var(--text-tertiary)]">
            <Sparkles size={12} className="shrink-0" />
            <span className="truncate">{item.installNote ?? "Companion tool"}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <a
            href={tweetIntentUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-3 text-[12px] font-medium text-black transition-opacity hover:opacity-90"
          >
            <XLogo className="h-3 w-3 fill-current" />
            <span>Shoutout @{item.creator.xHandle}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
