---
name: cmk:delivery-pipeline
description: Use when the user asks to "work on", "deliver", "tackle", "pick up", or "implement" a tracker issue (TICKET-123), a list of issues, or a body of tracked work expected to finish without supervision — even if they never say "pipeline". Also use when handed a cluster of related issues, or a single issue whose surrounding cluster should be derived from tracker dependencies. Produces reviewable PR(s), an up-to-date tracker graph, and a completion report — only after docs-ready for the stated scope band.
version: 0.5.3
---

# Delivery Pipeline

Deliver tracker-tracked work end to end with no human in the loop. When the
user returns, the outcome is a reviewable PR (or PRs), an up-to-date tracker
graph, and a written track record of every material fact, decision, state
change, handoff, and follow-up — not a list of questions.

CMK owns the lifecycle. Superpowers executes inside it. The division:

| CMK owns | superpowers owns |
|---|---|
| The tracker as the delivery ledger | how a task is implemented and debugged |
| Phase order and gates | the per-task implement → review → fix loop |
| Repo quality bar, production readiness | spec pressure-testing and plan authoring |
| Review lenses, evidence bar, disposition, depth disclosure | completion verification |
| Autonomy — no human gates | parallel-dispatch hygiene |
| Cluster dependency graph, readiness frontier, task independence | |

Before acting, read:

1. `cmk:delivery-workflow`'s `references/scope-band.md` — tracking contract,
   **scope band**, **docs-ready**, and the implement docs gate.
2. `references/engineering-principles.md` — autonomy, production readiness,
   and the delegation contract.
3. Your runtime's binding for mechanics only (`cmk:delivery-workflow`'s
   `references/vendor-bindings.md`). Bindings supply mechanics; they never
   change phase order, gates, evidence, or acceptance.

## Working with superpowers

Superpowers skills assume a human-supervised session. Adapt them everywhere:

1. **Human gates are suppressed.** Consent, approval, "which approach?", or
   typed confirmation do not apply — decide and record on the durable
   surface the phase already requires (spec, review record, PR, or tracker
   issue). A question that cannot be decided safely is a recorded blocker
   (`references/engineering-principles.md` § Autonomy). Four calls keep a
   named CMK owner: plan conflict → `cmk:delivery-review`; colliding review
   feedback → that skill; branch integration → phase 5 opens a PR against a
   canonical branch; starting on default → intake already placed the run.
2. **A skill returns at its boundary** — it does not advance the phase or
   delete a workspace. `superpowers:writing-plans` ends when the plan is
   written; `superpowers:subagent-driven-development` ends at the last
   task's ledger line without deleting its workspace (phases 4–5 read it)
   or chaining into `superpowers:finishing-a-development-branch`;
   `superpowers:using-git-worktrees` reports the existing worktree.

Intake creates the issue worktree/branch; nobody removes it. A skill may
create scratch workspace; phase 5 retires it once evidence is durable.
Specs/plans stay git-ignored; durable conclusions reach `docs/design/`,
`docs/decisions/`, the tracker, and the PR.

## Phase 0: run notes

Once per run, write to git-ignored scratch (e.g.
`docs/plans/<issue>-run-notes.md`): the active runtime, the worktree path
per issue, the path of phase 3's execution workspace, any review depth the
operator explicitly chose, and the phase-3b simplify outcome once known.
Every later phase and handoff receiver reads this instead of rediscovering
it — keep it to those fields only.

## The phases

| Phase | Skill / engine | CMK adds |
|---|---|---|
| 1. Intake | `cmk:delivery-intake` | all of it — the tracker has no superpowers equivalent |
| 2. Spec & plan | `cmk:delivery-spec-plan`, via `superpowers:brainstorming` + `superpowers:writing-plans` | design-doc inputs; `Depends on:`, `File scope:`, `Exclusive resources:`, and binding obligations inside each task body |
| 3. Implement | `superpowers:subagent-driven-development` (below) | wave dispatch and its safety fixes |
| 3b. Simplify | `cmk:delivery-simplify` | whole-branch quality cleanup after implement (Claude `/simplify` contract) |
| 4. Review | `cmk:delivery-review` | lenses, evidence bar, adversarial verification, disposition, depth disclosure |
| 5. Ship | `cmk:delivery-ship` | PR, tracker reconciliation, evidence |
| (any boundary) | `cmk:delivery-handoff` | relay prompt for another agent |

Each phase skill is independently invokable when the user asks for just
that slice, through the runtime's own skill mechanism or by reading the
file directly. Phases are checkpoints, not ceremonies: a one-line config
fix does not need a design spec, but it still needs intake, task proof,
review, and ship. Scale phase depth to the change; never skip one outright.

**Before phase 3:** docs-ready for the stated scope band must hold — one home
is `cmk:delivery-workflow`'s scope-band reference (intake states the band). If
unmet, REQUIRED SUB-SKILL: use `cmk:requirements` during or right after intake /
phase 2; do not enter phase 3 while docs-ready is false.

Executing phase 3? Read `references/phase-3-execution.md`. Phase 3b?
Read `references/phase-3b-simplify.md`.

## Single-issue mode

One issue (or one issue plus sub-issues jointly delivering one outcome):
run phases 1–5 in order inside one worktree (including 3b after 3).

## Cluster mode

Delivering a named list of related issues, or a single seed issue whose
surrounding cluster should be derived from tracker dependencies? Read
`references/cluster-mode.md` before scheduling anything — it covers
dependency closure, readiness gates, frontier scheduling, and
worktree-per-issue.

## Cross-agent handoff

The operator may run phases on different AI agents to exploit each one's
strengths. When asked to hand off — or told up front that a later phase
belongs to another agent — stop at the phase boundary and follow
`cmk:delivery-handoff`. Continuity is non-negotiable: every agent in the
relay works in the same worktree and branch per issue, navigating into the
worktrees intake created rather than creating, re-basing, or wiping any.
That is why every phase writes its state to artifacts — the next agent
reconstructs the work from files, never from a chat it wasn't part of.

## Completion report

End every run with a report the user can act on in one read:

```
## Delivered
- TICKET-123 <title> — PR #N (base: <branch>), status: review state
  - outcome summary, entry points, test evidence one-liner
  - acceptance: <n of m criteria checked with evidence; the rest by disposition>
## Decisions made autonomously
- <decision> — rationale recorded at <surface>
## Rescoped (if any)
- TICKET-123 — criteria removed and why, now carried by TICKET-124 with its own AC
## Deferred / follow-ups
- TICKET-125 <new issue> — why deferred, priority, estimate, links
## Blocked (if any)
- TICKET-126 — blocker, recorded where, suggested unblock
```

A run that narrowed an issue says so in its own section rather than
folding it into deferrals. When review ran below full depth, or phase 3b
was skipped or single-pass, plain words say so — no reader recovers that
unless it is written down. Every line must already exist on its durable
surface; the report summarizes the track record, never its only copy.

Delegating or refreshing state anywhere in this pipeline? Read
`references/engineering-principles.md` and `references/context-efficiency.md`.
Using Linear as your tracker? Read `references/linear.md`.
