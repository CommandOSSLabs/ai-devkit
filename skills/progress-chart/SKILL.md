---
name: cmk:progress-chart
description: Generates a weekly progress dashboard (one HTML page) of what finished, what is building, what is ready to start, and the roadmap graph. Run it with /cmk:progress-chart.
version: 1.1.0
disable-model-invocation: true
---

# Chart Progress

One self-contained HTML page for the end-of-week review: what finished in the last 7 and 30
days, what is building, what is ready to start next, the roadmap as a dependency graph, each
catalog domain, the architecture invariants and latest decisions, and structural health.

Every number on the page comes from `scripts/extract.py`, a fixed parse of the repo's
markdown and git history. The agent writes one thing: the notes — a short summary and the
recommendations for next week, read off that snapshot.

## The Iron Law

```
EVERY NUMBER ON THE PAGE COMES FROM THE SNAPSHOT. THE AGENT NEVER RE-DERIVES ONE.
```

Two baseline agents, given this repo on the same day without this skill, each wrote its own
generator and its own rules. One counted 7 features finished that week, the other 14; one
listed 30 items ready to start, the other 16 — "this is my own rule, not a roadmap field",
plus readings "hand-applied" from `Blockers:` prose. Each run took about seven minutes and
140k tokens, and its generator was left in `/tmp`. A dashboard whose numbers move with the
reader cannot be compared week to week, which is the only thing a weekly dashboard is for.

## Run it

From the root of the repo under review, `<skill>` being this skill's folder:

```bash
d=.skills/dashboard; today=$(date +%F)
python3 <skill>/scripts/extract.py . --today "$today" --out "$d/$today.json"
```

*Done when: the snapshot JSON exists. A missing `docs/roadmap/INDEX.md` is not an error — the
page then says there is no roadmap, and the rest still renders.*

## Write the notes

The notes open the page, so they are written for the person reading it on a Sunday, not for
the snapshot. Write `.skills/dashboard/<today>.notes.json`:

```json
{"summary": "Two or three sentences.", "recommendations": ["One sentence.", "…"]}
```

Draw the content from the snapshot — what finished (`windows.week`), what is building, what is
ready (`graph.ready`, ranked by commitment, milestone order, then `graph.unlocks`), what overlaps
(`graph.conflicts`), milestones ready to close (`graph.closable`), and `findings`. Then write it
in the page's own words:

- **Name things the way the page does:** a feature by its catalog name, a roadmap item by its
  feature name or its slug read as words, a milestone by its name. An ID goes in parentheses
  after the name, only when the reader will need it to act.
- **States in plain words:** finished, in build, ready to start, not started, ready to close.
- **No snapshot vocabulary:** no field names, file paths, rule codes, or commit hashes.
- **summary** — what the week amounted to, and the one thing that changes next week's plan.
- **recommendations** — at most five, each one sentence, starting with a verb, naming what to
  do and why.
- When `coverage.with_after` is below `coverage.live_items`, one recommendation says the
  roadmap does not yet record what each item waits for, so the ready list is a guess, and names
  `cmk:roadmap` to add it.

Both runs of 1.0.0 wrote "coverage.with_after is 0", "are in graph.closable" and
"frontend/src/widgets/assistant/" into the summary — the first paragraph on the page — and the
user read the result as "machine-readable, not human-readable". Shaped like this instead:

```json
{"summary": "A quieter week: the feed poller finished and read state went into build, so reading is one feature from done. Sharing cannot start until read state lands, which makes it next week's bottleneck.",
 "recommendations": ["Finish Read state (READ) first; Share links and everything after it wait on it.",
  "Start Analytics now, but not beside Read state, since both change the database migrations."]}
```

A number you believe is wrong is written as a note beside it, never corrected on the page.
The page shows what the record says; the notes say what you think of it.

*Done when: every name and ID in the notes appears in the snapshot, and no field name, path,
rule code or hash does.*

## Render and hand over

```bash
python3 <skill>/scripts/render.py "$d/$today.json" --notes "$d/$today.notes.json" --out "$d/$today.html"
```

Open it (`open` / `xdg-open` / `start`) and reply with the absolute path, the summary, and the
recommendations — nothing else. The page is local and read-only: no file outside
`.skills/dashboard/` is written, and no status, roadmap line, or spec is touched. Repairs the
page points at belong to `cmk:roadmap`, `cmk:realign`, or `/cmk:milestone-review`.

*Done when: the HTML opens and the reply names its path.*

## What the page derives, and from where

| View | Source |
|---|---|
| Finished / started / new specs | catalog `Status` changes in first-parent git history, dated when they landed on the branch; one commit moving 3+ features to done is flagged as a batch |
| Building, task progress | catalog `In-progress`; `### Task N:` in `tasks.md` against `Task N: complete` in `.skills/<CODE>/progress.md` |
| Ready, blocked, critical path, unlocks | roadmap `After:` (an item without it waits on the member above it) joined to catalog status |
| Shared paths | backtick paths in `Surfaces:` of ready and building items, ignoring container directories |
| Milestones ready to close | every live member done, milestone not `Closed` |
| Architecture | `- **ARCH-N**` lines; `Respects:` lines in each feature's `design.md`; `docs/decisions/NNNN-*.md` |
| Health | `S8` (dangling or cyclic `After:`), table/block commitment disagreement, duplicate ADR numbers, `After:` coverage |

## Red Flags

- Writing a generator, a query, or a `git log` pass of your own to fill in a number
- A count in the notes that differs from the snapshot
- A snapshot field name, file path, rule code or commit hash in the notes
- Reading `Blockers:` prose to decide what is ready
- Editing the HTML after `render.py` wrote it
- Writing anywhere outside `.skills/dashboard/`

## No-op

No `docs/specs/INDEX.md` and no `docs/roadmap/INDEX.md`: there is nothing to chart. Say the
repo carries neither and stop.
