import { NextResponse } from "next/server";

/**
 * GitHub's unauthenticated REST API caps out at 60 requests/hour *per
 * source IP*. The client used to call these four endpoints directly from
 * the browser on every page load — each visitor's own IP has its own
 * budget, so that's fine in isolation, but it means the site's "live from
 * the repository" numbers silently degrade to all-dashes the moment any
 * one visitor (or a shared NAT/office IP, or repeated local testing)
 * exhausts its 60/hr.
 *
 * Routing it through this server-side handler instead means every visitor
 * shares ONE quota (this server's IP) rather than each burning their own,
 * and Next's fetch cache below caps actual GitHub calls to once every 5
 * minutes regardless of traffic — at most 4 calls / 5 min = 48/hr, safely
 * under the unauthenticated limit even with zero configuration. Set a
 * GITHUB_TOKEN env var to move to the 5000/hr authenticated tier if this
 * ever needs to poll more often.
 */

type MergedPR = {
  number: number;
  title: string;
  mergedAt: string;
};

type RepoMeta = {
  stars: number | null;
  license: string | null;
  pushedAt: string | null;
  commitSha: string | null;
  latestTag: string | null;
  recentMerges: MergedPR[];
};

const EMPTY_REPO_META: RepoMeta = {
  stars: null,
  license: null,
  pushedAt: null,
  commitSha: null,
  latestTag: null,
  recentMerges: [],
};

const REVALIDATE_SECONDS = 300;

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/**
 * Distinguishes "GitHub answered, and this is the answer" from "the call
 * failed" — an empty tag list and a rate-limited 403 both used to collapse to
 * `null`, which made a transient outage indistinguishable from real data.
 */
type Fetched = { ok: true; data: unknown } | { ok: false };

async function getJson(url: string): Promise<Fetched> {
  try {
    const res = await fetch(url, {
      headers: githubHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return { ok: false };
    return { ok: true, data: await res.json() };
  } catch {
    return { ok: false };
  }
}

export async function GET() {
  try {
    const [repo, commit, tags, pulls] = await Promise.all([
      getJson("https://api.github.com/repos/CommandOSSLabs/ai-devkit"),
      getJson("https://api.github.com/repos/CommandOSSLabs/ai-devkit/commits/main"),
      getJson("https://api.github.com/repos/CommandOSSLabs/ai-devkit/tags?per_page=1"),
      getJson(
        "https://api.github.com/repos/CommandOSSLabs/ai-devkit/pulls?state=closed&sort=updated&direction=desc&per_page=8",
      ),
    ]);

    // The repo endpoint carries stars, license and pushedAt — the numbers the
    // page actually renders. If it did not come back there is nothing worth
    // caching: answering 200 with an all-nulls body would let the CDN, Next's
    // data cache and the client each hold that empty result for the full
    // revalidate window, which is precisely the all-dashes state this route
    // exists to prevent. Fail loudly and uncached instead, so the client's
    // retry path engages and the next request re-asks GitHub.
    if (!repo.ok) {
      return NextResponse.json(EMPTY_REPO_META, {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const repoObj = repo.data as { stargazers_count?: number; license?: { spdx_id?: string }; pushed_at?: string } | null;
    const commitObj = (commit.ok ? commit.data : null) as { sha?: string } | null;
    const tagsArr = (tags.ok ? tags.data : null) as Array<{ name?: string }> | null;
    const pullsArr = (pulls.ok ? pulls.data : null) as Array<{ number: number; title: string; merged_at: string | null }> | null;

    const recentMerges: MergedPR[] = Array.isArray(pullsArr)
      ? pullsArr
          .filter((pr) => pr?.merged_at)
          .slice(0, 3)
          .map((pr) => ({ number: pr.number, title: pr.title, mergedAt: pr.merged_at as string }))
      : [];

    const meta: RepoMeta = {
      stars: repoObj?.stargazers_count ?? null,
      license: repoObj?.license?.spdx_id ?? null,
      pushedAt: repoObj?.pushed_at ?? null,
      commitSha: commitObj?.sha ? String(commitObj.sha).slice(0, 7) : null,
      latestTag: Array.isArray(tagsArr) && tagsArr[0]?.name ? (tagsArr[0].name as string) : null,
      recentMerges,
    };

    return NextResponse.json(meta, {
      headers: { "Cache-Control": `public, max-age=0, s-maxage=${REVALIDATE_SECONDS}` },
    });
  } catch {
    return NextResponse.json(EMPTY_REPO_META, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
