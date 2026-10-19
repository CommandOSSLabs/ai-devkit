<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# TESTS.md — board

## 2026-10-19 — 1.0.0 (closed workflow W6)

Fixture: `harbor-ledger` + overlays `latefee-plan`, `fmt-plan`, then `scenarios/gh-board.sh`
(the board on a stateful `bin/gh`, never GitHub) and `scenarios/gh-roles.sh` (the four
newer state roles mapped to `status:*` labels). Scored by `scenarios/wf-score.py` and the
final report. Design: `docs/design/2026-10-19-closed-workflow.md`.
Before the run, `scenarios/wf-pre-pr.sh` opens PR #14 for #21 with "Closes #21" and a "Needs a
decision before merge" section, and takes #21 off the ready column without adding
`in-review`. The board then has:
- PR #14 with its parked decision;
- #25 `needs-info`, with a question to Lan;
- #26 `ready-for-human`, held by Minh;
- #27 untriaged;
- #22 and #23 eligible, with #22 blocked by #21;
- #24 `ready-for-agent` with no spec.

**RED, no skill.** Prompt: "What's waiting on me this morning? Standup is in ten minutes."

| | h1 | h2 | s1 |
|---|---|---|---|
| PR #14's decision | yes | yes | yes |
| #25's question | yes | yes | yes |
| #27 untriaged | no | no | yes |
| #24 ready with no spec | no ("approved for November") | no | no |

**GREEN (1.0.0).** `scripts/board.py` prints every section, always. A `Board and repo
disagree` section catches a ready ticket with no approved spec, an open PR's ticket with
no `in-review` role, an open ticket whose spec is `Implemented` or `Shipped`, and a ticket
with two state roles. Prompt: "/cmk:board — What's waiting on me this morning? …"

| | h1 | h2 | s1 |
|---|---|---|---|
| ran `board.py` | yes | yes | yes |
| PR decision quoted, #25 question, #27 to triage | yes | yes | yes |
| #24 named as not eligible, spec missing | yes | yes | yes |
| #21's PR without `in-review` named | yes | yes | yes |
| tracker writes | 0 | 0 | 0 |

Not covered: Linear (run with `--issues` and `--prs` files), Notion drafts passed with
`--drafts`, and a board of more than 30 tickets.

## 2026-10-19 — 1.0.1, found by the klynt dogfood (closed workflow W9)

`/cmk:board` ran on the real KlyntLabs/klynt board through `/tmp/klynt-dogfood/bin/gh`: reads go
to GitHub, writes are logged and never sent. Both haiku and sonnet ran `board.py`, and 0
writes reached GitHub. But the script told them that the four stale `ready-for-agent`
tickets (#258, #253, #252, #243) had "no spec" and should be swapped to `shaping`. Their
specs are `Implemented`. Two causes:
- **Link in the Spec cell.** klynt writes it as a markdown link, `[spec](../dir/)`, and the
  script read only a bare path or a `` `path` ``.
- **Blank line inside the table.** `learning.md` has one, and the script took the next row
  (CFGC) as a new header, so CFGC, QUIZ and FLASH were lost.

1.0.1 finds columns by header name, reads a link target, treats a header as the row a
`|---|` line follows, and also matches a `[CODE]` title. On the same board it now reports
five open tickets whose spec reads `Implemented`: the four, plus #261 [CCOL], which the T20
dogfood had missed.

## 1.0.2 — tier-1 fixes (2026-10-19), W10

`board.py` counts a `bug` as eligible ("eligible, tier-1 fix") when its `Requirements
covered:` IDs are all defined in a `requirements.md` or in `docs/specs/fixes.md`, with
one of them a `SHALL CONTINUE TO` guard. Such a ticket never draws an "open, but <CODE>
reads Implemented" line, because a bug on a shipped feature is normal.

Checked deterministically on the W10 fixture:
- #28 with BERTH-4.1 and its guard 4.2: `eligible, tier-1 fix`, and no disagreement line.
- The same ticket with its `Requirements covered:` removed: `NOT eligible`, plus "#28 is
  ready, but its spec is missing".

## 1.1.0 — a ready ticket with no spec is unsized, not a disagreement (2026-10-19, P7 klynt dogfood)

Since ADR 0001 decision 4, `/cmk:go` sizes a ready ticket with no spec and builds a trivial
or patch one (scope-band.md § Unattended work). `board.py` 1.0.2 still printed such a ticket
`NOT eligible` with "is ready, but its spec is missing".

Fixture: a sandbox clone of klynt on the 2.0 kit; a fake GitHub board (`bin/gh`, never
GitHub) holding klynt's real open issues: #260 (`ready-for-agent`, a one-index forward
migration on a table the Implemented LPKG spec owns, no spec of its own), #262
(`ready-for-human`). Prompt: "/cmk:board — I'm about to run /cmk:go before I leave. What
will it pick up, and what's waiting on me?" A `/cmk:go #260` run on the same board sized
#260 `patch`, wrote LPKG-9.5 and its guard 10.25, and opened its PR.

| | #260's line | The answer |
|---|---|---|
| RED 1.0.2, s1 | NOT eligible + "spec is missing" | "If you run `/cmk:go` now, it will do nothing. … spec #260 first." |
| RED 1.0.2, s2 | NOT eligible + "spec is missing" | "`/cmk:go` will pick up nothing … shape #260 first." |
| GREEN 1.1.0, s1 | no spec, unsized | "`/cmk:go` will size #260 and build it if it's small." |
| GREEN 1.1.0, s2 | no spec, unsized | "`/cmk:go` will size and likely build #260." |

The same misreading reached the operator once before the runs: the `cmk:repo-config` run
that set the board up quoted the script and said "`/cmk:go` won't build it until a spec
exists".

`board.py` now reads `Scope band:` from the ticket body or any comment (the line
`cmk:delivery-intake` writes). No spec and no band: "no spec, unsized". Band `trivial` or
`patch`: eligible. Band `feature`, or a spec that is not Approved: `NOT eligible` plus the
disagreement line, as before. Checked deterministically: three synthetic tickets with
`Scope band: **feature**` in a comment, `` `patch` `` and `trivial` in the body print
`NOT eligible` with "spec is missing (scope band feature)", "eligible, patch: /cmk:go writes
its mini-spec first" and "eligible, trivial". The W10 variant of #28 without `Requirements
covered:` now prints "no spec, unsized" instead of "NOT eligible".
