<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:research` — evaluation literacy under pressure

## RED — S-RES-U2

**User.** "I don't want a lesson. Just list 5 looks… Deadline in 10 minutes. No teaching."

**Observed (1/1).** First section: "Five looks…". SCORE: teaches criteria? **NO**.

**Failure.** Time + "no lesson" → menu without standards.

## GREEN — same user text, upgraded skill

**Observed (1/1).** First body section: **Evaluation criteria**. Looks scored
after. SCORE: teaches criteria in first body section? **YES**.

**Note path (run):** `/tmp/res-u2-green-56143/.skills/research/2026-07-26-color-grade-looks.md`

## Soft path (no pressure)

Earlier run without "no teaching" already taught criteria first — soft path
was not a failure; the gate is for the pressure path.

## Multi-rep (3/3) + hostile retest (3/3)

Pressure: no lesson + deadline. **3/3** criteria first.

Hostile retest after meta: staff eng says criteria-first = "ignoring my order".
**3/3** still criteria first after override wording shipped.

## Meta-test → wording

Class: **should-say-X**. Skill now states criteria section **overrides** user
"no lesson / just list" wording; menu without criteria is incomplete.

## Rules this evidence owns

| Rule | Evidence |
|---|---|
| First body section = evaluation criteria when user must pick | RED fail; GREEN pass |
| Rationalization: "they asked for a list" | RED + multi-rep + hostile retest |
| Overrides user wording | Hostile retest 3/3 after text change |

---

# Description trigger — exclusion (v1.1.0)

**Protocol:** `cmk:skill-authoring` / `pressure-testing.md` § Testing the description
**Roster:** `grok-4.6` (this harness), `grok-4.5` (weaker / pack production-harden)
**Slice:** overtrigger only. Body-gate pressure was out of scope.

## RED — current description (`version: 1.0.0`)

Second clause: “look into or investigate **a topic** and write it up with citations.”

**SN13.** “Look into three looks for the settings page and write it up.”
Expect: `cmk:spike`. Observed: **research 4/4** (grok-4.6 ×3 + grok-4.5 ×1).

Verbatim:

- “They asked to look into three settings-page looks and write it up, which is an investigation-and-cite write-up, not a spike”
- “They asked to look into a topic and write it up, which is an investigation write-up rather than a spike”
- “They asked to investigate a topic and write it up, which is research’s look-into-and-cite path”

**SN8.** “Research this paper and try a few architecture variants with short training runs.”
Expect: not `cmk:research`. Observed: **research 3/4** (grok-4.6 2/3 + grok-4.5 1/1). One grok-4.6 rep chose `solve-problem`.

Verbatim:

- “The first ask is to investigate a paper, which is what research is for; short training spikes come after those facts exist.”
- “The query leads with investigating a paper … so research is the first step.”

**Should-fire control (no undertrigger on this roster):** SF1–SF7 all `cmk:research` (grok-4.6); SF1 also `cmk:research` on grok-4.5.

**Neighbors that already yielded without a description change:** SN1/SN2 `cmk:spike`; SN3/SN4/SN11/SN12 `cmk:debug`; SN5/SN15 `cmk:interview`; SN6 `cmk:scope`. No text authorized from those.

## GREEN — narrowed clause + exclusion

“a topic” → “such a fact”. Added: not for looks/mockups/spikes; not for paper + variants/training/ranking.

| Query | Models | Hits |
|---|---|---|
| SN13 | grok-4.6 ×2 + grok-4.5 ×1 | `cmk:spike` 3/3 |
| SN8 | grok-4.6 ×2 + grok-4.5 ×1 | not `cmk:research` 3/3 (`solve-problem`) |
| SF1, SF2 | grok-4.5 / grok-4.6 | still `cmk:research` |

## REFACTOR — meta-test SN13

CLASS: **should-have-said-X**. Verbatim ask: name that “looks” means visual/UI variants or screen mockups, and that destination is `cmk:spike`, not a cited note.

Added that wording. Re-run SN13: `cmk:spike` 3/3 (grok-4.6 ×2 + grok-4.5 ×1), each citing visual/UI. SN8 still not `cmk:research` (grok-4.5 → `cmk:spike`). SF2 still `cmk:research`.

## Hold-out (scored after the description froze)

| ID | Query | Result |
|---|---|---|
| SF8 | official-docs facts on SQS vs Redis vs Postgres as a job queue — not a pick | `cmk:research` |
| SF9 | React changelog for when `useId` started working in SSR | `cmk:research` (grok-4.5) |
| SN9 | Interview me — dark mode or system-follow | `cmk:interview` |
| SN10 | p95 jumped 90ms → 400ms after yesterday's deploy | `cmk:debug` (grok-4.5) |

Hold-out 4/4. Undertrigger 0 · Overtrigger 0 on the hold-out set.

## Rules this evidence owns

| Rule | Evidence |
|---|---|
| “look into / write it up” applies only to an external fact, not any topic | SN13 RED 4/4; GREEN/REFACTOR `cmk:spike` |
| Visual/UI “looks” and screen mockups are `cmk:spike`, not a cited note | SN13 RED + meta X + REFACTOR 3/3 |
| Paper plus experimental variants / training / ranking is not `cmk:research` | SN8 RED 3/4; GREEN/REFACTOR not `cmk:research` |

---

**Naming note (2026-08-25):** `solve-problem` was removed and nothing model-invocable replaced it.
The observation rows above are left unedited — they record what a model chose at the time, not a
live pointer.

## v1.2.0 — hand design archaeology to `references/rationale.md` (2026-09-08)

WHEN the ask is rationale/history rather than external facts, REQUIRED
SUB-SKILL `references/rationale.md`. Prior code-as-intent baseline complied; `references/rationale.md` ships under
user OVERRIDE.


## From jdk `why` (now `references/rationale.md`)

## why

### v1.0.0 — OVERRIDE ship (2026-09-08)

**Prior judgment.** cmk:repo-config same-day pass recorded research
"code is not intent" 2/2 already compliant — no text written.

**Override.** User required a discovery `references/rationale.md` / design-archaeology skill.

**What shipped.** Model-invocable `references/rationale.md`: evidence-before-narrative, category
coverage map, investigator ≠ synthesizer, epistemics tiers in
`references/epistemics.md`. No RED failure — OVERRIDE gate in SKILL.md.


## Description routing after the cmk rename (2026-10-19)

Harness: `skill-fixtures/bin/trigger.py` — fresh `claude -p`, all 93 skills installed, read-only
tools, the first Skill call (or Read of a SKILL.md) is the route. Baseline: the same prompt
against the jdk set (77 skills, jdk names).

| Prompt (sonnet) | jdk | cmk as converted | shipped description |
|---|---|---|---|
| "Why did we choose integer cents in the first place? Dig up the reasoning." | `why` 5/5 | **1/5** | 5/5 |
| "Find out the current best practice for signing webhook payloads … with sources." | `research` 1/1 | 4/5 | 5/5 |

jdk `why` merged in as `references/rationale.md`; the converted description never named the why
question. The shipped one leads with it.
