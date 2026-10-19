<!-- Ported from jdk `build-by-story` 2.0.3 (ADR 0001). -->
Ephemera paths: resolve `FEATURE_CODE` / `<CODE>` then follow `references/templates/skills-ephemera-paths.md` (feature root `.skills/<CODE>/`). Pack seeds live in `references/templates/`.


# Build By Story

Drive an approved **story-unit** plan to completion: derive review units from
requirement stories, run the shared continuous scheduler inside each unit,
stop for a human after each unit, resume from the unit ledger, and finish with
whole-branch review.

Continuous multi-task orchestration without unit barriers is `references/continuous.md`.
Controller-implements-without-subagents is `references/inline.md`. Invoking this skill
selects **story-unit** execution; continuous-header handoff is in Mode
ownership below. If the user wants no subagents, name `references/inline.md`.

**Shared controller recipe:** REQUIRED SUB-SKILL: use `references/common.md` — the
one home for preflight/ledger/todos/close, applied where each Setup step below
says. This file owns story-unit barriers and unit derivation; load
`references/task-lifecycle.md` for task dispatch/review and use the
continuous scheduler rules from `references/continuous.md` inside each unit.

**Narration:** at most one short line between tool calls. Ledger + tool results
carry the record.

## The Iron Law

```
NO NEXT UNIT WITHOUT HUMAN UNLOCK (OR A WRITTEN MODE CHANGE)
```

Agent-clean is not human unlock. EOD, demo pressure, and "whole PR later" do
not drop the barrier. "Stop stopping" is a **mode change**: write
`Execution-mode: continuous` into `tasks.md` before dropping barriers.

## Iron laws (story-unit)

1. **Review units are derived**, never authored in `tasks.md` (ignore PM
   "Human review order" comments for partition).
2. After each unit's tasks are clean: **unit agent review → STOP for human →
   unlock**.
3. **"continue"** after looking = next unit only. **"stop stopping" /
   "just run it all"** = write `Execution-mode: continuous` into `tasks.md`
   first, then hand remaining work to `references/continuous.md`. Chat-only is not a mode
   change.
4. Ledger `Unit <k>: complete (tasks …, range <base>..<head>)` — resume reads it.
5. **Whole-branch agent review still runs** after the last unit. Human unit
   reviews are not a substitute.

| Thought | Reality |
|---|---|
| "User said keep going — no need to edit tasks.md" | "Stop stopping" is a **mode change**; write the header or the plan lies |
| "Unit agent review was clean — skip human barrier" | Agent unit review is not the human stop |
| "EOD / whole PR later — drop unit stops" | Time and later review do not rewrite Execution-mode |
| "continue means run everything left" | "continue" unlocks **one** next unit; run-it-all needs mode-change language |
| "PM review waves are clearer than stories" | Partition is derived from requirement story IDs, not authored lists |

## Mode ownership

Align `tasks.md` to the story-unit route and continue:

| `Execution-mode:` on `tasks.md` | Action |
|---|---|
| `story-unit` | Proceed |
| `continuous` | REQUIRED SUB-SKILL: use `references/continuous.md` |
| missing / `unset` / invalid | Write `Execution-mode: story-unit` into `tasks.md` (commit if tracked). Proceed |

## Setup

1. **Mode ownership.** Apply the table above. *Done when: header is `story-unit`
   and you stay on this skill, or you have handed off to `references/continuous.md`.*
2. **Session preflight.** Apply `references/common.md` **Session preflight**.
   *Done when: that section's Done when holds.*
3. **Ledger check.** Apply `references/common.md` **Ledger check** (its
   story-unit clause covers skipping units already ledgered complete).
   *Done when: next task/unit is known.*
4. **Read the plan.** Read `tasks.md` once. Record the canonical Global
   Constraints path and content hash; dispatches reference and take verify
   commands from it instead of pasting it into every reviewer prompt. If
   `docs/agents/project.md` is missing, say so and suggest `cmk:repo-config`.
   When `## Team` has roster/band, load band **packaging** only — never skip
   dual-verdict review for Solo. *Done when: constraints captured word-for-word.*
5. **Derive units — GATE.** Load `references/story-unit-mode.md`. Run
   **Derive partition** + **File count** + print the **Unit table**. Hard-fail
   blocks dispatch. *Done when: table printed; hard-fails resolved or reported.*
6. **Todos — GATE.** Apply `references/common.md` **Todos — GATE**.
   *Done when: the list mirrors the plan **and** includes the Close branch todo.*
7. **Pre-flight plan review.** One batch question for plan-internal defects
   before dispatch. Clean scan → no comment. *Done when: conflicts ruled or none.*
8. **Unit order.** Fixed already by step 5's Derive partition. Inside each
   unit, use the shared ready-set scheduler: serial when only one task is
   ready or surfaces overlap; parallel only for disjoint surfaces with safe
   worktree isolation. *Done when: concurrency is fixed per unit.*

## Per-unit loop

For each unit U in order:

### A. Tasks in the unit

Run `references/task-lifecycle.md` for every ready task in U. The
scheduler supplies the lane, worker/reviewer lease IDs, base revision, brief,
report, and diff-package paths. A clean task review is ledgered before the
unit barrier; that file's single-task close-out and no-duplicate-reviewer rule
governs whether B below still needs to dispatch.

### B. Unit barrier (after every task in U is ledgered)

Load `references/story-unit-mode.md` **Per-unit barrier** and run it in full. The human-facing
STOP message MUST fill every REQUIRED slot in that recipe — no freeform
abbreviation under time pressure. A multi-task unit's one unit-scope dispatch
(from A) is its synthesis; a single-task unit already closed in A and is not
re-reviewed here.

**Unlock:**

| User says | Action |
|---|---|
| continue / LGTM / looks good (after looking) | Ledger `Unit <k>: complete (tasks …, range <base>..<head>)`. Next unit only. Mode stays `story-unit`. |
| stop stopping / just run it all | Write `Execution-mode: continuous` into `tasks.md` (commit if tracked). Ledger this unit complete. REQUIRED SUB-SKILL: use `references/continuous.md` for remaining tasks (no further unit barriers). |
| stop / hold / changes needed | Stay stopped; do not start the next unit. |

### C. Next unit

Resume the per-unit loop. After the last unit's unlock and ledger line →
**After the last unit**.

## Implementer status handling

| Status | Your move |
|---|---|
| **DONE** | Package diff → task review. |
| **DONE_WITH_CONCERNS** | Read concerns **and** `.skills/<CODE>/implementation-notes.md`. Entries must match the nine-field **Deviations** recipe in `references/implementer-prompt.md`. Missing notes path, incomplete fields, or five-field-only while claiming deviation → incomplete — re-dispatch to log first. **Map impact** `cmk:delivery-reroute` / `cmk:realign` or plan-falsifying → REQUIRED SUB-SKILL: use `cmk:delivery-reroute` (do not accept as clean DONE). |
| **NEEDS_CONTEXT** | Supply what was named; re-dispatch same model. |
| **BLOCKED** | Context → supply; ceiling → stronger model; too large → split; plan wrong → REQUIRED SUB-SKILL: use `cmk:delivery-reroute`. |

Cap redispatches at 2 per task; still not DONE → escalate to the user.

## Model tiering

State the model **explicitly on every dispatch**.

- **Cheap:** transcription / single-file mechanical fixes.
- **Mid floor:** every reviewer; every implementer working from prose.
- **Top:** design judgment, broad codebase understanding, whole-branch review.

## Reviewer-prompt hygiene

- Never pre-judge findings in the dispatch ("do not flag X", "Minor at most").
- A plan-mandated defect is still a finding — ask the user which governs.
- No open-ended "check everything" directives without a concrete reason.
- Do not re-run tests the implementer already evidenced in the report.

## Durable progress

- Never re-dispatch a task or re-open a unit the ledger marks complete.
- After compaction, resume at the first task without a complete line; unit
  complete lines mean the human barrier already closed for that unit.
- `.skills/` is git-ignored scratch; if wiped, reconstruct from `git log`.

## After the last unit

Apply `references/common.md` **Close sequence** in full. Inspect base is
`git merge-base main HEAD` — never a last-unit-only range.

*Done when: that section's Done when holds.*

## Red Flags — Never

- Skip the tracker-sync, occupancy, or workspace preflight
- Invent a tracker or ticket set when config is absent or the user declined sync
- Start the next unit (or ledger unit complete as if unlocked) without human
  unlock or a written mode change
- Treat "stop stopping" as chat-only without writing `Execution-mode: continuous`
- Over-read "continue" as run-all-remaining-units
- Author or prefer PM review-order lists over derived story units
- Skip unit agent review and send the raw unit to the human first
- Skip whole-branch review because every unit was human-approved
- Use `HEAD~1` as a review base
- Hand a subagent the whole plan file
- Move on with open Critical/Important findings
- Fix reviewer findings in the controller context
- Re-dispatch work the ledger marks complete
- Dispatch before the todo list exists (tasks **and** Close branch)
- Skip the close sequence, silent-skip polish, or treat EOD/demo as a polish predicate
- Implement on main/master without explicit consent
- Create a worktree without asking
- Silently switch to continuous rules while the header still says story-unit
