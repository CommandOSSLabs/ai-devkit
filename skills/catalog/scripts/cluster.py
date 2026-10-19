"""Path clustering for new-capability OBS candidates."""

from __future__ import annotations

from collections import defaultdict

PATH_STOPWORDS = {
    "apps",
    "app",
    "src",
    "lib",
    "internal",
    "routes",
    "features",
    "crates",
    "packages",
    "backend",
    "frontend",
    # "web" kept meaningful — monorepo package name (apps/web/…)
    "server",
    "client",
    "test",
    "tests",
    "__tests__",
    "node_modules",
    "target",
    "dist",
    "build",
    "vendor",
    "generated",
    "gen",
}


def meaningful_segments(path: str) -> list[str]:
    return [s for s in path.split("/") if s and s not in PATH_STOPWORDS]


def _directory_segments(path: str) -> list[str]:
    """Path segments with a trailing filename (has '.') removed."""
    parts = [s for s in path.split("/") if s]
    if parts and "." in parts[-1]:
        parts = parts[:-1]
    return parts


def cluster_key(path: str) -> str:
    """Two-segment directory key: meaningful pair, or one meaningful + next raw."""
    dirs = _directory_segments(path)
    if not dirs:
        return path.split("/")[0] if path else "platform"
    meaningful_idx = [i for i, s in enumerate(dirs) if s not in PATH_STOPWORDS]
    if len(meaningful_idx) >= 2:
        i, j = meaningful_idx[0], meaningful_idx[1]
        return f"{dirs[i]}/{dirs[j]}"
    if len(meaningful_idx) == 1:
        i = meaningful_idx[0]
        if i + 1 < len(dirs):
            return f"{dirs[i]}/{dirs[i + 1]}"
        if i > 0:
            return f"{dirs[i - 1]}/{dirs[i]}"
        return dirs[i]
    # all stopwords — keep last two raw directory segments
    if len(dirs) >= 2:
        return f"{dirs[-2]}/{dirs[-1]}"
    return dirs[0]


def longest_common_prefix(paths: list[str]) -> list[str]:
    if not paths:
        return []
    split = [p.split("/") for p in paths]
    prefix: list[str] = []
    for parts in zip(*split):
        if len(set(parts)) != 1:
            break
        prefix.append(parts[0])
    return prefix


def domain_slug(paths: list[str]) -> str:
    """Domain from longest common meaningful *directory* prefix — no filenames."""
    if not paths:
        return "platform"
    # LCP over directory segments only (strip trailing file basenames)
    dir_paths = ["/".join(_directory_segments(p)) for p in paths]
    dir_paths = [d for d in dir_paths if d]
    if not dir_paths:
        return "platform"
    lcp = longest_common_prefix(dir_paths)
    segs = [s for s in lcp if s and s not in PATH_STOPWORDS and "." not in s]
    if segs:
        slug = segs[-1].lower().replace("_", "-")[:32]
        return slug or "platform"
    # Fall back: majority first meaningful directory segment
    votes: dict[str, int] = defaultdict(int)
    for p in paths:
        ms = [s for s in meaningful_segments("/".join(_directory_segments(p))) if "." not in s]
        if ms:
            votes[ms[0].lower().replace("_", "-")[:32]] += 1
    if not votes:
        return "platform"
    return sorted(votes.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]


def surface_roots(paths: list[str], max_roots: int = 3) -> list[str]:
    """Stable directory roots = LCP of dirs, or per-path directory prefixes."""
    dir_paths = ["/".join(_directory_segments(p)) for p in paths]
    dir_paths = [d for d in dir_paths if d]
    roots: list[str] = []
    if dir_paths:
        lcp = longest_common_prefix(dir_paths)
        if len(lcp) >= 2:
            roots.append("/".join(lcp) + "/")
            return roots[:max_roots]
        if len(lcp) == 1:
            roots.append(lcp[0] + "/")
            return roots[:max_roots]
    for p in sorted(paths):
        parts = _directory_segments(p)
        keep: list[str] = []
        for part in parts:
            keep.append(part)
            if part not in PATH_STOPWORDS and len(keep) >= 2:
                break
        if not keep:
            continue
        root = "/".join(keep) + "/"
        if root not in roots:
            roots.append(root)
        if len(roots) >= max_roots:
            break
    return roots


def cluster_unowned_paths(paths: list[str]) -> dict[str, list[str]]:
    """Group unowned behavior paths by directory cluster keys (not filenames)."""
    groups: dict[str, list[str]] = defaultdict(list)
    for p in paths:
        groups[cluster_key(p)].append(p)
    return dict(groups)
