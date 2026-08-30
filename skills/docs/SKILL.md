---
name: cmk:docs
description: This skill should be used when the user asks to "set up docs", "initialize docs", "docs scaffold", "check if our docs structure is current", "update the docs structure", "check docs connectedness", or needs to bootstrap, update, or verify the /docs directory structure with navigation READMEs and document templates.
version: 0.3.0
---

# Docs

Bootstrap or update the `/docs` directory structure with navigation READMEs and document templates. Supports first-time scaffolding, re-syncing after devkit changes, and dry-run verification.

## Progressive disclosure

The docs tree is organized for progressive disclosure: every folder's README is a concise navigation index — one line per child saying what it is and when to read it — and depth lives one level down. A reader starts at `docs/README.md`, follows the index to the area that matters, and dives deeper only as needed; no doc assumes the reader loaded the whole tree. Keep each document small and self-contained enough to be referenced as a unit by other docs — composable pieces, not monoliths — and cross-reference related docs (requirements ↔ design ↔ decisions ↔ glossary) so the tree stays coherent rather than merely adjacent.

Coherence is bidirectional: updating a doc means checking its inbound references (who links here, who builds on this claim) and cascading or flagging them in the same change. The Verify mode's connectedness check is the mechanical floor for this — orphans and dangling links are coherence failures made visible.

## References

Read `references/scaffold-manifest.md` for the complete file manifest and exact content for each file.

## Modes

**Init** (default) — First-time scaffolding. Create missing directories, READMEs, and templates. Never overwrite existing files. Report divergences.

**Update** — Re-sync after devkit changes. Create newly added files, compare each `README.md` against the manifest and report divergences, add new templates without overwriting customized ones. Confirm with user before modifying existing files.

**Verify** — Dry-run. Report gaps and divergences without creating or modifying anything. Connectedness check: report canonical docs (in `decisions/`, `requirements/`, `design/`) with no inbound links from any other doc (orphans), and links pointing at missing files (dangling).

## Workflow

1. Determine mode from user intent.
2. Scan target repository for existing `/docs` structure.
3. Compare against `references/scaffold-manifest.md`.
4. Execute based on mode (init → create missing; update → create missing + offer fixes; verify → report only).
5. Create directories before contents, in order: `docs/`, `templates/`, `decisions/`, `requirements/`, `design/`, `rules/`, `rules/common/`, `guides/`, `runbooks/`, `reports/`, `research/`, `knowledge/`, `ai/`.
6. For each directory, create `README.md`.
7. Report: created, skipped, diverged, updated.

## Output

- Every directory has exactly one `README.md`
- `docs/README.md` → per-directory README chain is intact
- Each README is a concise navigation index over its children, not a content dump
- Templates directory contains all baseline templates
- Init mode never modifies existing files
- Update mode confirms before modifying
- Verify mode makes no file changes
