---
name: cmk:write-cmk-skill
description: A pressure-tested cmk skill (SKILL.md, references, TESTS.md) ready to ship, or a review of whether an existing one is.
version: 1.0.0
disable-model-invocation: true
---

# Write CMK Skill

## Why a skill exists

A skill wrangles determinism out of a stochastic system. The root virtue is **predictability**: the agent takes the same *process* on every run — not that it emits identical output. A brainstorming skill should reliably diverge; its tokens vary, its behavior doesn't. Every rule in this document is a lever on predictability.

## The Iron Law

```
NO NEW SKILL AND NO EDIT TO A SKILL SHIPS WITHOUT A FAILING TEST FIRST
```

Writing skills is test-driven development applied to process documentation. The cycle:

1. **RED — watch it fail.** Run the scenario WITHOUT the skill (for an edit: with the current version). Record the exact failures and rationalizations verbatim — they define what the text must prevent. If the baseline agent does NOT fail, stop: there is nothing to fix, and text with no failure behind it is a no-op.
2. **GREEN — minimal text.** Write the smallest skill text that addresses those recorded failures — nothing for hypothetical ones. Re-run the same scenario with the skill. Compliance, or the text is unclear: revise and re-run.
3. **REFACTOR — close loopholes.** Under pressure the agent will invent new rationalizations. Capture each verbatim, add an explicit counter, re-test. Repeat until the skill holds under maximum pressure.

Wrote the text before running the baseline? You documented what you *guess* agents do wrong, not what they do wrong. Run the baseline now, before keeping a word of it.

Testing methodology — scenario construction, pressure types, micro-tests, description triggering, non-gate (technique/reference) tests, meta-testing — is in `references/pressure-testing.md`. Read it before any test run. Wording techniques that recruit compliance are in `references/influence-principles.md`.

## Match the form to the failure

Classify the baseline failure before writing anything; the form that fixes one failure type measurably backfires on another.

| Baseline failure | Write this | Not this |
|---|---|---|
| Knows the rule, breaks it under pressure | Hard prohibition + rationalization table (thought → reality) + red-flags list | Soft "prefer / consider" guidance |
| Complies, but the output has the wrong shape | Positive recipe or contract: what the output IS — its parts, in order | Prohibitions. Under a competing incentive agents negotiate with "don't X"; in head-to-head wording tests the prohibition arm produced *more* of the unwanted content than no guidance at all. A recipe leaves nothing to negotiate |
| Omits an element from something it already produces | A REQUIRED slot in the template it fills in | Prose reminders near the template |
| Behavior should depend on a condition | A conditional keyed to an observable predicate ("if `design.md` exists, cite its seams") | An unconditional rule plus exemption clauses |
| A check that must never be skipped or misjudged | A recipe of deterministic primitives the skill has the agent run and read — fixed `grep`/`git`/schema passes plus fixed rules on their output | Prose describing the check in the abstract — "confirm coverage" invites interpretation; a named pass over a named input, with a rule on the result, does not |

**No nuance clauses.** "Don't X unless it matters" reopens the negotiation the rule just closed — appending one nuance clause to a winning recipe degrades it from consistent to noisy. A real exception becomes its own conditional on an observable predicate. Exemption clauses don't scope, either: "the limit doesn't apply to code blocks" still suppresses code blocks — restructure so the rule can't reach the exempt part.

## Frontmatter and naming

- The `description` states **trigger + outcome, never the workflow.** Name the *deliverable* the skill produces (the outcome noun — "the `tasks.md` implementation plan", "a two-axis review verdict") plus when it fires; never summarize the *steps*. A process summary hands the agent a shortcut it obeys instead of reading the body: "use when a design is approved and the `tasks.md` plan needs writing" gets the body read; "use when planning — dispatches a reviewer between tasks" gets the summary obeyed and the body ignored. This reconciles the two-part external rule (state *what it does* AND *when*) with the body-skip failure — the outcome noun disambiguates among many skills, the step list is the hazard. Name the what-as-outcome; forbid the what-as-workflow.
- **Verb-first names under `cmk:`**: `cmk:write-cmk-skill`, `cmk:delivery-review`, `cmk:learn` — name the action (or the durable noun when the kit's family shape requires it), not a vague topic. The `cmk:` prefix is the kit namespace; the directory under `skills/` is the short name after the colon. Discovery still runs on the description, per the keyword rule below.
- **Keyword coverage**: pack the description with the words an agent or user would actually search or think — symptoms, the literal error text (`error`, `exception`, `e2e`, `tech debt`), tool and file names (`tasks.md`), and synonyms (`spike`, `mock up`). Discovery is keyword match; a skill nobody finds is a skill that doesn't exist. The outcome noun does double duty here.
- **Two failure directions, both tested not guessed.** *Over*-summarizing has the failure mode above; *under*-specifying is the commoner one — the skill never fires at all. Keyword coverage and the outcome noun fight the second; omitting the workflow steps fights the first. The description is the highest-leverage line in the skill and the one field you cannot eyeball — trigger-test it per `references/pressure-testing.md`.
- **House conventions — deliberate divergences from the generic guidance, kept for self-invocation.** Descriptions open in the second person ("Use when…") because the line reads as a direct instruction to the deciding agent; must-not-skip content uses `## Red Flags`, `## The Iron Law`, or a `<NON-NEGOTIABLE>` block, the house equivalent of a generic `## Critical` header. Both stay consistent across the set — an outlier that mixes styles is drift, not variety.
- User-invoked skills carry `disable-model-invocation: true` — so they **cannot be auto-invoked**, and no skill body may tell the agent to *invoke* one. A hand-off reaches a user-invoked skill only by naming it for the user to run (`/write-cmk-skill`, `/interpret`); `REQUIRED SUB-SKILL: use \`x\`` is for model-invocable targets only. Directing the agent to invoke a `disable-model-invocation` skill is a dead-end hand-off — a real bug, not a style nit.
- **Two description audiences, and every rule above is about the model-facing one.** A model-invocable description routes: it earns keyword coverage, symptom words, and the outcome noun. A `disable-model-invocation` description **routes nothing** — the agent never sees it, and the user reaches the skill by typing its name. Write those as one plain human-facing line naming the deliverable. Packing keywords into a user-invoked description is text nothing reads; "discovery still depends on the words the user types" is false — the user types the *name*.

## Vocabulary

Write skills with these terms; review skills against them.

- **Leading word** — a compact concept the model already carries from pretraining ("seam", "tracer bullet", "red") that anchors a whole region of behavior in a few tokens. Repeated as a token, it accumulates a distributed definition across the skill; three sentences of restatement often collapse into one such word. A coined word recruits no priors — reach for a pretrained one first.
- **Completion criterion** — every step ends on a condition the agent can check ("suite green, output pristine", not "tests look good"). The defense against premature completion: a vague bound lets attention slip to *being done* instead of the work.
- **The no-op test** — does this line change behavior versus no skill at all? A line can be true, relevant, and still a no-op ("be careful"). Disputes about what the default behavior is are settled by running the scenario, never by debate. A sentence that fails is deleted whole, not trimmed.
- **Duplication** — one meaning given a second home. The deliberate inverse of a leading word, which repeats a *token* to concentrate attention; duplication repeats the *meaning*, so changing the behavior becomes a multi-place edit and the restated rule reads as weightier than its rank. The no-op sweep does not catch it — each copy is live and passes on its own — so sweep for it separately: name the one home for each rule, and delete or replace every other statement of it with a pointer to that home. **The prescribed gate form is exempt**: a `## Red Flags` bullet or a rationalization row echoes its rule *on purpose*, as the counter the failure table calls for — it is the rule's symptom, not a second home for it. Count a restatement as duplication only when both sites are ordinary prose.
- **Negation trap** — a prohibition names the banned behavior into context, where it half-reads as an instruction. Prompt the positive ("write one-line comments") so the banned pattern is never spoken. The one exception is pressure-gate skills, where hard prohibitions plus explicit counters are exactly the right tool — see the failure table above.
- **Information hierarchy** — in-skill steps, then in-skill reference, then disclosed reference behind a context pointer. Inline what every run needs; push behind a pointer what only some branches reach. The pointer's *wording*, not its target, decides whether the material is ever loaded — a must-read file behind a limp pointer is a variance bug: sharpen the pointer before inlining the content. Keep reference files **one level deep** from SKILL.md (a file reached only through another file gets skimmed, not read); give any reference over ~100 lines a table of contents at the top.
- **Token budget** — session-injected skills stay minimal: every token is paid on every turn. Three loading levels set the budget: metadata (name + description, ~100 tokens) is paid every turn of every session; the body is paid every turn *once the skill fires*; a reference file costs nothing until its pointer is followed. This kit's hard ceiling for any SKILL.md is **150 lines** (`scripts/skill-lint.sh`); move detail into `references/*.md`. Length is a failure mode in itself, even when every line is live.

## When not to write one at all

A mechanically-checkable rule is not a reason to skip a skill — it is a reason to make the skill *run the check* rather than describe it. When a repo carries an ambient enforcer (a pre-existing linter, a CI schema check, a git hook) the skill just names it and reads its result. When it does not — the common case, since this set installs nothing into a consuming repo — the skill carries the deterministic recipe itself: the exact `grep`/`git`/schema passes the agent runs and the exact rule on their output. What a skill must never be is a wordy restatement that adds no rule the passes don't already encode. Documentation earns its context budget on the judgment calls a check cannot make; the deterministic parts belong in exact passes, not prose.

## When to split

Split a skill in exactly two cases:

1. **Genuinely distinct trigger.** A separate condition or leading word should fire it on its own, or another skill must reach it independently.
2. **Hiding post-completion steps.** Later steps visibly tug the agent into rushing the current one, and the split places them behind a *real* context boundary — a sub-skill hand-off or a subagent dispatch. An inline mention leaves them in context and hides nothing.

Anything else is granularity for its own sake, paid for in context load or the user's memory.

## Examples

One excellent worked example beats many mediocre ones: complete, runnable, commented for WHY, drawn from a real scenario, in the single most relevant language. Do not port it to five languages or hollow it into a fill-in-the-blank template.

## Cross-references

Reference other skills in this set as prose — `REQUIRED SUB-SKILL: use \`cmk:learn\`` — never as file links into another skill's folder. Links force-load content and couple folders. Files that live beside your own SKILL.md are referenced by relative filename, with pointer wording that says when to load them.

## Rationalizations

| Thought | Reality |
|---|---|
| "The skill is obviously clear" | Clear to its author is the one perspective that never counts. Run it |
| "It's a tiny edit" | Edits regress skills exactly like code. Baseline against the old version first |
| "Testing a document is overkill" | An untested skill fails in production, where each failure costs a whole session |
| "Reading it over is basically testing it" | Reading measures fluency, not behavior. Only a run answers the no-op test |
| "I'll fix it if problems come up" | Problems come up as agents silently ignoring the skill. You'll never see the failure |
| "Batching several skills is more efficient" | A batch of untested skills is a batch of untested code |

## Deployment checklist

Create a todo for each item.

**RED**
- [ ] Pressure scenarios written (3+ combined pressures for gate skills) per `references/pressure-testing.md`
- [ ] Model roster named; baseline run on each model the skill ships to, every transcript labelled with its model
- [ ] Baseline run without the skill (or with the old version); failures and rationalizations recorded verbatim
- [ ] Baseline actually failed — otherwise stop, nothing to write

**GREEN**
- [ ] Failure classified; form matches it (prohibition set / recipe / REQUIRED slot / observable conditional)
- [ ] Description = trigger + outcome noun, no workflow steps; verb-first `cmk:` name; literal keywords a user types present
- [ ] Description trigger-tested: should-fire / should-not-fire queries run, both directions checked (per `references/pressure-testing.md`)
- [ ] Minimal text addressing the recorded failures; one worked example at most
- [ ] Re-run with the skill on every model in the roster: the weakest one complies

**REFACTOR**
- [ ] New rationalizations countered explicitly; rationalization table and red-flags list built (gate skills)
- [ ] Behavior-shaping wording micro-tested: no-skill control, fresh context per sample, 5+ reps, every flagged transcript read manually
- [ ] Meta-test done: tested agent confirms the text was clear and names nothing that would have made compliance easier
- [ ] Re-tested until no new rationalizations appear

**Ship**
- [ ] No-op sweep: every sentence passes the no-op test or is deleted whole
- [ ] Duplication sweep (separate pass — the no-op sweep cannot catch it): each rule has one named home; restatements deleted or replaced by a pointer
- [ ] Every `disable-model-invocation` description is one plain human-facing line — no trigger keywords, no symptom words
- [ ] Core body within the 150-line budget; reference disclosed behind well-worded pointers, one level deep; any reference >100 lines has a TOC
- [ ] Cross-references are REQUIRED SUB-SKILL prose naming `cmk:*`; supporting files referenced as `references/<file>.md`
- [ ] Every hand-off invokes only a model-invocable skill; any `disable-model-invocation` target is named for the user to run, never invoked
- [ ] Structural + routing check (agent-run): frontmatter valid (name + description + version; `disable-model-invocation: true` on user-invoked skills), `cmk:` name matches directory, body within the line budget; and the description trigger-tested by hand — run its should-fire and should-not-fire queries per `references/pressure-testing.md` and confirm each routes as intended
- [ ] `version:` bumped — patch for wording that changes no behavior, minor for a new rule or slot, major when existing usage breaks. The RED/GREEN evidence for this edit is recorded in the skill's `TESTS.md`, and any runnable assertion it established is in its `eval.json`. Run `bash scripts/skill-lint.sh` before ship.

**Do not batch-create skills.** Finish, test, and validate one skill completely before starting the next.
