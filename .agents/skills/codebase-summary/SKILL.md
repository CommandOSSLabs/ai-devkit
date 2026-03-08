---
name: cmk:codebase-summary
description: Create or iterate codebase summary documents. Use whenever users ask to document, update, or map the repository structure, key entry points, core modules, and local development setup.
metadata:
  sdl_phase: "1"
  domain: "codebase-summary"
---

# Codebase Summary

Use this skill for:
- Creating a new codebase summary for a repository
- Updating the summary when the codebase structure changes

## Canonical References

- Codebase summary conventions: `references/codebase-summary-conventions.md`
- Codebase summary template: `references/codebase-summary-template.md`

## Supported Input Sources

Collect and synthesize from one or more of:
- Direct codebase exploration (directory structure, entry points, module boundaries)
- Existing documentation (README, system-design, package.json, Cargo.toml, etc.)
- Current conversation context
- Direct prompt from the engineer

## Content Guidance

Write what matters, skip what's obvious. The template is a starting point — adapt it to fit the context.

## Scope Rule

Codebase summary captures repository structure and navigation — how to find things and understand what lives where. Keep architecture rationale in system-design and feature behavior in specs.

## Workflow: Create

Use when no codebase summary exists.

1. Explore the repository structure to understand layout, entry points, and module boundaries.
2. Map findings into template sections in `references/codebase-summary-template.md`.
   - If the target repository already has an existing convention, align to that local standard.
3. Apply canonical placement:
   - Use the repository's existing path when available.
   - Fallback path when no local convention exists: `docs/codebase-summary.md`
4. Include local development commands if discoverable from the codebase.

## Workflow: Iterate

Use when the codebase has changed and the summary needs to reflect the current state.

1. Read the existing codebase summary in full before making changes.
2. Explore the current codebase structure to identify what changed.
3. Apply changes to the relevant sections:
   - **Update Repository Layout** — reflect new/moved/removed directories
   - **Update Key Entry Points** — add new entry points, remove stale ones
   - **Update Core Modules** — add new modules, revise responsibilities, remove deprecated ones
   - **Update Data and Integration Paths** — reflect new flows or changed integrations
   - **Update Local Development Commands** — reflect changed setup, test, or build commands
4. Preserve content that is still valid — do not rewrite sections that haven't changed.
5. Update `Last updated` date.

## Quality Checklist

- Repository layout matches the actual directory structure
- Entry points are accurate and current
- Core modules table covers the important parts without listing every file
- Local development commands are runnable
- No architecture rationale (that belongs in system-design)

## Output Contract

- If creating: produce a complete codebase summary at `docs/codebase-summary.md`
- If iterating: apply targeted updates to affected sections while preserving valid existing content
- Always update `Last updated` date when iterating
