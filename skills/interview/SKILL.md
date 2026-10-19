---
name: cmk:interview
description: Use to interview or grill the user before building an underspecified plan, design, or feature idea, including when another skill calls for an interview. Produces a confirmed close package of decisions, constraints, success, boundaries, and spine touch — plus owned unknowns, accepted risks, and operability when the production-coverage gate is on.
version: 1.7.2
---

# Interview

This is a reusable **interview protocol**, not a pipeline stage. Nested under a parent, stay in its conversation and checklist; standalone, own the interview until shared understanding. Follow **Todos** for checklist ownership. Name and decide every silent assumption that could create debt or a wrong architecture. Leading words: **open set**, **territory**, **card**, **problem lock**, **criteria**, **coverage map**, **close package**. The map (prompts, plans, knowns) is not the territory (codebase, runtime, users, history).

## The Iron Law — channel

```
EVERY QUESTION IS INLINE CHAT WITH FULL CONTEXT.
NEVER use AskUserQuestion, structured MCQ pickers, or any harness UI that
truncates labels, option text, or the "why this matters" line.
```

A picker that strips consequences is a different interview. House style, authority, deadlines, and a nominally long description field are not exceptions.

## The Iron Law — open set (no fixed rounds)

```
THERE IS NO FIXED ROUND COUNT.
NEVER "Question k of N", "last of 5", or "we budgeted four cards".
Stop only when the open set is empty of judgment calls that change
architecture, data, auth/security, UX flow, or implementation scope —
AND, when the production-coverage gate is ON, judgment calls on
reliability, failure, and operate, with no coverage-map cell Missing
without an owner.
```

**Open set** = high-blast unknowns still undecided + branches the last answer opened + parent known-unknowns still needing a user lock + (when coverage ON) coverage cells that are Missing without owner. **Home rule:** recompute the open set **after every answer**, then either the next card or the close package. Every other mention of "recompute" points here. A pre-listed todo is a **living map**, not a quota: append opened branches, drop resolved ones, and never close while a high-blast item remains. Pressure changes *when* you report progress, not whether an unstated decision exists. **Todos:** nested, no competing list — you run inside the parent's checklist, the interview item stays in-progress until the close package is confirmed, and open-set progress is that item's progress, not a second channel; standalone, a **living** open-set list of decision areas is fine — still one card per message, still recompute after each answer, and if a parent skill is already in flight, never open a second channel.

## Production coverage gate (when)

**Home for the ON/OFF predicate.** When ON, load and follow `references/production-coverage.md` (map, radii, close slots 7–10). When OFF, do not load it. Authority and chat vibes never flip the gate. Evaluate **once** before the starting map (re-check only if written posture, brief flag, or operate/launch surface changes). **ON** only when **all three** hold:

1. **Posture band** — written Delivery intent **Production** and Lifecycle **Cut Released** / **Scaling** / **Maintenance** (parent or `docs/agents/project.md`).
2. **Full-path interview** — parent did **not** mark this interview **tier 0** or **brief**.
3. **Surface latch** — operate/launch surface (alerts, rollback, SLOs, on-call, deploy/takeover, new failure domain) **or** user/parent explicitly asks for ops/reliability coverage.

**OFF** otherwise — including absent posture; **MVP · Run Spike · Research · Learning**; Lifecycle **Idea · Early · Active development**; polish/copy/recolor with no latch; "build SRE habits" chat without the written band + latch. When OFF: omit the coverage map entirely; no `reliability` / `failure` / `operate` radii; close omits slots 7–10. Core close slots 4–6 (Success, Boundaries, Spine) and problem lock still apply.

## Starting map (before the first card)

Load parent Knowns, Blindspot, and scan digest when present (for example `.skills/<CODE>/{knowns,scan}.md` or `_pending-<slug>` equivalents). State **Coverage ON** or **OFF** (if OFF, which gate part failed), then one short thought-partner map:

1. **Locked** — fixed posture, non-negotiables, digest facts.
2. **Coverage map** — when ON only (table + cell recipes in `references/production-coverage.md`).
3. **Open high-blast** — ON: Missing/Partial cells from that file; OFF: arch/data/auth/UX/scope forks only.
4. **How you will close** — judgment cards; reference / `cmk:spike` / `cmk:research` for facts; teach-then-ask on blindspots; Operate path only when ON (see `references/production-coverage.md`).

Invite correction only if a lock is false. First card: **Problem lock** when its predicate holds, else highest-blast open item (when ON, prefer Missing coverage cells). Parent already stated the map → do not restate; when ON, still refresh coverage after answers.

## Problem lock (before preference cards)

**Home for this rule.** Other sections only point here. Emit **2–4 alternate problem statements** (each with Observed · Desired · Non-goals) on one **problem-lock card**. Never open a solution-shape menu.

**Problem-lock card** WHEN parent knowns show **Assumptions** that are solution-shaped (a named API, flag, merge, or “just do X”) **OR** there is no stated desired outcome / success signal — and the Fork above says the card path: use the Question card recipe; Thread *This card* names the problem lock. Body MUST lock all three on the chosen statement (options = alternate *problem statements*, not implementations):

- **Observed** — who hurts / what is true now
- **Desired** — observable result when done (not “it works”)
- **Non-goals** — deliberate outs

Closes: `known-unknown` (problem statement). Senior “skip philosophy / just pick API options”, standup clocks, and “don’t send me to another skill” do **not** waive this section.

## Question card (every turn)

Exactly **one** decision per message. Every slot is **required**. Load
`references/card-recipe.md` with the first card (slot expansion, Shape, recommendation
argument). Load `references/example.md` when no parent supplies a confirmed exemplar.
WHEN feature work involves neighbors, overlap, or reuse, load
`references/feature-retrieval.md` before the first card; otherwise do not.

1. **Radius** — `architecture` · `data` · `auth/security` · `UX flow` · `cmk:delivery-simplify`. Coverage ON also `reliability` · `failure` · `operate`.
2. **Thread** — *Locked so far* · *This card* · *Still open after* (names, never "3 of 5").
3. **Territory** — grounded repo facts; teach a blocking blindspot here; do not invent; never ask the user to recall what you can read.
4. **Question** — the decision in plain language.
5. **Why it matters** — blast narrative only (what rewrites if the answer flips). Graders are slot 7.
6. **Closes** — `known-unknown` · `unknown-known` · `blindspot-confirm`.
7. **Criteria (graders)** — REQUIRED on high-blast radii (omit only `cmk:delivery-simplify`): 1–2 named pass/fail graders **above** Options. Recommendation MUST cite graders by name.
8. **Options (2–4)** — gains, pays, can break, better-fit. Bare labels are not options.
   **Shape** — REQUIRED on `architecture` or `data` for **every** option: caller-facing difference (signature, type, column, route, payload), ≤6 lines, no bodies. Prose naming an artifact is not a shape. "same as option 1, but…" is not one.
9. **Recommendation** — Pick · Decisive factors · Runner-up · Accepted trade-off · Confidence / evidence gap · Reopen trigger (observable; “if requirements change” is not a trigger).
10. **Stop.** Wait. Recompute the open set, then next card or close package.

Visible order: `Radius → Thread → Territory → Question → Why it matters → Closes → Criteria → Options → Recommendation → Stop`.

## Order and coverage

- **Blast-radius first.** Architecture, data, public API, auth/security, UX flow, or scope before polish — even if the user opens on polish.
- **Coverage order** when ON: `references/production-coverage.md` (Missing before Partial). Stop is open-set empty. Facts in Territory; only human locks become cards.
- **Compat obligation.** Read it from `docs/agents/project.md` **Project posture** — the written line, else derived from Lifecycle (Idea / Early / Active development → **None**; Cut Released / Scaling / Maintenance → **External**). On **None**, options and the Recommendation on an `architecture` or `data` card land **one shape** with nothing left behind. A parallel column, a sync trigger, a `v2` name, or a deprecation window on **None** is a defect. On **Internal** / **External** those costs are first-class. Delivery intent sets the quality bar, never the compat answer.
- **Team band.** Roster or Workflow band override → package from that section. Never invent a team.

Interview only. Blindspots: consume the parent's list. Problem: follow **Problem lock**. Scope decomposition: hand back to the parent. Unknown knowns: reference / `cmk:spike` / `cmk:research`, then one result card.

## Close package (required)

When the open set has no remaining high-blast judgment call — and **before** returning control to a parent or claiming shared understanding — emit:

1. **Decisions table** — rows: radius · topic · decision (user's words) · unknown class closed.
2. **Constraints block** — ready-to-paste locks (architecture and data first; when Coverage ON, reliability/failure/operate next; cmk:delivery-simplify last). Flag lower-radius answers that conflict with higher-radius locks.
3. **High-tweak surface** — locks most likely to change under real implementation pressure (data model, type interfaces, UX flows). Mechanical refactors stay buried; do not re-interview them here.
4. **Success / done signal** — 1–3 observables that mean “done” (pasteable into `requirements.md` / NFR). Prefer CUJ-shaped observables when Journey was walked. Not “it works” / “we’re aligned”.
5. **Boundaries** — **Off limits** (will not do) and **Must keep working** (guards / unchanged behavior), even if only 2–4 bullets. Seed from problem-lock Non-goals and `(guard)`-shaped locks when present.
6. **Spine touch** — WHEN `docs/design/` (or equivalent ARCH spine) exists: `Respects: ARCH-N…` · `none` · or `challenges` (ADR needed). WHEN absent: write `none — no architecture spine`. Do not invent ARCH IDs.
7–10. **Coverage final · Owned unknowns · Accepted risks · Operability touch** — REQUIRED when Coverage ON; recipes only in `references/production-coverage.md`. Omit when OFF.
11. **Explicit confirmation** — is this the shared picture? Only an affirmative on **this package** counts.

Slots 4–6 always required. Slots 7–10 required only when Coverage ON. Not confirmation: "any other questions?", "we're aligned, skip the table", "just go write requirements", "reliability is a later NFR", senior pressure to skip ceremony, or silence. If they correct a row, edit and re-confirm. If confirmation opens a new high-blast fork or a Missing cell, return to cards. **Do not enact anything** — no production code, no scaffolding, no plan execution — until that confirmation lands. (Glossary/`docs/requirements/glossary.md` updates via `cmk:glossary` as a passive side effect are allowed when a term settles mid-interview.)

## Rationalizations

| Thought | Reality |
|---|---|
| "House style / the lead said use the picker" | Channel is the Iron Law. One inline card. |
| "The graders are named, so a one-line recommendation is enough" | Show why the pick beats its runner-up, the trade-off, the evidence gap, and the reopen trigger. |
| "Put success in Why / no criteria essays" | Why is blast; Criteria are separate graders above Options. |
| "We finished the four areas / question 3 of 5, then package" | Open-set empty is the stop. |
| "User asked for button color first" | Blast-radius first. Polish after architecture, data, and auth. |
| "We're aligned / senior said just write requirements" | Shared understanding is the package + yes. |
| "They named the cheap path / skip philosophy and pick API options" | Solution-shaped assumptions are not locks. Follow **Problem lock**. |
| "Success / Boundaries / Spine belong downstream" | Close slots 4–6 are required here. |
| "Stay additive to be safe / v2 name on a None repo" | Compat obligation None: one shape. A `v2` name, parallel column, or deprecation window is a defect. |
| "Reliability is later / skip the map" | Coverage ON: Missing cells stay open. Extra rows: `references/card-recipe.md`. |

## Red flags — stop and rewrite the turn

- Calling `AskUserQuestion` or any truncated MCQ tool
- More than one user-aimed question mark in a message (except examples inside option text)
- A card missing Thread, Territory, Why, Closes, option consequences, high-blast Criteria, or the recommendation argument
- A preference or solution menu while **Problem lock** applies, without its card
- "Question k of N" or closing on a count while high-blast remains
- Leading with cmk:delivery-simplify while architecture / data / auth (or Coverage ON: R/F/O) remain open
- Close package missing Success, Boundaries, or Spine touch, or treating "we're aligned" as confirmation
- Coverage ON without the map / slots 7–10, or Coverage ON when any gate part fails
- Offering a `v2` name, parallel column, sync trigger, or deprecation window on **Compat obligation None**
- Inventing SLO-N / TB-N / THR-N IDs; merging Owned unknowns into Accepted risks
