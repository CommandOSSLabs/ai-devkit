#!/usr/bin/env python3
"""owner-notice.py <base> [tasks.md | CODE] — changes in <base>...HEAD that another owner holds.

One tab-separated row per changed path, then "# clean" or "# cross-owner: N". Read-only.

    cross-owner  <CODE|->  <owner>  <path>  <requirement IDs added/changed/struck, or ->

A path belongs to the feature whose spec directory holds it, else to every card whose
Surface roots cover it. Its owner is the card's Owner cell, else the shard's `Owner:`
line, else the first `project.md` Ownership note that matches the path. A path is this
branch's own when one of its cards is the branch's feature, or its owner is that
feature's owner. No owner anywhere → no row: an unowned path is never notified.
The editing plan's own Files block is not read: a plan names the files it touches,
including another team's.
"""
import re, subprocess, sys
from pathlib import Path

base = sys.argv[1]
arg = sys.argv[2] if len(sys.argv) > 2 else "-"  # a patch with no tasks.md: pass its CODE, or nothing
git = lambda *a: subprocess.run(["git", *a], check=True, capture_output=True, text=True).stdout
own = arg
if arg.endswith(".md"):
    m = re.search(r"^Feature code:\s*`?([A-Z][A-Z0-9-]*)`?", Path(arg).read_text(), re.M)
    own = m.group(1) if m else ""

cards = {}  # CODE → {"spec": dir, "owner": str, "roots": [..]}
for shard in sorted(Path("docs/specs/catalog").glob("*.md")) if Path("docs/specs/catalog").is_dir() else []:
    text = shard.read_text()
    m = re.search(r"^Owner:\s*(\S+)", text, re.M)
    shard_owner = m.group(1) if m else ""
    header, lines = None, text.splitlines()
    for n, line in enumerate(lines):
        if not line.startswith("|"):
            continue  # a blank line inside a catalog table does not end it
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if n + 1 < len(lines) and re.fullmatch(r"\|?[\s:|-]+\|?", lines[n + 1].strip()) and "-" in lines[n + 1]:
            header = [c.lower() for c in cells]  # a header is the row a |---| line follows
            continue
        if header is None:
            continue
        if set("".join(cells)) <= set("-: "):
            continue
        row = dict(zip(header, cells))
        code = row.get("code", "")
        if not re.fullmatch(r"[A-Z][A-Z0-9-]*", code):
            continue
        spec = row.get("spec", "").strip("`")
        spec = str((shard.parent / spec).resolve().relative_to(Path.cwd().resolve())) + "/" if spec else ""
        owner = row.get("owner", "").strip()
        owner = owner if owner not in ("", "—", "-") else shard_owner
        roots = re.findall(r"`([^`]+)`", row.get("surface roots", ""))
        cards[code] = {"spec": spec, "owner": owner, "roots": roots}

notes = []  # (path or dir, owner) from project.md Ownership notes
pm = Path("docs/agents/project.md")
if pm.exists():
    sect = re.search(r"^### Ownership notes.*?\n(.*?)(?=^#)", pm.read_text() + "\n#", re.M | re.S)
    for p, o in re.findall(r"^- `([^`]+)`\s*(?:→|->)\s*(\S+)", sect.group(1) if sect else "", re.M):
        notes.append((p, o))

covers = lambda root, path: path == root or path.startswith(root.rstrip("/") + "/")
own_owner = cards.get(own, {}).get("owner", "")
rows = []
for path in git("diff", "--name-only", f"{base}...HEAD").split():
    hit = [c for c, v in cards.items() if v["spec"] and path.startswith(v["spec"])]
    hit = hit or [c for c, v in cards.items() if any(covers(r, path) for r in v["roots"])]
    if own in hit:
        continue
    found = [(c, cards[c]["owner"]) for c in hit if cards[c]["owner"]]
    if not found:
        found = [("-", o) for p, o in notes if covers(p, path)][:1]
    for code, owner in found:
        if owner == own_owner:
            continue
        ids = "-"
        if code != "-" and path.endswith("requirements.md"):
            diff = git("diff", "-U0", f"{base}...HEAD", "--", path)
            marks = {}
            for sign, i in re.findall(rf"^([+-]).*?\*\*({re.escape(code)}-\d+(?:\.\d+)*)\*\*", diff, re.M):
                marks[i] = marks.get(i, "") + sign
            ids = ", ".join(f"{i} {'changed' if len(set(s)) > 1 else ('added' if s[0] == '+' else 'struck')}"
                            for i, s in marks.items()) or "-"
        rows.append(("cross-owner", code, owner, path, ids))

for r in rows:
    print("\t".join(r))
print(f"# cross-owner: {len(rows)}" if rows else "# clean")
