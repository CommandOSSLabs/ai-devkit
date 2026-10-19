<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# TESTS — pathfind

## 2026-09-14 — v1.0.2 wording

Rationalization row now names the invocation contract instead of the retired
always-on 1% rule. No new baseline; wording only.

## 2026-09-07 — length pass (v1.0.0 → v1.0.1)

**Before:** 248 lines / 1642 words / 98 rule atoms.
**After:** 190 lines / 1208 words / 104 atoms across 3 files (SKILL.md +
`references/pathfind-chart.md` + `references/pathfind-work.md`).

**Why extraction, not rewrap.** At 16.8 words/rule atom this file was already
one of the two tersest in the repo — there was no prose padding to tighten.
The only honest route to length was moving genuinely conditional content out,
not joining hard-wrapped lines (which would not move the word count).

**What moved.** The skill names two mutually exclusive modes up front
(`Modes: Chart (loose idea → map) · Work (map → one ticket)`) and each mode's
opening line already states its own skip predicate — Chart: "User invokes
with a loose idea (no map yet)"; Work: "User invokes with a map (URL,
number, or path)." Only one mode's procedure runs in a given session, so
each is a Conditional block per the extraction rubric:

- `## Chart` steps 1–10 and "Done when (map created)" → moved verbatim to
  `references/pathfind-chart.md`. Inline: the heading, the skip condition, and a
  one-line ordered summary of the ten steps, plus the Done-when line.
- `## Work` steps 1–7, "Done when (ticket)", `### Exit and knowns package`,
  and `### Handoff (name only — never invoke user-invoked)` → moved verbatim
  to `references/pathfind-work.md`. Inline: the heading, the skip condition, and a
  one-line summary of the flow (load → pick/claim → resolve → record →
  graduate → exit/handoff).

**What stayed inline and why.** `### The Iron Law — one HITL claim` (the
fenced CLAIM BEFORE WORK / AT MOST ONE HITL TICKET / RE-READ THE MAP block)
stayed inside `## Work` in `SKILL.md` even though the rest of Work moved —
it matches the Gate bucket (`## Iron Law` fenced block) and gates are never
moved regardless of what else in the section is conditional.
`Rationalizations` (Thought | Reality) and `Red flags` stayed inline for the
same reason. `Map body (REQUIRED slots)` stayed inline because both Chart
and Work read/write it — it is Universal, not mode-scoped.

**No deletions.** Nothing was cut as filler or duplication; every atom that
moved has exactly one surviving home, confirmed by
`skill-rule-inventory.py --diff`, which reported all atoms accounted for
except two reworded-not-removed matches (`### Exit and knowns package`,
`### Handoff (name only — never invoke user-invoked)`, both 100% distinctive
words retained since they moved verbatim).

**Anchors confirmed present, unmoved, verbatim:**
- `## The Iron Law — plan-don't-do` (line 22) — untouched; this is the
  top-level plan-don't-do gate, distinct from Work's local Iron Law.
- `### Ticket body (REQUIRED slots)` (line 61) — untouched.

**Lint results:**
- `skill-rule-inventory.py --diff`: every atom has a home, every sibling
  named, 2 reworded-not-removed (both verified 100% verbatim retention).
- `lint-skill-length.py`: 190 lines, at/under the 200-line limit; reports
  the file is ready to have its `scripts/skill-length-budget.json` entry
  cleared (left untouched per instruction — a shared ledger, cleared once
  by the reviewer after the batch).
- Remaining `scripts/lint-*.py`: no pathfind-specific failures beyond the
  expected length-budget notice above.
