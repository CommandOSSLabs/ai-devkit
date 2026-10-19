<!-- Ported from jdk `build-in-waves` 2.4.0 (ADR 0001). -->
Ephemera paths: resolve `FEATURE_CODE` / `<CODE>` then follow `references/templates/skills-ephemera-paths.md` (feature root `.skills/<CODE>/`). Pack seeds live in `references/templates/`.

# Build In Waves

Drive an approved **continuous** plan to completion through one dependency-aware
scheduler. A ready set of one task runs serially; a ready set of independent,
surface-disjoint tasks may run in parallel worktrees. Related tasks in one
dependency lane may reuse bounded worker and reviewer leases. Every task keeps
its own commit, report, evidence, and two verdicts; there is **no human pause
between tasks**.

**Context rule:** a fresh context is the default at a semantic-unit boundary or
after a hard lease trigger. Inside a valid lane lease, resume the role context
and pass only the task delta. Bulk artifacts travel as file paths under
`.skills/`, never as pasted text.

**Narration:** at most one short line between tool calls. Ledger + tool results
carry the record.

**Shared controller recipe:** REQUIRED SUB-SKILL: use `references/common.md`.
Load `references/common.md` when Setup preflight / ledger / todos or
After the Last Task starts. That file is the one home for those steps and
for the close-sequence predicates.
This file owns continuous-mode scheduling and barriers. The shared task
lifecycle lives in `references/task-lifecycle.md` and is loaded once.

## Mode ownership

Invoking this skill selects **continuous** execution. Align `tasks.md` to that
route and continue:

| `Execution-mode:` on `tasks.md` | Action |
|---|---|
| `continuous` | Proceed |
| `story-unit` | REQUIRED SUB-SKILL: use `references/story-unit.md` |
| missing / `unset` / invalid | Write `Execution-mode: continuous` into `tasks.md` (commit if tracked). Proceed |

Unit barriers, unit derivation, and human unit stops live only in
`references/story-unit.md`.

| Thought | Reality |
|---|---|
| "Header says story-unit — stay and run waves anyway" | Hand off to `references/story-unit.md` |
| "I'll derive units as a size signal then continuous" | Waves come from Depends-on only |
| "Lead wants human stops — pause inside continuous" | Human-gated stops are `references/story-unit.md` |
| "The tasks are small and fully specified — I'll write them myself" | Size never changes the route. Code written by the controller is `references/inline.md`; here every task gets its own implementer dispatch and its own review. In the baseline, 2 of 4 runs wrote all four tasks in the controller and only then dispatched reviewers — one reviewed all four in a single batch |

## Setup

1. **Mode ownership.** Apply the table above. *Done when: header is `continuous`
   and you stay on this skill, or you have handed off to `references/story-unit.md`.*
2. **Session preflight.** Apply `references/common.md` **Session preflight**.
   *Done when: that section's Done when holds.*
3. **Ledger check.** Apply `references/common.md` **Ledger check**.
   *Done when: next task is known.*
4. **Read the plan.** Read `tasks.md` in full once. Record the Global
   Constraints path and content hash for dispatch; the brief points to the
   canonical section instead of pasting it into every reviewer prompt. If
   `docs/agents/project.md` is missing, say so, suggest `cmk:repo-config`, and
   take verify commands from Global Constraints.
   When `## Team` has roster/band, load band **packaging** only — never skip
   dual-verdict review for Solo. *Done when: constraints captured word-for-word.*
5. **Todos — GATE.** Apply `references/common.md` **Todos — GATE**.
   *Done when: the list mirrors the plan **and** includes the Close branch todo.*
6. **Pre-flight plan review.** Scan once for internal defects (contradictions,
   assertion-free tests, copy-pasted logic the plan mandates). Batch ALL findings
   into ONE question to the user before dispatch. Clean scan → no comment.
   *Done when: conflicts ruled or none.*
7. **Ready-set planning.** Read every task's `Depends-on:` and `Files:` block.
   Named tasks must land first; `Depends-on: none` means no prerequisite; an
   absent line means every earlier task is a prerequisite. Compute the next
   ready set from the dependency graph. A ready set may fan out only when its
   surfaces are disjoint and the runtime has safe worktree isolation. Apply an
   approved `Max-concurrency` cap when present; missing means `auto`.
   *Done when: every task has a dependency position, surface-overlap result,
   and effective lane/concurrency decision.*

## Continuous scheduler

Load `references/task-lifecycle.md` for the one task loop. The scheduler
supplies the task ID, lane, current base revision, brief path, report path,
review package path, and active lease IDs; the lifecycle owns dispatch, status,
review, fix, evidence, and ledger rules.

Before each worker or reviewer resume, run the lease preflight from
`references/common.md`:

1. **Semantic boundary:** rotate at the end of the bounded unit or when the next
   task changes the role's required context materially.
2. **Context safety:** estimate system instructions, tools, retained history,
   capsule, task delta, and output reserve against the active context limit.
3. **Price safety:** apply the dated provider/model `pricing_policy`. If the
   projected request crosses an all-token cliff, or continuing costs materially
   more than a fresh role context, rotate before dispatch.
4. **Hard rotation:** rotate after compaction, broad scope/invariant change,
   harness change, or first context-confusion signal. Record the reason and
   preserve continuity through the capsule and ledger.

### Ready sets, lanes, and barriers

1. Compute the next ready set from `Depends-on:`. A task is ready only after all
   prerequisites are ledgered clean.
2. If the set has one task, run the shared task lifecycle on the feature branch.
3. If the set has multiple tasks, prove each pair's `Files:` surfaces are
   disjoint and check `worktree_isolation`. Overlap or missing isolation reduces
   the effective set to serial; record the degradation in the runtime sidecar.
4. For a parallel set, record `WBASE`. Each lane keeps **one worktree for the
   whole run** so its build cache stays warm — a fresh worktree per task
   rebuilds from cold. First use:
   `git worktree add .worktrees/<branch>-lane<k> -b <branch>-taskN WBASE`;
   later sets: `git -C .worktrees/<branch>-lane<k> switch -c <branch>-taskN WBASE`.
   Invoke the shared lifecycle. A worker/reviewer lease may continue across
   ready sets only along its own dependency lane.
5. After every task in the set has clean Standards and Spec verdicts, merge in
   deterministic task order. A conflict stops the scheduler; it is never solved
   blind. Then run the **wave gate** at the merged HEAD: compile and lint every
   target in the workspace (`project.md` **Wave gate**, else its typecheck and
   lint commands), judged against the lint baseline. Red → no ledger lines;
   REQUIRED SUB-SKILL: use `cmk:debug`, one fix dispatch, gate again. Green →
   one ledger line per task. Remove lane worktrees after the last ready set.
6. Recompute the ready set. There is no permission pause between tasks in
   continuous mode, and no task advances while its review barrier is open.

## Implementer Status Handling

| Status | Your move |
|---|---|
| **DONE** | Package the diff → task review. |
| **DONE_WITH_CONCERNS** | Read concerns **and** `.skills/<CODE>/implementation-notes.md`. Entries must match the nine-field **Deviations** recipe in `implementer-prompt.md`. Missing notes path, incomplete fields, or five-field-only while claiming deviation → incomplete — re-dispatch to log first. **Map impact** `cmk:delivery-reroute` / `cmk:realign` or plan-falsifying → REQUIRED SUB-SKILL: use `cmk:delivery-reroute` (do not accept as clean DONE). |
| **NEEDS_CONTEXT** | Supply what was named; re-dispatch same model. |
| **BLOCKED** | Context → supply; ceiling → stronger model; too large → split; plan wrong → REQUIRED SUB-SKILL: use `cmk:delivery-reroute`. |

Cap redispatches at 2 per task; still not DONE → escalate to the user. Never
force the same model to retry with nothing changed.

The operator's message changes the plan — adds a constraint, cuts scope, drops a
requirement → REQUIRED SUB-SKILL: use `cmk:delivery-reroute` before any spec or code edit.

## Model Tiering

State the model **explicitly on every dispatch** — omitted model inherits the
session's (usually most expensive).

- **Cheap:** transcription / single-file mechanical fixes.
- **Mid floor:** every reviewer; every implementer working from prose.
- **Top:** design judgment, broad codebase understanding, whole-branch review.

Scale reviewer tier to diff size and risk.

## Reviewer-Prompt Hygiene

- A plan-mandated defect is still a finding — ask which governs.
- No open-ended "check everything" without a concrete task-specific reason.
- Do not re-run tests the implementer already evidenced in the report.

## Durable Progress

Todos are the live session view; the ledger survives compaction. After
compaction, trust the ledger and `git log` over conversation memory.

- Crash mid-wave → discard unmerged task branches, switch lane worktrees back
  to WBASE, and re-run the whole wave off WBASE; if `.skills/` (git-ignored) is wiped, reconstruct
  from `git log`.

## After the Last Task

Apply `references/common.md` **Close sequence** in full. Do not
restate or subset those steps here.

*Done when: that section's Done when holds.*

## Inline route

Controller-side sequential execution (no implementer subagents) is owned by
**references/inline.md**. If the user chose inline, or the environment cannot fan out
implementers: REQUIRED SUB-SKILL: use `references/inline.md`. Do not half-run this
skill's subagent loop without dispatches.

## Red Flags — Never

- Run this loop when `Execution-mode` is `story-unit` (hand off to `references/story-unit.md`)
- Stay on this skill when the user chose inline / no subagents (hand off to
  `references/inline.md`)
- Run unit barriers, unit derivation, or human unit stops under continuous
- Pause between tasks to ask permission to continue
- Run two implementers in the **same worktree**, or parallel without isolated
  cmk:worktree and a disjoint-surface check
- Merge a parallel wave before every task in it passed review, or ledger it before the wave gate is green
- Hand a subagent the whole plan file — the brief is its world
- Skip re-review after a fix, or accept a review missing either verdict
- Move to the next task with open Critical/Important findings
- Write a task's code in the controller instead of dispatching its implementer
- Review several tasks in one reviewer dispatch
- Let implementer self-review substitute for task review
- Tell a reviewer what not to flag, or pre-rate severity in the dispatch
- Dispatch a reviewer without a diff package
- Re-dispatch a task the ledger marks complete
