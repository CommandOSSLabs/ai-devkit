# Foundation ladder — cmk:problem

Teaching is **in service of closing the problem**, not a parallel course.
Pure study with no product close → **name** `/cmk:explain`.

## TOC

1. Layers
2. Depth order
3. Subject adapter
4. Authority ladder
5. Teaching beat
6. Foundation → feature
7. Programming fundamentals
8. Handoff to understand

---

## 1. Layers

| Layer | Content | Close-the-problem use |
|---|---|---|
| **F0** | Why hard; 2–5 slow constraints; what fails if ignored | Before any architecture pick |
| **F1** | Ontology; pairs people wrongly collapse | Before naming components |
| **F5** | This repo as-is (`file:line`) | Before "we should add X" |
| **F2** | Named reference architectures (cited) | Comparing design classes |
| **F3** | Mechanisms / happy-path sequences | "How it works" leaves |
| **F4** | Platform / stack conventions (current docs) | Stack-specific leaves |
| **Gap** | Intentional tradeoff vs debt | As-is ≠ ideal |
| **Fail/Eval** | Failure modes; how wrong model is caught | Before locking a direction |
| **Ops** | Scaled to project posture | Production/MVP weight |
| **Delta** | Technical surfaces for live options | Only after F0+F1 (or explicit skip) |

## 2. Depth order

```text
new / partial:
  F0 → F1 → F5 (if repo) → F2/F3 (cited) → Gap/Fail → Ops
  → Delta only if ≥2 real options already present

strong:
  one-turn F0/F1 hole-check → fill holes only → same gate before Delta
```

Urgency is **not** a foundation skip. Time pressure → `/cmk:interpret`, or thin
prose while keeping order.

`foundation: explicitly_skipped` only on clear user opt-out; record in
`foundation-cards.md`.

## 3. Subject adapter

Before deep teaching, fill what you can in **this subject's** vocabulary:

| Probe | Layer |
|---|---|
| What problem does this exist to solve? What goes wrong if wrong? | F0 |
| 5–12 expert terms; commonly collapsed pairs? | F1 |
| Happy-path sequence when it works? | F3 |
| State stored where; write vs read owner? | F1 + F3 |
| Hard constraints (consistency, latency, security, scale, humans)? | F0 + Ops |
| Named external designs as *lenses* (not gospels)? | F2 |
| What does **this** repo do? | F5 |
| How detect a wrong mental model? | Fail/Eval |
| If option X lands, what technical surfaces move? | Delta |

Empty cells = open gaps. Inventing filler is forbidden. Never reuse another domain's map.

## 4. Authority ladder

| You may say | Only when |
|---|---|
| Fundamental constraint | F0/F1 or labeled **inference** |
| Reference architecture *Name* | F2 + named source |
| Mechanism pattern | F3 + tradeoff; source when material |
| In stack *S* | F4 + current docs / research |
| In this repo | F5 + `file:line` or honest not-found |
| We measured | evidence path / spike result |
| "Industry standard…" | **Never** without tier + source |

## 5. Teaching beat (one layer)

1. Announce primary layer + kind (factual | conceptual | procedural | metacognitive)
2. Teach with **one** concrete example (no second analogy re-pass)
3. Tie to the **active leaf** (why this cell unblocks it)
4. Soft probe at most one (skip if leaf recipe already got articulation)
5. Write card to `foundation-cards.md`

## 6. Foundation → feature

```text
constraints & ontology → as-is repo → mechanisms → options/delta → decision
```

Wrong:

- Jump to options from vibe or other-session rec alone
- Endless F0–F3 with no leaf progress (time-box foundation; recompose with gaps)
- Feature comparison that never names F0 constraints options must satisfy

## 7. Programming fundamentals

Attach to the active leaf when material (not a lecture dump):

- Correctness / invariants
- Data ownership / single writer
- Boundaries and seams
- Explicit failure handling
- Observability of wrong models
- Trust boundaries
- Cost of irreversibility

## 8. Handoff to understand

**Name** `/cmk:explain` when:

- User wants slow multi-layer study with **no** carry-back pressure
- Same gap needs two re-explains / sticky proof
- Subject is far larger than the active leaf (domain onboarding)

