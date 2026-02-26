# Engineering Rules

This directory contains coding standards, conventions, and development practices.

## Canonical Placement

- Common rules index: [`docs/rules/common/README.md`](./common/README.md)
- Common rules navigation: [`docs/rules/common/AGENTS.md`](./common/AGENTS.md)
- Common rules docs (authoritative baseline): `docs/rules/common/*.md`
- Language-specific rules: `docs/rules/{language}/*.md` (for example: `docs/rules/typescript/` or `docs/rules/rust/`)
- Framework-specific rules: `docs/rules/{framework}/*.md` (for example: `docs/rules/react/` or `docs/rules/nextjs/`)

## Baseline vs Templates

- Files in `docs/rules/common/*.md` are live baseline rules for this repository.
- Keep reusable scaffolds in `docs/templates/` only when you need to bootstrap rules in other repositories.

## Folder Convention

- Keep shared rules in `common/`
- Add language/framework folders only when they are actively used
- Keep rules concise, actionable, and implementation-oriented

## How to Use

1. Start with `common/` rules for any task.
2. Apply language/framework rules when the task requires them.
3. Update relevant rule docs when conventions evolve.
