#!/usr/bin/env python3
"""Derive one progress snapshot (JSON) from a repo's roadmap, catalog, specs and git.

Read-only and deterministic: the same repo, revision and --today give the same
JSON. Every value comes from a fixed parse of docs/roadmap/INDEX.md,
docs/specs/INDEX.md (+ catalog shards), spec folders, docs/decisions/,
docs/design/system.md, .skills/<CODE>/progress.md, and `git log`.

    python3 extract.py <repo-root> [--today YYYY-MM-DD] [--out snapshot.json]
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import subprocess
import sys
from pathlib import Path

DONE = {"Implemented", "Shipped"}
STATUS_WORDS = "Draft|Approved|In-progress|Implemented|Shipped|Recognized|Retired"
ROW = re.compile(r"^\| (~~)?([A-Z][A-Z0-9]{1,11})(~~)? \|(.*)\| (" + STATUS_WORDS + r") \|([^|]*)\|\s*$")
MILE_ROW = re.compile(r"^\| (~~)?(?:\*\*)?(MILE-\d+)(?:\*\*)?(~~)? \| ([^|]*) \| ([^|]*) \| ([^|]*) \| ([^|]*) \|")
MEMBER = re.compile(r"^- (~~)?\*\*(ROAD-\d+)\*\*(~~)?\s*(.*)$")
AFTER = re.compile(r"^(\S+) — After: ([^—]+?) — ")
ID = re.compile(r"^(ROAD-\d+|MILE-\d+|none)$")
TICK = re.compile(r"`([^`]+)`")


def run_git(root: Path, *args: str) -> str:
    out = subprocess.run(["git", *args], cwd=root, capture_output=True, text=True)
    return out.stdout if out.returncode == 0 else ""


def num(item_id: str) -> int:
    return int(item_id.split("-")[1])


# ---------------------------------------------------------------- roadmap


def parse_roadmap(text: str) -> tuple[list[dict], dict[str, dict]]:
    milestones: list[dict] = []
    by_id: dict[str, dict] = {}
    for line in text.splitlines():
        m = MILE_ROW.match(line)
        if m:
            mid = m.group(2)
            deps = re.findall(r"MILE-\d+", m.group(6))
            ms = {
                "id": mid, "name": m.group(4).strip(), "outcome": m.group(5).strip(),
                "depends_on": deps, "commitment": m.group(7).strip().split(" ")[0] or "Planned",
                "table_commitment": m.group(7).strip().split(" ")[0],
                "retired": bool(m.group(1)), "order": len(milestones), "members": [], "deferred": [],
            }
            milestones.append(ms)
            by_id[mid] = ms

    items: dict[str, dict] = {}
    current = None
    slot = None
    for line in text.splitlines():
        h = re.match(r"^## (~~)?(MILE-\d+)", line)
        if h:
            current = by_id.get(h.group(2))
            slot = None
            continue
        if current is None:
            continue
        if line.startswith("## "):
            current = None
            continue
        f = re.match(r"^\*\*(Members|Depends-on|Commitment|Closed|Deferred|Blockers|Outcome|Goals):\*\*\s*(.*)$", line)
        if f:
            slot = f.group(1)
            rest = f.group(2)
            if slot == "Commitment" and rest:
                current["commitment"] = rest.split(" ")[0]
            if slot == "Deferred":
                for rid in re.findall(r"\*\*(ROAD-\d+)\*\*", rest):
                    add_item(items, current, rid, rest, deferred=True)
            continue
        mm = MEMBER.match(line)
        if mm and slot in ("Members", "Deferred"):
            rid, struck, rest = mm.group(2), bool(mm.group(1)), mm.group(4)
            add_item(items, current, rid, rest, deferred=(slot == "Deferred"), retired=struck)
    return milestones, items


def add_item(items: dict, ms: dict, rid: str, rest: str, deferred: bool, retired: bool = False) -> None:
    if rid in items:
        items[rid].setdefault("duplicate", True)
        return
    rest = re.sub(r"^\*\*ROAD-\d+\*\*\s*", "", rest) if rest.startswith("**ROAD") else rest
    after = None
    am = AFTER.match(rest)
    slug = rest.split(" ")[0] if rest else ""
    if am:
        slug = am.group(1)
        after = [t.strip() for t in am.group(2).split(",") if t.strip()]
    surf_text = rest.split("Surfaces:", 1)[1] if "Surfaces:" in rest else ""
    surfaces = sorted({s.strip() for s in TICK.findall(surf_text) if "/" in s and " " not in s.strip()})
    items[rid] = {
        "id": rid, "slug": slug, "milestone": ms["id"], "after_field": after,
        "surfaces": surfaces, "retired": retired, "deferred": deferred,
    }
    (ms["deferred"] if deferred else ms["members"]).append(rid)


# ---------------------------------------------------------------- catalog / specs


def parse_catalog(root: Path) -> list[dict]:
    files = []
    index = root / "docs/specs/INDEX.md"
    if index.exists():
        files.append(("—", index))
    cat = root / "docs/specs/catalog"
    if cat.is_dir():
        files += [(p.stem, p) for p in sorted(cat.glob("*.md"))]
    feats = []
    for domain, path in files:
        for line in path.read_text().splitlines():
            m = ROW.match(line)
            if not m or m.group(1):
                continue
            middle = m.group(4)
            spec = re.search(r"\]\(([^)]+)\)", middle)
            spec_dir = None
            if spec:
                spec_dir = (path.parent / spec.group(1)).resolve()
                try:
                    spec_dir = spec_dir.relative_to(root.resolve()).as_posix()
                except ValueError:
                    spec_dir = None
            name = middle.split("|")[0].strip()
            name = re.sub(r"\s*\(.*$", "", name)
            feats.append({
                "code": m.group(2), "name": name, "domain": domain, "spec": spec_dir,
                "status": m.group(5), "roads": re.findall(r"ROAD-\d+", m.group(6)),
            })
    return feats


def ledger_progress(root: Path, feat: dict) -> None:
    feat["tasks_total"] = feat["tasks_done"] = None
    if feat["spec"]:
        tasks = root / feat["spec"] / "tasks.md"
        if tasks.exists():
            feat["tasks_total"] = len(set(re.findall(r"(?m)^#{2,4} Task (\w+):", tasks.read_text())))
    ledger = root / ".skills" / feat["code"] / "progress.md"
    if ledger.exists():
        done = set(re.findall(r"Task (\w+?)\b[^\n:]*: complete", ledger.read_text()))
        feat["tasks_done"] = len(done)


# ---------------------------------------------------------------- graph


def resolve(items: dict, by_mile: dict) -> None:
    for ms in by_mile.values():
        prev = None
        for rid in ms["members"]:
            it = items[rid]
            if it["retired"]:
                continue
            if it["after_field"] is not None:
                it["after"] = [t for t in it["after_field"] if t != "none"]
                it["after_source"] = "field"
            else:
                it["after"] = [prev] if prev else list(ms["depends_on"])
                it["after_source"] = "implicit"
            prev = rid
    for it in items.values():
        it.setdefault("after", [])
        it.setdefault("after_source", "field" if it["after_field"] is not None else "implicit")


def expand(items: dict, by_mile: dict, token: str) -> list[str]:
    if token.startswith("MILE-"):
        ms = by_mile.get(token)
        if not ms:
            return []
        return [r for r in ms["members"] if not items[r]["retired"]]
    return [token] if token in items else []


def structural_findings(items: dict, by_mile: dict) -> list[dict]:
    out = []
    for it in sorted(items.values(), key=lambda i: num(i["id"])):
        if it["after_field"] is None or it["retired"]:
            continue
        for tok in it["after_field"]:
            if not ID.match(tok):
                out.append({"rule": "S8", "item": it["id"], "detail": f"After value '{tok}' is not an ID or none"})
            elif tok == "none":
                continue
            elif tok == it["id"] or tok == it["milestone"]:
                out.append({"rule": "S8", "item": it["id"], "detail": f"After names its own {'item' if tok == it['id'] else 'milestone'}"})
            elif tok.startswith("ROAD-") and (tok not in items or items[tok]["retired"]):
                out.append({"rule": "S8", "item": it["id"], "detail": f"After target {tok} is not a live item"})
            elif tok.startswith("MILE-") and (tok not in by_mile or by_mile[tok]["retired"]):
                out.append({"rule": "S8", "item": it["id"], "detail": f"After target {tok} is not a live milestone"})
    # cycles over expanded edges
    color: dict[str, int] = {}
    stack: list[str] = []
    seen_cycles = set()

    def visit(n: str) -> None:
        color[n] = 1
        stack.append(n)
        for tok in items[n]["after"]:
            for p in expand(items, by_mile, tok):
                if color.get(p) == 1:
                    cyc = stack[stack.index(p):]
                    key = frozenset(cyc)
                    if key not in seen_cycles:
                        seen_cycles.add(key)
                        out.append({"rule": "S8", "item": min(cyc, key=num), "detail": "cycle: " + " → ".join(cyc + [p])})
                elif color.get(p) is None:
                    visit(p)
        stack.pop()
        color[n] = 2

    for rid in sorted(items, key=num):
        if not items[rid]["retired"] and color.get(rid) is None:
            visit(rid)
    return out


def item_states(root: Path, items: dict, by_mile: dict, feats: list[dict]) -> None:
    by_road = {}
    for f in feats:
        for r in f["roads"]:
            by_road.setdefault(r, f)
    pending = set()
    skills = root / ".skills"
    if skills.is_dir():
        for p in skills.iterdir():
            m = re.match(r"_pending-road(\d+)", p.name)
            if m:
                pending.add(f"ROAD-{int(m.group(1))}")
    for it in items.values():
        f = by_road.get(it["id"])
        it["feature"] = f["code"] if f else None
        it["status"] = f["status"] if f else None
        if it["retired"]:
            it["state"] = "retired"
        elif it["deferred"]:
            it["state"] = "deferred"
        elif by_mile[it["milestone"]]["commitment"] == "Closed" or (f and f["status"] in DONE):
            it["state"] = "done"
        elif f and f["status"] == "In-progress":
            it["state"] = "building"
        elif f:
            it["state"] = "specced"
        elif it["id"] in pending:
            it["state"] = "framing"
        else:
            it["state"] = "unspecced"


def graph(items: dict, by_mile: dict) -> dict:
    live = {k: v for k, v in items.items() if v["state"] not in ("retired", "deferred")}

    def preds(rid: str) -> list[str]:
        out = []
        for tok in live[rid]["after"]:
            out += [p for p in expand(items, by_mile, tok) if p in live]
        return sorted(set(out), key=num)

    open_ = {k for k, v in live.items() if v["state"] != "done"}
    blocked, ready = {}, []
    for rid in sorted(open_, key=num):
        unmet = [p for p in preds(rid) if p in open_]
        if unmet:
            blocked[rid] = unmet
        elif live[rid]["state"] != "building":
            ready.append(rid)

    # longest chain of unfinished items; ties break on lowest IDs
    memo: dict[str, list[str]] = {}

    def chain(rid: str, guard: frozenset = frozenset()) -> list[str]:
        if rid in memo:
            return memo[rid]
        best: list[str] = []
        for p in preds(rid):
            if p in open_ and p not in guard:
                c = chain(p, guard | {rid})
                if len(c) > len(best):
                    best = c
        memo[rid] = best + [rid]
        return memo[rid]

    critical: list[str] = []
    for rid in sorted(open_, key=num):
        c = chain(rid)
        if len(c) > len(critical):
            critical = c

    layer = {}
    for rid in sorted(open_, key=num):
        layer[rid] = len(chain(rid)) - 1

    dependents: dict[str, set] = {k: set() for k in live}
    for rid in live:
        for p in preds(rid):
            dependents[p].add(rid)

    def downstream(rid: str, seen: set | None = None) -> set:
        seen = seen if seen is not None else set()
        for d in dependents[rid]:
            if d not in seen:
                seen.add(d)
                downstream(d, seen)
        return seen

    unlock = {rid: len(downstream(rid)) for rid in sorted(open_, key=num)}

    active = [r for r in sorted(open_, key=num) if r in ready or live[r]["state"] == "building"]
    conflicts = []
    for i, a in enumerate(active):
        for b in active[i + 1:]:
            shared = overlap(live[a]["surfaces"], live[b]["surfaces"])
            if shared:
                conflicts.append({"items": [a, b], "paths": shared})

    return {
        "ready": ready, "blocked": blocked, "critical_path": critical,
        "layer": layer, "unlocks": unlock, "conflicts": conflicts,
        "edges": [[p, rid] for rid in sorted(live, key=num) for p in preds(rid)],
    }


# A shared container directory says nothing about a collision: two items under
# `backend/crates/` or `frontend/src/apps/` usually touch different crates and apps.
CONTAINERS = {"src", "crates", "apps", "packages", "lib", "app", "components", "features",
              "services", "modules", "pages", "internal", "pkg", "cmd"}


def overlap(a: list[str], b: list[str]) -> list[str]:
    """Shared paths between two surface lists: two or more segments, not ending in a
    container directory, and never planning ephemera under .skills/."""
    out = set()
    for x in a:
        for y in b:
            if x == y or x.startswith(y.rstrip("/") + "/") or y.startswith(x.rstrip("/") + "/"):
                shared = min(x, y, key=len)
                segs = [s for s in shared.split("/") if s]
                if len(segs) >= 2 and segs[-1] not in CONTAINERS and segs[0] != ".skills":
                    out.add(shared)
    return sorted(out)


# ---------------------------------------------------------------- history


def transitions(root: Path, since: str) -> list[dict]:
    # First-parent history dated by commit date: a status counts on the day it landed
    # on this branch, not the day a feature branch authored it.
    log = run_git(root, "log", "--first-parent", "--diff-merges=first-parent", "--reverse", "-p",
                  "--unified=0", f"--since={since}T00:00:00", "--format=@@commit %H %cd", "--date=short",
                  "--", "docs/specs/INDEX.md", "docs/specs/catalog/")
    events = []
    date = sha = None
    minus: dict[str, str] = {}
    plus: dict[str, str] = {}

    def flush() -> None:
        for code, new in plus.items():
            old = minus.get(code)
            if old != new:
                events.append({"date": date, "sha": sha[:9], "code": code, "from": old, "to": new})

    for line in log.splitlines():
        if line.startswith("@@commit "):
            if sha:
                flush()
            _, sha, date = line.split()
            minus, plus = {}, {}
            continue
        if line[:1] in "+-" and not line.startswith(("+++", "---")):
            m = ROW.match(line[1:])
            if m and not m.group(1):
                (plus if line[0] == "+" else minus)[m.group(2)] = m.group(5)
    if sha:
        flush()
    return events


def roadmap_ids_at(root: Path, before: str) -> tuple[set[str], set[str], dict[str, str]] | None:
    """(live, deferred, slugs) for ROAD-N at the last commit before a date."""
    rev = run_git(root, "rev-list", "-1", "--first-parent", f"--before={before}T00:00:00", "HEAD").strip()
    if not rev:
        return None
    text = run_git(root, "show", f"{rev}:docs/roadmap/INDEX.md")
    _, items = parse_roadmap(text)
    live = {k for k, v in items.items() if not v["retired"] and not v["deferred"]}
    return live, {k for k, v in items.items() if v["deferred"]}, {k: v["slug"] for k, v in items.items()}


def window(root: Path, since: str, events: list[dict], items: dict, adrs: list[dict]) -> dict:
    inside = [e for e in events if e["date"] >= since]
    last: dict[str, dict] = {}
    for e in inside:
        last[e["code"]] = e
    finished = sorted({e["code"] for e in inside if e["to"] in DONE and last[e["code"]]["to"] in DONE})
    started = sorted({e["code"] for e in inside if e["to"] == "In-progress"} - set(finished))
    specced = sorted({e["code"] for e in inside if e["from"] is None})
    before = roadmap_ids_at(root, since)
    live_now = {k for k, v in items.items() if v["state"] not in ("retired", "deferred")}
    new = revived = dropped = []
    slugs: dict[str, str] = {}
    if before is not None:
        was_live, was_deferred, old_slugs = before
        slugs = {r: old_slugs[r] for r in sorted(was_live - live_now, key=num) if r in old_slugs}
        new = sorted(live_now - was_live - was_deferred, key=num)
        revived = sorted(live_now & was_deferred, key=num)
        dropped = sorted(was_live - live_now, key=num)
    subjects = run_git(root, "log", f"--since={since}T00:00:00", "--format=%s").splitlines()
    scopes: dict[str, int] = {}
    merges = 0
    for s in subjects:
        if s.startswith("Merge "):
            merges += 1
            continue
        m = re.match(r"^(\w+)(?:\(([^)]+)\))?!?:", s)
        key = f"{m.group(1)}({m.group(2)})" if m and m.group(2) else (m.group(1) if m else "other")
        scopes[key] = scopes.get(key, 0) + 1
    per_commit: dict[str, dict] = {}
    for ev in inside:
        if ev["to"] in DONE and ev["code"] in finished:
            per_commit.setdefault(ev["sha"], {"sha": ev["sha"], "date": ev["date"], "codes": []})["codes"].append(ev["code"])
    batches = [b | {"codes": sorted(b["codes"])} for b in per_commit.values() if len(b["codes"]) >= 3]
    return {
        "since": since, "finished": finished, "batches": batches, "started": started, "specced": specced,
        "events": inside, "roadmap_new": new, "roadmap_revived": revived, "roadmap_dropped": dropped, "roadmap_slugs": slugs,
        "adrs": [a["id"] for a in adrs if a["date"] and a["date"] >= since],
        "commits": len(subjects), "merges": merges,
        "scopes": sorted(scopes.items(), key=lambda kv: (-kv[1], kv[0]))[:15],
    }


# ---------------------------------------------------------------- adr / architecture


def parse_adrs(root: Path) -> list[dict]:
    out = []
    d = root / "docs/decisions"
    if not d.is_dir():
        return out
    for p in sorted(d.glob("*.md")):
        n = re.match(r"^(\d+)-", p.name)
        if not n:
            continue
        text = p.read_text()
        heading = re.search(r"(?m)^# (.*)$", text)
        title = re.sub(r"^(ADR-)?\d+\s*[:—–-]\s*", "", heading.group(1).strip()) if heading else p.stem
        status = re.search(r"(?m)^\*\*Status:\*\*\s*(.+)$", text)
        date = re.search(r"(?m)^\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})", text)
        sup = re.findall(r"(?m)^\*\*(Supersedes|Superseded by|Extends):\*\*\s*(.+)$", text)
        out.append({
            "id": f"ADR-{n.group(1)}", "title": title, "file": p.name,
            "status": status.group(1).strip() if status else None,
            "date": date.group(1) if date else None,
            "links": [{"kind": k, "to": re.findall(r"ADR-\d+", v)} for k, v in sup],
        })
    return out


def parse_architecture(root: Path, feats: list[dict]) -> list[dict]:
    p = root / "docs/design/system.md"
    if not p.exists():
        return []
    arch = []
    for m in re.finditer(r"(?m)^- (~~)?\*\*(ARCH-\d+)\*\*(~~)?\s+(.+(?:\n[ \t]+\S.*)*)", p.read_text()):
        text = re.sub(r"\s+", " ", m.group(4)).strip()
        text = re.sub(r"\*\*|`", "", text)
        title = re.split(r"(?<=[.;])\s", text, maxsplit=1)[0]
        arch.append({"id": m.group(2), "title": title, "retired": bool(m.group(1)), "respected_by": []})
    by_id = {a["id"]: a for a in arch}
    for f in feats:
        if not f["spec"]:
            continue
        design = root / f["spec"] / "design.md"
        if design.exists():
            cited = set()
            for line in re.findall(r"(?m)Respects:?\s*(.*)$", design.read_text()):
                cited |= set(re.findall(r"ARCH-\d+", line))
            for c in sorted(cited, key=num):
                if c in by_id:
                    by_id[c]["respected_by"].append(f["code"])
    return arch


# ---------------------------------------------------------------- main


def extract(root: Path | str, today: str | None = None) -> dict:
    root = Path(root)
    today_d = dt.date.fromisoformat(today) if today else dt.date.today()
    week = (today_d - dt.timedelta(days=6)).isoformat()    # 7 calendar days incl. today
    month = (today_d - dt.timedelta(days=29)).isoformat()  # 30 calendar days incl. today

    roadmap = root / "docs/roadmap/INDEX.md"
    milestones, items = parse_roadmap(roadmap.read_text()) if roadmap.exists() else ([], {})
    by_mile = {m["id"]: m for m in milestones}
    feats = parse_catalog(root)
    for f in feats:
        ledger_progress(root, f)
    resolve(items, by_mile)
    item_states(root, items, by_mile, feats)
    findings = structural_findings(items, by_mile)
    for rid, it in items.items():
        if it.get("duplicate"):
            findings.append({"rule": "S1", "item": rid, "detail": "defined more than once"})
    for ms in milestones:
        if ms["table_commitment"] and ms["table_commitment"] != ms["commitment"]:
            findings.append({"rule": "S7", "item": ms["id"],
                             "detail": f"table says {ms['table_commitment']}, block says {ms['commitment']}"})
    g = graph(items, by_mile)
    g["closable"] = [
        ms["id"] for ms in milestones
        if not ms["retired"] and ms["commitment"] != "Closed"
        and (live := [items[r] for r in ms["members"] if items[r]["state"] not in ("retired", "deferred")])
        and all(i["state"] == "done" for i in live)
    ]
    adrs = parse_adrs(root)
    seen_adr: dict[str, int] = {}
    for a in adrs:
        seen_adr[a["id"]] = seen_adr.get(a["id"], 0) + 1
    findings += [{"rule": "ADR", "item": k, "detail": f"{v} files carry this number"} for k, v in seen_adr.items() if v > 1]
    history = (today_d - dt.timedelta(days=55)).isoformat()  # 8 whole weeks incl. today
    events = transitions(root, history)
    weekly = []
    for k in range(7, -1, -1):
        end = today_d - dt.timedelta(days=7 * k)
        start = end - dt.timedelta(days=6)
        done = {e["code"] for e in events if start.isoformat() <= e["date"] <= end.isoformat() and e["to"] in DONE}
        weekly.append({"start": start.isoformat(), "end": end.isoformat(), "finished": len(done)})
    for f in feats:
        starts = [e["date"] for e in events if e["code"] == f["code"] and e["to"] == "In-progress"]
        f["started"] = starts[-1] if starts else None
    live = [v for v in items.values() if v["state"] not in ("retired", "deferred")]
    for ms in milestones:
        mine = [items[r] for r in ms["members"] if items[r]["state"] not in ("retired", "deferred")]
        ms["counts"] = {s: sum(1 for i in mine if i["state"] == s) for s in
                        ("done", "building", "specced", "framing", "unspecced")}
    domains: dict[str, dict] = {}
    for f in feats:
        d = domains.setdefault(f["domain"], {"domain": f["domain"], "counts": {}, "features": []})
        d["counts"][f["status"]] = d["counts"].get(f["status"], 0) + 1
        d["features"].append(f["code"])

    return {
        "schema": 1,
        "repo": root.resolve().name,
        "today": today_d.isoformat(),
        "head": run_git(root, "rev-parse", "--short", "HEAD").strip(),
        "branch": run_git(root, "rev-parse", "--abbrev-ref", "HEAD").strip(),
        "has_roadmap": roadmap.exists(),
        "milestones": milestones,
        "items": sorted(items.values(), key=lambda i: num(i["id"])),
        "features": feats,
        "domains": sorted(domains.values(), key=lambda d: d["domain"]),
        "graph": g,
        "weekly": weekly,
        "windows": {
            "week": window(root, week, events, items, adrs),
            "month": window(root, month, events, items, adrs),
        },
        "adrs": adrs,
        "architecture": parse_architecture(root, feats),
        "findings": findings,
        "coverage": {
            "live_items": len(live),
            "with_after": sum(1 for i in live if i["after_source"] == "field"),
        },
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("root")
    ap.add_argument("--today")
    ap.add_argument("--out")
    a = ap.parse_args()
    snap = extract(a.root, a.today)
    text = json.dumps(snap, indent=1, ensure_ascii=False)
    if a.out:
        Path(a.out).parent.mkdir(parents=True, exist_ok=True)
        Path(a.out).write_text(text)
    else:
        sys.stdout.write(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
