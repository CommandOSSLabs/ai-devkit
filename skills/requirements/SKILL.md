---
name: cmk:requirements
description: This skill should be used when the user asks to "save this as requirements", "let's define what we're building", "draft requirements", "draft a PRD", "update the requirements", or discusses product scope, success criteria, and user needs. Covers drafting, refining, or updating requirements documents under docs/requirements/ — product-wide or per-feature — from conversation notes, research, user feedback, external docs, or direct instructions.
version: 0.3.0
---

# Requirements

Create or iterate requirements documents. Requirements capture the product "what and why" — and when the product itself is technical, the requirements speak technically too: guarantees, protocols, and verifiability claims are legitimate requirements language. Architecture and mechanism belong in design; implementation detail lives in the design doc's feature-level variant.

## References

Read `references/requirements-conventions.md` for placement rules and `references/requirements-guidance.md` for how to shape the document — a directive, not a fixed form.

## Input

Synthesize from whatever the user provides: conversation context, user research, local docs, external links (Notion, Google Docs), direct prompts, or `docs/knowledge/` entries (when explicitly referenced).

## Elicitation

When the input is an initial idea rather than settled requirements, don't template-fill from thin air — interview first. Ask focused questions one at a time (problem, users, success, scope boundaries, constraints, non-goals), distill the answers, and only then draft. Where an interview-driven skill is available in the session (e.g. superpowers' brainstorming), use it as the elicitation engine; the output lands here as the requirements doc. Distilled beats generic: a requirements doc that could describe any product has failed.

## Workflow: Create

1. Normalize input into product context: problem, timing, success criteria, user needs, scope. Run the elicitation step above when material is thin.
2. Shape the document per `references/requirements-guidance.md`, aligning to local convention if one exists.
3. Place at `docs/requirements/<topic>.md` — one file per product area or feature; `docs/requirements/README.md` indexes them. A large product splits per area with a concise entry-point doc so readers load only the context a task needs.
4. Use glossary terms (see `cmk:glossary`) for every system, component, and actor name; define new terms there, not inline.
5. Mark unknowns in `Open Points` — don't guess.
6. Set status to `draft`.

## Workflow: Iterate

1. Read the existing requirements document in full.
2. Identify what changed and why.
3. Update affected sections in place. Preserve unchanged content.
4. **Coherence check:** a requirement change can invalidate downstream design docs and recorded decisions — read the linked `docs/design/` docs and relevant `docs/decisions/` records, flag conflicts, and cascade the update or record the conflict rather than committing a silently inconsistent doc set. Locked decisions are never silently reopened; reversing one is an explicit act on its record.
5. Update `Last updated` date.
6. Transition status when appropriate: `draft` → `active` → `decomposed` → `shipped`, or any → `deprecated`.

## Output

- Create: complete requirements document at `docs/requirements/<topic>.md` with known context populated
- Iterate: targeted updates to affected sections only, cascaded to affected surfaces
- Unresolved decisions go in `Open Points`
- Problem names a specific user segment with concrete pain
- Success criteria are measurable with targets
- Normative vocabulary (MUST/SHOULD/MAY) used consistently once adopted
- No architecture or mechanism detail — that's design's job

## Links

Every requirements doc lists downstream links to the `docs/design/` docs that implement it, once they exist. Wording stays progress-neutral and tracker-neutral.
