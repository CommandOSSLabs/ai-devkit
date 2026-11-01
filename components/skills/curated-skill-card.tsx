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
  type SocialPlatform,
} from "@/lib/skill-collections";
import { useResolvedXMedia } from "@/lib/use-x-thumbnail";

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className ?? "h-3.5 w-3.5 fill-current"}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SocialPlatformIcon({
  platform,
  className,
}: {
  platform?: SocialPlatform;
  className?: string;
}) {
  const cls = className ?? "h-3 w-3 fill-current";
  if (platform === "threads") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={cls}>
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.34-.774-.963-1.391-1.855-1.842-.202 1.385-.662 2.487-1.396 3.314-1.016 1.145-2.464 1.77-4.187 1.808-1.38.03-2.559-.356-3.41-1.116-.887-.792-1.367-1.884-1.351-3.075.033-2.435 1.987-4.195 4.863-4.38 1.095-.07 2.138.046 3.103.346-.096-.834-.376-1.464-.838-1.882-.547-.495-1.368-.75-2.441-.758h-.033c-1.26 0-2.29.442-2.977 1.278l-1.641-1.35c1.087-1.323 2.688-2.024 4.63-2.024h.05c3.274.024 5.268 1.976 5.39 5.252.008.21.007.422-.001.635 1.246.63 2.185 1.545 2.724 2.775.792 1.807.828 4.566-1.435 6.783-1.848 1.812-4.14 2.607-7.442 2.633zm-.398-8.983c-1.763.113-2.796.973-2.815 2.345-.01.662.238 1.213.719 1.592.478.377 1.166.564 1.99.546 1.158-.025 2.083-.42 2.75-1.174.477-.539.8-1.277.967-2.204-.883-.3-1.855-.423-2.893-.365l-.718.06z" />
      </svg>
    );
  }
  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={cls}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={cls}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (platform === "youtube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={cls}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  return <XLogo className={cls} />;
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
            <span
              title={`Source: ${media.platformLabel}`}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.08] text-white/85"
            >
              <SocialPlatformIcon platform={media.platform} className="h-2.5 w-2.5 fill-current" />
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
                    <span>{media.platformLabel} Video Post</span>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#16151d]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc}
                alt={`${item.title} ${media.platformLabel} thumbnail`}
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

              {/* Social post indicator badge */}
              <div className="pointer-events-none absolute left-2.5 top-2.5 flex items-center gap-1.5">
                {media.isStatusPost ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/65 px-2 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-md">
                    <span>{media.platformLabel} Post Media</span>
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
    const text = item.stylePrompt ?? item.installCommand ?? item.creator.githubUrl;
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
              title={
                item.stylePrompt
                  ? "Copy UI/UX Style Prompt"
                  : item.installCommand
                    ? `Copy: ${item.installCommand}`
                    : "Copy repo URL"
              }
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
                  <span>
                    {item.stylePrompt
                      ? "Copy Style"
                      : item.installCommand
                        ? "npx add"
                        : "Copy"}
                  </span>
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
                <SocialPlatformIcon
                  platform={media.platform}
                  className="h-2.5 w-2.5 fill-current opacity-80"
                />
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
  const [copiedStyle, setCopiedStyle] = useState(false);

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

  function handleCopyStylePrompt() {
    if (!item?.stylePrompt) return;
    navigator.clipboard.writeText(item.stylePrompt);
    setCopiedStyle(true);
    setTimeout(() => setCopiedStyle(false), 1800);
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

            {/* UI/UX Style Prompt box */}
            {item.stylePrompt && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-medium text-[#8a8a8a]">
                    UI/UX Style Prompt
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyStylePrompt}
                    className="inline-flex items-center gap-1 rounded-full bg-white/[0.08] px-2.5 py-0.5 font-mono text-[11px] text-white hover:bg-white/[0.15]"
                  >
                    {copiedStyle ? (
                      <>
                        <Check size={12} className="text-[#c3e88d]" />
                        <span className="text-[#c3e88d]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="max-h-[110px] overflow-y-auto rounded-xl bg-white/[0.06] p-3 font-mono text-[11.5px] leading-[1.55] text-[#d4d4d4]">
                  {item.stylePrompt}
                </div>
              </div>
            )}

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
