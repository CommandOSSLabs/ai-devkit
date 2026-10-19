<!-- Ported from jdk `build-inline` 1.4.2 (ADR 0001). -->
Ephemera paths: resolve `FEATURE_CODE` / `<CODE>` then follow `references/templates/skills-ephemera-paths.md` (feature root `.skills/<CODE>/`). Pack seeds live in `references/templates/`.


# Build Inline

Drive an approved plan to completion **yourself**, task by task, with no
implementer (or reviewer) subagent dispatches. Every step is `cmk:tdd`. Progress
survives in the ledger. Finish with whole-branch review.

**This is not subagent orchestration.** Continuous multi-task subagent waves are
`references/continuous.md`. Human-gated review units with subagents are `references/story-unit.md`.

| Intent | Use instead |
|---|---|
| Subagent waves, continuous | REQUIRED SUB-SKILL: use `references/continuous.md` |
| Story-unit barriers + subagents | REQUIRED SUB-SKILL: use `references/story-unit.md` |

**When this skill fires:** the user chose the inline route, the environment
cannot (or must not) fan out implementers, or cmk:delivery-spec-plan offered inline
execution and they accepted it. **Tool availability does not override the
route** — if they asked for inline, stay inline even when subagent tools exist.

**Narration:** at most one short line between tool calls. Ledger + tool results
carry the record.

**Shared controller recipe:** REQUIRED SUB-SKILL: use `references/common.md`.
Load `references/common.md` when Setup preflight / ledger / todos or
After the last task starts. That file is the one home for those steps and
for the close-sequence predicates.
This file owns the inline iron law and the controller-as-implementer loop.

## The Iron Law

```
NO IMPLEMENTER SUBAGENT — YOU ARE THE IMPLEMENTER
NO PRODUCTION CODE WITHOUT TDD
NO GUESSING THROUGH A BLOCKER
```

Dispatching an implementer "because tools exist" or "subagents are faster"
violates this skill. Skipping RED because the change is "one line" violates
this skill. Inventing an API, path, or acceptance detail when the plan is
ambiguous violates this skill — stop and ask.

## Scope vs Execution-mode

Invoking this skill selects the **inline** route. The `Execution-mode` header is
bookkeeping for sibling skills and later handoffs:

| Header | This skill does |
|---|---|
| `continuous` or `story-unit` | Sequential tasks; **no** unit barriers; **no** human unit stops |
| missing / `unset` / invalid | Write `Execution-mode: continuous` into `tasks.md` (commit if tracked). Barriers still do not run here |

Human-gated review units with subagents are `references/story-unit.md`. Inline already
keeps the human in the conversation turn-by-turn.

| Thought | Reality |
|---|---|
| "Subagents exist — use the full loop" | Route is inline. Tools do not rewrite the route |
| "One-line change — skip the failing test" | REQUIRED SUB-SKILL: use `cmk:tdd` for every task step |
| "Plan is fuzzy — I'll pick a reasonable shape" | Plan gap → stop and ask; never guess |
| "story-unit header — stop after each story" | Barriers are `references/story-unit.md`. Inline is sequential only |
| "I'll dispatch only the reviewer, not the implementer" | No task-reviewer subagents either; whole-branch `cmk:delivery-review` at the end |
| "Parallel waves will finish faster" | Inline is serial. No worktree fan-out |

## Setup

1. **Route gate.** Confirm inline is the intended path (user said so, or no
   subagent capability). If they want subagent continuous waves →
   `references/continuous.md`. If they want story-unit barriers → `references/story-unit.md`. *Done
   when: route is inline.*
2. **Header bookkeeping.** Parse `Execution-mode:`. If missing/`unset`/invalid:
   write `Execution-mode: continuous` into `tasks.md`. If already set, leave it.
   *Done when: header is present.*
3. **Session preflight.** Apply `references/common.md` **Session preflight**.
   *Done when: that section's Done when holds.*
4. **Runtime binding.** Apply `references/common.md` **Runtime binding
   and lease preflight**. Inline execution has no worker lease, but it records
   the active harness/provider/model, pricing policy, context reserve, and
   effective concurrency in `.skills/<CODE>/execution-session.json`.
   *Done when: the runtime snapshot exists before the first production edit.*
5. **Ledger check.** Apply `references/common.md` **Ledger check**.
   *Done when: next task is known.*
6. **Read the plan.** Read `tasks.md` once. Record the canonical **Global
   Constraints** source path and content hash (verify commands live here if
   `docs/agents/project.md` is missing — say so and suggest `cmk:repo-config`).
   *Done when: the source reference and task delta are in hand.*
7. **Todos — GATE.** Apply `references/common.md` **Todos — GATE**.
   *Done when: the list mirrors the plan **and** includes the Close branch todo.*
8. **Pre-flight plan review.** One batch question for plan-internal defects
   before coding. Clean scan → no comment. *Done when: conflicts ruled or none.*
9. **Order.** Depends-on topo order; absent Depends-on → every earlier task;
   `none` → no prereq. **Serial only** — never parallel waves / multi-worktree
   fan-out in this skill. *Done when: task sequence is fixed.*

## Per-task loop

For each Task N in order:

1. **Record base.** `BASE=$(git rev-parse HEAD)`.
2. **Build the task capsule (for yourself).** Record Task N, the canonical
   Global Constraints source path/hash, and the task delta in
   `.skills/<CODE>/task-N-brief.md`. That file is the contract you implement against —
   exact values, paths, signatures, `_Requirements:` IDs. Include relevant
   `**ARCH-N**` when a `docs/design/` spine exists. WHEN preflight
   recorded ticket IDs, list them in the brief. *Done when: brief exists and
   you have read it.*
3. **Clarify first.** If anything in the brief is ambiguous — API shape, path,
   acceptance, dependency — **stop and ask now**. Do not start RED until clear.
4. **Implement with TDD.** REQUIRED SUB-SKILL: use `cmk:tdd` for every step in the
   task. Tests describe domain behavior; map requirement IDs in the report/self-check,
   not by embedding IDs in source. Work only the files the plan names.
5. **Deviations.** WHEN territory forces you off the brief: you **are** the
   implementer — follow the **Deviations** recipe in
   `references/implementer-prompt.md` (nine-field entry under
   `.skills/<CODE>/implementation-notes.md`: **Unknown class**, **Map said**,
   **Territory showed**, **Map impact**, etc.). Log **before** finishing the
   task; append only. IF **Map impact** is `cmk:delivery-reroute` / `cmk:realign` or
   the fix falsifies the plan / shared contract → stop and REQUIRED SUB-SKILL:
   use `cmk:delivery-reroute` (or ask); do not stretch silently.
6. **Commit.** Conventional subject explaining the change — no `Implements:` /
   `Guards:` trailer required.
7. **Render check.** You **are** the implementer — WHEN the diff touches
   anything a browser renders, apply the **Render check** step in
   `references/implementer-prompt.md` (screenshot to
   `.skills/<CODE>/task-N-render.png`, judge against the brief, fix, re-shoot);
   the Visual check line lands in the step-9 evidence bundle.
8. **Self-check (controller, not a subagent).** Re-read the brief against the
   diff: every requirement ID's behavior covered? TDD evidence (RED then GREEN) real?
   Output pristine? Plan File Structure respected? Fix gaps now — you have no
   separate task-reviewer pass.
9. **Optional evidence bundle.** For non-trivial tasks, write
   `.skills/<CODE>/task-N-report.md` with what changed, IDs covered, RED/GREEN
   commands+output, the Visual check line when the render check ran, concerns,
   deviations path or `none`. Cheap tasks may skip
   the file if the commit message and ledger carry enough; when in doubt, write it.
10. **Ledger.** Append
    `Task N: complete (commits <base7>..<head7>, inline, review self)`.
    Mark the todo done.
11. **Next.** Immediately continue to the next task — no permission pause, no
    unit barrier. On blocker mid-task: stop the loop and ask (see **Stop
    conditions**).

## Stop conditions

Stop and ask the user (do not guess, do not dispatch a subagent to invent an
answer) when:

- The brief or plan is ambiguous or contradictory
- Verification fails and the fix is not obvious from the brief
- A deviation would falsify plan/design/requirements
- You would need to touch files or contracts outside the task
- main/master consent is missing and the workspace is main/master

After the user answers, resume the same task from the brief — do not skip ledger
discipline.

## Durable progress

- Start: read `.skills/<CODE>/progress.md`; trust it and `git log` over memory.
- Never re-do a task the ledger marks complete.
- After compaction, resume at the first task without a complete line.
- `.skills/` is git-ignored; if wiped, reconstruct from `git log`.

## After the last task

Apply `references/common.md` **Close sequence** in full. You are the fixer
under `cmk:tdd` (still no implementer subagent unless the user explicitly
lifts the inline route). Point `cmk:delivery-review` at any Minors or notes in
the ledger / `implementation-notes.md`.

*Done when: that section's Done when holds.*

## Red Flags — Never

- Skip the tracker-sync, occupancy, or workspace preflight
- Invent a tracker or ticket set when config is absent or the user declined sync
- Dispatch an implementer or task-reviewer subagent while on this skill
- Skip `cmk:tdd` / write production code before a failing test
- Guess through ambiguity, a red suite, or a plan gap
- Run unit barriers or human unit stops (that is `references/story-unit.md`)
- Parallel-wave / multi-worktree fan-out
- Re-do ledger-complete tasks after compaction
- Start on main/master without explicit consent
- Create a worktree without asking
- Claim a task complete without a ledger line
- Skip the close sequence, silent-skip polish, or treat EOD/demo as a polish predicate
- Start Task 1 before the todo list exists (tasks **and** Close branch)
- Hand off mid-plan to `references/continuous.md` subagent loop without an explicit user
  route change
