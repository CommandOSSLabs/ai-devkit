---
name: cmk:delivery-build
description: Use when an approved tasks.md (or a patch's mini-spec) must be built — the commits, per-task Standards and Spec review verdicts, ledger lines and close receipt, test-first, run as continuous waves of subagents, human-gated story units, or inline without subagents.
version: 1.0.1
---

# Delivery build

The execution engine for one feature or ticket. It reads the plan, builds each task
test-first through an implementer and a reviewer, keeps a ledger in `.skills/<CODE>/`, and
ends on a close receipt. `cmk:delivery-pipeline` calls it once per ticket; a person can
call it directly on an approved plan.

## Pick the mode

A mode the person picked when the plan was approved wins. Otherwise read `Execution-mode:` in
the header of `tasks.md`. Then load exactly one mode file — it writes the header:

| Condition | Mode | Read |
|---|---|---|
| The runtime cannot dispatch subagents | inline | `references/inline.md` |
| `Execution-mode: story-unit` | story units, a human gate per story | `references/story-unit.md` |
| `Execution-mode: continuous`, missing, `unset`, or invalid | continuous waves | `references/continuous.md` |

Every mode loads `references/common.md` first — the controller recipe, runtime binding,
ledger, leases and close receipt the three share. A patch with no `tasks.md` (a tier-1 fix
whose ticket names `Requirements covered:`) runs inline on the ticket's branch:
REQUIRED SUB-SKILL: use `cmk:tdd`, one red test for the change requirement and one for its
guard.

## This kit's dispatch roles

WHEN `.agents/bindings/<vendor>.md` defines the roles `cmk-delivery-implementer` and
`cmk-delivery-reviewer`, dispatch those roles for implementers, fix rounds and task reviews
instead of a general-purpose agent. The prompt templates
(`references/implementer-prompt.md`, `references/task-reviewer-prompt.md`) stay the task
prompt; the role is the system prompt — which skills it preloads, which tools it acquires,
what scope it may touch. Dispatching general-purpose instead drops every preload with no
error.

## Parallel waves join linearly

WHEN a continuous wave runs two or more tasks in lane worktrees, join them by
`references/wave-joins.md`: rebase each task branch onto the ticket tip in its own
worktree, then `git merge --ff-only` from the ticket worktree, one task at a time; workers
never write the ledger or the ticket branch; lock-wait or no-progress output is a
scheduling fault that re-serializes the tasks.
