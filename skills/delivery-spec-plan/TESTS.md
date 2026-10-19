<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:delivery-spec-plan` — pressure-test record

## v1.5.0 — drop the 12-task Approve ceiling (2026-09-14)

**RED (this session, against v1.4.0).** User: apply research-aligned
design/task writing, but drop the 12-task ceiling — tasks follow design and
requirements; splitting leftover onto another ROAD fragments the feature.

v1.4.0 `## Plan size budget (hard gate)`: `WHEN task_count > 12` **MUST NOT**
set `Status: Approved`; remedy 1 **Decompose** keeps the first ship slice,
hands leftover to `cmk:roadmap` as `ROAD-N`, then deletes those tasks
from *this* file. Urgency / "don't split" did not waive.

That is the defect: a coherent Satisfies set whose vertical slices exceed 12
cannot stay one triad. The count gate *forces* the fragmentation the user
named.

**Pressures the old gate trained:** authority + time + "don't split" — and
the skill still refused Approve and offered ROAD split.

**GREEN.** No numeric Approve ceiling. Home: `## One triad, one plan`.
Leftover slices of the same Satisfies set stay in this `tasks.md`.
`cmk:scope` / `cmk:roadmap` still own independent subsystems or a
*new* feature shape, not overflow. Vertical-slice shape, thin Steps 3–8,
slot contracts, no invented `Execution-mode`, three execute routes: unchanged.

Live-agent GREEN not re-run; structural + session RED. Same honesty as the
v1.3.0 line-ceiling drop.

## v1.5.1 — cmk:skill-authoring wording pass (2026-09-14)

v1.5.0 body led with **MUST NOT** + "no numeric Approve ceiling". Failure class
is *complies, wrong output shape* (ROAD-split), so the form is a positive
recipe — one triad is one `tasks.md` — not a leading prohibition (`cmk:skill-authoring`
failure table; `influence-principles`: cmk:delivery-spec-plan is a recipe). "No ceiling" /
"count is not a gate" named the dropped metric into SKILL.md: same no-op /
negation trap v1.3.0 already measured on "file length is not gated". Dropped
from the body. Step 4 / Exit are pointers only. Leading word: **triad**.
Eval prompt no longer seeds "vertical-slice". Behavior unchanged.

## v1.4.0 — Exit itinerary trim (2026-09-14)

**RED.** Eight-row Exit thought table scripted how to *talk* about routes, not
the task contract (OpenAI: overly specific guidance now hinders).

**GREEN.** Exit still offers exactly three skills, does not invent
`Execution-mode`. Thought table keeps the three load-bearing counters.
Recommend predicate and Red Flags remain. (The 12-task Approve block this
version still carried is dropped in v1.5.0.)


## RED — continuous scheduler metadata (baseline, 2026-08-26)

The template had no `Max-concurrency` field and described no-edge tasks only as
one parallel wave, leaving serial fallback and isolation safety implicit.

## GREEN — continuous scheduler metadata (structural, 2026-08-26)

The template now records `Max-concurrency: auto` and states that no-edge tasks
may share a ready set only when worktree isolation is safe. Live routing
pressure was unavailable; structural verification is recorded here.

Process: `cmk:skill-authoring` Iron Law. This file is the evidence home for Exit + dead
fields; body rules (vertical slices, coverage) rely on guide/examples and
sibling skills' evidence unless a new failure appears.

## Model roster

| Role | Models |
|---|---|
| Ship target (weak floor) | mid-tier coding agents |
| Ship target (strong) | top-tier coding agents |

Full multi-model transcript matrix is **open** for the Exit rewrite (2026-08-01).
Paper RED + structural GREEN below; live subagent GREEN should be re-run before
calling the Exit gate bulletproof.

## RED — S-WP-EXIT (dual mode interview OR silent continuous)

**Pressures:** time + authority + pragmatic ("approve and start building").

**Setup.** Approved design; agent holds a finished `tasks.md` under `Status: Draft`.

**User.** "Looks good — approve and start building. Standup in five."

**Observed (baseline dual gate / old Exit).** Agent either:

1. refuses `Status: Approved` until user picks `continuous` or `story-unit`, then
   re-asks which execute skill; or
2. invents `Execution-mode: continuous`, sets Approved, and starts
   `cmk:delivery-build`'s `references/continuous.md` without offering three routes.

**Verbatim rationalizations (target counters):**

- "PM said start building — continuous is obvious"
- "Mode then route is thorough"
- "I'll write continuous so the plan looks complete"
- "Four tasks → cmk:delivery-build's references/continuous.md default"

**Failure class.** Gate under pressure — dual interview wastes a turn; silent
default skips the route choice. Form: positive Exit recipe + rationalization
table + Red Flags (not soft "prefer").

## GREEN — current Exit

**Required behavior:**

1. Present file; wait for plan approval.
2. Set `Status: Approved`; leave `Execution-mode:` `unset` (or untouched).
3. Offer exactly three skills: `cmk:delivery-build`'s `references/continuous.md`, `cmk:delivery-build`'s `references/story-unit.md`, `cmk:delivery-build`'s `references/inline.md`.
4. Do **not** ask continuous vs story-unit first.
5. On pick → REQUIRED SUB-SKILL handoff to that skill (prefer `cmk:worktree`
   first for subagent routes).

**Skill sites that bind this:** Exit recipe steps 1–5, Exit rationalization table,
Exit Red Flags; Step 1 only leaves mode unset and points to Exit.

### Live sample (2026-08-01)

| Field | Value |
|---|---|
| Model | session mid/top (single-shot subagent) |
| Pressures | time + authority + pragmatic |
| User | "Looks good — approve and start building. Standup in five." |
| STATUS | Approved |
| EXECUTION_MODE | unset |
| ROUTE_OFFER | cmk:delivery-build's references/continuous.md \| cmk:delivery-build's references/story-unit.md \| cmk:delivery-build's references/inline.md |
| ASK_MODE_FIRST | no |
| START_NOW | no — wait for route pick |
| Verdict | **pass** |

Meta: agent said a hard line "LGTM/build it ≠ route pick" would make skipping the
offer unmistakable — already covered by Red Flag + rationalization row; no new
loophole.

**Not yet bulletproof:** only one live rep; multi-model matrix open.

## RED — S-WP-PUBLISH (task issues / noise)

**Pressures:** pragmatic ("agents need grabable tickets") + authority ("tracker is source of truth") + sunk cost (plan already has four vertical slices).

**Production baseline (2026-08, klynt PTEN):** with prior Step 5 ("publish each task as an issue"), a four-task plan produced GitHub `#107`–`#110` titled `PTEN Task N: …`, each `ready-for-agent`. User closed them as noise.

**Observed rationalizations (target counters):**

- "Four tasks → four issues so agents can grab in parallel"
- "Sub-issues keep hierarchy without noise"
- "cmk:discover-efforts's references/publish.md always means one issue per slice" (wrong path for triad)

**Failure class.** Wrong output shape under compliance with the *old* recipe. Form: positive **feature-unit** recipe + rationalization table + Red Flags.

## GREEN — Step 5 feature unit

**Required behavior:**

1. No tracker / cannot publish → skip; never invent task issues.
2. Tracker present → **exactly one** feature issue; title `[CODE] …` not `Task N:`.
3. Body: AI marker, union `Requirements covered:`, plan path, optional ROAD/MILE.
4. No per-task issues or default task sub-issues unless in-session explicit opt-in.
5. Issue id recorded under `.skills/<CODE>/`.

**Skill sites:** Step 5 recipe, rationalization table, Red Flags; `templates/agents/issue-tracker.md` Publish unit default `feature`.

### Live sample

| Field | Value |
|---|---|
| Evidence | Production RED (PTEN #107–#110) + skill text rewrite 2026-08-08 |
| STATUS | paper + structural GREEN; multi-model matrix open |
| Verdict | **structural pass** — re-run live subagent before calling bulletproof |

### Author-skills wording pass (2026-08-08)

| Check | Result |
|---|---|
| Form matches failure | Recipe + rationalization + Red Flags (wrong shape under old Step 5) |
| No-op / duplication | Slot vs CODE one home = `cmk:roadmap`; Step 5 no longer contradicts config `tasks` |
| Nuance | Publish unit order is observable (file line → user order → default feature) |
| Token | Step 5 stays a single section; no second skill |
| Technique subagent (pressure: parallel tickets + standup) | **CHOICE B** — one feature issue; invent from plan size? **no** |

## RED — S-PLAN-BUDGET (megaplan approve) — 2026-08-27

**Pressures:** authority + time + pragmatic ("don't split / just ship").

**Setup.** Draft `tasks.md` with **28** tasks / **~900** lines; UI feature; cmk:traceability clean.

**User.** "Looks good — approve and start building. Standup in five. Don't make me split."

**Observed (v1.1.0):** **Approved** with mode unset; offered three routes; **no** size block.

**Rationalizations:** "Don't split / just approve"; "standup"; "CFND-size is normal"; Exit had no budget gate.

## GREEN — Plan size budget (v1.2.0)

**Required:** MUST NOT Approve when `task_count > 12` OR `line_count > 400`; cite counts; offer decompose / cut / merge only.

**Live:** blocked Approve; cited 28 / ~900; remedies offered; continuous not invented. **Pass.**

## RED — S-PLAN-RECOMMEND (UI → story-unit mark) — 2026-08-27

**Pressures:** pragmatic ("waves faster") + authority.

**Setup.** Under-budget UI plan (8 tasks / 350 lines), ≥2 stories, Team Small.

**Observed (v1.1.0):** offered three routes **without** marking `cmk:delivery-build`'s `references/story-unit.md` Recommended; resisted silent waves (already).

## GREEN — Recommend cmk:delivery-build's references/story-unit.md (v1.2.0)

**Required:** when UI/UX or Solo/Small or ≥2 stories → mark **`cmk:delivery-build`'s `references/story-unit.md` (Recommended)** first; still offer three; never invent mode; "waves faster" ≠ pick.

**Live:** Recommended mark present; mode unset; no silent waves. **Pass.**

## Rules this evidence owns

| Rule | Evidence |
|---|---|
| Plan approval does not require continuous/story-unit first | Exit step 2–3; RED failure (1) |
| Exactly three execute routes at Exit | Exit step 3 table |
| No silent invent of continuous at plan time | Exit step 2 + Red Flags; RED failure (2) |
| Mode write-back owned by execute skill | Exit step 2–4; build-* mode ownership tables |
| No Risk / Decision surface / Human review order | Template + Step 3 (fields omitted) |
| Triad publish is one feature issue, not one per task | Step 5; S-WP-PUBLISH RED |
| One triad, one plan — leftover slices stay in this file | RED S-PLAN-SPLIT (v1.4.0 gate vs 2026-09-14 user); GREEN v1.5.0; wording v1.5.1 |
| ~~`task_count > 12` blocks Approve~~ | History: RED S-PLAN-BUDGET; GREEN v1.2.0; dropped v1.5.0 |
| Recommend `cmk:delivery-build`'s `references/story-unit.md` first when UI / Solo-Small / ≥2 stories | RED S-PLAN-RECOMMEND; GREEN v1.2.0 |
| Thin steps 3–8 checkboxes; detail in execute brief | Step 3 Thin steps (2026-08-27) |
| Recommend ≠ invent mode; no size-based default ≠ forbid Recommend mark | GREEN wording 1.2.1 |

## Line ceiling dropped (2026-09-13 — v1.3.0)

The user asked to drop the 400-line ceiling: whole-file length no longer blocks Approve. Through v1.4.0, `task_count > 12` stayed the hard gate; v1.5.0 drops that too. Thin Steps stay as readability guidance. The v1.2.1 notes below about blocking on `line_count` are history, not current rules.

**No-op sweep (Sonnet, 3 fresh runs, skill text without a drafted "file length is not gated" sentence):** 7 tasks / 560 lines, 9 / 640, 11 / 820 — all three cleared the budget on `task_count`, approved, and asked for no shortening; one flagged 10–12-checkbox tasks as advisory against "prefer 3–8", not a blocker. The sentence was a no-op (and a second home for Thin steps), so it was deleted before ship.

## cmk:skill-authoring quality pass (2026-08-27 wording — v1.2.1)

**Meta on v1.2.0:** line_count felt like fluff; Thin vs “everything in the task” tension; decompose dual-handoff foggy; Recommend vs “no size-based default” misreadable.

**GREEN v1.2.1:** OR-ceiling explicit; counting recipe; identifiers vs Steps; cmk:scope vs cmk:roadmap; Recommend = offer label only.

| Check | Result |
|---|---|
| 10 tasks / 450 lines | Block on line_count; fluff waiver rejected |
| Solo infra Recommend | Marked; reconciled with no silent mode invent |
| Meta | clear for compliance |
| Version | patch 1.2.1 |

## Description trigger check (paper)

**should-fire:** "write the tasks plan", "break design into implementation tasks",
"tasks.md after design approved", "plan the vertical slices for this feature".

**should-not-fire:** "start building the plan" alone → execute family;
"design the architecture" → `cmk:design`; "write EARS requirements" →
`cmk:requirements`; "this is broken" → `cmk:debug`.

**Description shape:** trigger + outcome noun (`tasks.md` implementation plan);
no step list. Execute-family names are chain position, not workflow.

## Meta-test

Class: **clear** if agent cites Exit steps. Fail if agent still treats
"start building" as silent `cmk:delivery-build`'s `references/continuous.md` without offering the three skills.

## Length pass (2026-09-07, v1.2.1 → v1.2.2)

376 → 195 lines (target ≤195). No `SKILL.md §` contract-eval anchors exist for
this skill (confirmed via `eval.json`: every `derived_from` is `TESTS.md §
...`), so `lint-skill-evals.py` protected nothing here — the rule-inventory
diff was the only mechanical net, leaned on hard per the trim brief.

**Extracted (conditional blocks, skip predicate already stated inline):**
- Step 5's publish mechanics (Publish-unit resolution order, issue title/body
  shape, per-unit branching) → new sibling `references/publish-recipe.md`. Inline keeps
  the skip condition, a one-line pointer, and the Gate content (Thought/Reality
  table, Red Flags, Done when) which never moves.
- Step 2's optional system-docs consult (codebase/standards authority table,
  conflict handling, no-op path) → new sibling `references/system-docs-consult.md`.
  Inline keeps the heading, the WHEN predicate, and a one-line summary — same
  pointer shape as `cmk:design`'s `system-docs.md`.

**Restructured (Universal bucket — "turn narration into a table"):** every
multi-bullet prose block was converted to `| Slot/Check/Step | Rule |` tables,
then rows with adjacent, non-competing concerns were merged onto one row
(content preserved verbatim or near-verbatim, only connective prose trimmed):
- Step 3's six task-block bullets (Files/Reuse/Interfaces/Depends-on/Steps/
  Footer) → one table; No-placeholders and Thin-steps folded in as rows, then
  Files+Reuse+Interfaces+Depends-on further merged onto one row.
- Step 4's eight coverage-check bullets → one table; cmk:traceability + behavior
  coverage + seam-table reconcile merged onto one row; type/name + Reuse
  consistency + reuse-miss merged onto one row; spec alignment + upstream
  sync-back merged onto one row; independent-review + Plan-size merged onto
  one row.
- Exit's six numbered steps + the three-row Route table + the Recommend
  paragraph → one table (steps 1–2 merged, 5–6 merged, route meanings and the
  Recommend predicate folded into the "Offer three routes" row).
- Step 1's three-row standards-fallback table: rows 2 and 3 (the two fallback
  tiers) merged onto one row, ordering preserved via "2, then 3" + "when
  absent; else".
- Step 2 and Step 2b merged into one `## Step 2: File structure and
  retrieval` (no other skill in the tree cites cmk:delivery-spec-plan' "Step 2b" by name —
  verified via repo-wide grep — so the merge is safe; it also fixes a stale
  mismatch where 5 numbered steps existed under an intro claiming "todo per
  step (1–4)").

**Duplication removed (surviving home confirmed by grep):** the intro's
rationale for banning per-task risk labels/decision-surface
flags/Human-review-order (now points to Step 3's Gate table, which already
states the same rule as a Thought/Reality rebuttal); the Recommend paragraph's
"no size-based default" clause (already stated by two Exit Gate-table rows:
"Recommend story-unit is inventing Execution-mode..." and "Four tasks →
default cmk:delivery-build's references/continuous.md...").

**Untouched (per brief):** the `## Plan size budget (hard gate)` section in
full (metric table, remedy list, the quoted-rationalization line) — the brief
named this the one hard gate to leave alone. All three `| Thought | Reality |`
tables and both `### Red Flags` bullet lists are byte-for-byte the same rule
content as before the pass (surrounding prose was tightened, the rows/bullets
themselves were not).

**Atom count:** 119 atoms (HEAD) → 104 atoms across `SKILL.md` +
`references/publish-recipe.md` + `references/system-docs-consult.md`. The drop is expected: merging
6+ rows onto 1 collapses several separately-matched atom lines into one row
that still carries every fact (the rule-inventory tool counts physical
table/bullet lines, not distinct facts). `--diff` reported 30 atoms
"reworded" (≥70% word survival — expected given heavy table restructuring)
and 10 "with no home" by its literal-match heuristic; all 10 were manually
verified present via `grep` against their new location (see run log): the
`docs/requirements/guidelines.md` pointer-only/legacy-fallback conditions, the
second `cmk:feature-graph` retrieval query, the Reuse/Steps/Type-name-consistency/
Upstream-sync-back/Seam-table-reconcile facts folded into merged table rows,
the old standalone `| Route | Meaning |` table header (a no-op — its content
rows survive, folded into Exit's step table), and the Recommend trigger list
(folded into the "Offer three routes" row).

**Anchors:** no `SKILL.md §` anchors exist for this file; nothing to confirm
against `lint-skill-evals.py` beyond the pre-existing pass.

**Lint:** `lint-skill-length.py` reports 195 lines (at/under the 200 limit) and
asks for the budget entry to be cleared — left for the reviewer per the trim
brief (shared ledger, other files mid-edit in the same batch). All other
`scripts/lint-*.py` pass.

### Reviewer note — where the inventory tool degrades, and what was read by hand

This pass converted three bullet lists into tables and merged rows, which is the
one edit shape `skill-rule-inventory.py` handles worst. Merging four bullets into
one row spreads each bullet's distinctive words across a row carrying three other
bullets' words, so coverage falls below the 70% threshold and a preserved rule
reads like a lost one. Thirty atoms scored "reworded" and ten "no home"; every one
of the ten had a merged table row as its closest match.

Five were read by hand on review, chosen as the ones that would cost most if
wrong: the `docs/requirements/guidelines.md` pointer-only condition, the
`docs/rules/common/` absent-tree fallback, the second `cmk:feature-graph` cluster query,
the upstream sync-back rule, and the cmk:delivery-build's references/story-unit.md recommend trigger. All five
survive. The standards fallback is the one worth naming: its original prose
carried four conditions and the new table row carries all four — standards when
present, guidelines as legacy fallback only when standards is absent, never when
guidelines is pointer-only, else `project.md`. The word "unmigrated" is gone,
which is descriptive rather than operative.

The Plan size budget section is intact: both ceilings (12 tasks, 400 lines), both
metrics, all three remedies, and the line refusing urgency as a waiver. Only its
"home for this rule" sentence reflowed. All nineteen Thought/Reality rows survive.

For anyone repeating this on a file with no contract anchors: the tool narrows
what to read, it does not replace reading, and a table restructure is exactly
where that gap is widest.

## v1.6.0 — reader reach for the tracker issue (2026-09-28)

**Why.** The user runs this set alone in company repos (`zroute`): `docs/specs/`,
`docs/agents/` and `.skills/` are git-ignored, and teammates read Linear. An ID
or spec path they cannot open is noise to them. The concern is that they cannot
read it, not secrecy.

**Fixture.** `tollgate`, a small Node gateway under a random `~/checkouts/<hex>/`
parent. `.gitignore` carries the same local-only block zroute does. Linear is set
up with team key `TG` and Publish unit `feature`. The approved triad is
`QUOTA-1.1` to `QUOTA-2.2`, 3 tasks. Skills are installed at `.claude/skills/`.
Model: Sonnet (`claude -p --model sonnet`, restricted `--allowedTools`). The
prompt said to publish per the cmk:delivery-spec-plan publish step, write the payload to
`linear-issue.md` because the connector is offline, and that the tech lead
assigns from Linear this afternoon. It used no rule vocabulary: no "ID",
"private", "readable" or "understand".

**RED, v1.5.1, 3 reps: failed 3/3.** Every issue carried `[QUOTA]` in the title,
`Requirements covered: QUOTA-1.1, … QUOTA-2.2`, and
`Plan: docs/specs/2026-09-22-key-quotas/tasks.md`. One run also put IDs on each
checklist item. No transcript noticed that the specs were ignored. The recipe
told them to include those lines, and they did.

**Same batch, not a failure: PR body and Slack draft, 3 reps each.** 6/6 were
clean, with no IDs and no spec paths. They worked from `git diff` through
`cmk:prose`. No text was written for them. This was the weak form: the specs
were never in context. A run where they already are, such as right after a
build session, is unmeasured.

**GREEN, v1.6.0.** One observable predicate, `git check-ignore -q <tasks.md>`,
splits the body into private and shared. The CODE was renamed to `SPEND` so the
recipe's measured example did not mirror the repo. `--setting-sources
project,local` made sure the fixture copy was the one loaded, and all 5
transcripts read `.claude/skills/plan-tasks/publish-recipe.md` from the fixture.

- Private, specs ignored, 3/3 clean. Each ran `git check-ignore`. There was no
  `[SPEND]`, no IDs, no `Plan:` and no spec path, and the checklist had task
  titles only. The acceptance lines carried the behavior in plain words.
- Shared, specs committed, 2/2 kept `[SPEND]`, `Requirements covered:` and
  `Plan:`. No regression.
- The drafted-by-AI marker was present 5/5. `cmk:triage` keys on it, and in private
  reach it is the only agent-ready signal left because `Requirements covered:`
  is gone. The user chose to keep the line as it is.

Depth: a shape check, not a pressure campaign. It is a recipe fix for
wrong-shape output, per the skill-edit test depth rule. Meta-test not run.

## v1.7.0 — covering is not one test per ID (2026-10-15)

**RED (Sonnet, 1 rep).** CFG-1.1..1.10, one seam. Plan: 10 tests, one per criterion,
including three that only pin defaults; the agent noted the rules "pull in two directions"
(every ID needs its own test vs 3–8 steps) and resolved it by batching steps, not tests.

**GREEN.** With "same shape at the same seam share one table-driven test": 3 tests (8-row
rejection table, 3-row defaults table, one pass-through), 8 steps, footer cites all ten IDs.

## v1.8.0 — the change map (2026-10-18)

Roster: sonnet and haiku, headless (`skill-fixtures/run-headless.sh`, budget 3–5 USD).
Fixture: `harbor-ledger` as built — LATEFEE `Approved` requirements and design, no
`tasks.md`; REFUND `Approved` with a `tasks.md` whose Task 4 rewrites `invoiceView` to
`(invoice, refunds)`. LATEFEE's design rewrites the same function to `(invoice, today)`.
Neither spec names the other. Installed: `cmk:delivery-spec-plan`, `cmk:traceability`, `cmk:visualize`,
`cmk:explain`, `cmk:design`, `cmk:requirements`, `cmk:glossary`'s `references/define-domain.md`. Scored from the
written `tasks.md`, any `.html` under the checkout (the SVG text and the page text read
separately) and the final reply (`scenarios/plan-score.py`).

Prompts (Lan): **text** — "Write the plan, then walk me through what it's going to change
before I approve it — Minh and Quang are reviewing it with me at 3"; **pic** — the same,
with "give me a picture of what it's going to change — which parts of the system it
touches and how they connect".

### RED — 1.7.0

| | text (4) | pic (4) |
|---|---|---|
| Reply names the REFUND collision on `invoiceView` | 4 | 4 |
| Names harbor-portal / `docs/api.md` | 4 | 4 |
| A picture | 0 | 3 inline ASCII, 1 none |
| The collision on the picture | — | 0 of 3 |
| An HTML artifact / `cmk:visualize` loaded | 0 / 0 | 0 / 0 |

Text alone carried the collision every time, so a map on every plan fails the no-op test —
the plan's original "≥2 modules → always emit" predicate is not written. The failure is
the picture when one is asked for: every one drew LATEFEE's own call chain; h1 drew the
merged `invoiceView(invoice, refunds, today)` that neither plan holds, as if decided.

Form: wrong shape on an observable request → a conditional ("the operator asks to see
what the plan changes") with a recipe of four parts and a deterministic pass
(`grep -ln '<path>' docs/specs/*/tasks.md` per file in the plan's `**Files:**` lines),
built through `cmk:visualize`'s `before/after structure` job.

### GREEN — 1.8.0 draft, 6 runs (pic: 2 sonnet, 4 haiku; text: 1 sonnet, 1 haiku)

pic 6/6 wrote `.skills/LATEFEE/change-map.html` (inline SVG, no CDN) with the collision on
the figure and both signatures. text 0/2 drew a map — the conditional held. One haiku map
(gh1) dropped the `docs/api.md` its plan modifies, and Quang with it; one (gh4) had it only
in the list beside the figure.

### REFACTOR

1. Files anchored to the plan's `**Files:**` lines, docs included, with gh1's miss as the
   counter. Re-run 3 haiku + 1 sonnet: page-wide 4/4; rh1 put owners in a list beside the
   figure. The baseline failure was the collision missing from the picture, not owners —
   so only the collision is required on the figure; files, owners and consumers on the
   page.
2. Two haiku runs on that text drew the picture inline and skipped the page, verbatim:
   "I drew the picture above inline instead to keep the review moving"; "the diagram above
   covers the same ground." Countered with the RED record (three inline pictures, the
   collision on none). Re-run 3 haiku: 3/3 pages, collision on the figure, all four parts.

Rendered and read one map (rs1, `skill-fixtures/transcripts/2026-10-18-t15/png/`): before/
after columns, NEW/CHANGED marks, owners, harbor-portal, a COLLISION · REFUND box over the
three files both plans edit, and both plans' `invoiceView` side by side.

Not covered: a plan with no collision (the map still renders, item 4 empty); `show-run-
status` colouring progress on the map (the plan's T15 follow-on — no baseline asked);
GitHub/Linear specs held outside `docs/specs/`. Spend: about 2.65 USD.

## 1.9.0 — publishing onto the ticket the feature already has (2026-10-19), closed workflow

The fixture is `harbor-ledger` with overlays `latefee-plan` and `fmt-plan`, then
`scenarios/gh-board.sh` (the board on a stateful `bin/gh`) and `gh-roles.sh`. #23 is
relabelled `status:shaping`, the state of a ticket whose spec is still being written.
Prompt (Lan): "/cmk:delivery-spec-plan — The formatting plan … is approved — Quang signed it off this
morning. Publish it to the tracker; the ticket is #23." Installed: `cmk:delivery-spec-plan`,
`cmk:traceability`, `cmk:feature-graph`, `cmk:discover-efforts`'s `references/publish.md`.

**RED (1.8.0): 2 haiku and 1 sonnet.** All three updated #23 in place and created nothing
(3/3). Two of the three added `ready-for-agent` and kept `status:shaping`, so the ticket
held two state roles.

**GREEN (1.9.0).** Step 4 of `references/publish-recipe.md` now says a named or recorded ticket *is*
the feature issue, and that the frontier label replaces the current state role in the
same edit. 3 haiku and 1 sonnet:
- one state role (`ready-for-agent`): 4/4;
- no new issue: 4/4.
