---
name: cmk:delivery-spec-plan
description: Use when a design is approved and the tasks.md implementation plan (vertical-slice tasks with requirement footers and behavior tests) needs writing, after cmk:design and before cmk:delivery-build.
version: 1.0.1
---
# Delivery Spec Plan

Produce `docs/specs/<YYYY-MM-DD>-<feature>/tasks.md` from the approved
requirements and design, from the skill set's `references/templates/tasks.md`. Every task-block slot (**Files**, **Interfaces**,
**Depends-on**, **Steps**, `_Requirements:_`) is REQUIRED — no per-task risk
labels, decision-surface flags, or Human-review-order (see Step 3's gate table
for why). Write for a skilled implementer with NO context on this codebase,
seeing ONLY their task plus Global Constraints: **names, paths, types,
commands** they must not guess go in **Files / Interfaces / Reuse / footer**,
never as prose inside Steps (see **Thin steps**). Create a todo per step (1–4,
plus 5 if there's a tracker) — this skill's own list, separate from
`cmk:design`'s and the execute family's — checked off only when its
**Done when:** is met.

## Step 1: Header and Global Constraints

Goal (one sentence), Architecture (2–3 sentences), Tech Stack, and
`Execution-mode: <unset|continuous|story-unit>` (leave **unset**; never invent
it from size/band/habit — mode write-back happens only at **Exit**). Then
**Global Constraints**: project-wide rules at a canonical source path + hash,
referenced (not copied) by every task. `## Team` with a roster/band override →
derive band + packaging from it alone (Solo: no fake multi-assignee theater;
Small/Multi: optional freeform notes, never a new required field); no Team →
pre-feature default. `docs/design/` spine, if any → fold its hard
`**ARCH-N**` invariants in too, so every task inherits them. Resolve the
source below — first hit is SSOT; never invent a parallel one:

| Order | Source | Covers |
|---|---|---|
| 1 | `docs/rules/common/`, when it exists (`INDEX.md` + domain files like `testing.md`, `errors-logging.md`) | naming, i18n, house rules, testing, errors/logging |
| 2, then 3 | Else `docs/requirements/guidelines.md` (**legacy fallback only**, and only if it has a parallel rule body — not pointer-only) when `docs/rules/common/` is absent; else `docs/agents/project.md` | test/lint/typecheck commands, naming/i18n rules, forbidden changes |

**Done when:** Goal, Architecture, Tech Stack, `Execution-mode:` (typically
`unset`), and Global Constraints source path/hash are written, with the
constraint source identified and no parallel SSOT invented.

## Step 2: File structure and retrieval

Map every file the plan creates or modifies, with one-line responsibilities,
BEFORE writing tasks. A file not in the map should not be touched by any task.

### System docs consult during File Structure (optional)

WHEN this step writes or revises File Structure / path placement, read
`references/system-docs-consult.md` and follow it exactly — it resolves
codebase/standards authority, conflict handling, and the no-op path when those
docs are absent or non-authoritative.

Once the map is complete and **before writing task bodies** (Step 3), run
retrieval once: REQUIRED SUB-SKILL: use `cmk:feature-graph` for **`blast_radius`**
on the mapped paths, then for **`cluster(feature CODE)`** as sole focus. Hold
the package while authoring Files/Reuse; for **grounded claims** (one home)
follow `cmk:feature-graph`'s `references/grounded-claims.md` —
empty/thin isn't a gate, but state coverage before absence claims.

**Done when:** every file to create/modify is mapped with a one-line responsibility,
and blast_radius/cluster(feature CODE) ran once (or no-op if specs/seeds are missing).

## Step 3: Tasks as vertical slices

**Contract:** a task is a vertical slice — the smallest unit with its own test
cycle and review verdict; split only where a reviewer could reject one task
while approving its neighbor. **Shape:** one demoable end-to-end outcome per
task per user story; prefactoring that only enables a later slice is its own
**earlier task** ("make the change easy, then make the easy change") via
`Depends-on` edges — never buried horizontal layers inside a story task.

Each task carries these slots:

| Slot | Rule |
|---|---|
| **Exclusive resources** | Non-path shared services the task holds exclusively — a Docker daemon, a shared local database or chain, a fixed port, an external sandbox — or `none`. Two tasks naming the same entry never share a wave (`cmk:delivery-build`'s `references/continuous.md` step 3), however disjoint their Files. |
| **Files, Reuse, Interfaces, Depends-on** | Files: Create / Modify / Test, each path **hardened** in backticks (e.g. `` `src/foo/bar.ts` ``); never glue a line number/range into the path token (`path:86-103` is forbidden) — ranges go in surrounding prose or a separate annotation (new plans only; P1 ownership extraction still accepts legacy glued forms in already-written `tasks.md`). Reuse: the concrete existing code/library/pattern this task builds on, copied **verbatim** from the design section's `Reuse:` line — same `<rung> — <concrete target>` grammar (e.g. `Reuse: existing — src/util/dates:parseISO (rung 2)`); copy, don't reinterpret — Step 4 checks it against the design's line. Interfaces: Consumes / Produces — the names and types neighboring tasks share, so an isolated implementer learns what to call things. Depends-on: the earlier tasks this one truly needs — those whose interface it Consumes or whose files it builds on — as `Depends-on: Task 2, Task 4`, or `Depends-on: none`. Parallelism signal: two tasks sharing no files and no interface declare no edge, so the continuous `cmk:delivery-build`'s `references/continuous.md` scheduler may place them in one ready set when surfaces are disjoint and worktree isolation is safe; omitting the line falls back to depending on every prior task (safe but fully serial) — over-declaring needlessly serializes, under-declaring is caught by the executor's file-disjoint check before it can collide. Governs build waves — never reorder or narrow dependencies solely to tidy review units if that would lie about what the task needs. |
| **Steps (thin, 3–8 checkboxes)** | Bite-sized checkboxes (2–5 min each, prefer **3–8** per task), TDD cycle: failing test (complete code describing **behavior**, not embedding requirement IDs in application/test source) → run, expect the stated failure → implement (complete code) → run, expect pass → commit with a conventional subject explaining the change (no `Implements:` / `Guards:` trailer required or taught). No novel-length essays here — that bloats review surface; long how-to narration for one worker goes in the execute brief (`.skills/<CODE>/task-N-brief.md`) at execute time, while the shared plan keeps **identifiers** (paths, type names, commands) in Files / Interfaces / Reuse so the brief cannot invent APIs. |
| **Footer** | `` `_Requirements: CODE-N.M, CODE-N.M_` `` — the IDs this task implements or guards; every task has one. **Default: one story's IDs** (same story number N); multi-story footers **merge** those stories into one review unit under `cmk:delivery-build`'s `references/story-unit.md` (plan-quality signal — not a ban, not a reason to lie about Depends-on). IDs live in this footer (and in requirements/design), not in production source or test titles. No placeholders anywhere in a slot — "TBD", "add appropriate error handling", "similar to Task 3", or a type referenced but defined in no task — each is a plan bug; fix it before the plan ships. |

| Thought | Reality |
|---|---|
| "Prefactor first is always right — make the change easy" | Prefactor via Depends-on is fine; review units still follow story citations at cmk:delivery-build's references/story-unit.md |
| "I'll add Risk: high so reviewers notice" | No such field. Risk globs on the actual diff replace agent labels |
| "I'll write Human review order so the human knows what to read first" | Superseded: story-derived units are the review order; an authored second list dies without a consumer |

**Done when:** every file in Step 2's map is covered by ≥1 task, each written
as a vertical slice with its own test cycle — slot/placeholder cleanliness is
Step 4's check, not this one.

## One triad, one plan

**Home for this rule** — Step 4 and Exit only point here.

Write every vertical slice of the approved design and requirements into this
`tasks.md`. One feature triad is one plan. `cmk:scope` / `cmk:roadmap`
own *independent subsystems* or a *new feature shape*, not leftover slices
of this triad. Cut scope only when the user strikes requirements. Merge only
when the result stays a vertical slice (Step 3).

| Thought | Reality |
|---|---|
| "28 tasks — decompose leftover onto a later ROAD so this can Approve" | Leftover slices of this triad stay in this file. That split fragments the feature. |
| "I'll merge layers into one mega-task so the file looks smaller" | Horizontal hiding is still a Step 3 plan bug. |

## Step 4: Coverage and consistency check

| Check | Rule |
|---|---|
| **Coverage: cmk:traceability, behavior steps, seam-table** | REQUIRED SUB-SKILL: use `cmk:traceability` — every Approved requirement cited by ≥1 task footer (uncited IDs mean incomplete, or strike with a reason); docs-only, no IDs in test source. Each footer ID needs a covering TDD step (or manual/acceptance step) asserting **behavior** in domain language — never `[CODE-N.M]`, `/// REQ:`, or `@CODE-N.M` in test source; map IDs to tests in the task report / Spec review, not production trees. Covering is not one test per ID: IDs whose behavior has the same shape at the same seam (a rule applied to several inputs, several defaults) share one table-driven test with a row per ID, and the footer still cites every ID. If `design.md` has a "Seams for testing" table, every ID in every row needs a planned test/acceptance step at that seam — an ID promised but left uncovered is *dropped coverage*: add the step, don't renumber. |
| **Type/name + Reuse consistency + reuse-miss** | The same function must have the same name and signature in every task that mentions it. Flag any task whose `Reuse:` line disagrees with the design section's `Reuse:` line. Also flag any task whose Files **Create** something the scan digest or an already-installed dependency already provides — build on it instead (task-granularity sibling of `cmk:delivery-review`'s `reuse-miss`; advisory, not a hard block). |
| **Spec alignment + upstream sync-back** | Re-read requirements.md once, checking each criterion against the task that claims it. If a requirement proves *wrong or infeasible as written* — not merely uncovered — correct it in requirements.md and re-surface for approval; do not bury a workaround in a task that leaves the requirement lying — a plan that satisfies a false requirement ships the falsehood. |
| **Production readiness** | Fill the template's `## Production readiness` section: read `references/production-readiness.md` and give each line that the change's blast radius touches a covering task or an accepted gap with its reason. A docs-only plan writes `None — docs only`. |
| **Independent plan review (dispatch, don't self-review)** | The checks above are doc-only and stay here; the codebase comparison does not. Dispatch a review subagent with the plan, requirements.md, design.md, and the repo; have it verify against real code every symbol, signature, path, import, and **hardcoded test value** the plan asserts — a fabricated golden or a guessed API is the classic plan defect — citing `file:line` and defaulting to flag. Findings to `.skills/<CODE>/plan-review.md`; fix before offering execution (no subagents? do the comparison yourself). Check **One triad, one plan** (one home). |

**Done when:** every requirement ID has a task footer and a planned behavior
test at an agreed seam; cmk:traceability, the seam-table reconcile, and the
placeholder scan are clean.

## Step 5 (optional): Publish to the issue tracker

If the repo has no tracker (`docs/agents/issue-tracker.md` absent, or
**Tracker:** empty / none) → **skip** this step (not pending). Otherwise, read
`references/publish-recipe.md` and follow it exactly: resolve **Publish
unit**, author the issue body, and record ids under `.skills/<CODE>/`. Default
and only tracker-visible unit: **one feature issue** per plan, closed by the feature PR.

| Thought | Reality |
|---|---|
| "Four tasks → four issues so agents can grab in parallel" | Waves read `tasks.md` + Depends-on. Tracker noise is not parallelism |
| "Sub-issues keep hierarchy without noise" | Under unit `feature`, tasks are not tracker tickets |
| "cmk:discover-efforts's references/publish.md always means one issue per slice" | Non-triad path only. This step follows Publish unit |
| "I'll publish tasks; the user can close extras" | Extras are the defect under unit `feature` |
| "Many tasks — config must mean tasks" | Size never sets Publish unit; only the file line or explicit user order |

### Red Flags — Step 5

- Under unit `feature`: more than one triad issue, or any issue titled like a plan task (`Task N:`)
- Setting or assuming `Publish unit: tasks` from plan size alone
- Falling back to task issues after a permission error

**Done when:** skipped (no tracker / cannot publish), **or** unit `feature` with
exactly one feature issue (union IDs, plan path, id under `.skills/<CODE>/`),
**or** unit `tasks` with one issue per plan task and ids recorded.

## Change map — when the operator asks to see it

WHEN the operator asks to see what the plan changes — a picture, diagram, map — the
presentation includes a change map. REQUIRED SUB-SKILL: use `cmk:visualize`, figure job
`before/after structure`; write `.skills/<CODE>/change-map.html` and give its path. Four
baseline runs asked for a picture: one drew none, three drew the feature's own call chain
in ASCII, and none showed that REFUND's Task 4 rewrites the same `invoiceView` — one drew
the merged signature `invoiceView(invoice, refunds, today)` that neither plan holds.

The files are every path in the plan's `**Files:**` lines, docs included — one early
haiku map dropped the `docs/api.md` its plan modifies, and its owner with it. Run
`grep -ln '<path>' docs/specs/*/tasks.md` for each. The page shows:

1. Each of those files, marked new or changed, with its owner from
   `docs/agents/project.md` Ownership notes.
2. The calls and imports the plan adds or changes between them.
3. Each external consumer of a changed surface (the design's `Surface:` lines).
4. On the figure itself: each other plan the grep names whose `requirements.md` is not
   `Shipped`, as a collision on that file, with the signature or change as each plan
   writes it.

A picture drawn inline in the reply is not the map, even when it "covers the same ground":
the three baseline pictures were inline, and the collision was on none of them.

*Done when: the page exists with all four, and every collision is on the figure.*

## Exit

| Step | Rule |
|---|---|
| **1–2. Present** | WHEN Plannotator is already installed, hand the written plan to `/plannotator-annotate` first and keep its notes with the plan; absent, skip it — never install it. Present the FILE and STOP — conversational agreement is not approval; the written plan is what gets approved, and the execute family runs only on an approved `tasks.md`. Follow **One triad, one plan** (one home). |
| **3. On approval** | Set `Status: Approved`. Leave `Execution-mode:` as `unset` (or untouched); do **not** write `continuous` or `story-unit` yourself. |
| **4. Offer three routes** | Exactly three, one question — do **not** first ask continuous vs story-unit (that interview is dead); mode write-back owned by the picked skill. `cmk:delivery-build`'s `references/story-unit.md`: subagent path, human-gated review units derived from stories (writes `story-unit`). `cmk:delivery-build`'s `references/continuous.md`: subagent waves, no human pause between tasks (writes `continuous`). `cmk:delivery-build`'s `references/inline.md`: controller implements sequentially with `cmk:tdd`, no implementer subagents (writes `continuous` as bookkeeping; **does not** run unit barriers). **Recommend (label only, not invent mode):** mark **`cmk:delivery-build`'s `references/story-unit.md` (Recommended)** first WHEN user-facing UI/UX, Team Solo/Small, or `requirements.md` has **≥2** behavioral stories — still offer all three, still wait for the pick; no triggers → leave unmarked (not invent mode, not a size default — see gate table below). |
| **5–6. On pick, INDEX** | Hand off — REQUIRED SUB-SKILL: use `cmk:delivery-build` in the picked mode (its mode file writes `Execution-mode:`) (for the two subagent routes, prefer REQUIRED SUB-SKILL: use `cmk:worktree` first when none exists yet). WHEN `docs/agents/host-build.md` exists, ask **once after the pick** whether the chosen route runs here or on the build host — offload → REQUIRED SUB-SKILL: use `cmk:delivery-remote` (installed with the ops pack that wrote that file), which wraps the pick rather than replacing it. Then confirm the feature's row in `docs/specs/INDEX.md` carries the same `Status:` as its `requirements.md`. |

| Thought | Reality |
|---|---|
| "PM said just mark Approved — continuous is obvious" | Offer the three skills. Do not invent mode. |
| "I'll ask continuous vs story-unit, then offer routes" | One question: which of the three skills. |
| "I'll write Execution-mode now so the plan looks complete" | Mode is written by the execute skill. |

### Red Flags — Exit

- Asking continuous vs story-unit before the three-skill offer
- Setting `Status: Approved` while inventing `Execution-mode:`
- Splitting leftover slices of this triad onto a new ROAD because of task count
- Offering only one route, or treating "LGTM, build it" as `cmk:delivery-build`'s `references/continuous.md`
- Omitting `(Recommended)` on `cmk:delivery-build`'s `references/story-unit.md` when the Recommend predicate holds

**Done when:** **One triad, one plan** holds, `Status: Approved`,
one of the three execute skills named (and handed off on pick),
`Execution-mode:` not invented here, and the INDEX.md row agrees.
