<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# TESTS.md — go

## 2026-10-19 — 1.0.0

Fixture: `harbor-ledger` with overlays `latefee-plan` and `fmt-plan`, plus
`scenarios/gh-board.sh` (the board on a stateful `bin/gh`, never GitHub) and
`scenarios/gh-roles.sh`. `scenarios/wf-pre-open.sh` replaces the working agreement with
"Anyone — people and agents — may file, comment on, update status of, and link
tickets." The design is `docs/design/2026-10-19-closed-workflow.md` (W7); the workflow
page is `docs/guide/workflow.md`.

**RED (`cmk:delivery-pipeline` 1.1.0, user-invoked).** Prompt: "/cmk:delivery-pipeline #23 — just this one
today". 1 haiku built only #23, so the scope is a no-op. In that run #23 got
`in-review` and `Closes #23` but no `building` claim at the start. `/cmk:go` exists because
the owner chose five short commands (design decision 3). A user-invoked skill cannot be
invoked, so `cmk:delivery-pipeline` dropped `disable-model-invocation` (2.0.0).

**GREEN (1.0.0, with `cmk:delivery-pipeline` 2.0.0).** Prompt: "/cmk:go #23 — just this one today."
1 haiku.
- Only #23 was built: yes.
- Claimed with `building` and an assignee: yes.
- Moved to `in-review`: yes.
- PR carries `Closes #23`: yes.

## 1.0.1 — no pointer to a jdk-repo page (2026-10-19)

The klynt dogfood ran `/cmk:idea` and reported that `docs/guide/workflow.md`, which the skill
named for states and owners, "doesn't exist in this checkout". That page lives in the jdk
repo, not in the repos that install the skill. The pointer now names
`docs/agents/triage-labels.md`, which `cmk:repo-config` writes into every repo. Wording
only.


## W9 chain on the cmk kit (ADR 0001 P3, 2026-10-19)

All 93 skills installed (`scenarios/wf-run-cmk.sh`), harbor-ledger with `latefee-plan` and
`fmt-plan`; GitHub = the stateful `bin/gh` (`gh-board.sh` + `gh-roles.sh`); Linear = the fake
MCP, team LED (`linear-board.sh`, PRs still on `bin/gh`). Scored by `wf-score.py` /
`linear-score.py` from tracker state and calls, not from the report.

| Step | GitHub haiku | GitHub sonnet | Linear haiku | Linear sonnet |
|---|---|---|---|---|
| `/cmk:idea` SMS idea | filed, `status:shaping` only, frame comment | same | LED-109, Backlog + `status:shaping`, frame comment | same |
| `/cmk:shape #24` (no spec) | `status:shaping` only, stopped for the tier | same | Backlog + `status:shaping`, stopped | same |
| `/cmk:go #23` | `building` → `in-review`, PR `Closes #23`, 7 subagents | same, plus a follow-up ticket for deferred findings | In Progress → In Review, PR `Fixes LED-23` | same, `cmk:tdd` ×4, simplify, ship |
| `/cmk:board` | 0 writes; PR #14 decision, #25 question, #27 untriaged, #24 ready with no spec, #21 missing in-review | same | 0 writes, PR decision listed | same |
| `/cmk:release` | v0.5.0, #23 `status:shipped` | same | — (merge does not close a fake-Linear issue) | — |

Found and fixed: both GitHub `/cmk:go` runs built without loading `cmk:delivery-build` — the
converter had turned "use `build-in-waves`" into a pointer at one of its references; the
pipeline now hands off to the skill (`cf82c3c`).
