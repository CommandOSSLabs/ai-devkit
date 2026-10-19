<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# TESTS.md — cmk:progress-chart

## 2026-10-14 — 1.0.0

Roster: Sonnet (`skill-tester`), as the user named. Fixture: a clone of the klynt repo at
`1be5268ad` (dev) with its `.skills/**/*.md` ephemera, `--today 2026-10-14`. Same prompt in
every run: "Generate my weekly dashboard: one self-contained HTML file … what got done in the
last week and the last month, what is in progress, the roadmap as a dependency graph with what
can run in parallel next week and what's ready to start now, each catalog domain, and the
architecture", then report the numbers and how each was derived.

### RED — no skill, 2 runs

| | run 1 | run 2 |
|---|---|---|
| finished, 7 days | 7 | 14 |
| finished, 30 days | 30 | 30 |
| in progress | AWID, AWKIND, CCOL | AWID, AWKIND, CCOL |
| ready to start | 30 items | 16 items |
| time / tokens | 6.6 min / 137k | 6.9 min / 146k |

Both wrote a generator of their own (run 2: `/tmp/dashgen/gen.py` plus four helpers, left
outside the repo). Verbatim:

- run 1, ready: "This is my own rule, not a roadmap field … I hand-applied a few readings from
  Blockers text: 110 waits on MILE-39, 74 waits on 72 and 73, 73 is independent, and 190 can
  start now."
- run 1, dates: re-dated a catch-up commit's features "from the merge-to-dev date …
  ASSET's date is approximate".
- run 2, ready: "The item-level Needs come from parsing prose, so they are heuristic."
- run 2, dates: "A first attempt with `--first-parent` was wrong … so I dropped it."

Failure class: a check that must not vary run to run → a recipe of deterministic primitives
(`scripts/extract.py`, `scripts/render.py`) plus one Iron Law: the agent never re-derives a
number. Counters carry the recorded 7-vs-14 and 30-vs-16.

Taken from the baselines into the extractor, because both runs were right to look:
the catch-up batch (`88ad16e50` moved 11 features to Implemented on 10-10; run 1 and run 2 both
caught it) → flagged as a batch, not re-dated; 13 milestones with every member done but not
Closed (run 2) → `graph.closable`; MILE-27 table Planned vs block Closed (run 2) → `S7`
finding; six duplicate ADR numbers (run 2) → `ADR` finding; the 7-day window as 7 calendar
days including today (both runs).

### GREEN — skill installed at `.claude/skills/chart-progress/`, 2 runs

Both runs: 15 finished in 7 days (11 flagged as batch `88ad16e50`), 31 in 30 days, in
progress CCOL / AWID / AWKIND, the same 21 ready items, the same 13 closable milestones; no
generator of their own; nothing written outside `.skills/dashboard/`; every ID in the notes
present in the snapshot. Both stated the `After:` coverage (0 of 181) in the summary and
recommended the backfill. 37 s / 42k and 30 s / 44k tokens.

Found by diffing the two runs' artifacts, not by their reports:

- the snapshots differed in byte order — `graph.unlocks` was built by iterating a `set`, so
  key order followed `PYTHONHASHSEED`. Fixed; covered by a three-process byte-equality test
  (render has the same test, after `hash()` in SVG ids failed it).
- run 2 recommended "AWID has 0 of 31 tasks recorded complete": AWID has no ledger, and the
  page printed `0/31`. The cell now reads "31 tasks, no ledger".

### Scripts

`scripts/test_extract.py` and `scripts/test_render.py` (unittest, stdlib only), each test
watched failing first. Run: `cd scripts && python3 -m unittest`.

## 2026-10-14 — 1.1.0: a page for a person

**RED — user review of 1.0.0.** "It is still more machine-readable than human-readable." On the
klynt page: IDs and kebab-case slugs led every row (`ROAD-107 · ai-quota-campaigns · MILE-26`),
states were internal words (`unspecced`, `specced`, `framing`), the critical path was a string
of IDs, overlaps were a list of raw paths, dates were ISO. The notes from both 1.0.0 GREEN runs
— the first paragraph on the page — carried snapshot vocabulary verbatim: "coverage.with_after
is 0", "are in graph.closable", "frontend/src/widgets/assistant/", "S7".

Failure class: wrong shape → a positive recipe. The page (render.py) became a weekly briefing:
names first with the ID as a small tag, plain states from one `STATE` table, human dates
("Sat 10 Oct"), finished work grouped by day, an 8-week trend, build age, ready items grouped
under their milestone's name and outcome, overlaps as "Shares code with <name> (<state>) —
<area>", finished milestones left off the map. Each property has a render test, watched
failing first (8 failed on 1.0.0). The readability tests caught a real bug the old page hid:
feature names parsed as `[spec]` (the spec column, not the name column).

The notes section became a recipe with one worked example from an unrelated project (not
klynt, so the GREEN fixture could not be copied from it).

**GREEN — 2 runs on klynt.** Both notes files: zero field names, paths, rule codes, hashes or
bare IDs (`grep` over the written files); features, items and milestones named the way the
page names them; the missing-`After:` caveat in plain words naming cmk:roadmap. One loose
claim survived in run 1 ("three assistant features" while one of the three is a Library
feature) — prose accuracy, not vocabulary; not addressed.
