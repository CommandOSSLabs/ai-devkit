# cmk:requirements

## What
Skill that drafts and iterates requirements documents — the upstream "what and why" before any technical design, speaking technically where the product itself is technical. Synthesizes from conversations, research notes, Notion/Google Doc links, and `docs/knowledge/` entries. When input is thin or solution-shaped, runs elicitation (scope band, problem lock, cards, **close package + explicit yes**) before writing `docs/requirements/`; Iterate adds `SHALL CONTINUE TO` guards when existing behavior must keep working.

## Where
- Skill body: `skills/requirements/SKILL.md` — sections `Input`, `Elicitation` (HARD-GATE), `Workflow: Create`, `Workflow: Iterate`, `Output`, `Red Flags`, `Rationalizations`, `Links`.
- Elicitation protocol: `skills/requirements/references/elicitation-protocol.md` — scope band, problem lock, cards, close package provenance.
- Placement rules: `skills/requirements/references/requirements-conventions.md`.
- Shaping directive (not a fixed form): `skills/requirements/references/requirements-guidance.md` — criteria contract, **guarding existing behavior**, locked-decision registers, progressive disclosure, coherence.
- Test evidence: `skills/requirements/TESTS.md`; `skills/requirements/eval.json`.
- Output template (baseline scaffold shape): `docs/templates/requirements.md`.
- Default placement: `docs/requirements/<topic>.md` — see `docs/requirements/README.md`. Shared vocabulary lives in the glossary (`cmk:glossary`).
