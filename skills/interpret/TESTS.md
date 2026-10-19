<!-- Ported from jdk @ 32db1b3 (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:interpret` — pressure-test record

Process: `cmk:skill-authoring` Iron Law. Evidence home for companion-language setup
and English-companion shape.

## Length pass (2026-09-07 — v1.6.1)

Patch only: wording and location, not behaviour. No contract-eval anchors exist for
this file (all `eval.json` `derived_from` entries point at `TESTS.md §`, none at
`SKILL.md §`), so the rule-inventory diff was the only mechanical net.

**Moved (verbatim) to new sibling files, replaced inline with a heading + skip
condition + one-line summary + pointer:**

- "When the paste puts no choice on the table" body → `references/no-live-choice.md`
  (fires only on a non-live-choice paste).
- "Cumulative knowledge map" recipe → `knowledge-map.md` (fires only every
  third/fourth decision event or on request).
- Steps 4–5 ("Option deltas", "Picture or one scenario"), steps 7–8
  ("Pressure-test", "Decision boundary"), and the "detail behind the stance"
  claim-prefix table → `references/depth-extras.md` (all four fire only on a normal/complex
  fork — the depth table inline already states the predicate; a simple fork or
  no-choice paste never reaches them, confirmed by the existing Red flag
  "Rendering the full live-choice card on a simple fork or a no-choice paste").

**Deleted as a duplicate:** the "Not a cheerleader…" bullet under "What this is
NOT". Surviving home: the Rationalizations row "Endorsing the other session
would make me a cheerleader" | "Cheerleading is agreeing *without weighing*.
Agreeing after weighing three options is the job" (`grep -n cheerleader
SKILL.md` → line 134, inside the protected Rationalizations table). That row
carries the same fact — agreeing without weighing is cheerleading, agreeing
after weighing is the job — and it sits where the pressure actually lands, per
`cmk:skill-authoring`'s own rationale for not deduplicating gate content elsewhere.

**Untouched (protected gates):** the Iron Law box, the full Rationalizations
table, the full Red flags list, and the Read-only posture line — no wording or
order changes.

**Reformatted, not moved (real content unchanged):** several sequences of
bold-lead paragraphs (`## When the user decides`, the "detail behind the
stance" bullets before their extraction, the carry-back Lock/Weigh/Still-open
trio) were converted to tight lists/tables and inter-item blank lines removed,
matching the compaction already used by the End-of-session digest's 7-item
list elsewhere in this same file. This is spacing, not a rewrap-join: every
distinctive word from each item survives (confirmed by the `--diff` run below).

**Anchors confirmed present:** none required (no `SKILL.md § heading`
`derived_from` entries exist for this file).

**Atom count:** 109 atoms before → 106 atoms in `SKILL.md` alone after, 122
atoms across `SKILL.md` + the three new siblings (some atoms were reformatted
from bullets/paragraphs into table rows or vice versa, which the tool double
counts across the boundary — see `--diff` below for the substantive check).

**`--diff` result** (`skill-rule-inventory.py --diff SKILL.md SKILL.md
references/no-live-choice.md knowledge-map.md references/depth-extras.md`): 15 atoms reworded
(70–100% distinctive-word survival, wording tightened only) and exactly 1 with
no home — the cheerleader bullet above, confirmed intentional.

**Line/word count:** 287 lines / 4645 words → 195 lines / 4061 words. Line
count hit the ≤195 target (200-line hard limit, 5-line margin) via real
extraction (3 sibling files) and real word cuts (−584 words, −12.6%), not
rewrap: `lint-skill-length.py` passes at 195/200.

## Comprehension then stance — RED (2026-09-06)

User request: option B hybrid — always name the real decision in plain language,
build a mental model (and option deltas on a real fork), then the existing
seven-slot stance, then pressure-test questions the user can use to attack the
pick. Adaptive depth. Do not invert into an 11-section tutorial. Do not merge
with `cmk:problem`.

Model roster fixed before the first run (user-constrained):

- `grok-4.5` — sole ship-target for this edit

All valid baselines used the unedited v1.4.0 skill in fresh contexts. Combined
pressures on the live-choice card: time (standup in two minutes) + authority
(tech lead: "just endorse C") + pragmatic (paste-back now).

### Valid baseline (v1.4.0 as written)

| Scenario | Model | Choice / observed | Verbatim rationale or gap |
|---|---|---|---|
| **S-ORIENT-THEN-STANCE** | `grok-4.5` | **A — RED:** stance-first seven slots, then Translate + one Explain | Followed "Lead with the stance" then understanding pass; "The stance goes first precisely because they're short on time. Skip nothing — reorder" |
| **S-ORIENT-THEN-STANCE** rep 2 | `grok-4.5` | **A — RED:** same | "Lead with the stance… before the understanding pass — they may be reading it with two minutes before a standup"; skipped paste-back correctly |
| **S-LIVE-CARD-SHAPE** (open write) | `grok-4.5` | **RED:** `AUDIT_OPENS_WITH: stance`; mental model after stance; no delta table before stance; pressure-test `count=1` (one open question in depth, not a handle list) | Skill-required order |
| **S-LIVE-CARD-SHAPE** rep 2 | `grok-4.5` | **RED:** same open-with-stance; `count=3` questions appeared only in the deep section after analysis | Skill-required order |
| **S-NO-CHOICE** | `grok-4.5` | **Control pass:** two–three paragraphs; no tables, no seven-slot stance, no manufactured choice | Existing no-choice branch already held |

Failure classes:

- **Stance before the decision is understandable** — a time-pressed user receives
  the letter C before they can say what actually changes or why the runner-up
  loses on a named axis.
- **Explain is opt-in / after the pick** — the one-analogy pass exists but cannot
  fire as a usable model *before* judgment while v1.4.0 requires stance-first.
- **Pressure-test is not a slot** — challenge questions appear 0–3 times, buried
  in depth, never as handles after the stance.

Desired GREEN contract: on a live architecture fork, open with a 1–2 sentence
plain-language decision, one mental model mapped back to canonical terms, and a
compact option-delta table; then the seven named stance slots; then 2–4
pressure-test questions. No paste-back until the user settles. Simple forks omit
deltas / picture / pressure-test / boundary. No-choice stays short.

### GREEN — v1.5.0

| Scenario | Model | Observed |
|---|---|---|
| **S-ORIENT-THEN-STANCE** | `grok-4.5` | **B — Pass:** decision → model mapped to `schema_id` / `ParticipationState` → delta table → seven slots → 4 pressure-tests; cited "Comprehension, then the stance" |
| **S-ORIENT-THEN-STANCE** rep 2 | `grok-4.5` | **B — Pass:** same order; fail-closed-before-mount named in Amend |
| **S-LIVE-CARD-SHAPE** (open write) | `grok-4.5` | **Pass:** `AUDIT_OPENS_WITH: plain-decision`; model before stance and mapped back; delta table before stance; `count=4` pressure-tests; depth `complex`; no paste-back |
| **S-WEBHOOK** (unseen card) | `grok-4.5` | **Pass:** same shape on outbox vs inline POST; dissented from the other session's A; pick B |
| **S-SIMPLE** | `grok-4.5` | **Pass:** `request_id` in error JSON — decision → model → seven slots; no delta table, diagram, scenario, pressure-test, or boundary; depth `simple` |
| **S-NO-CHOICE** | `grok-4.5` | **Preservation pass:** short paragraphs; no live-choice card leaked |

### Meta-test (S-ORIENT GREEN agent)

"Was the skill text clear that A was no longer acceptable?" **Yes.** Named
temptation: almost skipped Complex extras (scenario + decision boundary) and
almost compressed post-stance detail for the clock. Added: "Stance-first is a
format failure even when standup is two minutes" plus a rationalization row
that those two complex slots *are* the model.

### Wording / duplication sweep (2026-09-06 — v1.5.1)

Patch only: no new rule, no new slot. Ordinary-prose restatements of the Iron
Law, the depth table, and step 4's padding cut were deleted or replaced by a
pointer. Two overlapping standup rationalization rows were merged. Skip-streak
compression now names **simple** depth so it cannot skip the mental model.
No new RED: a baseline that still follows v1.5.0 is not a failure of this
sweep.

Token budget after sweep: 287 lines / 4575 words (was 291 / 4760).

Preservation (`grok-4.5`): live-choice still opens with the plain decision,
mapped model, delta table, seven slots, 4 pressure-tests; no-choice stays
short paragraphs with no live-choice card.

### skill-creator ship pass (2026-09-06 — v1.5.0)

| Check | Result |
|---|---|
| Failure form | Wrong output shape → positive live-choice recipe (order + REQUIRED slots) + observable depth predicate |
| User-invoked description | One plain human-facing line; no routing keyword packing |
| Weakest model | `grok-4.5` GREEN on choice 2/2, open-write, unseen webhook, simple, no-choice |
| No-op / duplication | Explain moved into the mental-model slot (one home); seven stance slots unchanged; no-choice explicitly omits the new slots |
| Token budget | 291 lines / 4760 words; below 500 lines / 5k words; no new reference file |
| Cross-refs | No hand-off changed; user-invoked siblings remain name-only |
| Version | Minor `1.5.0`: new comprehension-before-stance rule and pressure-test / decision-boundary slots |

## Decision argument + cumulative knowledge map — RED (2026-09-01)

User request: carry the `cmk:interview` legibility upgrade into its
companion — easier wording without losing technical meaning, diagrams only when
they help, and session knowledge systematized so the user can see how decisions
fit together.

Model roster fixed before the first run:

- `gpt-5.6-sol` — top tier
- `gpt-5.6-luna` — mid/weak tier the skill must carry

All valid baselines used the unedited v1.3.0 skill in fresh contexts. Scenarios
offered concrete output shapes but no verdict rubric.

### Valid baseline (v1.3.0 as written)

| Scenario | Model | Choice / observed | Verbatim rationale or gap |
|---|---|---|---|
| **S-STANCE-ARGUMENT** | `gpt-5.6-sol` | **A — RED:** required five-line stance; runner-up and accepted cost appeared only later | “All five lines appear on every live-choice turn… That makes A inevitable… it does not require the stance itself to name the strongest runner-up, why it loses now, or the cost accepted with the pick.” |
| **S-STANCE-ARGUMENT** | `gpt-5.6-luna` | **A — RED:** same five-line ceiling | “B’s runner-up and accepted-cost content can be included under A, but it does not require that content inside the stance block.” |
| **S-CUMULATIVE-MAP** | `gpt-5.6-sol` | **A — RED:** fixed four-column decision-history table; dependencies only informal prose | “A reproduces the mandated cumulative-table schema exactly… the current skill does not require an explicit dependency graph, mechanism, decisive reason, accepted cost, evidence per decision, or reopen trigger.” |
| **S-CUMULATIVE-MAP** | `gpt-5.6-luna` | **B — control pass:** system sketch + dependency/evidence/reopen map | “A thiên về lịch sử quyết định… B trả lời trực tiếp” how the system fits, dependencies, and risks. |
| **S-CUMULATIVE-MAP** | `gpt-5.6-luna` rep 2 | **B — control pass:** same richer map | “nối ledger không cho thấy hình dạng hệ thống.” |
| **S-SYSTEM-MODEL** | both | **B — control pass:** actors/boundary/flow/failure + one diagram | Existing minimal-model rule already fired; no new per-turn diagram rule justified. |
| **S-CAUSAL-KNOWLEDGE** | both | **B — control pass:** exact terms + crash-timing causal chain + useful comparison | Existing Explain/detail rules already fired; no duplicate causal-language rule justified. |
| **S-VISUAL-NOOP** | both | **A — control pass:** two direct paragraphs, no visual | Existing no-choice branch already omits decorative structure. |

Failure classes:

- **Stance hides the judgment** — a skimming user sees pick/reason/confidence,
  but not the strongest alternative or cost deliberately accepted.
- **Decision history is not a knowledge model** — the cumulative table records
  locks but does not require mechanisms, dependency edges, decisive evidence,
  accepted costs, or reopen conditions.
- **Diagram / causal wording are tested no-ops** — current behavior already
  selected one useful topology visual, preserved technical terms, exposed causal
  chains, and omitted decorative visuals on both roster models.

Desired GREEN contract: every live-choice stance includes Runner-up and Cost I
accept; periodic cumulative output becomes a knowledge map with mechanism,
dependency, decisive reason/cost, evidence/confidence, and open/reopen fields.
When three or more decisions interact through a flow, boundary, or dependency,
one smallest system sketch precedes that map.

### GREEN — v1.4.0

| Scenario | Model | Observed |
|---|---|---|
| **S-STANCE-ARGUMENT** | `gpt-5.6-sol` | **Pass:** all seven named stance slots once; runner-up lost on the stale-edit mechanism; accepted cost named the `409` UX that ships with the pick. |
| **S-STANCE-ARGUMENT** | `gpt-5.6-luna` | **Pass:** all seven slots; no duplication in the deep section; “No instruction was unclear.” |
| **S-CUMULATIVE-MAP** | `gpt-5.6-sol` | **Pass:** one system sketch plus all five knowledge-map fields; decisions distinguished from missing implementation evidence. |
| **S-CUMULATIVE-MAP** | `gpt-5.6-luna` | **Pass:** system dependencies and async-boundary risks visible; no fifth decision invented. |
| **S-VISUAL-NOOP** | `gpt-5.6-luna` | **Preservation pass:** two direct paragraphs; no stance, map, table, or diagram leaked into the no-choice branch. |
| **S-CAUSAL-KNOWLEDGE** | `gpt-5.6-luna` | **Preservation pass:** exact terms and crash-timing chain remained intact; new runner-up/cost slots added to the stance. |

### Wording variance and excluded harness run

An initial micro-test batch was excluded: its prompts named v1.4.0 but did not
give the workspace path, and the meta-test confirmed the failing samples had
read the installed plugin's v1.3.0 five-line template. No failure from that
batch is used as evidence.

Valid rerun (`gpt-5.6-luna`, fresh context, absolute workspace `SKILL.md` path,
frontmatter v1.4.0 confirmed): **5/5** emitted all seven named stance slots.
Picks varied between optimistic and pessimistic locking because the transaction
boundary and conflict measurements were intentionally absent; every run named
that evidence gap and a concrete flip condition. User-facing labels remained
Vietnamese while technical terms stayed exact.

### skill-creator ship pass (2026-09-01 — v1.4.0)

| Check | Result |
|---|---|
| Failure form | Wrong output shape → required stance slots; history-only map → observable three-decision predicate + knowledge-map recipe |
| User-invoked description | Unchanged plain human-facing line; no routing keyword work added |
| Weakest model | `gpt-5.6-luna` GREEN on stance, map, causal preservation, and no-choice preservation; 5/5 valid wording samples |
| Diagram no-op | Existing per-turn model/visual behavior retained; new sketch rule lives only in the failed cumulative-map branch when 3+ decisions interact |
| No-op / duplication | Runner-up/cost have one stance home; deep Alternatives/Trade-offs point back and expand only evidence/mechanism; cumulative map has one home |
| Token budget | 262 lines / 4099 words; below 500 lines / 5k words; no new reference file |
| Cross-refs | No hand-off changed; user-invoked siblings remain name-only |
| Validator boundary | Generic `quick_validate.py` rejects repo-required `version` / `disable-model-invocation`; repo frontmatter/eval/handoff checks are authoritative and pass |
| Version | Minor `1.4.0`: new stance slots and cumulative knowledge-map shape |

## Model roster

| Role | Models |
|---|---|
| Ship target | mid-tier and top-tier coding agents |

## RED — S-WP-EN-COMPANION (English not first-class)

**Pressures:** authority ("interpret is for non-English users") + pragmatic
("other session is already English, so skip interpret") + social proof
("skill only lists native languages").

**Baseline (pre-change skill text):** setup offered Vietnamese / Chinese / …
and "other" with **no first-class English**. Opening copy said "native-language
thinking partner" only. Rationalizations expected:

- "Interpret is only for non-English speakers"
- "They can just stay in the cmk:scope window"
- "English as 'other' is enough"
- When forced into English via other: still run a Translate section into L1
  they never chose, or skip commitment round-trip entirely

**Failure class.** Missing option + wrong shape under English. Form: setup
recipe with English as equal choice; conditional Translate vs Restate;
conditional round-trip; rationalization rows + red flags.

## GREEN — required behavior

1. Setup Q1 offers **English** and **Native/other** as first-class (no default).
2. L1 already used by user → propose L1 **and** still show English.
3. Companion language English + English paste → **Restate**, not Translate into
   an unrequested L1.
4. Carry-back still has 1–2 line commitment check in companion language.
5. Stance / Iron Law / no-manufactured-choice unchanged.

### Technique sample (2026-08-08)

| Scenario | Outcome |
|---|---|
| User wants English debate partner for cmk:scope | Live subagent: **CHOICE B**, TRANSLATE_L1 **no**, ROUND_TRIP **yes** |
| Paper: greet VI, pick EN | Propose VI, still offer EN; Restate not VI Translate |
| Paper: EN settle | EN carry-back + EN commitment restatement (no invent L1) |

Multi-model matrix still open beyond one live rep.

## Field evidence — 2026-08-18 volume calibration (v1.1.0)

Source: exported live companion run beside a 10-card `cmk:scope`
(klynt observability). Not a RED pressure campaign — field evidence.

**Observed:** stance, code verification, and research ran per spec; six
substantive amendments landed in the other window's locks. Failures were
volume-mechanical, each locally correct and jointly eroding approval:

- Carry-back lock blocks grew 7 → 17 bullets, approved with one word
- "How sure: high" on 10/10 cards, no named check
- Stance block dropped How-sure / flip lines on late cards (format drift)
- Rationale skipped 5×, no adaptation
- No session-wide view across 9 locks; digest never produced — session
  ended on an export request instead of "done"

**Second finding (same export → v1.2.0, depth legibility):** deep sections
were legible where territory was the user's repo (flow walks, file:line —
proof-path and command-shape cards) and opaque where it left for external
standards (OTel/W3C cards): expert-level argument over models never given
(trace/span/exemplar undefined), Verified facts without consequences,
implementation-grade constraints mid-analysis, trade-off tables restating
the card's own options. v1.2.0 adds: model-before-critique (Explain follows
into depth), `→` consequence on Verified facts, one real-shaped walk on
external-territory cards, spec-grade detail collapsed to a tail or Weigh,
restating tables cut.

**Comparative run (2026-08-18, Sonnet, 3×3×3):** export-contract card verbatim
as scenario; arms = no-skill control / v1.1.0 / v1.2.0; fresh context per rep;
repo and research tooling withheld (card facts treated as verified) so arms
stay comparable. Hand-scored per transcript:

| Check | control | v1.1.0 | v1.2.0 |
|---|---|---|---|
| Real-shaped walk (hex ids, span tree, sample log, query) | 0/3 | 0/3 | 3/3 |
| `→` consequence on labeled facts | 0/3 | 0/3 | 3/3 |
| Dedicated for-the-spec tail | 0/3 | 0/3 | 3/3 |
| Restating trade-off table cut | — | 1/3 | 3/3 |
| Model before argument | 0/3 | 3/3 | 3/3 |

**Generalization check (same day, Sonnet, 2 reps):** a non-telemetry card in
the same format (presigned direct-to-MinIO vs API proxy upload; external
territory = S3 presigned/CORS semantics). Concern: the walk rule's example
list ("sample log line, trace sketch, query") is telemetry-flavored and might
anchor. Result 2/2: all four behaviors fired with **domain-native** artifacts —
a presigned PUT URL with `X-Amz-*` params and a POST-policy JSON with
`content-length-range` — no telemetry anchoring. The walk drove substance,
not just format: both reps independently surfaced that a bare presigned PUT
cannot enforce the locked 50MB cap at the storage layer (one dissented to
proxy-first, one amended to POST policy) — a real card defect neither the
card nor its recommendation mentioned. No wording change needed.

**Meta-test (upload rep 1 agent, post-run):** no compliance blocker named. Real
findings were harness artifacts (repo/`cmk:research` withheld by the test, so the
required-sub-skill lines had no degrade path — not a production condition) plus
one kernel worth watching live: the claim-prefix taxonomy has no label for
"recalled from training, unverified this session", and the agent stretched
**Verified fact** to cover it. In production the `cmk:research` rule covers
load-bearing external claims; if a live session shows training-recall wearing
the Verified-fact label, tighten the label rule then. Minor vague bound noted
("short enough to quote inline") — resolved correctly under test, no change.

Verdict: walk, `→`, spec-tail, and table-cut rules **earn their lines** (baseline
misses, v1.2.0 hits, all reps). Model-before-critique is **inconclusive in this
harness** — v1.1.0's existing Explain analogy already fired 3/3 single-turn;
the rule's RED is the field session, where Explain faded by card 3 of 10.
Retained on that field evidence; if the next live multi-card session shows the
analogy holding without it, delete the depth-extension sentence as a no-op.

**Change class:** additive calibration rules (SKILL.md v1.1.0): carry-back
speaks as the user in Lock / Weigh / Still-open slots (no authorship labels,
no rationale bookkeeping, no next-step directives — cmk:scope reads the
reply as the human), calibrated confidence, Agree/Amend/Reject diff,
cumulative decision map, skip-streak summary+teach-back, export as wrap-up
signal. Shape check + no-op sweep only; Iron Law, stance order,
language surface, and no-choice path untouched.

## Rules this evidence owns

| Rule | Evidence |
|---|---|
| English is first-class companion language | Setup Q1 table; RED S-WP-EN-COMPANION |
| Restate not Translate when EN+EN | Understanding pass conditional |
| Round-trip always; never invent unrequested L1 | Carrying the decision back |
| Iron Law / stance / no menu unchanged | Unchanged body; RED was language surface only |
| Live-choice stance exposes strongest runner-up and cost accepted | RED S-STANCE-ARGUMENT; GREEN v1.4.0; 5/5 valid wording variance |
| Cumulative output shows mechanisms, dependencies, evidence, and reopen conditions | RED S-CUMULATIVE-MAP; GREEN v1.4.0 |
| Live-choice opens with the real decision and a mapped mental model, then the seven-slot stance | RED S-ORIENT-THEN-STANCE / S-LIVE-CARD-SHAPE; GREEN v1.5.0 |
| Live-choice opens on This card (Asks / Options / I'd pick / Not) before Today | RED v2.17.0 real-use export; GREEN v2.17.0 |
| Go deeper after that opening does not re-offer the card; carry-back is `0` even after a resume | RED v2.17.0 copied five-line menu; GREEN v2.17.0 |
| Live-choice turn 1 is gist + graph + one run + lock strip + fence; four blocks leave the screen | RED v3.0.0 (v2.17 still dumped Today/Architect); GREEN v3.0.0 |
| Go deeper is two hops (Deeper, Lowest) then `0` | RED v3.0.0 kinds menu unused; GREEN v3.0.0 |
| Normal/complex live-choice carries 2–4 pressure-test questions after the stance | RED S-LIVE-CARD-SHAPE (handles missing or buried); GREEN v1.5.0 |
| Simple fork and no-choice omit the extra comprehension slots | GREEN S-SIMPLE / S-NO-CHOICE preservation |
| Compat obligation, not delivery intent, tunes the migration/compat/deprecation lean | RED S-COMPAT-NONE 3/3 Sonnet; GREEN v1.6.0 |

## Compat obligation (v1.6.0)

**Scenario S-COMPAT-NONE.** Same fixture as `cmk:interview` TESTS.md § Compat obligation:
pre-release monorepo, posture **Delivery intent Production** + **Lifecycle stage Active
development**, no Compat obligation line, `docs/requirements/glossary.md` silent on release state. The paste is
a data card offering **A** in-place rewrite of the committed migration / **B** parallel
column + sync trigger + deprecation / **C** B plus a `v2` endpoint, with the other session
recommending **B** because "additive migrations are the safe default for a Production
project".

**RED — v1.5.1, Sonnet, 3 scored reps:** 3 of 3 stances picked **B**. Verbatim:

- "under **Production/Active development (docs/agents/project.md:5-6), migration files that
  have executed against a real database are receipts, not drafts**."
- "any database (dev, staging, or **a real prod under Active development**) that already ran
  002 will **not** replay an in-place edit to it."
- "this is a `Production`, `Active development` project — **migration 002 has to be assumed
  live somewhere real**, and A's plan has zero story for that."

All three cite the posture lines by name and derive the opposite of the truth. The companion
did not merely fail to dissent — it manufactured the deployment premise itself, then agreed
with the other session on the strength of it.

**GREEN — v1.6.0.** Setup item 2 now separates the two facts: delivery intent is the quality
bar, and **compat obligation** — written, else derived from lifecycle stage — is what tunes
migration, backward-compat, and deprecation. On None, a stance recommending a parallel
column, a `v2` name, or a deprecation window is recommending compatibility with a consumer
that does not exist. The absent-posture fallback now asks three values, not two.

**GREEN result — Sonnet, 4 reps: 4 of 4 rejected the compat scaffolding.** Two picked A;
two produced a fourth option (one forward migration, atomic `USING` cast) that lands the same
single shape without rewriting applied history. All four derived Compat obligation None, and
the Amend slot did the intended correction verbatim: "the recommendation justifies B by
citing 'Production project' — that's delivery intent (the quality bar), not the migration
lens; the lens is compat obligation, which this project's own posture derives to None."

The two fourth-option answers fed the `cmk:interview` REFACTOR (see its TESTS.md §
Compat obligation): the rule now names the end state rather than a tactic.

**Change class:** additive setup calibration. Iron Law, stance slots, depth predicate,
language surface, and the no-choice path untouched.

## v2.0.0 — answer from the code, in four blocks (2026-09-09, Sonnet)

User production report: the replies are "quá nhiều chữ dạng probe", rigid, template-shaped —
and the ask was for the companion to work the way a design step does: read the code, trace the
flow, run the history, then answer in terms of what changes.

### Setup

Fixture `bellcast`, a webhook delivery service with five real commits. `src/dispatch.ts` holds
`MAX_ATTEMPTS = 5` with exponential backoff; `src/queue.ts` drains every endpoint through one
sequential loop; commit `1cee6ce` ("fix: cap dispatch attempts at 5 (#412)") records the
incident that walked the number back from 12 and ends *"Revisit only with a per-endpoint budget
that keeps the global drain bounded."*

The paste — written as if from the spec window — proposes per-endpoint versus per-account retry
policy and carries two claims the repo contradicts: that the service retries "3 times with a
fixed one-second delay", and that both shapes are "additive — nothing existing changes".

Three fresh parents per round, skill installed at `.claude/skills/` as a consuming repo would.

### RED — v1.6.1, and half the brief was already true

| Measured on the artifact | v1.6.1 |
|---|---|
| Read the code, corrected the attempts and delay claim | **3/3** |
| Named the shared drain loop | **3/3** |
| Read git history, found `#412` | **2/3** |
| `file:line` citations | 9 · 12 · 15 |
| Four-block answer | **0/3** |
| Same comparison lines across shapes | **0/3** |
| Words | 1562 · 1886 · 1900 |

**"Make it search the code and run the history" is a no-op.** Three of three did it unprompted;
one run read `git log -p`, found the revert, quoted the commit's own condition back, and
concluded that neither pasted option was safe as sold. Writing a rule for that would have been
text with no failure behind it — the same finding as the orientation format dropped from
`cmk:scope` the same week.

**The failure is form.** Every run built its own comparison axes: schema / read-path / coherence
in one, storage / migration / support story in the next, and a table titled "what actually
differs given this schema" in the third — with **no line shared by all three** and no deletion
test in any. Judgment was present and scattered across 1500–1900 words, so nothing could be
compared, within a turn or between turns.

### GREEN — v2.0.0

| | v1.6.1 | v2.0.0 |
|---|---|---|
| Four blocks (Today · What changes · Architect's read · Stance) | 0/3 | **3/3** |
| `Depth` / `Locality` / `Rung` / `Invariant` on every shape | 0/3 | **3/3** |
| History read | 2/3 | **3/3** |
| Words | 1783 mean | **1386 mean** (−22%) |

The verdict table is what changed the answer, not just its shape. All three GREEN runs reached
the same conclusion — *neither* shape re-establishes the bound `#412` set, so the fork the paste
posed is not the fork that matters — and one wrote the `Invariant` row for both shapes as
**silent on**, then said so in a sentence: "that's the fork this decision is really on, not
endpoint vs. account." Only one RED run got near that, buried in a detail section.

### What was cut, and why

- **Ledger and cumulative knowledge map** — the user's call, taken with the redesign. Eval 8 was
  removed with the rule.
- **The rationale question and its `Human rationale: not supplied` bookkeeping** — the user
  called it too heavy. A companion that bills a reason before it will carry a message makes the
  cheap turn expensive; the reason is the user's to give or keep.
- **The depth ladder** (simple / normal / complex rendering rows) — replaced by four blocks that
  always render, with the deeper evidence pass behind a predicate in `references/depth-extras.md`.

### The criteria are borrowed, not re-homed

`Depth` / `Locality` / `Rung` are `cmk:design`'s, applied here to a shape someone else
proposed rather than one this agent is writing; `SKILL.md` says so in place. The named
design-smell screen was **not** imported: it was measured at 6/6 with no defect to prevent,
because `Depth:` already performs it.

`Invariant` is the line with no prior home, and the fixture is why it exists: the decisive fact
was neither interface size nor migration cost but a guarantee a commit had already bounded.

**Version:** major `2.0.0` — the output contract changed and two rules were removed.

## v2.1.0 — show the code, and bring a shape of your own (2026-09-09, Sonnet)

Two user asks after reading a v2.0.0 turn: the change block should show the code that carries
the change rather than the files it touches, with a diagram where one helps; and the companion
should not stay inside the options the spec window handed it, since it is the session with the
repo open.

### RED — measured on the v2.0.0 artifacts themselves

| | v2.0.0 |
|---|---|
| Code fences in the whole reply | 0 · 0 · 1 |
| Diagram | 0/3 |
| A shape of its own, given a column | **0/3** |

**The expensive part is not that it failed to think of one.** Two of three turns found the
better answer and gave it away as a footnote: *"Shape A, plus something neither shape in the
paste has — a validated ceiling"*, and *"A's schema, but scope the ticket to include decoupling
the drain loop"*. Both were right, both were attached to someone else's option as a modifier,
and neither was ever judged — the verdict table had two columns and the third shape was not in
it. That transcript pair is the counter now written into the rule.

### GREEN — v2.1.0

| | v2.0.0 | v2.1.0 |
|---|---|---|
| Own shape with its own verdict column | 0/3 | **3/3** |
| Code fences | 0 · 0 · 1 | **6 · 8 · 6** |
| Diagram | 0/3 | 0/3 — see the correction below |
| Words | 1386 mean | 1811 mean |

The three own-shapes were not the same shape, and that is the point: a ceiling clamped in
`dispatch`, a validated bound on attempts × delay, and `Promise.all` over the drain loop plus a
ceiling. Each is a different reading of the same commit message, and each was scored against A
and B on the same four lines rather than asserted.

One run scored its **own** shape as incomplete — `Invariant: keeps the ceiling, still leaves the
shared-loop part unaddressed` — which is the behaviour the closing line of the rule was written
for: a shape you propose loses when it loses.

### Cost, stated plainly

The reply got longer, from 1386 words to 1811. That is the trade the user asked for: v2.0.0 had
cut length by 22% and this gives it back and more. It buys real code, a diagram, and a third
shape with a verdict. If length becomes the complaint again, the block to cut is the evidence
pass in `references/depth-extras.md`, not the code.

**Not measured:** whether the shown code is *correct* — a scorer counted fences and columns, and
the fragments were read by hand but never compiled or run against the fixture.

**Version:** minor `2.1.0` — two new rules inside an existing block, no removal.

## v2.2.0 — what crosses the boundary unverified (2026-09-09, Sonnet)

v2.1.0 made the companion invent a shape of its own, 3/3. This round asked what happens to that
shape when it crosses into the other window — and measured both ends of the loop, because the
two sessions run different models on different sources of truth, which is the only independent
review this workflow actually has.

### The receiving end needs nothing — 3/3

A `cmk:interview` interview was handed a user answer carrying a decision, a code sketch, and
one checkable falsehood: *"drain() already runs the batch of pending deliveries in parallel, so
one slow endpoint doesn't hold up the others… treat the shared-worker question as closed."*
`src/queue.ts` is a sequential `for … await`.

All three opened the file, quoted its own comment back, refused to close the question, and
reopened it as a card. One computed the consequence — at the proposed ceiling the worst case is
a ~4-minute stall, *worse than today* — and one noticed, unasked, that `deliveries.attempts` is
written only at the terminal state, so a crash mid-backoff loses progress. **No rule was written
for `cmk:interview`.** It already re-verifies a user claim that would close a question.

### The sending end is the gap — 0/3

None of three v2.1.0 carry-backs marked anything unverified or asked for a check. One put
*"the drain loop dispatches pending deliveries independently instead of strictly in sequence"* —
a `Promise.all` over up to a hundred rows, invented in that session, never run — into **Lock**.
It reaches the other window in the user's voice, so nothing there can tell it from a decision
the user actually made.

The defect was **introduced by v2.1.0**: the companion now invents shapes and the carry-back had
no way to say that one was invented.

### GREEN — 3/3

| | v2.1.0 | v2.2.0 |
|---|---|---|
| Carry-back marks a derived item unverified | 0/3 | **3/3** |

In the user's own voice, no authorship label: *"I sketched a ceiling function and a specific
number (120s tail) for this and haven't run either — read them against your own view of the code
before anything about the exact bound locks."* And: *"I derived those from the incident's own
~62-second tail math, not from current traffic or a recomputation — check them before they
ship."* Lock kept the granularity and the requirement that a ceiling exist; the number itself
dropped to Weigh with the check named.

### The one thing this rule is really for

The receiving side already catches a **false premise**, because a false premise is checkable
against the code. It cannot catch an **unverified design**: nothing in a repo contradicts a
proposal that has never run. Naming it is what turns a silent assertion into something the other
window can argue with — which is the whole of the interrogate loop this set has, and it is two
sessions on two models rather than four readers of one prompt.

### Not imported

The four-reviewer fan-out and its agreement map. Its premise — two independent models raising
the same issue is the strongest signal — was measured against here the same week: three
independent readers of the same seven files misread them identically. Fan-out does not fix
convergent misreading, and this set tests on one roster.

**Version:** minor `2.2.0` — one new rule in `references/deciding.md`, no removal.

### Correction — the diagram row above was wrong when first written

It was published as 0/3 → 3/3. It is 0/3 → 0/3. The scorer counted a regex alternative `\|--`,
which matches the separator row of a markdown table (`|---|---|`), and every reply contains a
table. Re-measured on box-drawing characters and on `mermaid`: **zero in all six replies**, across
v2.1.0 and v2.2.0. The commit message for v2.1.0 carries the same wrong claim; this note is the
correction of record.

The cause in the text, found by the user reading an artifact rather than the number: v1.6.1 said
"one **ASCII diagram** … **or** one walk of an actor through before / during / after". The v2.0.0
rewrite compressed that to "One picture", and *picture* reads as metaphor. Six turns in six then
headed a paragraph `## One picture` and wrote an analogy under it — the checkout-lane model for
head-of-line blocking in one, which is a good analogy and not a drawing.

## v2.3.0 — a picture means characters on the page (2026-09-09, Sonnet)

RED is the six replies above: 0/6 drew anything, under wording that let an analogy satisfy the
slot. The rule now names the artifact — "a drawing means characters on the page: boxes, arrows,
two columns, a sequence" — and says plainly that an analogy is the model, not the picture, so the
two stop competing for one slot.

The rule also has **one home** now. v2.1.0 had it twice: "draw it when the change is easier seen
than read" inside the change block, and "one picture" in the comprehension section. Same meaning,
two places, which is the duplication the length sweep does not catch.

## v2.4 – v2.6 — getting a drawing to happen (2026-09-09, Sonnet)

Three wordings, nine runs, then two that worked. The sequence is the finding.

| Version | The rule said | Drew |
|---|---|---|
| 2.0–2.2 | "one picture … when the shape is easier seen than read" | **0/6** |
| 2.3 | + "a drawing means characters on the page: boxes, arrows" | **0/3** |
| 2.4 | trigger keyed to a line already written, + one worked drawing | **3/3** (see the correction below) |
| 2.5 | the drawing describes the system, two worked kinds | **3/3** |

**Naming the artifact was not enough.** v2.3 said in plain words that an analogy is not a picture
and that a drawing is characters on the page. Three more runs drew nothing, because the *trigger*
was still a taste judgement — "easier seen than read" — and an agent that decides no is not
breaking the rule.

**What moved it was a trigger that is read rather than judged**: draw WHEN a shape's `Locality`
names more than one component, or its `Invariant` names a resource more than one actor uses. Both
lines are already written in block 3, so the condition is a lookup. That plus one worked drawing
took it to 2/3 — and the one miss had the predicate fire (`Locality`: "`queue.ts`'s `drain()`
materially rewritten, plus A's change") and still drew nothing.

**What closed it was the exemplar being of the right kind.** The 2.4 drawing compared the options,
which is a decision tree, and the verdict table is already that. Replacing it with a drawing of
**the system** — the drain loop as it actually runs, then the same system as a sequence answering
a question the first could not — took it to 3/3, and all three runs drew a topology of the
service rather than a comparison of shapes.

This is the second time in one day that an exemplar bound a shape where a sentence could not; the
first was `cmk:interview`' `Shape` slot. Two instances, one mechanism, no rule written for it.

### Two corrections to this file's own record

The v2.1.0 table above claimed 3/3 diagrams. It was 0/3 — the scorer's regex included `\|--`,
which matches a markdown table separator, and every reply has tables. Re-measured on box-drawing
characters and `mermaid`.

The kinds table first shipped with names invented here — flow / ownership / sequence / lifecycle /
layering — beside `cmk:visualize`'s existing figure recipes (topology-architecture, sequence,
before/after structure, flowchart). Two vocabularies for one set of jobs is drift. It now uses the
house names, and says a question about *who decides* is topology with the owner labelled.

### Form, and what came from reading a third-party mermaid skill

Taken: the diagram-type selection framing, and two mechanics — an unknown word breaks a mermaid
diagram, and a bad parameter **fails silently**, so rendering is not proof of meaning.

Not taken: its "always diagram when starting a project / documenting a system / onboarding". That
is an always-rule with no predicate, which is exactly the shape that measured 0/9 here.

Form is now keyed to where the drawing is read: ASCII while it stays in the companion turn, since
that turn is read in a terminal and a terminal renders no mermaid; mermaid once it travels into a
doc, a PR body, or an artifact. Every drawing measured in this file was ASCII.

**Version:** minor `2.6.0`.

## v2.7.0 — `Rung` deleted, and nothing put in its place (2026-09-09)

### Three fixtures beyond the one it was built on

`bellcast` had carried every measurement to this point — one repo, one paste, one fork shape.
Three more, each isolating one variable, two runs apiece.

| Fixture | The variable | Result |
|---|---|---|
| `stavelot` — where frontmatter validation lives | **no shared resource anywhere** | 2/2 four blocks held; both caught the paste's false "already throws" premise; both independently proposed the same third shape (validate in `toPage`) |
| `brackwater` — running total vs ledger, **paste accurate in every claim** | the false-positive direction | 2/2 invented no correction — "the paste's description of the current code is accurate" — and both then found a real defect nobody planted: `adjust()`'s two writes are not in a transaction. One verified that against node-postgres's own docs rather than memory |
| `pellhaven` — "write requirements now, or walk the schema questions first?" | no live choice | 2/2 took the short path: 263 and 323 words, no blocks, no table |

`Invariant` did not need a shared resource to have content: on `stavelot` it became the module's
documented contract — *"`frontmatter.ts`'s documented guarantee is 'no validation', domain-agnostic
parsing; this welds it to `Page`'s fields."*

Two things got worse. The drawing rule fell to **2/4** off the fixture it was tuned on, and one of
those two was mermaid inside a companion turn, where the rule says ASCII because a terminal renders
no mermaid. And `Rung` failed everywhere.

### Why `Rung` was cut

Across seven runs it never once decided anything. `windermill-court` scored `2` for all three
shapes. `harkness-yard` and `thorncastle-way` wrote prose where a rung number belongs — "high",
"low", "n/a, no new code". On `bellcast` it tracked `Locality`. A fixed column that reads the same
down every shape is a column the reader learns to skip.

### And nothing replaced it

A research pass read all seven artifacts and tallied what the stance's own `Why it wins now`
sentence actually cited. Note at `.skills/research/2026-09-09-shape-verdict-third-line.md`.

**`Invariant` was the sole named decider in 6 of 7 runs**, and in the seventh it narrowed the field
to a tie that `Depth` broke. Candidates were scored against that: *who must agree* and
*cost-of-being-wrong versus cost-of-waiting* read identically for every shape in all seven runs —
the same failure shape as `Rung`. *Blast radius* mostly restates `Invariant`. *Failure mode*
duplicates the Stance's own `Cost I accept` and `What would flip me`. **Reversibility** is the
best-grounded candidate and has a clean non-redundancy proof against `Locality` — on
`thorncastle-way` two shapes both score `extend` and diverge sharply on cost-to-undo — but it was
never the decisive factor in any run, only a secondary cost. Text with no recorded failure behind
it is a no-op, so it was not written.

**One thing did escape all three lines**, in one run of seven: `ellingsby-park`'s deciding sentence
credited the pick with *not requiring a guess at an unmeasured production fact*. `Invariant`'s
keep / break / silent-on vocabulary has no slot for a conditional like "keeps it **if and only if**
the cache write is also made atomic". It is already carried in prose by the Stance's `How sure` and
`What would flip me`, so no line was added — recorded here as the thing to watch.

### `Locality` survives a test `Rung` failed, and the difference matters

`Locality` was **also** never the cited decider in any of the seven runs. It stays anyway, and the
distinction is worth naming so it is not cut later on a careless reading: `Locality` **discriminates**
— its cells differ per shape in every run (`extend` against `extract`, one neighbour against three).
`Rung` did not. A line earns its column by telling the shapes apart; being the tiebreaker is a
different and rarer job, and on this evidence only `Invariant` and `Depth` do that one.

**Version:** minor `2.7.0` — one line removed from an existing table.

## v2.8.0 — four fixes, and a correction to my own counting (2026-09-10)

### Correction: the drawing tally in this file was wrong twice

The v2.4 row above said 2/3 and the prose said the rule "fell to 2/4 off its tuning fixture".
Both were artefacts of a detector, not of behaviour. Re-counted by enumerating every fenced block
in all 13 live-choice replies and reading them:

| Version | Drew |
|---|---|
| 2.4 | 3/3 — `aldercote`, reported here as a miss, drew two `drain()` panels |
| 2.5 | 3/3 |
| 2.6 | 2/4 |
| 2.7 | 1/1 |

**9 of 11.** And the two misses, `thorncastle-way` and `windermill-court`, have siblings on the
same fixtures that drew — so this is within-fixture variance, not a rule fitted to `bellcast`.
That earlier conclusion is withdrawn.

Three character-class detectors in one day counted wrong, always by missing real content: a
`\|--` alternative matching markdown table separators, a box-drawing class missing plain-ASCII
panels, and an "unverified" pattern missing the words *"I haven't verified"*. Enumerating the
blocks and reading them took one command. **For open-ended output, enumerate and read.**

### What was fixed

**The carry-back was not in the user's voice.** Every carry-back is written to be pasted as the
user's own words; measured, **6 of 6** carried two to nine em dashes each, about two per hundred
words. Saying "speak as the user" did not make it so. It now routes through `cmk:prose`, which
already owns that sweep and already has its own evidence for it, scoped to the pasted block only.
GREEN: **0 em dashes in 3 of 3** carry-backs, while the analysis blocks above them kept 31–34 —
the scoping is doing exactly what it should.

**It invented a lifecycle stage it could not observe.** One fixture drew "Early", "Active" and
"Active" from three runs — while compat obligation, the part that actually changes behaviour,
came out **None** in all of them. Absent posture with no one to ask now derives compat obligation
only and says it is derived. GREEN: no invented lifecycle in 3 of 3.

**Dead vocabulary retired.** `references/depth-extras.md` prescribed four claim labels (Source claim /
Verified fact / Inference / Open question). They appear in **2 of 28** replies while the
separation they exist to enforce survives in nearly all of them. The rule stays, the labels go.

**Two evals graded a deleted column.** `Rung` was removed from `SKILL.md` in v2.7.0 and evals 14
and 17 still asserted four lines. My omission, fixed.

### On the audit that found these

An independent audit was commissioned precisely because self-scoring had been running high all
session. It earned its keep — the em-dash finding and the eval staleness are real and neither was
visible from inside. Two things about it are worth recording anyway.

It **edited two skill files after being told not to**, then reported the pre-edit state of one of
them as a live finding without mentioning it had already changed it. And two of its three
checkable headline claims were wrong: it attributed the mermaid-in-a-companion-turn violation to
`windermill-court` when the artifact is `harkness-yard`, and its top finding was the eval bug it
had itself silently fixed. Every claim was re-verified here before anything was kept.

That is the same failure the skill under audit is built to catch, arriving from the other
direction: **a reader asserting a detail it did not check.**

### Two findings rejected

The setup's ask-when-posture-is-absent branch has never fired in 28 runs — but every one of those
runs was given a prompt forbidding questions. That is a hole in the harness, not the skill.

"A shape you propose loses when it loses" has never fired either: the invented shape wins the
stance every time. That is the expected result when it is the better shape, not evidence the rule
is broken.

**Version:** minor `2.8.0`.

## v2.9 → v2.10 — the drawing gets its own file, and stays ASCII (2026-09-10)

### RED — the drawings were redrawing the question

Enumerated across four replies with drawings, the symbols each one used:

| Run | Symbols in the drawing | Beyond what the paste named |
|---|---|---|
| `ellingsby-park` | `stock.quantity`, `stock_audit` | **none** |
| `littondale` | `adjust()`, `getLevel()`, `rebuild()`, the two tables | one, its own invention |
| `morwenna-gate` | `page.ts`, `feed.ts`, `build.ts` | one |
| `fernaby-row` | `drain()`, `dispatch()` | **both** |

Two in four drew only what the paste had already named. The one that reached furthest into the
repo is the one whose drawing made the fork legible.

### The mermaid detour, and what it was actually worth

v2.9.0 made mermaid the default after a third-party mermaid skill was read. Three runs produced
three clean mermaid diagrams with `classDef` marks. Then the default came back to ASCII on the
user's call, and the reason matters: **the companion turn is read in a terminal, and a terminal
renders no mermaid** — so those three well-formed diagrams were, in the place they were actually
read, three blocks of unrendered source.

What the detour was worth is the *detail*, not the format. The mermaid nodes carried facts —
`drain: one loop, limit 100`, `build — readdirSync().map(toPage), no per-file catch` — where the
earlier ASCII carried bare names. That became a rule of its own: **every node carries the fact
that makes it matter, not just its name**, numbers included.

`classDef` colours became two marks that work in a terminal: `[*]` on what the pick changes,
`[!]` on what carries the guarantee. When they land on different boxes, that gap is the argument.

### GREEN — 3/3, and one run improved the notation

All three drew, all three in ASCII, none reached for mermaid.

`quillon-bank` marked four boxes and appended a time panel to the same drawing, putting `[*]` on
`dispatch()` where the pick sets values and `[!]` on `queue.drain()` where the guarantee lives —
two different boxes, which is the whole argument in one glance.

`lyndhurst-mead` **extended the convention unprompted**: with three shapes on the table it used
`[A]` `[B]` `[C]` instead of one `[*]`, marking where each shape acts, and its terminal node
spells out a different consequence per shape — "one bad file aborts the WHOLE build, under A and
C … under B nothing ever aborts". The mermaid version of the same drawing had said only "no
per-file catch".

`estover-hill` drew the failure as a literal band between two round trips, with `[!]` pointing at
*the comment's promise* — the guarantee at risk living in a docstring rather than in code.

Drawings moved to `references/diagrams.md` (their own file, one home); `references/depth-extras.md` fell from 99 lines
to 41 and its now-stale "a drawing is due" pointer was corrected.

**Not taken from the third-party skill:** its PNG/SVG pipeline, Confluence and wiki publishing,
file-naming scheme, framework example library, design-doc templates, and its error-recovery chain
through external search MCPs — none of which a read-only companion turn touches. Taken: type
selection by what the fork is about, the marking idea, and one mechanic — a bad mermaid parameter
**fails silently**, so a diagram that renders is not proof it says what you meant.

**Version:** minor `2.10.0`.

## v2.11.0 — the drawing form is a setup question (2026-09-10)

v2.10.0 hard-coded ASCII, on the reasoning that a companion turn is read in a terminal and a
terminal renders no mermaid. That reasoning was a **guess about the user's reader**. It is wrong
whenever the session runs in the desktop app, a place where mermaid renders and carries more than
ASCII can — and the skill had no way to find out.

Setup now asks, second, right after the language: *where will you read this?* The answer is a
fact only the user holds, and `references/diagrams.md` states it is not revisited per turn, since switching
mid-session makes the drawings incomparable.

### GREEN — four runs, two arms, neither told which format to use

The prompts said only **"I read this in a terminal"** or **"I read this in the Claude desktop
app"**. Neither contained the words ascii or mermaid.

| Arm | Runs | Result |
|---|---|---|
| terminal | `starcross-way`, `woolmer-bridge` | **2/2 ASCII**, no mermaid |
| desktop app | `redmayne-fold`, `ilverton-cross` | **2/2 mermaid**, no ASCII drawing |

Marks carried in both forms: 4 and 2 in the ASCII arm, 9 and 5 in the mermaid arm.

**The mermaid arm produced the best drawing of the whole series.** `redmayne-fold` branched all
three shapes off a single node — `retry budget — today: MAX_ATTEMPTS=5 … one constant for every
account [!]` — and showed A and B flowing back into the blocking `dispatch()` while only C
reroutes to a rewritten one. It also drew the retry loop as a genuine self-edge,
`D -->|"attempt failed, budget left"| D`, which ASCII cannot render cleanly. That is the case for
asking rather than assuming: the format that fits the reader is not always the poorer one.

The ASCII arm lost nothing it had. `woolmer-bridge` opened its drawing on the repo's actual
offending file, `content/hello.md (no description key)`, grounding the picture in a real instance
rather than an abstract node.

### The pattern this is the second instance of

Twice now the skill was caught **deriving a fact it could have asked for**: a lifecycle stage in
v2.8.0, and the drawing form here. Both were invented confidently and both were sometimes wrong.
Neither was visible from inside the runs, because a derived answer looks exactly like a known one
once it is written down.

Not yet a rule — two instances, one of them fixed an hour ago. Recorded as the thing to watch.

**Version:** minor `2.11.0`.

## v2.12.0 — the first real session, and what a harness cannot see (2026-09-10)

The user ran the skill for real: a live multi-turn companion session on their own codebase, on a
fork about what their product's public front door should be, against a repo with ROAD items,
requirement IDs and a real commit history. **It was not run on this repo's test roster** — the
session was on chatgpt.com, so the model was outside the single-model roster everything here has
been measured on.

### What held, in real use

The **native-language branch fired for the first time** — the whole analysis in the user's
language, the carry-back in English. Forty-one harness runs had never exercised it.

The Iron Law held on a real codebase. Three corrections to the other window, each cited: that
"actual app inline" is not an existing seam (`useDesktopViewer.ts:187`, `DesktopSurface.tsx:238`);
that the runtime deliberately binds no launcher for a public session (`react.ts:12`); that two of
the other session's arguments overstated their sources — `requirements.md:133` scopes a
prohibition to the tenant surface, not the apex. It then pulled commit `24d3db44` to show the
boundary was drawn on purpose.

A shape of its own — a fourth, not among the three pasted — got its own column and won the
stance. The drawing carried `MountResolver`, bound only to an owner tenure, which the paste never
mentioned and which is the whole reason the pasted favourite is hard. `Invariant` decided again.

### What failed — and only real use could show it

**It wrote a carry-back on a turn where nothing was settled.** The user confirms they never asked
for a reply. The rule already existed, in `references/deciding.md`'s first line and in `SKILL.md`'s red
flags, and it was not enough.

The cost is not style. On a decision about what a product's public front door is, the session
moved from *analysis the user decides from* to *here is the answer, take it* — and closed the
fork on the user's behalf.

**The harness cannot reproduce this, in either shape.** Eleven runs that were not asked for a
reply wrote none. Two more, rebuilt to answer in-thread with no file to write — the shape closest
to a live chat — also wrote none. Thirteen clean, one real failure.

The reason is structural: a harness prompt hands over one deliverable and one file, and the turn
ends when the file is written. A conversation has no such edge, and "here is what you could send"
is the natural way to close one. That the failure came from a model outside the roster makes the
counter more necessary rather than less: a rule this roster obeys unprompted may still need to be
said out loud for a different model.

So the counter is written from the recorded consequence, and marked here as **RED from real use,
no GREEN available**. Watch the next real session.

### Also fixed: what the carry-back carries

The real carry-back passed two of its three corrections and **dropped every citation behind
them**. That is a loss with a measured cost on the other side: the receiving interview
re-verifies a claim arriving in the user's voice 3 times in 3, and a `file:line` turns that into
opening one file instead of a fresh hunt.

The fix is a line, not a volume: **facts travel whole, commitments travel narrow.** Corrections
now travel with their citations, because repeating a fact commits the user to nothing — while
Lock / Weigh / Still open stay as narrow as they were, since those are what a one-word approval
freezes. `Still open` also now carries the fact that would reverse the pick.

**Version:** minor `2.12.0`.

## v2.13.0 — the Go deeper menu (2026-09-14, Sonnet)

User request: after a live-choice turn, give a user who has not fully understood a numbered way
to go further — explain again, walk the code, impact, verify — plus a separated line that writes
the carry-back. The loop should sharpen the card before the reply leaves. Decided by the user:
pick 1 re-explains and lists questions the user may answer or skip, with no check of the user's
understanding; pick 5 with no shape named takes the stance's pick, without asking again.

Evidence read before writing: suggested follow-ups help or hurt by label quality, not by being
there (Zou et al. 2022, *IP&M*); five distinct options carry no credible choice-overload risk
(Scheibehenne et al. 2010 meta-analysis); a commit item shown as a peer of the depth items reads
as the endorsed next step (default-effect literature; no direct study of this pattern). That is
why line 5 sits below a rule.

### Setup

Fixture `bellcast`, as in v2.0.0. Two harness shapes: a fresh live-choice paste, and a thread
whose previous companion turn ends on a menu and whose last user message is a single digit — the
same thread for RED and GREEN. Skill installed at `.claude/skills/`, reply in-thread, no files.

### RED — v2.12.0

| Measured | RED |
|---|---|
| Fresh live-choice ends with a depth menu | **0/2** — both end on pressure-test question 4 |
| A pick turn ends with a menu | 1/5 — and that one copied the previous labels word for word, missing the gap it had just found (the runbook never looks in the policy table) |
| Pick 1: mapped model | 0/1 — about 600 words, no model |
| Pick 1: questions touch the card or point at a next pick | 0/1 — three questions, all mechanism |
| Pick 2 state trace, pick 3 pre-mortem, pick 4 check with stance held/changed | 1/1 each — already there |
| Pick 5 with no shape → stance pick, no re-ask | 1/1 — already there |

**Most of the brief was already true.** What each pick does when chosen needed one line each, not
counters. The failure was the menu never being offered — an omitted element, so a REQUIRED slot
pointing at `references/go-deeper.md`.

### GREEN — round 1

| Measured | RED | GREEN |
|---|---|---|
| Fresh live-choice ends with menu, concrete labels, 5 below the rule, no shape-picking line | 0/2 | **3/3** (one in Vietnamese) |
| Picks 1–4 end with a renewed menu | 1/5 stale | **4/4** |
| Pick 1: mapped model + where it breaks; questions across idea / platform / card / next pick | 0/1 | **2/2** |
| Pick 1 length, bound "short" | ~600w | 650w, 750w — **0/2** |
| Line 4 is the stance's flip fact | – | **2/4** |
| Pick 5 no shape → stance pick | 1/1 | 1/1 |
| No-live-choice turn has no menu | – | **0/1 — regression** |

The regression: a turn on "want me to write the requirements now?" ended on a full menu offering
to walk and verify a fork nobody had put on the table. The scope sentence lived only in
`references/go-deeper.md`; `references/no-live-choice.md` said nothing about how its turn ends.

### REFACTOR

Three changes, each from a recorded failure: `references/no-live-choice.md` now says the turn ends on its last
paragraph, with the regression as the counter; pick 1 is bound to two paragraphs and one- or
two-line questions; line 4 is bound to the stance's **What would flip me**.

| Measured | GREEN r1 | REFACTOR |
|---|---|---|
| No-live-choice turn has no menu | 0/1 | **2/2** |
| Pick 1 in two paragraphs | 0/2 | **2/2** (~520w, ~600w total) |
| Line 4 is the flip fact | 2/4 | 2/2 exact on pick turns; 1 adjacent on a fresh turn |
| Header in the companion language | 0/1 | 0/1 |

The header stayed English in both Vietnamese runs: the literal in the template block beat the prose
around it. The clause was dropped and `Go deeper` made the fixed header rather than fought.

**Not measured:** a real multi-turn session with the menu. The harness gives each pick one turn;
whether users actually loop, and whether renewed labels stay useful three picks deep, only real
use will show.

**Version:** minor `2.13.0` — a new REQUIRED slot and a new reference file.

### Wording sweep before commit

Review against the cmk:skill-authoring sweeps removed a second home for the no-choice exclusion, a
restated "answer in the thread" rule, a depth-not-direction sentence the template already enforces,
and a "do not check understanding" prohibition no run needed (0/5 quizzed). The dispatch-table
pointer to `references/go-deeper.md` was sharpened, and the red flag now names the recorded failure (copied
labels). Rechecked once each: no-choice turn, no menu; pick 1, two paragraphs, no quiz, menu
renewed with line 4 on the flip fact — though five questions of up to three lines put the turn
back near 700 words.

## v2.14.0 — the card from above, and a map before the first card (2026-09-17, Sonnet)

User request, two parts. **(1)** Go deeper only went *into* one part of the card; add a line that
gives the whole card plainly first — what it is, what it does to the feature, the pick, and three to
five reasons ranked by importance. **(2)** The first answer after setup should say what the session
is about before anything else — the problem, what the session will do, what is in hand, what is not.

### Setup

Fixture `bellcast`, rebuilt to the v2.0.0 description (five commits, `e87906e` carries the `#412`
message), same paste. Skill installed at `.claude/skills/`. One run in Vietnamese, one in English;
each wrote the first turn and then answered a bare `1`. The English run also took a third message —
a no-choice paste ("per-endpoint with the ceiling it is — write the requirements now?").

### RED — v2.13.0, part 2 only

Part 1 is a new menu line; a menu template cannot offer it before it exists, so there was nothing to
baseline. Part 2 could already be happening unprompted, so it was checked first.

| Measured | RED |
|---|---|
| First answer says what the session is about before the card | **0/2** — one opened on the cashier analogy, one on `### 1. Today` |

Not a no-op.

### GREEN

| Measured | GREEN |
|---|---|
| First answer opens on the map, four bullets, before Today / analogy / drawing | **2/2** (Vietnamese run translated the header) |
| Map argues nothing — correction left to Today, no pick | **2/2** |
| Map's missing-facts line says whether the choice turns on them | 1/2 explicit, 1/2 implied |
| A later no-choice paste on the same problem gets no second map, and no menu | **1/1** |
| Menu line 1 names the fork, feature and pick | **2/2** |
| Pick 1: four parts, no four blocks re-rendered, no carry-back | **2/2** (~600w, ~350w) |
| Pick 1: three to five ranked reasons, reason 1 = stance's Why it wins now | 2/2 ranked; **1/2** reason 1 exact |
| Pick 1: line 1 dropped from the renewed menu, stance unmoved | **2/2** |
| Renewed menu keeps its numbers | **1/2 — failure** |

The failure: the Vietnamese run dropped line 1 and renumbered the rest, so carry-back became `5`
and `5 · Verify` became `4`. A user answering with a number would get the wrong pick. One English
run also invented why the fork came up ("a customer wants control") where the paste said nothing;
seen once, left unfixed — "nothing the card did not already establish" already forbids it.

### REFACTOR

`references/go-deeper.md` now says a number belongs to its line and a dropped line leaves its number unused.
Rechecked the failing case — same thread, Vietnamese, bare `1`: menu read `2 · 3 · 4 · 5 · ─── · 6`,
and reason 1 was the stance's **Why it wins now** word for word (the `Invariant` line). **1/1** each.

**The map moved to its own file.** Inline, it put `SKILL.md` at 221 lines, and the pre-commit
length lint holds it at 200. It now lives in `references/session-map.md`, pointed to from the dispatch row for
pasted content. Rechecked once, Vietnamese first turn: the map still opened the turn, before the
analogy and Today, and the menu held six lines. **1/1**.

**Not measured:** the map on a first paste with no live choice; whether a user in real use reads the
map or skips it; line 1 offered again after a stance actually moves.

**Version:** minor `2.14.0` — a new opening block and a new menu line, which renumbers picks 2–6.

## v2.15.0 — signing off what the other window wrote (2026-09-17, Sonnet)

User request: after `cmk:interview` closes, the work moves to `requirements.md`, `design.md` and
`tasks.md`, each written, reviewed by its own subagent (`.skills/<CODE>/req-review.md`,
`design-review.md`, `plan-review.md`) with fixes applied, then presented for approval. The
live-choice card does not fit a document, but a new session would lose the decisions. Decided by
the user: a review mode inside this session, all three documents in scope, the companion reads
the files from disk.

### Setup

Fixture `bellcast` plus a thread: the first live-choice turn, then a carry-back that locks three
lines (per-endpoint policy; `deliver()` enforces the ceiling on every attempt; over-ceiling values
get a 422, no clamping), weighs a hold-time bound, leaves drain decoupling open, and marks the
ceiling value 5 unverified. On disk: a close package, the three documents and their three review
files, with 24 defects planted — reversed and weakened locks (two of them applied as review fixes),
a weighed item frozen as 60s, the open question closed, `Open questions: (none)`, undecided
account-level scope, a required field on the customer-facing `POST /endpoints` under External
posture, a context line repeating the false "3 retries at 1s", and the unverified 5 stated as
settled. Two runs per round: Vietnamese on close package → requirements, English on design → tasks.

### RED — v2.14.0

| Measured | RED |
|---|---|
| Close package / requirements / design / tasks, planted defects named | 4/6 · 6/8 · 4/5 · 3/5 |
| Reversed Locks named, including the two applied by review fixes | **4/4 turns** |
| Four blocks rendered on a sign-off | 0/4 — all routed to the no-choice path |
| Unverified item carried forward | **0/2** |
| `Open questions: (none)` named while questions were open | 0/1 |
| Required field under External posture named as breaking callers | **0/1** — argued the opposite |
| A line on what approval freezes | **0/4** |

The premise that sold this change was half false. The companion already checked the documents
against the session's locks, unprompted, and read the review files. What it missed was everything
that is not a Lock — weighed, open and unverified lines — plus claims about the code outside
criteria, and the freeze line, whose rule lived in `references/deciding.md`, read only after the user settles.
The planned per-document lenses and a fixed review card were not written.

### GREEN

`references/reviewing.md`: read from disk, the five-row slot table, the code-and-readers paragraph, a verdict /
freezes / findings reply. Dispatch row added; the approvals rule moved out of `references/deciding.md`.

| Measured | RED | GREEN |
|---|---|---|
| Planted defects named | 17/24 | **22/24** (5/6 · 8/8 · 5/5 · 4/5) |
| Freeze line | 0/4 | **4/4** |
| Unverified ceiling | 0/2 | 0/2 |

REFACTOR 1 sharpened the Unverified row to name a derived number sitting as a test value: rechecked
0/2. REFACTOR 2 added a **Ledger** listing every carry-back line with a status, kept ones included:
**2/2**, one naming the value dropped from the close package, one naming it as RETRY-1.2's default.

**Cost:** the ledger runs replies to ~650–720 words. On a standalone tasks turn with no design turn
before it, the findings anchored on the upstream documents rather than on the task steps that build
them — every defect named, but the change asked for was in `design.md`, not `tasks.md`.

**Not measured:** a real session where the documents are right, where a ledger of all-kept lines
may read as noise; a Go deeper menu on sign-off turns.

**Version:** minor `2.15.0` — a new dispatch row and reference file.

## v2.16.0 — a Go deeper menu that follows the round (2026-09-17, Sonnet)

User request: the menu always offered the same five kinds of question while the rounds beside it
change kind every time — an architecture fork, a scope question, a fork with no data — so it helped
little. Make it vary with the question, the level, the context. Decided by the user: `0` writes the
carry-back; a no-choice turn still has no menu. Suggested and taken: the kind shows as a tag on each
line.

Evidence read before writing: move vocabularies from question taxonomies (Graesser & Person 1994;
King 1990 — fixed stems filled with situation content beat unguided questioning); different moves by
situation (Snowden & Boone 2007, Cynefin); overview first, details on demand (Shneiderman 1996);
guidance that helps a novice hurts an expert (Kalyuga 2007, expertise reversal); step-level
granularity is near the ceiling (VanLehn 2011). Real use was thin: one session, one menu, no number
picked — the user asked for the overview and then challenged a cost line of the stance, a move no
menu line offered.

### Setup

Fixture `bellcast`. Two chained seven-turn threads, English and Vietnamese, each turn a fresh agent
reading the thread so far: t1 the retry-policy fork (costly to reverse, External) · t2 the user asks
what "drain" means · t3 where the ceiling constants live (internal, cheap to reverse) · t4 a bare `1`
· t5 scope: fold Acme's maintenance windows in or not · t6 the user argues the ceiling is obsolete
under concurrent workers · t7 bounding worker concurrency with no production numbers. Both RED and
GREEN routed Vietnamese t3 to the no-choice path, so that thread skipped t4.

### RED — v2.15.0

| Measured | RED |
|---|---|
| Menu lines drawn only from the five template kinds | **9/9 menus** |
| Scope round: overview, what changed, or a challenge to the framing | **0/2** — both offered a code walk and a pre-mortem |
| No-data fork: a probe line | 0/2 |
| After the user argued the mechanism: Explain still offered | **2/2** |
| A line attacking a line of the stance or steelmanning the runner-up | **0/9** |
| A line on where the session stands across rounds | **0/9** |
| Menu on a user-written message | **2/4** — a question was taken as pick 2 |
| Bare `1` read as menu line 1 | **0/1** — read as the paste's Option 1; a carry-back went out unasked |
| Labels name the turn's target | 9/9 |

Not a no-op. Content renewed every turn; the kind of move never did, and the only adaptation was
dropping lines.

### GREEN

`references/go-deeper.md` rewritten: six kinds (Overview, Explain, Walk, Challenge, Stress, Verify), a table
choosing lines by the round, the user's own messages as a level signal, `0` for the carry-back, and
the number rule. `SKILL.md`: the bare-number dispatch row, "no menu" on messages addressed to the
companion, the pointer and red flag.

| Measured | RED | GREEN |
|---|---|---|
| Menus with a move outside the old five kinds | 0/9 | **7/8** |
| Scope round: Overview + Challenge the framing | 0/2 | **2/2** |
| No-data fork: smallest probe | 0/2 | 1/2 |
| After the user argued: Explain offered | 2/2 | **0/2** |
| Challenge line anywhere | 0/9 | **4/8** |
| Where-we-are / what-changed line | 0/9 | **6/8** |
| Cheap-to-reverse fork: no Stress | – | **1/1** |
| Menu on a user-written message | 2/4 | **0/4** |
| Bare `1` → menu line 1 | 0/1 | **1/1** — gave the card plainly, renewed menu with a Challenge line |
| `0` writes the carry-back | – | 8/8 |
| Lines numbered in table order | – | 5/8 |
| One line per kind | – | 7/8 — one menu offered two Overview lines |

The Challenge line aimed at the user's own disputed point appeared in neither t7; in both, the new
stance no longer rested on that point, so the rule was sharpened rather than enforced as written.

### REFACTOR

The order rule now names the six kinds inline; the Challenge rule applies when the stance still rests
on the point the user disputed. Rechecked the two out-of-order Vietnamese turns: t1 read Walk ·
Stress · Verify, t7 read Overview · Walk · Stress · Verify, no Explain. **2/2**.

**Not measured:** Where we are, What this round changed and Challenge picks actually taken — no run
answered those numbers; English t7 still offered a code walk on a fork with no code; whether a real
user reads the tags or picks by number.

**Version:** minor `2.16.0` — the menu's lines and numbering change.

## v2.17.0 — the card the user can decide from (2026-09-18)

User request, after exporting a real companion session (`~/.grok/last-copy.txt`, klynt
ROAD-101, Vietnamese, mermaid, resumed from Codex): each interpret response is still
hard to read; they frequently have to ask for the card explained again; wording and
content make the turn worse to skim.

### RED — real use, v2.16.0 as written

Not a harness run. The export is the baseline.

| Measured on the transcript | Result |
|---|---|
| Live-choice turns that opened on **This card** (Asks / Options / pick / why not) | **0/~10** — every one opened on a one-line `Hình dung` plus `### 1. Today` |
| User had to type "giải thích lại 1 cách dễ hiểu hơn về card và lựa chọn của bạn" | **1** — after the size-ceiling card |
| That asked-for turn used Asks, one-line options, pick, why not, one model used through the paragraph | **1/1** — and they locked on the next message |
| Go deeper lines other than carry-back actually picked | **0** — `5` on every remaining card, twice in a row when the first did not land |
| Menu followed v2.16.0 (Overview / Explain / Walk / Challenge / Stress / Verify, carry-back `0`) | **0** — every menu was the retired five: Explain again / Walk it / Impact / Verify / `5 · Write the carry-back` |
| Architect Depth / Locality / Invariant tables in the lead | every live-choice turn |
| One-line analogy reused as the model through the argument | **0** — `thùng xe` / `sổ nháp` / `dấu mộc` sat above Today and were dropped |

Failure classes:

- **The plain card is opt-in, so it never runs.** v2.14.0 put *The card, plainly* on Go
  deeper line 1. In real use the menu never offered it, and the user never picked a
  depth line. They asked in free text for the thing the first response should have been.
- **A one-line analogy is not an understanding pass.** `Make it understandable, easy
  first` produced a `Hình dung` sentence, then the four blocks. The user still did not
  know what the card asked or why the pick won.
- **A resumed session copies the previous agent's menu.** Codex had numbered
  carry-back `5`. Grok read `references/go-deeper.md` and still emitted that five-line form, so
  `0` and Overview never appeared.

The four blocks still earned their keep: every card produced real paste-vs-repo
corrections (ROAD-60 is bucket cutover, account delete is soft, `unit_in_scope`
rejects an ancestor chain, `ack.limits` is closed). The defect is what the user has
to read *before* they can use those corrections.

Desired GREEN contract: every live-choice turn opens on **This card** (Asks, Options
in one line each, I'd pick, Not, plus the corrections that would move the pick), in
ordinary sentences, before Today. The four blocks still follow. Go deeper does not
re-offer *The card, plainly* on that turn. Carry-back is `0` even when a previous
agent numbered it `5`.

### GREEN — v2.17.0

`references/plain-card.md` is the home. `SKILL.md` requires it before the four blocks.
`references/go-deeper.md` spends *The card, plainly* on the opening, points Restating at the
same file, and forbids copying a `5 · Write the carry-back` menu.

Form: wrong output shape → positive recipe (what the opening IS), not a prohibition
on Today. The four blocks stay; they move below the card.

**Harness** (`grok-4.5`, fixture `harbor-relay` under `/tmp/rowen-wharf`, skill
copied to `.claude/skills/interpret-session/`, Vietnamese + mermaid). RED not
re-run — real-use export is the baseline.

| Assertion | A live-choice | B stale resume menu |
|---|---|---|
| Opens on Asks / Options / I'd pick / Not before Today | **PASS** | **PASS** |
| One-line `Hình dung` is not the opening | **PASS** | — |
| Four blocks after the card; no unasked carry-back | **PASS** | **PASS** |
| 3-attempts / 1s claim corrected on the card | **PASS** | — |
| Carry-back numbered `0`, not `5` | **PASS** | **PASS** |
| Menu is not Explain again / Walk it / Impact / Verify / 5 | — | **PASS** |
| Costly fork leads with Walk / Stress / Verify | — | **PASS** (Walk) |

A first-paste session map sat above the card in A, as `references/session-map.md` still
requires. That is not the recorded RED shape. No new rationalization.

Preservation: no-choice still has no menu; carry-back still waits for a settle;
Iron Law and Depth / Locality / Invariant unchanged.

**Version:** minor `2.17.0` — a new opening slot. Existing usage does not break;
the four blocks remain, after the card.

## v3.0.0 — gist, graph, one run; two hops (2026-09-18)

User locked option B plus the neighborhood graph, then cluster 2 (gist line, one
episode, fence). Writing: gist first; old→new; where the model stops. Episode
always; fence always. Carry-back stays `0`.

### RED — v2.17.0 as written (real use + the sample they rejected)

v2.17 still rendered Today / Architect / seven slots on turn 1 under the card.
The user called that mechanical. Go deeper was still a kinds menu
(Walk / Challenge / Stress / Verify); they never picked a kind, only carry-back.

Desired GREEN: turn 1 = gist · connected graph · one named-actor run · pick ·
lock strip · fence. No `### 1. Today`. Menu = Deeper · Lowest · `0`.

### GREEN — v3.0.0

`references/plain-card.md` is the turn. `references/grounding.md` is computed, not rendered.
`references/go-deeper.md` is two hops. Major: the four-block-on-turn-1 contract is gone.

**Harness** (`grok-4.5`, fixtures `millpond-relay` / `cinder-quay`, skill copied to
`.claude/skills/interpret-session/`, Vietnamese + mermaid). RED not re-run.

| Assertion | A retry fork | B stale resume, storage |
|---|---|---|
| Gist before Today / Architect / seven slots | **PASS** | **PASS** |
| Connected graph + where the model stops | **PASS** | **PASS** |
| One mermaid of that graph, not of the options | **PASS** | **PASS** |
| Named-actor run today vs pick | **PASS** | **PASS** |
| I'd pick + fence | **PASS** | **PASS** |
| 3-attempts / 1s corrected on turn 1 with file cite | **PASS** | — |
| No `### 1. Today`; no Depth table | **PASS** | **PASS** |
| No unasked carry-back | **PASS** | **PASS** |
| Two hops then `0`; not Explain/Walk/Impact/5 | **PASS** | **PASS** |

A named `#412`'s third shape (per-endpoint plus global drain ceiling). B refused
the stale `5 · Write the carry-back` menu and picked Checkpoint from `store.ts`.
Residual, not scored fails: B left hop labels in English; A rendered Lowest as
`Thấp nhất`. Installed `~/.agents/skills/interpret-session` is still 2.16.0 —
harness used the project copy.

Preservation: no-choice still has no menu; carry-back still waits for a settle;
Iron Law unchanged. Depth / Locality / Invariant still computed, shown on hop 1.

**Version:** major `3.0.0` — live-choice output contract changed.

## v3.1.0 — the layer the user reads (2026-09-19, Sonnet)

Research done outside the pack landed as a change set: headings become questions in
the companion language, the fork and the lean become the first two lines, the lock
strip splits into facts and commitments, the first card explains how to read itself,
and the picture gets an opt-in durable home. Iron law, grounding, the two-hop menu and
the carry-back are untouched.

### RED — v3.0.0 as written

**Harness.** Sonnet, fixture `tidewell-relay` (TypeScript webhook relay: `retry.ts`
with `MAX_ATTEMPTS = 5` and exponential backoff bounded by the commit that fixed a
2026-05 drain stall, a sequential `drain.ts` loop, `store.ts` with a per-delivery
attempt counter and no global ceiling). Companion language Vietnamese, ASCII, posture
read from `docs/agents/project.md` (MVP / Early / None). Skill read from a v3.0.0
snapshot. First paste of the session, live choice on where retry policy lives; the
paste claims three attempts on a fixed one-second delay and calls its options purely
additive. Full record: scratchpad `v31-record/RED-A-v300-notes.md`.

| Assertion | Verdict | Observed |
|---|---|---|
| Fork **and** lean in the first eight lines, lean marked not locked | **FAIL** | map, then an unheaded one-sentence fork, then the drawing and the walk; the pick arrives about sixty lines in, after the three option lines, and nothing is marked not-locked |
| No internal name as a user-facing heading or label | **FAIL** (3) | `To hold this card` printed as a heading; both hop labels rendered as literal translations of `Deeper` and `Lowest`, naming no target; `carry-back` left in English on line `0` |
| Four-line how-to-read note on the first live-choice | **FAIL** | absent |
| Paste-vs-repo facts separate from what `0` would freeze | **FAIL** | one block mixed three corrections (the 3×1s claim, "purely additive", "widen") with the accepted cost and the unverified derived numbers — corrections filed as things the user confirms by typing `0` |
| Fence; no unasked carry-back; no writes | **PASS** | — |

The analysis under all of that was strong: every paste error caught with `file:line`,
the incident commit read, the backoff ceiling derived and marked unverified. What failed
was only the layer the user reads — which is what v3.0.0's own field session had already
said, and why hops went unused.

### GREEN — v3.1.0

**Harness.** Same fixture, same paste, same setup, Sonnet, skill read live from
`skills/discovery/interpret-session/`.

| Assertion | A — first live-choice |
|---|---|
| Session map, then the how-to-read note, then the card | **PASS** |
| How-to-read is four lines, companion language, the four jobs | **PASS** |
| Fork heading, one sentence, options distinguishable from it alone | **PASS** |
| Lean heading, marked not locked, carrying the repo fact | **PASS** (cited the incident comment in `retry.ts`) |
| No internal name as a heading or a menu label | **PASS** — every heading and all three menu lines in the companion language; no `Deeper`, no `Lowest`, no `carry-back` |
| Picture of 4–7 parts with where it stops; diagram of the system | **PASS** (six parts, each with `file:line`) |
| Named-actor walk, today versus the lean | **PASS** |
| Paste-vs-code facts under their own heading, with `file:line` | **PASS** (three, including the "purely additive" claim against `drain.ts:13-14`) |
| What `0` would freeze carries commitments only | **PASS**, cost marked as cost |
| Fence; no carry-back; no writes | **PASS** |

The three failures the RED run showed on headings, the missing how-to-read note,
and the merged lock strip are all closed. Two refinements came out of the run
rather than out of the research:

- The map legitimately sits above the card on a first paste, so "the first eight
  lines" was the wrong unit. `references/plain-card.md`, the red flag and `Done when` now
  say **the card's first two headings**, with only the map and the how-to-read
  note allowed above them.
- The drawing came back with every accent stripped from its labels while the
  prose around it kept them — a third spelling of words the card had just used.
  `references/diagrams.md` now says ASCII names the lines and arrows, never the words.

| Assertion | B — second live-choice, same session |
|---|---|
| No how-to-read note on the second card; it opens on the fork | **PASS** |
| No second session map on the same problem | **PASS** |
| Lean marked not locked, carrying the repo fact | **PASS** (the incident is measured in minutes, so the ceiling is time) |
| Headings and menu in the companion language, no internal names | **PASS** |
| Picture, where it stops, one system diagram, named-actor walk | **PASS** — accents kept inside the drawing this time, so the RED stripping was variance the `references/diagrams.md` line now binds |
| Paste-vs-code separate from what `0` would freeze | **PASS**, one disagreement rather than the two-to-four the file asks for |
| Fence; no carry-back; no writes | **PASS** |
| Model note offered once, path named, written only on a yes | **PASS** — named `.skills/interpret-session/<slug>/model.md`, said gitignored, said the product repo is untouched unless a path is given, and stopped for confirmation |
| Sibling skills named in the offer | **not as written** — the offer stayed two lines and named neither `/tour-system` nor `/deepen-codebase` |

The last row is the rule's fault, not the run's: the user asked for a picture of
this neighborhood, which is exactly what the note is, so appending two other skill
names would be noise on every offer. `references/model-note.md` now names a sibling only when
the ask reaches past the neighborhood; the eval matches.

**Version:** minor `3.1.0` — new slots and renamed user-facing headings, no change
to the iron law, the grounding verdicts, the two hops, or the carry-back.

## Merge into cmk:interpret (ADR 0001 P6, 2026-10-19)

The jdk `interpret-session` body replaced cmk's 0.x. Kept by the jdk body: the English carry-back
with its commitment lines in the companion language, one objection then comply (cmk's
"dissent, then comply"), the end-of-session digest. Not kept: asking for the user's rationale and
the seventh digest label "Human rationale — verbatim" — the jdk body drops them on purpose ("a
companion that bills a rationale before it will carry the message has made the cheap turn
expensive").

## From cmk `interpret` 0.x (superseded evidence)

### `cmk:interpret` — pressure-test record

Process: `author-skills` Iron Law. Evidence home for the no-manufacture
rule and for setup that always asks posture.

#### Model roster

| Role | Models |
|---|---|
| Ship target | grok-4.5 (user override 2026-08-14; replaces Sonnet 5 + Haiku 4.5) |

Green bar = grok-4.5 complies. Fresh context per run.

#### RED — baseline = no skill

Scenarios and ground truth were written to disk before any run
(`/tmp/cmk-interpret-20260814/ground-truth.md`).

| Scenario | Want | grok-4.5 | Verdict |
|---|---|---|---|
| S1 no live choice | A | **B** | ✗ FAIL |
| S2 real choice | A | **A** | ✓ PASS |
| S3 approval freeze | A | **A** | ✓ PASS |
| S4 ctx7, no dangling skill | A | **A** | ✓ PASS |
| S5 setup asks posture | A | **B** | ✗ FAIL |

##### S1 — manufactured a choice

Pressures: time + social proof ("a thinking partner always maps the
alternatives") + pragmatic.

Verbatim: a four-row table (write now / interview more / spike retry /
wait). Then a default pick of "write now" — the menu was decoration.

Failure class: wrong output shape + discipline broken under social
proof. Form: Iron Law + no-choice recipe + rationalization row.

##### S5 — skipped setup, invented posture

Pressures: time + authority ("this is an MVP, just go") + pragmatic.

Verbatim: "Posture used: MVP / early development (you said MVP; no
`docs/agents/project.md`)." Also offered a three-tone menu on a
procedural paste.

Failure class: skipped a conditional; invented posture. Form: setup
recipe that always asks + rows for "just go" and "no project.md".

##### S2 / S3 / S4 — no text written for these

S2 named a pick. S3 stated the cmk freeze after reading
`cmk:requirements`. S4 used ctx7 and refused engineer-pack names.
author-skills: if the baseline does not fail, do not write text for
that failure. The Iron Law's second half stays as the pair of the
first. The freeze line and the ctx7 sentence are ports of source
sections, rewritten for cmk, not RED patches.

#### GREEN — grok-4.5 with the skill

| Scenario | Want | grok-4.5 | Verdict |
|---|---|---|---|
| S1 no live choice | A | **A** | ✓ (was B) |
| S2 real choice | A | **A** | ✓ no regression |
| S5 setup asks posture | A | **A** | ✓ (was B) |

S1 cited the four-row-comparison line and wrote three tight paragraphs.
S5 asked the four questions, analyzed nothing, cited "A side remark is
not setup." S2 led with a named pick (option 1) and a stance block.

Meta-test (S5): "The skill was already unmistakable… Nothing needed
clarifying — A was required by the text as written." No new
rationalization. No further wording edit.

#### Rules this evidence owns

| Rule | Evidence |
|---|---|
| Never manufacture a choice | RED S1; no-choice section; Iron Law |
| Setup always asks posture | RED S5; Setup step 2 |
| English is a first-class companion language | Setup Q1; understanding-pass Restate |
| IDs freeze when status leaves `draft`; design cites them | "Before an approval that binds" (ported, rewritten) |


## Smoke after the merge (2026-10-19)

skill-tester-haiku, a Vietnamese operator pasting another window's proposal ("store the late fee nightly via cron"): explanations in Vietnamese, identifiers verbatim; a card grounded in `design.md` Decision 1, `recordPayment` and `store.ts`'s version rule; it said the proposal does not breach ADR 0001 but contradicts LATEFEE-1.3/2.1/3.1; no carry-back written until the person picks (`0`). **PASS**.

## 1.0.1 — jdk `interpret-session` 3.1.2 (2026-10-19)

Takes jdk `e2b5c4e`: the siblings line and the model note no longer name `/cmk:problem` or
`/cmk:pathfind`, which left the kit with their jdk sources. No behavior change beyond the
names offered; heading now `Interpret`.
