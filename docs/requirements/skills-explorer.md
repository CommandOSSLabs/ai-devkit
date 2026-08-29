# Requirements: Skills Explorer

**Status:** active
**Owner:** @CommandOSSLabs
**Last updated:** 2026-08-29
**Notation:** ears
**ID prefix:** SKEX

## Problem

A developer arriving at `/skills` has to choose one workflow out of 34 before
they can do anything useful, and today the page makes that choice expensive.
Every card carries a full summary paragraph plus counts, so picking a skill
means reading roughly 34 paragraphs; the information that actually decides the
choice — what the skill is called and the phrase that triggers it — is buried
inside prose written for a different purpose.

The second problem is relational. Skills reference each other by `cmk:` handle,
and those references are the real structure of the kit: `cmk:delivery-review`
means something different once you know it sits between intake and ship. The
existing visualization draws that structure as a fixed circular ring, which
cannot be rearranged, cannot be explored, and gives every skill the same visual
weight regardless of how central it is. A developer who wants to answer "what
should I run before this" has no way to trace it.

They cope by reading `SKILL.md` files directly in GitHub, which loses the
relationships entirely, or by opening skills one at a time until one matches.

## Why Now

The catalog, detail and workspace surfaces landed together and are stable, so
the remaining cost is discovery rather than capability. The reference graph is
already parsed at build time for the existing visualization, which means the
data needed for a real relationship map exists and is currently under-used. And
the kit has grown past the size where a flat alphabetical list is a reasonable
default: at 34 skills across nine categories, category is now the first useful
filter rather than a decoration.

## Success Criteria

| Metric | Target | Measurement Method |
|---|---|---|
| Vertical space per catalog card | Under half the current height | Rendered card height at 1440px, before and after |
| Text a reader must scan to pick a skill | Handle, title and one trigger phrase only | Card content audit |
| Relationship questions answerable in the UI | Both directions, for every skill | Manual pass over all 34 skills in the map and the list |
| Horizontal overflow | None at 390, 768, 1280, 1440 and 1512px | Scripted `scrollWidth` versus `clientWidth` audit per viewport |
| Small-text contrast | AA (4.5:1) in light and dark | Measured from rendered elements with transitions disabled |
| Meaningful graphic contrast | About 3:1 for node fills | Same method, against the canvas surface |

## User Needs and Scenarios

### Recognize the right skill without reading a paragraph

A developer knows the shape of the task but not the kit's vocabulary. The card
must let them recognize a fit from the handle, the title and the phrase they
would actually type.

**Scenario:** Someone about to review a pull request scans the Delivery group,
sees `cmk:delivery-review` with the trigger `"review this PR"`, and opens it
without reading any other card.

### Understand how a skill relates to the others

A developer has found a plausible skill and needs to know what it depends on
and what depends on it before committing to it.

**Scenario:** Someone opens the map, selects `cmk:delivery-review`, and sees
that it references `cmk:delivery-pipeline` and is referenced by
`cmk:delivery-ship`, which tells them it belongs in the middle of a sequence
rather than being run alone.

### Explore the structure rather than read a fixed picture

The canonical layout is a starting point, not the only arrangement. A developer
comparing two clusters needs to move things.

**Scenario:** Someone drags the Sui skills away from the Delivery lane to see
whether the two clusters share any references, then returns to the canonical
layout with one control.

### Give the map the whole screen when reading it

The map is the subject of the page, not an illustration inside a dashboard. A
developer tracing a cluster needs the shell to get out of the way, and a node
they can read without hovering it.

**Scenario:** Someone opens the visualization, sees skill handles at a legible
size without touching the zoom, presses `F`, and reads the whole map with the
navigation, page header and stats gone; `Esc` brings them back.

### Use the map without a mouse or a large screen

**Scenario:** Someone on a phone opens the visualization, gets a list of skills
and their relationships rather than a pinched-in canvas, and reaches every
relationship with the keyboard on a laptop.

### Keep working on a skill's files

The explorer is how a developer finds work; the workspace is where they do it.
Discovery changes must not cost them the editor.

**Scenario:** Someone selects a skill in the map, opens its workspace, edits
`SKILL.md` locally, navigates back to the catalog and returns to find the draft
still there.

## Acceptance Criteria

### Recognize the right skill without reading a paragraph

- **SKEX-1.1** The catalog shall present each skill as a card carrying its
  `cmk:` handle, its human-readable title, its category and at most one trigger
  phrase.
- **SKEX-1.2** The catalog shall not present skill summary paragraphs, file
  counts or reference counts on a card.
- **SKEX-1.3** The catalog shall group skills by category in its default,
  unfiltered, unsorted state.
- **SKEX-1.4** When a viewport is at least 1440 pixels wide, the catalog shall
  present a detail inspector beside the list.
- **SKEX-1.5** When a card is activated, the explorer shall open that skill's
  detail surface.
- **SKEX-1.6** The catalog shall present a separate keyboard-reachable control
  that opens the skill's workspace.

### Understand how a skill relates to the others

- **SKEX-2.1** When a skill is selected, the visualization shall distinguish its
  outgoing references from its incoming references.
- **SKEX-2.2** While a skill is selected, the visualization shall keep that
  selection marked when the pointer hovers a different skill.
- **SKEX-2.3** The visualization shall mark a selected skill by a combination of
  fill, ring and halo rather than by colour alone.
- **SKEX-2.4** The visualization shall present the selected skill's title,
  summary, incoming relations and outgoing relations without waiting for any
  animation to complete.
- **SKEX-2.5** The visualization shall not offer any control that creates,
  edits or deletes a relationship.

### Explore the structure rather than read a fixed picture

- **SKEX-3.1** The visualization shall place skills in category-clustered lanes,
  ordered alphabetically within a lane.
- **SKEX-3.2** When the visualization is loaded twice without stored positions,
  it shall produce identical placements.
- **SKEX-3.3** The visualization shall support panning, zooming and dragging
  individual skills.
- **SKEX-3.4** When a skill is dragged, the visualization shall retain its
  position for the remainder of the browser tab session.
- **SKEX-3.5** The visualization shall provide a control that discards stored
  positions and restores the canonical layout.
- **SKEX-3.6** If stored positions are unreadable or carry a different layout
  version, the visualization shall discard them and use the canonical layout.

### Give the map the whole screen when reading it

- **SKEX-7.1** The visualization shall open at a zoom at which a skill's handle
  and category are legible without hovering or zooming in.
- **SKEX-7.2** The visualization shall not fit the entire graph to the viewport
  on load; fitting the whole graph shall be an explicit control.
- **SKEX-7.3** The visualization shall provide a focus mode that hides the
  application navigation, the page heading and the page statistics, and gives
  the canvas the full application viewport.
- **SKEX-7.4** Focus mode shall be reflected in the URL and restored from it.
- **SKEX-7.5** While in focus mode, the inspector shall be an overlay and shall
  not reduce the canvas.
- **SKEX-7.6** Switching between focus mode and the standard layout shall not
  unmount or duplicate the canvas, and shall preserve the current viewport.
- **SKEX-7.7** The visualization shall accept `F` for focus mode, `R` for reset
  layout and `Escape` to dismiss the open panel and then focus mode, and shall
  ignore them while a text field has focus.
- **SKEX-7.8** When a skill is selected, the visualization shall bring it into
  view, raising the zoom to a legible level only if it is not already there.
- **SKEX-7.9** The docked inspector shall occupy layout only while a skill is
  selected.

### Use the map without a mouse or a large screen

- **SKEX-4.1** The visualization shall provide a list view exposing every skill
  and both directions of every relationship.
- **SKEX-4.2** When a viewport is narrower than 768 pixels, the visualization
  shall default to the list view.
- **SKEX-4.3** The visualization shall accept an explicit view selection through
  the URL, on any viewport.
- **SKEX-4.4** The list view shall support selecting a skill by keyboard.
- **SKEX-4.5** While the reader prefers reduced motion, the visualization shall
  not animate edges or view transitions.

### Keep working on a skill's files

- **SKEX-5.1** The explorer shall preserve the skill detail, workspace, Preview,
  Source and Edit surfaces.
- **SKEX-5.2** The explorer shall preserve browser-local drafts across
  navigation within a browser tab session.
- **SKEX-5.3** The explorer shall accept a skill identifier with or without the
  `cmk:` prefix on every surface that takes one.
- **SKEX-5.4** The explorer shall preserve the existing catalog query, category,
  sort and flag URL parameters.

### Read the interface in either theme, at any supported width

- **SKEX-6.1** The explorer shall not produce horizontal overflow at 390, 768,
  1280, 1440 or 1512 pixels wide.
- **SKEX-6.2** Small text shall meet a contrast ratio of at least 4.5:1 against
  its background in both themes.
- **SKEX-6.3** Skill markers in the visualization shall meet a contrast ratio of
  at least 3:1 against the canvas surface in both themes.
- **SKEX-6.4** The catalog, the canvas in both layouts, the list view, the
  mobile inspector, the skill detail and the workspace shall each report no
  axe-core violations at WCAG 2.0/2.1 level A and AA.

## Scope

### In Scope

- Catalog information density, grouping and controls.
- A two-dimensional, pannable, zoomable, draggable relationship map.
- A list view that is a complete equivalent of the map, not a degraded fallback.
- Deep links for skill selection and view choice.
- Requirements, design, roadmap and changelog updates that describe the result.

### Out of Scope

- A three-dimensional force graph — it costs WebGL and physics budget on every
  visit, is harder to read than a laid-out 2D map, degrades badly on touch, and
  has no accessible equivalent. Recorded as considered and rejected, not as a
  later phase.
- A force simulation as the default layout — non-deterministic placement means
  the map cannot be referred back to between visits.
- Editing relationships — references are derived from the repository and are
  read-only here.
- A command palette — it would add a third navigation surface before the two
  that exist are settled.
- Any repository write, save or publish path for local drafts.

## Risks and Assumptions

### Risks

| Risk | Likelihood | Impact | Why It Exists | Mitigation |
|---|---|---|---|---|
| Compact cards remove context someone relied on | medium | medium | Summaries and counts move to detail | Detail is one click and one keystroke away, and the trigger phrase is the strongest recognition signal that remains |
| A graph library adds meaningful bundle weight | medium | medium | React Flow ships its own renderer and interaction layer | Loaded only on the visualization route, never from the catalog |
| Stored positions outlive a layout change | low | low | Positions are keyed by skill id | Layout carries a version; a mismatch discards stored positions |

### Assumptions

- Category is a useful primary grouping for this kit — if the categories were
  arbitrary, grouping would make the catalog harder to scan rather than easier.
- The reference graph is dense enough to be worth exploring — at 34 skills and
  108 references it is; a sparser kit would not justify a canvas.
- Readers arrive knowing the task, not the vocabulary — if they already knew the
  handles, search alone would be enough.

## Related Documents

- [Codebase Docs](../ai/) — AI-navigable map of the repo

### Downstream Design

- [Skills Explorer](../design/skills-explorer.md) — catalog architecture, the
  canvas boundary, layout determinism and the URL contracts

## Links

- Design: [docs/design/skills-explorer.md](../design/skills-explorer.md)
- Decisions: no ADR — the renderer choice is feature-local and reversible
