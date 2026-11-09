import {
  detectSocialPlatform,
  type CuratedSkillSource,
  type SocialPlatform,
} from "@/lib/skill-collections";
import type { StoredSkillRef } from "@/lib/collections-store";

export interface AutoEnrichInput {
  url: string;
  customThumbnailUrl?: string;
  collectionId?: string;
}

export interface AutoEnrichResult {
  ref: StoredSkillRef;
  detectedPlatform: SocialPlatform;
  warnings: string[];
}

interface GithubEnrichment {
  owner: string;
  repo: string;
  githubRepo: string;
  githubUrl: string;
  title: string | null;
  description: string | null;
  starsLabel: string | null;
  avatarUrl: string | null;
  readmeImageUrl: string | null;
  ogImageUrl: string;
  installCommand: string;
  skillName: string | null;
  defaultBranch: string;
}

const REQUEST_TIMEOUT_MS = 8000;

function fetchWithTimeout(
  url: string,
  init?: RequestInit & { next?: { revalidate?: number } },
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, {
    ...init,
    signal: controller.signal,
  }).finally(() => clearTimeout(timer));
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function formatCompactCount(value: number | null | undefined): string | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `${value}`;
}

function formatEngagementStats(stats: {
  likes?: number | null;
  bookmarks?: number | null;
  views?: number | null;
}): string | undefined {
  const parts: string[] = [];
  const likes = formatCompactCount(stats.likes);
  const bookmarks = formatCompactCount(stats.bookmarks);
  const views = formatCompactCount(stats.views);

  if (likes && (stats.likes ?? 0) > 0) {
    parts.push(`${likes} likes`);
  }
  if (bookmarks && (stats.bookmarks ?? 0) > 0) {
    parts.push(`${bookmarks} bookmarks`);
  }
  if (views && (stats.views ?? 0) > 0) {
    parts.push(`${views} views`);
  }

  if (parts.length > 2) {
    return `${parts[0]} · ${parts[parts.length - 1]}`;
  }
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

function upgradeTwimgAvatar(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  return url.replace(/_(normal|bigger|mini|200x200)\.(jpg|jpeg|png|webp)$/i, "_400x400.$2");
}

function pickOptimalMp4Url(
  videoMedia: {
    url?: string;
    formats?: Array<{ url?: string; container?: string; bitrate?: number }>;
  } | null | undefined,
): string | undefined {
  if (!videoMedia) return undefined;
  const mp4Formats = (videoMedia.formats ?? []).filter(
    (f) =>
      (f.container === "mp4" || (typeof f.url === "string" && /\.mp4(\?|$)/i.test(f.url))) &&
      typeof f.url === "string",
  );
  if (mp4Formats.length > 0) {
    const inBand = mp4Formats
      .filter((f) => (f.bitrate ?? 0) >= 1_200_000 && (f.bitrate ?? 0) <= 4_500_000)
      .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));
    const preferred =
      inBand[0] ??
      mp4Formats[Math.min(mp4Formats.length - 1, 2)] ??
      mp4Formats[0];
    if (preferred?.url) return preferred.url;
  }
  return videoMedia.url ?? undefined;
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

function extractHtmlTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match?.[1]) return null;
  return decodeHtmlEntities(match[1].replace(/\s+/g, " ").trim());
}

function parseXUrl(rawUrl: string): { handle: string | null; statusId: string | null } {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();
    if (
      host !== "x.com" &&
      host !== "twitter.com" &&
      host !== "fxtwitter.com" &&
      host !== "vxtwitter.com" &&
      !host.endsWith(".twitter.com") &&
      !host.endsWith(".x.com")
    ) {
      return { handle: null, statusId: null };
    }
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return { handle: null, statusId: null };

    if (parts[0] === "i" && (parts[1] === "status" || parts[1] === "statuses") && parts[2]) {
      return { handle: null, statusId: parts[2] };
    }
    const handle = parts[0]?.replace(/^@/, "") || null;
    if ((parts[1] === "status" || parts[1] === "statuses") && parts[2]) {
      return { handle, statusId: parts[2] };
    }
    if (
      handle &&
      !["home", "explore", "search", "intent", "i", "settings", "hashtag"].includes(
        handle.toLowerCase(),
      )
    ) {
      return { handle, statusId: null };
    }
    return { handle: null, statusId: null };
  } catch {
    return { handle: null, statusId: null };
  }
}

const RESERVED_GITHUB_OWNERS = new Set([
  "features",
  "marketplace",
  "explore",
  "topics",
  "trending",
  "collections",
  "events",
  "sponsors",
  "settings",
  "orgs",
  "organizations",
  "pricing",
  "login",
  "join",
  "about",
  "security",
  "search",
  "pulls",
  "issues",
  "notifications",
]);

function parseGithubOwnerRepo(rawUrlOrPath: string): { owner: string; repo: string } | null {
  try {
    const trimmed = rawUrlOrPath.trim();
    let pathname = trimmed;
    if (/^https?:\/\//i.test(trimmed)) {
      const parsed = new URL(trimmed);
      const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
      if (host !== "github.com" && !host.endsWith(".github.com")) {
        return null;
      }
      pathname = parsed.pathname;
    } else if (/^github\.com\//i.test(trimmed)) {
      pathname = trimmed.replace(/^github\.com\//i, "");
    }

    const parts = pathname
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length < 2) return null;

    const owner = parts[0]!.replace(/^@/, "");
    const repo = parts[1]!
      .replace(/\.git$/i, "")
      .replace(/[?#),.;:'"]+$/g, "");

    if (!owner || !repo) return null;
    if (RESERVED_GITHUB_OWNERS.has(owner.toLowerCase())) return null;
    if (!/^[a-zA-Z0-9._-]+$/.test(owner) || !/^[a-zA-Z0-9._-]+$/.test(repo)) {
      return null;
    }

    return { owner, repo };
  } catch {
    return null;
  }
}

function extractInstallAndGithubFromText(text: string): {
  installCommand: string | null;
  skillFlag: string | null;
  githubMatch: { owner: string; repo: string } | null;
} {
  if (!text) {
    return { installCommand: null, skillFlag: null, githubMatch: null };
  }

  let installCommand: string | null = null;
  let skillFlag: string | null = null;
  let githubMatch: { owner: string; repo: string } | null = null;

  const npxSkillsMatch = text.match(
    /npx\s+skills\s+add\s+([^\s\n"'`]+)(?:\s+--skill\s+([^\s\n"'`]+))?/i,
  );
  if (npxSkillsMatch) {
    installCommand = npxSkillsMatch[0].trim();
    skillFlag = npxSkillsMatch[2]?.trim() ?? null;
    const target = npxSkillsMatch[1]?.trim() ?? "";
    const parsedTarget = parseGithubOwnerRepo(target);
    if (parsedTarget) {
      githubMatch = parsedTarget;
    }
  }

  if (!installCommand) {
    const otherCmdMatch = text.match(
      /(?:(?:npm\s+(?:i|install)|pnpm\s+add|yarn\s+add|bun\s+add)\s+[@a-zA-Z0-9._/-]+|git\s+clone\s+https?:\/\/github\.com\/[^\s\n"'`]+)/i,
    );
    if (otherCmdMatch) {
      installCommand = otherCmdMatch[0].trim();
    }
  }

  if (!githubMatch) {
    const ghUrlRegex = /https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)/gi;
    let match: RegExpExecArray | null;
    while ((match = ghUrlRegex.exec(text)) !== null) {
      const candidate = parseGithubOwnerRepo(`${match[1]}/${match[2]}`);
      if (candidate) {
        githubMatch = candidate;
        break;
      }
    }
  }

  if (!githubMatch) {
    const bareGhRegex = /\bgithub\.com\/([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)/gi;
    let match: RegExpExecArray | null;
    while ((match = bareGhRegex.exec(text)) !== null) {
      const candidate = parseGithubOwnerRepo(`${match[1]}/${match[2]}`);
      if (candidate) {
        githubMatch = candidate;
        break;
      }
    }
  }

  return { installCommand, skillFlag, githubMatch };
}

function parseMarkdownFrontmatterAndSummary(markdown: string): {
  name: string | null;
  title: string | null;
  description: string | null;
} {
  let body = markdown.trim();
  let fmName: string | null = null;
  let fmTitle: string | null = null;
  let fmDescription: string | null = null;

  if (body.startsWith("---")) {
    const endIdx = body.indexOf("\n---", 3);
    if (endIdx !== -1) {
      const frontmatter = body.slice(3, endIdx);
      body = body.slice(endIdx + 4).trim();

      const nameMatch = frontmatter.match(/^name:\s*["']?([^"'\n]+)["']?/m);
      if (nameMatch?.[1]) fmName = nameMatch[1].trim();

      const titleMatch = frontmatter.match(/^title:\s*["']?([^"'\n]+)["']?/m);
      if (titleMatch?.[1]) fmTitle = titleMatch[1].trim();

      const descMatch = frontmatter.match(/^description:\s*["']?([^"'\n]+)["']?/m);
      if (descMatch?.[1] && descMatch[1].trim() !== "|" && descMatch[1].trim() !== ">") {
        fmDescription = descMatch[1].trim();
      }
    }
  }

  const headingMatch = body.match(/^#\s+(.+)$/m);
  const heading = headingMatch?.[1]
    ? headingMatch[1]
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[`*_~]/g, "")
        .trim()
    : null;

  const lines = body.split("\n");
  const paragraphLines: string[] = [];
  let inCodeBlock = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    if (!line) {
      if (paragraphLines.length > 0) break;
      continue;
    }
    if (
      line.startsWith("#") ||
      line.startsWith("![") ||
      line.startsWith("[![") ||
      line.startsWith("<") ||
      line.startsWith("|") ||
      line.startsWith(">") ||
      line.startsWith("---")
    ) {
      continue;
    }
    paragraphLines.push(line);
    if (paragraphLines.join(" ").length >= 180) break;
  }

  const firstParagraph =
    paragraphLines.length > 0
      ? paragraphLines
          .join(" ")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/[`*_]/g, "")
          .replace(/\s+/g, " ")
          .trim()
      : null;

  return {
    name: fmName,
    title: fmTitle || heading,
    description: fmDescription || firstParagraph,
  };
}

function isBadgeOrIconImage(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.includes("img.shields.io") ||
    lower.includes("shields.io") ||
    lower.includes("badge.fury.io") ||
    lower.includes("/badge.svg") ||
    lower.includes("codecov.io") ||
    lower.includes("travis-ci.") ||
    lower.includes("circleci.com") ||
    lower.includes("github.com/sponsors") ||
    lower.includes("star-history.com") ||
    lower.endsWith(".svg")
  );
}

function resolveGithubReadmeImage(
  markdown: string,
  owner: string,
  repo: string,
): string | null {
  if (!markdown) return null;

  const candidates: string[] = [];
  const mdImgRegex = /!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  let match: RegExpExecArray | null;
  while ((match = mdImgRegex.exec(markdown)) !== null) {
    if (match[1]) candidates.push(match[1].trim());
  }

  const htmlImgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  while ((match = htmlImgRegex.exec(markdown)) !== null) {
    if (match[1]) candidates.push(match[1].trim());
  }

  for (const rawCandidate of candidates) {
    if (!rawCandidate || rawCandidate.startsWith("data:")) continue;
    if (isBadgeOrIconImage(rawCandidate)) continue;

    if (/^https?:\/\//i.test(rawCandidate)) {
      const ghBlobMatch = rawCandidate.match(
        /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/i,
      );
      if (ghBlobMatch) {
        return `https://github.com/${ghBlobMatch[1]}/${ghBlobMatch[2]}/raw/${ghBlobMatch[3]}/${ghBlobMatch[4]}`;
      }
      return rawCandidate;
    }

    const cleanRelative = rawCandidate
      .replace(/^\.\//, "")
      .replace(/^\/+/, "");
    if (cleanRelative) {
      return `https://github.com/${owner}/${repo}/raw/HEAD/${cleanRelative}`;
    }
  }

  return null;
}

async function fetchRawGithubFile(
  owner: string,
  repo: string,
  filePath: string,
): Promise<string | null> {
  try {
    const rawUrl = `https://github.com/${owner}/${repo}/raw/HEAD/${filePath}`;
    const res = await fetchWithTimeout(rawUrl, {
      headers: {
        "User-Agent": "CommandOSS-AutoIngest/1.0",
        Accept: "text/plain, text/markdown, */*",
      },
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text && text.trim().length > 0 ? text : null;
  } catch {
    return null;
  }
}

async function fetchGithubRepoEnrichment(
  owner: string,
  repo: string,
  warnings: string[],
): Promise<GithubEnrichment> {
  const githubRepo = `${owner}/${repo}`;
  const githubUrl = `https://github.com/${owner}/${repo}`;
  const ogImageUrl = `https://opengraph.githubassets.com/1/${owner}/${repo}`;

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "CommandOSS-AutoIngest/1.0",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const [repoRes, rootSkillMd, nestedSkillMd, readmeMd] = await Promise.all([
    fetchWithTimeout(`https://api.github.com/repos/${owner}/${repo}`, { headers }).catch(
      () => null,
    ),
    fetchRawGithubFile(owner, repo, "SKILL.md"),
    fetchRawGithubFile(owner, repo, `skills/${repo}/SKILL.md`),
    fetchRawGithubFile(owner, repo, "README.md"),
  ]);

  let apiTitle: string | null = null;
  let apiDescription: string | null = null;
  let starsLabel: string | null = null;
  let avatarUrl: string | null = `https://unavatar.io/github/${owner}`;
  let defaultBranch = "main";

  if (repoRes && repoRes.ok) {
    try {
      const repoJson = (await repoRes.json()) as {
        name?: string;
        description?: string | null;
        stargazers_count?: number;
        default_branch?: string;
        owner?: { avatar_url?: string | null };
      };
      apiTitle = repoJson.name ?? null;
      apiDescription = repoJson.description ?? null;
      if (typeof repoJson.stargazers_count === "number") {
        const formatted = formatCompactCount(repoJson.stargazers_count);
        starsLabel = `${formatted ?? repoJson.stargazers_count} stars`;
      }
      if (repoJson.owner?.avatar_url) {
        avatarUrl = repoJson.owner.avatar_url;
      }
      if (repoJson.default_branch) {
        defaultBranch = repoJson.default_branch;
      }
    } catch {
      warnings.push(`Failed to parse GitHub API response for ${githubRepo}.`);
    }
  } else if (repoRes && repoRes.status === 404) {
    warnings.push(`GitHub repository ${githubRepo} returned 404.`);
  }

  const skillMdContent = rootSkillMd ?? nestedSkillMd;
  const parsedSkill = skillMdContent
    ? parseMarkdownFrontmatterAndSummary(skillMdContent)
    : { name: null, title: null, description: null };
  const parsedReadme = readmeMd
    ? parseMarkdownFrontmatterAndSummary(readmeMd)
    : { name: null, title: null, description: null };

  const readmeImageUrl = readmeMd ? resolveGithubReadmeImage(readmeMd, owner, repo) : null;

  const combinedDocs = [skillMdContent, readmeMd].filter(Boolean).join("\n");
  const { installCommand: docInstallCmd, skillFlag } = extractInstallAndGithubFromText(combinedDocs);

  const skillName = parsedSkill.name || skillFlag || repo;
  const title = parsedSkill.title || parsedReadme.title || apiTitle || repo;
  const description =
    apiDescription || parsedSkill.description || parsedReadme.description || null;

  return {
    owner,
    repo,
    githubRepo,
    githubUrl,
    title,
    description,
    starsLabel,
    avatarUrl,
    readmeImageUrl,
    ogImageUrl,
    installCommand: docInstallCmd || `npx skills add ${owner}/${repo}`,
    skillName,
    defaultBranch,
  };
}

interface CategoryRule {
  collectionId: string;
  regex: RegExp;
  pairsWithCmk: string[];
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    collectionId: "design",
    regex:
      /\b(design|ui|ux|motion|animation|animations|interaction|interactions|gesture|gestures|spring|springs|drag|swipe|morph|typography|layout|tailwind|css)\b/i,
    pairsWithCmk: ["design", "requirements", "delivery-spec-plan"],
  },
  {
    collectionId: "3d",
    regex: /\b(3d|webgl|three(?:\.js|js)?|shader|shaders|isometric|voxel|game|gamedev)\b/i,
    pairsWithCmk: ["design", "project-layout"],
  },
  {
    collectionId: "explainers",
    regex: /\b(diagram|diagrams|architecture|explainer|explainers|video|remotion|docs)\b/i,
    pairsWithCmk: ["codebase-docs", "design", "glossary"],
  },
  {
    collectionId: "workflow",
    regex: /\b(pr|pull\s+request|git|review|workflow|workflows|test|testing|ci|deploy)\b/i,
    pairsWithCmk: ["delivery-ship", "delivery-review", "delivery-pipeline"],
  },
  {
    collectionId: "security",
    regex: /\b(security|audit|auth|permission|permissions|guardrail|guardrails)\b/i,
    pairsWithCmk: ["delivery-review", "rule"],
  },
  {
    collectionId: "vendors",
    regex: /\b(mcp|vendor|vendors|agent|agents|claude|cursor|codex)\b/i,
    pairsWithCmk: ["mcp-config", "agent-vendors"],
  },
  {
    collectionId: "memory",
    regex: /\b(memory|rag|context|database|vector)\b/i,
    pairsWithCmk: ["learn", "adr"],
  },
];

function inferCategoryAndPairings(
  corpus: string,
  preferredCollectionId?: string,
): {
  collectionId: string;
  additionalCollectionIds?: string[];
  pairsWithCmk: string[];
} {
  const matchedRules = CATEGORY_RULES.filter((rule) => rule.regex.test(corpus));

  if (matchedRules.length === 0) {
    return {
      collectionId: preferredCollectionId?.trim() || "design",
      pairsWithCmk: ["design", "requirements"],
    };
  }

  const primary = matchedRules[0]!;
  const collectionId = primary.collectionId;
  const additional = matchedRules
    .slice(1)
    .map((r) => r.collectionId)
    .filter((id) => id !== collectionId);

  if (
    preferredCollectionId?.trim() &&
    preferredCollectionId.trim() !== collectionId &&
    !additional.includes(preferredCollectionId.trim())
  ) {
    additional.unshift(preferredCollectionId.trim());
  }

  const additionalCollectionIds = additional.slice(0, 2);
  return {
    collectionId,
    ...(additionalCollectionIds.length > 0 ? { additionalCollectionIds } : {}),
    pairsWithCmk: primary.pairsWithCmk,
  };
}

function cleanTweetText(rawText: string): string {
  return rawText
    .replace(/https?:\/\/\S+/gi, "")
    .replace(
      /(?:npx\s+skills\s+add\s+\S+(?:\s+--skill\s+\S+)?|(?:npm\s+(?:i|install)|pnpm\s+add|yarn\s+add|bun\s+add)\s+\S+|git\s+clone\s+\S+)/gi,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function summarizeTweetTitle(
  cleanedText: string,
  fallbackName: string,
  authorName: string,
): string {
  if (!cleanedText) {
    return `${fallbackName} — by ${authorName}`;
  }
  const firstSentence =
    cleanedText.split(/(?<=[.!?])\s+|\s+[—–-]\s+|\n+/)[0]?.trim() || cleanedText;
  if (firstSentence.length <= 78) {
    return firstSentence;
  }
  return `${firstSentence.slice(0, 75).trim()}...`;
}

function parseGenericSocialHandle(rawUrl: string, platform: SocialPlatform): string | null {
  try {
    const url = new URL(rawUrl);
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
      if (
        first &&
        !["watch", "reel", "share", "photo", "permalink.php", "story.php"].includes(
          first.toLowerCase(),
        )
      ) {
        return first;
      }
      return null;
    }
    if (platform === "youtube") {
      const first = parts[0];
      if (first?.startsWith("@")) return first.slice(1);
      return null;
    }
    return url.hostname.replace(/^www\./i, "");
  } catch {
    return null;
  }
}

export async function autoEnrichSkillUrl(
  input: AutoEnrichInput,
): Promise<AutoEnrichResult> {
  const trimmedUrl = (input.url ?? "").trim();
  if (!trimmedUrl || !/^https?:\/\//i.test(trimmedUrl)) {
    throw new Error("Invalid URL: URL must start with http:// or https://");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmedUrl);
    if (!parsedUrl.hostname || !parsedUrl.hostname.includes(".")) {
      throw new Error("Missing valid hostname");
    }
  } catch {
    throw new Error("Invalid URL: unable to parse URL");
  }

  const warnings: string[] = [];
  const host = parsedUrl.hostname.replace(/^www\./i, "").toLowerCase();
  const detectedPlatform: SocialPlatform =
    host === "fxtwitter.com" || host === "vxtwitter.com"
      ? "x"
      : detectSocialPlatform(trimmedUrl);

  const vettedAt = new Date().toISOString().slice(0, 10);
  const customThumb = input.customThumbnailUrl?.trim() || undefined;

  // ─── 1. X / Twitter Flow ────────────────────────────────────────────────
  if (detectedPlatform === "x") {
    const { handle, statusId } = parseXUrl(trimmedUrl);
    if (!handle && !statusId) {
      throw new Error("Invalid URL: could not parse X handle or status ID");
    }

    const apiPath = statusId
      ? handle
        ? `${handle}/status/${statusId}`
        : `i/status/${statusId}`
      : `${handle}`;

    let authorName = handle || "X Creator";
    let resolvedHandle = handle || "x";
    let avatarUrl: string | undefined = handle ? `https://unavatar.io/x/${handle}` : undefined;
    let bannerUrl: string | undefined;
    let tweetText = "";
    let expandedUrlsText = "";
    let xVideoUrl: string | undefined;
    let thumbnailUrl: string | undefined;
    let engagementStats: string | undefined;
    let canonicalPostUrl: string | undefined = statusId ? trimmedUrl : undefined;

    try {
      const fxRes = await fetchWithTimeout(`https://api.fxtwitter.com/${apiPath}`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "CommandOSS-AutoIngest/1.0",
        },
      });

      if (fxRes.ok) {
        const data = await fxRes.json();
        if (statusId && data?.tweet) {
          const tweet = data.tweet;
          const author = tweet.author ?? {};
          authorName = author.name || authorName;
          resolvedHandle = author.screen_name || resolvedHandle;
          avatarUrl = upgradeTwimgAvatar(author.avatar_url) || avatarUrl;
          bannerUrl = author.banner_url || undefined;
          tweetText = tweet.raw_text?.text || tweet.text || "";
          canonicalPostUrl = tweet.url || `https://x.com/${resolvedHandle}/status/${statusId}`;

          const facetUrls: string[] = Array.isArray(tweet.raw_text?.facets)
            ? tweet.raw_text.facets
                .map((f: { replacement?: string; original?: string }) => f.replacement || f.original || "")
                .filter(Boolean)
            : [];
          const quoteText = tweet.quote?.text || "";
          expandedUrlsText = [tweetText, quoteText, ...facetUrls].join("\n");

          const videoMedia =
            tweet.media?.videos?.[0] ?? tweet.quote?.media?.videos?.[0] ?? null;
          xVideoUrl = pickOptimalMp4Url(videoMedia);

          const primaryMedia =
            tweet.media?.all?.[0] ??
            tweet.quote?.media?.all?.[0] ??
            tweet.media?.photos?.[0] ??
            null;
          thumbnailUrl =
            primaryMedia?.thumbnail_url ??
            primaryMedia?.url ??
            tweet.media?.mosaic?.formats?.jpeg ??
            undefined;

          engagementStats = formatEngagementStats({
            likes: typeof tweet.likes === "number" ? tweet.likes : null,
            bookmarks: typeof tweet.bookmarks === "number" ? tweet.bookmarks : null,
            views: typeof tweet.views === "number" ? tweet.views : null,
          });
        } else if (data?.user) {
          const user = data.user;
          authorName = user.name || authorName;
          resolvedHandle = user.screen_name || resolvedHandle;
          avatarUrl = upgradeTwimgAvatar(user.avatar_url) || avatarUrl;
          bannerUrl = user.banner_url || undefined;
          tweetText = user.description || "";
          expandedUrlsText = [tweetText, user.website?.url || ""].join("\n");
          thumbnailUrl = bannerUrl ?? avatarUrl;
        } else {
          warnings.push("fxtwitter returned an unexpected payload structure.");
        }
      } else {
        warnings.push(`fxtwitter lookup returned HTTP ${fxRes.status}.`);
      }
    } catch {
      warnings.push("Could not reach api.fxtwitter.com; using fallback metadata.");
    }

    const {
      installCommand: extractedInstallCmd,
      skillFlag,
      githubMatch,
    } = extractInstallAndGithubFromText(expandedUrlsText || tweetText);

    let ghEnrichment: GithubEnrichment | null = null;
    if (githubMatch) {
      ghEnrichment = await fetchGithubRepoEnrichment(
        githubMatch.owner,
        githubMatch.repo,
        warnings,
      );
    }

    const cleanedText = cleanTweetText(tweetText);
    const skillName =
      skillFlag ||
      ghEnrichment?.skillName ||
      ghEnrichment?.repo ||
      slugify(cleanedText.split(/\s+/).slice(0, 3).join("-")) ||
      resolvedHandle.toLowerCase();

    const id = slugify(
      skillFlag ||
        ghEnrichment?.repo ||
        (statusId ? `${resolvedHandle}-${statusId.slice(-6)}` : resolvedHandle),
    );

    const title =
      ghEnrichment?.title && ghEnrichment.title !== ghEnrichment.repo
        ? ghEnrichment.title
        : summarizeTweetTitle(cleanedText, skillName, authorName);

    const tagline =
      cleanedText ||
      ghEnrichment?.description ||
      `Curated skill shared by @${resolvedHandle} on X.`;

    const resolvedThumbnail =
      customThumb ||
      thumbnailUrl ||
      ghEnrichment?.readmeImageUrl ||
      ghEnrichment?.ogImageUrl ||
      bannerUrl ||
      avatarUrl;

    const resolvedInstallCommand =
      extractedInstallCmd ||
      ghEnrichment?.installCommand ||
      `npx skills add ${ghEnrichment ? ghEnrichment.githubRepo : `${resolvedHandle}/${skillName}`}`;

    const githubRepo = ghEnrichment?.githubRepo || `${resolvedHandle}/${skillName}`;
    const githubUrl =
      ghEnrichment?.githubUrl ||
      canonicalPostUrl ||
      `https://x.com/${resolvedHandle}`;

    const starsOrInstalls =
      [ghEnrichment?.starsLabel, engagementStats].filter(Boolean).join(" · ") ||
      `@${resolvedHandle}`;

    const { collectionId, additionalCollectionIds, pairsWithCmk } = inferCategoryAndPairings(
      [title, tagline, tweetText, skillName, githubRepo].join(" "),
      input.collectionId,
    );

    const profileUrl = `https://x.com/${resolvedHandle}`;
    const source: CuratedSkillSource = {
      platform: "x",
      postUrl: canonicalPostUrl,
      profileUrl,
      handle: resolvedHandle,
      thumbnailUrl: resolvedThumbnail,
      videoUrl: xVideoUrl,
      avatarUrl,
      bannerUrl,
    };

    const ref: StoredSkillRef = {
      id,
      name: skillName,
      title,
      tagline,
      collectionId,
      ...(additionalCollectionIds ? { additionalCollectionIds } : {}),
      creator: {
        name: authorName,
        xHandle: resolvedHandle,
        xUrl: profileUrl,
        ...(canonicalPostUrl ? { xPostUrl: canonicalPostUrl } : {}),
        platform: "x",
        handle: resolvedHandle,
        profileUrl,
        ...(canonicalPostUrl ? { postUrl: canonicalPostUrl } : {}),
        githubRepo,
        githubUrl,
      },
      source,
      thumbnailUrl: resolvedThumbnail,
      xVideoUrl,
      xAvatarUrl: avatarUrl,
      xBannerUrl: bannerUrl,
      installCommand: resolvedInstallCommand,
      pairsWithCmk,
      starsOrInstalls,
      vettedAt,
      featured: true,
      isNew: true,
    };

    return {
      ref,
      detectedPlatform: "x",
      warnings,
    };
  }

  // ─── 2. GitHub Repository Flow ──────────────────────────────────────────
  if (detectedPlatform === "github") {
    const parsedGh = parseGithubOwnerRepo(trimmedUrl);
    if (!parsedGh) {
      throw new Error("Invalid URL: expected https://github.com/<owner>/<repo>");
    }

    const gh = await fetchGithubRepoEnrichment(parsedGh.owner, parsedGh.repo, warnings);
    const id = slugify(gh.skillName || gh.repo);
    const name = gh.skillName || gh.repo;
    const title =
      gh.title && gh.title.toLowerCase() !== gh.repo.toLowerCase()
        ? gh.title
        : `${gh.owner}/${gh.repo}`;
    const tagline =
      gh.description || `Open-source agent skill repository by ${gh.owner}.`;

    const resolvedThumbnail =
      customThumb || gh.readmeImageUrl || gh.ogImageUrl || gh.avatarUrl || undefined;
    const bannerUrl = gh.ogImageUrl;

    const { collectionId, additionalCollectionIds, pairsWithCmk } = inferCategoryAndPairings(
      [title, tagline, name, gh.githubRepo].join(" "),
      input.collectionId,
    );

    const profileUrl = `https://github.com/${gh.owner}`;
    const source: CuratedSkillSource = {
      platform: "github",
      postUrl: gh.githubUrl,
      profileUrl,
      handle: gh.owner,
      thumbnailUrl: resolvedThumbnail,
      avatarUrl: gh.avatarUrl ?? undefined,
      bannerUrl,
    };

    const ref: StoredSkillRef = {
      id,
      name,
      title,
      tagline,
      collectionId,
      ...(additionalCollectionIds ? { additionalCollectionIds } : {}),
      creator: {
        name: gh.owner,
        xHandle: gh.owner,
        xUrl: profileUrl,
        platform: "github",
        handle: gh.owner,
        profileUrl,
        postUrl: gh.githubUrl,
        githubRepo: gh.githubRepo,
        githubUrl: gh.githubUrl,
      },
      source,
      thumbnailUrl: resolvedThumbnail,
      xAvatarUrl: gh.avatarUrl ?? undefined,
      xBannerUrl: bannerUrl,
      installCommand: gh.installCommand,
      pinnedSha: gh.defaultBranch,
      pairsWithCmk,
      starsOrInstalls: gh.starsLabel || gh.githubRepo,
      vettedAt,
      featured: true,
      isNew: true,
    };

    return {
      ref,
      detectedPlatform: "github",
      warnings,
    };
  }

  // ─── 3. Threads / Instagram / Facebook / YouTube / Web Flow ────────────
  let handle = parseGenericSocialHandle(trimmedUrl, detectedPlatform) || host.split(".")[0] || "creator";
  let ogTitle: string | null = null;
  let ogDescription: string | null = null;
  let ogImage: string | null = null;
  let ogVideo: string | null = null;

  if (detectedPlatform === "youtube") {
    const videoId =
      host === "youtu.be"
        ? parsedUrl.pathname.split("/").filter(Boolean)[0]
        : parsedUrl.searchParams.get("v") ||
          (parsedUrl.pathname.startsWith("/shorts/")
            ? parsedUrl.pathname.split("/")[2]
            : null);
    if (videoId) {
      ogImage = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }

  let htmlContent = "";
  try {
    const res = await fetchWithTimeout(trimmedUrl, {
      headers: {
        "User-Agent":
          "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (res.ok) {
      htmlContent = await res.text();
      ogTitle =
        extractMetaTag(htmlContent, ["og:title", "twitter:title"]) ||
        extractHtmlTitle(htmlContent);
      ogDescription = extractMetaTag(htmlContent, [
        "og:description",
        "twitter:description",
        "description",
      ]);
      const rawImg = extractMetaTag(htmlContent, [
        "og:image:secure_url",
        "og:image",
        "twitter:image",
      ]);
      if (rawImg && !ogImage) {
        ogImage = /^https?:\/\//i.test(rawImg)
          ? rawImg
          : new URL(rawImg, trimmedUrl).toString();
      }
      const rawVid = extractMetaTag(htmlContent, [
        "og:video:secure_url",
        "og:video:url",
        "og:video",
        "twitter:player:stream",
      ]);
      if (rawVid && /\.(mp4|mov|webm)(\?|$)/i.test(rawVid)) {
        ogVideo = /^https?:\/\//i.test(rawVid)
          ? rawVid
          : new URL(rawVid, trimmedUrl).toString();
      }
      const creatorMeta = extractMetaTag(htmlContent, ["twitter:creator", "author"]);
      if (creatorMeta && (!handle || handle === "youtube")) {
        handle = creatorMeta.replace(/^@/, "").trim();
      }
    } else {
      warnings.push(`Fetching ${trimmedUrl} returned HTTP ${res.status}.`);
    }
  } catch {
    warnings.push(`Could not fetch OpenGraph HTML for ${trimmedUrl}.`);
  }

  const combinedText = [ogTitle, ogDescription, htmlContent.slice(0, 4000)]
    .filter(Boolean)
    .join("\n");
  const { installCommand: extractedInstallCmd, skillFlag, githubMatch } =
    extractInstallAndGithubFromText(combinedText);

  let ghEnrichment: GithubEnrichment | null = null;
  if (githubMatch) {
    ghEnrichment = await fetchGithubRepoEnrichment(
      githubMatch.owner,
      githubMatch.repo,
      warnings,
    );
  }

  const unavatarProvider =
    detectedPlatform === "threads"
      ? "instagram"
      : detectedPlatform === "web"
        ? "x"
        : detectedPlatform;
  const avatarUrl =
    ghEnrichment?.avatarUrl ||
    (handle ? `https://unavatar.io/${unavatarProvider}/${handle}` : undefined);

  const name =
    skillFlag ||
    ghEnrichment?.skillName ||
    slugify(ogTitle?.split(/[—–|-]/)[0] || handle) ||
    "custom-skill";
  const id = slugify(name);
  const title = ogTitle || ghEnrichment?.title || `${name} (${host})`;
  const tagline =
    ogDescription ||
    ghEnrichment?.description ||
    `Curated skill resource from ${host}.`;

  const resolvedThumbnail =
    customThumb ||
    ogImage ||
    ghEnrichment?.readmeImageUrl ||
    ghEnrichment?.ogImageUrl ||
    avatarUrl;

  const { collectionId, additionalCollectionIds, pairsWithCmk } = inferCategoryAndPairings(
    [title, tagline, name, ghEnrichment?.githubRepo || ""].join(" "),
    input.collectionId,
  );

  const githubRepo = ghEnrichment?.githubRepo || `${handle}/${name}`;
  const githubUrl = ghEnrichment?.githubUrl || trimmedUrl;
  const installCommand =
    extractedInstallCmd || ghEnrichment?.installCommand || trimmedUrl;

  const source: CuratedSkillSource = {
    platform: detectedPlatform,
    postUrl: trimmedUrl,
    profileUrl: `${parsedUrl.protocol}//${parsedUrl.host}`,
    handle,
    thumbnailUrl: resolvedThumbnail,
    videoUrl: ogVideo ?? undefined,
    avatarUrl,
    bannerUrl: resolvedThumbnail,
  };

  const ref: StoredSkillRef = {
    id,
    name,
    title,
    tagline,
    collectionId,
    ...(additionalCollectionIds ? { additionalCollectionIds } : {}),
    creator: {
      name: handle,
      xHandle: handle,
      xUrl: `${parsedUrl.protocol}//${parsedUrl.host}`,
      xPostUrl: trimmedUrl,
      platform: detectedPlatform,
      handle,
      profileUrl: `${parsedUrl.protocol}//${parsedUrl.host}`,
      postUrl: trimmedUrl,
      githubRepo,
      githubUrl,
    },
    source,
    thumbnailUrl: resolvedThumbnail,
    xVideoUrl: ogVideo ?? undefined,
    xAvatarUrl: avatarUrl,
    xBannerUrl: resolvedThumbnail,
    installCommand,
    pairsWithCmk,
    starsOrInstalls: ghEnrichment?.starsLabel || host,
    vettedAt,
    featured: true,
    isNew: true,
  };

  return {
    ref,
    detectedPlatform,
    warnings,
  };
}
