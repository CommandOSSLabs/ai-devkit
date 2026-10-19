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


## Merge into cmk (ADR 0001, 2026-10-19)

The jdk `deliver-issues` body replaced 0.5.3; cmk's superpowers phase engine is gone
(`cmk:delivery-build` executes). Kept from 0.5.3: cluster mode (`references/cluster-mode.md`,
named list = scope, transitive closure only for a derived seed), context efficiency, Linear.
Added for ADR 0001 decision 4 (unattended work by scope band):

| Run | Body | Result |
|---|---|---|
| `/cmk:go #24 #28` — #24 a new endpoint with no spec, #28 a half-day due-date change on approved BERTH with no spec (sonnet, `scenarios/wf-run-cmk.sh`, `p3-pre-patch.sh`) | jdk-only | **RED** — both moved out of Ready as "not buildable yet"; #28 refused for lacking `tasks.md` |
| same | 1.0.0 | **GREEN (D2)** — #24 not eligible (feature, no spec); #28 sized `patch`, mini-spec BERTH-2.4 + guards 2.5/2.6 appended, built test-first, independent review, PR #14 headed **Decisions taken** |

Open: in that GREEN run the PR was opened without loading `cmk:delivery-ship`, and review ran on
the pre-merge cmk body; the W9 chain re-runs the whole path on the merged skills.
