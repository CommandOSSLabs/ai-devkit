---
name: cmk:codebase-summary
description: Create or iterate codebase summary documents that map repository structure, key entry points, core modules, and local dev setup. Use whenever someone wants to document how the repo is organized, update the codebase map after restructuring, or help new contributors navigate the codebase. Also triggers for "map the repo", "document the project structure", or "where does everything live".
metadata:
  sdl_phase: "1"
  domain: "codebase-summary"
---

# Codebase Summary

## Intents

```
Document the repository structure and key entry points
```
```
Update the codebase summary — we reorganized the src/ directory
```
```
Map the codebase so new contributors can get oriented quickly
```
```
Where does everything live in this project?
```

## References

Read `references/codebase-summary-conventions.md` for placement rules and `references/codebase-summary-template.md` for section structure.

## Scope

Codebase summary captures repository structure and navigation — how to find things. Architecture rationale belongs in system-design; feature behavior in specs.

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
