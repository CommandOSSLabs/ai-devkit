---
name: cmk:delivery-ship
description: This skill should be used when the user asks to "ship this", "open the PR", "push this to review", "update the tracker and open a PR", or "close out this ticket" — when implementation and review are done, and as phase 5 of the cmk:delivery-pipeline skill.
version: 0.2.0
---

# Delivery Ship

Convert reviewed work into a delivery the team can see: a PR that
facilitates review, a tracker issue that reflects reality, and zero
knowledge left only in this session. Operates inside `cmk:delivery-workflow`;
read it first if not already loaded this session.

`superpowers:finishing-a-development-branch` is deliberately NOT used here:
this phase opens a PR against the canonical branch, and the tracking
contract above owns that integration path end to end — that other skill's
integration menu, base-branch confirmation, discard path, and worktree
cleanup are all inadmissible substitutes for it.

A runtime capability that automates part of this phase (PR creation, branch
retarget) returns control at its own boundary — it does not advance the
phase, and it does not delete a worktree or scratch workspace this phase
still needs. See `cmk:delivery-workflow`'s vendor-bindings reference for
the model.

## 1. Verify before claiming

Evidence before assertions. Use `superpowers:verification-before-completion`
when present, or its manual equivalent: run every applicable gate fresh —
not from memory of an earlier green — and capture the commands plus passing
output. Walk the acceptance criteria one final time against actual
behavior, checking each off in the tracker against the evidence that proves
it. This is a reconciliation, not a discovery: a criterion that turns out
unmet here should already have been rescoped or blocked when it was found.

Confirm the final cumulative review ran to completion for this issue or
branch at its selected depth, and that its verdict discloses that depth —
this phase gates on the review having run and its depth being disclosed
(`cmk:delivery-review`'s Review depth section). Its default is full depth; a
reduced depth satisfies this gate only when an operator explicitly chose
it, and the completion report then states plainly that the run shipped
below its standard gate. A review that did not run, or ran without its
depth recorded, is a missing gate. If anything fails or is missing here,
this phase has not started.

Immediately before PR mutation, readiness claims, tracker status changes,
or completion reporting, refresh every mutable authority those actions
depend on: tracker issues and relations, code-host PR/reviews/checks/refs,
and remote ancestry. Follow `cmk:delivery-pipeline`'s
`references/context-efficiency.md`; cached summaries cannot authorize a
consequential transition.

## 2. Commit and branch hygiene

Keep a straight-line history: rebase on the base branch, replaying only this branch's own
commits, new commits over amend, no AI attribution. The branch carries the
issue ID. No `wip:`-prefixed commit may remain in the PR range — verify
with `git log --oneline <base>..HEAD`, never assume; wave snapshots (see
`cmk:delivery-pipeline`'s `references/worktree-wave-execution.md`) are
absorbed before a PR exists. Every merge-eligible PR targets the canonical integration branch;
a stacked issue's PR may open early against its parent's branch as a draft,
but the final destination is always canonical — never a feature branch.
Automated stacked-PR reconciliation (retarget on parent merge, exact-ancestry
verification, conflict repair) is optional repo automation degrading to a
manual retarget-and-rebase when absent; either way, follow
`cmk:delivery-pipeline`'s `references/stacked-pr-flow.md` rather than
improvising a retarget, rebase, or force-push on a stacked PR.

Add production-readiness evidence to the PR when the change ran that
checklist: what was covered, and any accepted gaps with their reasons.

## 3. The pull request

Open the PR against the canonical branch; for what the description must
cover and the same-issue-ID rule, see `cmk:delivery-workflow`'s
`references/pr-traceability.md` — don't restate it here. Its evidence
section is where step 1's verification output lands.

Repository-local references use repo-root-relative paths in inline code —
never branch-specific blob/tree URLs.

## 4. Reconcile the tracker

- Move the issue to its review state.
- Verify every material fact, decision, scope/acceptance change, relation,
  planning change, risk, blocker, evidence result, interface effect, and
  downstream handoff was recorded when it arose; repair anything stale now —
  ship is the final reconciliation checkpoint, not the first update.
- Comment a concise, self-contained delivery summary when it adds
  information beyond the automatic PR link: outcome, notable decisions,
  scope deviations, delivery consequences.
- File (or extend) a tracker issue for every deferred review finding still
  lacking one, each with an effort estimate and a link back to the review
  thread; adjust related issues whose scope this delivery changed.
- Notify named downstream stakeholders per the tracker's visibility
  convention.
- From here, all PR review lives on one surface — the code host's PR or the
  tracker's synced review thread, if it has one — and the ordinary issue
  only gets delivery-state changes.

Using Linear as your tracker? Read `references/linear.md`.

## 5. Retire the run's scratch workspaces

This phase is the only one that may delete a phase-3 execution workspace —
the ledger, task briefs, task reports, and review packages at the path the
run notes record. Delete it only after the evidence it carries is
reflected on durable surfaces: the PR's test evidence, the tracker record,
and any doc updates that shipped with the change. It is git-ignored scratch,
so leaving it costs nothing and deleting it early costs a reviewer their
trail. Never touch another issue's or another run's workspace.

The issue's worktree and branch are not scratch and are not retired here.
They stay in place for review feedback and for any later agent in the relay.

## 6. Done means delivered

Merge alone is not completion. The issue moves to its done state only when
acceptance is verified against the accepted outcome: every criterion
checked with reachable evidence, or visibly moved to a named successor
issue. A criterion that is neither leaves the issue unfinished no matter
what merged. If this run ends at the review state (normal for autonomous
runs), say so in the completion report rather than overclaiming.

Finish with the `cmk:delivery-pipeline` completion report (or its
single-issue slice): delivered, decisions, deferrals, blockers — each line
already recorded on its durable surface.
