---
name: cmk:glossary
description: This skill should be used when the user asks to "create a glossary", "add a term to the glossary", "what do we call this", "define our vocabulary", "lock the terminology" — and proactively, in any conversation or SDLC phase, whenever a new system/component/actor/state gets named, one word is carrying two meanings, two words are carrying one, or a doc, ticket, or identifier drifts from the established vocabulary.
version: 0.1.0
---

# Glossary

Create or maintain the repository's shared glossary: the normative vocabulary for how the team — humans and agents — refers to systems, sub-systems, components, actors, roles, and states. One term, one meaning, used identically in requirements, design, decisions, code, tickets, and conversation. Together with the naming conventions (precise, concrete, self-descriptive names), the glossary is the primary defense against misalignment: without it, every conversation renegotiates what words mean.

## Cross-cutting trigger

The glossary is not a standalone phase — it is a concern that runs through every SDLC stage and every kind of conversation. Fire this skill mid-task, without being asked, whenever any of these happens:

- A new system, component, actor, role, or state gets a name — in a requirements or design doc, an ADR, a spec, a ticket, code, or plain discussion.
- Vocabulary is ambiguous or contested: one word carrying two meanings, two words carrying one, or participants visibly meaning different things by the same term.
- A doc, identifier, or ticket drifts from an established glossary term.

When a hooked skill's workflow reaches its glossary step (`cmk:requirements`, `cmk:design`, `cmk:adr`, `cmk:delivery-spec-plan`) or the triggers above surface a gap, run the Iterate workflow inline — add or sharpen the term as part of the change at hand, not as a deferred follow-up. If no glossary exists yet, propose creating one before locking new vocabulary.

## Placement

- Product-wide: `docs/requirements/glossary.md`, beside the requirements it serves.
- Area-scoped variant for large products: `docs/requirements/<product>/glossary.md`.
- The glossary opens with a status line ("accepted normative terminology for requirements, design, interfaces, and code") and a scope statement naming the domains it covers, plus links to the requirements entry point.

## Entry shape

One heading per term, grouped into domain sections. Each entry:

- **Defines the logical responsibility**, not a deployment: a term names what a thing *is* and *owns*, not where it runs. State explicitly when deployments may co-locate roles yet must keep their authority, keys, or evidence distinguishable.
- **Draws the boundary**: what the term is *not*, and how it differs from its nearest neighbors ("a game protocol is the source of rules; it is not a server, process, or player").
- **Carries normative force where behavior-bearing**: MUST/MUST NOT constraints belong in the entry when the term implies them.
- **Gives examples** when the abstraction needs grounding.

## Rules

- **One term, one meaning.** If a word needs two meanings, it's two terms — name them apart.
- **No near-synonyms.** Related concepts extend an established subject family rather than inventing a parallel word; this is the naming conventions' grep-ability rule applied to prose.
- **The glossary wins.** Requirements, design docs, ADRs, code identifiers, and tickets use glossary terms; a doc that needs a new concept adds it to the glossary rather than defining it inline.
- **Changes cascade.** Renaming or redefining a term sweeps every surface that uses it — docs, identifiers, diagrams — in the same change or an explicitly tracked follow-up; a silently drifted term is worse than no term.

## Workflow: Create

1. Harvest candidate terms from existing requirements, design docs, and code — the vocabulary already in use is the starting point, deduplicated and sharpened.
2. Resolve collisions and near-synonyms with the user; each resolution is a rename decision that may cascade into code.
3. Write entries per the shape above, grouped by domain; set the status line.
4. Link the glossary from the requirements entry point and design tree README.

## Workflow: Iterate

1. Read the affected entries in full.
2. Add, sharpen, or split terms; keep boundaries against neighbors explicit.
3. **Cascade check:** search the repo for uses of any changed term (docs and identifiers) and update or flag every stale use.
4. Keep the status and scope statement current.
