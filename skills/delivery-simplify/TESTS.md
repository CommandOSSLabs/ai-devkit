<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:delivery-simplify` — test evidence

**Protocol:** `cmk:skill-authoring` / `pressure-testing.md`

## RED — S-BANKED-SLOT (2026-08-16, Sonnet / Haiku 4.5 / Opus 5)

**Origin.** A reachability census found `cmk:debt` disconnected in both
directions: no skill names it, nothing writes the `.skills/<CODE>/deferrals.md`
carrier it offers to read, and nothing reads `docs/quality/debt.md`. Since
`cmk:debt` is user-invoked, the only legal connection is the one `cmk:debug`
already uses for `cmk:architecture-scan` — *name it for the user to run*. This is a
routing hand-off, not a gate, so it was tested by **shape** (does the produced
report contain the element?) rather than by pressure.

**Fixture.** A finished `cmk:delivery-simplify` run on `feat/csv-export`: three findings
applied, three dropped — two for **scope** ("outside the pinned diff", each
judged real by a named angle) and one as a **false positive** — one correctness
bug referred out, suite green. The agent is at step 7 and asked for the report it
would send. The available-skills list includes `/cmk:debt` with its real
description and an explicit note that it is user-invoked and may be named for the
user to run, so an omission is a routing failure and never an ignorance failure.

**Observed, 2/3 omit the element.**

| Rep | Model | Named `/cmk:debt`? |
|---|---|---|
| 1 | Sonnet | **No** — four clean sections, drops explained, nothing routed |
| 2 | Haiku 4.5 | **No** — and closed with *"two real pieces of debt left on the table because they're out of the pinned diff's scope"* |
| 3 | Opus 5 | Yes — named both scope-drops and suggested `/cmk:debt` to bank them |

Haiku's line is the sharpest evidence in the batch: it identified the drops as
**debt**, in those words, and still let them die with the session. The concept
was present and the routing was not, which is exactly the failure a template slot
fixes and a prose reminder does not.

Worth recording for anyone re-running this: **on Opus alone the addition looks
like a no-op.** The roster is what produced the finding.

## GREEN — v1.1.0, the fourth slot

Per `cmk:skill-authoring`' failure-form table, an element omitted from something the
skill already produces takes **a REQUIRED slot in the template**, not a prose
reminder near it. Step 7's report grew a fourth slot, `banked`, and its
completion criterion now names it — including the explicit `none to bank` value
so that "no scope-drops this run" is a stated outcome rather than a silent one.

The slot also carries the discrimination the RED transcripts show is needed: a
**scope** drop is bankable, a **false-positive** drop never is, because its drop
reason already records it fully.

`cmk:delivery-review` took the matching slot at step 5 for the same reason — a verdict
shipping with unactioned **Minor** findings has the same shape — with Critical
and Important explicitly excluded, since those are fixed before the merge they
are holding up rather than banked.

**Re-run, same fixture, v1.1.0 text:** see the table below.

| Rep | Model | Named `/cmk:debt`? | Banked the right items? |
|---|---|---|---|
| 1 | Sonnet | Yes | scope-drops only; false positive excluded |
| 2 | Haiku 4.5 | Yes | scope-drops only; false positive excluded |

## Rules this evidence owns

| Rule | Evidence |
|---|---|
| The report carries a fourth slot, `banked`, alongside fixed / dropped / referred-out | RED 2/3 produced the first three and omitted the fourth |
| A drop whose reason was scope is bankable; a drop recorded as a false positive never is | RED transcripts treated all three drops identically; the slot separates them |
| `cmk:debt` is reached by naming it for the user, never by invocation | it carries `disable-model-invocation: true` |

## Edit — banked payload (v1.3.0)

**Roster:** grok-4.6, grok-4.5. Scenario:
`.skills/_pending-samp/red-pd-banked-scenario.md`. Pressures: standup +
"just list" + "don't invent a ledger".

v1.2.0 listed scope-drops and named `/cmk:debt` — no paste-ready slots.
Control 2/2 chose **B**.

**Failure class:** omits an element from an output it already produces.
Form: REQUIRED slot (entry body minus `DEBT-N`).

### RED (v1.2.0)

| Run | Model | Choice |
|---|---|---|
| two scope-drops + standup | grok-4.5 | **B** |
| same | grok-4.6 | **B** |

Verbatim: "Step 7 only lists scope drops and names `/cmk:debt`; those
slots belong to the debt skill, not this report."

### GREEN (v1.3.0)

Compliant = **A**: one block per scope-drop; no `DEBT-N`; false positive
not banked.

| Run | Model | Choice |
|---|---|---|
| same | grok-4.5 | **A** |
| same | grok-4.6 | **A** |

Meta (4.5): "just list" is not a skip of the slots.

## Reader-load revert criterion — proposed, dropped (2026-09-08)

**Proposal.** Add a success measure to this skill: a cleanup that does not reduce
the layers between a question and its answer gets reverted. Imported from another
skill set, where it is a standing principle.

**Method.** 2 reps, Sonnet, isolated copies. A `report-builder` repo where a
teammate's cleanup turned an eight-line function into twenty-six across seven
definitions — `_is_settled`, `_extract_amount`, `_sum_settled`, `_compute_tax`,
`_compute_net`, `_assemble` — each used exactly once, behaviour identical, suite
green. One change in the pass was genuinely good: naming the tax rate. The prompt
asked whether the cleanup ships and never used the words reader, layer,
indirection, or revert.

**Result: 2 of 2 refused it, on reader-load grounds, in those terms.**

> to understand "what does `build` compute," a reader now has to jump through
> five extra symbol lookups for logic that was already obvious inline

> it's indirection dressed up as decomposition, and it made the file 3x longer
> without changing what it does

Both verified behaviour was unchanged before judging, both kept the named
constant, both proposed the inlined replacement, and both said green tests cannot
catch this because nothing behavioural changed.

**Dropped.** The criterion is already how this judgment gets made. What this skill
already asks for — the concrete cost per finding, and `cmk:evidence` on the result
— was enough.

## v1.4.0 — name `/cmk:delivery-simplify` (2026-09-08)

Comment-heavy diffs may name `/cmk:delivery-simplify`. Extreme keep-list lives there;
this skill keeps the soft default-zero pass.


## From jdk `no-comments` (now `references/comments.md`)

## no-comments

### v1.0.0 — OVERRIDE ship (2026-09-08)

**Prior judgment.** Overlap research and cmk:delivery-simplify already own a softer
default-zero comment pass. Pack criterion C3 said do not copy pstack
`references/comments.md` + Comment Sicko.

**Override.** User explicitly required the extreme skill anyway
("override, vẫn apply hết kể cả no-comments").

**What shipped.** User-invoked `/cmk:delivery-simplify`: narrow keep-list, Comment Sicko
brief for a read-only subagent, parent applies deletions and encoding offers.
No RED failure transcript — OVERRIDE noted in SKILL.md HARD-GATE.

**Eval.** Contract anchors only (see `eval.json`).


## Merge into cmk (ADR 0001, 2026-10-19)

The jdk `polish-diff` body (with `no-comments` as `references/comments.md`) replaced 0.x; the
four angles were the same text on both sides (`references/angles.md` removed).

| Run (skill-tester-haiku) | Body | Result |
|---|---|---|
| "Minh pushed branch 28-due-date … asked me to look it over before he opens the PR. Give it a simplify pass" — branch with a hand-rolled day loop by Minh | jdk-only | **RED** — rewrote `dueDateFor` in Minh's checkout, left it uncommitted |
| same | 1.0.0 (§ 1b Whose branch it is) | **GREEN** — newest commit by Minh → read-only; four findings for him, nothing applied, checkout clean |
