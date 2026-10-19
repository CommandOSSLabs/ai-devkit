"""OWNS extraction for reconcile-features (rfeat precision).

Index-first: CODE → spec dir from docs/specs/INDEX.md, then parse each
tasks.md Files blocks (fence-aware) and optional File Structure path cells.
Does not require a Feature code: line in requirements.md.
"""

from __future__ import annotations

import re
from pathlib import Path

CODE_RE = re.compile(r"^[A-Z][A-Z0-9]{1,11}$")
INDEX_ROW_RE = re.compile(
    r"^\|\s*([A-Z][A-Z0-9]{1,11})\s*\|\s*(.*?)\s*\|",
    re.M,
)
LINK_DIR_RE = re.compile(r"\(([^)]+)\)")
FILES_HEADER_RE = re.compile(r"^(?:\*\*Files:\*\*|Files:)\s*$")
STOP_HEADERS_RE = re.compile(
    r"^(?:#{2,6}\s|\*\*Reuse|\*\*Interfaces|\*\*Depends|\*\*Steps|Steps:|"
    r"- \[ \]|- \[x\]|\*\*File Structure)"
)
LABELED_PATH_RE = re.compile(
    r"(?:Create|Modify|Move|Test):\s*`([^`]+)`"
)
BACKTICK_PATH_RE = re.compile(r"`([^`]+)`")
TABLE_PATH_RE = re.compile(r"`([^`]+)`")

STOP_BASENAMES = {
    "package.json",
    "Cargo.toml",
    "go.mod",
    "pyproject.toml",
    "Gemfile",
    "composer.json",
    "Package.swift",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "Cargo.lock",
    "poetry.lock",
    "Gemfile.lock",
    "composer.lock",
}
STOP_SEGMENTS = {
    "src",
    "lib",
    "app",
    "apps",
    "packages",
    "services",
    "crates",
    "cmd",
    "internal",
    "vendor",
    "node_modules",
    "dist",
    "build",
    "target",
    "out",
    "skills",
    "templates",
    "hooks",
    "scripts",
    "docs",
}


def is_shared_catalog(index_text: str) -> bool:
    """True when INDEX is a Domain router (shared catalog — the only valid shape)."""
    for line in index_text.splitlines():
        if not line.startswith("|"):
            continue
        cells = [c.strip().lower() for c in line.strip("|").split("|")]
        if cells and cells[0] == "domain" and any("feature catalog" in c for c in cells):
            return True
    return False


def is_sharded_index(index_text: str) -> bool:
    """Alias for is_shared_catalog (legacy name)."""
    return is_shared_catalog(index_text)


def _normalize_spec_dir(raw: str) -> str | None:
    """Normalize a Path/Spec cell to a dir relative to docs/specs/."""
    d = raw.strip().strip("`").strip()
    if not d or d in {"—", "-", "–"}:
        return None
    if "://" in d or d.startswith(("#", "mailto:")):
        return None
    # Keep ".." for shard-relative specs; only strip a leading "./"
    if d.startswith("./"):
        d = d[2:]
    d = d.rstrip("/")
    if not d:
        return None
    # Absolute-from-repo forms written in INDEX Path columns
    for prefix in ("docs/specs/", "docs/specs"):
        if d.startswith(prefix):
            d = d[len("docs/specs/") :] if d.startswith("docs/specs/") else ""
            break
    d = d.rstrip("/")
    if not d or d in {"—", "-"}:
        return None
    return d


def _spec_dir_candidates(line: str) -> list[str]:
    """Collect path-like candidates from a feature row (links + backticks + cells)."""
    cands: list[str] = []
    for href in LINK_DIR_RE.findall(line):
        n = _normalize_spec_dir(href)
        if n:
            cands.append(n)
    for tick in BACKTICK_PATH_RE.findall(line):
        n = _normalize_spec_dir(tick)
        if n:
            cands.append(n)
    # Bare Path cells: docs/specs/…/, ./2026-…/, or ../2026-…/ (shard-relative)
    for cell in line.strip().strip("|").split("|"):
        cell = cell.strip()
        if (
            "docs/specs/" in cell
            or re.match(r"^\.?/?\d{4}-\d{2}-\d{2}-", cell)
            or re.match(r"^(\.\./)+\d{4}-\d{2}-\d{2}-", cell)
        ):
            n = _normalize_spec_dir(cell)
            if n:
                cands.append(n)
    return cands


def _score_spec_dir(cand: str) -> int:
    """Higher = more likely a real Spec/Path cell, not a Name parenthetical."""
    score = 0
    if "/" in cand:
        score += 5
    if re.match(r"^\d{4}-\d{2}-\d{2}-", cand):
        score += 5
    if cand.startswith("catalog/"):
        score += 3
    if ".." in cand.split("/"):
        score += 2
    # Bare prose fragments like "course and bootcamp" score 0
    if " " in cand:
        score -= 4
    return score


def _parse_feature_table(text: str) -> dict[str, str]:
    """Parse feature rows: CODE → spec dir (flat INDEX or shard card table).

    Supports mailgate-style `| CODE | [dir](dir/) | … |` and klynt-style
    `| CODE | Name | Status | Roadmap | \`docs/specs/dir/\` |`. Prefers
    path-like candidates over Name-cell parentheticals.
    """
    main = text.split("## Codes that are spoken")[0]
    out: dict[str, str] = {}
    for line in main.splitlines():
        if not line.startswith("|"):
            continue
        m = INDEX_ROW_RE.match(line)
        if not m:
            continue
        code = m.group(1)
        if code.lower() == "code":
            continue
        cands = _spec_dir_candidates(line)
        if not cands:
            continue
        best = max(cands, key=_score_spec_dir)
        if _score_spec_dir(best) <= 0:
            continue
        out[code] = best
    return out


def parse_index_registry(index_text: str, specs_dir: Path | None = None) -> dict[str, str]:
    """Return CODE → spec dir relative to docs/specs/ (no trailing slash).

    Shared catalog only: Domain router in INDEX.md → each Feature catalog
    shard under catalog/*.md. Flat feature tables on INDEX return {}.
    Spec paths in shards may be relative to the shard file; results are
    normalized to be relative to docs/specs/.
    """
    if not is_shared_catalog(index_text):
        return {}

    if specs_dir is None:
        return {}

    out: dict[str, str] = {}
    for line in index_text.splitlines():
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if not cells or cells[0].lower() == "domain":
            continue
        # Domain | Scope | Surface roots | Feature catalog
        if len(cells) < 4:
            continue
        link = LINK_DIR_RE.search(cells[3])
        if not link:
            continue
        shard_href = link.group(1).strip()
        shard_rel = shard_href[2:] if shard_href.startswith("./") else shard_href
        shard_path = (Path(specs_dir) / shard_rel).resolve()
        if not shard_path.is_file():
            continue
        shard_text = shard_path.read_text(encoding="utf-8", errors="replace")
        raw = _parse_feature_table(shard_text)
        shard_parent = shard_path.parent
        specs_root = Path(specs_dir).resolve()
        for code, rel in raw.items():
            # shard may say ../2026-01-01-demo/ — resolve against shard dir
            resolved = (shard_parent / rel).resolve()
            try:
                norm = resolved.relative_to(specs_root).as_posix()
            except ValueError:
                norm = rel[2:] if rel.startswith("./") else rel
            out[code] = norm.rstrip("/")
    return out


def _plausible_path(token: str) -> bool:
    token = token.strip().rstrip(".,;:)]}")
    if not token or token in {".", ".."}:
        return False
    if "://" in token or token.startswith(("http:", "https:", "file:")):
        return False
    if token.startswith("/") or re.match(r"^[A-Za-z]:[\\/]", token):
        return False
    if any(seg == ".." for seg in token.split("/")):
        return False
    base = token.rsplit("/", 1)[-1]
    if base in STOP_BASENAMES:
        return False
    if "/" in token:
        return True
    if token.startswith(".") and len(token) > 1:
        return True
    return bool(re.match(r"^[A-Za-z0-9._-]+$", token)) and ".." not in token


def _denoise(path: str) -> str | None:
    path = path.strip().strip("`")
    path = re.sub(r":[0-9]+([,-][0-9]+)*$", "", path)
    if not _plausible_path(path):
        return None
    parts = path.split("/")
    if len(parts) == 1 and parts[0] in STOP_SEGMENTS:
        return None
    return path


def extract_files_paths(tasks_text: str) -> set[str]:
    """Fence-aware Files bodies + File Structure backtick paths."""
    paths: set[str] = set()
    lines = tasks_text.splitlines()
    i = 0
    in_fence = False
    while i < len(lines):
        line = lines[i]
        if line.startswith("```"):
            in_fence = not in_fence
            i += 1
            continue
        if in_fence:
            i += 1
            continue
        if FILES_HEADER_RE.match(line):
            i += 1
            body: list[str] = []
            while i < len(lines):
                l2 = lines[i]
                if l2.startswith("```"):
                    break
                if FILES_HEADER_RE.match(l2):
                    break
                if STOP_HEADERS_RE.match(l2) and body:
                    break
                if STOP_HEADERS_RE.match(l2) and not body and l2.startswith("#"):
                    break
                body.append(l2)
                i += 1
            blob = "\n".join(body)
            for raw in LABELED_PATH_RE.findall(blob):
                for piece in raw.split(","):
                    d = _denoise(piece)
                    if d:
                        paths.add(d)
            for raw in BACKTICK_PATH_RE.findall(blob):
                d = _denoise(raw)
                if d:
                    paths.add(d)
            continue
        # File Structure tables: collect backtick paths on table rows
        if line.startswith("|") and "`" in line:
            for raw in TABLE_PATH_RE.findall(line):
                d = _denoise(raw)
                if d and ("/" in d or d.endswith((".rs", ".ts", ".tsx", ".move"))):
                    paths.add(d)
        i += 1
    return paths


def load_owns(repo_root: Path, specs_dir: str = "docs/specs") -> tuple[dict[str, set[str]], dict]:
    """Build CODE → OWNS path set and coverage stats."""
    root = Path(repo_root)
    specs = root / specs_dir
    index_path = specs / "INDEX.md"
    if not index_path.exists():
        return {}, {"with_owns": 0, "registered": 0, "ratio": 0.0, "missing_dirs": []}

    index_text = index_path.read_text(encoding="utf-8", errors="replace")
    shared = is_shared_catalog(index_text)
    registry = parse_index_registry(index_text, specs_dir=specs)
    owns: dict[str, set[str]] = {c: set() for c in registry}
    missing_dirs: list[str] = []

    for code, rel in registry.items():
        spec_path = specs / rel
        if not spec_path.is_dir():
            missing_dirs.append(rel)
            continue
        tasks = spec_path / "tasks.md"
        if not tasks.exists():
            continue
        text = tasks.read_text(encoding="utf-8", errors="replace")
        owns[code] |= extract_files_paths(text)

    registered = len(registry)
    with_owns = sum(1 for p in owns.values() if p)
    ratio = round(with_owns / registered, 3) if registered else 0.0
    coverage = {
        "with_owns": with_owns,
        "registered": registered,
        "ratio": ratio,
        "missing_dirs": missing_dirs,
        "catalog_shape": "shared" if shared else "flat_rejected",
    }
    return owns, coverage

# Ancestor ownership requires an explicit directory marker ("…/") or enough
# path specificity. A bare two-segment token like `crates/enclave` must not
# swallow an entire tree (mailgate ATCH skew).
MIN_ANCESTOR_SEGMENTS = 3


def _token_owns_path(tok: str, path: str) -> bool:
    raw = tok.strip()
    if not raw:
        return False
    explicit_dir = raw.endswith("/")
    t = raw.rstrip("/")
    if not t:
        return False
    if path == t:
        return True
    if path.endswith("/") and t.startswith(path.rstrip("/") + "/"):
        return True
    if not path.startswith(t + "/"):
        return False
    if explicit_dir:
        return True
    segs = [s for s in t.split("/") if s]
    return len(segs) >= MIN_ANCESTOR_SEGMENTS


def owners_for_path(path: str, owns: dict[str, set[str]]) -> list[str]:
    """Return CODEs whose OWNS token is an exact/ancestor match for path.

    Ancestor match: token ends with `/`, or has ≥ MIN_ANCESTOR_SEGMENTS
    segments. Broad two-segment crate roots without a trailing slash are
    exact-only.
    """
    hits: list[str] = []
    for code, tokens in owns.items():
        for tok in tokens:
            if _token_owns_path(tok, path):
                hits.append(code)
                break
    return sorted(set(hits))
