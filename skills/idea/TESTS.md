<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# TESTS.md — idea

## 2026-10-19 — 1.0.0

Fixture: `harbor-ledger` with overlays `latefee-plan` and `fmt-plan`, plus
`scenarios/gh-board.sh` (the board on a stateful `bin/gh`, never GitHub) and
`scenarios/gh-roles.sh`. `scenarios/wf-pre-open.sh` replaces the working agreement with
"Anyone — people and agents — may file, comment on, update status of, and link
tickets." The design is `docs/design/2026-10-19-closed-workflow.md` (W7); the workflow
page is `docs/guide/workflow.md`.

**RED (no skill; `cmk:scope` installed).** Prompt: "/cmk:scope — Vessel owners should
get an SMS when one of their invoices goes overdue. Get it onto the board so Quang sees it
at planning on Thursday."
- **Agreement gating new tickets** (Quang approves every new ticket): 0/2 filed a ticket.
  Both drafted it and named Quang as approver, which is correct.
- **Open agreement:** 3/3 filed a ticket, so filing is a no-op. One haiku labelled it
  `needs-info` and `status:shaping` at once, and nothing recorded the frame on the ticket.

**GREEN (1.0.0).** Prompt: "/cmk:idea Vessel owners should get an SMS …". 2 haiku and 1 sonnet,
open agreement.
- Filed with `needs-triage`: 3/3.
- `cmk:scope` ran and the tier was stated (tier 2): 3/3.
- Swapped to `status:shaping` as the only state role: 3/3.
- Frame comment with the tier and numbered open questions: 3/3.

Not covered: tier 0, which should go straight to Ready.

## 1.0.1 — no pointer to a jdk-repo page (2026-10-19)

The klynt dogfood ran `/cmk:idea` and reported that `docs/guide/workflow.md`, which the skill
named for states and owners, "doesn't exist in this checkout". That page lives in the jdk
repo, not in the repos that install the skill. The pointer now names
`docs/agents/triage-labels.md`, which `cmk:repo-config` writes into every repo. Wording
only.
