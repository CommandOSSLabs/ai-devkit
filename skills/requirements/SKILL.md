---
name: cmk:requirements
description: Use when the user asks to "save this as requirements", "draft requirements", "draft a PRD", "let's define what we're building", "update the requirements", "write the acceptance criteria", "what are the acceptance criteria for X", "close package", "SHALL CONTINUE TO", or discusses product scope, success criteria, user needs, guards for existing behavior, or what a system must do before anyone decides how to build it. Produces `docs/requirements/<topic>.md` with problem, success criteria, scope, and IDed acceptance criteria. Tracker-issue AC → `cmk:delivery-intake`; how to build → `cmk:design`.
version: 0.5.0
---

# Requirements

Create or iterate requirements documents. Requirements capture the product "what and why" — and when the product itself is technical, the requirements speak technically too: guarantees, protocols, and verifiability claims are legitimate requirements language. Architecture and mechanism belong in design; implementation detail lives in the design doc's feature-level variant.

## References

Read `cmk:capability-map`'s `references/neighbor-derivation.md` before drafting
— it is the one home for the ask-time neighbor recipe, and this skill does not
restate it. Read `references/requirements-conventions.md` for placement rules and `references/requirements-guidance.md` for how to shape the document — a directive, not a fixed form. When elicitation applies (below), read `references/elicitation-protocol.md` before drafting — it is the one home for scope band, problem lock, question cards, and the close package.

## Input

Synthesize from whatever the user provides: conversation context, user research, local docs, external links (Notion, Google Docs), direct prompts, or `docs/knowledge/` entries (when explicitly referenced).

## Neighbors before drafting

Before the first interview card — and before any draft — derive the capability
neighbors of the subject (`cmk:capability-map`, Workflow: Neighbors) with the
idea's key terms and any candidate paths as seeds. Report the neighbors, the
paths they own, and the items they already declined, with the code and the path
or term each conclusion rests on.

The completion criterion is a sentence you can say out loud: *which registered
capabilities share this surface and how this work differs — or that none does,
after stating the coverage numbers.* A neighbor's declined item is a recorded
decision with a reason: answer the reason in the close package, or route the
reversal explicitly. Do not step over it.

Advisory always. An empty or thin result is stated with its coverage numbers and
the workflow continues; it never blocks, and an absent
`docs/capabilities/INDEX.md` is a clean no-op.

## Elicitation

<HARD-GATE>
Do not write or overwrite `docs/requirements/**` until a close package has been emitted and the user has explicitly confirmed it — except when input is already a complete, non-generic package you can restate as that close package and they confirm immediately. Standup pressure, "don't interview me", "PM said write something sensible", and sunk-cost stack choices do not waive this gate.
</HARD-GATE>

When the input is an initial idea, a solution sketch, or otherwise unsettled, do not template-fill from thin air. Follow `references/elicitation-protocol.md`: state the **scope band** (`trivial` | `patch` | `feature`), lock the problem when the ask is solution-shaped, ask focused cards one at a time, then emit the **close package** and wait for yes. Distilled beats generic: a requirements doc that could describe any product has failed.

Where another interview engine is available in the session, it may drive the cards; the close package and this gate still land here before Create/Iterate writes files.

## Workflow: Create

1. Normalize input into product context. If elicitation applies, finish the close package confirmation first.
2. Shape the narrative sections per `references/requirements-guidance.md`. Where the repo already has requirements docs, follow their local convention for those sections.
3. **Set the notation and ID prefix in the header before writing a criterion.** Choose per `references/requirements-guidance.md` § Choosing the notation — from what discovery established about who the document binds, not from what the neighboring docs happen to use. Then write the `## Acceptance Criteria` section to the contract in that file's § What one criterion is (including guards when the guidance requires them).
4. **Register the capability before writing the file.** If the subject has no
   row in `docs/capabilities/INDEX.md`, REQUIRED SUB-SKILL: use
   `cmk:capability-map` (Workflow: Register) to confirm a row first — its code
   becomes this document's `ID prefix`, so the two can never disagree. Where a
   row exists, reuse its code. Where no registry exists, proceed unchanged.
5. Place at `docs/requirements/<topic>.md` — one file per product area or feature; `docs/requirements/README.md` indexes them. A large product splits per area with a concise entry-point doc so readers load only the context a task needs.
6. Use glossary terms (see `cmk:glossary`) for every system, component, and actor name; define new terms there, not inline.
7. Mark unknowns in `Open Points` — don't guess.
8. Set status to `draft`. Present the file for review; do not treat Create as finished on silence.

## Workflow: Iterate

1. Read the existing requirements document in full.
2. State the **scope band** out loud (`trivial` | `patch` | `feature`). `trivial` with no behavior change → do not revise AC for behavior. `patch` / `feature` that adds or shifts behavior → confirm a close package (full or delta) before editing.
3. Identify what changed and why.
4. Update affected sections in place. Preserve unchanged content.
5. **Guards:** when the change touches existing behavior or files that already have criteria, add `SHALL CONTINUE TO` (or RFC-equivalent) guards per `references/requirements-guidance.md` § Guarding existing behavior. A patch that only adds new AC with no guards for load-bearing existing AC has failed Iterate.
6. **Coherence check:** a requirement change can invalidate downstream design docs and recorded decisions — read the linked `docs/design/` docs and relevant `docs/decisions/` records, flag conflicts, and cascade the update or record the conflict rather than committing a silently inconsistent doc set. Locked decisions are never silently reopened; reversing one is an explicit act on its record.
7. Update `Last updated` date.
8. Transition status when appropriate: `draft` → `active` → `decomposed` → `shipped`, or any → `deprecated`. Present the diff for confirmation before treating Iterate as done.

## Output

- Create: complete requirements document at `docs/requirements/<topic>.md` with known context populated
- Iterate: targeted updates to affected sections only, cascaded to affected surfaces, with guards when existing behavior must keep working
- Unresolved decisions go in `Open Points`
- Problem names a specific user segment with concrete pain
- Success criteria are measurable with targets
- Header carries a `Notation:` and an `ID prefix:`, set before the first criterion
- Every acceptance criterion meets the contract in `references/requirements-guidance.md` § What one criterion is
- IDs are stable once status leaves `draft`: retired by strikethrough, never renumbered
- No architecture or mechanism detail — that's design's job
- Scope band was stated; close package was confirmed before write (when elicitation applied)
- Neighbors were derived and reported before drafting, with coverage numbers
- The `ID prefix` equals the capability's registry code, where a registry exists

## Red Flags — stop and return to elicitation or guards

- Drafting `docs/requirements/` in the same turn as the first interview question
- Starting an interview without deriving neighbors
- Concluding "nothing covers this" without stating the coverage numbers
- Minting an `ID prefix` that disagrees with the capability's registry row
- Encoding a store, framework, or topology in acceptance criteria because of sunk cost or "eng lead said so"
- `patch` / `feature` Iterate that adds AC but no guards for existing criteria on the touched surface
- Never stating scope band
- Treating silence or "just ship the doc" as close-package confirmation
- Emitting a fully invented close package from a bare product label without labeling hypotheses or asking a problem-lock card first

## Rationalizations

| Thought | Reality |
|---|---|
| "Standup in five — PM said don't interview" | A deadline changes *when* you report, not whether the close package exists. Ask one card or restate a close package; do not draft from a label. |
| "User already named Redis / the API — lock it in AC" | That is a solution-shaped assumption. Problem-lock first; mechanism belongs in design. |
| "Tiny one-liner — nobody writes guards" | Patch Iterate that touches existing behavior adds guards. Social proof does not delete regressions. |
| "I'll draft now and tidy Open Points later" | Unconfirmed guesses become false confidence in the doc. Open Points are for owned unknowns after the package is confirmed, not a dump for unasked questions. |
| "The neighbor's Out-of-Scope is old — things changed" | It is a recorded decision with a reason. Answer the reason in the close package or reverse it explicitly; ageing is not an argument. |
| "No neighbors came back, so this is greenfield" | Empty plus `1/9 declaring owned paths` means the registry is thin. State the numbers before claiming the surface is free. |
| "I'll invent a sensible close package for them to approve — faster than cards" | Unlabeled invention is still template-fill. Label hypotheses or ask one problem-lock card first; rubber-stamp packages from bare labels fail the provenance rule in `references/elicitation-protocol.md`. |

## Links

Every requirements doc lists downstream links to the `docs/design/` docs that implement it, once they exist. Wording stays progress-neutral and tracker-neutral.
