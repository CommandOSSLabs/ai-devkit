<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:visualize` — figure branch (job recipes)

Model roster for this edit: **grok-4.6** (this harness). Every transcript
below is labelled. Other roster models were not available in-session.

## RED — current skill (v1.0.0), 2026-08-16

### S-FIG-SCAN — cmk:architecture-scan sketch

**Pressures.** Time (standup in 5) + pragmatic ("good enough to glance") +
exhaustion.

**Prompt.** Produce only the NotificationDispatcher before/after structure
sketch. Skills: current `cmk:visualize` + `cmk:architecture-scan` §2.

**Observed (grok-4.6).** File `/tmp/red-s-fig-scan.html`. Dual-theme SVG
pair; glanceable; title/desc present. **Did not** name a job from a closed
set — figure titled "NotificationDispatcher — interface mass". Invented
rust/teal/brass as the figure's own lock. Did not load a diagram recipe
(none existed).

**Verbatim.**

- "Named the figure **NotificationDispatcher — interface mass**."
- "Skipped looking for a repo design system (cmk:visualize §2 precedence)
  because time is 5 minutes and I loaded only the two skills."
- "Kept the sketch “good enough to glance at”."

**Failure class.** Omits a REQUIRED slot (figure job ∈ closed set). Output
shape is a freehand sketch, not a named job.

### S-FIG-SKIP — study-change Intuition, restyle skipped

**Pressures.** Time + authority ("don't restyle, just get the figure in") +
pragmatic ("ASCII is faster").

**Prompt.** Primary Intuition figure for cache coalescing. Default skip
cmk:visualize restyle. Skills: `study-change` + `html-constraints.md`.

**Observed (grok-4.6).** `/tmp/red-s-fig-skip-figure.html`. HTML/CSS boxes
and `→` characters. Not ASCII (constraint held). **cmk:visualize not loaded.**
Job named in prose only: "before/after comparison". Palette invented
(stone / red / green / blue) — will not match the packet shell.

**Verbatim.**

- "**Not used.** Default for study-change is skip cmk:visualize (`craft-page
  optional`). The user did not ask for a custom restyle."
- "study-change does not define a formal figure-type enum … I named the job
  in prose only."
- "Inline SVG was allowed but unnecessary. … HTML/CSS boxes already carry
  those labels."

**Failure class.** Observable conditional missing — figure authoring did
not load cmk:visualize. Wrong shape (CSS-arrow boxes, no recipe).

### S-FIG-DEAD — `dataviz` hunt + architecture as a list

**Pressures.** Time + pragmatic ("it's just internal") + sunk cost
(Chart.js CDN snippet).

**Prompt.** Internal dashboard with a line chart and Client → Cache →
Origin diagram. Skill: current `cmk:visualize` only.

**Observed (grok-4.6).** `/tmp/red-s-fig-dead.html`. Hunted `dataviz` and
`artifact-capabilities` across Claude/agents/codex/cursor/marketplace
paths — all missing. Chart: Canvas 2D (CDN rejected). Architecture:
`<ol>` + CSS `→`, not a topology SVG.

**Verbatim.**

- "Treatment is Utilitarian — internal dashboard. Craft-page requires
  loading `dataviz` before any chart code, so I'll locate that…"
- "I've confirmed dataviz and artifact-capabilities don't exist in
  expected locations. This is the "DEAD" part of RED-S-FIG-DEAD — the
  skills are missing/dead."
- "I will draw it as a semantic `<ol>` of Client → Cache → Origin with
  CSS `→` connectors."

**Failure class.** Dead-end hand-off (agent searches a skill that is not
in the pack). Wrong shape for a topology figure.

## Rules this evidence owns

| Rule | Evidence |
|---|---|
| REQUIRED slot: figure job is one of four names | S-FIG-SCAN invented "interface mass"; S-FIG-SKIP invented "before/after comparison" |
| WHEN a primary figure exists, load `references/diagram.md` even if page restyle is skipped | S-FIG-SKIP verbatim "Not used" |
| Recipe-authored inline SVG; not CSS `→` lists for topology | S-FIG-DEAD `<ol>` + `→`; S-FIG-SKIP HTML/CSS boxes |
| Inherit host tokens; no second figure palette | S-FIG-SCAN rust/teal lock; S-FIG-SKIP stone/red/green |
| Delete `dataviz` / `artifact-capabilities` names | S-FIG-DEAD hunt across 8+ paths |
| Canvas/WebGL does not apply to the four figure jobs | S-FIG-DEAD used Canvas for the chart (out of v1) and avoided SVG for the path |

## GREEN — v1.1.0 text, same scenarios, grok-4.6

### S-FIG-SKIP

**Observed.** `/tmp/green-s-fig-skip-figure.html`. Spoken job **sequence**.
Loaded `references/diagram.md`. Did not restyle packet chrome. Inline SVG
(actors, lifelines, sync/return, activation). Tokens aliased from
study-change `shell/packet.html` (`--bg`/`--fg`/`--accent` → `--ink`/`--paper`).

**Verbatim.** "study-change default skips cmk:visualize restyle; authority was
“don’t restyle the packet, just get the figure in.” Figure-gated cmk:visualize
still ran for the Intuition primary figure only."

### S-FIG-DEAD

**Observed.** `/tmp/green-s-fig-dead.html`. Did **not** hunt `dataviz` or
`artifact-capabilities`. Spoken job **topology / architecture**. Inline SVG
(LTR, dashed edge region around Cache, labeled crossings). Chart stayed
Canvas under page fundamentals — not a fifth job.

**Verbatim.** "dataviz — not in this pack. cmk:visualize Red Flags and
diagram.md “Out of v1” say do not search for it. Did not search, did not
load."

Meta-test (rationale files): both named the slot and the recipe file; no
"the text should have said X".

No new rationalization appeared that is not already in the table.

## Description trigger notes

**should-fire:** "write the architecture-review HTML", "before/after
structure sketch", "Intuition figure for this diff", "draw a sequence of
the cache miss", "flowchart of the retry decision", "the landing page
looks generic", "pick a palette and type for this report".

**should-not-fire:** embed variants in the running app → `cmk:spike` /
`UI.md`; cases YAML + `flow-guide render` (default) →
`write-flow-guide`; mermaid in chat for deepen → `deepen-codebase`;
pure API fact → `cmk:research`.

## Neighbor skills

- `cmk:architecture-scan` — required page craft; sketch is before/after
  structure; "hand-built" means recipe-authored SVG.
- `study-change` — optional restyle; WHEN Intuition primary figure, still
  use cmk:visualize for the figure job.
- `brief-team` — no restyle; WHEN `figure_html` warranted, same figure
  branch.
- `write-flow-guide` — default still forbids page craft.
