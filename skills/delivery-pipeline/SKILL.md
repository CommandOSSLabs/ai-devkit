---
name: cmk:delivery-pipeline
description: Use when every ready ticket on the board, or a named set or cluster of tickets, must be built, reviewed and opened as pull requests in one unattended run — the delivery behind /cmk:go, "deliver the board", "work on TICKET-123", "build every ready ticket", ending with one message for whatever needs the operator.
version: 1.1.0
---

# Delivery pipeline

Take the board's eligible tickets to pull requests while the operator is away. Each one
goes through the same chain a single ticket gets, in dependency order, and the run ends
with one message.

## The Iron Law

```
EVERY TICKET GETS ITS OWN BUILD, REVIEW AND LANDING. A BOARD OF THEM IS NOT A REASON TO SKIP ONE.
```

Four baseline runs on a four-ticket board, ten approved tasks, without this skill: all
four wrote every task in the controller. Across the four there were 0 implementer or
reviewer dispatches, 0 `cmk:delivery-review` and 0 `cmk:delivery-ship`, and one run loaded no skill
at all. A haiku run explained: "I built the formatting work inline, test-first, rather
than through the execute skills, since the tasks were small." Six PRs went up that
nobody but their author had read. The operator reviews tonight on the strength of a
review that never ran.

## 1. The frontier

Read the tracker operations from `docs/agents/issue-tracker.md`. When the operator named
tickets, the ready tickets in scope are those alone. A ticket is eligible
when its status is the tracker's ready state and its feature's `requirements.md`,
`design.md` and `tasks.md` all read `Status: Approved`. A **tier-1 fix** is eligible too.
That is a `bug` whose `Requirements covered:` IDs are all defined in a `requirements.md`
or in `docs/specs/fixes.md`, with one of them a `SHALL CONTINUE TO` guard: the mini-spec
`/cmk:shape` writes once its root cause is confirmed. Its feature may read `Implemented`, and it
has no `tasks.md` of its own. Three baseline runs moved an approved fix like this, #28
(BERTH-4.1 and its guard 4.2), back to `shaping` for lacking `tasks.md`, which would send
every fixed bug round the loop forever. Order the eligible ones by `Blocked by:`.

A ready ticket with no spec is sized first: its scope band by
`cmk:delivery-workflow`'s `references/scope-band.md`, then its § Unattended work.
A `trivial` one is eligible. A `patch` one becomes a tier-1 fix: write its mini-spec with
REQUIRED SUB-SKILL: use `cmk:requirements` (tier-1 mode — change requirement plus guard,
appended to the owning spec), and its PR body opens with **Decisions taken**. A `feature` one is not eligible. In the
baseline, a half-day due-date change on an approved feature went to the person as "not
buildable yet" for lacking `tasks.md`.

Every other ready ticket leaves the ready column before any build starts. In one edit,
swap its ready role for `shaping` (`docs/agents/triage-labels.md`). Then comment the pieces
it lacks on it: which of `requirements.md`, `design.md` and `tasks.md` is missing or not
`Approved`. In three baseline runs #24 had no spec, and all three left it
`ready-for-agent`, saying "not eligible" only in the final message. The board kept offering
it to the next run and to every person.
*Done when: every ready ticket is eligible, in order, or moved to `shaping` with what it
lacks.*

WHEN the tickets in scope block one another, or the operator named one ticket whose
cluster must be derived from its relations, read `references/cluster-mode.md` before
ordering: execution-ready pins, the frontier, and diamond and fan-in joins.

## 2. Each eligible ticket, in order

1. **Branch** from `Default PR base:` in `docs/agents/project.md`. A ticket blocked by
   one delivered in this run branches from that ticket's branch instead.
2. A ticket with a `tasks.md`: REQUIRED SUB-SKILL: use `cmk:delivery-build` on it
   (continuous mode); the build claims it.
   A tier-1 fix or a `trivial` ticket has no `tasks.md`, so no build claims it. Claim it
   here, before its first commit, in one edit: swap its ready role for `building`
   (`docs/agents/triage-labels.md`) and comment `Scope band: <band>`, its
   `Requirements covered: <IDs>` and its branch. Record it in `.skills/<CODE>/tickets.md`.
   Two of three klynt runs took #260 from `ready-for-agent` straight to `in-review`: the
   board never showed it building, and its band and IDs lived only in the PR. Then
   REQUIRED SUB-SKILL: use `cmk:tdd`, with one red test for the fix requirement and one
   for its guard.
3. REQUIRED SUB-SKILL: use `cmk:delivery-review` on the ticket's range.
4. REQUIRED SUB-SKILL: use `cmk:delivery-ship` with action `pr`. A stacked ticket's PR is
   based on its blocker's branch.

*Done when: the ticket has a PR whose review and receipt came from those three skills.*

## 3. A question only the operator can answer

A sub-skill would stop to ask the operator, whether in a pre-flight review, a boundary
decision or a review finding that needs a ruling. In this run the stop is a decision
taken and shown:

1. Build the option that leaves every documented contract as it is: a consumer named in
   `docs/`, a test that pins a shape, a persisted format.
2. Head that PR's body with **Needs a decision before merge**, giving the question, the
   option built and the one-line change for the other.
3. Carry on with the ticket and with the rest of the board.

The PR is where the operator decides, so parking the ticket costs them the PR. Two of
the four baseline runs parked refunds on the portal-enum question. One left Tasks 1–2
unpushed in a worktree, and neither started the late-fee ticket that waited on it. The
two that built the contract-keeping option and asked in the PR delivered three PRs each.

A denied command is the same kind of stop. Do not retry it. Take the route that needs
none of it — skip the status stamp, or keep the worktree you already have — and record
the skipped step in that PR. One run had its refund worker's
`git worktree remove … && git branch -d …` denied before any code was written. It
stopped there with "I'm not doing either without your OK", and two tickets with
approved plans ended the afternoon with no PR.

## 4. The message

One message, in this order:

1. A table with one row per ready ticket: PR and base, or not eligible and what it lacks.
2. Every **Needs a decision before merge** item, each with its PR and the option built.
3. Every **Decisions taken** on a patch built without a mini-spec, each with its PR.
4. Rescoped criteria (now carried by which ticket), deferred follow-ups (each a ticket), and
   blockers (recorded where) — or `none`.

*Done when: the message is sent and every ready ticket has a row.*

Refreshing tracker state across a long run, or briefing a subagent? Read
`references/context-efficiency.md`. Using Linear? Read `references/linear.md`.
