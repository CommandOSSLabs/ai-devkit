<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:prompt` — RED/GREEN and design record

**Protocol:** `cmk:skill-authoring` / `pressure-testing.md`
**Run mode (2026-08-25):** controller-run, single model (`claude-opus-5[1m]`). Isolated subagent
runs were **not** performed — the session forbade the Agent tool.
**Owed before the next version bump:** multi-model roster RED/GREEN per the `cmk:skill-authoring`
deployment checklist. No description trigger matrix is owed — this skill carries
`disable-model-invocation: true`, so its description routes nothing and the user reaches it by
name.

## RED-1 — structural baseline (deterministic, re-runnable)

No entry point in the set ever fixed a target or declared a boundary. Slot-presence pass over the
four on-ramps as they stood at `320e91e` (re-run with `git show 320e91e:<path>` — `solve-problem`
no longer exists in the tree):

```sh
for f in skills/discovery/solve-problem/SKILL.md cmk:scope \
         cmk:amend cmk:debug; do
  grep -ciE "exact target|target certainty|name the file|file:line|exact path" "$f"
  grep -ciE "must not touch|do not touch|out of bounds|don't touch|off-limits|blast radius" "$f"
  grep -ciE "paste|code block .*copies|copy cleanly" "$f"
  grep -ciE "at most .*question|question budget|no more than .*question|three questions" "$f"
done
```

| Skill | exact-target slot | do-not-touch slot | paste-ready block | question budget |
|---|---|---|---|---|
| `solve-problem` | 0 | 1\* | 0 | 0 |
| `cmk:scope` | 0 | 0 | 0 | 0 |
| `cmk:amend` | 0 | 0 | 0 | 0 |
| `cmk:debug` | 0 | 0 | 1\*\* | 0 |

\* `Blast radius: <low | medium | high | unresolved>` — a risk *classification*, not a declaration
of what must stay untouched. \*\* unrelated prose. Effective count: **zero** on all four slots.

## RED-2 — controller-run baseline, `solve-problem` v1.1.0

**Scenario B (ambiguous):** `our onboarding is bad, we should probably add a wizard`

Baseline output, following `solve-problem`'s required shape verbatim: Observed state "onboarding
is reported as bad" · Desired state `unresolved` · Gap verdict suspected · Constraints
`unresolved` · Success `unresolved` · Guards `unresolved` · Risk all three fields `unresolved` ·
Class discovery · Route `cmk:scope`.

| Observed failure | Class |
|---|---|
| No target — "onboarding" resolves to no file, screen, flow, or feature code | omitted slot |
| No boundary — nothing states which surfaces must stay untouched | omitted slot |
| **Eight of nine slots came back `unresolved`; not one question was asked of the user** | wrong shape — it classifies, it does not elicit |
| Nothing produced that another session can consume — prose about the problem, not a prompt | wrong shape |

The third row is the reported complaint ("not too useful"): the request reached the next stage no
better specified than it arrived.

## RED-3 — external measurement (third-party, not runs of this repo)

Full URLs, per-source evidence strength (read / summary-only / failed), and the open
verification work are in `docs/design/forge-prompt-sources.md`. Two of the anchoring
citations below and in RED-4 rest on search summaries rather than the source text; that
file says which.

- **UnderSpecBench** (arXiv 2607.02294), five agent×model configurations across OpenCode, Claude
  Code, and Codex: **55.8–67.8%** of acted runs violated at least one action boundary. Safe success
  collapses **67.9% → 8.6%** and wrong-target rises **9.6% → 75.1%** as target certainty degrades —
  target identity dominates, ahead of intent clarity. Action rates on shared production surfaces
  (65.5%) are indistinguishable from contained ones (64.0%): **agents do not respond to
  blast-radius signals they were not given.**
- **CLARITI** (arXiv 2604.14624): 36.8% task success at **3.0** questions average versus 5.1;
  the *answerable* proportion falls as question count rises. Shapley ranking of what to ask:
  error information > implementation details > environment configuration.

## RED-4 — the on-ramp design was wrong, and the measurement says why

The first version of this skill was model-invoked, ended each brief with a `Route:` slot and a
`Start with: <lane>` line, wrote to `cmk:scope`'s `.skills/_pending-<slug>/` convention, and
seeded three lanes (`cmk:scope` 1.1.0, `cmk:amend` 1.1.0, `cmk:debug` 1.2.0) to read that
brief. Reviewed against the anchoring literature, that shape **manufactures the bias it was
supposed to remove**:

| Finding | Source | Consequence for the on-ramp shape |
|---|---|---|
| Models anchor on their own earlier output; confidence drifts systematically when building on it across turns (*Self-Anchoring Calibration Drift*) | arXiv 2603.01239 | A lane running in the same session as the brief inherits the brief's certainty labels without re-earning them |
| Self-preference in self-evaluation **nearly disappears when authorship is unknown** | anchoring/sycophancy literature (arXiv 2511.05766) | Same-session continuation is the worst case: authorship is maximally known |
| **Prompt-level mitigations of anchoring are largely ineffective** — anchoring is a robust behavioral feature | arXiv 2505.15392 | Writing "do not over-trust the brief" into a lane would have been a no-op. Rejected on this basis |
| Cross-context review beats same-session review; the reviewing context should receive **only the artifact** — not the prompt, rationale, or trace | arXiv 2603.12123 | Validates handing `/cmk:interpret` the finished prompt alone; invalidates keeping the interview trail in the receiving context |
| **Crossover effect**: transferring upstream reasoning to a downstream agent helps to a threshold, then causes premature convergence. Rule: *selective context, not comprehensive history* | arXiv 2605.04361 | A same-session on-ramp leaks the whole trail, not the artifact — exactly the comprehensive history that converges the downstream early |

**The anchor is the artifact, not the session.** Moving the session boundary alone does not remove
it — a fresh session reading a brief that ends in `Start with: frame-change` is anchored to the
same conclusion, minus the rationale that would let it judge the conclusion.

So the fix is not isolation and not an instruction. It is **removing the conclusion from the
artifact**: no route, no lane name, no classification, no step list, no next step. What travels is
what is *true* — targets, boundaries, evidence, assumptions, open questions, done signal. The
receiving session classifies and routes on its own reading.

**Reverted in consequence:** the three lane seeds and their version bumps, restored to their
pre-change state. They existed only to consume a routed brief.

## Design decisions this record owns

| Decision | Grounded in |
|---|---|
| No `Route`, no lane name, no classification in the prompt | RED-4 crossover + cross-context rows |
| `disable-model-invocation: true` — never auto-fires ahead of a lane | RED-4: a model-invoked on-ramp reintroduces same-session anchoring by construction |
| Interview language chosen at setup; the prompt stays in the receiving session's language | `cmk:interpret` v1.2.1's tested split between companion language and carry-back language |
| Open-set stop instead of a fixed three-question cap | CLARITI measures a *quality* effect (answerability decays), not a hard cap. A cap is wrong for an interview the user is actively driving; the decay becomes a stop signal instead |
| Channel borrowed, not restated: `cmk:interview` owns one-question-at-a-time and the open-set rule | duplication sweep — one home per rule |
| No `Recommendation` slot in the card | keeps the skill from becoming a design interview; that interview belongs to whatever session receives the prompt |
| `[confirmed] / [unconfirmed]` marks travel **inside** the prompt | RED-3: telling the receiver where certainty is thin is what stops it guessing there |

## GREEN — controller run with the skill

**Scenario B**, `/cmk:prompt`: setup asks language and territory location; because no error
information exists the first card pins target identity ("which onboarding: signup, first-run, or
workspace invite?") with Territory lines read from the repo; then boundary; then done signal. The
wizard is recorded under `Not yet checked`, never as a target. The block ends on `Done when` and
contains no lane, no step list, and no classification.

| RED failure | Answered by |
|---|---|
| No target | `What this touches` REQUIRED slot + `[confirmed]/[unconfirmed]` mark + the red flag on a line with no path, object, or ID |
| No boundary | `Off limits` + `Must keep working` REQUIRED slots |
| Gaps forwarded instead of closed | The interview: ordered cards, open-set stop, "never ask what you can read" |
| Nothing another session can consume | The forged-prompt REQUIRED shape with its block rules |
| Solution treated as settled | `Not yet checked` slot |
| *(RED-4)* Downstream inherits an untested conclusion | Iron Law half two + the no-method block rule + `disable-model-invocation` |

## REFACTOR — `cmk:skill-authoring` review pass (2026-08-25)

Ship-column review against `cmk:skill-authoring` plus its `influence-principles.md` mapping table. No
subagent runs (Agent tool forbidden this session); this pass is text review, not behavior
measurement. Six findings, all applied:

| # | Finding | Class | Fix |
|---|---|---|---|
| 1 | The `disable-model-invocation` description summarised the *method* ("through a question-by-question interview") instead of naming the deliverable | frontmatter rule — description states outcome, never workflow | Rewritten to name the block and its parts: targets, boundaries, evidence, open questions, done signal |
| 2 | "Both halves fail the same way — the receiving session inherits a conclusion nobody tested" was **inaccurate**: half one's failure is a *guessed object*, which is the absence of a conclusion, not an inherited one | accuracy | Split into two named failures — *guesses the object* / *stops looking* |
| 3 | `There is no Recommendation slot. Where cmk:interview would name its pick…` was a **second ordinary-prose home** for the rule stated under *What it closes, what it leaves open* | duplication (both sites ordinary prose — not the exempt gate form) | Reduced to a one-line pointer at the home |
| 4 | `3. Stop. Do not name what the next session should do, and do not offer to do it here.` was a **third** prose home for the Iron Law's second half plus a restatement of the HARD-GATE | duplication | Reduced to `3. Stop there.` |
| 5 | The interview order made **Error information** unconditional — on a greenfield feature ask it spends the first card asking for error text that does not exist | unconditional rule where an observable predicate was needed | Rank 1 now opens `WHEN something is reported as misbehaving`, and says to start at rank 2 otherwise |
| 6 | No filled example — two `<placeholder>` templates and no real instance. `cmk:skill-authoring`: *"one excellent worked example… do not hollow it into a fill-in-the-blank template"* | missing worked example | Added one complete block from a four-card run, with a note on what it deliberately does **not** say |

**Wording calibration.** `influence-principles.md` maps *collaborative* skills to commitment and
shared-goal framing and warns that authority "crowds out judgment the recipe needs". This skill is
collaborative (an interview) plus recipe (the block contract), yet carries a full gate apparatus.
Kept deliberately, with one correction:

- The Iron Law's **second** half is a genuine no-exception gate whose failure mode ("just a
  helpful hint at the end") is exactly the kind rationalization erodes. Authority is earned there,
  and the rationalization table and red-flags list are the prescribed counters.
- The **interview** half needs judgment, so it carries no absolutes beyond the channel rules it
  borrows.
- **Corrected:** the red flag `Asking one more question after two "I don't know"s` reintroduced a
  count into a skill whose stop rule is explicitly *not* a count. Reworded to the signal the body
  actually states.

**Not changed, and why.** The `<HARD-GATE>` stays — it is a genuine no-exception gate matching the
form `cmk:scope` uses. The "a one-tap picker is fine **here**" line stays: it is an observable
conditional (setup versus interview card) carving an explicit exception to the channel Iron Law it
borrows, not a nuance clause reopening it.

**Sweeps after the pass.** Duplication: `recommend` now has one prose home plus a pointer, a
rationalization row, and a red flag (the last two are exempt gate form); `next step` has the block
rule plus the completion criterion; `ask what you can read` has one home plus a red flag. No-op:
every section re-read; nothing deleted, because no line failed.


## Rules this evidence owns

| Rule | Evidence |
|---|---|
| `What this touches` REQUIRED, with a confirmation mark | RED-1 (0/4), RED-2, RED-3 target-certainty collapse |
| `Off limits` + `Must keep working` REQUIRED | RED-1 (0/4), RED-3 shared-vs-contained action rates |
| A proposed solution is `Not yet checked`, never a target | RED-2 — the wizard arrived as the subject of the request |
| Ordered interview: error info → target → boundary/env → done signal | RED-3 CLARITI Shapley ranking |
| Stop on the open set; treat "I don't know" as the frontier | RED-3 answerability decay, re-read as a stop signal |
| No method, order, lane, or classification in the block | RED-4 crossover + cross-context rows |
| Never recommend; unanswered forks become `Open` | RED-4 — a recommendation is a conclusion the receiver will not re-test |
| Pointers not paste; load-bearing first, done last | RED-1 (0/4); context-rot position effect (18/18 models degrade with length; middle worst) |
| Interview language ≠ prompt language | `cmk:interpret` companion/carry-back split |

## Neighbor skills

- `/cmk:interpret` — companion in a parallel window; hand it the finished prompt alone
- `/ask-me-bro` — the user does not know which entry point applies at all
- `/cmk:pathfind` — multi-session destination fog
- `cmk:interview` — owns the interview channel this skill borrows; also the skill that closes
  design forks, which this one deliberately does not
- `cmk:scope` / `cmk:debug` / `cmk:amend` — common receivers of a forged prompt, reached
  because the receiving session read the prompt and decided, never because this skill said so

## Ship checklist

| Check | Result |
|---|---|
| `disable-model-invocation` description is one plain human-facing line, no keyword packing | Pass |
| Form match (REQUIRED slots + card recipe + gate + rationalization table) | Pass |
| No-op sweep | Pass |
| Duplication sweep | Pass — channel rules cited to `cmk:interview`, not restated |
| Token budget | 266 lines — under the 500-line / 5k-word ceiling |
| Cross-refs | REQUIRED SUB-SKILL: `cmk:interview` (model-invocable, legal from a user-invoked skill) |
| Structural lints | frontmatter, hand-offs, evals, templates, context7 — all pass |
| Worked example present | Pass — added in the review pass below |
| Wording calibrated against `influence-principles.md` mapping | Pass — see REFACTOR |
| Multi-model roster run | **Owed** — see Run mode |

## LENGTH PASS — 2026-09-07 (v1.0.0 → v1.0.1)

Brought `SKILL.md` from 266 to 194 lines to clear the 200-line budget ceiling. No behaviour
changed; every rule kept its home. Atom count before/after: **68 atoms in `SKILL.md` → 68 in
`SKILL.md` + 1 new atom pointing at `references/worked-example.md` = 69 across the two-file set** (the extra
atom is the sibling file's own reference heading, not a duplicate).

**Moved.** The worked example (four-card `exports are broken…` run, formerly a full narrated
illustration under `### Worked example`) went to `references/worked-example.md` beside `SKILL.md`, relocated
**verbatim** — same prose, same fenced block, same closing paragraph, no paraphrase. Per the
worked-example bucket rule (this repo lost a required-output slot in 2 of 3 runs once by moving a
worked example wholesale), the illustration was **not** moved wholesale: a compact positive-order
anchor stays inline in `SKILL.md` under the same `### Worked example` heading — every REQUIRED
slot (`What this touches` → `Off limits` / `Must keep working` → `What is already known` →
`Not yet checked` → `Open` → `Done when`) still appears in order with one real value each, so a
run reading only `SKILL.md` still sees the full positive-order shape; the sibling file is the
four-item, four-card, fully-narrated version for anyone who wants it.

**Reformatted, not reworded.** The rest of the cut came from joining hand-wrapped paragraphs and
list items into single unwrapped lines — a purely cosmetic change already used elsewhere in this
repo (`cmk:scope` carries lines up to 644 characters). No word was
added, removed, or changed; only the `\n` inside a paragraph moved. A handful of purely-spacing
blank lines between adjacent short rule statements (e.g. between "Never ask what you can read" /
"Stop when…" / "Watch the answers…") were also dropped, merging them into one paragraph — content
unchanged, only the blank-line separator removed.

**Deleted.** Nothing. No rule, rationalization, red flag, table row, or gate line was removed.

**Untouched by design (Gate bucket).** `## The Iron Law` (including the `<HARD-GATE>` block),
the `## Rationalizations` table, and the `## Red Flags` bullets were reformatted for line-joining
only — not one word thinned, moved, or reworded — per the bucket rule that gate restatements are
never moved or thinned.

**`skill-rule-inventory.py --diff` result.** 11 of 68 old atoms were flagged as "no home in the
new file set" — every one is the line-joining reformat above (the script captures only the first
physical line of a wrapped atom, so unwrapping it into one line changes the captured string even
though the words are identical). Verified each by grep against the new file:

| Flagged (old, truncated) atom | Confirmed intact at | Full text present |
|---|---|---|
| `1. **Interview language.**…first-class choices,` | SKILL.md:48 | ends "...Paths, identifiers, and error text stay verbatim." |
| `2. **Where the territory is.**…outside` | SKILL.md:49 | ends "...spending a question on it." |
| `REQUIRED SUB-SKILL: use \`clarify-decisions\`…in` | SKILL.md:53 | ends "...everything about the channel lives in that skill." |
| `1. **Error information**…failing` | SKILL.md:77 | ends "...its error text" |
| `- **Every line is a fact…**Nothing` | SKILL.md:115 | ends "...bug, a feature, or a spec change." |
| `- **Load-bearing first, done signal last.**…end of` | SKILL.md:116 | ends "...must never land in the middle." |
| `` - **`[unconfirmed]`…**…not to `` | SKILL.md:117 | ends "...it is less honest." |
| `- **Pointers, not paste.**…a` | SKILL.md:118 | ends "...could have fetched." |
| `- **Under ~40 lines.**…do` | SKILL.md:119 | ends "...do not compress the prose." |
| `2. Below it,…commits them` | SKILL.md:155 | ends "...language they chose not to decide in." |
| `Done when the interview stopped…block` | SKILL.md:194 | ends "...what pasting it commits them to." |

Every flag is a reformat, none a loss. Both contract-eval anchors reconfirmed present verbatim in
`SKILL.md`: `**Never ask what you can read.**` (line 84) and `Write NO code, edit NO project file,
and begin NO part of the work the prompt describes.` (inside the `<HARD-GATE>` block).

**Lints.** `lint-skill-length.py` — pass (194 lines, entry removed from
`scripts/skill-length-budget.json`, the only edit made outside this directory: a mechanical
ledger update, not a content change). Full `lint-*.py` sweep — pass, no failures.

**Not attempted.** No cut into `## The Iron Law`, `## Rationalizations`, or `## Red Flags` beyond
line-joining — those are Gate content and stayed word-for-word. Nothing else was judged too risky
to touch; the 194-line result already clears the 195-line target with one line of margin (six
under the 200 hard limit).
