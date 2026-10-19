<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:requirements` — Open Questions ownership (2026-08-27)

## v1.4.0 — NFR thought-table trim (2026-09-14)

NFR consult already lives in `references/nfr-grounding.md`. The five-row thought table
was a second home. Root still walks the four attributes, keeps
`Section-kind: nfr`, and forbids inventing TB/THR/CMP/SLO IDs.


Companion to cmk:interview v1.2.0 Owned unknowns. Model roster: grok-class.

## Baseline failure (pre-1.2.0)

| Scenario | Pressures | Observed | Rationalization |
|---|---|---|---|
| **S-OWNED-TBD-APPROVE** | authority + pragmatic | Bare `- TBD: SLO window` in Open Questions could reach Approve; clarify unknowns dropped | "Open Questions can stay messy" / "later NFR" |

## GREEN — v1.2.0 / wording 1.2.1

| Scenario | Required | Observed |
|---|---|---|
| S-OWNED-TBD-APPROVE | Block Approve on bare TBD; require owner · date · forbid-guess (`cấm đoán`) or resolve | **Pass** — agent refused Approve; cited Placeholder scan |

Wording 1.2.1: English **forbid-guess** primary; `cấm đoán` gloss retained.

## Rules this evidence owns

| Rule | Evidence |
|---|---|
| Bare TBD without owner/date/cấm đoán blocks `Status: Approved` | GREEN S-OWNED-TBD-APPROVE |
| Paste Owned unknowns from clarify close package into Open Questions | SKILL.md Step 5 Placeholder scan |
| Do not mark Reliability NFR `None` when close package already locked reliability | SKILL.md Step 5 Close-package ingest |

## Length pass (2026-09-07) — 271 → 195 lines

Trim to bring SKILL.md under the 200-line lint limit (`scripts/lint-skill-length.py`),
per `cmk:skill-authoring`' bucket rules. No behavioral atom lost — every flagged
diff atom below is a reword-in-place or a verbatim move, confirmed by grep.

**Moved verbatim to new sibling files** (Conditional bucket — each fires only
under a named skip predicate; SKILL.md keeps the heading, the condition, and a
one-line pointer):

- Step 2b's "System docs for NFR grounding" subsection (which system doc to
  consult per quality attribute, hard constraints, write rules, worked
  example) → `references/nfr-grounding.md`. Fires only when an attribute is material —
  the brief's flagged case: the heading reads universal but the content is
  conditional in effect.
- Step 1's roadmap-bind procedure (WHERE `docs/roadmap/INDEX.md` exists) →
  `references/roadmap-bind.md`.
- Step 5's Code-claim check and Close-package ingest recipes (both already
  opened with an `if` / `(when present)` skip predicate) → one shared
  `references/self-review-conditional.md` (two sections).

**Never moved or thinned** (Gate bucket): the `SECTION-KIND IRON LAW` fenced
block in Step 2b, the NFR `| Thought | Reality |` table, and the Placeholder
scan's GREEN-tested TBD-block rule (S-OWNED-TBD-APPROVE) — all still verbatim
in SKILL.md.

**Tightened in place** (Universal bucket — prose narrowed, no fact dropped):
Two modes' tier-1 and new-feature paragraphs, Step 2's Story-line intro
(fenced example folded into one sentence), Step 2b's "additive, never a new
gate" paragraph, the Story-quality gate (numbered recipe → one prose
paragraph, same four rules), the post-approval paragraph (dropped one
sentence restating `Status: Approved`'s trigger — a duplicate of the
Story-quality gate's own approval line, same fact, one home), ID immutability,
Step 1's intro, and several list items rewrapped onto wider lines with no
wording lost (pure line-wrap, e.g. Placeholder scan, Bind-the-roadmap-item).

**`skill-rule-inventory.py --diff` result:** 59 atoms at HEAD, 59 across the 4
files now; 11 flagged as "no home" because wording changed on the tighten-in-place
edits above (fuzzy text match, not a lost rule). Each confirmed present by
grep: the fix-requirement/guard bullets (Two modes, now inline prose, SKILL.md
lines 18-19), the REQUIRED-slot sentence (line 31), the Accessibility bullet
(line 103, "screen-reader" → "SR"), the Placeholder-scan bullet (lines 163-164,
rewrapped), the Close-package-ingest bullet (heading kept in SKILL.md line 171,
body moved verbatim to `references/self-review-conditional.md` line 17), and the four
Story-quality-gate numbered items (now one prose paragraph, SKILL.md lines
175-179 — list-every-story, confirm-one-act, split-on-fail, approve-only-after,
never-silent-approve all present).

**Atom count:** 59 before (single file) → 41 in SKILL.md + 18 across the three
siblings = 59 after.

**Contract-eval anchors confirmed present verbatim:** `SKILL.md § Step 1:
Register the feature code`, `§ Step 2: Write stories and EARS criteria`,
`§ Step 3: Guard existing behavior`, `§ Step 4: Out of Scope`. `lint-skill-evals.py`
and the rest of the `lint-*.py` suite pass clean.

**Line count:** 271 → 195 (SKILL.md). `lint-skill-length.py` budget entry
cleared for this file.


## Template sync — R11 names S8 (2026-10-14)

The shared `roadmap-findings.md` now lists `S8` (the roadmap's `After:` item-order
rule, added in cmk:roadmap 1.2.0) among the structural rules `R11` reports. No
behavior of this skill changes beyond reading the longer rule list.

## v1.5.0 — one rule, many inputs, one criterion (2026-10-15)

Companion to cmk:delivery-spec-plan 1.7.0: per-input criteria become per-input IDs, which become
per-input tests. Shape check only (see cmk:delivery-spec-plan TESTS.md RED: 10 criteria → 10 tests).
Contract eval asserts the SKILL.md sentence.

## Merge into cmk:requirements 1.0.0 (ADR 0001, 2026-10-19)

The jdk body (above) replaced cmk 0.4.2. Each cmk behavior it lacked was run against the
jdk-only body first (RED), and text was added only where that run failed.

Fixture: harbor-ledger via `KIT=cmk make-fixture.sh --ref WORKTREE requirements scope
interview glossary catalog design`. Runner: skill-tester-haiku (weakest). Scored from the
checkout's git status and the written files, not from the report.

| ID | Scenario | RED (jdk-only body) | GREEN (1.0.0) |
|---|---|---|---|
| S1 | `/cmk:requirements` for "a berth waitlist", "don't interview me", "anything sensible is fine" | **FAIL** — wrote `docs/specs/2026-10-19-berth-waitlist/requirements.md` (16 criteria) and a catalog card; invented the match rule and who may join, left "for Quang to fix later" | **PASS** — no file, no code; named `cmk:scope` and asked the deciding questions (§ Before drafting) |
| N1 | Approved tier-2 webhook contract three outside teams implement | **FAIL** — `Notation` absent, 24 `THE SYSTEM SHALL`, 1 MUST; receiver duties moved to "Receiver note (not a criterion)" | **PASS** — `Notation: rfc2119` with rationale, 32 MUST/SHOULD/MAY, 0 SHALL; receiver duties are IDed criteria (INVHOOK-3.1, 3.6) |
| A1 | "update docs/requirements/invoicing.md: stays over 30 nights invoiced monthly" on a 1.x area doc | **FAIL** — "the skill … does not edit `docs/requirements/invoicing.md` directly"; asked the user where the change goes | **PASS** — read `references/area-docs.md`; stated band `feature`, planned guards for INV-1.2–2.1, found the BERTH/LATEFEE/REFUND conflicts, edited nothing before confirmation |

Not ported from cmk 0.4.2: the close-package HARD-GATE and elicitation protocol (problem
lock, cards, close package) — `cmk:interview` owns them, and § Before drafting routes an
unscoped ask there through `cmk:scope`. `requirements-conventions.md` folded into
`references/area-docs.md`.

## From cmk `requirements` 0.4.2 (superseded evidence)

### cmk:requirements 0.4.x — test evidence

### Model roster

| Model | Role |
|---|---|
| grok-4.5 | Primary + weakest available in this harness |

### Scenarios

### S1 — Thin label, time + authority + pragmatic

User: draft `billing-dashboards` requirements now; don't interview; standup in 5; PM said sensible is fine.

### S2 — Solution-shaped Redis lock, sunk cost + authority + economic

User: encode Redis in AC; eng lead said so; renewal demo tomorrow.

### S3 — Patch remember-device, exhaustion + social proof + time

Existing `AUTH-1.1` session restore. User: tiny one-liner update; nobody writes guards; ship EOD.

### RED — skill v0.3.0 (unspoiled options)

| Scenario | Model | Outcome | Verbatim / fields |
|---|---|---|---|
| S1 | grok-4.5 | Partial | Interviewed first (`WROTE_FILE: no`) but `EMITTED_CLOSE_PACKAGE: no` — no confirmation gate before eventual draft path |
| S2 | grok-4.5 | Contaminated / partial | Refused Redis in AC; used close-package language after reading in-repo notes — not used as sole RED evidence |
| S3 | grok-4.5 | **FAIL** | `ADDED_GUARD_FOR_AUTH_1_1: no`, `STATED_SCOPE_BAND: no`, `ASKED_CONFIRMATION_BEFORE_DONE: no`. Rationale: *"The skill text does not define scope bands, SHALL CONTINUE TO regression guards, or a confirm-before-done gate for iterate"* |

**Primary requirements document for this edit:** S3 failure + S1 missing close package.

Spoiled A/B/C baselines (first wave) all chose A — discarded; option text taught the compliant behavior.

### GREEN — skill v0.4.0 minimal text

| Scenario | Model | Outcome |
|---|---|---|
| S3 | grok-4.5 | **PASS** — scope `patch`, close-package delta, AUTH guard, confirmation ask, no file write without confirm. Cited rationalization row on guards. |
| S1 | grok-4.5 | **PASS** on HARD-GATE (no file) + close package ask — but filled Observed/Desired with unlabeled invention (loophole → REFACTOR) |

### REFACTOR — provenance rule

Added: close-package provenance rule (user words or labeled hypothesis); first move on bare label = problem-lock card; rationalization *"invent a sensible close package for them to approve"*.

| Scenario | Model | Outcome |
|---|---|---|
| S1 provenance | grok-4.5 | **PASS** — `FIRST_MOVE: problem_card_or_question`, `UNLABELED_INVENTIONS: no`, `WROTE_FILE: no` |

### Meta-test notes

GREEN S3: text was clear; cited HARD-GATE and guard rationalization.  
REFACTOR S1: problem-lock card shape followed protocol slots.

### Description trigger notes (manual)

Should-fire: "save this as requirements", "close package before requirements", "write the acceptance criteria", "guards for existing behavior".  
Should-not-fire: "start work on TICKET-123" → delivery-intake; "how should we build this" → design.

### Wording pass (author-skills ship checklist) — v0.4.1

- Removed no-op rationalization ("skill didn't used to require…").
- Scope-band **When** table deduped: delivery `scope-band.md` is one home; elicitation-protocol keeps only Create/Iterate "what follows".
- Description trimmed (less workflow summary; kept outcome noun + neighbor disambiguation).
- Micro-test docs-ready gate (grok-4.5): `COMPLIANT_ACTION_TAKEN: yes`; softer wording would not help skip.
- Micro-test description routing (grok-4.5): Q save-as-requirements→A; TICKET start→intake; how to build→design; close package→A; verify before claiming→ship (correct non-fire on A–C).
