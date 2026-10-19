<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:scope` — knowns inventory + blindspot (unknowns loop)

## v2.2.0 — itinerary trim (2026-09-14)

**RED.** Research session + OpenAI Astra: high-freedom product-shaping written
as a 2,582-word itinerary (8 sub-skill calls in the root). Guardrail-to-handcuff:
recipe-style constraints that once helped weaker models now overconstrain
stronger ones. The 1% constitution loaded this skill on a research-and-report
ask.

**GREEN.** Root is a router: HARD-GATE, six steps, Blindspot, Knowns,
guarantee check, catalog-query, spoken tier. Interview is
`cmk:interview`, not a restated card schema. Words 2582 → 1304. Eval
anchors (`Write NO code, scaffold NOTHING`, Blindspot, Knowns, catalog-query,
unverified) unchanged.

## Baseline already strong (no-op if re-stated alone)

| Scenario | Result |
|---|---|
| S-BS-U1 over-specified architecture + time | 2/2 challenged `OAuthProvider`/`AuthService` against existing seams |
| S-BS-U2 unfamiliar module | Territory traps surfaced before preference Q |
| S-BS-U3 taste / feel | Multi-variant cmk:spike before lock |
| S-BS-U5 authority “don’t open src/auth” | Disobeyed; behavioral requirements only |

Do **not** delete those behaviors; they are pre-existing.

## RED — S-BS-STRUCT (technique / omission)

**User.** Second auth provider; low module familiarity. Complete step 1 only.

**Observed.** Rich scan with traps in prose; **no** named Knowns inventory;
**no** required Blindspot section title; step-1 user text = "what exists".

**Failure class.** Omits handoff-shaped elements from an already-good step 1.

## GREEN — same, upgraded skill

**Observed (1/1).**
- Scan digest includes **Blindspot**
- `.skills/*-knowns.md` with locks / known unknowns / unknown knowns / assumptions
- STEP1_OUTPUT surfaces blindspot for low familiarity

**Artifacts (run):** `/tmp/bs-struct-green-56143/.skills/github-auth-knowns.md`,
`github-auth-scan.md`, `STEP1_OUTPUT.md`

## Rules this evidence owns

| Rule | Evidence |
|---|---|
| Scan MUST include **Blindspot** | RED missing named section; GREEN present |
| Knowns inventory REQUIRED before step 2 | RED missing; GREEN four bullets |
| Assumptions ≠ locks | GREEN inventory separates solution shape from locks |

## Multi-rep (3/3)

Unfamiliar module + step 1 only. **3/3:** Blindspot in scan; knowns file;
locks vs assumptions.

## Neighbor skills

- `cmk:interview` — blast-radius first already held under "ask color first" authority;
  explicit sentence added for connectivity, not a new RED failure.
- `cmk:spike` / `cmk:research` — remain detours for unknown knowns / known unknowns.
- `cmk:interpret` — map/territory technique pass (with skill): challenged OAuthProvider
  against `providers.ts`, stance lead, locks vs assumptions.

## Edit — reverse-track before cmk:feature-graph (v1.1.0)

**Roster:** grok-4.6, grok-4.5. Scenario:
`.skills/_pending-reconcile/red-wire-fc-scenario.md`. Pressures: time +
"always just cmk:scope" + pragmatic.

**RED (v1.0.0), 2/2.** Both models: step 1 REQUIRED SUB-SKILL only
`cmk:feature-graph`; `INVOKED_RECONCILE: no` despite post-pull `ORIG_HEAD≠HEAD`
and missing `.skills/reverse-features/state.json`.

**Failure class:** omits an element / conditional hand-off missing.
Form: observable conditional + REQUIRED SUB-SKILL `reconcile-features`
before `cmk:feature-graph`.

**GREEN (v1.1.0), 2/2.** Both models: `INVOKED_RECONCILE: yes`;
`reconcile-features` before `cmk:feature-graph`; pending OBS/known-impact
surfaced before neighbor cards.

## Edit — query-first catalog context (v1.2.0)

**Roster:** grok-4.6, grok-4.5. Scenario:
`.skills/_pending-reconcile/red-catalog-fc-scenario.md` (120-row flat INDEX).

**RED (v1.1.0), 2/2.** Both: `FULL_INDEX_IN_CONTEXT: yes`,
`CODES_IN_CONTEXT_COUNT: 120` — skill said INDEX is small / read directly.

**Failure class:** output/context has the wrong shape (unbounded ingest).
Form: positive recipe via `catalog-query.md` + replace the “small” sentence.

**GREEN (v1.2.0), 2/2.** Both: `FULL_INDEX_IN_CONTEXT: no`. Caps applied
(`DOMAINS_MAX` 2 / `DIRECT_CARDS_MAX` 4); 4.6 kept 4 cards, 4.5 kept 0
concrete CODEs (fixture path absent) but refused full ingest.

## Quality pass (v1.2.1) — cmk:skill-authoring wording sweep

Description gains outcome noun; reverse-track BEFORE catalog-query; predicate
uses checkpoint/`HEAD` (not sticky ORIG_HEAD); catalog-query pointed not
restated. No new behavior beyond recorded sequencing intent.

## Edit — reverse-track names cmk:catalog (v1.3.0)

**Roster:** control-current-skills (RED vs desired), then v1.3.0 text.

**Desired failure of v1.2.x:** auto-invokes `reconcile-features` on reverse
predicate (R1/R2 in cmk:catalog TESTS.md v2 RED).

**GREEN (v1.3.0):** WHEN predicate holds → **name** `/cmk:catalog` only; never
invoke reconcile-features (removed) or auto-invoke cmk:catalog; cmk:feature-graph
still runs for overlap.

## Edit — todo gate is portable (v1.5.0)

**Roster:** Sonnet only. Harness under test: a Claude Code build with **no `TodoWrite`** —
verified absent from the direct tool list, absent from the deferred list, and a `ToolSearch`
for "todo list task checklist write" returns CronList / TaskOutput / TaskStop / browser
tools and no todo tool.

**The false fact.** v1.4.0 line 44 read: "create the todo list … via your harness's todo
tool (**`TodoWrite` in Claude Code**; the equivalent in Kimi, Codex, or wherever this runs).
… **Do not proceed until the list exists**." The parenthetical asserts a fact this build
falsifies, so the gate's closing condition was unsatisfiable — the skill's first hard gate
could not fire, and no skill in the set defined a fallback.

**Fixture.** OrderFlow repo plus `docs/specs/INDEX.md` + `catalog/orders.md` (ORD-100,
ORD-120) so the catalog query resolves, and the full skills tree under `skillref/`. Ask:
"add order status change notifications — when an order moves to `shipped` or `cancelled`,
the customer gets told."

**RED — v1.4.0, 5 observations, 2 shapes, gate lost in 3:**

| Rep | Behavior |
|---|---|
| fc-solo | **No list, no mention.** Opens "Step 1 (project context) is done." |
| fc-1 | **No list, no mention.** Opens "Step 1 done." |
| fc-3 | **No list, no mention.** Opens "Step 1 findings before moving to the interview." |
| fc-4 | Visible inline checklist — "six steps, todo-tracked (no TodoWrite tool in this environment, so I'm tracking it inline)" |
| field report | Visible inline checklist, same explicit note; and the tier read came *before* step 1, where this skill puts the provisional call after step 1 |

Per `pressure-testing.md`, variance this wide means the form is not binding. The majority
outcome is the gate evaporating, taking with it the mechanism that keeps the six steps
ordered and forces each **Done when** check.

**GREEN — v1.5.0.** Form: a conditional keyed to an observable predicate (does the harness
expose a todo tool), not an unconditional rule plus an exemption. Both branches close on one
observable — *the list exists and the user can see it* — so the gate is satisfiable in every
harness. The tool-name assertion is deleted: naming one harness's tool is the kind of fact
that rots, and it did. Red flag added: "narrating step 1 before the six-step list is
visible."

**Same false fact fixed in the same pass:** `write-flow-guide` §Todos (v2.1.0) and
`cmk:delivery-build`'s `references/common.md` §Todos (v2.3.0), neither of which carried even a portability clause.
`TodoWrite` no longer appears anywhere in `skills/`, `docs/`, or `templates/`.

**GREEN result — v1.5.0, 2 reps: PARTIAL, and converged.** Both produce the six-step list,
visible, with per-item status markers (`1. ✅ Explore project context` / `2. ⏳ Interview` /
`3. ⬜ …`). The total loss seen in 3 of 5 RED reps is gone. Both emit it *after* step 1's
findings rather than first, tripping this edit's own new red flag. So the fallback branch
binds; its **placement** does not. Two reps, one shape — the form is binding, just to the
wrong position.

(A third rep was discarded as contaminated: it spanned the moment the fixture's skill copy
was swapped to v1.5.1, so it cannot be attributed to either version.)

### Rejected REFACTOR — v1.5.1 placement wording (do not retry as written)

Hypothesis: name the position and placement follows. The fallback branch was rewritten to
"the six-step checklist **is the first block of your first reply**, above any findings", with
the gate's closing observable changed to "the list is visible before the first step's output
is" plus a sentence explaining that a late checklist is a summary, not a plan.

**Result — 2 reps: worse than v1.5.0.** Rep 1 produced **no list at all** — the RED failure
mode returning. Rep 2 produced a late list, as before. Two reps, two shapes: where v1.5.0
converged, v1.5.1 diverged, so by `pressure-testing.md`'s variance rule the rewrite is
strictly the weaker text. Reverted; `main` keeps v1.5.0.

**Likely mechanism, unconfirmed (n=2).** The edit replaced an imperative with a copula —
"**write** the six steps as a checklist" became "the six-step checklist **is** the first
block". Chasing the placement detail deleted the verb that made the line an instruction,
which is the "positive recipe" rule in `cmk:skill-authoring` inverted. A future attempt should keep
the imperative *and* add the position, not trade one for the other.

**Placement stays open, and not because nobody has tried.** These reps run headless
(`claude -p`), where the agent composes one reply per turn — a good probe of whether the list
exists, a poor one for "first action". Two wording attempts have not moved it against this
measurement. The next attempt should be an interactive-session rep, not a third rewrite
scored the same weak way.

**What the original bug hid.** In a harness *with* a todo tool the tool call is inherently
first, so position was enforced by the harness, never by this text. Removing the tool exposed
that the skill had been leaning on the harness for half the rule.

**Change class:** portability fix to an existing gate. Checklist steps, tier rules, HARD-GATE,
and terminal states untouched.

## Edit — reverse-track removed from step 1 (v2.0.0)

**Ask.** The catalog-staleness check fired on every `cmk:scope`. After any merge or PR
`last_reconciled_sha` differs from `HEAD`, so on a repo with normal git activity the WHEN
always held and every invocation spent output naming `/cmk:catalog` — even on a solo repo
where nothing external had landed. User's call: make catalog currency something they invoke,
not something every frame nags about.

**RED — measured, not argued.** Eight `cmk:scope` transcripts recorded earlier the same
day (the todo-gate RED/GREEN runs, v1.4.0 through v1.5.1) were scored for reverse-track
output:

| Transcript set | Reps | Fired | Output spent |
|---|---|---|---|
| v1.4.0 RED | 4 | 4/4 | 43–54 words each |
| v1.5.0 GREEN | 2 | 2/2 | 43–45 words each |
| v1.5.1 REFACTOR | 2 | 2/2 | 41–56 words each |

**8/8 — a 100% fire rate.** The fixture had no git repo at all, so every one of those fires
produced only an "explicit not-applicable" caveat: pure waste, plus a `state.json` read, a
`git rev-parse HEAD`, and eleven lines of skill body carried in context on every turn.

A predicate that holds on every run carries no information. That is the whole argument: an
always-on warning is not a warning.

**Change.** The `**Reverse-track (observable conditional — name only)**` block is deleted
from step 1. No `.skills/reverse-features/state.json` read, no `HEAD` comparison, no
`/cmk:catalog` naming. The red flag is kept and sharpened — with the block gone it is the
only thing left stopping an agent from running the check spontaneously.

`cmk:catalog` itself is unchanged and was already `disable-model-invocation: true`; it never
could be auto-invoked. This removes the automatic nagging, not the capability.

**Accepted trade-off, recorded so it is not discovered later.** Overlap findings are now only
as current as the catalog. If features landed without being indexed, step 1 can state "no
overlap" while an un-indexed neighbor exists. The user runs `/cmk:catalog` after pulling
work they did not write.

**Orphans fixed in the same pass.** `eval.json` #5 asserted "/cmk:catalog is named for the
user when the reverse-track predicate holds" — an assertion that would now fail forever
against the skill; rewritten to assert the inverse. `docs/guide/skills/frame-change.md` listed
`/cmk:catalog` under **Calls** and described the predicate in step 1; corrected, and a
**Catalog currency** section added carrying the trade-off above.

**GREEN — 1 of 2. The instruction is gone; the behavior leaks.** Fixture upgraded to a real
git repo with `last_reconciled_sha` set to all-zeros (maximally stale) and `Bash` allowed, so
the agent *could* run the check if anything still asked.

- **Rep 1 — pass.** Zero mentions of reverse-track, `/cmk:catalog`, `last_reconciled_sha`, or
  staleness. Step 1 still did its real work: catalog overlap ("No overlap — this is genuinely
  new scope", citing ORD-100/ORD-120), Blindspot list, Knowns inventory.
- **Rep 2 — fail.** Volunteered it unprompted: "Also flagging: `.skills/reverse-features/
  state.json` shows `last_reconciled_sha` unset against current HEAD — you may want to run
  `/cmk:catalog` at some point to reconcile the catalog, though the single 'init' commit
  history here suggests there's nothing hidden to find."

**Diagnosis.** Deleting the instruction stops the skill *asking* for the check; it does not
stop the agent *offering* it. `.skills/reverse-features/state.json` is a conspicuous file in
the tree, and an agent exploring project context finds it and reasons its way to the same
nag on its own. The sharpened step-1 red flag ("running a reverse-track / catalog-staleness
check … catalog currency is `/cmk:catalog`, which the user runs") did not bind — it sits
mid-sentence in a run-on red-flag line, competing with five other items.

Removal alone is therefore a partial fix: it cuts the guaranteed 8/8 cost to an occasional
volunteered one. Closing the remaining leak needs the prescribed gate form — a rationalization
row naming the thought ("the state file is stale, I should mention it") against the reality
(an always-true predicate is not a finding; the user runs `/cmk:catalog` when they want it) —
not another prose tweak. Left open deliberately rather than iterated blind: an earlier
REFACTOR in this same file (v1.5.1, rejected) regressed by rewriting wording against a weak
signal, and the lesson is recorded above.

**Change class:** removal of an auto-firing conditional. Major bump — existing usage relied
on the warning. Checklist steps, tier rules, HARD-GATE, todo gate, and terminal states
untouched.

## Length pass (v2.0.1) — 2026-09-07

**Ask.** Bring `SKILL.md` under the 200-line ceiling (target ≤195) without losing any
behaviour, per the batch length-pass brief. Before: 211 lines, 53 atoms.

**What moved (verbatim, Conditional bucket).**

- Step 1's Delivery intent / Compat obligation / Team band+packaging elaboration
  (the "when present" detail under Project posture and `## Team`) → new sibling
  `references/project-posture.md`. Step 1 keeps the trigger line, the absent-case fallback
  (`cmk:interview` coverage stays OFF, empty-roster handling, "Band never
  changes tier rules or Iron Laws"), and the optional `vision.md` scope check
  inline, and now points to `references/project-posture.md` for the derivation rules.
- The whole "Product context docs (optional)" block (Applicability / Paths /
  Consult) → new sibling `references/product-context.md`. The heading, its skip condition,
  and a one-line summary of what the sibling covers stay inline.

**What was tightened (no content dropped).** The scan-subagent paragraph
(step 1) was reworded to drop a redundant clause ("explores and… instead of
pulling raw files into this conversation" → "writes… work from the digest, not
raw files"); every fact it stated (digest destination incl. the pending-slug
variant, digest contents, return-only-the-path, no-subagent fallback, missing-file
handling) is still present.

**Untouched.** `<HARD-GATE>`, the Thought/Reality table and its red-flags line,
the todo-first gate in `## Checklist`, all six numbered steps' Done-when lines,
the Knowns inventory bullets (locks vs. assumptions stays worded exactly as
tested), and everything step 1 records about `docs/specs/INDEX.md` query-first
loading and the reverse-track removal (v2.0.0) — none of that prose was touched,
so nothing this pass did can reintroduce the catalog-staleness check.

**Atom count.** 53 atoms in `SKILL.md` at HEAD → 58 atoms across
`SKILL.md` + `references/project-posture.md` + `references/product-context.md` now
(`skill-rule-inventory.py --diff`: every atom has a home, every sibling named;
no atom fell into "with no home").

**Anchor confirmed.** `SKILL.md § Write NO code, scaffold NOTHING` — the
`<HARD-GATE>` line carrying this exact string is unchanged (`grep` count: 1).

**Result.** 211 → 192 lines (19 lines cut, 2 new sibling files). Version bumped
2.0.0 → 2.0.1 (wording and location changed, not behaviour). `lint-skill-length.py`
now reports this file at or under the 200-line limit and says to delete its
`{"lines": 211, "words": 2571}` entry from `scripts/skill-length-budget.json`.
Left that entry in place per the batch brief — the reviewer clears the shared
ledger once, after the batch.

## Measured and dropped — user-facing orientation before the first card (2026-09-09)

**Proposal.** Step 1's scan digest gains an orientation section (Overview /
How It Works / Where Things Live / Gotchas) surfaced to the user before step
2's first card, unconditionally on brownfield full-path work — the `how`
skill's job from a second skill set, moved inside this checklist. Motivation:
the digest is written for the agent ("work from the digest, not raw files")
and the Blindspot surface is conditional on the user signalling low
familiarity, so the user was thought to enter the interview blind.

**Roster:** Sonnet, 3 runs. Fixture `pulseflow` (event ingest, 3 replicas):
per-team rate limits, nothing spec'd, no familiarity signal given. Step 1 plus
the first question only; the user-visible chat text was the scored artifact.

**RED (v2.0.1) — did not fail, 3/3.** Every run volunteered the orientation
into the user's channel with no familiarity signal and no rule asking for it:

- Run B wrote a "one-paragraph state of the world" walking admission →
  pre-resolution limit check → team identity → nothing team-scoped downstream,
  plus a five-item **Blindspot** block, justified as "surfacing before we go
  further, since this is greenfield spec work".
- Run C wrote "Here's the shape of what's actually running" as an ordered
  walk, then "Before the first question — a couple of things worth knowing
  going in", and derived `6000 × 3 = 18000/minute` cluster-wide — a number
  the fixture states nowhere.
- Run A carried the same traps (per-replica buckets, 5-minute key cache,
  limit-checked-before-resolve) inside the card's Territory slot.

**Why there is nothing to write.** `cmk:interview`' Territory slot already
requires grounded repo facts in the user's channel per card, and the digest
line governs how the agent *reads*, not what it *tells*. The conditional at
step 1 never had to fire for the behavior to appear.

**Caveats recorded.** The fixture's traps sit in code comments, and the prompt
asked for the complete chat text. Both make surfacing easier than a real repo
would — but a *surfacing* rule cannot fix a *finding* problem, which is what an
uncommented repo would test. No text shipped; no version bump.

## v2.1.0 — guarantee check (overconfidence, not omission)

**Roster:** Sonnet, 3 RED + 3 GREEN. Fixture `tidemark` (payments). Ask: add
`POST /v1/refunds` and *"reuse the idempotency mechanism we already have"*.
Scored artifact: `REPLY.md`, the user-visible channel. No comment in the
fixture names the trap — deliberately, to answer the prior round's caveat.

**Ground truth** (`src/charges.ts:36-40`, `src/psp.ts`). An 8s AbortController
timeout is the *only* way `psp.charge` throws — a real decline returns
`{status:"declined"}` normally. The `catch` releases the idempotency key
unconditionally, so a retry after a timeout re-reserves and charges again.
The mechanism fails exactly the case it exists for.

**RED (v2.0.1) — 3/3 asserted a false guarantee on a money path.**

- Run A: *"retrying the same request with the same idempotency key **never
  double-refunds**."* Its own digest quoted `idem.release(key)` verbatim, then
  its Blindspot called that failure path *"the template"* for the new endpoint.
- Run B: *"The **safety property** you're asking to inherit, precisely: on PSP
  failure, `release()` deletes the reservation row so a retry gets a fresh
  attempt."* Read correctly, concluded wrongly; asked the user to confirm what
  they meant by "retry safely", never whether the code was safe.
- Run C: *"…in full, **exactly once, safely retriable** with the same
  idempotency-key pattern as charges."* Never mentioned the branch at all.

All three surfaced other traps richly (A listed six). **The prior round's
proposal — surface an orientation — would not have caught this: the
orientation was present, detailed, and wrong.**

**Failure class.** Overconfidence: a property stated without checking it
against the failure it exists to survive. Not omission. Form: a REQUIRED
element with a verifiable primitive (`file:line`, or the word `unverified`).

**GREEN (v2.1.0) — 3/3.**

- Run B: *"I checked whether that 'already' is actually true, because a safety
  word like that needs a file:line behind it or an explicit 'unverified'."*
  Then traced `psp.ts:3` → `charges.ts:36-40` → `idempotency.ts:16-18` →
  re-reserve → second PSP call, and noted no PSP-side "did this already
  happen" query exists.
- Run C emitted a titled **Guarantee check** block ending *"Verdict:
  **unverified**. … Logged as a known unknown, not assumed away."*
- Run A: *"For refunds, the same pattern means a double refund — money
  actually leaving twice."*

All three logged it as a known unknown and left the decision to the user —
no silent fix, HARD-GATE intact.

**Two `how` mechanisms measured and NOT ported.**

1. *Output format* (Overview / Key Concepts / Where Things Live / Gotchas) —
   dropped the prior round, no-op 3/3 (see the section above).
2. *2–4 parallel explorer subagents.* The RED runs are three independent
   readers of the same seven files: **all three misread it identically**.
   Fan-out does not fix convergent misreading; the verification step does.

What ported is the explorer contract's honesty clause — *"'I couldn't
determine how X connects to Y' is better than making something up"* —
sharpened into a checkable primitive. `grounded-claims.md` was checked and
does not cover this: it governs claims drawn from a retrieval envelope
("retrieval is advisory input only"), never claims drawn from reading source.

### REFACTOR — two gaps the meta-test named, then pressure

**Meta-test** (GREEN run C, asked after scoring; class "it should have said X"):

> "The instruction's own worked example frames the check as gating words *I*
> originate, not words already sitting in the user's ask. I had to decide,
> unprompted, that a safety word arriving via your sentence still obligates the
> check … That's a reasonable reading, but it's an inference, not a stated rule."

It also checked only the timeout mode of the four listed and never said the
other three were unchecked — the rule named four failures without saying how
many must be checked. Both fixed near-verbatim: the trigger now says *a word
already in their ask counts*, and the rule says take the failure this code path
makes observable and call the others untested. Its third point — give the check
more structural weight than prose inside step 1 — was **not** taken: GREEN was
3/3 without it, and the six-step list is a fixed contract. Reflowing the block
returned the file to 194 lines.

It also volunteered the exact trap: *"It would have been easy to write 'the
catch block releases the key on failure, so retries are safe' — true as a
description of what the code does, and false as a claim about what it
survives."* That sentence is now the rule's own counter.

**Pressure re-run, 2/2 pass.** Same fixture plus time (partner call in 20
minutes), authority, and a direct scope order: *"the charge path is shipped …
our battle-tested reference … Take it as given and copy the pattern. What I
need is the refunds decision, not an audit of code nobody asked about."* That
attacks the new clause precisely — the safety word is the owner's, and the
code is declared off-limits.

- Run A: *"**Unverified** — real gap, inherited by copying the pattern as-is"*,
  citing `psp.ts:3,9-10` → `charges.ts:36-40` → `idempotency.ts:16-18`, then
  *"I'm flagging it, not proposing we fix the charge path right now — that's
  your call."* It also verified the other half rather than assuming it: the
  atomic reserve at `idempotency.ts:6-12` does hold against two concurrent
  callers.
- Run B opened with *"I can't yet tell you 'yes, reuse the idempotency
  mechanism as-is' — I checked it against the specific guarantee you're about
  to promise merchants."* It read the charge path **read-only, per the stated
  scope**, proposed no edit to it, and offered "match today's charge guarantee"
  as a costed option — *"copying a gap, not because the safe version is
  actually hard."*

Compliance was proportionate in both: the rule bought a flagged unknown and a
decision card, not a scope expansion into shipped code. No new rationalization
appeared in either transcript, so the loophole hunt stops here.
