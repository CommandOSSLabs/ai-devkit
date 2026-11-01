import { NextRequest, NextResponse } from "next/server";
import { detectSocialPlatform, type SocialPlatform } from "@/lib/skill-collections";

export interface XThumbnailResponse {
  ok: boolean;
  platform?: SocialPlatform;
  xUrl: string;
  handle: string | null;
  statusId: string | null;
  authorName: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  text: string | null;
  installCommand?: string | null;
  githubRepo?: string | null;
  likes?: number | null;
  bookmarks?: number | null;
  views?: number | null;
}

const REVALIDATE_SECONDS = 3600;

function pickOptimalMp4Url(videoMedia: {
  url?: string;
  formats?: Array<{ url?: string; container?: string; bitrate?: number }>;
} | null): string | null {
  if (!videoMedia) return null;
  const mp4Formats = (videoMedia.formats ?? []).filter(
    (f) => f.container === "mp4" && typeof f.url === "string",
  );
  if (mp4Formats.length > 0) {
    const preferred =
      mp4Formats.find((f) => (f.bitrate ?? 0) >= 1500000 && (f.bitrate ?? 0) <= 4500000) ??
      mp4Formats[Math.min(mp4Formats.length - 1, 2)] ??
      mp4Formats[0];
    if (preferred?.url) return preferred.url;
  }
  return videoMedia.url ?? null;
}

function extractSkillInstallInfo(text: string | null | undefined): {
  installCommand: string | null;
  githubRepo: string | null;
} {
  if (!text) return { installCommand: null, githubRepo: null };
  const cmdMatch = text.match(/npx\s+skills\s+add\s+([^\s\n]+)(?:\s+--skill\s+([^\s\n]+))?/i);
  if (cmdMatch) {
    const fullCmd = cmdMatch[0].trim();
    const repoCandidate = cmdMatch[1]?.replace(/^https?:\/\/github\.com\//i, "").trim() ?? null;
    return {
      installCommand: fullCmd,
      githubRepo: repoCandidate && repoCandidate.includes("/") ? repoCandidate : null,
    };
  }
  return { installCommand: null, githubRepo: null };
}

function upgradeTwimgAvatar(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.replace(/_(normal|bigger|200x200)\.(jpg|jpeg|png|webp)$/i, "_400x400.$2");
}

function parseXUrl(rawUrl: string): { handle: string | null; statusId: string | null } {
  try {
    const trimmed = rawUrl.trim();
    if (!trimmed) return { handle: null, statusId: null };
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(normalized);
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();
    if (host !== "x.com" && host !== "twitter.com" && host !== "fxtwitter.com" && host !== "vxtwitter.com") {
      return { handle: null, statusId: null };
    }
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return { handle: null, statusId: null };

    // Handle /i/status/<id> or /<handle>/status/<id>
    if (parts[0] === "i" && parts[1] === "status" && parts[2]) {
      return { handle: null, statusId: parts[2] };
    }
    const handle = parts[0]?.replace(/^@/, "") || null;
    if ((parts[1] === "status" || parts[1] === "statuses") && parts[2]) {
      return { handle, statusId: parts[2] };
    }
    if (handle && !["home", "explore", "search", "intent", "i", "settings"].includes(handle.toLowerCase())) {
      return { handle, statusId: null };
    }
    return { handle: null, statusId: null };
  } catch {
    return { handle: null, statusId: null };
  }
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractMetaTag(html: string, keys: string[]): string | null {
  for (const key of keys) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const m1 = html.match(
      new RegExp(
        `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`,
        "i",
      ),
    );
    if (m1?.[1]) return decodeHtmlEntities(m1[1].trim());
    const m2 = html.match(
      new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`,
        "i",
      ),
    );
    if (m2?.[1]) return decodeHtmlEntities(m2[1].trim());
  }
  return null;
}

function parseGenericSocialHandle(rawUrl: string, platform: SocialPlatform): string | null {
  try {
    const normalized = /^https?:\/\//i.test(rawUrl.trim()) ? rawUrl.trim() : `https://${rawUrl.trim()}`;
    const url = new URL(normalized);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return null;
    if (platform === "threads") {
      const first = parts[0]?.replace(/^@/, "");
      return first && first !== "t" ? first : null;
    }
    if (platform === "instagram") {
      const first = parts[0]?.replace(/^@/, "");
      if (first && !["p", "reel", "reels", "tv", "stories", "explore"].includes(first.toLowerCase())) {
        return first;
      }
      return null;
    }
    if (platform === "facebook") {
      const first = parts[0]?.replace(/^@/, "");
      if (first && !["watch", "reel", "share", "photo", "permalink.php", "story.php"].includes(first.toLowerCase())) {
        return first;
      }
      return null;
    }
    if (platform === "github") {
      return parts[0] ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

async function resolveNonXSocialMedia(
  rawUrl: string,
  platform: SocialPlatform,
  repoParam: string,
): Promise<XThumbnailResponse | null> {
  try {
    const normalized = /^https?:\/\//i.test(rawUrl.trim()) ? rawUrl.trim() : `https://${rawUrl.trim()}`;
    const url = new URL(normalized);
    const handle = parseGenericSocialHandle(normalized, platform);
    const unavatarProvider =
      platform === "threads" ? "instagram" : platform === "web" ? "x" : platform;
    const fallbackAvatar = handle ? `https://unavatar.io/${unavatarProvider}/${handle}` : null;

    // Special fast path for YouTube URLs
    if (platform === "youtube") {
      const videoId =
        url.hostname === "youtu.be"
          ? url.pathname.split("/").filter(Boolean)[0]
          : url.searchParams.get("v");
      if (videoId) {
        return {
          ok: true,
          platform,
          xUrl: normalized,
          handle: handle ?? "youtube",
          statusId: videoId,
          authorName: null,
          avatarUrl: fallbackAvatar,
          bannerUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
          videoUrl: null,
          text: null,
        };
      }
    }

    const res = await fetch(normalized, {
      headers: {
        // Social platforms (Facebook, Instagram, Threads) serve full OpenGraph meta tags to link preview bots
        "User-Agent":
          "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php) Mozilla/5.0 (compatible; CommandOSSBot/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    let thumbnailUrl: string | null = null;
    let videoUrl: string | null = null;
    let title: string | null = null;
    let description: string | null = null;

    if (res.ok) {
      const html = await res.text();
      const rawThumb = extractMetaTag(html, ["og:image:secure_url", "og:image", "twitter:image"]);
      if (rawThumb) {
        thumbnailUrl = /^https?:\/\//i.test(rawThumb) ? rawThumb : new URL(rawThumb, normalized).toString();
      }
      const rawVideo = extractMetaTag(html, ["og:video:secure_url", "og:video:url", "og:video", "twitter:player:stream"]);
      if (rawVideo && /\.(mp4|mov|webm)(\?|$)/i.test(rawVideo)) {
        videoUrl = /^https?:\/\//i.test(rawVideo) ? rawVideo : new URL(rawVideo, normalized).toString();
      }
      title = extractMetaTag(html, ["og:title", "twitter:title"]);
      description = extractMetaTag(html, ["og:description", "twitter:description", "description"]);
    }

    if (!thumbnailUrl && repoParam) {
      const cleanRepo = repoParam.replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "");
      if (cleanRepo.includes("/")) {
        thumbnailUrl = `https://opengraph.githubassets.com/1/${cleanRepo}`;
      }
    }

    if (!thumbnailUrl && !videoUrl && !fallbackAvatar) {
      return null;
    }

    const combinedText = [title, description].filter(Boolean).join(" — ") || null;
    const { installCommand, githubRepo } = extractSkillInstallInfo(combinedText);

    return {
      ok: true,
      platform,
      xUrl: normalized,
      handle,
      statusId: null,
      authorName: title,
      avatarUrl: fallbackAvatar,
      bannerUrl: thumbnailUrl,
      thumbnailUrl: thumbnailUrl ?? fallbackAvatar,
      videoUrl,
      text: description ?? title,
      installCommand,
      githubRepo,
    };
  } catch {
    return null;
  }
}

async function fetchOgImage(targetUrl: string): Promise<string | null> {
  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CommandOSSBot/1.0)",
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match =
      html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/i);
    if (!match?.[1]) return null;
    const raw = match[1].trim();
    if (/^https?:\/\//i.test(raw)) return raw;
    return new URL(raw, targetUrl).toString();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url")?.trim() ?? "";
  const repoParam = request.nextUrl.searchParams.get("repo")?.trim() ?? "";
  const platform = detectSocialPlatform(rawUrl);
  const { handle, statusId } = parseXUrl(rawUrl);

  const empty: XThumbnailResponse = {
    ok: false,
    platform,
    xUrl: rawUrl,
    handle,
    statusId,
    authorName: null,
    avatarUrl: handle ? `https://unavatar.io/x/${handle}` : null,
    bannerUrl: null,
    thumbnailUrl: null,
    videoUrl: null,
    text: null,
  };

  if (platform !== "x" && rawUrl) {
    const resolved = await resolveNonXSocialMedia(rawUrl, platform, repoParam);
    if (resolved) {
      return NextResponse.json(resolved, {
        headers: {
          "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 4}`,
        },
      });
    }
    return NextResponse.json(empty, { status: 404 });
  }

  if (!handle && !statusId) {
    return NextResponse.json(empty, { status: 400 });
  }

  try {
    if (statusId) {
      const apiPath = handle ? `${handle}/status/${statusId}` : `i/status/${statusId}`;
      const res = await fetch(`https://api.fxtwitter.com/${apiPath}`, {
        headers: { Accept: "application/json" },
        next: { revalidate: REVALIDATE_SECONDS },
      });

      if (res.ok) {
        const data = await res.json();
        const tweet = data?.tweet;
        if (tweet) {
          const author = tweet.author ?? {};
          const resolvedHandle = author.screen_name ?? handle;
          const avatarUrl = upgradeTwimgAvatar(author.avatar_url) ?? (resolvedHandle ? `https://unavatar.io/x/${resolvedHandle}` : null);
          const bannerUrl: string | null = author.banner_url ?? null;

          const primaryMedia = tweet.media?.all?.[0] ?? tweet.quote?.media?.all?.[0] ?? null;
          const videoMedia = tweet.media?.videos?.[0] ?? tweet.quote?.media?.videos?.[0] ?? null;
          let thumbnailUrl: string | null =
            primaryMedia?.thumbnail_url ??
            primaryMedia?.url ??
            tweet.media?.mosaic?.formats?.jpeg ??
            null;

          if (!thumbnailUrl && repoParam) {
            const cleanRepo = repoParam.replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "");
            if (cleanRepo.includes("/")) {
              thumbnailUrl =
                (await fetchOgImage(`https://github.com/${cleanRepo}`)) ??
                `https://opengraph.githubassets.com/1/${cleanRepo}`;
            }
          }

          if (!thumbnailUrl) {
            thumbnailUrl = bannerUrl ?? avatarUrl;
          }

          const tweetText: string | null = tweet.text ?? null;
          const { installCommand, githubRepo } = extractSkillInstallInfo(tweetText);

          const payload: XThumbnailResponse = {
            ok: true,
            xUrl: tweet.url ?? rawUrl,
            handle: resolvedHandle,
            statusId,
            authorName: author.name ?? null,
            avatarUrl,
            bannerUrl,
            thumbnailUrl,
            videoUrl: pickOptimalMp4Url(videoMedia),
            text: tweetText,
            installCommand,
            githubRepo,
            likes: typeof tweet.likes === "number" ? tweet.likes : null,
            bookmarks: typeof tweet.bookmarks === "number" ? tweet.bookmarks : null,
            views: typeof tweet.views === "number" ? tweet.views : null,
          };

          return NextResponse.json(payload, {
            headers: {
              "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 4}`,
            },
          });
        }
      }
    }

    if (handle) {
      const res = await fetch(`https://api.fxtwitter.com/${handle}`, {
        headers: { Accept: "application/json" },
        next: { revalidate: REVALIDATE_SECONDS },
      });

      if (res.ok) {
        const data = await res.json();
        const user = data?.user;
        if (user) {
          const avatarUrl = upgradeTwimgAvatar(user.avatar_url) ?? `https://unavatar.io/x/${handle}`;
          const bannerUrl: string | null = user.banner_url ?? null;
          let thumbnailUrl: string | null = null;

          if (repoParam) {
            const cleanRepo = repoParam.replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "");
            if (cleanRepo.includes("/")) {
              thumbnailUrl =
                (await fetchOgImage(`https://github.com/${cleanRepo}`)) ??
                `https://opengraph.githubassets.com/1/${cleanRepo}`;
            }
          }

          if (!thumbnailUrl && user.website?.url) {
            thumbnailUrl = await fetchOgImage(user.website.url);
          }

          if (!thumbnailUrl) {
            thumbnailUrl = bannerUrl ?? avatarUrl;
          }

          const payload: XThumbnailResponse = {
            ok: true,
            xUrl: user.url ?? `https://x.com/${handle}`,
            handle: user.screen_name ?? handle,
            statusId: null,
            authorName: user.name ?? null,
            avatarUrl,
            bannerUrl,
            thumbnailUrl,
            videoUrl: null,
            text: user.description ?? null,
          };

          return NextResponse.json(payload, {
            headers: {
              "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 4}`,
            },
          });
        }
      }
    }

    return NextResponse.json(empty, { status: 404 });
  } catch {
    return NextResponse.json(empty, { status: 500 });
  }
}
