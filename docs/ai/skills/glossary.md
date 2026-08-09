# cmk:glossary

## What
Skill that creates and maintains the repository's shared glossary — the normative vocabulary for systems, sub-systems, components, actors, roles, and states, used identically in requirements, design, decisions, code, tickets, and conversation. Entries define logical responsibility (not deployment), draw the boundary against neighboring terms, and carry MUST/MUST NOT force where behavior-bearing. One term, one meaning; no near-synonyms; changes cascade to every surface using the term.

The skill is cross-cutting, not standalone-triggered: it fires proactively in any conversation or SDLC phase whenever a new term is coined, a term is ambiguous or contested, or a doc/identifier drifts from established vocabulary — running its Iterate workflow inline as part of the change at hand.

## Where
- Skill body: `skills/glossary/SKILL.md` — sections `Cross-cutting trigger`, `Placement`, `Entry shape`, `Rules`, `Workflow: Create`, `Workflow: Iterate`. No `references/` folder.
- Default placement: `docs/requirements/glossary.md` (area-scoped: `docs/requirements/<product>/glossary.md`), linked from the requirements entry point and design tree README.
- Consumers: `cmk:requirements`, `cmk:design`, `cmk:adr`, and `cmk:delivery-spec-plan` carry explicit glossary steps requiring glossary terms for every named system/component/actor; the naming rules (`cmk:rule`, `cmk:agent-instructions` seeds) share its no-near-synonyms discipline; `docs/design/sdl-phases.md` lists it as an any-phase skill.
