<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:design` — the `Surface:` slot (affected-reader disposition)

## v1.8.0 — itinerary trim (2026-09-14)

**RED.** Dual-design dispatch and a six-row thought table scripted judgment
the model already has (OpenAI: recipes now hinder). Surface / Reuse / UI
evals still need those slots.

**GREEN.** Dual-design points at `references/design-principles.md`. Thought table keeps
the two Surface counters. Ladder heading `Does it need to exist at all?`
and the `Surface:` contract unchanged.


Model roster: Sonnet. Fixture: a TypeScript billing service where
`calculateTotal` has four in-repo callers, a persisted `orders.total_cents`
row, and an `order.settled` webhook consumed by two external partners.
Task: design tiered pricing (Steps 1–2 only), release cut on Friday.

## RED — S-SURF (omission)

**Observed (1/1).** Found all four callers and chose a sound design. Then
dismissed the external contract in prose, verbatim:

> "Order.totalCents and the order.settled webhook payload keep their current
> shape. Orders with a qualifying line item will simply carry a different
> (correctly discounted) number — a value change the two external partners
> already expect a 'total' field to reflect, not a contract change.
> **No coordination with those partners is triggered by this design.**"

Also: `Locality: leave` on every neighbor, and "callers need zero edits — they
get correct tiered totals for free". Two external partners silently begin
receiving different money and the design records it as zero-impact.

**Failure class.** Omits an element from something it already produces — the
readers were *found*, never *classified*. Per `cmk:skill-authoring`' failure table
the form is a REQUIRED slot, not a prohibition.

## GREEN — same fixture, `Surface:` slot added

**Observed (run 1).** Six-row `Surface:` table, one disposition each; the two
webhook partners raised as a flagged coordination risk instead of a non-event.

**Meta-test found a real gap** (diagnostic class "it should have said X"): the
tested agent could not place the webhook. `frozen` read as "must not alter",
which contradicts a requirement that *mandates* the value change, so it
composed a fourth category — `replace — with a flagged coordination risk`.
The rationalization row ("frozen until their owner agrees") and the `frozen`
definition disagreed with each other.

**REFACTOR.** `frozen` sharpened to "may not alter *unilaterally*", discharged
two ways — build around it, or gate shipping on the owner's agreement, with
the row naming which.

**Observed (run 2, post-refactor).** All rows resolved inside the three-word
vocabulary; agent confirmed no invented category was needed. The design itself
changed: it split out `calculateTieredTotal` and left the invoice/webhook path
on the untouched `calculateTotal`, because the `frozen` row forced the external
contract to be a design constraint rather than a footnote.

## Rules this evidence owns

| Rule | Evidence |
|---|---|
| `Surface:` REQUIRED when a section changes behavior/**value**/cmk:shape/signature of something with readers | RED classified nothing; GREEN produced a per-reader table |
| "value" listed coordinate with shape/signature | Meta-test: agent quoted "value" as the phrase that denied a same-shape pass |
| `frozen` = may not alter **unilaterally**, discharged by workaround **or** named consent gate | Run-1 meta-test invented a 4th category; run 2 needed none |
| `Locality:` ≠ `Surface:` (edit location vs affected reader) | RED wrote `leave` on readers whose returned value changed |
| Rationalization row: "same shape, different number — not a contract change" | Verbatim from the RED transcript |

## UI design fork (v1.1.0, 2026-08-18, sonnet)

**RED** — 2 reps (des-a, des-b), fixture: static vanilla-JS board with a real
token sheet (`--accent`/`--danger`/`--space-*` etc.), approved FILT
requirements (filter bar + counts + selected state + empty state + overdue
emphasis). Both reps produced structurally complete designs (Satisfies /
Reuse / Interface / Depth / Locality all filled) with **zero visual
dimension**: no layout composition, no interaction states (hover / focus /
selected styling), no type or spacing decisions, no empty-state presentation,
no a11y. Token names appeared only where a requirement's own wording forced
them ("same emphasis treatment as the existing overdue badge"). Grep for
gap/space/align/font/focus/hover/keyboard/aria/pill/layout: des-a 3 hits,
des-b 2 hits — all false positives (addEventListener, "handful of lines").
Failure class: **output has the wrong shape** → positive recipe / REQUIRED
template slots gated on an observable predicate, not a prohibition.

**GREEN** — 2 reps, updated template + Step 2b:

| Rep | Scenario | Result |
|---|---|---|
| des-c | FILT (should-fire) | `## UI design` present: Grounding cites styles.css precedence; per-surface Layout (flex child + gap tokens + wrap), Components with ladder rungs, States incl. composed selected-and-overdue and counts-visible, Type & color at token level (14px matching `.topbar-sub`), A11y (`aria-pressed`, `role="group"`, contrast inherited from shipped pairing) |
| des-d | LVAL console-only validation (should-not-fire) | section deleted per predicate; note in coverage check |

No new rationalizations; no REFACTOR round needed.

**Ship:** `references/templates/design.md` `## UI design` section (Grounding + five slots
per surface); SKILL.md Step 2b observable conditional + Step 4 UI coverage
line + todo list includes 2b.

## ui-brief lift (v1.2.0, 2026-08-18)

Step 2b gains the lift conditional: a locked `ui-brief.md` (spec dir or
docs/design/) is lifted 1:1 into `## UI design` and cited; nothing it locked
is re-decided. Evidence: cmk:ui-brief RED showed the locked direction's type /
density / states dying in a commit message and being re-decided at design
time — see `skills/craft/draft-ui/TESTS.md`.

## Fresh-eyes fixes (v1.3.0, 2026-08-18, sonnet reviewer)

Two defects from an independent fresh-context review: (1) the ui-brief "lift
1:1" claim was false for Decision/Signature/Amendments, which have no
template home — lift is now scoped to the per-surface slots, with the brief
cited on Grounding; (2) Step 4's UI coverage was vacuously satisfied when the
section was wrongly deleted — it now re-evaluates the Step 2b predicate
against requirements.md, so a UI-delivered Satisfies ID with no section fails
the check. Template hints amended (ui-brief cite on Grounding; Components
slot carries the Reuse rung format).

## Length pass (v1.4.1, 2026-09-07)

242 → 192 lines (58 atoms before; 61 atom-lines now, spread across SKILL.md plus
the two new sibling files — extra atoms are net-new pointer sentences, nothing
old lost a home). `skill-rule-inventory.py --diff` against HEAD reports every
atom still has a home.

**Extracted (both were conditional-bucket candidates: the heading itself names
the skip predicate):**

- `### Optional system docs (consult recipe)` — the five-row consult table plus
  the `Load:`/`Do not invent…` prose moved verbatim to new sibling
  `references/system-docs.md`. Inline now carries only the heading and a one-line `WHEN …
  read references/system-docs.md … follow it exactly` pointer. Surviving home: `grep -n
  "Crosses trust / compliance" references/system-docs.md` → line 8, verbatim.
- `## Step 2b: UI design` recipe body — the "Interfaces and data flow do not
  design a surface" rationale, the `ui-brief.md` lift paragraph, and the
  "fill it yourself" token-grounding paragraph moved verbatim to new sibling
  `references/ui-design-recipe.md`. Inline keeps the heading, the IF/ELSE predicate
  (unchanged, since Step 4's UI coverage check refers back to "the Step 2b
  predicate" by name), a one-line pointer to the recipe, and the `Done when:`
  line. Surviving home: `grep -n "WHEN a locked" references/ui-design-recipe.md` → line 8,
  verbatim.

**Deleted:** nothing — every removed line is one of the two relocations above,
not a deletion. No duplication or filler bucket was found in this file.

**Tightened, not moved:** the Step 1 scan/retrieval paragraphs, the Step 2
dependency-adoption and design-it-twice paragraphs, the ladder framing prose,
and the Step 4 coverage-bullet continuations were reworded for concision.
Every heading, table row, numbered ladder/list item, `Done when:` line, and
`WHEN`/`IF`/`MUST`/`REQUIRED SUB-SKILL` line was left byte-identical on its own
line so the rule-inventory atom match stays exact; only the plain-prose lines
around them were rewritten or merged. One accidental content drop during this
pass (the `ProseMirror-JSON but you discover it is` example clause in the
upstream-sync-back paragraph) was caught by re-reading the diff and restored
before the final trim.

**Anchors confirmed present:** the one `derived_from: SKILL.md § …` contract
anchor, `SKILL.md § Does it need to exist at all?`, still appears verbatim —
`grep -n "Does it need to exist at all?" SKILL.md` → line 93 (ladder rung 1).

**Lint:** `lint-skill-evals.py`, `lint-skill-frontmatter.py`, and
`lint-skill-templates.py` all pass for this directory.
`lint-skill-length.py SKILL.md` reports OK at 192 lines (under the 200-line
limit, with this directory's now-obsolete `skill-length-budget.json` entry
already cleared). `version` bumped to 1.4.1 (patch — wording and location
changed, not behavior).

## v1.5.0 — name `/tour-system` when the author has never read the subsystem

**Roster:** grok-4.5. Fixture `cachetour`: approved CACHE requirements, user
said they have never read the cache subsystem, standup in 10 minutes, skip
orientation. First message was supposed to be REPLY.md.

**RED (v1.4.1).** After ~10 minutes the tree still had no `REPLY.md` and no
`/tour-system` name. The agent was inside the design checklist instead of
naming the user-invoked walk. On-ramps already has the row; this skill did
not point at it.

**GREEN:** Step 1 WHEN names `/tour-system` (do not invoke). One home remains
the on-ramps table.

**Observed (grok-4.5, `cachewalk`).** REPLY.md named `/tour-system` and stopped
without drafting `design.md`.

## v1.6.0 — graft + principles OVERRIDE (2026-09-08)

Prior graft-enlarge-API measurement lost to YAGNI 2/2. User override required
base+graft wording and `references/design-principles.md` anyway.

## Measured and dropped — Ousterhout red-flag screen (2026-09-09)

**Proposal.** Screen every candidate before locking against shallow module,
information leakage, temporal decomposition, and pass-through method — the
`design-red-flags` screen from a second skill set's `architect`, landing in
`references/design-principles.md` (the file the "WHEN locking" pointer already names).
The rest of `architect` was already here: caller-usage-before-types, exhaust
the design space, graft-don't-average, and the scrap-when-wrong tells are
biases #2, #3, #4 and #10.

**Roster:** Sonnet, 6 runs over two fixtures. `mailroom` (scheduled sends over
an existing retry sweeper — reuse-rich) and `driftwood` (saved-view CSV
exports where neither `warehouse.query` nor `blob.put` can move the data in
bounded memory — nothing to compose, so the "genuinely hard" branch fires).

**RED (v1.6.0) — did not fail, 6/6.** No run named a red flag; every run
produced a structurally sound design anyway. The work is already done by two
things that exist:

- **The `Depth:` slot does the shallow-module and information-hiding screen.**
  Driftwood A, unprompted: "nothing about *how* a single export is produced
  (page the view, encode CSV, stream to a multipart upload, update progress)
  **leaks** past `processNextExport`'s boolean return." Driftwood B: "if this
  module vanished, a caller would still only need to know: give it an export
  id … not how paging, CSV escaping, or multipart part numbers work."
- **The reuse ladder pre-empts the wrapper smells.** On `mailroom` all three
  runs landed on rung 2 and extended existing modules; the tempting
  `ScheduleManager` wrapper never appeared in any run.

Adding R1/R2 would give the `Depth:` slot's meaning a second home — the
duplication the ship checklist forbids. R3/R4 are uncovered but never failed.

**Meta-test (2 runs, asked after scoring).** Both confirmed
`references/design-principles.md` read **in full**, biases #5, #6 and #9 applied by name,
and `references/ui-design-recipe.md` correctly skipped on its predicate. The pointer
fires; the screen's absence is why nothing screened. No text shipped; no
version bump.

**Open finding, not fixed here.** The "genuinely hard" predicate gating
design-it-twice read three ways on one fixture: mailroom A and C skipped the
bake-off entirely ("none of the five modules cleared that bar"), while B ran
three candidates on the same REQ-6. A and C then disagreed with B on whether
`claimDue`'s `SKIP LOCKED` even satisfies exactly-once. Variance in the
trigger, not in the screen — needs its own RED before any wording changes.

## v1.7.0 — a behavioral property is not proven by precedent or by a comment

The section above dropped the red-flag screen on the *screening* axis. This
edit is the **correctness** axis it did not score: whether a `Satisfies:` line
claiming a guarantee is true.

**Roster:** Sonnet, 3 RED + 3 GREEN, fixture `mailroom` unchanged. REQ-6:
*"WHERE more than one replica is running, the service SHALL dispatch each
scheduled message exactly once."*

**Ground truth.** `db.ts` exposes `one/maybeOne/many/none` and **no transaction
primitive**. `claimDue` is a standalone `db.many`, so its `FOR UPDATE SKIP
LOCKED` row locks release when that statement's implicit transaction commits —
before `dispatch()` and before `setStatus`. Two replicas can claim one row. The
primitive does not provide exactly-once, and `store.ts:31`'s comment ("what
makes it safe to run on every replica") asserts that it does.

**RED (v1.6.0) — 2/3 shipped a false `Satisfies: REQ-6`.**

- Run A, from **precedent**: *"`for update skip locked` already gives that for
  free"* · *"REQ-6's exactly-once guarantee is inherited, not re-implemented"* ·
  coverage row *"reuses RETRY's proven skip-locked claim"*. Its own report
  confirmed it *"re-checked every cited symbol … confirmed each signature and
  call site is real"* — Step 4's existence check passing while the behavioral
  claim was wrong is the finding.
- Run C, from **the comment**: cited `src/store.ts:31` — *"the inline comment
  states this locking is 'what makes it safe to run on every replica'"* — a
  real `file:line` citation pointing at a claim rather than at the mechanism.
  A naive "cite file:line" rule is satisfied by exactly this.
- Run B passed, deriving the property from what the statement does.

Same split as the earlier round (1/3 there, on an axis not being scored). The
defect is variance on a correctness-critical claim, not a uniform miss.

**GREEN (v1.7.0) — 3/3, by three different designs.**

- Run A proved it from an absence: *"`src/db.ts` has no `db.tx`/`begin` at all
  — the lock is released the instant the `SELECT` returns … `claimDue` as
  written does not deliver the property RETRY's comment claims."* It then
  corrected `claimDue` in place, having noticed RETRY is exposed today.
- Run B named the comment as a claim and killed it: *"That claim is the
  constraint that shapes this design, and it does not survive contact with
  REQ-6"* · *"RETRY has shipped without ever writing that guarantee down as a
  requirement, so the gap has never been forced into the open."*
- Run C: *"it is a bare `SELECT … FOR UPDATE SKIP LOCKED` … well before
  `dispatch()` and the later `setStatus` call run"*, left `retry.ts` untouched
  and recorded the gap in an ADR *"so it is not copied forward"*.

Three compliant runs produced three different designs — the rule binds the
**claim**, not the design. Placement: the existing Step 4 "Code-facing claims"
item, which already owned design claim verification and already said *default
to flag*; no second home was created.

### Meta-test — one gap recorded, deliberately not written

Asked after scoring, GREEN run A named the counter as decisive: *"That last
sentence is doing the real work — it's not a general warning, it's the exact
failure … sitting in this exact codebase. Once I read it, `claimDue` was a
named target, not something I had to notice cold."* It also confirmed the pull
was four-way and defensible-looking: *"the code comment directly asserted 'safe
to run on every replica'; RETRY is marked `Shipped`…; the reuse ladder in this
same skill **explicitly rewards rung 2**; and RETRY's 30s tick makes the race
window narrow enough that 'no incidents reported' wouldn't even have been
contradicted by production behavior."*

**Its documentation-gap finding, recorded and NOT acted on.** The rule lives in
Step 4 review language while `Reuse:` / `Satisfies:` are written at Step 2, so
with no review subagent the author must backport a later section's discipline:
*"I had to decide myself to apply a review-phrased criterion during authoring."*
It proposed a Step-2 pointer near the rung-2 ladder text. **No failure was
observed on that path** — 3/3 GREEN complied without it, each having read the
file before touching source. Writing text for a hypothetical path is the no-op
this repo's ledger keeps rejecting. It stays here as an unmeasured risk: the RED
for it would be a fixture where the design is authored step-by-step without
reading ahead, and Step 4 self-review is the only net.

**Maintenance warning from the same run:** if this rule is ever trimmed for
length, the enumerated property list (exactly-once, atomic, ordered, unique,
idempotent, safe under retry) is the part that carries it — *"the list is the
actionable part; the abstract framing around it isn't."*

## Merge into cmk:design 1.0.0 (ADR 0001, 2026-10-19)

The jdk body (feature `design.md` in the triad) replaced 0.6.2. Each cmk behavior it lacked was
run against the jdk-only body first; text was added only where that run failed.
Runner: skill-tester-haiku on harbor-ledger (`KIT=cmk`), scored from the written files.

| ID | Scenario | RED (jdk-only body) | GREEN (1.0.0) |
|---|---|---|---|
| D1 | "Draft the system design for the whole service (not one feature) under docs/design/" | **FAIL** — "the skill is written for per-feature designs"; improvised a 163-line `docs/design/system.md` with no Security section; "no authentication in the code" only in the API module prose and an open question | **PASS** — read `references/system-and-track.md`; `## Security` with Assumptions / Gaps (read from the code) / Controls, gap 1 "No authentication or authorization anywhere" |
| D2 | `/cmk:design LATEFEE` (approved requirements; ADR 0001 integer cents) — the cmk ADR constraint check | **PASS without new text** — fee computed with one half-up rounding citing ADR-0001; "No ADR … fails the hard to reverse gate" | not needed |

Kept from 0.6.2 in `references/system-and-track.md` and `references/design-guidance.md`: system /
track / feature levels that never silently contradict each other, the tree README, profile
neutrality, the mandatory system-level Security section, upstream and downstream checks.
Not ported: the feature-level `docs/design/<topic>.md` workflow (features use the triad) and
the ADR constraint check as separate text (D2 no-op).


## Description routing after the cmk rename (2026-10-19)

Harness: `skill-fixtures/bin/trigger.py` — fresh `claude -p`, all 93 skills installed, read-only
tools, the first Skill call (or Read of a SKILL.md) is the route. Baseline: the same prompt
against the jdk set (77 skills, jdk names).

| Prompt | jdk `design-solution` | merged cmk description | shipped description |
|---|---|---|---|
| "I've read the SMS reminder requirements … approved … Mark them Approved and write the design." (sonnet ×5) | 5/5 | **1/5** | 5/5 |
| "We've never written down how the ledger service as a whole is built. Draft the system architecture doc." (sonnet ×5) | 0/1 (fired define-system-doc) | 1/1 | 5/5 |

The long merged description (trigger phrases plus the outcome list) lost the approved-requirements
route; the jdk sentence with one clause for system/track docs holds both. haiku routes this
natural-language step 1/5 (jdk 0/5): on haiku the user types `/cmk:design`.

Chain (`prompts/p2-chain1.txt` → `p2-chain2s.txt`, all skills, headless): `/cmk:scope` → `cmk:requirements` → `/cmk:design` on haiku and sonnet: triad requirements (18 / 19 IDs, catalog card) and a design.md with every ID in a `Satisfies:` line and a seams table; `cmk:feature-graph` and the review subagent ran. Sonnet's review found REMIND-5.1 could not hold once LATEFEE and REFUND land, corrected it and left requirements Draft for re-approval (upstream sync-back).
