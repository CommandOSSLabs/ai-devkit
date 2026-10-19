# Roadmap: <Project Name>

Status: Draft
Date: <YYYY-MM-DD>

<!--
The program layer: milestone INTENT, above any single feature and below the product
vision. Optional — only multi-milestone projects need it. `cmk:roadmap` authors it;
`cmk:roadmap-status` derives progress from it without writing anything.

This file owns intent only: outcomes, ordering, membership, dependencies, commitments,
blockers, deferrals, goal dispositions. It never records how far a feature has got —
that lives once, as `Status:` in the feature's own requirements.md, mirrored into its
docs/specs/INDEX.md row. Every heading below is a REQUIRED slot — fill it or write
`None`.

Structural rules — AUTHORITATIVE. Both `cmk:roadmap` (before its approval gate) and
`cmk:roadmap-status` (as finding R11) validate against this list. A roadmap is structurally
defective when any of these does not hold:

  S1  every MILE-N and ROAD-N is defined exactly once — a definition lives in a
      Members: slot or a Deferred: slot, struck through or not
  S2  every ROAD-N sits under exactly one milestone, counting definitions in
      both slots
  S3  every milestone carries a non-empty Outcome sentence
  S4  no Depends-on names a milestone appearing later in the milestone table
  S5  every Depends-on resolves to exactly one live, non-struck-through MILE-N
  S6  every live GOAL-N in vision.md is cited by a milestone or listed under
      Goal dispositions
  S7  the milestone table and every milestone block parse
  S8  every After: value is `none` or comma-separated ROAD-N / MILE-N, each defined
      once, live, and neither the item itself nor its own milestone; and following
      After edges (an item without After waiting on the member above it) never
      returns to the item it left

ID rules:
- Grammar: **MILE-<n>** and **ROAD-<n>**, flat and repo-wide.
- Stable from first definition. Retire by strikethrough with a reason
  (~~**MILE-3**~~ superseded by MILE-5) — never renumber, never reuse.
- A ROAD-N keeps its ID when it moves between milestones.
- Milestone ORDER is table row order; milestone IDENTITY is the MILE-N. Reordering the
  table never renumbers anything.
- ITEM order is the After: field, written between the slug and Surfaces:
  `- **ROAD-7** <slug> — After: ROAD-5, MILE-2 — Surfaces: ...`. It names what must
  be done before this item starts: a ROAD-N in any milestone, or a MILE-N meaning
  every live member of that milestone. `none` means it can start now. IDs only — a
  reason belongs in Blockers:. Items whose After is done build in parallel. An item
  with no After: field (written before this rule) waits on the member above it, and
  the first member on its milestone's Depends-on. Order is the field, identity is
  the ID, so resequencing renumbers nothing.
- GOAL-N is defined in docs/requirements/vision.md and only cited here. Feature codes are
  defined in docs/specs/INDEX.md and never written here — a roadmap item is identified
  by its ROAD-N and slug until a feature spec binds to it.
- ROAD-N is a program SLOT (intent + order + Surfaces). A feature CODE is a separate
  delivery unit. Creating a ROAD does not create a feature. Binding is the INDEX
  "Roadmap item" cell (cmk:requirements only). At most one live CODE binds a ROAD (R6).
  Same slug language does not make the IDs the same object.
-->

| ID | Milestone | Outcome | Depends-on | Commitment |
|---|---|---|---|---|
| MILE-1 | <name> | <one testable user-value sentence> | none | Committed |
| MILE-2 | <name> | <one testable user-value sentence> | MILE-1 | Planned |

## MILE-1 — <name>

**Outcome:** <one sentence a reader could test the milestone against — what a user can
do once it lands, not what was built>
**Goals:** GOAL-1, GOAL-2
**Members:**
- **ROAD-1** <slug> — After: none — Surfaces: `src/<area>/`, `src/<file>.ts`
- **ROAD-2** <slug> — After: ROAD-1 — Surfaces: None — <reason the surface is not yet knowable>
**Depends-on:** none
**Commitment:** Committed <YYYY-MM-DD>
**Closed:** None
**Deferred:** None
**Blockers:** None

## MILE-2 — <name>

**Outcome:** <one testable user-value sentence>
**Goals:** GOAL-3
**Members:**
- **ROAD-3** <slug> — After: MILE-1 — Surfaces: `src/<area>/`
**Depends-on:** MILE-1
**Commitment:** Planned
**Closed:** None
**Deferred:** <ROAD-N slug → MILE-N (YYYY-MM-DD, reason)>
**Blockers:** None

## Goal dispositions

Every live `GOAL-N` in `docs/requirements/vision.md` that no milestone cites belongs here, so
that a goal is never silently dropped (S6).

| Goal | Disposition | Date | Reason |
|---|---|---|---|
| GOAL-4 | Out-of-scope | <YYYY-MM-DD> | <why this goal is not being pursued> |
| GOAL-5 | Deferred | <YYYY-MM-DD> | <what has to be true before it returns> |
