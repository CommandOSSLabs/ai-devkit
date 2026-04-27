# Rules

## What
The engineering-rules tree under `docs/rules/`. Domain-partitioned — `common/` for language-agnostic standards, `{language}/` and `{framework}/` for stack-specific rules. The [`cmk:rule`](../skills/rule.md) skill writes into this tree; this repo ships a populated `common/` baseline.

## Where
- Rules root README and structure: `docs/rules/README.md`.
- Agent navigation entry: `docs/rules/AGENTS.md`.
- Common (language-agnostic) baseline: `docs/rules/common/` — `coding-style.md`, `git-workflow.md`, `patterns.md`, `security.md`, `testing.md`, plus `AGENTS.md` and `README.md`.
- Skill that maintains the tree: `skills/rule/SKILL.md`; placement rules in `skills/rule/references/rule-conventions.md`.
