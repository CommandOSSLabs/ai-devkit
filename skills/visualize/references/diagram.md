# Diagram recipes

Load this file WHEN a primary figure is warranted — an architecture scan
structure sketch or an `cmk:explain` Map figure. Page restyle may be skipped; this file still loads.

- [Name the job](#name-the-job)
- [Tokens](#tokens)
- [Shared rules](#shared-rules)
- [before/after structure](#job-beforeafter-structure)
- [topology / architecture](#job-topology--architecture)
- [sequence](#job-sequence)
- [flowchart](#job-flowchart)

v1 jobs are only the four below. Timeline, state machine, mind map, ER, and
data-flow are out of this file — do not invent a fifth recipe.

## Name the job

Say exactly one of these names out loud before any mark:

| Job | When |
|---|---|
| **before/after structure** | A module, seam, or fan-out changes shape. cmk:architecture-scan sketches live here. |
| **topology / architecture** | Containment, who talks to whom, where a seam sits. |
| **sequence** | Time-ordered interactions between named actors. |
| **flowchart** | A decision or branch the reader must follow. |

Unsure between before/after and topology? If the argument is *what changed*,
it is before/after. If the argument is *where things sit*, it is topology.
*Done when: the spoken name is one of the four strings above.*

## Tokens

The figure **inherits** the page or shell tokens (`--ink`, `--paper`, accent,
semantic good/warn). Do not invent a second palette for the SVG.

If the host has no tokens yet (cmk:architecture-scan is generating the page), the
cmk:visualize Color plan **is** the token set — define the same names on `:root`
and use them in the SVG. The figure does not get its own rust/teal lock.

Map roles, not brands:

- **ground** — page paper
- **ink** — labels
- **muted** — sublabels
- **stroke** — boxes and arrows (the page accent or ink, not a new cyan)
- **before** / **after** — two hues already in the plan, or ink + accent
- **alert** — only for the error/exception path

## Shared rules

1. **One question per figure.** Title the SVG with that question or claim.
   `<title>` + `<desc>` plus a visible caption. An accessible name of "diagram"
   is not an explanation.
2. **One abstraction level.** Do not mix "file" boxes with "AWS region" boxes.
3. **Inline SVG** in the same HTML file. No second `.svg` / PNG / `diagram/`
   directory. No mermaid. No CDN. No Google Fonts `@import`.
4. **Layering** (paint back-to-front): ground → region dashes → connectors →
   opaque mask rects in the page paper color → boxes → labels → legend → title.
   Masks exist so a semi-transparent fill does not show arrows through the box.
5. **Spacing.** Box height 50–70px. Gap ≥ 40px vertical, ≥ 30px horizontal.
   Arrow labels 10px off any box. `viewBox` fits content + 30px pad. No
   overlapping labels.
6. **Label the relation**, not just the node. An unlabeled arrow is unfinished.
7. **Recipe-authored SVG is hand-built.** Mermaid, CDN renderers, and layout
   scripts are not. Canvas/WebGL stays for generative or decorative graphics
   only — not for these four jobs.
8. **Glance test.** If the figure needs a paragraph to be understood, redraw
   it. Caption states the claim; it does not narrate the boxes.

*Done when: the figure is inline SVG, uses host tokens, names one job, and
passes the glance test.*

## Job: before/after structure

**Question it answers:** what mass / fan-out / seam changes?

**Layout.** Two boards, same `viewBox` geometry, side by side (stack under
~720px). Shared y-positions so a node that survives stays on the same row.
Before on the left. After on the right.

**Marks.**

- Shallow module: a wide box whose internals (payload, retry, format) sit
  *inside the interface strip*, not below it.
- Deep module: a narrow seam on top; adapters in a row *under* the seam line.
- Fan-out collapse: N caller arrows into one box become N arrows into one seam.
- Deletion-test caption belongs on the before board ("callers already know
  everything") and must not appear as a paragraph under the pair.

Do not use a numbered 01/02 marker unless the change is a sequence.

## Job: topology / architecture

**Question it answers:** what sits where, and what crosses the seam?

**Layout.** Pick one direction and keep it: LTR (client left, store right) or
TTB (client top, infra bottom). One column/row per role. Group shared
infrastructure with a dashed region, 20px pad inside the dash.

**Connectors.** Straight H/V first; L-path if a straight line would cross a
box. Label the important crossings with the action or payload, not "uses".

**Not this job:** a CSS flex row of three pills with `→` between them. That
encodes order, not topology — if the claim is a path, use **sequence** or
**flowchart**. If the claim is containment, draw nested regions.

## Job: sequence

**Question it answers:** who talks to whom, in what order?

**Layout.** Actors as boxes across the top, 150–200px apart. Dashed vertical
lifelines. Time down. Messages 40–50px apart.

- Sync: solid arrow + method name above the line.
- Return: dashed arrow, italic label.
- Activation: 10px bar on the lifeline from inbound to outbound.

Number messages only when there are 8+. Caption states the punch line
("three waiters, one origin fetch"), not a replay of every arrow.

## Job: flowchart

**Question it answers:** which branch does a given input take?

**Layout.** Happy path straight down the center. Decision diamonds; Yes
continues down, No branches right. Labels sit on the exit arrows, 10px off
the diamond. Merge with an L-connector, not a diagonal through a box.

Start/end are the only large-radius rects. Error/exception paths use the
alert token and a dashed stroke.

## Out of v1

Do not add a job to cover a chart, KPI sparkline, or stat tile. Draw those
with the page fundamentals (or omit them). There is no `dataviz` skill in
this pack — do not search for one.
