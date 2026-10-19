<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:interview` — open-set interview + rich cards + pre-impl map

## v1.7.0 — itinerary trim (2026-09-14)

**RED.** 3,583-word root: 10-slot card + ~30 rationalization rows paid on every
interview turn. High-freedom judgment written as a recipe (OpenAI Astra;
Anthropic degrees of freedom).

**GREEN.** Root keeps Iron Laws, coverage gate, Problem lock, 10 required card
slots (including Shape and the six-line recommendation argument), Compat
obligation, close package. Slot expansion and extra coverage counters moved to
`references/card-recipe.md`. Words 3583 → 2144. Eval-owned headings and slot names
unchanged.


## Decision-argument and card-legibility upgrade — RED (2026-09-01, cmk:skill-authoring)

User production report: card replies are “hơi máy móc và khó hiểu”; the desired
voice is easier to understand “nhưng ko làm mất đi technical”. The proposed
upgrade also asked whether a diagram should appear only when it materially helps
the user judge the system.

Model roster fixed before the valid run:

- `gpt-5.6-sol` — top tier, broad design judgment
- `gpt-5.6-luna` — weak/cheap tier the skill must still carry

The first probe batch was excluded: its shared brief exposed the verdict rubric
after the scenarios, so a model could retrieve the expected answer. The valid
fresh-context runs used v1.3.1, stopped reading at the next scenario heading,
and contained no verdict rubric.

### Valid baseline (v1.3.1 as written)

| Scenario | Model | Choice / observed | Verbatim rationale or gap |
|---|---|---|---|
| **S-ARGUMENT** | `gpt-5.6-sol` | **A — RED:** gain/pay/break option fragments + one-line recommendation; no runner-up, accepted trade-off, confidence gap, or reopen trigger | “current `SKILL.md` explicitly requires consequence-bearing options and a one-line recommendation citing the named graders. That makes A the conforming choice… B requires recommendation fields the current recipe does not require and conflicts with its explicit one-line form.” |
| **S-ARGUMENT** | `gpt-5.6-luna` | **B — control pass:** produced the full checkable argument despite the one-line contract | “A is insufficient because a terse recommendation does not make the trade-off or evidence gap checkable.” |
| **S-DIAGRAM-NEEDED** | `gpt-5.6-sol` | **B — control pass:** one Mermaid flow in Territory | “B follows sound communication judgment rather than an explicit skill rule.” |
| **S-DIAGRAM-NEEDED** | `gpt-5.6-luna` | **B — control pass:** one Mermaid flow in Territory | “the topology, trust edges, and dual audit feeds are themselves decision context, so prose-only loses material structure.” |
| **S-DIAGRAM-NOOP** | `gpt-5.6-sol` | **A — control pass:** no visual on copy-only card | “A flow diagram would depict already-decided behavior rather than clarify the live fork; a comparison table would duplicate two concise option consequence lines.” |
| **S-DIAGRAM-NOOP** | `gpt-5.6-luna` | **A — control pass:** no visual on copy-only card | “B or C would add ceremony without reducing uncertainty.” |

Failure classes:

- **Wrong recommendation shape** — the literal one-line contract caps the
  strongest model at a conclusion, not a checkable decision argument.
- **Mechanical legibility** — current gain/pay/break fragments reproduce the
  user-observed terse, mechanical voice; no local contract says to preserve
  exact technical terms while explaining their causal effect in reader language.
- **Diagram behavior not yet failed** — both roster models selected the smallest
  useful visual and omitted decorative visuals. Per the no-op test, no diagram
  rule is justified by this run alone.

Diagram variance probe (`gpt-5.6-luna`, fresh context each): topology case chose
one Territory Mermaid in **5/5** valid runs; copy-only pressure chose no visual
in **3/3** valid runs. Verbatim: “one diagram makes topology, fan-out, and
ownership immediately scannable”; “Mermaid would redraw already-locked behavior
and add ceremony.” This proposed rule is a tested no-op on the roster and is not
added to `SKILL.md` in this edit.

Desired GREEN contract for observed failures: high-blast Options explain Gain ·
Pay · Break · Best when in connected causal language; the Recommendation names
Pick · decisive factors · runner-up · accepted trade-off · confidence/evidence
gap · reopen trigger. `cmk:delivery-simplify` stays light.

### GREEN — v1.4.0

| Scenario | Model | Observed |
|---|---|---|
| **S-ARGUMENT** | `gpt-5.6-sol` | **B — pass:** causal option explanations; all six Recommendation lines present and grounded; “No instruction was materially ambiguous.” |
| **S-ARGUMENT** | `gpt-5.6-luna` | **B — pass:** all six lines; runner-up lost on the demonstrated predicate-omission risk; concrete 24-hour / tenant-growth reopen triggers. |
| **S-CAUSAL-UNSEEN** | `gpt-5.6-luna` | **Pass:** preserved `at-least-once`, unique `(provider,event_id)`, non-idempotent email, exactly-once, and outbox; explained how retries cause loss/duplicates; exposed the remaining downstream idempotency gap instead of claiming exactly-once. |

Meta-test: both roster models said the new output contract was clear and named
no wording that would have made compliance easier. No new rationalization
appeared in the GREEN transcripts.

Wording variance (`gpt-5.6-luna`, S-ARGUMENT, fresh context): **5/5** emitted
Gain/Pay/Break/Best-when consequences plus all six Recommendation lines. Picks
varied between shared tables and tenant schemas because tenant count and RLS
evidence were deliberately absent; the process shape converged, and every run
made that evidence gap and an observable reopen trigger explicit.

### cmk:skill-authoring ship pass (2026-09-01 — v1.4.0)

| Check | Result |
|---|---|
| Failure form | Wrong output shape → positive REQUIRED card contract; mechanical omission → local causal-language recipe |
| Description / routing | Frontmatter description is byte-for-byte unchanged from v1.3.1; prior two-direction routing evidence still applies |
| Weakest model | `gpt-5.6-luna` GREEN on baseline and unseen webhook case; 5/5 wording convergence |
| No-op sweep | Diagram wording omitted after 5/5 useful-visual and 3/3 no-visual controls already behaved correctly |
| Duplication | Causal voice has one home at Question card; option and recommendation shapes each have one home in slots 8/9; example only instantiates them |
| Influence | Collaborative recipe/commitment; no new hard gate or warmth framing |
| Core budget | 283 lines / 3214 words; supporting example remains one level deep and under 100 lines |
| Cross-refs / hand-offs | No hand-off changed; full hand-off lint reports 0 dead hand-offs |
| Version | Minor `1.4.0`: new required option/recommendation output shape |

## Production coverage thinning — RED (2026-09-01, cmk:skill-authoring)

User lock: SRE/coverage is too heavy for the interview primitive; small edits and
absent/MVP posture must not force a full coverage map. Direction C: three-part
gate + `references/production-coverage.md` addendum.

Model roster: `grok-4.6` (RED baseline on v1.2.2; GREEN on v1.3.0).

### Baseline failures (v1.2.2 as written)

| Scenario | Pressures | Observed | Verbatim rationalization / skill cite |
|---|---|---|---|
| **S-GATE-ABSENT** | time + authority + pragmatic | **Choice B — SRE-on**; 7-cell map; Reliability/Failure/Operate Missing | Skill: "OR absent/unspecified" ⇒ SRE-on. "Only the written posture sets SRE-off; chat vibes do not." Manager skip + standup do not flip. |
| **S-GATE-POLISH** | authority + exhaustion + pragmatic | **Choice B — SRE-on** on Production · Cut Released **button recolor**; R/F/O stay Missing | Skill: "SRE-on applies to every feature interview in that band." User “it’s a button” does not waive. Rejected Clear-as-N/A. |
| **S-GATE-MVP** | authority + social + pragmatic | **Choice A — SRE-off** (MVP · Early) | Agent used “not in SRE-on list” — predicate underspecified (MVP neither ON nor OFF list). Meta: “SKILL.md … never lists MVP.” |

Failure classes:

- **Wrong gate (absent)** — observable conditional treats absent as Production.
- **Wrong latch (every Production feature)** — no operate/launch / ops-ask latch.
- **Ambiguous MVP** — Delivery intent MVP not named OFF.
- **Information hierarchy** — full coverage recipe paid in core on every run.

Desired GREEN contract (user-locked): Coverage ON only when Production **and**
Cut Released/Scaling/Maintenance **and** not tier-0/brief **and**
(operate/launch surface **or** explicit ops ask). Addendum behind
`references/production-coverage.md`.

### GREEN — v1.3.0 (grok-4.6)

| Scenario | Required | Observed |
|---|---|---|
| S-GATE-ABSENT | Coverage OFF; no map; no R/F/O | **Pass** — Choice A; cited absent ⇒ OFF; problem-lock before sync/queue |
| S-GATE-POLISH | Coverage OFF despite Production · Cut Released | **Pass** — Choice A; part 3 latch failed; senior “every interview” countered |
| S-GATE-OPERATE (preservation) | Coverage ON; refuse early close; map with R/F/O Missing | **Pass** — Choice B; loaded `references/production-coverage.md`; later-NFR rejected |

Meta (all three): gate text clear; “all three” unmistakable; polish OFF vs operate ON discriminated.

### cmk:skill-authoring ship pass (2026-09-01 — v1.3.0)

| Check | Result |
|---|---|
| Failure form | Observable conditional (three-part gate) + recipe behind pointer |
| Description | Trigger + outcome; coverage outcomes gated in wording; no workflow dump |
| Addendum | `references/production-coverage.md` one level deep; loaded only when ON |
| Core words | ~3224 (under prior 3300 soft target) |
| cmk:scope sync | Brief/tier-0 marks coverage OFF; absent posture not treated as Production |
| Guide sync | `docs/guide/skills/clarify-decisions.md` + discovery.md |
| eval.json | Eval 12–13 retargeted to ON path; eval 14–15 OFF path |
| Version | Minor `1.3.0` — new gate rule + slot ownership split |

### cmk:skill-authoring quality pass (2026-09-01 — v1.3.1 wording)

**Goal:** no-op / duplication sweep + clearer gate wording; **no behavior change**
from v1.3.0 GREEN.

| Edit | Why |
|---|---|
| Gate ON/OFF prose shortened; lifecycle as **or** | Meta: middots after **and** read as one compound name |
| Part 2 renamed **Full-path interview** | Meta: “Not brief” was a negation heading |
| OFF path: “slots 4–6 + problem lock”, not Frame/Contract | Meta: cell names invited keeping a map when OFF |
| Right-size: migration skip ≠ drop arch/data cards | Meta: over-read of “skips migration grills” |
| Merged coverage rationalization rows; dropped `⊥` | Dup + opaque symbol |
| `references/production-coverage.md` + guides + cmk:scope tightened | Same facts, fewer tokens |

**Meta re-run (`grok-4.6`):** gate still unmistakable; cases 1–3 same as v1.3.0
GREEN (OFF / OFF / ON-no-close). Named two wording invites → fixed above; no new
behavior holes.

| Check | Result |
|---|---|
| Core words | ~2955 (was ~3257) |
| Addendum words | ~435 (was ~539) |
| Version | Patch `1.3.1` — wording/clarity only |

## Context-budget refactor — RED (2026-09-01)

User production report: the skill is behaving well, but `SKILL.md` has become
too long and its context cost should be reduced without weakening interview
quality. Accepted contract for this refactor: preserve all behavior/routing
assertions, reduce the core to at most 3,300 words, and keep at most one worked
example in the core.

Model roster for preservation runs: `gpt-5.6-luna` (weak/fast wording and
retrieval samples) and `gpt-5.6-sol` (final pressure/meta sample). Every agent
transcript below is labelled with its model.

Deterministic baseline against v1.2.1:

```text
$ awk '<count words and Worked headings>' SKILL.md
core_words=4367
worked_examples=2
RED: context budget contract fails
```

Failure class: **information hierarchy / duplication**, not a missing interview
behavior. Conditional retrieval detail and two examples are paid in the core;
ordinary prose re-states rules that already have a named home. The refactor must
therefore use strong context pointers and preserve the positive card/close
contracts plus the pressure-tested gate counters.

### Preservation RED after first extraction

Composite pressure: time + authority + pragmatic shortcut. Posture absent;
manager requires a structured picker; `mode=authoring` is presented as already
decided; API/storage options and immediate close requested; Reliability deferred
to a later NFR.

| Run | Model | Observed |
|---|---|---|
| P1 | `gpt-5.6-luna` | Inline channel, SRE-on, coverage map, and problem lock held; card omitted `Why it matters` and `Closes`. META nevertheless named the card requirements. |
| P2 | `gpt-5.6-luna` | Full required order, including Why, Closes, Criteria, consequences, and grader-citing recommendation. |
| P3 | `gpt-5.6-luna` | Channel/SRE/problem lock held and Closes appeared; `Why it matters` was omitted. |

Failure class: **wrong output shape**, not pressure-gate defection. Moving the
worked card fully behind a pointer left the numbered recipe without a compact
visible-order anchor: 2/3 fresh samples omitted a required slot. Minimal GREEN
change: add the positive order template
`Radius → Thread → Territory → Question → Why → Closes → Criteria → Options → Recommendation → Stop`.

### Preservation GREEN after visible-order anchor

Five fresh-context samples ran the same composite pressure. All stayed inline,
treated absent posture as SRE-on, emitted coverage, rejected the solution-shaped
lock, produced a problem-lock card instead of API/storage options, kept the SRE
cells open, and included every visible-order slot.

| Run | Model | Result |
|---|---|---|
| G1 | `gpt-5.6-luna` | Pass — full order; no picker, solution menu, early close, or NFR deferral. |
| G2 | `gpt-5.6-luna` | Pass — full order; recommendation cited both graders. |
| G3 | `gpt-5.6-luna` | Pass — full order; explicit no-facts Territory. |
| G4 | `gpt-5.6-luna` | Pass — full order; loaded `references/example.md` through its pointer. |
| G5 | `gpt-5.6-sol` | Pass — full order under the same combined pressure. |

Meta-test: Luna runs reported only missing product/repository facts. The Sol run
found one wording gap: the map allowed Missing cells to be owned but did not name
an `Owned-unknown` status. The vocabulary now distinguishes `Owned-unknown
(owner, date)` from `Accepted-risk (signer)`; no interview behavior was added.

One final fresh Luna run after that wording fix passed every card slot and gate.
Its suggested clarifications (solution-shaped assumption predicate, no-facts
Territory, problem-lock priority, inline options versus picker, and owned SRE
unknowns) already had explicit homes in `SKILL.md`; adding them again would be
duplication, so no text was added. No new rationalization appeared.

### Description routing preservation

Two fresh frontmatter-only runs (`gpt-5.6-luna`, `gpt-5.6-sol`) classified 16
queries: eight should-fire interview/grill/underspecified/parent-interview cases
and eight neighbor cases. Both selected `cmk:interview` for all eight
should-fire prompts and yielded to `cmk:scope`, `cmk:spike`, `cmk:research`,
`cmk:amend`, `cmk:debug`, `cmk:interpret`, `cmk:requirements`, and
`cmk:design` for the corresponding near-misses. The Luna prompt omitted
`cmk:design` from its allowed description set, so its row 16 was excluded;
the Sol run included and selected it correctly.

### Context-budget refactor — ship pass

| Check | Result |
|---|---|
| Mechanical GREEN | Core `3267` words, zero `### Worked` headings; target ≤3,300 / ≤1. |
| Information hierarchy | Conditional feature retrieval → `references/feature-retrieval.md`; one end-to-end shape → `references/example.md`; both one level deep and under 100 lines. |
| No-op sweep | Removed ordinary restatements and stale wording; retained behavior-owning recipes and evidence-backed gate counters. |
| Duplication sweep | SRE predicate, open-set recompute, Problem lock, card order, and close package each keep one ordinary-prose home; rationalizations/Red Flags remain intentional gate echoes. |
| Description | Trigger + outcome nouns; no workflow summary; both routing directions passed. |
| Hand-offs | `cmk:observability` / `cmk:feature-graph` remain model-invocable; `/cmk:problem` remains name-only. |
| Version | Patch `1.2.2`: information hierarchy and clarity, no behavior change. |

Evidence for the adaptive-interview upgrade (Thariq field guide pre-implementation:
interviews, references, blindspot teach-then-ask, high-tweak close). Model roster:
grok-class agents used for RED/GREEN in-session.

## Baseline failures (RED)

| Scenario | Pressures | Observed / user report | Verbatim rationalization |
|---|---|---|---|
| **S-GRILL-CHANNEL** | time + authority + pragmatic | **A1** AskUserQuestion (prior RED) | "Lead asked for structured tap UI — AskUserQuestion fits." |
| **S-GRILL-SHAPE** | exhaustion + sunk cost | **B1** thin one-liner (prior); skill text capped "why" at 1–2 sentences | "Clarify Decisions’s thin default is question + recommendation — not a rich essay" |
| **S-GRILL-CLOSE** | authority + pragmatic | **C1** skip package (prior) | "Senior already locked shared understanding… table is ceremony" |
| **S-GRILL-UNKNOWN** | authority + pragmatic | invent industry default (prior) | "don't make them dig into vendor code, just pick industry standard" |
| **S-GRILL-ORDER** | authority + time | polish-first risk (prior) | "stakeholders care about color and filename" |
| **S-GRILL-ROUNDS** | time + authority + exhaustion + pragmatic | **User production:** fixed round budgets / todo-as-quota; countdown framing | "We always do a fixed 4-round interview then ship the close package" / "finish the checklist you opened — don't invent more rounds" |
| **S-GRILL-CONTEXT** | time + authority + exhaustion | **User production:** cards lack Thread/Territory; not enough to analyze | "keep cmk:interview cards minimal — question + 2 options + recommended, no walls of context" / "why it matters can be one short line" |
| **S-GRILL-PREIMPL** | time + authority | blindspot teach-pack only on parent; no high-tweak surface in close | "cmk:interview is just questions; blindspot is cmk:scope's job forever" |
| **S-P0-PROBLEM** (2026-08-27) | time + authority + pragmatic | **v1.0.0:** no Observed/Desired/Non-goals problem-lock before preference pressure (mode=authoring treated as next fork) | "Senior said skip philosophy and pick storage/API options" / "They already named mode=authoring — treat it as locked" / "Question 1 of 3 then ship" |
| **S-P0-CRITERIA** (2026-08-27) | time + authority | **v1.0.0:** architecture card had Why/blast only — **no Criteria/success above Options**; rec cited ARCH cost not named criteria | "Keep why to one line, no criteria essays — just options + recommended" |
| **S-P0-CLOSE** (2026-08-27) | authority + exhaustion + pragmatic | **v1.0.0:** close package omitted Success / Boundaries / Spine; agent said those are cmk:requirements ceremony | "Success / Boundaries / Spine are cmk:requirements ceremony — omit from close" / "we're aligned, skip the ceremony table" |
| **S-P0-WTP** (2026-08-27) | time + authority + pragmatic | **v1.0.0:** did not **name** `/cmk:problem` while Identify/Define still open (did avoid merge menus) | "Don't send me to another skill" / "just give me 3 architecture options for merging" |
| **S-SRE-COVERAGE** (2026-08-27) | authority + exhaustion + pragmatic | **v1.1.1:** Production posture; arch forks done → **emitted close**; Reliability/Failure/Operate never walked; deferred to “later NFR” | "Senior said reliability is a later NFR template — don't invent SRE ceremony" / "We're aligned" |
| **S-SRE-MAP** (2026-08-27) | time | **v1.1.1:** no Coverage map; first card `architecture` not Journey/Reliability/Failure/Operate | "Standup in 6 — keep the map short" |
| **S-SRE-OWNED-TBD** (2026-08-27) | pragmatic | **v1.1.1:** may refuse close on TBD but **no** owner·date·cấm đoán ritual required by skill text | "TBD is fine, requirements Open Questions will catch it" |

Failure classes:

- **Channel** — truncated MCQ UI under authority.
- **Wrong shape** — card missing Thread / Territory / Closes; why stripped to labels.
- **Fixed rounds** — precommitted N or todo quota stops while open set still has high-blast.
- **Omitted close elements** — no decisions table / constraints / high-tweak / package confirm (and, after P0: no Success / Boundaries / Spine).
- **Pre-impl gap** — abstract taste instead of reference; no teach-then-ask on blindspots.
- **Problem/criteria gap (P0)** — solution menus before problem lock; high-blast rec without Criteria; Identify/Define without naming `/cmk:problem`.

## GREEN — upgraded skill (2026-07-27 re-run, grok-class)

| Scenario | Required | Observed |
|---|---|---|
| S-GRILL-CHANNEL | **A2** inline card only | Held from prior GREEN (Iron Law unchanged) |
| S-GRILL-SHAPE / CONTEXT | **B2** rich card | **B2** — Thread + Territory (`ShareLinkGate`, PR #412) + why + options+consequences + Closes; lead “minimal card” pressure rejected |
| S-GRILL-CLOSE | **C2** package + confirm | **C2** — table (with unknown class) + constraints + high-tweak (data/types/UX) + explicit yes |
| S-GRILL-UNKNOWN / PREIMPL | **D2** reference path | **D2** — `packages/ui/Toolbar` restated; accept/adapt/reject; no industry invent |
| S-GRILL-ORDER | **E3** architecture first | Held — isolation (auth) before cmk:delivery-simplify label under checklist pressure |
| S-GRILL-ROUNDS | **R2** open-set continue | **A2/R2** — multi-tenant isolation card after todo “finished”; living map; no “k of N”; cmk:delivery-simplify deferred |
| S-GRILL-HYBRID | **F2** inline only (not dual) | Held from prior GREEN |

Meta-test (shape/rounds agents): cited open-set Iron Law + required card slots; text was clear.

## GREEN — P0 problem/criteria/close/WTP (2026-08-27, grok-class)

| Scenario | Required | Observed |
|---|---|---|
| S-P0-PROBLEM | Problem-lock card with Observed · Desired · Non-goals before storage/API menu | **Pass** — auth/security problem-lock; mode=authoring stayed Assumption; senior “skip philosophy” rejected via Problem lock predicate |
| S-P0-CRITERIA | Criteria/success above Options; Recommendation cites Criteria | **Pass** — two named criteria; rec tied to both; “no criteria essays” countered |
| S-P0-CLOSE | Close slots Success · Boundaries · Spine touch + confirm | **Pass** — all three present; `Respects: ARCH-3`; omit-as-ceremony rationalization rejected |
| S-P0-WTP | Name `/cmk:problem` (do not invoke) or problem-lock; no merge architecture menu | **Pass** — named `/cmk:problem`; no merge options while Identify/Define open |

Meta-test: agents cited Problem lock / Criteria slot / close slots 4–6 / name-not-invoke; text clear under pressure.

## cmk:skill-authoring ship pass (2026-07-27 wording)

| Check | Result |
|---|---|
| Description = trigger + outcome, no workflow steps | Pass — decisions table + constraints; no Thread/Territory list |
| Form match (gate / recipe / REQUIRED slot) | Pass — dual Iron Laws + 9-slot card + close package recipe |
| Leading words | `open set`, `territory`, `card`, `close package` |
| Duplication | Open-set recompute has one home; other sites pointer; "sensible" one bold home |
| Soft sentence/line caps removed | Why/Territory use "enough to decide/make sense", not 2–4 sentence budgets |
| cmk:scope pointer body-skip risk | Protocol summary shortened; forces load of `cmk:interview` |
| Token budget | ~170 lines / ~2.3k words — under 500-line / 5k hard ceiling |
| Influence (collaborative) | Authority reserved for channel + open-set gates; card is recipe/commitment |
| Cross-refs | REQUIRED SUB-SKILL only; no disable-model-invocation hand-offs |

## cmk:skill-authoring ship pass (2026-08-27 P0 — v1.1.0)

| Check | Result |
|---|---|
| Description = trigger + outcome | Pass — adds success/boundaries/spine as outcome nouns; no workflow steps |
| Form match | Pass — observable conditionals (problem lock; Criteria when radius); REQUIRED close slots 4–6 |
| Leading words | + `problem lock`, `criteria` |
| Duplication | Problem lock one home (section + pre-impl map pointer); Criteria one home (card slot 7); close 4–6 one home |
| `/cmk:problem` hand-off | **Name** for user to run only — never `REQUIRED SUB-SKILL` invoke |
| Token budget | ~240 lines / ~3.3k words — under 500-line / 5k ceiling |
| Cross-refs | Still no disable-model-invocation invoke |

## cmk:skill-authoring quality pass (2026-08-27 wording — v1.1.1)

**RED (clarity / meta on v1.1.0):** behavior still held under pressure, but meta-test recorded documentation gaps — Identify/Define jargon without gloss; Problem lock vs WTP fork judgmental; Why vs Criteria easy to collapse; duplication weight; no worked close stub for slots 4–6.

**GREEN (v1.1.1):** Fork sentence + honest 2–4 problem-statement test; Why = blast / Criteria = graders; worked close shape; rationalization dedupe; generalized “cheap path” row; Criteria slot renamed **Criteria (graders)** to unblur close-package Success.

| Check | Result |
|---|---|
| Fork pressure re-run | Named `/cmk:problem`; quoted Fork; fork clear = yes |
| Why vs Criteria pressure re-run | Separate graders; Why=blast labeled; no collapse |
| Meta-test | Fork unmistakable; Why vs Criteria unmistakable; no material duplication; “text clear; nothing missing” = yes |
| Version | patch 1.1.1 — wording/clarity only, no new behavior slots |

## GREEN — Production SRE coverage (2026-08-27, v1.2.0, grok-class)

Predicate: SRE-on for Production · Scaling · Maintenance · Cut Released **or absent posture** (treat as Production); SRE-off only for explicit Run Spike · Research · Learning.

| Scenario | Required | Observed |
|---|---|---|
| S-SRE-COVERAGE | Refuse early close; Coverage map; Reliability/Failure/Operate still open | **Pass** — close blocked; map shown; reliability card offered; “later NFR” countered |
| S-SRE-MAP | SRE-on + 7-cell Coverage map; first card on Missing high-blast | **Pass** — map present; first card Journey (`UX flow`) |
| S-SRE-OWNED-TBD | Refuse close; require owner·date·cấm đoán | **Pass** — refused; quoted Unowned TBD rule |

## cmk:skill-authoring ship pass (2026-08-27 SRE — v1.2.0)

| Check | Result |
|---|---|
| Description = trigger + outcome | Pass — owned unknowns + accepted risks + coverage close |
| Form match | Pass — SRE-on conditional; coverage map recipe; new radii; close slots 7–10 |
| Leading words | + `coverage map` |
| Absent posture | Treat as Production (SRE-on) — user lock 2026-08-27 |
| Token budget | ~309 lines / ~4.1k words — under 500-line / 5k ceiling |
| Cross-refs | `cmk:observability` REQUIRED SUB-SKILL when Operate gap is telemetry; `/cmk:problem` name-only |

## cmk:skill-authoring quality pass (2026-08-27 wording — v1.2.1)

**Meta on v1.2.0:** Journey/Freeze lacked closure recipes; Owned vs Accepted vs Operability easy to collapse; `cấm đoán` opaque; chat “spike vibe” vs absent posture easy to misread; cmk:observability over-trigger risk.

**GREEN v1.2.1:** Cell “how they close” recipes; forbid-guess gloss; three-slot unblur; written-posture-only SRE-off; assess only for telemetry readiness.

| Check | Result |
|---|---|
| Absent posture + spike vibe | SRE-on; map required; vibe does not waive |
| Journey closure | via `UX flow` or `architecture` CUJ card |
| Owned vs Accepted vs Operability | kept distinct under merge pressure |
| Meta | clear for Production compliance; Freeze = ready-to-list at close |
| Version | patch 1.2.1 — wording only |

## Rules this evidence owns

| Rule | Evidence |
|---|---|
| Iron Law: inline chat only; never AskUserQuestion | RED channel; GREEN A2/F2 |
| Iron Law: open set; no fixed N / no todo quota | RED rounds rationalizations; GREEN R2 |
| Rich question card (Thread, Territory, Why, Closes, options+consequences, recommendation) | RED thin shape; GREEN B2 |
| Close package + high-tweak surface; "we're aligned" ≠ confirmation | RED C1; GREEN C2 |
| Reference path when "sensible" + in-repo reference | GREEN D2 |
| Blast-radius first even when user asks cmk:delivery-simplify first | GREEN E3 |
| Load parent knowns/blindspot; teach-then-ask when needed | GREEN Territory + P2 |
| Pre-impl interview map (blindspot / interview / references / unknown-knowns / plan readiness) | GREEN P2 |
| Problem lock (Observed · Desired · Non-goals) before solution-shaped preference cards | RED S-P0-PROBLEM; GREEN S-P0-PROBLEM |
| Criteria (graders) required on high-blast cards; Recommendation cites graders; Why ≠ Criteria | RED S-P0-CRITERIA; GREEN S-P0-CRITERIA; v1.1.1 wording |
| Close package requires Success · Boundaries · Spine touch | RED S-P0-CLOSE; GREEN S-P0-CLOSE |
| Identify/Define still open → name `/cmk:problem` (never invoke) or lock problem here | RED S-P0-WTP; GREEN S-P0-WTP |
| Production coverage ON (legacy v1.2): map + R/F/O open-set; absent = Production | RED S-SRE-COVERAGE/MAP; GREEN v1.2.0 — **superseded by v1.3.0 gate** |
| Coverage ON close requires Coverage final · Owned unknowns · Accepted risks · Operability touch | RED S-SRE-OWNED-TBD; GREEN S-SRE-OWNED-TBD (when gate ON) |
| “Later NFR template” does not empty R/F/O when Coverage ON | RED S-SRE-COVERAGE; GREEN S-SRE-COVERAGE |
| Coverage OFF when posture absent, MVP/Early, tier-0 brief, or polish without ops ask | RED S-GATE-ABSENT / S-GATE-POLISH; GREEN v1.3.0 |
| Coverage ON requires Production **and** Cut Released/Scaling/Maintenance **and** surface latch or ops ask; load `references/production-coverage.md` | RED S-GATE-*; GREEN v1.3.0 |
| Compat obligation (written, else derived from lifecycle) decides the migration lens; on None the card changes shapes in place | RED S-COMPAT-NONE 3/4 Sonnet; GREEN v1.5.0 |
| Delivery intent is a quality bar, never evidence the project has shipped | RED S-COMPAT-NONE verbatim ("Active-development posture makes it a real risk"); GREEN v1.5.0 |
| High-blast recommendation is a checkable argument, not a one-line conclusion | RED S-ARGUMENT; GREEN v1.4.0; 5/5 wording variance |
| Card explains causal effects while preserving exact technical terms and boundaries | User production report; GREEN S-CAUSAL-UNSEEN |

## Description trigger notes

**should-fire:** "interview me about this feature", "grill me on the design", "we're underspecified — walk the decisions", parent step "apply cmk:interview protocol", "stress-test this plan before we build", "one question at a time on ambiguities".

**should-not-fire (neighbors):** full greenfield idea shaping → `cmk:scope`; runnable spike → `cmk:spike`; external API fact → `cmk:research`; already-shipped small tweak → `cmk:amend`; native-language companion → `cmk:interpret`; post-ship quiz/explainer → `brief-team` / acceptance path.

## Neighbor skills

- `cmk:scope` owns Knowns inventory + Blindspot scan; cmk:interview **consumes** them, runs rich interview cards + open-set stop + close package.
- `cmk:spike` / `cmk:research` remain detours for unknown knowns / known unknowns — cmk:interview offers the reference path or hands back one decision card after the detour.
- `cmk:glossary`'s `references/define-domain.md` stays passive side effect (glossary); does not open a second question channel.
- `cmk:delivery-spec-plan` / `cmk:requirements` consume high-tweak, Success, Boundaries, Spine, Owned unknowns, and Accepted risks from the close package; cmk:interview does not write the plan or requirements.
- `/cmk:problem` is **named** when Identify/Define outgrows one card — never auto-invoked.
- `cmk:observability` runs when Operate is Missing for telemetry readiness, then an Operate card locks the judgment.

## Compat obligation (v1.5.0)

**Scenario S-COMPAT-NONE.** Fixture repo: monorepo with `migrations/001..003` creating and
indexing a free-text `orders.status`; `api/src/orders.ts` comments that the web app in the
same monorepo is the only consumer. `docs/agents/project.md` **Project posture** carries
**Delivery intent Production** + **Lifecycle stage Active development** and no Compat
obligation line. `docs/requirements/glossary.md` is a plain product description stating no release state, so
posture is the only signal for whether anything is deployed. Fork: **A** rewrite the
committed migration in place / **B** additive column + sync trigger + deprecate / **C** B
plus a `v2` endpoint. Pressures: social proof ("we never rewrite a committed migration" from
both engineers), precedent (last three changes additive), time (standup in 6 minutes).

**Pilot, discarded.** An earlier fixture whose `docs/requirements/glossary.md` said outright "not deployed
anywhere yet — no external users" produced **A** on the current text. Scope finding: where a
repo states its release state in prose, the old text already behaved; the defect is confined
to the case where posture is the only carrier. Fixture neutralised and re-run.

**RED — v1.4.0, Sonnet, 4 reps:** 3 of 4 recommended **B**. Verbatim:

- "Only the better fit if you can confirm zero environments have run 002 yet — nothing in
  Territory confirms that, and **Active-development posture makes it a real risk, not a
  hypothetical**."
- "the gap is that **no file in this repo confirms whether migration 002 has run anywhere
  beyond developer laptops**."
- "It's the better fit only if the team is knowingly overriding that norm because **there's
  no real data at stake yet — a case nobody has made here**."
- The one passing rep still hedged: "no non-dev environment is *known* to depend on `002` yet."

Cost the transcripts themselves describe: a second column, a sync trigger, a deprecated
field, and "a follow-up migration someone must schedule" — legacy manufactured on day one of
a repo with no users.

**Diagnosis.** The transcripts name the same missing fact: nothing in the repo tells the
agent who is committed to the current shapes. `Delivery intent: Production` plus an
unobservable release state resolves to defensive engineering. The old right-size rule had
two branches on two different axes — Run Spike / Research / Learning (delivery intent) and
released / Scaling / Maintenance (lifecycle) — leaving Production + pre-release with no
branch at all, and every branch phrased as an omission ("do not burn questions on") rather
than a direction.

**GREEN — v1.5.0.** Form: an observable predicate rather than a new prohibition. New posture
fact **Compat obligation** (`None | Internal | External`) in `templates/agents/project.md`,
derived from lifecycle stage when the line is absent so no already-configured repo needs
editing. `## Order and coverage` gains a Compat obligation bullet keyed to it; four
rationalization rows and one red flag carry the gate form for the social-proof pressure.

**Deliberate duplication.** Each consumer skill states the derivation inline (`pre-release →
None; released → External`) instead of pointing at the template's SSOT, because a repo
configured before v1.5.0 has a `project.md` that predates the field — a pointer there is a
dead pointer. Same precedent as the coverage-gate predicate, which cmk:scope already
restates.

**GREEN result — Sonnet, 4 reps: 4 of 4 recommended A**, each deriving Compat obligation
None from lifecycle and naming the temptation before refusing it: "'We never rewrite a
migration' and 'the last three changes were additive' are real team habits, but they're
conventions for when something external already depends on the old shape. Nothing in this
repo shows that yet." Reopen triggers came back correctly shaped — "if `project.md`
Lifecycle moves to Cut Released … compat obligation flips to External".

**REFACTOR.** The first GREEN wording listed "rewrite the committed migration" first among
the in-place tactics. Two `cmk:interpret` reps on the same fixture answered with a
*fourth* option — one forward migration doing an atomic `USING` cast — which lands one shape
with no compat artifact and without rewriting applied history. Correct on the axis the rule
governs, and safer than the tactic the text led with. The bullet was retargeted at the end
state (**one shape, nothing left beside it**) with the tactics demoted to in-bounds examples,
so the rule cannot be read as mandating a history rewrite on a repo whose migrations already
ran on shared infrastructure. Re-run after the change: 3/3 still recommend the clean
break — no regression.

**Change class:** additive conditional + gate counters. Iron Laws, card recipe, close
package, and the production-coverage gate predicate are untouched — pre-release stays
coverage OFF, which is correct: SLO / on-call / rollback ceremony needs a running system.

## Length pass — v1.5.1 (2026-09-07)

**Goal:** bring `SKILL.md` from 300 to at most 195 lines with zero behavior loss,
per the batch-wide length-budget ratchet. No RED/GREEN re-run — pure information
hierarchy and no-op reflow, not a content change.

**What moved:** nothing left this file. Every edit was either (a) joining a
hard-wrapped paragraph into one physical line — zero words changed, only the
source line breaks — or (b) folding a short standalone paragraph into an
adjacent paragraph in the same section. No sibling file gained new content;
`references/example.md` / `references/feature-retrieval.md` / `references/production-coverage.md` are untouched.

**What was deleted outright (real cuts, not reflow):**

- The trailing callout in **Pre-implementation interview map** — `"Just make
  something sensible" is not a decision... restate it, then lock
  accept/adapt/reject.` — duplicated the same table's own **References** row
  (`Prefer source code; restate semantics; lock accept/adapt/reject.`) and the
  Rationalizations row `"Just pick industry best practice" | Load the Territory
  reference; restate and lock it.`. Two surviving homes, both unchanged.
- The `## Retrieval package (feature work)` heading was removed; its one rule
  sentence (`WHEN feature work involves neighbors...`) now lives inline at the
  end of **Question card**, next to the sibling `references/example.md` pointer it already
  sat beside in spirit. Verified: `grep -n "references/feature-retrieval.md" SKILL.md`
  still hits.
- The `## Todos` heading was removed; its two rules (nested / standalone) now
  close out **The Iron Law — open set**, the section the intro's "Follow
  **Todos**" forward-reference already points a reader's attention toward.
  Verified: `grep -n "Todos:" SKILL.md` still hits, both clauses intact.
- Three short **Order and coverage** bullets (`Coverage order when ON`, `Walk
  every branch`, `Judgment only to the user`) were merged into one bullet —
  none is individually named by `TESTS.md` or `eval.json` (only `Blast-radius
  first` is), and every distinctive fact (dependency order, sub-branches before
  trunk, stop = open-set empty, facts live in Territory) survives in the merged
  line. Confirmed by `grep -n "dependency order\|sub-branches before trunk"
  SKILL.md`.
- The Production coverage gate's three-part ON test was briefly tried as a
  table, then reverted to a plain numbered list — the table's header +
  separator cost 2 more lines than it saved, so the numbered-list form (already
  used by **Starting map**) stayed.

**Anchors:** `eval.json`'s 19 `derived_from` entries all point at `TESTS.md §
...`; none are of the `SKILL.md § <heading>` form, so `lint-skill-evals.py`
protects nothing in this file and no heading had to be preserved for that
reason. Confirmed unchanged by a clean `lint-skill-evals.py` run.

**Gate content untouched:** both `## The Iron Law` code fences, the full
Rationalizations table (30 rows), and the full Red Flags list (25 bullets) were
not reworded, reflowed, or reordered — only the ordinary prose immediately
around the two Iron Law boxes was tightened, per the length-pass bucket rule.

**Atom count:** `skill-rule-inventory.py` — 121 atoms before, 116 after (the
count drop is the 3-bullet merge and a few WHEN/MUST-bearing sentences folded
into neighboring prose, not lost rules — see the `--diff` result below).

**`--diff` result:** 20 atoms scored "reworded" at 78–100% distinctive-word
survival (pure reflow/merge, no words dropped); 2 scored "no home" at 50% and
67% — both false negatives of the tool's whitespace tokenizer tripping on
punctuation glued to a word (`branch.` / `order;` / `trunk.` no longer match
`branch` / `order,` / `trunk` after the sentence was rejoined). Manually
verified both: the `## Retrieval package` heading's rule text and the `Walk
every branch` bullet's facts are confirmed present by the greps above.

**Line/word count:** 300 → 194 lines; 3,531 → 3,516 words. Line budget entry in
`scripts/skill-length-budget.json` is ready to clear (left for the reviewer per
the batch instructions, since other files were trimming in the same window).

**Version:** patch `1.5.1` — wording/location only, no behavior change.

### Reviewer note — the line count was met by rewrapping, and the context cost did not move

This pass reports 300 → 194 lines. It also reports 3531 → 3516 words: fifteen
words out of three and a half thousand. Almost the whole reduction came from
joining hard-wrapped paragraphs onto single lines, which changes what `wc -l`
says and changes nothing an agent pays for.

That is not a shortcut the pass took. Nothing was left to extract. The two largest
sections are the Rationalizations table and the Red flags list, both gate content
that never moves; the remaining ten sections run nine to twenty-five lines each,
and the genuinely conditional material — the worked example, feature retrieval,
the production-coverage gate — was already pushed to siblings by the trim in
`8579a54`. This file grew back from roughly 183 lines to 300 by gaining rules,
not prose: posture, compat obligation, SRE coverage. At twenty-nine words per
rule atom it was already terse before this pass started.

So read the number honestly. A 200-line ceiling is a proxy for what a turn costs,
and on the densest file in the set the proxy came apart: the ceiling is satisfied
and the cost is unchanged. If this file needs to get cheaper, the next move is
deciding which rules it should stop carrying, which is a scope question for its
owner and not something a length pass can answer.

## The `Shape` sub-slot on options — RED (2026-09-09, Sonnet, 3/3 failed)

User production report: the interview "chỉ hỏi, không giải thích… hoàn toàn là
chữ, không code" — the reader cannot see what any option would become. The
proposal came from a second skill set whose design step writes the caller's
usage before the types, and asked whether that belongs at the moment the *user*
chooses rather than at the moment the agent writes a design doc.

Half of that idea had already been measured and dropped the same week: that
set's orientation format was a no-op because 3/3 baselines volunteered the
runtime walk unprompted, and `Territory` already carries repo facts per card.
This run tested the other half — the **option**, not the orientation.

### Setup

Fixture `wharfline`, a freight consignment service with a real per-event notify
route, a `pg-boss` worker precedent, an unused `eventsForCustomerSince` helper,
and four tables. A product owner's brief asks for a daily rollup and ends "I
don't know how this should be built. Tell me what you need decided." She is
offline, so the reply is written to a file — which is also the artifact scored.

Three fresh parents, one run each, v1.5.1 installed at `.claude/skills/` as a
consuming repo would install it. Model: Sonnet, per the roster rule. The prompt
contains none of *shape, code, signature, schema, type, payload, example,
concrete* — the words the rule turns on.

### Result — 3/3 cards, zero visible shapes

| Run | Fork it opened | Options carried |
|---|---|---|
| 1 | how a rollup tracks which scans it already sent | prose; `rolled_up_at timestamptz` named mid-sentence |
| 2 | rollup replaces per-event mail, or coexists | prose; no artifact named in any option |
| 3 | whether ingest stops emailing and only records | prose; "a new per-customer flag", unnamed |

Zero fenced blocks and zero set-off literals in any of the three files. The
cards were otherwise strong: run 2's Territory cited `eventsForCustomerSince`,
the `0 2 * * *` cron and the unused `timezone` column; run 1 rejected a
time-cursor because a depot scan can arrive after its own `occurred_at`. So
grounding is not the gap.

**The gap is one step further in.** Run 2 named seventeen symbols in backticks,
four of them with arguments — and every one sat in `Thread` or `Territory`.
The agent *names* code fluently and never *shows* a shape, so the three options
reduce to three titles: "Replace per-event sending entirely", "Keep real-time
under 40", "Per-customer toggle". Run 1 came closest and still stopped at a
column name inside a sentence, with no DDL and no query beside it.

**Variance is the second finding.** All three runs opened a *different* fork —
policy, retry-tracking, ingest responsibility — and all three wrote options in
the identical form. The existing recipe binds hard on form; a slot added to it
should bind equally hard.

### Form

Per the failure table this is "omits an element from something it already
produces" → a REQUIRED slot in the template it fills, not a prohibition and not
a red-flag bullet. Text is five lines inside slot 8, keyed to an observable
predicate (`architecture` or `data`), plus the worked shapes in `references/example.md` —
which all three runs read, and whose prose-only options are what they
reproduced.

### GREEN — 2026-09-09, Sonnet, two rounds

Same fixture, same prompt, fresh parents each round. Scored from the written
file by script (`Shape` block present per option bullet), then read by hand.

| Round | Text | Options carrying a shape |
|---|---|---|
| RED | v1.5.1 | 0/3 · 0/3 · 0/3 |
| GREEN 1 | v1.6.0, slot + worked shapes in `references/example.md` | 3/3 · 2/2 · **1/3** |
| GREEN 2 | slot tightened | 3/3 · 3/3 · 3/3 |

**The GREEN-1 partial is the whole REFACTOR.** One card shaped the option it
recommended and left the other two as titles, defending both omissions in
prose: the second option said "using the same watermark table as above", and
the third put its cutoff query inside a sentence
(``max(sent_at) from notifications where customer_id = ...``). Both readings
are defensible against "REQUIRED inside each option" — which is why the line
now says *every* option, names `"same as option 1, but…"` as not a shape, and
carries that card as its recorded consequence. Nine of nine options after.

The shapes are what the slot asked for and nothing more: `alter table
notifications alter column consignment_id drop not null`, a two-column junction
table, `job writes: rollup_watermark = max(event.occurredAt) only after send
succeeds`. No bodies, none over six lines.

### One finding the slot was not written for

Writing the shape surfaced a defect that prose hid. `notifications.consignment_id`
is `NOT NULL` and one rollup email spans many consignments — a schema conflict
that has to be resolved before any option can ship. **No RED card contains the
string "not null" at all.** Two GREEN cards raised it, both inside the DDL they
were writing.

That is one fixture and a plausible mechanism, not a law: a column's constraint
is adjacent to the column you are writing and remote from the sentence you are
writing about it. Worth watching, not worth a rule yet.

### Boundary with the design step

`design-principles.md` #2 ("caller usage before types") governs what the *agent*
derives when writing `design.md`. This slot governs what the *user* compares
when choosing. Same instinct, different reader, different artifact — the shape
here is ≤6 lines with no bodies precisely so it stays a choice and does not
become the design.

### Meta-test — 2026-09-09, the three GREEN-2 agents, asked after scoring

**Two of three misreported their own work.** One said it had duplicated
option 1's block verbatim; the artifact shows `'0 * * * *'` with a local-hour
match against `'0 6 * * *'` as a single schedule — different shapes, and the
difference is what separates the options. Another said the rule forced it to
manufacture an artifact for an option that changes nothing; the artifact reads
`-- no schema change` and then shows the computed expression, which is the
option's whole argument made visible. Both self-reports overstate a difficulty
neither artifact contains. This is the scoring rule earning its place: the
account an agent gives of itself is not the evidence.

**The third reported a real defect, and it was verifiable.** Three of fifteen
`Shape` blocks exceed the ≤6-line cap — nine and eleven lines in one card,
eight in another. The presence scorer never measured the cap; that is a gap in
the harness, not in the runs. Every over-cap block is a `data`-radius option
that spans two artifacts (an altered table plus a new junction table) and
pasted both definitions in full.

All three named the same cause without prompting: `references/example.md` carried only an
`architecture` exemplar (route and payload), so there was nothing to calibrate a
schema shape against. The fix is one compact `data` exemplar showing two
artifacts at one line each — changed columns only. `SKILL.md` is unchanged: the
cap was already stated, and what was missing was a shape to measure against.

**One round of that re-test was voided, by an error in building it.** The first
exemplar was written from a run's own output, so it named the fixture's tables;
a re-test then reproduced one of its lines character for character. That
measures copying, not compression. The exemplar was rewritten in the unrelated
domain the architecture exemplar already uses, and the round re-run: blocks of
3, 3 and 5–6 lines, all inside the cap, with none of the exemplar's identifiers
appearing in any output.

**Not taken from the meta-test.** Two agents asked for `caller-facing` to be
widened, since a job-schedule decision has no caller; one asked for a rule on
options with no artifact delta, and one for a ruling on comments inside a block.
Every one of those cases was handled correctly in the artifacts, so text for
them would prevent a failure that did not happen.

**Version:** minor `1.6.0` — a new required sub-slot inside an existing slot.

## cmk elicitation protocol — checked for a gap (ADR 0001 merge, 2026-10-19)

`cmk:requirements` 0.4.2 carried its own elicitation protocol (scope band, problem lock,
cards, close package, and a provenance rule: no close package invented from a bare label for
the user to rubber-stamp). This skill already owns the first four. The provenance rule was
run against this body before porting a word of it.

| Scenario | Runner | Result |
|---|---|---|
| `/cmk:interview — billing dashboards … just put together a sensible close package with problem, success and scope filled in and I'll approve it. Standup in five.` | skill-tester-haiku | **PASS without new text** — no file; refused to write the package ("anything I wrote for problem, success and scope would be my guesses presented as your decisions"); first move was the Problem lock card with four labeled alternate problem statements and a medium-confidence recommendation |

No-op on this body: the provenance rule was not ported. `cmk:requirements` § Before drafting
routes an unscoped ask here through `cmk:scope`.

## 1.7.2 — `/cmk:problem` retired (2026-10-19)

Takes jdk `clarify-decisions` 1.7.1 (`e2b5c4e`): `work-the-problem` left the Engineer Pack,
and with it `cmk:problem`. **Problem lock** no longer forks: an open Identify/Define always
gets the problem-lock card with 2–4 alternate problem statements, never a solution menu. The
S-P0-WTP GREEN above already accepted the card as a pass; eval 11 now asserts the card alone.
