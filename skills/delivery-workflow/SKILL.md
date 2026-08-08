---
name: cmk:delivery-workflow
description: This skill should be used when the user asks to "start tracked work", "reconcile the tracker", "check if this is ready to ship", "keep the issue useful", or "check acceptance criteria" — or needs the tracking contract every other delivery skill operates inside.
version: 0.1.0
---

# Delivery Workflow

## Overview

The tracker is the continuously maintained record of delivery truth and the
context bridge between chat, the tracked issue, the PR, review, and the
docs a future session needs. The code host owns code, commits, checks, and
candidate-change review; this skill never asks either system to replace the
other. Every other delivery skill operates inside this contract — read it
before running any phase of tracked work.

Running under a specific agent runtime? The repo's `.agents/bindings/<vendor>.md`
supplies runtime mechanics only — see `references/vendor-bindings.md` for the
model. A binding never changes phase order, gates, evidence, or acceptance.

Discovering or auditing an uncertain body of work before the issue set is
known? Use `cmk:discover-efforts`.

## Reconcile continuously

Use this loop for every session touching tracked work:

1. **Session start.** Reload the accepted issues, their comments,
   properties, and the complete relevant relation graph; repair stale or
   missing state before relying on it.
2. **During work.** Reconcile after every material discovery or state
   change — update the owning issue immediately, not at ship time.
3. **Boundaries.** Reconcile at every phase boundary and before handoff or
   exit; compare the session's artifacts and conclusions against every
   affected issue and relation — stale tracker state blocks the boundary.

Search for the issue that already owns a fact before filing a new one.
Create a new issue only for a separately finishable outcome; reflect
everything else — new context, decisions, scope or acceptance changes,
dependencies, risks, blockers, evidence, interfaces, handoffs — on the owning
issue as it arises. Prefer abundant, concise tracking over omission; avoid
raw activity noise and duplicate comments.

## Humans decide, the agent reconciles

At an explicit human-decision boundary, the human owns the substantive
decision; this skill owns the tracker bookkeeping that decision implies.
Before executing an accepted decision, verify read/write access and perform
a full refresh, apply the write, then read the updated state back and
confirm the exact issue identities changed. The same write/read-back
boundary applies to a mechanical repair that changes no accepted scope.

Missing tracker access, or a read-back that fails, is a stop condition: it
blocks branch mutation, readiness, handoff, and completion until resolved.
Valuable delivery knowledge must not remain only in chat, scratch
artifacts, agent memory, or a PR comment — update the owning issue when the
fact changes delivery truth.

## Readiness vocabulary

Use these definitions consistently on every affected issue and relation:

- **Execution-ready** — the pinned handoff commit has implementation,
  automated tests and coverage, the applicable review depth, and finding
  disposition recorded. It does not require final cumulative review, human
  PR review, or merge, so eligible downstream automation may proceed.
- **Ship-ready** — the completed issue/branch has its final cumulative
  review at its recorded depth, plus PR evidence and passing merge gates.

## Start tracked work

Before retained work intended for review, merge, deployment, or delivery
credit:

1. Find or create the tracker issue for the accepted outcome.
2. Confirm its outcome, context, constraints, acceptance, ownership,
   estimate, dependencies, and timing are sufficient to work safely —
   improve missing context rather than forcing a fixed template.
3. Move the issue to its in-progress state when active work begins.
4. Use the tracker's suggested branch name, if it generates one; otherwise
   the repo's documented branch convention (always carrying the issue ID).

Read-only investigation and disposable experiments are exempt; track a
retained experiment before review or merge. For urgent work, open a
lightweight issue and enrich it as facts emerge; if the tracker is
unavailable during an incident, mitigate first and create the issue once it
returns, before merge.

## Keep the issue useful

"Enough context to act safely" is a clarity floor, not a size target or a
detail ceiling. Keep a parent issue only when its children jointly deliver
one meaningful outcome; promote a disjoint outcome to its own top-level
issue. Use the tracker's native relation types — parent/child, blocking,
related, duplicate — or a documented convention where the tracker lacks
one; don't create mixed-level edges merely to restate hierarchy that
already exists. Verify targets, timing feasibility, reciprocity, and the
absence of cycles before a material replan.

Comments are self-contained and explicitly cross-linked: assume the reader
has no memory of the conversation that produced them, and link the PR,
review thread, or sibling issue rather than assuming someone has already
seen it.

Judging whether acceptance criteria are met, rescoped, or blocked? Read
`references/acceptance-criteria.md`.

Opening or merging a PR? Read `references/pr-traceability.md`.

Using Linear as your tracker? Read `references/linear.md`.

## Common mistakes

| Mistake | Correction |
|---|---|
| Filling empty sections | Include only useful context |
| Copying every update | Synchronize delivery changes and link |
| Waiting until ship time to update the tracker | Reconcile on discovery and at every boundary |
| Tracking only blockers and deferrals | Record every material change on its owning issue |
| Splitting PR review across the issue and the PR | Keep it on one surface — the PR or its synced review thread |
| Copying a deferred finding into several places | Link the review thread and the new follow-up issue |
| Treating merge as delivery | Verify acceptance before the done state |
| Leaving the AC checklist untouched all run | Tick each criterion as its proof lands, evidence reachable |
| Checking a criterion because it feels done | Check it only against reachable proof; intent is not evidence |
| Shrinking the AC to match what got built | Rescope explicitly, move removed criteria to a tracked successor, say why |
| Delivering a narrow slice under a broad AC | Rewrite the AC to the honest outcome and track the remainder |
| Trusting only auto-linking | Keep the issue ID in the branch and the PR body |
| Treating the template as a form | Use any clear structure that serves the same review goals |
| Claiming tests passed without proof | Include reproducible automation and its passing result |
