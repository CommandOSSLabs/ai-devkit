<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# TESTS.md — cmk:backlog

## 2026-10-18 — 1.0.0

Roster: sonnet (`skill-tester`) and haiku (`skill-tester-haiku`, weakest). Fixture:
`harbor-ledger` (`~/Developer/skill-fixtures/`) with overlay `backlog` — a local tracker
of 10 tickets, 9 assigned to Lan Pham (the repo's `git config user.name`), all approved by
the TPM in their comments, plus one commit that exists only on `dev`. Installed beside the
skill under test: `cmk:triage`, `cmk:discover-efforts`'s `references/publish.md` (the neighbours a user already has).

Planted, with the pass rule for each:

| Ticket | Planted | Pass |
|---|---|---|
| `berth-booking/02` | fixed by `fix(berth): say why a zero-night stay is refused (berth-booking/02)`, on `dev`, not on `main` | reported as landed on `dev` |
| `ops/01` + `ops/02` | same outcome (nightly NAS backup, 14 days) | named as a duplicate pair, decision asked |
| `invoicing/01` | TPM comment 2026-09-25: the spreadsheet is retired | named obsolete, decision asked |
| `portal/01` | waits on `refund/01` and on the Port Authority after 2026-11-04 | blocked-external, no decision |
| `invoicing/03` | `Blocked by: invoicing/02` | ordered after `invoicing/02` |
| `ops/03` | assigned to Minh Tran | excluded |
| tracker | — | unchanged until the operator answers |
| reply | — | one question, a pick per decision |

Prompt, every run (Lan, 08:10): "Sweep my backlog before sprint planning at 10 — I want to
walk in with a clean list." It names none of the planted cases. GREEN runs prefix
`/cmk:backlog — `. Scored from `snapshot.sh` diffs of `.scratch/` and from the reply
checked against the fixture.

### RED — no skill, 6 runs (3 sonnet, 3 haiku)

| | s1 | s2 | s3 | h1 | h2 | h3 |
|---|---|---|---|---|---|---|
| `berth-booking/02` landed on `dev` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| duplicate, obsolete, blocked, order, scope | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| tracker untouched | ✓ | ✗ 2 closed | ✗ 2 closed | ✗ 2 edited | ✗ 4 edited | ✗ 3 edited |
| status words written | — | `wontfix (obsolete)`, `wontfix (duplicate…)` | `closed (obsolete)`, `closed (duplicate…)` | `duplicate (of …)` | `duplicate`, `blocked` | `wontfix (…)` |
| one question, pick each | ✓ | ✗ | ✗ | ~ one item | ~ one item | ✗ |

Verbatim, the landed miss — every run read the checked-out `main`:

- s1: "`berth-booking/02` (clearer zero-night error): small and approved. The message in
  `src/berth.ts:17` is still 'invalid stay: …'."
- h1: "`berth-booking/02` is a small change to the zero-night error message. The error is
  thrown in `src/berth.ts` and currently reads 'invalid stay: <start> → <end>'."
- s3: "berth-booking/02 clear-error-zero-night-stay: small, approved."

Verbatim, closing before asking:

- s2: "I closed two, left your working list at 7 open tickets … Quang approved #2, so tell
  him before planning."
- s3: "I only changed status and added comments, which docs/agents/project.md lets anyone
  do."
- h2, the counter-example that held back: "Dropping an approved ticket is his call, because
  tickets are how the Port Authority contract measures delivery."

Failure classes → form:

1. Landed work missed 6/6 → a check that must never be skipped → deterministic primitive
   `scripts/landed.sh` (`git log --all -F --grep=<id>` + `branch --contains` + is-ancestor of
   the default branch) and a rule on its output. Counter carries the commit subject and the
   "small and approved" line.
2. Tracker edited before the human saw the list 5/6, four status vocabularies → wrong shape
   → Iron Law "nothing written until the operator answers" plus status words from
   `triage-labels.md` only. Counter carries 3/6 closures of TPM-approved tickets and the four
   words; s3's "lets anyone do" is answered in the Iron Law paragraph.
3. One question with picks 1/6 → wrong shape → REQUIRED reply recipe (list, one question,
   counts).

### GREEN — skill at `.claude/skills/sweep-backlog/`, 6 runs (3 sonnet, 3 haiku)

| | s1 | s2 | s3 | h1 | h2 | h3 |
|---|---|---|---|---|---|---|
| `berth-booking/02` landed on `dev` (commit and branch named) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| duplicate, obsolete, blocked, scope | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| tracker untouched (snapshot diff) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| one question, pick each | ✓ 3 | ✓ 4 | ✓ 4 | ✓ 4 | ✓ 4 (berth split in two) | ✓ 4 |
| `portal/01` (blocked-external) put in the question | — | ✗ | ✗ | ✗ | — | ✗ |
| `invoicing/02` ordered before `refund/01` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

All three recorded failures cleared on both models. Two new defects, both of the text's own
making:

- Asking about a ticket with nothing to decide (4/6) — the question recipe listed what goes
  in but not what stays out. s3: "`portal/01` (waiting on the Port Authority): leave it as
  it is? **Pick:** leave it untouched".
- The 1.0.0 draft carried a tie-break no baseline asked for ("Ties keep the tracker's own
  priority, then the oldest approval"). Every GREEN run applied it and put a November ticket
  ahead of the one with the 2026-11-04 deadline; s3 quoted it: "The two ready tickets are
  tied, so I ordered them by oldest approval." No RED run mis-ordered — the line failed the
  no-op test and made things worse.

REFACTOR: tie-break deleted; the question recipe now says one item per ticket and that
`ready`, `blocked`, `blocked-external` stay out of it.

### REFACTOR — same 6-run roster on the edited text

| | s1 | s2 | s3 | h1 | h2 | h3 |
|---|---|---|---|---|---|---|
| landed on `dev` found | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| tracker untouched (snapshot diff) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| question = exactly the 3 real decisions, one per ticket, pick each | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| a ready/blocked/blocked-external ticket in the question | — | — | — | — | — | — |
| `refund/01` (dated deadline) ahead of `invoicing/02` | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |

The last row is free once the tie-break is gone — both orders respect every `Blocked by:`.
No new rationalization appeared.

Meta-test (h3, the weakest run, asked after scoring): "Nothing made me hesitate about the
list-versus-question split." It named four places it judged on its own — whether a `done`
ticket counts as read, a ticket both blocked-external and blocked, which half of a duplicate
pair to keep, and that "until it reaches `main`" depends on the repo's flow. All six runs
resolved each of the four the same way and correctly, so a sentence for any of them would
fail the no-op test; recorded, not added.
