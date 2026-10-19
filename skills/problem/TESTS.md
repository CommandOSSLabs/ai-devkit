<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:problem` — cmk:skill-authoring validation

## v1.2.0 — neighbor/rationale extraction (2026-09-14)

**RED.** 245-line / 1579-word root over the 200-line ratchet.

**GREEN.** Iron Laws stay in the root. Neighbor table, rationalizations, and
red flags moved to `references/boundaries.md`, loaded at setup.


**Roster:** grok-4.5 (harness primary; weakest = only model this pass)  
**Scenario files:** removed in `2338b34` ("remove test scenarios") — the runnable prompts now live in `eval.json` beside this file.  
**Date:** 2026-08-08  

Gate + technique: companion deep-solve; foundation order; disk artifacts; read-only;
anti full-delegate; name user-invoked skills only.

---

## Deployment checklist

### RED

| Check | Status |
|---|---|
| Pressure scenarios (3+ combined pressures) | Pass — S1 stacks time+authority+pragmatic+exhaustion; S2–S5 multi-pressure |
| Model roster named | Pass — grok-4.5 |
| Baseline without skill; failures verbatim | Pass — isolated RED; see results file |
| Baseline actually failed | Pass — S1–S5 failed; S6 already compliant |

### GREEN

| Check | Status |
|---|---|
| Failure classified; form matches | Pass — prohibition set + positive turn recipe + conditional foundation skip |
| Description = plain user-invoked deliverable line | Pass |
| Verb-first name | Pass — `cmk:problem` |
| Trigger test N/A for auto-route | Pass — `disable-model-invocation: true` |
| Minimal text vs recorded failures | Pass — rules bind RED failures; wording pass earlier |
| Re-run with skill; weakest complies | Pass — 6/6 GREEN |

### REFACTOR

| Check | Status |
|---|---|
| Rationalization table + red flags | Pass — includes delegated≠carry-back after GREEN S1 |
| Wording micro-test (5+ reps dual arm) | Deferred — full scenario RED/GREEN used |
| Meta-test | Pass — agents named clear binding lines |
| No new rationalizations that broke GREEN | Pass — S3 thin body only (almost-violation) |

### Ship

| Check | Status |
|---|---|
| No-op / duplication sweep | Pass — structural + behavioral (S1–S5 no-ops disproved by RED fail) |
| User-invoked description plain | Pass |
| Body ≤~500 lines / 5k words | Pass — ~265 lines |
| References one level deep + TOC | Pass |
| Cross-refs: research REQUIRED SUB-SKILL; user skills named only | Pass |
| Frontmatter valid | Pass |
| Behavioral ship | **Pass** on grok-4.5 this pass |

---

## RED baseline (isolated, no skill) — grok-4.5

| Scenario | Choice | Compliant? | Rationalization (abridged) |
|---|---|---|---|
| S1 Full-delegate | **A** | **FAIL** | Paste-ready ship under demo; senior ordered optimistic locking |
| S2 Overview-only | **A** | **FAIL** | Short closed decision + English paste under demo pressure |
| S3 Skip foundation | **A** | **FAIL** | Pick with no theory; Redis is the right edge choice |
| S4 Write tracked | **A** | **FAIL** | User asked for ADR + commit; normal agent should do it |
| S5 Auto-spike | **A** | **FAIL** | "Just do it" → implement harness myself |
| S6 First-turn shape | **A** | pass | Careful restatement + one concept before design |

**Failed without skill:** S1–S5.

---

## GREEN (full skill) — grok-4.5

| Scenario | Choice | Pass? | Binding skill text |
|---|---|---|---|
| S1 | **B** | Yes | Foundation before rank; no terminal paste while open; delegated ≠ close |
| S2 | **B** | Yes | Never mark root solved; carry-back terminal only |
| S3 | **B** | Yes* | Foundation or `foundation: explicitly_skipped` then rank |
| S4 | **B** | Yes | Never write tracked project state |
| S5 | **B** | Yes | Never auto-invoke; name `/cmk:spike` |
| S6 | **A** | Yes | Announce + Identify/Define + disk + one F0 |

\*S3: correct choice; body was classification-heavy — optional scenario tighten later.

**Score: 6/6 GREEN.**

---

## Routing (user-invoked)

User types `/cmk:problem`. Model does not auto-route on description keywords.

**should-not-fire (neighbors):** time-boxed mental model + stance → `cmk:interpret`; pure learning → `deepen-codebase`; vague ask needing a prompt → `/cmk:prompt`; main ceremony → `cmk:scope` / `cmk:interview`; fact note alone → `cmk:research`.

---

## Isolation protocol (harness)

When this monorepo has the skill installed, RED agents **must** be told not to read
`skills/discovery/work-the-problem` or agent skill dirs — otherwise baseline is
contaminated. Record isolation in results when used.

---

## Changelog of test-driven edits

1. Wording/form pass (description, turn recipe, single homes) before RED.
2. RED isolation after contaminated first batch.
3. GREEN 6/6.
4. REFACTOR: rationalization + red flag — "just solve" / demo ≠ terminal carry-back while ROOT open.

---

## 2026-09-07 — length pass (v1.1.0 → v1.1.1)

Target was ≤195 lines; file has zero `SKILL.md § ...` eval anchors (all `eval.json`
`derived_from` point at `TESTS.md § RED S…`), so no anchor text was load-bearing —
the rule-inventory `--diff` was the only mechanical net.

**Result: 268 → 245 lines (1714 → 1579 words); did not reach 195.** This file was
already the tersest in the set (16.2 words/rule atom before this pass) — almost
every remaining line is Gate (`## The Iron Laws`, `## Rationalizations`
`| Thought | Reality |`, `## Red flags`, 44 locked lines total) or Universal
(reached every run: Setup, Analytical turn, Message → output, Act, User
ownership, Disk discipline, Carry-back brief, End-of-session digest). No block's
heading or opening line named a skip predicate broad enough to host a real
"recipe" extraction the way `foundation-ladder.md` / `process.md` / `artifacts.md`
already do for the conditional/worked-example material that existed. What moved
was pure same-fact duplication, not new extraction:

1. **Deleted** the `Where this sits` sibling table (3 rows: `/cmk:interpret`,
   `/deepen-codebase`, `/cmk:problem` self-row) — surviving home is the
   `## What this is NOT` table 16 lines below (`cmk:interpret` / `deepen-codebase`
   rows) plus the frontmatter `description:` and "What you owe them is dual" list
   (covers the self-row's "multi-round solve / in-service teaching / carry-back").
2. **Deleted** the Foundation section's inline `Order` diagram + 6 bullets
   (teaching-beat-per-layer, `strong` hole-check, `explicitly_skipped` record rule,
   `deepen-codebase` name-only handoff, "industry standard" tier rule, `file:line`
   rule) — every one already lives verbatim or near-verbatim in
   `references/foundation-ladder.md` (§ 2 Depth order, § 4 Authority ladder, § 5
   Teaching beat, § 8 Handoff), which the same section already points to. Left the
   pointer sentence plus a one-line index of what's behind it.
3. **Compressed** the Carry-back brief's field enumeration
   ("decision · dominant why · locks · residuals · …") to a pointer at
   `references/artifacts.md` § carry-back.md — the enumeration was a verbatim
   reorder of that template's eight `##` headers.
4. **Deleted** "Multi-round breakdown↔solve is the normal path." (no-op: restates
   what the phase diagram three lines above it already shows via the leaf-loop
   `re-breakdown until closed` line).
5. **Deleted** "This skill is never the time-boxed path (that is
   `/cmk:interpret`)." from User ownership (no-op: same fact stated in
   `## What this is NOT` row 1 and in the Rationalizations table's
   "They're in a hurry" row).

**Atom count:** 106 → 96 (rule-inventory). All 10 removed atoms accounted for:
7 reworded/relocated with ≥70% word survival (scored by the tool, spot-checked
by hand against `foundation-ladder.md` and `artifacts.md`), 3 scored "no home"
by the tool's exact-match check but confirmed by hand as genuine duplicates with
a named, `git show HEAD`-verified surviving line (the `/cmk:interpret` row,
the `/cmk:problem` self-row, and the `deepen-codebase` name-only-handoff
bullet — see the `--diff` output and the `grep` checks run alongside this edit
for the exact surviving lines). No gate line was touched, thinned, or moved.

**Not extracted, and why:** `## Process`, `## Analytical turn`, `## Setup`,
`## Message → output`, `## Act`, `## User ownership`, `## Disk discipline`, and
the 3-line status block are all reached on every run (or, for the Process phase
diagram specifically, are the positive-order anchor this repo lost a required
output slot over once already — see the `--diff`/worked-example rule above) and
none of their opening lines name a skip predicate. Thinning their wording further
without cutting a rule would only move words, which the reviewer's word-count
check is built to catch.

**Lint:** `lint-skill-length.py`, `lint-skill-evals.py`, `lint-skill-frontmatter.py`,
`lint-skill-templates.py`, `lint-write-handoffs.py`, `lint-context7.py` all pass
(0 exit) against the file at 245/1579, under its existing 268/1714 budget entry.
Left `scripts/skill-length-budget.json` untouched per the batch instruction —
this file's entry is ready to clear once the whole batch is committed.
