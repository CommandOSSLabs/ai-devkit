#!/usr/bin/env python3
"""Structural posture of a repo, as numbers a later scan can compare against.

Run from inside the repo being scanned:
    python3 <skill-root>/scripts/posture.py [--days 180] [--repo PATH]

Writes .skills/scan-architecture/posture.json and prints the strip. When a
previous posture exists, every number carries its delta.

No thresholds, by design: file size confounds most code metrics (El Emam et al.,
TSE 2001) and individual smells stop predicting cost once size and churn are held
constant (Sjoberg et al., TSE 2013). Coupling and where change concentrates are
what the evidence supports watching (DORA; Mo/Cai/Kazman, WICSA 2015; Tornhill &
Borg, TechDebt 2022).
"""
import argparse, collections, json, os, re, subprocess, sys

MANIFESTS = ("Cargo.toml", "package.json", "go.mod", "pyproject.toml", "pom.xml", "build.gradle")
SOURCE = re.compile(r"\.(rs|ts|tsx|js|jsx|py|go|java|kt|rb|php|cs|swift|sql|sh)$")
GENERATED = re.compile(r"\.gen\.|/generated\.|\.generated\.|/\.sqlx/|\.pb\.|_pb2\.")
RULE_ID = re.compile(r"\*\*([A-Z][A-Z0-9]{1,7}-\d+)\*\*")


def git(root, *a):
    return subprocess.run(["git", "-C", root, *a], capture_output=True, text=True).stdout


def module_of(root, path):
    """Nearest ancestor holding a manifest; else the first two path segments."""
    d = os.path.dirname(path)
    while d:
        if any(os.path.exists(os.path.join(root, d, m)) for m in MANIFESTS):
            return d
        d = os.path.dirname(d)
    parts = path.split("/")
    return "/".join(parts[:2]) if len(parts) > 2 else (parts[0] if parts else "root")


def median(xs):
    if not xs:
        return 0
    s = sorted(xs); m = len(s) // 2
    return s[m] if len(s) % 2 else round((s[m - 1] + s[m]) / 2, 1)


def rules(root):
    """Stated rule IDs, and which of them a check outside the docs refers to."""
    docs, total, mechanised, prose = [], [], [], []
    for base, _, files in os.walk(os.path.join(root, "docs")):
        for f in files:
            if f.endswith(".md"):
                docs.append(os.path.join(base, f))
    for path in docs:
        if "/docs/architecture/" not in path.replace(os.sep, "/"):
            continue  # a spec that merely discusses architecture is not the rule layer
        text = open(path, errors="ignore").read()
        for rid in RULE_ID.findall(text):
            if rid not in total:
                total.append(rid)
    # A citation in application code is not a check. Only a check-carrying file
    # (or an entry naming a runnable target) counts as mechanised.
    CHECKISH = ("scripts/", ".github/", "lefthook", "justfile", "Makefile", "moon.yml",
                ".config.", "eslint", "clippy.toml", "deny.toml")
    for rid in total:
        hit_files = git(root, "grep", "-l", rid, "--", ":!docs", ":!*.md").split()
        hits = [f for f in hit_files if any(c in f for c in CHECKISH)]
        entry = ""
        for path in docs:
            t = open(path, errors="ignore").read()
            m = re.search(r"\*\*" + re.escape(rid) + r"\*\*(.{0,900})", t, re.S)
            if m:
                entry = m.group(1); break
        named = re.search(r"scripts/[\w./-]+|`(just|make|npm run|moon run) [\w:-]+`", entry)
        (mechanised if (hits or named) else prose).append(rid)
    return total, mechanised, prose


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=180)
    ap.add_argument("--repo", default=".", help="repository to scan (default: the current directory)")
    a = ap.parse_args()
    root = git(a.repo, "rev-parse", "--show-toplevel").strip()
    if not root:
        print(f"posture: {os.path.abspath(a.repo)} is not a git repository.\n"
              "Run this from the repo you are scanning, or pass --repo PATH. "
              "The working directory decides which repo is measured, not where the script lives.",
              file=sys.stderr)
        return 2

    raw = git(root, "log", "--no-merges", f"--since={a.days} days ago", "--name-only",
              "--pretty=format:%x00%H")
    commits = []
    for block in raw.split("\x00"):
        if not block.strip():
            continue
        lines = block.strip().splitlines()
        paths = [p for p in lines[1:] if p.strip() and SOURCE.search(p) and not GENERATED.search(p)]
        if paths:
            commits.append(paths)

    spread, pairs, churn = [], collections.Counter(), collections.Counter()
    for paths in commits:
        uniq = sorted(set(paths))
        mods = {module_of(root, p) for p in uniq}
        spread.append(len(mods))
        for p in uniq:
            churn[p] += 1
        if len(uniq) > 12:            # a sweep is not a coupling signal
            continue
        for i, x in enumerate(uniq):
            for y in uniq[i + 1:]:
                if module_of(root, x) != module_of(root, y):
                    pairs[(x, y)] += 1

    total, mech, prose = rules(root)
    now = {
        "window_days": a.days,
        "commits": len(commits),
        "median_files_per_commit": median([len(set(p)) for p in commits]),
        "median_modules_per_commit": median(spread),
        "multi_module_commit_pct": round(100 * sum(1 for n in spread if n > 1) / len(commits), 1) if commits else 0,
        "rules_total": len(total),
        "rules_mechanised": len(mech),
        "rules_prose_only": prose,
        "cross_module_cochange": [{"a": x, "b": y, "commits": n} for (x, y), n in pairs.most_common(8) if n >= 3],
        "most_changed": [{"path": p, "commits": c} for p, c in churn.most_common(8)],
    }

    out = os.path.join(root, ".skills/scan-architecture/posture.json")
    prev = json.load(open(out)) if os.path.exists(out) else None
    os.makedirs(os.path.dirname(out), exist_ok=True)
    json.dump(now, open(out, "w"), indent=2)

    def d(key):
        if not prev or key not in prev:
            return ""
        delta = round(now[key] - prev[key], 1)
        return "" if delta == 0 else f"  ({delta:+})"

    print(f"POSTURE — {now['commits']} commits over {a.days} days"
          + (f", previous scan {prev['window_days']}d" if prev else ", no previous scan"))
    print(f"  rules mechanised            {len(mech)}/{len(total)}{d('rules_mechanised')}")
    print(f"  prose only                  {', '.join(prose) or 'none'}")
    print(f"  median files per commit     {now['median_files_per_commit']}{d('median_files_per_commit')}")
    print(f"  median modules per commit   {now['median_modules_per_commit']}{d('median_modules_per_commit')}")
    print(f"  commits spanning >1 module  {now['multi_module_commit_pct']}%{d('multi_module_commit_pct')}")
    print("  cross-module co-change:")
    for r in now["cross_module_cochange"]:
        print(f"    {r['commits']:>3}x  {r['a']}  +  {r['b']}")
    if not now["cross_module_cochange"]:
        print("    none at 3+ commits")
    print("  most changed files:")
    for r in now["most_changed"]:
        print(f"    {r['commits']:>3}  {r['path']}")
    print(f"\nwritten to {os.path.relpath(out, root)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
