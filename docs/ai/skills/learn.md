# cmk:learn

## What
Skill that extracts non-obvious learnings — gotchas, validated assumptions, hard-won fixes, discovered constraints — from any input (conversations, debugging, files, links) and files them into `docs/knowledge/{topic}.md`.

## Approach
Has an explicit extraction rule that filters out common knowledge, decisions (which belong in ADRs), and requirements (PRD/feature-spec). The workflow surfaces conflicts with existing entries to the user before writing — replace, keep both, or discard is the user's call, not the skill's.

## Where
- Skill body: `skills/learn/SKILL.md` — sections `Extraction Rule`, `Workflow: Extract`, `Workflow: Review`, `Output`.
- Placement rules and entry format: `skills/learn/references/learn-conventions.md`.
- Topic file template: `skills/learn/references/learn-template.md`.
- Default output directory: `docs/knowledge/` — see `docs/knowledge/README.md`.
