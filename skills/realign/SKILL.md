---
name: cmk:realign
description: Use when a feature's spec has drifted from reality — requirements changed mid-implementation, the implementation deviated from the approved plan, the feature just shipped, the specs have gone stale or out of sync, or the cmk:traceability check is failing — and the requirements/design/tasks triad needs realigning back to what the code and tests actually do.
version: 1.2.0
---

# Sync a Spec

Realign one feature's spec triad (`docs/specs/<date>-<feature>/{requirements,design,tasks}.md`) with what is actually true — in the code, the tests, and the tasks. Specs that are not resynced after change become fiction, and fiction is worse than no spec.

Work one feature at a time. Identify the spec directory first (from the user, the current branch, or `docs/specs/INDEX.md`).

## Iron rules

- **Never renumber requirement IDs.** IDs are immutable once approved; everything downstream cites them.
- **Never delete a requirement.** Retire it: `~~**CODE-N.M**~~ <reason>` — struck-through IDs stop counting as defined, but the history stays legible.
- New requirements get the next free number under their story; new tasks match the existing task format exactly.
- **Never write `Status: Shipped`.** That transition is `cmk:release` step i on the release cohort. This skill realigns one triad; it does not stamp a release.
- **Never write `Status: In-progress`.** That transition is `cmk:delivery-build`'s `references/common.md` session preflight.

## Steps

**a. Baseline.** Run the cmk:traceability check (REQUIRED SUB-SKILL: use `cmk:traceability`) and capture the finding set — this is the "before" picture.

**b. Requirements ↔ tasks.** Compare `requirements.md` against `tasks.md`:

- A live requirement no task cites → append a covering task in the same format as the rest of the file, ending with its `_Requirements: CODE-N.M_` footer.
- Work that is verifiably complete (implemented and its cmk:evidence evidence exists) but whose task box is unchecked → check the box.

**c. Requirements ↔ design.** Compare requirement IDs against the `Satisfies:` lines in `design.md`. Any live requirement appearing in no `Satisfies:` line gets flagged to the user — either the design needs a section (extend it) or the requirement is aspirational (consider retiring it). Do not invent design content silently.

**d. Orphans.** List every task footer citing an ID that is struck through or does
not exist. Present the list to the user with a suggested disposition per item
(repoint to a live ID, retire the task cite, or resurrect the requirement) —
orphans are decisions, not cleanup. Legacy ID strings in application tests are
out of scope for this step (docs-only spine).

**e. Status transitions — with evidence only.**

| Transition | Required evidence |
|---|---|
| Draft → Approved | the user explicitly approved the spec — never inferred |
| Approved / In-progress → Implemented | every task box checked AND docs-only cmk:traceability has zero errors AND cmk:evidence verify commands green |
| Implemented → Shipped | **not applied here** — `cmk:release` step i writes `Shipped` on the cohort |

Apply `Draft → Approved` or `Approved`/`In-progress` → `Implemented` when that
evidence exists: update the `Status:` line in `requirements.md` and the
feature's row in `docs/specs/INDEX.md`. If evidence is partial, say exactly
what is missing instead of transitioning. A mid-cut-release ask to "mark the
shipped features Shipped" is `cmk:release` step i, not this skill — refuse
the stamp, offer one-feature triad repair if there is drift.

**f. After picture.** Re-run the cmk:traceability check and print both finding sets side by side — errors and warnings resolved, anything remaining, and what you changed to get there. Confirm `docs/specs/INDEX.md` reflects every spec's current `Status:` line, staged into this same commit.

**Done when:** the after-report is no worse than the before-report on errors, every flagged item has either an edit or an explicit user decision pending, and INDEX.md agrees with every spec's `Status:` line.
