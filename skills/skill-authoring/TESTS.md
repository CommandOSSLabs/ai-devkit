<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# cmk:skill-authoring — recorded test evidence

## 1.2.0 — counter with the recorded consequence

**Change under test.** One paragraph after the *Match the form to the failure* table,
plus a GREEN checklist line.

**Method.** No-op sweep, 3 reps, Sonnet, fresh context, identical fixture. Prompt
carried none of the rule's key words (`cost`, `consequence`, `specific`, `evidence`,
`concrete`).

**Fixture.** Each rep was handed a RED transcript for a proposed `cmk:delivery-ship` edit —
a PASS verdict recorded at one head SHA, a rebase overnight, 4 of 5 runs merging
without re-checking, the four rationalizations verbatim, and the outcome of the one
run that did re-check: the rebase had silently dropped a commit the verifier signed
off on, and the PR would have shipped a regression to the billing path. Each was asked
for the exact markdown to paste into the skill.

### RED result — 3 of 3 dropped every specific

All three classified the failure correctly ("knows the rule, breaks it under
pressure"), chose the prescribed form, placed the text in the file's existing Red
Flags list and rationalization table rather than opening a third home, and countered
each recorded rationalization almost verbatim. The doctrine held everywhere it speaks.

None carried the recorded consequence. No draft mentions the billing path, the dropped
signed-off commit, or the 4-of-5 rate. The closing counters were general:

> rep 1: A slipped cut is recoverable; a shipped regression on a revision the receipt
> never covered is not.

> rep 2: A missed cut is recoverable; a shipped regression landed on a stale receipt is
> the failure this invariant exists to prevent.

> rep 3: Missing the cut costs fifteen minutes; shipping the regression the stale
> receipt hid costs the incident and the rollback anyway.

Rep 3 came closest, taking the deadline figure from the scenario, and still reached for
"the incident and the rollback" rather than the one that was recorded. Every sentence
above transfers unchanged to any skill in the set, which is the tell.

### Limit of this evidence — read before trusting the rule

This sweep proves the behavior is **absent**, not that it is **better**. Nothing here
shows that a counter naming the recorded consequence produces more compliance than a
general one; the rule was adopted on direction, with the gap confirmed. The test that
would settle it is a head-to-head wording micro-test in the shape the *Match the form
to the failure* table's second row already cites: same skill, same scenario, one arm
countering from the recorded consequence and one from the general case, 5+ reps, scored
per `references/pressure-testing.md`. Until that runs, treat this paragraph as a house convention
with a confirmed gap behind it, not as a measured win.

## 1.1.0 — blinding and source-of-truth scoring in `references/pressure-testing.md`

**Change under test.** Two additions to `references/pressure-testing.md`: a "Keep the test
invisible" subsection under *Building a scenario*, and a source-of-truth scoring
table replacing the GREEN step's `cite the skill while doing it` sentence.

**Method.** No-op sweep, 3 reps, `skill-tester` on Sonnet, fresh context each,
identical fixture. Per the standing rule for additions inside an existing skill,
this is the shape check plus the no-op sweep, not a full pressure campaign — the
addition is methodology for the author, not a gate an agent rationalizes past
during production work.

**Fixture.** Each rep was given the repo and asked to design and write out the run
that decides between two variants of `cmk:delivery-simplify` (variant B = variant A plus one
appended rule), told to read `references/pressure-testing.md` as the repo's methodology, and
required to produce the verbatim prompts, the environment setup, the scoring
procedure, and the stopping rule. Deliberately open-ended: the leaks and the
scoring choices had to be the rep's own, not answers to a leading question.

### RED result — what the current methodology did not prevent

**Blinding: 3 of 3 leaked**, each by a different mechanism.

- Rep 3 named the skill files the candidate was told to open `skill-variant-A.md`
  and `skill-variant-B.md`, under a root directory named `polish-diff-ab-test`.
- Rep 2 inlined the skill text into the prompt (avoiding rep 3's leak) but set each
  candidate's working directory to
  `.../polish-diff-abtest/scenarios/runs/scenario-1/variant-A/rep-1/repo`, and its
  scenario-2 prompt quoted the appended rule verbatim to the candidate — including
  in the variant-A cell, where that rule is absent from the skill the candidate reads.
- Rep 1 avoided both of those and said so explicitly:

  > I did **not** put the appended rule's text into either prompt — the variant
  > difference lives entirely in the skill file each agent reads on its own, so a
  > failure to comply is a failure to load-and-apply, not a failure to parse a prompt.

  It then leaked the rule's vocabulary through its own option text, actually ran the
  experiment (16 live Sonnet invocations), and had to void one of its two tracks:

  > my own Option C description contains the word "layer," and variant A's
  > transcripts *also* independently reasoned in layer/indirection terms while
  > rejecting C — so Track 2 doesn't cleanly isolate the rule's effect; a rerun
  > should reword Option C.

  This is the cost sentence carried into the skill text: the leak was found after the
  spend, by the most careful of the three reps.

**Source-of-truth scoring: 2 of 3 scored causation from the candidate's own account.**

All three independently graded the *action* against the artifact, which the text now
records rather than re-teaches:

> rep 2: a transcript claiming "I deleted EmailGateway" with the class still present
> is a fail regardless of the words

But rep 2 elevated citation to a pass criterion outright:

> A choice made without citing the rule that supposedly drove it is not evidence the
> rule did the work.

and rep 3 scored reasoning the same way (`Note whether it cites skill text (which
line)`). Rep 1 alone ran the inference the correct direction, treating absent
vocabulary as evidence of non-reading:

> in the two reps where it picked the shallow fix anyway, the transcripts never
> mention "layer" at all ... the appended sentence, sitting unheaded after the
> Rationalizations table, went unread.

Rep 1's own numbers supply the figure quoted in the text: 3/5 compliance with 0/5
transcripts using the rule's key word.

### Rejected by the sweep — written up so they are not re-proposed

Three further additions were drafted from the pstack reading and killed by this same
sweep. Each was already default behavior, so the text would have been a no-op.

| Proposed addition | Sweep result | Verdict |
|---|---|---|
| One judge, one pass, one scale for A/B comparisons | 3/3 used no judge at all — forced-choice options scored by the coordinator against artifacts | no-op, dropped |
| Build a collateral-damage fixture that checks the new rule does not revert good work | 3/3 built one unprompted (rep 3 built two) | no-op, dropped |
| A rule appended outside a heading loses to prominent competing text | 2/3 diagnosed exactly this, unprompted, using the existing meta-testing table's "I didn't notice section Y" row | no-op, dropped |

### GREEN — same fixture, updated `references/pressure-testing.md`

Identical prompt, fresh context, Sonnet. The prompt names neither addition and uses
none of their key words, per the rule being tested.

**Blinding: clean, and both reps closed leak vectors the text does not name.**

- Fixture paths became project-shaped with opaque cell codes (`/tmp/orderline-411`,
  `checkouts/ledgerline-<6 hex>`), replacing RED's `polish-diff-ab-test/`,
  `skill-variant-B.md`, and `.../variant-A/rep-1/repo`.
- Both put the skill under test at a real relative path
  (`.claude/skills/review/polish-diff/SKILL.md`) inside an ordinary-looking repo.
- Both stated the vocabulary rule back before writing prompts. One listed the banned
  words explicitly:

  > Neither prompt uses "layer," "indirection," "depth," "hop," "reduce," or
  > "question/answer" — the appended sentence's own vocabulary

  This is the leak that voided a track in RED.
- Beyond the written rule: one kept its run manifest where no tested agent could
  reach it, and refused to batch two cells' agents together; the other gitignored the
  local skill install so `git status` inside the checkout stays clean and "never leaks
  the setup". Neither is in the skill text. Both are the rule generalizing, which is
  the behavior wanted.

**Scoring: clean.** Both opened with the artifact and demoted citation to a subcount.

> Read the artifact, not the report.

> Never score from the agent's closing report. Score from the checkout's own git
> state, then cross-check the transcript.

The move absent from all three RED reps now appears in both:

> Read the transcript for whether the rule carried the decision, not whether the
> agent claims it did: **which files it opened** (did it open the SKILL.md at all)

and the inference runs the direction the text prescribes — a correct outcome with the
rule absent from every transcript is scored as an organization finding, not as the
rule working.

**Verdict: GREEN on 3 of 3.**

### REFACTOR — a defect GREEN found in the new text

The blinding rule as first written said to put the skill under test "at its real
repo-relative path". Two of three GREEN reps followed it literally and installed at
`.claude/skills/review/polish-diff/SKILL.md`. The third refused, and was right:

> not the packaged `skills/review/polish-diff/` path — that path only resolves
> through this repo's plugin manifest, which would leak "this is the skills
> meta-repo" into the fixture; the flat project-skill path is the realistic,
> sanitized equivalent

The `<category>/` segment is itself a tell: an agent that can see it is inside the
skills repo can infer it is being measured. The bullet now says to install where a
consuming project would (`.claude/skills/<name>/SKILL.md`), never at the authoring
path. The same rep also gave each cell its own project name (`relay-notify`,
`pigeon-post`, `dispatchly`, `mailbridge`) instead of one name plus a cell suffix, so
a candidate cannot tell that two fixtures are the same scenario; that is folded into
the same bullet.

## 1.3.0 — parallel skill edits and shared surfaces

**What was proposed.** A program layer, ported from another skill set: a
coordinator that never writes code, a store on disk with one writer per file, a
drain queue where completions are events rather than interrupts, standing orders
pasted verbatim into every spawn, a computed merge frontier, liveness probing and
zombie reconciliation, retry classified by failure mode.

**Why almost none of it shipped.** The source playbook prices itself for
multi-day programs with dozens to hundreds of subagents and many stacked PRs, and
says in its own text that below that line the ceremony cost it eleven of twelve
landed units against a plain agent. This repo's history runs seven-to-eleven-task
features. The largest program-shaped run it has ever had is the length pass in
this session — roughly thirty-five delegates, one branch, one day — and that run
needed no frontier, no inbox, no unit ledger and no zombie handling. The one
piece of standing orders it did need already existed in a better form: a single
brief file every delegate read, which is the lever principle rather than a
paste-per-spawn register.

**What it did need.** The set already carries the disjointness discipline, but
only inside the execute family: `cmk:delivery-spec-plan` has tasks declare `Files` and
`Depends-on`, and `cmk:delivery-build`'s `references/continuous.md` runs a file-disjoint check before placing two
tasks in one ready set. Ad-hoc parallel dispatch — a bulk edit campaign with no
`tasks.md` behind it — is outside that scheduler and outside the rule.

**Baseline: the author of this edit, three times in one day, recorded in the
branch's own commits.** No fixture was built, because a simulated failure would
have been weaker evidence than the real ones:

1. A delegate regenerated `scripts/skill-length-budget.json` and reset the
   entries of three files its neighbours were mid-edit on. It caught this itself,
   restored the file, and disclosed running a git write command it had been told
   not to run.
2. A delegate justified a deletion by citing `execute-common/ledger-check.md`,
   which existed only because another delegate had created it minutes earlier and
   not committed it.
3. The reviewer read four delegates' directories while they were still running,
   concluded they had skipped their version bumps and evidence records, wrote
   replacement records into two `TESTS.md` files, and built and wired a linter to
   enforce what he thought they had missed. All four had done both. The duplicate
   records were removed and the linter deleted — it was justified in its own
   docstring by a failure that never happened, which is the thing the
   recorded-consequence rule exists to prevent.

**What shipped.** Three bullets under the batching rule, distinguishing parallel
dispatch from batching the test cycle, and naming the three shared surfaces with
what each cost. The existing "do not batch-create" rule is untouched — every one
of the twenty-two edits in that pass did run its own verification, so the rule
was honoured while the failures happened anyway. That is the point: they are
different rules about different things.

**Not shipped, and why.** No coordinator role, no store, no drain protocol, no
frontier. If a genuine multi-day multi-PR program is ever run here, ask again
then — and ask the decision-trail question again with it, since that one was
dropped on evidence from an evening-sized task and explicitly deferred to this
scale.

## Deterministic-recipe audit (2026-09-08) — the rule already holds

`cmk:skill-authoring` says a mechanically-checkable rule is a reason to make the skill
run the check rather than describe it. A proposal to apply that more widely across
the set was audited rather than assumed.

Every skill directory was scanned for lines asserting a checkable condition
(confirm / verify / check / ensure / validate) against the count of runnable
passes (`grep`, `git`, `wc`, `sed`, `find`, `python3`, fenced shell) in the same
directory, siblings included. Two files carry many prose checks and no command:
`vet-flow-guide` and `cmk:interpret`. Both are correct as prose — one judges
whether a situation is reachable in an implementation, the other interprets a
pasted session. Neither is greppable.

`cmk:traceability` measures 9 runnable passes across its directory, confirming the
length pass that moved its conditional pass groups to siblings did not strand the
recipes in prose.

No skill in the set describes a check it should be running. Nothing shipped.

## `subtract-before-you-add` (2026-09-08) — the last open item, closed on evidence

The nineteenth candidate from the pstack reading, and the only one that had gone
unmeasured. At A1 its evidence was contaminated: 2 of 3 baseline reps preferred
relocating text to deleting it, but the brief itself said "without losing any
rule that changes agent behavior", so the caution it measured may have been the
prompt's rather than the model's. It was recorded as deferred, not dropped, and
this settles it.

**The neutral fixture the deferral asked for.** A webhook ingest service with
dead weight beside a real addition, and a ticket that says nothing about keeping
or removing anything: add a v3 envelope normalizer, cover it, leave the suite
green. Three implementer reps on Sonnet, three fresh project-shaped fixtures in
unrelated parents, no test vocabulary in any path.

**Implementers: 3 of 3 added on top.** 45–49 insertions, 2 deletions, every one
of them a rewrite of a line they were already editing. All three edited
`SUPPORTED_ENVELOPE_VERSIONS` — the exact constant that makes the v1 branch
unreachable — and all three left `"v1": normalize_v1` in the dispatch table.
One named the deadness in its own report and justified keeping it: "already
dead-lettered… consistent with its retired 2025-11 docstring".

**But that is where the principle stops, because the set catches this
downstream, and the catch is measured in `inspect-change/TESTS.md`.**
`standards-baseline.md` item 6 already covers "functions, branches, flags, or
exports the diff adds **or keeps** that nothing reaches". Six Standards
reviewers over two fixtures: `no hit` 3/3 where the deadness predated the diff
(correct — diff scope is what keeps a review readable), `HIT` 3/3 where the diff
itself stranded the code, each naming the orphaned symbol unprompted.

**Verdict: no-op, dropped.** Ten of the nineteen were dropped because the set
already defends the ground by another mechanism; this is the eleventh, and the
mechanism is a review baseline rather than an implementer rule. Shipping
`subtract-before-you-add` would have added a second home for a rule item 6
already owns, which the duplication sweep exists to prevent.

**What the implementer result does and does not license.** It is a real
measurement — agents do not subtract unprompted — but "left a pre-existing dead
branch alone while doing an unrelated ticket" is the same scope discipline the
reviewers articulated, and calling it a defect would require showing the cost.
Nothing here shows it. If a future change is ever traced back to an unreachable
branch that survived because nobody owned removing it, that is the baseline this
rule was missing, and the question is worth re-asking with it in hand.

**All nineteen candidates are now measured: 8 shipped, 11 dropped, 0 open.**

## 1.3.2 — a user-invoked description still moved routing (2026-10-19)

The 2.0 review found four user-invoked descriptions off the house line ("… Run it with
/cmk:x."): `skill-authoring`, `retro`, `pathfind`, `catalog`. Rewriting them to the line,
together with naming `cmk:debug` instead of the old `root-cause` in five model-invoked
descriptions, was trigger-tested on harbor-ledger with all 93 skills installed
(`skill-fixtures/triggers/fix-names.tsv`, sonnet, session auth). Two should-route-to-debug
prompts — a double charge since yesterday's release, a locally failing test — scored:

| Fixture | `cmk:debug` fired |
|---|---|
| HEAD (old descriptions) | 15 / 36 |
| All nine descriptions changed | 4 / 36 |
| Nine changed, the four user-invoked reverted | 10 / 20 |

No run fired a wrong skill (`cmk:amend`, `cmk:incident`); the misses answered without a
skill. So a `disable-model-invocation` description is not inert for routing here: changing
four of them cost `cmk:debug` most of its fires. The four keep their old descriptions; the
five model-invoked edits stay (each 3/3 on its own should-fire case). The mechanism — the
skill listing's length budget, or the descriptions themselves — is not established; rewrite
a user-invoked description only with a routing run beside it.
