# cmk:glossary

## What
Skill that creates and maintains the repository's shared glossary — the normative vocabulary for systems, sub-systems, components, actors, roles, and states, used identically in requirements, design, decisions, code, tickets, and conversation. Entries define logical responsibility (not deployment), draw the boundary against neighboring terms, and carry MUST/MUST NOT force where behavior-bearing. One term, one meaning; no near-synonyms; changes cascade to every surface using the term.

## Where
- Skill body: `skills/glossary/SKILL.md` — sections `Placement`, `Entry shape`, `Rules`, `Workflow: Create`, `Workflow: Iterate`. No `references/` folder.
- Default placement: `docs/requirements/glossary.md` (area-scoped: `docs/requirements/<product>/glossary.md`), linked from the requirements entry point and design tree README.
- Consumers: `cmk:requirements` and `cmk:design` require glossary terms for every named system/component/actor; the naming rules (`cmk:rule`, `cmk:agent-instructions` seeds) share its no-near-synonyms discipline.
