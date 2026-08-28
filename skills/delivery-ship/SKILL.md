---
name: cmk:delivery-ship
description: Use when the user asks to "ship this", "open the PR", "push this to review", "update the tracker and open a PR", "close out this ticket", or "verify before claiming done" — when implementation and review are done, and as phase 5 of the cmk:delivery-pipeline skill. Produces a PR, tracker reconciliation, and fresh verification evidence for every completion claim.
version: 0.3.3
---

# Delivery Ship

Convert reviewed work into a delivery the team can see: a PR that
facilitates review, a tracker issue that reflects reality, and zero
knowledge left only in this session. Operates inside `cmk:delivery-workflow`;
read it first if not already loaded this session.

`superpowers:finishing-a-development-branch` is not used here: this phase
opens a PR against the canonical branch, and the tracking contract owns
that path — that skill's integration menu, base confirmation, discard, and
worktree cleanup are inadmissible substitutes.

A runtime helper (PR create, retarget) returns at its boundary — it does
not advance the phase or delete a workspace this phase still needs. See
`cmk:delivery-workflow`'s vendor-bindings reference.

## 1. Verify before claiming

```
NO COMPLETION CLAIM WITHOUT FRESH VERIFICATION EVIDENCE
```

**Fresh** = after the last edit. **Full** = the proving command the pipeline/CI
actually runs — not a subset chosen for speed.

Evidence before assertions. Use `superpowers:verification-before-completion`
when present, or its manual equivalent: run every applicable gate fresh, and
capture the commands plus passing output. Walk the acceptance criteria one
final time against actual behavior, checking each off in the tracker against
the evidence that proves it; when criteria carry requirement IDs
(`PREFIX-N.M`), cite those IDs in the check-off. This is a reconciliation, not
a discovery: a criterion that turns out unmet here should already have been
rescoped or blocked when it was found.

Run each gate exactly as the pipeline runs it, not an approximation of it: one CI step routinely chains sub-gates — a formatter, a build — that a local typecheck-and-test shortcut never executes, so read the job's own command and copy it verbatim rather than reconstructing what you assume it does. Most required jobs are host-runnable (`cmk:cicd`); when a remote job failed, reproduce it locally and stay there until the bouncing set is green. Fixing one failure and pushing to watch CI is not verification. Before owning a failure this change appears to have caused, reproduce it against a clean checkout of the base; a failure that already existed there and a stale dependency install after a lockfile change both impersonate a regression until they are attributed. When comparing the two runs, diff the failing test *names* rather than the counts — a suite with timeout-prone cases varies run to run, so equal counts prove nothing and unequal counts mean nothing on their own.

### Rationalizations (verify)

| Thought | Reality |
|---|---|
| "Suite was green 40 minutes ago" | Edits since then void that run. Fresh means after the last edit. |
| "I'll run only the file I touched" | Regressions live in the files you did not pick. Run the full proving command. |
| "Demo/deadline — claim done now" | A deadline changes *when* you report, never what counts as evidence. |
| "Eng lead said skip verification" | Authority cannot waive fresh evidence. Record the pressure; still run the proving command. |
| "Don't burn time on Linear AC checkboxes" | Done requires every criterion checked with reachable evidence (or moved to a successor). |

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

## Red Flags

- Opening a PR or moving to Done without fresh full proving-command output
- Honoring "skip verification" / "tests were green earlier" under deadline
- Skipping tracker AC check-off because it feels like chore work
