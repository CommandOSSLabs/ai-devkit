<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:traceability` — catalog integrity (v1.1.0)

## Edit — In-progress is a Status value (v1.2.0)

Pass 2 vocabulary is now `Draft | Approved | In-progress | Implemented |
Shipped`. W1 applies to `Approved` and `In-progress`. Occupancy writer is
`cmk:delivery-build`'s `references/common.md`, not this check.

---


**Roster:** grok-4.6, grok-4.5.
**Scenario:** `.skills/_pending-reconcile/red-audit-catalog-scenario.md`.

## Failure class

**Omits catalog checks.** v1.0.0 covered triad + optional ARCH/system IDs only.
Duplicate INDEX CODEs, OBS tokens in Code cells, and missing shard paths were
invisible to cmk:evidence / cmk:release.

Form: optional catalog passes (when INDEX exists) + finding codes E11–E13 / W4–W5.

### RED (v1.0.0)

| Run | Model | FINDING_CODES | REPORTS_DUP / OBS / SHARD |
|---|---|---|---|
| catalog defects + clean triad | grok-4.5 | none | no / no / no |
| same | grok-4.6 | none | no / no / no |

Verbatim: "The skill never greps docs/specs/INDEX.md" / "Catalog integrity is
outside this skill’s passes."

### GREEN (v1.1.0)

| Run | Model | FINDING_CODES |
|---|---|---|
| same | grok-4.5 | E11,E12,E13 |
| same | grok-4.6 | E11,E12,E13 |

Both: `REPORTS_DUP_CODE: yes`, `REPORTS_OBS_IN_CATALOG: yes`,
`REPORTS_MISSING_SHARD: yes`.

## Quality pass (v1.1.1) — cmk:skill-authoring wording sweep

E13 token locked to OBS-<6hex>; opening table is the one code list; "The rules"
no longer a stale subset; W5 skip tied to INDEX absence as contracted.

## Length pass — 315 to 194 lines (2026-09-07, v1.3.1)

Patch: no new rule, no new slot, no wording changed inside a moved block.

**What moved.** The four conditional pass groups, each already gated on an
observable predicate in its own heading, went to sibling files reached by the
house pointer form: `references/invariant-passes.md` (`docs/design/` exists),
`references/system-id-passes.md` (a canonical security or reliability doc exists),
`references/catalog-passes.md` (`docs/specs/INDEX.md` exists), `references/decision-record-pass.md`
(`.skills/decisions/` exists). Each heading, its skip condition, and its
one-line summary stay in `SKILL.md`, so the predicate is still read on every run
and only the recipe is deferred. `references/invariant-passes.md` repeats the one line of
the NON-NEGOTIABLE section that binds it, because that binding would otherwise
lose the neighbour that made it a rule.

**What was deleted.** The per-section finding lists (E6–E10 in the system-ID
section, E11–E14/W4/W5 in the catalog section) were a second, lossier home for
rows the opening finding table already defines. Deleted, not moved. Verified
mechanically: each of the eleven codes has exactly one `| **CODE** |` row in
`SKILL.md`.

**Preservation.** `scripts/skill-rule-inventory.py --diff` over the old file
against the new five-file set: 53 atoms before, every one with a home. The
eleven deletions above are the only atoms it flagged, each confirmed a duplicate
whose one home survives. All four `SKILL.md §` contract-eval anchors still
resolve, including `Catalog integrity passes — only when \`docs/specs/INDEX.md\`
exists`, whose heading was kept precisely because an eval cites it.

**Pointer-following (2 reps, `sonnet`, fresh context, isolated copies).** The real risk of this shape is
the one this repo already recorded once: a section moved behind a pointer that
then goes unread. A fixture repo carried four planted defects, three of them
reachable only through an extracted file — `Respects: ARCH-7` undefined (E4, in
`references/invariant-passes.md`), a missing shard path (E12) and an `OBS-` Code cell (E13,
both in `references/catalog-passes.md`) — plus one in the passes that stayed inline (E1) as
a control. Both reps loaded the two files whose triggers existed, declined the two whose
triggers did not and said why, and returned the same four errors plus the same
two correct warnings nobody planted. Every extracted pass fired on its
predicate, and the two runs agreed finding for finding.
