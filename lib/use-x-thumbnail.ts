"use client";

import { useEffect, useState } from "react";
import {
  type CuratedSkillRef,
  type SocialPlatform,
  getSocialPlatformLabel,
  resolveRefAvatar,
  resolveRefFallbackThumbnail,
  resolveRefHandle,
  resolveRefPlatform,
  resolveRefPostUrl,
  resolveRefThumbnail,
  resolveRefVideoUrl,
  resolveRefXLink,
} from "@/lib/skill-collections";
import type { XThumbnailResponse } from "@/app/api/x-thumbnail/route";

export interface ResolvedXMedia {
  platform: SocialPlatform;
  platformLabel: string;
  thumbnailUrl: string;
  fallbackThumbnailUrl: string;
  avatarUrl: string;
  videoUrl: string | null;
  xLink: string;
  handle: string;
  isStatusPost: boolean;
  loading: boolean;
}

const memoryCache = new Map<string, XThumbnailResponse>();

export function useResolvedXMedia(ref: CuratedSkillRef): ResolvedXMedia {
  const platform = resolveRefPlatform(ref);
  const platformLabel = getSocialPlatformLabel(platform);
  const xLink = resolveRefXLink(ref);
  const postUrl = resolveRefPostUrl(ref);
  const isStatusPost = Boolean(
    postUrl ||
      /\/status(?:es)?\/\d+|\/post\/|\/reel\/|\/p\/|\/videos\/|watch\?v=/i.test(xLink),
  );
  const staticThumb = ref.source?.thumbnailUrl ?? ref.thumbnailUrl;
  const staticAvatar = ref.source?.avatarUrl ?? ref.xAvatarUrl;
  const staticVideo = resolveRefVideoUrl(ref);
  const initialThumb = resolveRefThumbnail(ref);
  const fallbackThumb = resolveRefFallbackThumbnail(ref);
  const initialAvatar = resolveRefAvatar(ref);

  const [dynamicData, setDynamicData] = useState<XThumbnailResponse | null>(() => {
    return memoryCache.get(xLink) ?? null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Automatically resolve social media (X, Threads, Instagram, Facebook, YouTube, Web)
    // whenever a postUrl is provided or static thumbnail/avatar fields are omitted.
    const needsLiveFetch =
      !staticThumb ||
      !staticAvatar ||
      (isStatusPost && platform === "x" && (!staticVideo || !staticThumb.includes("twimg.com")));

    if (!needsLiveFetch) return;
    const cached = memoryCache.get(xLink);
    if (cached) {
      setDynamicData(cached);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams({ url: xLink });
    if (ref.creator.githubRepo) {
      params.set("repo", ref.creator.githubRepo);
    }

    fetch(`/api/x-thumbnail?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: XThumbnailResponse | null) => {
        if (cancelled || !data?.ok) return;
        memoryCache.set(xLink, data);
        setDynamicData(data);
      })
      .catch(() => {
        // Ignore network errors and keep static fallback
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    xLink,
    isStatusPost,
    platform,
    staticThumb,
    staticAvatar,
    staticVideo,
    ref.creator.githubRepo,
  ]);

  return {
    platform: dynamicData?.platform || platform,
    platformLabel: getSocialPlatformLabel(dynamicData?.platform || platform),
    thumbnailUrl: dynamicData?.thumbnailUrl || initialThumb,
    fallbackThumbnailUrl: dynamicData?.bannerUrl || fallbackThumb,
    avatarUrl: dynamicData?.avatarUrl || initialAvatar,
    videoUrl: dynamicData?.videoUrl || staticVideo || null,
    xLink,
    handle: dynamicData?.handle || resolveRefHandle(ref),
    isStatusPost,
    loading,
  };
}
