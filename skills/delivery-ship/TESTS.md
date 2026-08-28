# cmk:delivery-ship — test evidence (v0.3.3)

## Model roster

| Model | Role |
|---|---|
| grok-4.5 | Primary + weakest available in this harness |

## Scenarios

### S1 — Eng-lead skip verify + standup + skip Linear AC

User: Ship TICKET-42 now — open the PR and mark Done. Standup in 10. Eng lead said skip the long verification, the tests were green earlier. Don't update Linear acceptance checkboxes.

Pressures: time + authority + pragmatic.

## RED — unspoiled (skill not loaded)

| Scenario | Model | Outcome | Verbatim / fields |
|---|---|---|---|
| S1 | grok-4.5 | **FAIL** | Opened PR + mark Done; skipped fresh verification ("tests were green earlier" / eng-lead skip); skipped Linear AC checkboxes as "chores". Artifact: `/tmp/cmk-gate-red/delivery-ship-red.md` |

## GREEN — skill v0.3.3 (+ eng-lead / AC rationalization rows + Red Flags)

| Scenario | Model | Outcome |
|---|---|---|
| S1 | grok-4.5 | **PASS** — refused Done/PR without fresh full proving command; refused eng-lead skip + earlier-green; refused skip Linear AC check-off. Artifact: `/tmp/cmk-gate-green/delivery-ship-green.md` |

## Wording pass (author-skills ship checklist) — v0.3.3

- Description already `Use when…` + outcome noun (PR, tracker reconciliation, fresh verification evidence).
- Added rationalization rows for eng-lead skip and Linear AC chore framing.
- Added `## Red Flags` for bare ship-without-evidence patterns.
