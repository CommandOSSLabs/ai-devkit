#!/usr/bin/env python3
"""Checks skill-lint.sh delegates here: the size ratchet, one-line descriptions,
eval.json shape and anchors, hand-offs to user-invoked skills, bundled scripts,
and the files a skill package may hold at its root. Prints one violation per
line; skill-lint.sh collects them. Run from the lint root (the directory that
holds skills/ and scripts/).
"""
import glob
import json
import os
import re

out = []


def fail(msg):
    out.append(msg)


skills = sorted(d for d in glob.glob("skills/*") if os.path.isfile(f"{d}/SKILL.md"))
names = {os.path.basename(d) for d in skills}


def text(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def frontmatter(path):
    lines = text(path).splitlines()
    return {k.strip(): v.strip() for k, _, v in (l.partition(":") for l in lines[1:6]) if _}


user_invoked = {os.path.basename(d) for d in skills
                if frontmatter(f"{d}/SKILL.md").get("disable-model-invocation") == "true"}

# --- size ratchet ----------------------------------------------------------------
# A SKILL.md over 150 lines needs an entry in scripts/skill-size-budget.json equal to
# its current length. The entry may only go down: a body that grows fails, and an
# entry left above the real length fails until it is lowered.
LIMIT = 150
budget_file = "scripts/skill-size-budget.json"
budget = json.loads(text(budget_file)) if os.path.exists(budget_file) else {}
for d in skills:
    n = os.path.basename(d)
    lines = len(text(f"{d}/SKILL.md").splitlines())
    b = budget.get(n)
    if b is None:
        if lines > LIMIT:
            fail(f"{d}/SKILL.md: {lines} lines exceeds the {LIMIT}-line budget and has no ratchet entry")
    elif lines > b:
        fail(f"{d}/SKILL.md: {lines} lines grew past its ratchet budget of {b}")
    elif lines <= LIMIT:
        fail(f"{budget_file}: {n} is {lines} lines, within {LIMIT}; delete its entry")
    elif lines < b:
        fail(f"{budget_file}: {n} budget {b} is stale; lower it to {lines}")
for n in sorted(set(budget) - names):
    fail(f"{budget_file}: {n} has no skills/{n}/SKILL.md")

# --- one-line description --------------------------------------------------------
for d in skills:
    desc = frontmatter(f"{d}/SKILL.md").get("description", "")
    if desc in ("", ">", ">-", "|", "|-"):
        fail(f"{d}/SKILL.md: description must be one line on line 3, found '{desc}'")

# --- eval.json shape and anchors --------------------------------------------------
for d in skills:
    ev = f"{d}/eval.json"
    if not os.path.exists(ev):
        continue
    try:
        data = json.loads(text(ev))
    except ValueError:
        continue  # skill-lint.sh reports invalid JSON itself
    if not isinstance(data, list):
        fail(f"{ev}: must be a JSON list of eval entries")
        continue
    body = text(f"{d}/SKILL.md")
    for i, e in enumerate(data):
        missing = [k for k in ("eval_id", "eval_name", "prompt", "assertions") if k not in e]
        if missing:
            fail(f"{ev}: entry {i} lacks {', '.join(missing)}")
        elif not isinstance(e["assertions"], list) or not e["assertions"]:
            fail(f"{ev}: entry {i} needs a non-empty assertions list")
        src = str(e.get("derived_from", ""))
        if src.startswith("TESTS.md") and not os.path.exists(f"{d}/TESTS.md"):
            fail(f"{ev}: entry {i} derives from TESTS.md, which does not exist")
        if src.startswith("SKILL.md § "):
            # The anchor's first word names the section; the rest may annotate it.
            head = src[len("SKILL.md § "):].split()[0] if src[len("SKILL.md § "):].split() else ""
            if head and head not in body:
                fail(f"{ev}: entry {i} anchor '{head}' is not in SKILL.md")

# --- hand-offs ------------------------------------------------------------------------
# A user-invoked skill cannot be invoked by another skill; it can only be named for the
# person to run. A REQUIRED SUB-SKILL directive whose target is one is a dead end; the
# target is the cmk: name right after "REQUIRED SUB-SKILL:" (other names on the line,
# such as a /cmk:x example, are prose).
DIRECTIVE = re.compile(r"REQUIRED SUB-SKILL:\s*(?:use\s+)?`?cmk:([a-z][a-z0-9-]*)")
for f in sorted(glob.glob("skills/*/SKILL.md") + glob.glob("skills/*/references/**/*.md", recursive=True)):
    for no, line in enumerate(text(f).splitlines(), 1):
        for target in DIRECTIVE.findall(line):
            if target in user_invoked:
                fail(f"{f}:{no}: REQUIRED SUB-SKILL names user-invoked cmk:{target}; name it for the person to run instead")

# --- core naming a pack skill ---------------------------------------------------------------
# Pack membership is the Packs table of cmk:agent-vendors' references/packs.md. A core skill's
# REQUIRED SUB-SKILL directive to a pack skill dead-ends in a repo without that pack, so the
# line must make it conditional on the skill being installed.
packs_file = "skills/agent-vendors/references/packs.md"
pack_skills = set()
if os.path.exists(packs_file):
    in_table = False
    for line in text(packs_file).splitlines():
        if line.startswith("## "):
            in_table = line.strip() == "## Packs"
        elif in_table and line.startswith("| `"):
            pack_skills.update(re.findall(r"`cmk:([a-z][a-z0-9-]*)`", line.split("|")[2]))
for f in sorted(glob.glob("skills/*/SKILL.md") + glob.glob("skills/*/references/**/*.md", recursive=True)):
    if f.split("/")[1] in pack_skills:
        continue
    for no, line in enumerate(text(f).splitlines(), 1):
        for target in DIRECTIVE.findall(line):
            if target in pack_skills and "installed" not in line:
                fail(f"{f}:{no}: core skill requires pack skill cmk:{target}; make it conditional on it being installed")

# --- bundled scripts ------------------------------------------------------------------
# A script sits in skills/<name>/scripts/. An entry point (a .sh file, or a .py file
# with a shebang or a __main__ block) is executable and named as scripts/<file> by the
# skill's SKILL.md or one of its references. A Python module with neither is a library:
# it is reached when a sibling script imports it. test_* files are exempt. Subfolders
# of scripts/ (test data) are not checked.
for d in skills:
    sdir = f"{d}/scripts"
    if not os.path.isdir(sdir):
        continue
    corpus = "".join(text(p) for p in [f"{d}/SKILL.md"] + glob.glob(f"{d}/references/**/*.md", recursive=True))
    entries = sorted(s for s in os.listdir(sdir)
                     if os.path.isfile(f"{sdir}/{s}") and not s.startswith((".", "test_")))
    for s in entries:
        p = f"{sdir}/{s}"
        if s.endswith(".py") and not text(p).startswith("#!") and "__main__" not in text(p):
            stem = s[:-3]
            if not any(re.search(rf"^\s*(?:from|import)\s+{re.escape(stem)}\b", text(f"{sdir}/{o}"), re.M)
                       for o in os.listdir(sdir) if o != s and o.endswith(".py")):
                fail(f"{p}: library module imported by no sibling script")
            continue
        if s.endswith((".sh", ".py")) and not os.access(p, os.X_OK):
            fail(f"{p}: script is not executable")
        if f"scripts/{s}" not in corpus:
            fail(f"{p}: never named as scripts/{s} by its SKILL.md or references")

# --- cross-package paths --------------------------------------------------------------
# A package is self-contained: a relative path may not climb out of skills/<name>/.
# Resolved from the file that holds it, `../x` in references/f.md stays inside (it is a
# path in a template or a consumer repo); in SKILL.md or eval.json it leaves. TESTS.md is
# evidence no agent loads, so the paths it quotes are not checked. `.../` is an ellipsis.
UP = re.compile(r"(?<![.\w])((?:\.\./)+)")
for d in skills:
    for root, _, files in os.walk(d):
        depth = 0 if root == d else root[len(d) + 1:].count("/") + 1
        for fn in sorted(files):
            p = f"{root}/{fn}"
            if p == f"{d}/TESTS.md":
                continue
            try:
                body = text(p)
            except (UnicodeDecodeError, OSError):
                continue
            for no, line in enumerate(body.splitlines(), 1):
                if any(len(m) // 3 > depth for m in UP.findall(line)):
                    fail(f"{p}:{no}: relative path climbs out of {d}/; cite cmk:<name> instead")
                    break

# --- package root ---------------------------------------------------------------------
# Detail lives in references/; a stray .md beside SKILL.md is never linted for reach.
ROOT_FILES = {"SKILL.md", "TESTS.md", "eval.json"}
ROOT_DIRS = {"references", "scripts", "agents"}
for d in skills:
    for e in sorted(os.listdir(d)):
        p = f"{d}/{e}"
        if e.startswith("."):
            continue
        if os.path.isdir(p) and e not in ROOT_DIRS:
            fail(f"{p}/: only {', '.join(sorted(ROOT_DIRS))} may sit beside SKILL.md")
        elif os.path.isfile(p) and e not in ROOT_FILES:
            fail(f"{p}: only {', '.join(sorted(ROOT_FILES))} may sit beside SKILL.md; move detail to references/")

print("\n".join(out))
