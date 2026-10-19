<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# TESTS.md — shape

## 2026-10-19 — 1.0.0

Fixture: `harbor-ledger` with overlays `latefee-plan` and `fmt-plan`, plus
`scenarios/gh-board.sh` (the board on a stateful `bin/gh`, never GitHub) and
`scenarios/gh-roles.sh`. `scenarios/wf-pre-open.sh` replaces the working agreement with
"Anyone — people and agents — may file, comment on, update status of, and link
tickets." The design is `docs/design/2026-10-19-closed-workflow.md` (W7); the workflow
page is `docs/guide/workflow.md`.

#24 ("Statement data for one vessel and month") is labelled `ready-for-agent` and has no
spec. **The RED is in `cmk:delivery-spec-plan` 1.9.0's TESTS.md.** Publishing onto an existing ticket
left two state roles in 2/3 runs. That fix lives in `cmk:delivery-spec-plan`, and this command routes
to it.

**GREEN (1.0.0).** Prompt: "/cmk:shape #24 — I'm at the Port Authority until 5; leave me
whatever needs my approval." 2 haiku.
- `shaping` became the only state role: 2/2.
- Framed as tier 2, provisional, and stopped for Lan's answers before any requirements
  were written: 2/2.
- A comment on #24 says what waits and on whom: 2/2. Verbatim (h1): "Shape drafted for
  #24: waiting on Lan Pham (approval of the frame below)."

Not covered: the resume path (`/cmk:shape #24` after approval through design and plan), and
tier 1 (`cmk:debug`).

## 1.0.1 — no pointer to a jdk-repo page (2026-10-19)

The klynt dogfood ran `/cmk:idea` and reported that `docs/guide/workflow.md`, which the skill
named for states and owners, "doesn't exist in this checkout". That page lives in the jdk
repo, not in the repos that install the skill. The pointer now names
`docs/agents/triage-labels.md`, which `cmk:repo-config` writes into every repo. Wording
only.

## 1.1.0 — a tier-1 fix leaves Shaping ready for `/cmk:go` (2026-10-19), W10

The fixture is `harbor-ledger` with overlays `latefee-plan` and `fmt-plan`, plus four
scenarios in order:
- `gh-board.sh` puts the board on a stateful `bin/gh`, never GitHub.
- `gh-roles.sh` maps the `status:*` labels.
- `wf-pre-bug.sh` files #28, "Same-day booking breaks the invoice API".
- `wf-pre-tier1.sh` (for `/cmk:go`) or `wf-pre-bugshaping.sh` (for `/cmk:shape`). `wf-pre-tier1.sh`
  confirms the cause, amends BERTH-1.2, adds BERTH-4.1 (the fix) and BERTH-4.2 (its
  `SHALL CONTINUE TO` guard), and puts `Requirements covered: BERTH-4.1, BERTH-4.2` on a
  Ready #28. `wf-pre-bugshaping.sh` puts #28 in `status:shaping` with a triage brief that
  marks the cause as open.

The design is `docs/design/2026-10-19-closed-workflow.md` (W10, option A, the owner's choice).

Prompt: "/cmk:shape #28 — If the cause is nights() rejecting same-day stays, I accept it. For
the fix: a same-day stay counts as one night, and multi-night stays must keep counting as
they do now — I approve a mini-spec saying exactly that as you draft it."

**RED (1.0.1).** 0/3 left a ticket `/cmk:go` could take:
- haiku h1 recorded the approval but kept #28 in Shaping;
- haiku h2 made it Ready with no `Requirements covered:` line;
- sonnet kept the mini-spec as Draft and waited for an approval it had been given.

**GREEN (1.1.0).** Step 3 gains a tier-1 branch. An up-front approval counts when the
drafted text matches it, and the approval is quoted. `Requirements covered: <fix>,
<guard>` goes into the body, and `shaping` is swapped for `ready-for-agent` in one edit.
- Ready with `Requirements covered:`: 3/3.
- The IDs are defined, with a `SHALL CONTINUE TO` guard among them: 3/3. Two wrote into
  `berth-booking/requirements.md`. One haiku created `docs/specs/2026-10-19-same-day-stay/`
  and left it uncommitted.

Not covered: that uncommitted spec directory. `cmk:debug` says the mini-spec goes into
the owning feature's `requirements.md`.
