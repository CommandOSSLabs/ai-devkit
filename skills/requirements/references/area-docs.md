# Product-area requirements docs

Loaded from `SKILL.md` § Three modes when the work targets `docs/requirements/<topic>.md`
— a product area's living requirements (a PRD), not one feature's spec. A repo that used
this kit before 2.0 keeps its requirements here; new feature work still goes to a
`docs/specs/` triad.

## Contents

- [Placement](#placement)
- [Status lifecycle](#status-lifecycle)
- [Create](#create)
- [Iterate](#iterate)
- [Output](#output)

## Placement

- One file per product area: `docs/requirements/<topic>.md`, indexed by
  `docs/requirements/README.md`.
- A large product uses a concise entry-point doc plus per-area files
  (`docs/requirements/<product>/<area>.md`), so readers load only what a task needs.
- The glossary lives beside them (`docs/requirements/glossary.md`, see `cmk:glossary`).
- Requirements own the product "what and why" — including technical guarantees when the
  product is technical. Mechanism belongs in `docs/design/`.

## Status lifecycle

`draft` → `active` → `decomposed` (broken into feature specs or design docs) → `shipped`,
or any → `deprecated`.

## Create

1. Shape the narrative per `references/requirements-guidance.md` — a directive, not a fixed
   form. Where the repo already has area docs, follow their local convention.
2. Set `**Notation:**` and `**ID prefix:**` in the header before the first criterion, per
   `references/requirements-guidance.md` § Choosing the notation. Write
   `## Acceptance Criteria` to that file's § What one criterion is.
3. Mark unknowns in `Open Points` — don't guess.
4. Set status to `draft`, add the README row, and present the file for review.

## Iterate

1. Read the doc in full.
2. State the **scope band** out loud: `trivial` (no behavior change — do not revise
   criteria), `patch` or `feature` (adds or shifts behavior — confirm the delta with the
   user before editing).
3. Update affected sections in place; preserve unchanged content.
4. **Guards:** for every existing criterion on the touched surface, add a guard per
   `references/requirements-guidance.md` § Guarding existing behavior. A change that adds
   criteria with no guard for the load-bearing ones beside it has failed Iterate.
5. **Coherence:** read the linked `docs/design/` docs and relevant `docs/decisions/`
   records; flag conflicts and cascade, or record the conflict. Locked decisions are never
   silently reopened.
6. Update `Last updated`, transition status when appropriate, and present the diff for
   confirmation.

When the change is big enough to build as a feature, the area doc changes only its scope or
summary lines and links the new `docs/specs/` triad; the criteria for the new behavior live
in the triad.

## Output

- IDs are stable once status leaves `draft`: retired by strikethrough, never renumbered.
- Every requirements doc lists the `docs/design/` docs and feature specs that implement
  it, once they exist. Wording stays progress-neutral and tracker-neutral.
