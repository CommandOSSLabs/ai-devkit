---
name: cmk:rule
description: Use when the user asks to "add a rule that...", "make this a standard", "promote this learning to a rule", "update our coding conventions", "what are our engineering rules", or needs to codify engineering standards into docs/rules/ as enforceable rules and conventions that agents follow during development.
version: 0.4.2
---

# Rule

Codify engineering standards into `docs/rules/`. Rules are enforceable standards organized by domain — `common/` for language-agnostic, `{language}/` for language-specific, `{framework}/` for framework-specific.

## References

Read `references/rule-conventions.md` for placement rules and directory structure.

## Input

Accept whatever the user provides: direct statements, knowledge entries from `docs/knowledge/`, conversation context, code patterns from review, or incident learnings.

## Workflow: Create

1. Understand the rule: what practice to enforce and why.
2. Determine target: subdirectory (`common/`, language, or framework) and topic file. Create new file if no match: `docs/rules/{domain}/{topic}.md`.
3. Write: clear actionable statement, brief rationale, example if not self-evident.
4. Link back to `docs/knowledge/` source when applicable.
5. Add or refresh the topic's row in `docs/rules/README.md`'s Topics table.

## Workflow: Iterate

1. Read the existing rule file in full.
2. Identify what changed and why.
3. Update in place: revise statement, update rationale, add/update examples.
4. Link back to knowledge source when applicable.

## Workflow: Promote

1. Read specified knowledge entries from `docs/knowledge/`.
2. For each entry the user selects: determine target, transform learning into actionable rule, write to `docs/rules/`.
3. User decides what gets promoted — never auto-promote.
4. Add or refresh the topic's row in `docs/rules/README.md`'s Topics table.

## Workflow: Audit

Auditing offenders? Read `references/audit.md`.

## Workflow: Gate

Building a mechanical gate? Read `references/gate.md`.

## Output

Placement, shape, promote confirmation, and knowledge links live in Create/Iterate/Promote and `references/rule-conventions.md`.
