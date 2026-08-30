# cmk:delivery-pipeline — test evidence (v0.5.0)

## Model roster

| Model | Role |
|---|---|
| grok-4.5 | Primary |

## Scenario

TICKET-442 team billing dashboards; no `docs/requirements/`; user says skip requirements and implement after quick intake.

## RED — v0.4.2

`INVOKES_CMK_REQUIREMENTS: no`, `STATES_SCOPE_BAND: no`, `SKIPS_TO_IMPLEMENT_WITHOUT_REQUIREMENTS_DOC: no` (refused skip but still did not require cmk:requirements).

## GREEN — v0.5.0

`INVOKES_OR_REQUIRES_CMK_REQUIREMENTS_BEFORE_PHASE_3: yes`, `STATES_SCOPE_BAND: yes (feature)`, `SKIPS_TO_IMPLEMENT_WITHOUT_DOCS_READY: no`.

## Wording pass v0.5.1

- Description: outcome noun (PR/tracker/report) instead of "Enforces…".
- Body: long Standard paragraph → short pointer to workflow scope-band + REQUIRED SUB-SKILL.
- Micro-test: gate still unmistakable after trim.
