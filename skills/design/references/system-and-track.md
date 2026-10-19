# System and track design

Loaded from `SKILL.md` § Two levels when the design covers the whole system or one
sub-system / track, not one feature's triad.

## Contents

- [Levels and placement](#levels-and-placement)
- [Create](#create)
- [Iterate](#iterate)
- [Output](#output)

## Levels and placement

- **System-wide** — the whole platform: layers, dependency direction, component map,
  sub-system composition. `docs/design/system.md`; when a spine exists, its `**ARCH-N**`
  invariants live there.
- **Sub-system / track** — one product line or major component: its responsibilities,
  protocols, and how it composes the shared core without leaking into it.
  `docs/design/<track>.md`.
- **Feature** — one feature: the triad's `design.md` (`SKILL.md` Steps 1–4).
- Lower levels reference upward and never silently contradict the level above; a conflict
  is surfaced and resolved at the higher level.
- A multi-doc design tree, `docs/design/<system>/`, opens with a "read this tree" README:
  one line per doc saying what it covers and when to read it. Shared documents go in
  `<system>/shared/`, one branch per sub-system.

Status lifecycle: `draft` → `active` → `shipped`, or any → `deprecated`.

## Create

1. Shape the document per `references/design-guidance.md` — a directive, not a fixed form —
   aligning to local convention when one exists. Mechanisms are specified independent of the
   implementation language or framework; stack choices appear as constraints or rationale.
2. **Security section — REQUIRED at system level.** Three parts, each filled or stated empty
   with its reason: **Assumptions** (who can reach what, what is trusted), **Gaps** (what is
   unprotected today, read from the code — missing auth, unchecked input, unsafe writes),
   **Controls** (what protects each asset and how). A gap found in the code goes here, not
   only in a module's prose or an open question.
3. Name every system, component, and actor with glossary terms (`cmk:glossary`).
4. Mark unknowns in `Open Points` — don't guess.
5. Link the requirements it serves and the decisions in `docs/decisions/` that constrain it.
   A hard-to-reverse, surprising trade-off settled here goes through `cmk:adr`.
6. Set status to `draft`, add the tree README row when one exists, and present the file.

## Iterate

1. Read the doc in full, and the docs one level up and down that cite it.
2. **Upstream check:** read the linked requirements and the constraining
   `docs/decisions/` records; flag conflicts rather than silently overriding them.
3. **Downstream cascade:** a change can invalidate lower-level docs and feature designs that
   reference the changed component — check inbound references and cascade or flag them in
   the same change.
4. Update affected sections in place, preserve unchanged content, update `Last updated`,
   transition status when appropriate, and present the diff.

## Output

- Principles are opinionated and system-specific; the architecture diagram matches the
  component descriptions.
- System-wide docs carry the three-part Security section.
- Every design doc names the requirements it satisfies and the decisions that constrain
  it, in progress-neutral, tracker-neutral wording.
