---
name: cmk:requirements
description: Use when scoped work needs its requirements written or updated — "draft the requirements", "write the acceptance criteria", "draft a PRD", "update docs/requirements/…", SHALL CONTINUE TO guards — producing the user stories and EARS or RFC 2119 acceptance criteria in a feature's requirements.md (or a product area's doc) that every later task, test and commit cites by ID. After cmk:scope, before any design or code.
version: 1.0.0
---

Produce `docs/specs/<YYYY-MM-DD>-<feature>/requirements.md` from the approved
cmk:scope outcome. Requirements are the durable source of intent: they outlive
this conversation, and every task, test, and commit will cite their IDs. Input may
arrive as conversation, local docs, or a linked Notion or Google Docs page — read the
page through its connected tool.

## Before drafting: an approved scope

Draft only when this work has an approved scope: a stated tier (1 or 2) with an approach
the user chose — in this conversation, in a confirmed `cmk:interview` close package, or
because the user says scoping is done. IF it has none, write no file and register no code:
REQUIRED SUB-SKILL: use `cmk:scope`. A product label ("a berth waitlist"), a stack
prescription, "don't interview me", or "anything sensible is fine" is not a scope. Given
exactly that, one baseline run wrote 16 criteria and a catalog card, invented the match
rule and who may join, and left them "for the TPM to fix later".

## Three modes — pick by what you were handed

**Tier-1 mini-spec** — a fix plus a guard for an **already-approved** feature
(from `cmk:amend` or `cmk:debug`). Not a new `requirements.md`: append to
the owning feature's `requirements.md` (or `docs/specs/fixes.md` if unowned)
the **fix requirement** (one EARS criterion, Step 2's forms) and its
**`SHALL CONTINUE TO` guard** (Step 3, for the behavior the fix must not break).

Self-review just those two criteria: the ambiguity and testability scans, plus
the code-claim check (Step 5) only when a criterion asserts how the system
*currently* works — a guard usually does. Present both for approval, keep the
feature's `Status`, and exit to `cmk:tdd`. **Skip Steps 1 and 4 and the
whole-file review** — those are for a new feature, not a two-line mini-spec.

**Product-area doc** — the request targets `docs/requirements/<topic>.md`, a product
area's living requirements (a PRD), rather than one feature: read
`references/area-docs.md` and follow it instead of the steps below. Asked to update
`docs/requirements/invoicing.md`, a baseline run refused because this skill "does not
edit `docs/requirements/invoicing.md` directly", and left the user to say where the
change belongs.

**New feature** — tier 2, or anything nothing has spec'd yet. Start from
`references/templates/requirements.md`. Every heading in
that template is a REQUIRED slot: fill it, or write `None` — never drop one.
Then run the full sequence below, one todo per step.

## Step 1: Register the feature code

Pick a short unique prefix (2–12 chars, A–Z0–9, starts with a letter — e.g.
`SHELL`, `SYNC2`). The catalog is **shared**: `docs/specs/INDEX.md` is the Domain
router; feature cards live in `docs/specs/catalog/<domain>.md`. Add a card row to
the owning **shard** BEFORE writing requirements (ensure a router row exists for
that domain). Never put Code rows on INDEX itself; never reuse a retired code.
Flat INDEX → stop and name `/cmk:catalog` Domain boundary migrate.

**Bind the roadmap item.** WHERE `docs/roadmap/INDEX.md` exists, read `references/roadmap-bind.md` beside
this file and follow it exactly — the shard row's **Roadmap item** column is the only
plan↔spec join. WHERE there is no roadmap, or the work was never a roadmap item, write `—`.

**Promote ephemera.** IF a `.skills/_pending-<slug>/` directory was used for this work, move it to `.skills/<CODE>/` (`mv` when CODE dir absent) so subsequent writes use the Feature root — see `references/templates/skills-ephemera-paths.md`.
**Done when:** the code has a Draft card in the owning shard, and its Roadmap item cell
holds a `ROAD-N` or `—`, and that ROAD is not already bound to another CODE.

## Step 2: Write stories and EARS criteria

One `## N. <title>` section per user story, each with acceptance criteria as
EARS statements carrying hierarchical IDs `**CODE-N.M**` — **N is the story
number** (same N as the `## N` heading). That identity is load-bearing: later
skills derive review units from it.

Each behavioral story carries a `**Story:**` line: `As a <actor>, I want
<capability>, so that <benefit>.` That line must name **one demoable act** a
person can do or prove once the story lands — not a technical layer
("the storage layer is rewritten").

EARS forms:

- `WHEN <event> THE SYSTEM SHALL <behavior>` — event-driven
- `WHILE <state> THE SYSTEM SHALL <behavior>` — state-driven
- `IF <unwanted condition> THEN THE SYSTEM SHALL <behavior>` — error handling
- `WHERE <feature enabled> THE SYSTEM SHALL <behavior>` — optional features
- `THE SYSTEM SHALL <behavior>` — always-true invariants

WHERE someone outside this team implements against the document — a protocol, a wire
format, a published API — and its obligations differ in strength, set `Notation: rfc2119`
in the header and write every criterion in MUST / SHOULD / MAY per
`references/requirements-guidance.md` § Choosing the notation; the IDs and stories stay.
For a webhook three outside teams build receivers against, a baseline run wrote 24
`THE SYSTEM SHALL` criteria about the sender and moved every receiver obligation —
answer within 10 seconds, dedupe on `event_id`, ignore unknown types — into notes marked
"not a criterion".

One observable behavior per criterion. If a sentence needs "and", it is
usually two criteria. One rule applied to several inputs (a field list, a set of defaults) is
one criterion naming them all, not one criterion per input — per-input IDs
become per-input tests downstream. There is **no criteria-count cap** — size is visible later
from task file paths at plan/execute preflight, not from counting EARS lines.
**Done when:** every story has ≥1 criterion, every criterion has exactly one
WHEN/WHILE/IF/WHERE/ubiquitous form, and each `**Story:**` names one demoable act.

## Step 2b: Non-functional requirements (quality attributes)

Behavioral criteria (Step 2) say *what* the system does; non-functional
requirements (NFRs) say *how well* it must do it — and unstated quality
attributes are where features quietly fail. After the behavioral criteria, fill
the template's NFR section (pre-printed in `references/templates/requirements.md`):

```
## <N>. Quality attributes
**Section-kind:** nfr
```

```
SECTION-KIND IRON LAW
- NFR section MUST carry **Section-kind:** nfr (pre-printed in the template —
  do not delete it).
- absent = story  (unmarked section is a behavioral review unit)
- Fail visible: unmarked NFR → extra unit in preflight.
- Fail silent (forbidden): marking a real story nfr → boundary disappears.
```

Walk the four quality attributes:

- **Performance** — latency, throughput, resource ceilings.
- **Security** — authn/authz, data protection, the trust boundaries crossed.
- **Reliability** — availability, error budget, recovery, durability.
- **Accessibility** — conformance target (e.g. WCAG 2.1 AA), keyboard/SR support.

### System docs for NFR grounding (thin consult)

WHEN an attribute is material for this feature (not already headed for
`None`), read `references/nfr-grounding.md` and follow it exactly —
which system doc to consult per attribute, the hard constraints that outrank
it, and the write rules after consult. Do **not** invent a TB/THR/CMP/SLO (or
product metric) ID without a bold definition in an Approved doc.

An attribute that does not apply is **not silently dropped**: record it as
`None` with a short reason (e.g. "Accessibility: None — headless CLI") so the
skip is a visible decision, not an oversight. `None` is for non-material
attributes, **not** a shortcut past consult when the attribute *is* material.

The category is **additive, never a new gate**: a feature with no
quality-attribute concerns records `None` across the four. In tier-1 mode,
capture an NFR only when the fix itself is a quality-attribute change.

**Done when:** the NFR section carries `**Section-kind:** nfr`; each of the four
quality attributes is either an IDed NFR criterion or explicitly `None` with
reason; and for every **material** attribute the consult outcome is recorded
(Approved doc used, or Absent/non-authoritative no-op) before the line is written.

## Step 3: Guard existing behavior

List every file the change touches, then work that list. A file with no existing
behavior at risk gets an explicit `no behavior to guard` line and nothing more;
for every existing behavior in the rest, add a guard —
`**CODE-N.M** (guard) WHEN <condition> THE SYSTEM SHALL CONTINUE TO <existing
behavior>`. Guards are what stop an agent from breaking load-bearing behavior
nobody mentioned. For a tier-1 bugfix this step plus one fix requirement IS the
spec, appended to the destination named under Two modes.
**Done when:** every file the change touches is listed; every existing behavior
found in those files has its own guard requirement; and every file with none
carries the explicit `no behavior to guard` line. An empty guard set with no list
behind it does not count.

## Step 4: Out of Scope

List what this feature deliberately does NOT do. This section is the defense
against scope creep during implementation and review.

## Step 5: Self-review, then the approval gate

Self-review before showing the user:
- **Ambiguity scan:** could any criterion be read two different ways? Pick one
  reading and write it in.
- **Testability scan:** can each criterion be verified by an automated test or
  a concrete manual check? Rewrite any that can't.
- **Placeholder scan:** no bare "TBD", "etc.", "handle errors appropriately". WHEN the
  cmk:interview close package listed **Owned unknowns**, paste them into Open Questions as
  `topic — owner — date — forbid-guess`. A bare TBD without those three fields
  **blocks** `Status: Approved` — do not delete Open Questions by sweeping unknowns under the rug.
- **Code-claim check (independent):** if any criterion asserts how the system
  currently works, read `references/self-review-conditional.md` and
  follow it exactly — dispatch a review subagent to prove it against the
  real code before the gate; a false premise here poisons design, plan, and code.
- **Close-package ingest:** when a cmk:interview close package exists, read
  `references/self-review-conditional.md` and follow it exactly — do not
  let it excuse marking an NFR `None` when the close package already locked it.

**Story-quality gate (consumer of demoable act).** List every non-NFR `## N`
with its `**Story:**` line and have the user confirm each names **one**
demoable act; split/rewrite and re-present any that fail. Only once all are
confirmed, and the user has approved the file, may you set `Status: Approved`.
Never silent-approve — "looks fine" without the per-story yes is not confirmation.

Then present the FILE to the user for review and STOP — do not proceed to
design on the strength of conversational agreement; the written requirements
are what get approved.
**Done when:** the user has approved the written file and confirmed each
behavioral story is one demoable act.

## ID immutability

Once Approved, IDs never change meaning or get renumbered. Retire one by striking it through
(`~~**CODE-1.2**~~ superseded by CODE-1.4`) — `cmk:traceability` treats struck IDs as undefined, so citing tests/tasks surface immediately.

## Exit

REQUIRED SUB-SKILL: use `cmk:design` (tier 2) or hand tier-1 fixes straight
to `cmk:tdd` with the new IDs.
