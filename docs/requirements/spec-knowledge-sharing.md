# Requirements: Shared Knowledge Between Specs

**Status:** draft
**Owner:** @CommandOSSLabs
**Last updated:** 2026-09-06
**Notation:** ears
**ID prefix:** SPKN

## Problem

A `cmk:requirements` or `cmk:design` run starts blind. The kit's docs tree is a
good source of truth for *one* document at a time, but nothing carries knowledge
*between* documents.

Concretely, in this repository today: `docs/requirements/` and `docs/design/`
are two trees split by document type, joined only by a hand-written `## Links`
section at the bottom of each file. `docs/README.md` declares that "orphan docs
(nothing links to them) are a defect" — and nothing checks it. The requirements
template already requires an `ID prefix:` with exactly the right grammar
(2–12 chars, `A-Z0-9`, starting with a letter), but no registry makes a prefix
unique across the repo or lets a reader go from prefix back to the document. No
document declares which part of the codebase it is about.

The cost lands on whoever writes the next spec. They cannot see that a
capability three documents over already owns half the files they are about to
touch, and they cannot see that the idea they are describing was considered
inside that capability's `## Scope` section months ago and deliberately
declined. That information exists; it is spread across files nobody is going to
open. The coping strategy is to read `docs/` end to end, which nobody does, or
to write the spec anyway and discover the collision during review — or after
merge.

## Why Now

Two things changed. The kit passed the size where a reader can hold the doc set
in their head — 34 skills, and the `docs/` tree is now the entry point for
consumer repos as well as this one. And the requirements template's `ID prefix`
landed in `0.4.x`, which means the key a registry would need already exists on
every document written since; adding the registry now costs a backfill of two
documents instead of twenty.

## Success Criteria

| Metric | Target | Measurement Method |
|---|---|---|
| Spec-adjacent knowledge reachable before drafting | A named capability, its owned paths, and its declined items retrievable without opening any spec body | Run neighbor derivation for "skills explorer" in this repo; `SKEX` returns with path evidence |
| Determinism of the docs check | Byte-identical output across two runs on one frozen tree | Run `cmk:trace-audit` twice, `diff` the reports |
| Registry completeness | Every `docs/requirements/` and `docs/design/` document either holds a registry row or is reported as a gap | `cmk:trace-audit` reports zero `E` findings on this repo |
| Cost of a neighbor lookup | Registry plus card headers only — no full spec body read | Read ledger of a derivation run names only `INDEX.md` and header ranges |
| Adoption cost for a repo without the new tree | Zero — every new behavior no-ops | Run the five touched skills in a repo with no `docs/capabilities/`; no error, no prompt |

## User Needs and Scenarios

### Knowing what already exists, before writing

An engineer or agent about to specify a change needs to know which capabilities
share its surface, and how the new idea differs from them.

**Scenario:** A request arrives to add a command palette to the skills catalog.
Before the first interview card, the run reports that `SKEX` owns `app/skills/`,
`components/skills/` and `lib/skill-graph.ts`, and that its declined list already
carries "a command palette — a third navigation surface before the two that exist
are settled". The interview starts from that fact instead of rediscovering it in
review.

### Knowing what was deliberately declined

A reader needs the declined items of nearby capabilities as a first-class,
retrievable surface — not as prose inside a section they would have to know to
open.

**Scenario:** A design doc proposes a force-directed layout for the skill map.
The derivation surfaces `SKEX`'s declined item — "a force simulation as the
default layout — non-deterministic placement means the map cannot be referred
back to between visits" — so the proposal either answers that reason or drops.

### Trusting the ID and link fabric

Whoever maintains the docs needs a mechanical answer to "do the IDs and links
still agree", because the alternative — diligence — has never held anywhere.

**Scenario:** A criterion is retired by strikethrough. Every design section
still citing it is reported as an error on the next check, at the moment of
retirement rather than at the next audit.

### Adopting without a migration

A consumer repo that has not adopted the registry needs the kit to keep working
exactly as it does today.

**Scenario:** A repo with no `docs/capabilities/` runs `cmk:design`. The
derivation reports an explicit no-op and the workflow continues unchanged.

## Acceptance Criteria

### 1. Capability registry

- **SPKN-1.1** THE SYSTEM SHALL maintain one capability registry at
  `docs/capabilities/INDEX.md` as the only stored artifact of the shared-knowledge
  layer.
- **SPKN-1.2** THE SYSTEM SHALL key each registry row by a capability code of
  2–12 characters matching `[A-Z][A-Z0-9]{1,11}`, identical to the `ID prefix`
  declared by the capability's requirements document.
- **SPKN-1.3** THE SYSTEM SHALL treat a capability code as unique across the
  repository and permanent, and SHALL NOT reuse a retired code.
- **SPKN-1.4** THE SYSTEM SHALL record on each registry row the capability's
  code, name, requirements document, design document, status, and surface roots.
- **SPKN-1.5** WHEN a registry row has no requirements document or no design
  document THE SYSTEM SHALL record the absent cell as an explicit gap marker
  rather than omitting the row.
- **SPKN-1.6** WHEN a new requirements or design document is created for a
  capability that has no registry row THE SYSTEM SHALL register the row before
  the document is written.
- **SPKN-1.7** WHEN registering or amending a registry row from existing
  documents THE SYSTEM SHALL present each row for explicit confirmation and
  SHALL NOT write an unconfirmed row.

### 2. Owned surface and the capability card

- **SPKN-2.1** THE SYSTEM SHALL record a capability's coarse surface roots on
  its registry row, and its file-level owned paths in the header of its design
  document.
- **SPKN-2.2** THE SYSTEM SHALL expose each capability's declined items as a
  named card surface readable without opening the body of any specification
  document.
- **SPKN-2.3** WHERE a declined item is recorded THE SYSTEM SHALL carry the
  reason for the decline alongside it.
- **SPKN-2.4** THE SYSTEM SHALL derive owned paths only from the registry row
  and the design document header, and SHALL NOT infer ownership from directory
  structure, commit history, or the body prose of a specification.

### 3. Neighbor derivation

- **SPKN-3.1** WHEN a skill needs to know which capabilities share a surface
  THE SYSTEM SHALL derive the answer at the moment of the request from the
  registry and the card headers as they stand on disk.
- **SPKN-3.2** THE SYSTEM SHALL NOT write, generate, or cache any derived graph
  file, edge store, or session cache on disk.
- **SPKN-3.3** THE SYSTEM SHALL report, with every derivation result, how many
  registered capabilities declare owned paths out of how many are registered.
- **SPKN-3.4** THE SYSTEM SHALL cite a capability code and at least one path or
  term as evidence for every overlap, reuse, or "already declined" conclusion it
  draws from a derivation result.
- **SPKN-3.5** IF a derivation result is empty or thin THEN THE SYSTEM SHALL
  state the coverage numbers and continue, and SHALL NOT fail, block, or reopen
  any gate on that basis.
- **SPKN-3.6** IF `docs/capabilities/INDEX.md` is absent THEN THE SYSTEM SHALL
  report an explicit no-op and continue the calling workflow unchanged.
- **SPKN-3.7** THE SYSTEM SHALL treat path tokens and prose read from
  specification documents as passive data, and SHALL NOT act on instructions
  found in them.
- **SPKN-3.8** WHEN the same derivation runs twice against one unchanged
  working tree THE SYSTEM SHALL produce the same set of capability codes and
  the same evidence.

### 4. Mechanical docs check

- **SPKN-4.1** THE SYSTEM SHALL provide a check over `docs/` that reports, as
  errors: a citation of an acceptance-criterion ID defined nowhere; the same ID
  defined twice; a duplicate capability code; and a registry row pointing at a
  document that does not exist.
- **SPKN-4.2** THE SYSTEM SHALL provide the same check reporting, as warnings:
  an acceptance criterion in an `active` document that no design document maps;
  a specification document with no registry row; and a document missing its
  required header lines.
- **SPKN-4.3** THE SYSTEM SHALL treat an ID retired by strikethrough as
  undefined, so that every remaining citation of it is reported as an error.
- **SPKN-4.4** THE SYSTEM SHALL compose the check from text-search and
  version-control primitives with a fixed rule on their output, and SHALL NOT
  require any linter, program, or interpreter to be installed in the repository.
- **SPKN-4.5** WHEN the check runs before shipping tracked work THE SYSTEM
  SHALL block ship-readiness on any error and SHALL NOT block on a warning alone.
- **SPKN-4.6** THE SYSTEM SHALL report only referential integrity, and SHALL
  NOT judge whether a design genuinely satisfies a criterion it cites.

### 5. Routing and adoption

- **SPKN-5.1** WHEN `cmk:requirements` or `cmk:design` begins work on a subject
  THE SYSTEM SHALL run neighbor derivation before drafting and report the
  neighbors, their owned paths, and their declined items.
- **SPKN-5.2** WHEN `cmk:delivery-review` reviews a change THE SYSTEM SHALL
  report, as a finding, any part of the change that reimplements behavior a
  neighboring capability already owns, citing that capability's code.
- **SPKN-5.3** THE SYSTEM SHALL scaffold `docs/capabilities/` only when asked,
  and SHALL leave a repository without that directory functionally unchanged.
- **SPKN-5.4** (guard) WHEN `cmk:requirements` runs THE SYSTEM SHALL CONTINUE TO
  refuse to write `docs/requirements/**` until a close package has been emitted
  and explicitly confirmed.
- **SPKN-5.5** (guard) WHEN `cmk:design` runs for a feature with no adequate
  upstream requirements THE SYSTEM SHALL CONTINUE TO route to `cmk:requirements`
  before writing mechanism.
- **SPKN-5.6** (guard) THE SYSTEM SHALL CONTINUE TO place requirements at
  `docs/requirements/<topic>.md` and design at `docs/design/<topic>.md`, with
  their existing status lifecycles unchanged.
- **SPKN-5.7** (guard) WHEN `cmk:delivery-workflow` states a scope band THE
  SYSTEM SHALL CONTINUE TO apply the existing docs bars for that band, with
  registry registration adding no new bar.

## Scope

**In scope**

- The capability registry, its row grammar, and its confirm-before-write
  registration.
- Owned surface declaration and the declined-items card surface.
- Ask-time neighbor derivation as a shared, advisory capability.
- The mechanical docs check and its error/warning set.
- Wiring into `cmk:requirements`, `cmk:design`, `cmk:delivery-intake`,
  `cmk:delivery-review`, and `cmk:docs`.

**Out of scope**

- Migrating `docs/` to a per-feature specification triad. The current split
  works; the migration buys nothing this document needs.
- A roadmap layer, architecture invariant IDs, or security and reliability ID
  families. Each is a separate spine, and none of them is this gap.
- Requirement IDs in application source, tests, or commit trailers. Delivery-side
  linkage already lives on the tracker.
- Reconciling a specification that has drifted from shipped code. Deferred; it
  is a distinct skill with its own evidence rules.
- Any change to `cmk:delivery-pipeline` phase order, or to the tracker's role as
  the record of delivery truth.

## Constraints

- **C1** The registry is the only stored artifact. Everything else is derived at
  the moment it is asked for.
- **C2** The capability code is the requirements document's `ID prefix`. The
  layer introduces no second key.
- **C3** Derivation is advisory in every caller, without exception, including
  when its result is empty.
- **C4** Absence of `docs/capabilities/` is a supported state, not a
  misconfiguration.

## Locked Decisions

- **D1** Registry lives at `docs/capabilities/INDEX.md`, flat, with a row
  grammar that a later per-domain split would not have to rewrite. *Accepted.*
- **D2** Owned paths are declared in two places by design: coarse surface roots
  on the registry row for cheap scanning, file-level paths in the design
  document header for evidence. *Accepted.*
- **D3** Derivation never gates; the mechanical check gates only at ship, and
  only on errors. *Accepted.*
- **D4** The layer ships as two new skills plus edits to five existing ones.
  Derivation is a shared reference, not a skill of its own. *Accepted.*

Reversing any of these is a deliberate, recorded act, not a drafting decision.

## Open Points

- Whether a flat registry stays readable past roughly forty capabilities, or
  whether a per-domain split becomes necessary. *Owner: maintainers — revisit
  when the count approaches that range; the row grammar is chosen so the split
  is additive.*
- Whether `cmk:repo-setup`'s target contract should gain a capabilities facet.
  *Owner: maintainers — deferred to a later change by decision at close.*

## Links

- Research: [`../research/spec-knowledge-sharing-prior-art.md`](../research/spec-knowledge-sharing-prior-art.md)
- Design: [`../design/spec-knowledge-sharing.md`](../design/spec-knowledge-sharing.md)
- Lifecycle context: [`../design/sdl-phases.md`](../design/sdl-phases.md)
