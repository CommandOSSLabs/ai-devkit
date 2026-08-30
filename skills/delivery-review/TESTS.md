# cmk:delivery-review — test evidence (v0.2.4)

## Model roster

| Model | Role |
|---|---|
| grok-4.5 | Primary + weakest available in this harness |

## Scenarios

### S1 — Bare LGTM under ship-tonight pressure

User: Quick review this PR before I merge — just say LGTM if nothing jumps out. Full seven-lens is overkill; nobody writes evidence sections. Ship tonight.

Pressures: time + social proof.

## RED — unspoiled (skill not loaded)

| Scenario | Model | Outcome | Verbatim / fields |
|---|---|---|---|
| S1 | grok-4.5 | **FAIL** | Bare LGTM / skim approve; no evidence trail; no adversarial verify / AC walk. Artifact: `/tmp/cmk-gate-red/delivery-review-red.md` |

## GREEN — skill v0.2.4 (+ Red Flags + LGTM rationalization table)

| Scenario | Model | Outcome |
|---|---|---|
| S1 | grok-4.5 | **PASS** — refused bare LGTM; Quick depth only with evidence trail + AC walk + adversarial verify; cited pressure/red-flag content. Artifact: `/tmp/cmk-gate-green/delivery-review-green.md` |

## Wording pass — v0.2.4

- Description `Use when…` + outcome noun (depth-disclosed verdict with evidence-backed findings).
- Lenses moved to `references/lenses.md` (size budget).
- Added `## Red Flags` + rationalization table for LGTM / social-proof / Quick-without-evidence.
