"""Index-then-advance overlay writer for reconcile-features (rfeat-1.0)."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

RECIPE_ID = "rfeat-1.0"
OVERLAY_ROOT = Path(".skills") / "reverse-features"


def _gitignore_ignores_skills(repo_root: Path) -> bool:
    gi = repo_root / ".gitignore"
    if not gi.is_file():
        return False
    for line in gi.read_text(encoding="utf-8", errors="replace").splitlines():
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        # Common forms: .skills / .skills/ / .skills/** / **/.skills/
        if s in {".skills", ".skills/", "/.skills", "/.skills/"}:
            return True
        if s.endswith(".skills/") or s.endswith(".skills"):
            return True
        if ".skills/" in s or s == "**/.skills/**":
            return True
    return False


def can_write_overlay(repo_root: Path) -> bool:
    """True when .skills is gitignored and the overlay tree is creatable/writable."""
    root = Path(repo_root)
    if not _gitignore_ignores_skills(root):
        return False
    skills = root / ".skills"
    try:
        skills.mkdir(parents=True, exist_ok=True)
        probe = skills / ".rfeat-write-probe"
        probe.write_text("ok", encoding="utf-8")
        probe.unlink(missing_ok=True)
    except OSError:
        return False
    return True


def _tombstoned_ids(overlay: Path) -> set[str]:
    path = overlay / "tombstones.jsonl"
    if not path.is_file():
        return set()
    out: set[str] = set()
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError:
            continue
        oid = row.get("observation_id") or row.get("id")
        if oid:
            out.add(str(oid))
    return out


def _slug_domain(finding: dict[str, Any]) -> str:
    raw = finding.get("domain") or finding.get("cluster_key") or "platform"
    slug = str(raw).split("/")[0].lower().replace("_", "-")
    slug = re.sub(r"[^a-z0-9-]+", "-", slug).strip("-")[:32]
    return slug or "platform"


def _render_active_card(finding: dict[str, Any]) -> str:
    oid = finding["observation_id"]
    roots = finding.get("surface_roots") or []
    roots_fmt = ", ".join(f"`{r}`" for r in roots) or "—"
    capability = finding.get("capability") or (
        f"Unowned behavior cluster `{finding.get('cluster_key') or oid}`"
    )
    terms = finding.get("match_terms") or []
    if not terms and finding.get("cluster_key"):
        terms = [str(finding["cluster_key"]).replace("/", "-")]
    terms_fmt = ", ".join(terms) if terms else "—"
    return (
        f"## {oid}\n\n"
        f"- state: pending\n"
        f"- confidence: {finding.get('confidence') or 'medium'}\n"
        f"- capability: {capability}\n"
        f"- match_terms: {terms_fmt}\n"
        f"- surface_roots: {roots_fmt}\n"
        f"- evidence: ../observations/{oid}.json\n"
    )


def index_overlay(repo_root: Path, env: dict[str, Any]) -> dict[str, Any]:
    """Write active OBS cards + detail json, then advance state.json.

    Returns {advanced_to, written_obs, skipped_tombstoned}. Does not write when
    can_write_overlay is false — caller should keep advanced_to null.
    """
    root = Path(repo_root)
    head = env.get("head") or ""
    if not can_write_overlay(root):
        return {"advanced_to": None, "written_obs": [], "skipped_tombstoned": []}

    overlay = root / OVERLAY_ROOT
    active_dir = overlay / "active"
    obs_dir = overlay / "observations"
    active_dir.mkdir(parents=True, exist_ok=True)
    obs_dir.mkdir(parents=True, exist_ok=True)

    tombstoned = _tombstoned_ids(overlay)
    written: list[str] = []
    skipped: list[str] = []
    # domain → list of card markdown blocks
    by_domain: dict[str, list[str]] = {}
    unresolved: list[str] = []

    for finding in env.get("findings") or []:
        if finding.get("change_class") != "new-capability-candidate":
            continue
        oid = finding.get("observation_id")
        if not oid:
            continue
        if oid in tombstoned:
            skipped.append(oid)
            continue
        domain = _slug_domain(finding)
        by_domain.setdefault(domain, []).append(_render_active_card(finding))
        detail = {
            "observation_id": oid,
            "state": "pending",
            "confidence": finding.get("confidence") or "medium",
            "domain": domain,
            "cluster_key": finding.get("cluster_key"),
            "surface_roots": finding.get("surface_roots") or [],
            "evidence": finding.get("evidence") or {"items": [], "truncated": False},
            "disposition": finding.get("disposition") or "pending",
        }
        (obs_dir / f"{oid}.json").write_text(
            json.dumps(detail, indent=2) + "\n", encoding="utf-8"
        )
        written.append(oid)
        unresolved.append(oid)

    for domain, blocks in sorted(by_domain.items()):
        path = active_dir / f"{domain}.md"
        existing = ""
        if path.is_file():
            existing = path.read_text(encoding="utf-8", errors="replace")
        # Replace or append per OBS id — drop old block for same id then append
        for block in blocks:
            m = re.match(r"## (OBS-[0-9a-f]{6})", block)
            if m and m.group(1) in existing:
                oid = m.group(1)
                existing = re.sub(
                    rf"## {re.escape(oid)}\n.*?(?=\n## |\Z)",
                    "",
                    existing,
                    flags=re.S,
                )
            existing = existing.rstrip() + ("\n\n" if existing.strip() else "") + block
        header = f"# Observations — {domain}\n\n"
        if not existing.lstrip().startswith("# Observations"):
            existing = header + existing.lstrip()
        path.write_text(existing.rstrip() + "\n", encoding="utf-8")

    state = {
        "last_reconciled_sha": head,
        "recipe_id": RECIPE_ID,
        "unresolved_finding_ids": unresolved,
    }
    (overlay / "state.json").write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")

    return {
        "advanced_to": head,
        "written_obs": written,
        "skipped_tombstoned": skipped,
    }
