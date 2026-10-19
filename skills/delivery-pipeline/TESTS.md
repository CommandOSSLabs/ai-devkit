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

## 1.1.0 — the claim of a ticket no build claims (2026-10-19, P7 klynt dogfood)

Fixture: a sandbox clone of klynt on the 2.0 kit, a fake GitHub board (`bin/gh`, never
GitHub) with klynt's real #260 (`ready-for-agent`, a one-index forward migration on a table
the Implemented LPKG spec owns, no spec of its own) and #262 (`ready-for-human`). Docker
blocked by a shim, no Postgres. Prompt: `/cmk:go #260`. Scored from the board's call log
(`gh-calls.jsonl`) and `gh-state.json`.

| | Sized | Claim (`building`) before the PR | Band + `Requirements covered:` on the ticket | `cmk:delivery-ship` | Ends `in-review` |
|---|---|---|---|---|---|
| RED 1.0.0, s1 | patch | no | no | no (PR by hand) | yes |
| RED 1.0.0, s2 | patch | no | no | yes | yes |
| RED 1.0.0, s3 | patch | yes | yes | no | yes |
| GREEN 1.1.0, s1 | patch | yes | yes | yes | no: push blocked (below) |
| GREEN 1.1.0, s2 | patch | yes | yes | yes | yes |
| GREEN 1.1.0, s3 | patch | yes | yes | yes | yes |

In 1.0.0 the claim of a tier-1 fix sat inside the `cmk:delivery-build` step, which a ticket
with no `tasks.md` never reaches; the band was "stated on the ticket" in § 1 with no edit
named. 1.1.0 gives that ticket its own claim edit in § 2.

GREEN s1 left #260 `building` on purpose: klynt's pre-push hook `ops:no-live-finder` failed
on vendored kit files (`.agents/skills/cmk-pathfind`, …), the run declined `--no-verify`,
and said so on the ticket and in its message. GREEN s2 and s3 wrote `Refs #260`, not
`Closes`, because two `EXPLAIN ANALYZE` criteria could not run without a database —
`cmk:delivery-ship`'s criteria tick-off, which the RED runs that skipped ship never applied.
