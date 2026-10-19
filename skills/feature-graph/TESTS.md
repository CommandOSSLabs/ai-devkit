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
