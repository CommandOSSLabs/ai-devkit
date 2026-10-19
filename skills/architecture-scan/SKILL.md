---
name: cmk:architecture-scan
description: Produces a codebase-wide architecture and technical-debt scan, ranked by where refactoring pays off next. Run it with /cmk:architecture-scan.
version: 1.2.0
disable-model-invocation: true
---

# Improve the Architecture

Scan the codebase for accumulated friction, present deepening candidates as a visual report, and carry the one the user picks into the normal spec cycle. The goal is testability and navigability — modules deep enough that their interface is the test surface.

Vocabulary is strict throughout: **module, interface, implementation, seam, adapter** (plus depth/locality/leverage as qualities) — a *seam* is a public surface where behavior is both observable and substitutable (the same seam `cmk:tdd` and `cmk:design` name). Never drift into "component", "service", "layer", or "boundary" — precision in the nouns is what keeps the findings comparable run over run.

## 1. Take the posture

The scan opens here, before any reading. Run it, do not estimate:

```
cd <repo root> && python3 <skill-root>/scripts/posture.py --days 180
```

The working directory decides which repo is measured — run it from the repo under scan, never from the skill's own folder.

It prints and records four things: rules `mechanised/total` with the prose-only IDs named, change locality (median files and modules per commit, and the share of commits spanning more than one module), cross-module co-change pairs, and the most-changed files. A rule no check defends is a wish, and this count says how many the repo is carrying.

The record lands in `.skills/architecture-scan/posture.json` (local, never committed). When one already exists, every number comes back with its delta since the previous scan — that delta is the only evidence that the last scan's pick moved anything.

Then read `docs/requirements/glossary.md` (the domain names good seams) and `docs/decisions/` (decisions not to re-litigate), with the numbers already in hand. Co-change pairs and the most-changed files name the modules to open first: design defects that only history reveals never surface in a reading pass.

**Done when:** `posture.json` is written, and you can name the prose-only rule IDs aloud.

## 2. Explore for friction

Dispatch an explore subagent to walk the codebase, starting at the modules the posture named — then onward organically, no rigid checklist, just noting where work hurts:

- **Shallow modules** — an interface nearly as complex as the implementation behind it
- **Poor locality** — one conceptual change fans out across many files
- **Missing or weak seams** — places substitution is needed but impossible, or a seam exists with only one hypothetical adapter
- **Untested-through-interface** — code only testable by reaching past its interface into internals

Apply the **deletion test** to anything suspect: if this module vanished, how much would its callers need to know to rebuild the behavior? "Almost everything" means the module was shallow — deleting it would concentrate complexity rather than lose it. That concentration point is your candidate.

**Done when:** you hold 3–7 candidates, each tied to specific modules and a named kind of friction.

## 3. Present the report

REQUIRED SUB-SKILL: use `cmk:visualize` before writing any markup. The treatment is utilitarian — a real type scale, a chosen palette, no hero — and the report is scanned, not read: the confidence badge and the before/after sketch have to read at a glance. The sketch is a primary figure: name the job `before/after structure` and follow `cmk:visualize`'s diagram recipe (recipe-authored inline SVG is hand-built).

Write a **self-contained HTML file** (inline CSS/SVG only — no external scripts, stylesheets, or CDNs) to the OS temp directory (`$TMPDIR`, falling back to `/tmp`; `%TEMP%` on Windows) as `architecture-review-<timestamp>.html`, so nothing lands in the repo. Open it (`open` / `xdg-open` / `start`) and tell the user the absolute path.

REQUIRED — the report opens with a **posture strip**, before any candidate: rules `mechanised/total` with the prose-only IDs named, the three locality numbers, and any outstanding exception list the repo's own checks carry. Each with its delta when a previous posture exists. This is the part a later scan compares against, so it is numbers, not prose.

Build the strip by reading `posture.json` field by field — every figure on the page is copied from that file, never recalled from earlier in the session. A strip reading `0/0`, `first scan`, or a dash while the file holds real numbers is a fabricated posture, and it poisons the delta of every scan that follows.

One card per candidate:

- **Files** — the modules involved (monospaced list; this report is ephemeral, so paths are fine here)
- **Problem** — one sentence: what hurts and which friction kind it is
- **Proposed direction** — one sentence, in the strict vocabulary: what would deepen
- **Win** — bullets of at most 6 words each, named as qualities ("locality: change lands in one module", "interface shrinks, tests hit one seam")
- **Confidence badge** — exactly one of `Strong` / `Worth exploring` / `Speculative`
- **Before/after structure sketch** — side-by-side recipe SVG (`before/after structure`): shallow-vs-deep mass diagrams, fan-out collapses, seam lines. The sketch carries the argument; if it needs a paragraph to explain, redraw it.

End with a top-recommendation section: which candidate first, one sentence why, and which single prose-only rule to give a check next — the cheapest way the posture moves before the next scan. Then ask the user which candidate they want to pursue.

**Do not propose concrete interfaces yet** — the report names directions, not designs. Interface shape belongs to the interview step, with the user in the loop.

**ADR conflicts:** a candidate that contradicts an existing ADR is included only when its evidence carries a `Strong` confidence badge; below that it is dropped, not listed. An included one is marked with the ADR reference and why the decision deserves revisiting. Do not list every refactor an ADR forbids.

**Done when:** the posture strip carries every count from step 1, the report is open in the user's browser, and you have asked which candidate to pursue.

## 4. Shape the chosen candidate

Once the user picks:

- REQUIRED SUB-SKILL: use `cmk:interview` — walk the shape of the deepened module one question at a time: constraints, what sits behind the new seam, which adapters are real, which tests survive.
- REQUIRED SUB-SKILL: use `cmk:glossary` for side effects as decisions land — new module named after a concept missing from `docs/requirements/glossary.md`? Add the term. Fuzzy term sharpened mid-conversation? Update it now, not later. User rejects a candidate for a load-bearing reason? Offer an ADR through `cmk:adr` so future scans do not re-suggest it (skip ephemeral or self-evident reasons).
- State the ceremony tier aloud — 0 for a change small enough to go straight to `cmk:tdd`, 1+ for one needing requirements first.

**Done when:** `cmk:interview` has no unexplored branch left, and the ceremony tier is stated aloud as 0 or 1+.

## 5. Feed the spec cycle

Tier 0 (mechanical, no behavior change) can proceed directly under `cmk:tdd`/`cmk:evidence` discipline. Anything tier 1 or above: REQUIRED SUB-SKILL: use `cmk:scope` — hand it the shaped improvement and let it run the normal cycle to requirements; architecture work earns no exemption from the spec gate.

**Done when:** the work has an owner flow — either in progress under tier 0 discipline, or handed to `cmk:scope`.
