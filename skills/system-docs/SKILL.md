---
name: cmk:system-docs
description: Authors or updates one Hybrid 1A system-documentation artifact at the catalog's canonical path. Run with /cmk:system-docs <entry-key>.
version: 1.1.0
disable-model-invocation: true
---

# Define System Doc

Author **exactly one** Hybrid 1A catalog entry per invocation. Unfinished work stays
under `.skills/system-docs/<entry-key>/`. Canonical consumer files are written only after
explicit human approval of a **structural** validator-passing proposal.

**Pack catalog SSOT (not installed into consumers):** this skill directory's
`references/catalog/CATALOG.md` and `catalog/entries/`.

**Consult hooks in other skills:** the shared rules live in
`references/consult-recipe.md` (beside this file). Consumers point there; they do not restate them.

## Resolve entry (bounded)

1. `SKILL_DIR` = directory containing this `SKILL.md`.
2. Read only `SKILL_DIR/catalog/CATALOG.md`; find the row for `<entry-key>`.
3. Load only the entry package path from that row (under `SKILL_DIR/`).
4. Load only template/validator paths named by the package (under `SKILL_DIR/`).
5. Do **not** load the full catalog body, every template, or the whole docs tree by default.

If the entry is not First-class or has no authorable template, stop and say so — do not invent content.

## Ephemera

```
.skills/system-docs/<entry-key>/
  state.md
  evidence.md
  proposal.md
```

Entry-key path mirroring: `codebase/map` → `.skills/system-docs/design/codebase/map/`.

| File | Holds |
|---|---|
| `state.md` | entry, canonical target, phase, confirmed decisions, None slots, open slots/blockers, rejected assumptions, defer condition, last verified revision |
| `evidence.md` | claims with grade Verified \| Inference \| Open; source; revision/env; slot |
| `proposal.md` | preview only — **never** SSOT |

**Resume:** entry package + `state.md` + canonical if present + open-slot evidence + template/validator. Do not replay chat, full catalog, or whole-repo rescan by default.

## Procedure

1. **One artifact** — never configure the whole Hybrid 1A tree; never create empty consumer dirs/files just to start.
2. **Resume or init** ephemera.
3. **Evidence before facts** — Verified / Inference / Open. Cite file:line when Verified. Do **not** promote Inference about compliance, SLO targets, trust boundaries, ownership, runtime topology, or ops procedures without explicit human confirmation.
4. **Required slots** — each ends as confirmed content, `None — <reason>`, or named `Blocker:`.
5. **Propose** full file or **targeted patch** (add/modify/remove selected content; preserve unrelated). Complete replacement only as a fully reviewed new body.
6. **Structural validate** — fail ⇒ no approval offer.
7. **Explicit human approval** before any canonical write.
8. **Write** only this entry's canonical path. Set `Status: Approved` for single-file entries. Never mediated `Status: Draft` at canonical path. Never sibling artifacts in the same write. Never whole-file clobber without a reviewed complete replacement.
9. Prior Approved content stays authoritative until the new patch is applied.
10. Mark digest **complete** in `state.md` after write. Approved + validator pass is the only SSOT for the subject.

*Done when:* the user has an Approved canonical file (or an explicit stop with named blockers), ephemera is complete or deferred, and no sibling Hybrid 1A files were created.

## Authority

Default single-file predicate (entry package may specialize):

| State | Rule |
|---|---|
| **Absent** | Canonical path missing |
| **Non-authoritative** | Present but Status ≠ Approved, or structural validator fails (includes external Draft) |
| **Approved** | `Status: Approved` and structural validator pass |

Directory entries use the entry package predicate (no single Status header required).

## The Iron Law

```
NEVER SEED AN EMPTY HYBRID 1A TREE
NEVER WRITE CANONICAL DRAFT VIA THIS SKILL
NEVER TREAT proposal.md OR EPHEMERA AS STANDING PROJECT TRUTH
NEVER PROMOTE HIGH-RISK INFERENCE WITHOUT HUMAN CONFIRMATION
```

## Rationalizations

| Thought | Reality |
|---|---|
| "I'll create all the standard folders while here" | Empty-forest. One entry only |
| "Draft at the path is fine; Status says Draft" | Mediated workflow never writes canonical Draft; readers treat external Draft as non-authoritative |
| "proposal.md is the latest truth" | Preview only; Approved canonical is SSOT |
| "The threat boundary is obvious from the code" | High-risk class — human confirmation before durable text |
| "Skip the validator; slots look full" | Structural fail blocks approval — no soft maybe |
| "Clobber the whole map with my rewrite" | Targeted patch or fully reviewed complete replacement only |

## Red Flags — stop

- Creating empty `docs/security/` or sibling Hybrid 1A files "for later"
- Auto-invocation language in a model skill pointing at this skill as REQUIRED SUB-SKILL
- Writing `Status: Draft` at a canonical path from this skill
- Loading the entire catalog or every template into context for one entry
- Approving while a high-impact `Blocker:` remains open
