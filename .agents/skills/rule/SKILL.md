---
name: cmk:rule
description: Codify engineering standards into docs/rules/. Use whenever someone wants to create, update, or promote knowledge into enforceable coding rules and conventions that agents follow during development. Also triggers for "add a rule that...", "make this a standard", "promote this learning to a rule", "update our coding conventions", or "what are our engineering rules".
metadata:
  sdl_phase: "any"
  domain: "rule"
---

# Rule

## Intents

```
Add a rule that all API endpoints must validate auth tokens before processing
```
```
Promote the Redis pooling learning to an infrastructure rule
```
```
Update the security rules — we now require CSP headers on all responses
```
```
Make it a standard that all services must have health check endpoints
```
```
Review the knowledge entries and let me pick what to promote to rules
```

## References

Read `references/rule-conventions.md` for placement rules and directory structure.

## Scope

Rules are enforceable engineering standards in `docs/rules/` organized by domain:
- `common/` — language-agnostic (coding style, git workflow, security, testing)
- `{language}/` — language-specific (e.g., `typescript/`, `python/`)
- `{framework}/` — framework-specific (e.g., `react/`, `nextjs/`)

## Input

Accept whatever the user provides: direct statements, knowledge entries from `docs/knowledge/`, conversation context, code patterns from review, or incident learnings.

## Workflow: Create

1. Understand the rule: what practice to enforce and why.
2. Determine target: subdirectory (`common/`, language, or framework) and topic file. Create new file if no match: `docs/rules/{domain}/{topic}.md`.
3. Write: clear actionable statement, brief rationale, example if not self-evident.
4. Link back to `docs/knowledge/` source when applicable.

## Workflow: Iterate

1. Read the existing rule file in full.
2. Identify what changed and why.
3. Update in place: revise statement, update rationale, add/update examples.
4. Link back to knowledge source when applicable.

## Workflow: Promote

1. Read specified knowledge entries from `docs/knowledge/`.
2. For each entry the user selects: determine target, transform learning into actionable rule, write to `docs/rules/`.
3. User decides what gets promoted — never auto-promote.

## Output

- Rules go in `docs/rules/{domain}/{topic}.md`
- Each rule is concise, actionable, and followable by an agent without ambiguity
- Rationale explains why, not just what
- Never promote without user confirmation
- Link to source knowledge entry when applicable
