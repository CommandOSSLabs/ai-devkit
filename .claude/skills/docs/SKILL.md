---
name: cmk:docs
description: Bootstrap or update the /docs directory structure with navigation files, guides, and templates. Use when someone wants to set up docs for a new repo, check if their docs structure is current, or sync scaffolding after devkit updates. Also triggers when users mention "docs structure", "initialize docs", or "docs scaffold".
metadata:
  sdl_phase: "0"
  domain: "docs"
---

# Docs

## Intents

```
Set up the docs structure for this project
```
```
Check if our docs structure matches the latest devkit
```
```
We added a new service — update the docs scaffold
```
```
Are we missing any docs directories?
```

## References

Read `references/scaffold-manifest.md` for the complete file manifest and exact content for each file.

## Modes

**Init** (default) — First-time scaffolding. Create missing directories, navigation files, and templates. Never overwrite existing files. Report divergences.

**Update** — Re-sync after devkit changes. Create newly added files, compare AGENTS.md/README.md against manifest and report divergences, add new templates without overwriting customized ones. Confirm with user before modifying existing files.

**Verify** — Dry-run. Report gaps and divergences without creating or modifying anything.

## Workflow

1. Determine mode from user intent.
2. Scan target repository for existing `/docs` structure.
3. Compare against `references/scaffold-manifest.md`.
4. Execute based on mode (init → create missing; update → create missing + offer fixes; verify → report only).
5. Create directories before contents, in order: `docs/`, `templates/`, `adrs/`, `specs/`, `rules/`, `rules/common/`, `knowledge/`, `guides/`, `reference/`.
6. For each directory, create `AGENTS.md` first, then `README.md`.
7. Report: created, skipped, diverged, updated.

## Output

- Every directory has both `AGENTS.md` and `README.md`
- Root `AGENTS.md` → `docs/AGENTS.md` → `docs/README.md` chain is intact
- Templates directory contains all baseline templates
- Init mode never modifies existing files
- Update mode confirms before modifying
- Verify mode makes no file changes
