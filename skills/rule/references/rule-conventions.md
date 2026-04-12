# Rule Conventions

## Canonical Placement

- Common rules: `docs/rules/common/{topic}.md`
- Language-specific rules: `docs/rules/{language}/{topic}.md`
- Framework-specific rules: `docs/rules/{framework}/{topic}.md`

## Directory Structure

```
docs/rules/
├── AGENTS.md
├── README.md
├── common/              ← language-agnostic (required)
│   ├── coding-style.md
│   ├── git-workflow.md
│   ├── patterns.md
│   ├── security.md
│   └── testing.md
├── typescript/          ← add when needed
├── react/               ← add when needed
└── {framework}/         ← add when needed
```

## File Convention

- One topic per file — rules accumulate within the file
- Use `kebab-case` topic names
- Keep rules concise, actionable, and implementation-oriented
- Add language/framework folders only when actively used

## Rule Entry Format

Rules are written as direct statements within topic files. There is no rigid per-entry template — write naturally within the topic's structure. A rule should include:

- **What to do** (or not do) — clear, implementable statement
- **Why** — brief rationale
- **Example** — when the rule isn't self-evident

## Promoting from Knowledge

When a rule originates from a `docs/knowledge/` entry:
- Transform the learning into an actionable standard
- The user decides what gets promoted — never auto-promote
- Link back to the source entry when useful for traceability
