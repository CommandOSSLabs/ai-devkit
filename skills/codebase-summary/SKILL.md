---
name: cmk:codebase-summary
description: This skill should be used when the user asks to "map the repo", "document the project structure", "where does everything live", "update the codebase summary", or needs to create or iterate codebase summary documents that map repository structure, key entry points, core modules, and local dev setup.
version: 0.1.0
---

# Codebase Summary

Create or iterate codebase summary documents that map repository structure, key entry points, core modules, and local dev setup. Captures how to find things — not architecture rationale (belongs in system-design) or feature behavior (belongs in specs).

## References

Read `references/codebase-summary-conventions.md` for placement rules and `references/codebase-summary-template.md` for section structure.

## Input

Synthesize from: direct codebase exploration (directories, entry points, modules), existing docs (README, package.json, etc.), conversation context, or direct prompts.

## Workflow: Create

1. Explore the repository to understand layout, entry points, and module boundaries.
2. Map into template sections from `references/codebase-summary-template.md`. Align to local convention if one exists.
3. Place at the repository's existing path, or fallback: `docs/codebase-summary.md`.
4. Include local dev commands if discoverable.

## Workflow: Iterate

1. Read the existing summary in full.
2. Explore current codebase to identify what changed.
3. Update affected sections in place. Preserve unchanged content.
4. Update `Last updated` date.

## Output

- Create: complete codebase summary at `docs/codebase-summary.md`
- Iterate: targeted updates to affected sections only
- Layout matches actual directory structure
- Entry points and dev commands are current and runnable
- No architecture rationale (belongs in system-design)
