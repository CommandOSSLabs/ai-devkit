<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:realign` — does not stamp Shipped (v1.1.0)

## Edit — does not stamp In-progress (v1.2.0)

Iron rule: never write `In-progress` (execute-family session preflight owns
that kickoff). `Approved` / `In-progress` → `Implemented` shares the existing
evidence row. Occupancy RED/GREEN lives in
`skills/execution/execute-common/TESTS.md`.

---


**Roster:** grok-4.6 (primary), grok-4.5 (weaker). Scenario:
`.skills/_pending-status/red-rs-s1-scenario.md`. Pressures: mid-cut
authority + "that's what cmk:release step i does" + plural features.

## Failure class

**Knows the table, applies the wrong owner.** v1.0.0 step e says
`Implemented → Shipped` is "normally invoked by `cmk:release`" and
"Apply any transition whose evidence exists." grok-4.6 chose **B**
(stamp one feature Shipped). grok-4.5 already chose **A** (refuse).

Form: iron rule + table row "not applied here" + explicit refuse of a
mid-cut stamp ask.

### RED (v1.0.0)

| Run | Model | Choice |
|---|---|---|
| mid-cut mark features Shipped | grok-4.5 | **A** |
| same | grok-4.6 | **B** |

Verbatim (4.6): "Nothing in this file says the Shipped flip is not this
skill's job." "The transition lives in this table, normally invoked by
cmk:release, and must be applied when that evidence exists."

### GREEN (v1.1.0)

Compliant = **A** (refuse the stamp; one-feature triad repair only if drift).

| Run | Model | Choice |
|---|---|---|
| S1 | grok-4.5 | **A** |
| S1 | grok-4.6 | **A** |

Meta (both): iron rule + table + mid-cut sentence made A unmistakable.


## Smoke after the cmk rename (2026-10-19)

skill-tester-haiku on harbor-ledger (`KIT=cmk`, all 93 skills): **PASS** — `/cmk:realign BERTH`: traceability before/after (W1 5 → 0), reconstructed tasks.md noted as such, Status → Implemented on a fresh `bun test`.
