import { NextRequest, NextResponse } from "next/server";

export interface XThumbnailResponse {
  ok: boolean;
  xUrl: string;
  handle: string | null;
  statusId: string | null;
  authorName: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  text: string | null;
}

const REVALIDATE_SECONDS = 3600;

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
  const { handle, statusId } = parseXUrl(rawUrl);

  const empty: XThumbnailResponse = {
    ok: false,
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

          const payload: XThumbnailResponse = {
            ok: true,
            xUrl: tweet.url ?? rawUrl,
            handle: resolvedHandle,
            statusId,
            authorName: author.name ?? null,
            avatarUrl,
            bannerUrl,
            thumbnailUrl,
            videoUrl: videoMedia?.url ?? null,
            text: tweet.text ?? null,
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
