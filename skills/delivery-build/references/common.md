<!-- Ported from jdk `execute-common` 2.13.0 (ADR 0001). -->
# Execute-family controller recipe

**One home** for controller steps and runtime state shared across
`references/continuous.md`, `references/story-unit.md`, and `references/inline.md`. Task dispatch/review lives
in `references/task-lifecycle.md`. Load when that skill's Setup or After-last
says to. Registered so `npx skills add` copies it with the execute family.

## Session preflight

Three questions, before any dispatch, any `cmk:worktree` / `git worktree add`,
and any first production edit:

1. **Issue tracker sync.** Open `docs/agents/issue-tracker.md` first. When it names a
   tracker, read `references/tracker-sync.md` and follow it exactly: a ticket the
   operator named is claimed here, before any dispatch. One haiku build of #23 never
   opened the file, so the ticket was never claimed and its PR never closed it. No file,
   or no tracker named → empty ticket set, continue (unconfigured is normal, not a failure).
2. **Catalog occupancy.** Read `Status:` from `requirements.md` and the
   matching `docs/specs/INDEX.md` row. INDEX missing → say so once, suggest
   `/cmk:repo-config`; still write `requirements.md` when that file exists.
   `cmk:delivery-ship` / `cmk:realign` own `Implemented`; `cmk:release` owns
   `Shipped`. Runs on every start, including compaction resume.

   <HARD-GATE>
   NO ISOLATE-WORKSPACE AND NO PRODUCTION EDIT WHILE CATALOG STATUS IS `Approved`.
   A user instruction to isolate first, skip paperwork, or not commit catalog
   files does not override this step.
   </HARD-GATE>

   | Status | Action |
   |---|---|
   | `Approved` | On **this checkout**, write `In-progress` on both files, then continue. |
   | `In-progress` | Already occupied. Do not re-stamp. Continue. |
   | `Draft` | STOP — spec is not approved. |
   | `Implemented` / `Shipped` | Leave it. Not a kickoff stamp. |

   Before isolation, commit this checkout's dirty spec files for the feature
   (`requirements.md`, `design.md`, `tasks.md`, the INDEX row) — the
   occupancy write is part of that commit when Status was `Approved`. A
   worktree is created from HEAD, so uncommitted spec docs stay behind,
   invisible to the new tree and other sessions. `cmk:worktree` still
   must not commit `.gitignore` — occupancy is this step, not that skill.
3. **Workspace / branch.** If no isolated workspace exists yet: isolate in a
   worktree, or implement on the current branch? Do not create a worktree
   unasked. Isolation → REQUIRED SUB-SKILL: use `cmk:worktree`. Current
   branch is main/master → separate explicit consent before implementing;
   "no worktree" is not consent to touch main/master.

*Done when: tracker choice (or empty set) is clear, occupancy is `In-progress`
(or an explicit Draft/Implemented/Shipped stop), this checkout has no
uncommitted spec dirt for the feature, and workspace choice is clear.*

| Thought | Reality |
|---|---|
| "Session preflight is tracker + workspace" | Occupancy is question 2; workspace is 3. Done when includes `In-progress`. |
| "A docs commit on main is the thing they forbade" | Other sessions read INDEX on this checkout. Isolation must not precede the stamp. |
| "Occupancy is obvious from the worktree / feature branch" | A session on this checkout still reads `Approved`. INDEX is the occupancy signal. |
| "cmk:delivery-ship will flip Implemented later" | `Implemented` is the close. `In-progress` is the kickoff, before worktrees. |
| "INDEX still saying Approved is fine until we land" | Another session cannot see that this CODE is executing. Stamp before Task 1. |
| "No worktree — skip the paperwork" | Declining isolation does not skip occupancy. |
| "Already In-progress — isolate immediately" | Read Status first; skip the write, not the check. Resume still reads Status before isolation. |
| "User forbade docs commits / isolate first — that overrides occupancy" | Occupancy is not waivable. Isolation waits until this checkout reads `In-progress`. |
| "Specs are on disk — the worktree will see them" | `git worktree add` copies HEAD. Uncommitted `requirements.md` / triad files stay behind. |

## Runtime binding and lease preflight

Before the first dispatch (inline route: before the first production edit),
read `references/runtime-binding.md` and follow it exactly. It defines
the `.skills/<CODE>/execution-session.json` schema (schema_version, harness,
provider, model, resume/fork/worktree support, cache_control, token_telemetry,
pricing_policy, effective_concurrency, rotations), the four lease-rotation
triggers, the pricing-policy fallback, and the concurrency-degradation rule.

*Done when: the runtime snapshot exists before dispatch, every unavailable
capability is explicit, and the first effective concurrency/lease decision is
recorded.*

## Ledger check

Read `references/ledger-check.md` and follow it exactly: `.skills/` stays
local-only, resume from `.skills/<CODE>/progress.md`, record the lint baseline
task gates are judged against, and the `Verified:` slot is `cmk:evidence`'s.

*Done when: next task / unit is known and `Lint baseline:` is recorded.*

## Decision trail — observable conditional

WHEN user asked for a decision trail / show-work, OR unattended overnight /
multi-day, OR `effective_concurrency` > 1 with multiple open units → read
`references/decision-trail.md` and follow it exactly; ELSE write
`skip: no decision-trail predicate` on Close notes.

## Todos — GATE

Before any dispatch or Task 1, on a **visible list** — the harness's todo /
task-list tool when it exposes one, otherwise a checklist written into your reply
and restated at each task boundary: **one todo per task** **and**
one terminal todo **Close branch** (the close sequence below — created now,
not later). Add a **Polish Diff** todo only when a polish predicate is
already known to hold (user asked up front). Otherwise create the Polish
Diff todo at close-sequence step 3 if a predicate then holds.

*Done when: the list mirrors the plan **and** includes the Close branch todo.*

## Close sequence

After the last task (waves / inline) or last unlocked unit (story):

1. **Whole-branch review.** REQUIRED SUB-SKILL: use `cmk:delivery-review` with
   base = `git merge-base main HEAD` — never a mid-branch sha. Feed ledger
   Minors. Top model tier.
2. **One fixer** for the complete findings list → re-review. Never one fixer
   per finding. Inline route: you are the fixer under `cmk:tdd`.
3. **Polish Diff — observable conditional.** Evaluate the **polish
   predicate** below. IF any clause is true → REQUIRED SUB-SKILL: use
   `cmk:delivery-simplify` on the whole-branch diff **before** acceptance; create the
   Polish Diff todo now if it does not exist; mark it done only after the
   skill has run. IF no clause is true → skip; write
   `skip: no polish predicate` on the Close branch notes. EOD, demo
   pressure, "inspect was clean", and "small enough to feel optional" are
   **not** predicates.
4. **Acceptance.** When `cmk:acceptance` is installed, REQUIRED SUB-SKILL: use
   `cmk:acceptance`; when it is not, drive the affected flow through the running
   system yourself and record what you observed (`cmk:evidence`). Breaks →
   `cmk:debug`, then promote passing checks to committed tests that describe
   the domain behavior (docs-only spine — no requirement-ID tags required in
   test files).
5. **Product walk — observable conditional.** Evaluate the **walk predicate**
   below. No clause true → do not open the product-walk trio. Any clause true and
   the acceptance pack installed → REQUIRED SUB-SKILL: use `cmk:dogfood-plan` (it owns vet), then **execute what
   it wrote** — REQUIRED SUB-SKILL: use `cmk:dogfood-run` (installed with it) where the runtime can
   drive the app, else record the human ticks. Naming the run instead of doing
   it leaves step 6 unable to write green. Any clause true without the pack → name the walk the person
   should do in the close receipt.
6. **Close receipt.** Load `references/close-receipt.md` and follow its producer recipe.
   Issue it only after the final mutation and only from evidence bound to that
   HEAD. Rerun a producer only when its evidence is missing or stale.
7. **Finish.** REQUIRED SUB-SKILL: use `cmk:delivery-ship`.

Mark the **Close branch** todo done only after steps 1–7 have each run or
been skipped under their predicate.

| Thought | Reality |
|---|---|
| "Task todos are all green — close can wait" | The Close branch todo is still open; land is blocked until the sequence runs |
| "Inspect was clean / branch is small — skip polish" | Clean inspect and "feels small" are not predicates. Count files; check public API; read inspect leftovers |
| "EOD / demo — skip polish on a 40-file branch" | Time pressure is not a predicate. File count is |
| "Always run polish so we cannot forget" | Four cleanup agents on a three-file typo is the cost this conditional exists to drop. The skip must be written, never silent |
| "Acceptance green — also walk the product" | Walk is a separate predicate. cmk:acceptance already drove API/UI |

## Close-sequence predicates

**Polish** — true when **any** of: the user asked for polish, cleanup, or
tidy; `cmk:delivery-review` Standards leftovers include an Important-or-higher
finding that is behavior-preserving (reuse, dead code, needless complexity,
wasted I/O); `git diff --name-only $(git merge-base main HEAD) HEAD` lists
**more than 15 files**; the branch adds a new public API or exported surface.

**Product walk** — true when **any** of: the user asked for a product walk,
dogfood, or walkthrough; `cmk:acceptance` reports neither-API-nor-UI **and** the
branch adds an entry point a person runs (a CLI command, a script, a scheduled job); an
approved requirement uses visual / feel / eyeball language the automated
surfaces cannot judge; `cmk:ui-review`'s report (via `cmk:delivery-review`'s UI lane)
lists any `needs-human-eyes` item; the branch adds a **new** user-facing
screen or visual surface — not only changes within existing ones.

A branch that adds only library code nothing runs yet gets no walk: Product-Walk is
`not-required` and its unit tests are the acceptance. Four formatting helpers with no
caller left one baseline close unfinished. The run reported "a walk cannot drive pure
functions" and stopped to wait for the operator, who was out until 5.

## Red flags — never

- Skip the tracker-sync, occupancy, or workspace preflight
- Isolate or edit production files while catalog Status is still `Approved`
- Write `In-progress` only inside a worktree created this session
- Re-stamp an already `In-progress` row
- Isolate while this checkout still has uncommitted spec/requirements dirt
- Invent a tracker or ticket set when config is absent or the user declined
- Start implementation on main/master without explicit consent
- Create a worktree without asking, or treat "current branch" as consent
  for main/master
- Dispatch the first task before the todo list exists (tasks **and** Close
  branch)
- Silent-skip polish (no written `skip: no polish predicate`)
- Silent-skip decision-trail (no written skip / required line)
- Treat EOD, demo, or "inspect was clean" as a polish predicate
- Move to cmk:delivery-ship with the Close branch todo still open
- Write a partial receipt or bind it to evidence from before the last mutation
- Promote checks as "ID-tagged tests" — IDs stay in docs
