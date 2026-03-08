---
name: cmk:docs
description: Bootstrap or update the /docs directory structure with AGENTS.md navigation files, README.md guides, and templates. Use when initializing a new repository, verifying an existing docs structure, or syncing docs scaffolding after devkit updates.
metadata:
  sdl_phase: "0"
  domain: "docs"
---

# Docs Init

Use this skill for:
- Bootstrapping a new repository with the standard docs structure
- Verifying and filling gaps in an existing docs structure
- Updating navigation and template files after devkit changes

## Canonical References

- Directory structure and file manifest: `references/scaffold-manifest.md`
- Template files: sourced from `docs/templates/` in the devkit

## Modes

### Init (default)

First-time scaffolding. Creates missing directories, navigation files, and templates.

- Never overwrites existing files
- Reports divergences without modifying them

### Update

Re-sync an existing docs structure. Use when the devkit adds new templates, directories, or navigation patterns.

- Creates any newly added directories and files that don't exist yet
- For AGENTS.md and README.md files: compares against scaffold manifest and reports divergences
- For templates: adds new templates that don't exist; never overwrites customized templates
- Updates `docs/README.md` directory listing and template links when new entries are added
- Always confirms with the user before modifying any existing file

### Verify

Dry-run check. Reports gaps and divergences without creating or modifying anything.

## Workflow

1. Determine mode from user intent (init, update, or verify).
2. Scan the target repository for existing `/docs` structure.
3. Compare against the scaffold manifest in `references/scaffold-manifest.md`.
4. Execute based on mode:
   - **Init:** create missing directories and files, skip existing
   - **Update:** create missing, report divergences, offer to update existing with confirmation
   - **Verify:** report only, no file changes
5. Copy templates into `docs/templates/` when they do not already exist.
6. Report what was created, skipped, diverged, and (in update mode) updated.

## Directory Creation Order

Create directories before their contents:

1. `docs/`
2. `docs/templates/`
3. `docs/adrs/`
4. `docs/specs/`
5. `docs/rules/`
6. `docs/rules/common/`
7. `docs/guides/`
8. `docs/reference/`

## File Creation Order

For each directory, create files in this order:

1. `AGENTS.md` — agent navigation entry point
2. `README.md` — human-readable structure and conventions

Then create top-level docs:

1. `docs/README.md` — directory structure and conventions overview
2. Root `AGENTS.md` — project-level entry pointing to `/docs`

## Quality Checklist

- Every directory has both `AGENTS.md` and `README.md`
- Root `AGENTS.md` points to `docs/AGENTS.md`
- `docs/AGENTS.md` points to `docs/README.md`
- All subdirectory `AGENTS.md` files point to their local `README.md`
- `docs/README.md` lists all directories and templates
- Templates directory contains all baseline templates

## Output Contract

- Report created files, skipped files (already existed), divergences, and updates applied
- In init mode: never modify existing files
- In update mode: confirm with user before modifying any existing file
- In verify mode: no file changes, report only
