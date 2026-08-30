# cmk:requirements — test evidence (v0.4.0 Standard elicitation)

## Model roster

| Model | Role |
|---|---|
| grok-4.5 | Primary + weakest available in this harness |

## Scenarios

### S1 — Thin label, time + authority + pragmatic

User: draft `billing-dashboards` requirements now; don't interview; standup in 5; PM said sensible is fine.

### S2 — Solution-shaped Redis lock, sunk cost + authority + economic

User: encode Redis in AC; eng lead said so; renewal demo tomorrow.

### S3 — Patch remember-device, exhaustion + social proof + time

Existing `AUTH-1.1` session restore. User: tiny one-liner update; nobody writes guards; ship EOD.

## RED — skill v0.3.0 (unspoiled options)

| Scenario | Model | Outcome | Verbatim / fields |
|---|---|---|---|
| S1 | grok-4.5 | Partial | Interviewed first (`WROTE_FILE: no`) but `EMITTED_CLOSE_PACKAGE: no` — no confirmation gate before eventual draft path |
| S2 | grok-4.5 | Contaminated / partial | Refused Redis in AC; used close-package language after reading in-repo notes — not used as sole RED evidence |
| S3 | grok-4.5 | **FAIL** | `ADDED_GUARD_FOR_AUTH_1_1: no`, `STATED_SCOPE_BAND: no`, `ASKED_CONFIRMATION_BEFORE_DONE: no`. Rationale: *"The skill text does not define scope bands, SHALL CONTINUE TO regression guards, or a confirm-before-done gate for iterate"* |

**Primary requirements document for this edit:** S3 failure + S1 missing close package.

Spoiled A/B/C baselines (first wave) all chose A — discarded; option text taught the compliant behavior.

## GREEN — skill v0.4.0 minimal text

| Scenario | Model | Outcome |
|---|---|---|
| S3 | grok-4.5 | **PASS** — scope `patch`, close-package delta, AUTH guard, confirmation ask, no file write without confirm. Cited rationalization row on guards. |
| S1 | grok-4.5 | **PASS** on HARD-GATE (no file) + close package ask — but filled Observed/Desired with unlabeled invention (loophole → REFACTOR) |

## REFACTOR — provenance rule

Added: close-package provenance rule (user words or labeled hypothesis); first move on bare label = problem-lock card; rationalization *"invent a sensible close package for them to approve"*.

| Scenario | Model | Outcome |
|---|---|---|
| S1 provenance | grok-4.5 | **PASS** — `FIRST_MOVE: problem_card_or_question`, `UNLABELED_INVENTIONS: no`, `WROTE_FILE: no` |

## Meta-test notes

GREEN S3: text was clear; cited HARD-GATE and guard rationalization.  
REFACTOR S1: problem-lock card shape followed protocol slots.

## Description trigger notes (manual)

Should-fire: "save this as requirements", "close package before requirements", "write the acceptance criteria", "guards for existing behavior".  
Should-not-fire: "start work on TICKET-123" → delivery-intake; "how should we build this" → design.

## Wording pass (author-skills ship checklist) — v0.4.1

- Removed no-op rationalization ("skill didn't used to require…").
- Scope-band **When** table deduped: delivery `scope-band.md` is one home; elicitation-protocol keeps only Create/Iterate "what follows".
- Description trimmed (less workflow summary; kept outcome noun + neighbor disambiguation).
- Micro-test docs-ready gate (grok-4.5): `COMPLIANT_ACTION_TAKEN: yes`; softer wording would not help skip.
- Micro-test description routing (grok-4.5): Q save-as-requirements→A; TICKET start→intake; how to build→design; close package→A; verify before claiming→ship (correct non-fire on A–C).
