# cmk:rule

## What
Skill that codifies engineering standards into `docs/rules/`. Rules are split by domain — `common/` for language-agnostic, `{language}/` for language-specific, `{framework}/` for framework-specific.

## Approach
Has a third workflow beyond create/iterate: **Promote**, which lifts an entry from `docs/knowledge/` into an enforceable rule and links the source knowledge entry as rationale. This makes the learn → rule progression explicit.

## Where
- Skill body: `skills/rule/SKILL.md` — sections `Workflow: Create`, `Workflow: Iterate`, `Workflow: Promote`, `Output`.
- Placement rules and directory structure: `skills/rule/references/rule-conventions.md`.
- Live example domain layout: `docs/rules/common/` (`coding-style.md`, `git-workflow.md`, `patterns.md`, `security.md`, `testing.md`).
