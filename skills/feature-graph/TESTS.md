<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:feature-graph` — catalog query / Pass R modes (v1.1.0)

**Roster:** grok-4.6, grok-4.5 (shared with cmk:scope catalog RED).

## Edit — Pass R flat + sharded; snapshot ≠ chat dump

**Origin.** Query-first catalog slice. `cmk:scope` v1.1.0 RED showed agents
paste all 120 INDEX rows when told INDEX is small (`FULL_INDEX_IN_CONTEXT: yes`).
Pass R already read INDEX for the registry set; it lacked sharded mode and a
one-home context policy.

**Form:** `references/catalog-query.md` (modes, caps, recipe) + Pass R mode
detect; SKILL clarifies snapshot enumeration ≠ chat dump.

**Contract check:** flat bootstrap INDEX still parses; sharded router reads
listed `docs/specs/catalog/*.md` shards into `registered`; OBS cards are not
registry members.

## Edit — observations band (v1.2.0 / fsubr-1.2)

**Roster:** grok-4.6, grok-4.5. Scenario:
`.skills/_pending-reconcile/red-fsub-obs-scenario.md`.

**RED (v1.1.0 / fsubr-1.1), 2/2.** Both: `OBS_IN_ENVELOPE: no`,
`HAS_OBSERVATIONS_BAND: no`, `NEIGHBORS_CODES_ONLY: yes` — Pass R explicitly
excluded active OBS from the registry; no envelope field existed.

**Failure class:** omits an element from the retrieval package.
Form: Pass O + required `observations[]` band (Recognized stay in `neighbors[]`).

**GREEN (v1.2.0 / fsubr-1.2), 2/2.** Both: `HAS_OBSERVATIONS_BAND: yes`,
`OBS_IN_ENVELOPE: yes` (`OBS-5682de`), `NEIGHBORS_CODES_ONLY: yes`.

## Quality pass (v1.2.1) — cmk:skill-authoring wording sweep

Description drops workflow/prohibitions; envelope field walk deferred to
envelope.md; grounded-claims keeps consuming `observations`.

## 1.4.0 — a person's blast-radius question routes here (2026-10-19)

The description named only the skills that call this one ("Use when cmk:scope, … needs
feature neighbors"), so no question a person types reached it: `graph1` ("Which features
and specs does invoiceView touch, and what's its blast radius?") missed on the jdk set
(`load-subgraph`) and on cmk in every P3 routing run. Harbor-ledger, all 93 skills, sonnet,
`skill-fixtures/triggers/fg.tsv` ×3:

| | Should fire (blast radius, affected IDs, overlap with existing work) | Should not fire (how it works, review my branch, why we decided) |
|---|---|---|
| RED 1.3.1 | 0 / 9 | 9 / 9 |
| GREEN 1.4.0 | 8 / 9 | 9 / 9 |

1.4.0 opens on the person's question and its words (features, specs, requirement IDs, blast
radius, overlap) and keeps the calling skills after it. Side check on the same fixture
(`fg-side.tsv`): `cmk:debug` 6/20 against 8/20 before (within the run-to-run spread recorded
in `cmk:skill-authoring`'s TESTS.md § 1.3.2), a new-feature idea 3/3 to `cmk:scope` on both,
and this skill fired on none of them.
