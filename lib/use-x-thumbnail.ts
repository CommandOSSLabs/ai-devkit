"use client";

import { useEffect, useState } from "react";
import {
  type CuratedSkillRef,
  resolveRefAvatar,
  resolveRefFallbackThumbnail,
  resolveRefThumbnail,
  resolveRefXLink,
} from "@/lib/skill-collections";
import type { XThumbnailResponse } from "@/app/api/x-thumbnail/route";

export interface ResolvedXMedia {
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
  const xLink = resolveRefXLink(ref);
  const isStatusPost = /\/status(?:es)?\/\d+/i.test(xLink);
  const initialThumb = resolveRefThumbnail(ref);
  const fallbackThumb = resolveRefFallbackThumbnail(ref);
  const initialAvatar = resolveRefAvatar(ref);

  const [dynamicData, setDynamicData] = useState<XThumbnailResponse | null>(() => {
    return memoryCache.get(xLink) ?? null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch live X thumbnail if the ref has no explicit thumbnailUrl yet or is a status post without a pbs.twimg thumbnail
    const needsLiveFetch =
      !ref.thumbnailUrl || (isStatusPost && !ref.thumbnailUrl.includes("twimg.com"));

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
  }, [xLink, isStatusPost, ref.thumbnailUrl, ref.creator.githubRepo]);

  return {
    thumbnailUrl: dynamicData?.thumbnailUrl || initialThumb,
    fallbackThumbnailUrl: dynamicData?.bannerUrl || fallbackThumb,
    avatarUrl: dynamicData?.avatarUrl || initialAvatar,
    videoUrl: dynamicData?.videoUrl || ref.xVideoUrl || null,
    xLink,
    handle: dynamicData?.handle || ref.creator.xHandle.replace(/^@/, ""),
    isStatusPost,
    loading,
  };
}
