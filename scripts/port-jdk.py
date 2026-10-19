#!/usr/bin/env python3
"""port-jdk.py --jdk DIR --out DIR [--only NAME ...] [--cmk DIR]

Converts Engineer Pack (jdk) skills into this kit's package shape, per ADR 0001 and
scripts/port-map.json. Mechanical and re-runnable: the same input gives the same output.
Every judgment call (merging the cmk behaviors a ported body lacks, writing a merged
skill's router SKILL.md, trimming) is a hand edit made afterwards, in its own commit.

  --jdk   the jdk repo (holds skills/<category>/<name>/ and templates/)
  --out   where to write skills/<cmk-name>/ (pass the repo root to apply in place)
  --only  limit to these cmk names (default: every mapped skill)
  --cmk   this repo, read for existing versions (default: the repo holding this script)

What it does, per skill:
  frontmatter   name: cmk:<name>, one-line description, version, then
                disable-model-invocation; a replaced skill's version is the next major
                of the cmk version it replaces
  layout        sibling .md files -> references/; templates/ -> references/templates/;
                scripts/ and references/ copied as they are
  names         `jdk-name`, /jdk-name and bare hyphenated jdk names -> cmk names
  pointers      ../<skill>/<file> and skills/<cat>/<skill>/<file> -> the file's new
                home, as references/<f> (same package) or cmk:<x>'s references/<f>
  doc paths     the "paths" table of port-map.json (CONTEXT.md, docs/adr, ...)
  merges        a merged skill's SKILL.md becomes references/<as>.md of its target; its
                TESTS.md and eval.json are appended to the target's
Prints a report of what still needs a hand: lines over 150, flag patterns, and unmapped
relative paths.
"""
import argparse, json, os, re, shutil, subprocess, sys
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("--jdk", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--only", nargs="*")
ap.add_argument("--cmk", default=str(Path(__file__).resolve().parent.parent))
a = ap.parse_args()

JDK, OUT, CMK = Path(a.jdk).expanduser(), Path(a.out).expanduser(), Path(a.cmk)
cfg = json.loads((Path(__file__).parent / "port-map.json").read_text())
MAP = {k: v for k, v in cfg["skills"].items() if v.get("type") != "out"}
SHA = subprocess.run(["git", "-C", str(JDK), "rev-parse", "--short", "HEAD"],
                     capture_output=True, text=True).stdout.strip() or "unknown"

# jdk short name -> (source dir, map entry)
SRC = {k.split("/")[1]: (JDK / "skills" / k, v) for k, v in MAP.items()}
# Words that are also ordinary prose: rewritten only as `name` or /name, never bare.
AMBIGUOUS = {n for n in SRC if "-" not in n} | {"test-first", "root-cause", "no-comments"}
SIBLING_KEEP = {"SKILL.md", "TESTS.md", "eval.json", "EVAL.md"}


def entry_target(short):
    return SRC[short][1]["cmk"]


def merged_as(short):
    e = SRC[short][1]
    return e["as"] if e["type"] == "merge" else None


def dest_name(short, rel, taken):
    """Where file rel (relative to jdk skill dir) lands inside its target package."""
    if rel == "SKILL.md":
        return f"references/{merged_as(short)}.md" if merged_as(short) else "SKILL.md"
    if rel.startswith(("references/", "scripts/")):
        return rel
    if rel.startswith("templates/"):
        return "references/" + rel
    name = f"references/{rel}"
    if name in taken.get(entry_target(short), {}) and taken[entry_target(short)][name] != short:
        name = f"references/{merged_as(short) or short}-{rel}"
    return name


# Plan every file's destination first, so pointers between packages can be rewritten.
taken, plan = {}, {}  # taken[target][dest] = short; plan[short] = {rel: dest}
order = sorted(SRC, key=lambda s: (merged_as(s) is not None, s))  # primaries claim names first
for short in order:
    d, e = SRC[short]
    if not d.is_dir():
        sys.exit(f"missing jdk skill dir: {d}")
    plan[short] = {}
    for p in sorted(d.rglob("*")):
        if p.is_dir() or "__pycache__" in p.parts:
            continue
        rel = str(p.relative_to(d))
        if rel in ("TESTS.md", "eval.json", "EVAL.md"):
            continue
        dst = dest_name(short, rel, taken)
        taken.setdefault(e["cmk"], {})[dst] = short
        plan[short][rel] = dst


def home(short, rel, from_target):
    """How a file of jdk skill `short` is cited from inside package `from_target`."""
    tgt = entry_target(short)
    dst = plan[short].get(rel)
    if dst is None:
        return None
    if dst == "SKILL.md":
        return f"`cmk:{tgt}`" if tgt != from_target else "`SKILL.md`"
    return f"`{dst}`" if tgt == from_target else f"`cmk:{tgt}`'s `{dst}`"


def cite(short, from_target):
    """How a whole jdk skill is cited from inside package `from_target`."""
    tgt, as_ = entry_target(short), merged_as(short)
    if as_:
        return f"`references/{as_}.md`" if tgt == from_target else f"`cmk:{tgt}`'s `references/{as_}.md`"
    return f"`cmk:{tgt}`"


NAME_ALT = "|".join(sorted(map(re.escape, SRC), key=len, reverse=True))


def rewrite(text, short, target, is_md=True):
    # 1. relative pointers into another skill: ../x/f, ../../cat/x/f, skills/cat/x/f
    def rel_ptr(m):
        other, f = m.group("skill"), m.group("file")
        if other not in SRC:
            return m.group(0)
        h = home(other, f, target)
        return h.strip("`") if h and not m.group("tick") else (h or m.group(0))
    text = re.sub(r"(?P<tick>`?)(?:\.\./)+(?:[a-z]+/)?(?P<skill>[a-z][a-z0-9-]*)/(?P<file>[A-Za-z0-9_./-]*[A-Za-z0-9_/-])(?P=tick)(?=[\s,.;:)\]]|$)",
                  rel_ptr, text)
    text = re.sub(r"(?P<tick>`?)skills/[a-z]+/(?P<skill>[a-z][a-z0-9-]*)/(?P<file>[A-Za-z0-9_./-]*[A-Za-z0-9_/-])(?P=tick)(?=[\s,.;:)\]]|$)",
                  rel_ptr, text)
    # 2. template seed resolution chain -> this package's references/templates/
    text = re.sub(r"Resolve pack seeds in this order, first path that exists:\s*\(1\).*?relative to this\s+SKILL\.md\.",
                  "Pack seeds live in `references/templates/`.", text, flags=re.S)
    text = re.sub(r"(?:,\s+resolving\s+pack\s+seeds\s+in\s+order,|\s*—|\s*\()?\s*first\s+path\s+that\s+exists:.*?"
                  r"`\.\./\.\./\.\./templates`(?:\s+relative\s+to\s+this\s+SKILL\.md)?\)?",
                  "", text, flags=re.S)
    text = re.sub(r"\(\d\)\s*`?templates/`?\s+beside the reading SKILL\.md,\s*\(\d\)\s*`\$\{CLAUDE_PLUGIN_ROOT\}/templates/([\w.-]+)`\s+when",
                  r"`references/templates/\1` when", text)
    text = re.sub(r"`?\.\./\.\./\.\./templates/([A-Za-z0-9_.-]+)`?", r"`references/templates/\1`", text)
    # 3. this skill's own siblings and templates
    for rel, dst in sorted(plan[short].items(), key=lambda kv: -len(kv[0])):
        if rel == "SKILL.md" or dst == rel or rel.startswith(("references/", "scripts/")):
            continue
        r = re.escape(rel)
        text = re.sub(rf"`{r}`\s+(?:beside|next to) this (?:file|SKILL\.md)", f"`{dst}`", text)
        text = re.sub(rf"(?<![\w/.-]){r}(?![\w/-])", dst, text)
    # 4. skill names
    if is_md:
        text = re.sub(rf"(?<![\w/.-])/({NAME_ALT})(?![\w-])", lambda m: f"/cmk:{entry_target(m.group(1))}", text)
        text = re.sub(rf"`({NAME_ALT})`", lambda m: cite(m.group(1), target), text)
        bare = lambda m: m.group(1) if m.group(1) in AMBIGUOUS else cite(m.group(1), target).strip("`").replace("`'s `", "'s ")
        # Bare names change in prose only; inside a fenced block they may be paths or code.
        parts = re.split(r"(^```.*?^```)", text, flags=re.S | re.M)
        text = "".join(p if p.startswith("```") else re.sub(rf"(?<![\w/.`:-])({NAME_ALT})(?![\w/`-])", bare, p)
                       for p in parts)
    # 5. doc paths
    for old, new in cfg["paths"]:
        text = re.sub(rf"(?<![\w/.-]){re.escape(old)}", new, text)
    return text


def one_line_frontmatter(skill_md):
    t = skill_md.read_text()
    m = re.match(r"---\n(.*?)\n---\n", t, re.S)
    fm, body = m.group(1), t[m.end():]
    fields, key = {}, None
    for line in fm.splitlines():
        km = re.match(r"([a-z-]+):\s*(.*)", line)
        if km and not line.startswith(" "):
            key = km.group(1); fields[key] = km.group(2).strip()
        elif key:
            fields[key] += " " + line.strip()
    d = re.sub(r"\s+", " ", re.sub(r"^[>|]-?\s*", "", fields.get("description", ""))).strip()
    return fields, d, body


def cmk_version(name):
    p = CMK / "skills" / name / "SKILL.md"
    if not p.exists():
        return None
    m = re.search(r"^version:\s*(\d+)\.", p.read_text(), re.M)
    return f"{int(m.group(1)) + 1}.0.0" if m else None


report = {}
targets = sorted({e["cmk"] for _, e in SRC.values()})
if a.only:
    targets = [t for t in targets if t in a.only]
for target in targets:
    members = [s for s in order if entry_target(s) == target]
    primary = next((s for s in members if not merged_as(s)), None)
    pkg = OUT / "skills" / target
    if pkg.exists():
        shutil.rmtree(pkg)
    pkg.mkdir(parents=True)
    tests, evals, notes = [], [], []
    base = CMK / "skills" / target
    if primary is None and base.is_dir():
        # Merged into a skill this kit already has: its package is the base.
        shutil.copytree(base, pkg, dirs_exist_ok=True)
        if (pkg / "TESTS.md").exists():
            tests.append((pkg / "TESTS.md").read_text())
        if (pkg / "eval.json").exists():
            evals.extend(json.loads((pkg / "eval.json").read_text()))
        notes.append(f"merged into the existing cmk:{target}: point its SKILL.md at the new references by hand")
    for short in members:
        d, e = SRC[short]
        for rel, dst in plan[short].items():
            src, out = d / rel, pkg / dst
            out.parent.mkdir(parents=True, exist_ok=True)
            if rel == "SKILL.md":
                fields, desc, body = one_line_frontmatter(src)
                body = rewrite(body, short, target)
                if dst == "SKILL.md":
                    ver = cmk_version(target) if e["type"] == "replace" else fields.get("version")
                    head = [f"name: cmk:{target}", f"description: {rewrite(desc, short, target)}", f"version: {ver}"]
                    if fields.get("disable-model-invocation") == "true":
                        head.append("disable-model-invocation: true")
                    out.write_text("---\n" + "\n".join(head) + "\n---\n" + body)
                else:
                    out.write_text(f"<!-- Ported from jdk `{short}` {fields.get('version')} (ADR 0001). -->\n" + body.lstrip("\n"))
            elif src.suffix in (".md", ".txt"):
                out.write_text(rewrite(src.read_text(), short, target))
            elif src.suffix in (".py", ".sh"):
                out.write_text(rewrite(src.read_text(), short, target, is_md=False))
                shutil.copymode(src, out)
            else:
                shutil.copy2(src, out)
        if (d / "TESTS.md").exists():
            t = rewrite((d / "TESTS.md").read_text(), short, target)
            tests.append(t if short == primary else f"\n\n## From jdk `{short}` (now `references/{merged_as(short)}.md`)\n\n" + re.sub(r"^#", "##", t, flags=re.M))
        if (d / "eval.json").exists():
            for ev in json.loads((d / "eval.json").read_text()):
                ev = json.loads(rewrite(json.dumps(ev, ensure_ascii=False), short, target))
                if short != primary and str(ev.get("derived_from", "")).startswith("SKILL.md"):
                    ev["derived_from"] = f"references/{merged_as(short)}.md" + ev["derived_from"][len("SKILL.md"):]
                evals.append(ev)
    if primary is None and not base.is_dir():
        refs = "\n".join(f"- `references/{merged_as(s)}.md` (jdk `{s}`)" for s in members)
        (pkg / "SKILL.md").write_text(
            f"---\nname: cmk:{target}\ndescription: TODO hand-write the router description\nversion: 1.0.0\n---\n\n"
            f"# {target}\n\nTODO: hand-written router. Merged from:\n\n{refs}\n")
        notes.append("no primary: SKILL.md is a stub to hand-write")
    if tests:
        hdr = "" if primary is None and base.is_dir() else f"<!-- Ported from jdk @ {SHA} (ADR 0001); skill names rewritten to cmk names. -->\n"
        (pkg / "TESTS.md").write_text(hdr + "".join(tests))
    if evals:
        for i, ev in enumerate(evals, 1):
            ev["eval_id"] = i
        (pkg / "eval.json").write_text(json.dumps(evals, indent=2, ensure_ascii=False) + "\n")
    # report
    flags = []
    for f in sorted(pkg.rglob("*")):
        if f.is_dir() or f.suffix not in (".md", ".py", ".sh", ".json") or "testdata" in f.parts or f.name == "TESTS.md":
            continue
        for no, line in enumerate(f.read_text(errors="replace").splitlines(), 1):
            for why, pat in cfg["flag_patterns"].items():
                if re.search(pat, line):
                    flags.append(f"{f.relative_to(OUT)}:{no}: {why}")
    # A core skill that requires a pack skill dead-ends in a repo without that pack.
    if all(SRC[m][1]["tier"] == "core" for m in members):
        packs = {e["cmk"] for _, e in SRC.values() if e["tier"] != "core"}
        for f in [pkg / "SKILL.md"] + sorted((pkg / "references").rglob("*.md")):
            for no, line in enumerate(f.read_text().splitlines(), 1):
                if "REQUIRED SUB-SKILL" in line:
                    for x in sorted(set(re.findall(r"cmk:([a-z][a-z0-9-]*)", line)) & packs):
                        flags.append(f"{f.relative_to(OUT)}:{no}: core skill requires pack skill cmk:{x}")
    lines = len((pkg / "SKILL.md").read_text().splitlines())
    report[target] = {"from": members, "lines": lines, "flags": flags, "notes": notes}

for t, r in report.items():
    over = f" — {r['lines']} lines (>150: ratchet or trim)" if r["lines"] > 150 else ""
    print(f"cmk:{t} <- {', '.join(r['from'])}{over}")
    for n in r["notes"]:
        print(f"  note: {n}")
    for fl in r["flags"][:12]:
        print(f"  flag: {fl}")
    if len(r["flags"]) > 12:
        print(f"  flag: … {len(r['flags']) - 12} more")
