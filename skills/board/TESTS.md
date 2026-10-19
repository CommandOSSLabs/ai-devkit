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
