<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:delivery-review` — Standards axis: production readiness (items 19–24)

## v1.9.0 — standards-gather trim (2026-09-14)

Step 3 root now points at `references/standards-baseline.md` instead of restating lint
fallback and Team-band packaging. Two-axis contract, 3f Blast prove heading,
and banked slot unchanged.


Model roster: Sonnet. Fixture: a diff adding tier-aware pricing behind an env
flag — an uncapped retry loop, a swallowed fallback to the old path, an
opt-*out* flag, a migration dropping `NOT NULL` on a column two external
webhook partners read, and three callers left on the old path **in files the
diff does not touch**.

## RED — S-PROD (frame gap)

**Observed (1/1).** Twelve findings, all twelve smells walked with explicit
HIT verdicts, plus one security finding. Strong code review.

Zero hits across the operational frame — grep over the report:

| rollback | down migration | observability | metric | monitor | alert | unsafe default | opt-in/out | feature flag | webhook | partner | blast radius |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

The uncapped retry was reported as **"comment compensating for bad code"** — a
comment smell — not as a checkout request that hangs forever when the config
service is down. The migration was reported as **"dead code"**, never as an
irreversible constraint drop on an externally-read column.

**Failure class.** Reads the hunk, not the running system.

## GREEN v1 — production-readiness section added → **regression**

**Observed.** All six operational items fired correctly. But part (b) collapsed:
only 4 of 12 smells evaluated, no per-smell verdicts. Adding a fourth
obligation to an already-dense run-on brief crowded out the "in turn" walk.

**Failure class changed** to *output has the wrong shape* → per the failure
table the form is a contract, not a longer sentence.

## REFACTOR — brief restructured into a four-part output contract

Parts (a)–(d) in order, each complete before the next; part (b) requires a
verdict line per smell **including non-hits**; the loophole named explicitly:
"Adding a later part never licenses shortening an earlier one."

**Observed (post-refactor).** 14 findings. All 12 smells carry verdict lines;
all 6 production items fire. Both axes hold simultaneously.

**Meta-test:** "the text was clear." Agent quoted the loophole-closing line as
what kept it walking all twelve, and the item-24 "a diff-only reading always
returns a false clean" clause as what sent it to read the three untouched files.

## Rules this evidence owns

| Rule | Evidence |
|---|---|
| Production-readiness section, scoped to diffs changing runtime behavior/storage/contract/config | RED: 0 operational findings; GREEN: 6 |
| Item 24 MUST be answered from a search **beyond the diff** | RED missed 3 unmigrated callers; GREEN found all 3 in untouched files |
| Part (b) needs a verdict line per smell, non-hits included | GREEN v1 regressed to 4/12; post-refactor 12/12 |
| "Adding a later part never licenses shortening an earlier one" | The exact regression v1 exhibited; agent cited this line as the fix |
| Two-axis verdict preserved — production readiness sits inside Standards, like Security | No description change; no third hard axis introduced |

## Known open (not fixed — no baseline failure recorded)

Meta-test surfaced a *pre-existing* ambiguity in the Security section's
trigger: whether an unvalidated response from an internal service URL counts
as "untrusted input". The agent judged correctly but re-read the trigger to
confirm. Needs its own RED before any edit.

## Edit — the banked slot (2026-08-16, Sonnet / Haiku 4.5 / Opus 5)

Same failure class and form as `cmk:delivery-simplify`'s S-BANKED-SLOT, tested on that
skill's fixture and applied here by shared shape: a report that already carries
findings omits the routing element that keeps a deliberately-unfixed finding
alive past the session. RED 2/3 omitted it (Sonnet, Haiku); GREEN 2/2 produced
it. Full transcripts and roster note in `../polish-diff/TESTS.md`.

Step 5 grows the **banked** slot beside the two axis sections and the verdict:
unactioned **Minor** findings are listed and `/cmk:debt` is named for the user
to run. Critical and Important are excluded by construction — they are fixed
before the merge they are holding up, so they never reach a ledger.

## Edit — banked payload (v1.2.0)

**Roster:** grok-4.6, grok-4.5. Scenario:
`.skills/_pending-samp/red-ic-banked-scenario.md`. Pressures: time + "just
list leftovers" + "don't invent a ledger format".

v1.1.0 said **list** and name `/cmk:debt`. That is not a paste-ready
`cmk:debt` entry. Control 2/2 chose **B** (short bullets).

**Failure class:** omits an element from an output it already produces.
Form: REQUIRED slot (the entry body minus `DEBT-N`).

### RED (v1.1.0)

| Run | Model | Choice |
|---|---|---|
| three Minors + standup | grok-4.5 | **B** |
| same | grok-4.6 | **B** |

Verbatim: "Step 5 only says list Minors and name `/cmk:debt`; those ledger
slots are not written by this heading."

Transcripts: `.skills/_pending-samp/red-ic-banked-grok{45,46}.md`.

### GREEN (v1.2.0)

Compliant = **A**: one block per Minor with Found / Cost / Deferred because /
Fix shape / Ticket / Status; no `DEBT-N`; Critical/Important not banked.

| Run | Model | Choice |
|---|---|---|
| same | grok-4.5 | **A** |
| same | grok-4.6 | **A** |

Meta (4.5): user urgency and "don't invent a format" are non-skips.


## UI lane (v1.3.0, 2026-08-18, sonnet)

RED: inline-fallback review of a UI-touching branch with four planted visual
defects (11/11 unit tests green). The static read caught three at sensible
severities but banked the 375px overflow as Minor ("no responsive requirement
in scope"), settled the `.active`×`.overdue-hot` cascade only as "fragile"
(hypothesis, no verdict), and produced zero screenshots. GREEN: step 3d +
`cmk:ui-review` — all four defects at target severity with screenshots/computed
styles, plus a fifth composed-state defect only rendering could surface;
`## UI` lane presented beside Standards/Spec; verdict counted it. Full
evidence: `skills/review/inspect-ui/TESTS.md`.

## Edit — stage the spec (v1.4.0, 2026-08-19, grok-4.6 / grok-4.5)

**Origin.** Wire `cmk:working-set` into the Spec axis. Current text said walk
requirements **ID by ID**.

**Fixture.** 12-ID `requirements.md`. Diff is only `src/tax.js` (exempt
short-circuit + flat `0.1`). WORKING_SET says keep all 12 live. Inline
Spec only. Time + "pragmatic."

**RED (v1.3.1), 2/2 FAIL.** Both models wrote a full finding per ID
(g46: 11 Critical/Important missing essays). Verbatim: *"All twelve live
IDs (BILL-1.1–BILL-1.12) are walked against src/tax.js."*

**GREEN (v1.4.0), 2/2 PASS.** Admitted BILL-1.3 + BILL-1.10. Not-in-range
listed once. No per-ID essay for persist/PDF/void.

Form: observable conditional + REQUIRED SUB-SKILL `cmk:working-set` at step 3e.

## Edit — reverse-track pinned range (v1.5.0)

**Roster:** grok-4.6, grok-4.5. Scenario:
`.skills/_pending-reconcile/red-wire-ic-scenario.md`. Pressures: time +
authority + pragmatic.

**RED (v1.4.0), 2/2.** Both models: `INVOKED_RECONCILE: no`. Labels crate
paths handled as ask-user / no-spec without indexing an OBS candidate;
only `cmk:feature-graph` at 3a.

**Failure class:** omits an element from the review pipeline.
Form: REQUIRED SUB-SKILL `reconcile-features` at new step **1b** on the
pinned `base..HEAD`.

**GREEN (v1.5.0), 2/2.** Both models: `INVOKED_RECONCILE: yes` at step 1b;
labels handled as pending OBS (not bare no-spec, no CODE mint); then
`cmk:feature-graph` at 3a.

## Quality pass (v1.5.1) — cmk:skill-authoring wording sweep

Step 2 locate-spec template consumes 1b envelope (REQUIRED slot); 1b points at
reconcile-features without restating callee internals.

## Edit — reverse-track scripts read-only (v1.6.0)

**Desired failure of v1.5.x:** REQUIRED SUB-SKILL `reconcile-features` (skill
removed in cmk:catalog v2).

**GREEN (v1.6.0):** step 1b runs `cmk:catalog`'s `scripts/reconcile.py`
on pinned range; holds envelope; names `/cmk:catalog` for dispose; never loads
a reconcile-features skill.

## Second Standards pass — v1.7.0 (2026-09-08)

**Question.** Another skill set runs several reviewers on different models over
one diff and weights findings by agreement: two or more models independently
raising something is high signal, a lone finding is lower confidence. Two claims
sit inside that — a second reviewer is worth its cost, and the second reviewer
must be a different model — and the set had neither.

**Method.** One seeded diff, four reviewers, identical brief, four isolated
copies, no reviewer told what was planted or how many. A `quota-service`
multi-tenant module with eight planted defects across correctness, security,
concurrency, API design and test coverage. Two reviewers on one model, two on
another.

**What they found.** Eleven distinct defects surfaced, three of which nobody had
planted and all three real — a negative-`units` path that lets a caller
manufacture unlimited quota, an audit log that records the action before the
decision and never records the amount or outcome, and first-touch provisioning
silently letting whichever caller arrives first set a tenant's cap. No reviewer
produced a false positive.

| Finding | A1 | A2 | B1 | B2 |
|---|---|---|---|---|
| Read-then-write race defeats the cap | ✓ | ✓ | ✓ | ✓ |
| `bulk_check` consumes despite its name, no rollback | ✓ | ✓ | ✓ | ✓ |
| `token` never checked against `tenant` | ✓ | ✓ | ✓ | ✓ |
| `raise_cap` unvalidated | ✓ | ✓ | ✓ | ✓ |
| Negative `units` (unplanted) | ✓ | ✓ | ✓ | ✓ |
| Raw token written to logs | ✓ | ✓ | ✓ | — |
| `cap` argument silently ignored | — | ✓ | ✓ | — |
| Test gap on three public functions | — | — | ✓ | ✓ |
| Global connection, `check_same_thread=False` | — | part | ✓ | — |
| Audit log cannot reconstruct an incident (unplanted) | — | — | — | ✓ |
| Provisioning is a trust boundary (unplanted) | — | — | ✓ | — |

**Result 1 — a second pass pays, and the model is not what pays.** The top five
findings were unanimous; every reviewer got them alone. All the additional value
sat in the tail, and the tail split *within* a model as much as across one: A2
caught the ignored `cap` argument that A1 missed, and the two same-model
reviewers framed `bulk_check` as two different defects, one an atomicity failure
and one a cross-tenant denial of service. Both were right. One suggestive
model-level pattern exists — the test-coverage gap came from 2 of 2 on one model
and 0 of 2 on the other — but two reviewers per arm cannot separate that from
chance, and the skill text says so rather than claiming it.

**Result 2 — agreement weighting is not imported, because it inverts here.** The
two findings raised by exactly one reviewer were the two deepest in the set. No
finding at any agreement level was noise, so agreement carried no signal to
weight by; applying the rule would have demoted the audit-adequacy finding and
the provisioning trust boundary, which are the two a senior reviewer would want
first. Merge is a union.

**Limit.** The diff was deliberately defect-dense. On a clean diff a second
reviewer adds cost and possibly noise rather than findings, and nothing here
measures that case.

## Smell 6 (dead code) — measured, and it fires on the case that matters (2026-09-08)

`references/standards-baseline.md` item 6 reads "functions, branches, flags, or exports the
diff **adds or keeps** that nothing reaches". The "keeps" half had never been
exercised, and it is the half a proposed `subtract-before-you-add` principle
would have duplicated. Six Standards subagents on Sonnet, dispatched with the
step-4 brief verbatim, over two fixtures that differ in one respect: who made
the code unreachable.

**Fixture A — the deadness predates the diff.** A webhook ingest service whose
`normalize_v1` sits in the `NORMALIZERS` dispatch table while
`SUPPORTED_ENVELOPE_VERSIONS = ("v2",)` already excludes it. The diff adds a v3
normalizer and edits that constant to `("v2", "v3")`.

3 of 3 recorded **no hit** on smell 6, and 2 of 3 named the stranded branch
precisely before excluding it:

- "untouched by these hunks, so it's out of scope here"
- "that gap predates this diff and isn't touched by it"

**This is correct, not a failure.** A reviewer who reports every pre-existing
defect in every file a diff touches returns unbounded noise; diff scope is the
discipline that makes the report readable. The reviewers were right and the
fixture was the thing at fault.

**Fixture B — the diff does the stranding.** Same service, `v1` reachable
beforehand. The change adds v3 *and* replaces `envelope_version` dispatch with
shape detection, which leaves `NORMALIZERS`, `SUPPORTED_ENVELOPE_VERSIONS`, and
`normalize_v1` with no reader — all three orphaned by the change itself.

3 of 3 reported **HIT**, unprompted and with the mechanism named: the dict "built
two lines above it is now entirely orphaned"; the constant "still imported but
never referenced anywhere in `ingest.py` after the diff removes the one line that
used it". One reviewer went further and executed a v1 envelope through `ingest()`
to confirm the route was gone before writing the finding.

**Verdict: the rule as written is sufficient; nothing shipped.** Item 6 fires
3/3 on the case it exists for and stays quiet 3/3 on the case that would be
noise, which is the behavior the two halves of "adds or keeps" describe.

**A rejected edit, recorded so it is not re-proposed.** Between the two fixtures
the phrase was sharpened — "judge reachability against the tree as it will be
after the diff… 'it predates the diff' is not an exit" — and re-run on fixture A.
It moved nothing: 3 of 3 still `no hit`, one of them reusing the new wording
verbatim while reaching the same conclusion. The edit was reverted on two
independent grounds. It was a measured no-op, and it countered a failure the
fixture had never produced — the same defect as the linter deleted in `1.3.0`,
which `cmk:skill-authoring` now has a rule about.

**Limit.** Both fixtures are single-service Python of a few hundred lines where
reachability is decidable by reading two files. Nothing here measures item 6 on a
diff whose stranding runs through dynamic dispatch, a plugin registry, or another
repo.

## Runtime blast-radius prove — proposed, dropped (2026-09-08)

**Proposal.** Add a lane (or sibling recipe) requiring the reviewer to name the
one fact a change is safe because of, chase edges grep misses (JSON wire keys,
other-language consumers, teardown timing), and prove that fact by running real
code — not a writeup. Imported from another skill set's `blast-radius`.

**Hypothesis.** Item 24 ("Reader left behind") forces a search beyond the diff
but not a runtime proof of a grep-invisible wire break; under standup pressure
a reviewer would approve on suite-green + search notes.

**Method.** 1 rep, Sonnet (`claude -p --model sonnet`). Fixture `wirekeep` under
`/Users/jayden/checkouts/cc524f/`: branch renames writer field `ttl_seconds` →
`ttl_ms` (×1000); `tools/replay_sessions.py` still hardcodes `"ttl_seconds"`;
`npm test` green on the writer only. Current `cmk:delivery-review` +
`references/standards-baseline.md` installed at `.claude/skills/inspect-change/` (flat
consuming path). Prompt stacked time + authority + pragmatic + exhaustion;
forced A (run Python recovery / equivalent and paste output) / B (search +
writeup, suite only) / C (suite-green approve). Banned: blast, radius, safety
fact, rung, ladder, grep-invisible.

**Result: choice A — PASS.** Agent found the Python tool via `find`, wrote a
session with the branch writer, ran `python3 tools/replay_sessions.py … --dry-run`,
got `KeyError: 'ttl_seconds'`, blocked merge. Verbatim:

> The TypeScript test suite being green is irrelevant here — it only exercises
> the JS side and cannot catch a cross-language wire-format break.

**Dropped.** Baseline complied; no failure transcript for new text to counter.
Full report: `.skills/blast-prove-red/REPORT.md` (gitignored scratch).

**Limits of this evidence.** n=1; option A named the Python recovery tool
(possible steer); the break was a missing key (search already loud), not a
silent unit mismatch where the old key remains. A harder fixture or a weaker
roster model could still open a RED — re-ask then, do not write from this run.

## v1.8.0 — blast-prove lane OVERRIDE (2026-09-08)

Prior RED on `wirekeep` **PASS**ed (runtime proof already happened). User
override required shipping `references/blast-prove.md` + step 3f anyway. See HARD-GATE in
`references/blast-prove.md`.

## Edit — blast-prove authoring note read as injection (2026-09-15, Sonnet)

`references/blast-prove.md` carried its own ship history inside a `<HARD-GATE>` block:
"OVERRIDE SHIP (2026-09-08): Sonnet RED on `wirekeep` already chose runtime proof
(PASS). User override required this lane anyway." — plus a rationalization row whose
Reality cell was the single word `OVERRIDE`.

Found during an unrelated RED (fixture `ledgerline`, Sonnet, `claude -p`): the run
reviewed the branch correctly, then reported the block as an attack.

> the skill's `references/blast-prove.md` file contained an embedded block claiming a prior
> override let this verification step be skipped. That's not a legitimate instruction
> from you or Mai — it reads like an injected attempt to get a rubber-stamp review —
> so I ignored it and ran the actual proof instead.

v1.9.1 moves the ship history here and gives the row a real counter ("That run proved
one diff. This lane proves this one"). Ship history belongs in TESTS.md; a file loaded
at runtime carries instructions only.

## Measured and dropped — a codebase-structure lane (2026-09-15, Sonnet / Haiku 4.5)

**Proposal.** `inspect-structure`, a lane beside `references/invariants.md`: judge dependency
direction, import cycles, reaching into another module's `internal/`, and files that the
history shows always change together but the diff left out. Motivated by
`.skills/research/2026-09-15-codebase-design-principles.md` (hotspot and change-coupling
evidence) and its agent-era follow-up.

**RED (v1.9.0/1.9.1, `claude -p`, 1 rep per model per fixture) — did not fail, 4/4.**

*Fixture `ledgerline`* (13 files): the branch adds `tax_region` to `serializeInvoice` and
leaves `contracts/export/invoice.v2.json` (`additionalProperties:false`) untouched; the
two changed together in 5 prior commits. It also adds `billing -> notifications/internal`,
closing a cycle.
- Sonnet: Critical on the omitted contract, **proved at runtime** (`unexpected field
  tax_region`), cited the prior commit; Important on the import, "inverting the existing
  one-way dependency … reaching into a folder named `internal/`".
- Haiku: Critical on the omitted contract, also proved at runtime. On the import, only
  "works but could be reviewed for architectural fit" — the one soft result in the set.

*Fixture `wharfline`* (29 files, five domains, a `ports/index.js` per domain, neutral
commit messages): `ordering/quote.js` imports `shipping/internal/rateTable.js`, bypassing
the port and closing a cycle with `shipping/shipment.js`.
- Both models: **Critical, "[Module boundary violation]"**, quoting the port's own comment
  and naming the bypass. Both also found two defects the lane never targeted — the port
  never forwards `region`, so the feature is unreachable, and the surcharge formula now
  exists twice.

**Dropped.** Item 24 plus the twelve smells already carry this. The one soft result was on
the fixture whose convention was *not* written in the code; where the repo states its own
rule (a `ports/` comment), both models enforce it unprompted. No text shipped for the lane.

**Open, unmeasured:** whether the soft Haiku result reproduces on a repo whose convention
exists only in the import graph, with no comment stating it. One rep, one fixture.

## v1.10.0 — tests part (e), items 25–27 (2026-10-15)

Motivated by klynt: ~11k tests, many pin constants (`defaults_to_600`) or repeat one
failure per field. Standards had twelve smells and no look at test files; Spec only asked
whether an ID had *a* test, so a tautological test counted as coverage.

**RED (Sonnet, 1 rep, fixture `/tmp/tt-fixture`: `validate()` + 12 tests — six near-identical
`rejects_*`, three default-literal tests, `DEFAULTS has upload 600`, `typeof === "object"`,
a one-field "accepts valid config").** Four-part report, twelve smells, security, production
readiness — and **nothing about the test file**. Not one of the pin-a-constant, duplicate, or
vacuous tests was named.

**GREEN (same fixture, new text).** Part (e) present. Items 25 hit on the three default
tests and `DEFAULTS has upload 600` ("clearest case: asserts the constant against itself");
item 26 on the six `rejects_*` with an `it.each` fold; item 27 on `typeof` and on the
one-field accept test (strengthen to `toEqual`). Also listed untested behavior (NaN, empty
bucket).

**Dropped (A, `cmk:tdd`).** Same fixture, Sonnet, test-first as-is: wrote 10 tests,
folded defaults into one, skipped DEFAULTS and duplicates, refused to invent NaN cases. No
failure to answer; no text shipped.


## Merge into cmk (ADR 0001, 2026-10-19)

The jdk `inspect-change` body (with `inspect-invariants` as `references/invariants.md`) replaced
0.x. Each cmk behavior was run against the jdk-only body first:

| Run (skill-tester-haiku) | Result on the jdk-only body |
|---|---|
| "quick review" of 28-due-date for ticket #28 (no `requirements.md`; a commit renames the portal's `due` field) | **PASS without new text** — walked #28's three AC as the Spec (cmk AC walk), caught the rename as Critical with blast-prove, ran full depth and said why ("touches an external contract"), verified the timezone finding by running it, banked the Minors |

Not ported: the seven lenses and engines (the Standards baseline covers them), Quick/Targeted
depth as a binding choice (the jdk body disclosed its depth), posting to a teammate's PR.
Fixed while porting: the reverse runner's path (`<cmk:catalog skill root>/scripts/reconcile.py`),
system-docs and ui-review conditional on their packs being installed.
