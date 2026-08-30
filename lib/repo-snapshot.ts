import { execFileSync } from "node:child_process";
import { commitUrl } from "./repo-links";

export type RepoSnapshot = {
  /** short commit the pages were generated from, or null when it can't be resolved */
  commit: string | null;
  commitUrl: string | null;
  /** branch the build read, when the environment names one */
  branch: string | null;
  /** already formatted server-side — a Date formatted during hydration would mismatch */
  generatedAt: string;
};

// Every page under /skills is `force-static`: the skills/ directory is read
// once at build time and baked into HTML. So the honest thing to show is
// which commit that build read, not a "live" badge. Host build environments
// hand the SHA over in an env var; a local `next build` falls back to asking
// git, and if neither answers the UI just drops the commit chip rather than
// inventing one.
function resolveCommit(): string | null {
  const fromEnv =
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.GITHUB_SHA ??
    process.env.CF_PAGES_COMMIT_SHA ??
    process.env.COMMIT_SHA;
  if (fromEnv) return fromEnv.slice(0, 7);

  try {
    return execFileSync("git", ["rev-parse", "--short=7", "HEAD"], {
      cwd: process.cwd(),
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim() || null;
  } catch {
    return null;
  }
}

function resolveBranch(): string | null {
  const fromEnv =
    process.env.VERCEL_GIT_COMMIT_REF ?? process.env.GITHUB_REF_NAME ?? process.env.CF_PAGES_BRANCH;
  if (fromEnv) return fromEnv;

  try {
    const branch = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd: process.cwd(),
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return branch && branch !== "HEAD" ? branch : null;
  } catch {
    return null;
  }
}

const FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

// Resolved once per process rather than per page: shelling out to git 70
// times during a build is pure waste, and a single timestamp keeps every page
// agreeing on when the build happened.
const SNAPSHOT: RepoSnapshot = (() => {
  const commit = resolveCommit();
  return {
    commit,
    commitUrl: commit ? commitUrl(commit) : null,
    branch: resolveBranch(),
    generatedAt: `${FORMATTER.format(new Date())} UTC`,
  };
})();

export function getRepoSnapshot(): RepoSnapshot {
  return SNAPSHOT;
}
