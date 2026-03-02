# SDL Phases

This guide defines the standard software development lifecycle (SDL) phases used in this repository.

## Phase 1: Requirements and Design

**Goal:** produce a feature specification that becomes the source of truth for implementation.

- Primary output: `docs/specs/{NNNN}-{feature-name}/spec.md`
- Scope: bridge product context and technical design, with stronger emphasis on technical specification
- Note: this is not a PRD, but including product context is encouraged when it helps implementation quality

## Phase 2: Planning

**Goal:** translate the feature spec into an execution plan.

- Primary output: implementation plan with milestones, sequencing, and dependencies
- Plan should map directly back to the approved feature spec

## Phase 3: Implementation

**Goal:** implement code according to the feature spec and plan.

- Primary output: code changes and supporting documentation updates
- Keep implementation aligned with the latest spec decisions

## Phase 4: Testing

**Goal:** verify behavior meets requirements and success criteria.

- Primary output: test evidence (automated tests, manual verification notes where needed)
- Validate both expected flows and critical failure paths

## Phase 5: Code Review

**Goal:** ensure quality, maintainability, and compliance with engineering standards.

- Primary output: reviewed and approved change set
- Review focus: simplification opportunities, security practices, formatting, naming conventions, and overall code quality

## Related Docs

- Feature specs: [`docs/specs/README.md`](../specs/README.md)
- Feature spec template: [`docs/templates/feature-spec.md`](../templates/feature-spec.md)
- Engineering rules: [`docs/rules/README.md`](../rules/README.md)
- Common baseline rules: [`docs/rules/common/README.md`](../rules/common/README.md)

## Phase 1 Skills

### Skills

- Feature spec workflow:
  - `.agents/skills/feature-spec-workflow/SKILL.md` (OpenCode-compatible)
  - `.claude/skills/feature-spec-workflow/SKILL.md` (Claude Code-compatible)
- ADR workflow:
  - `.agents/skills/adr-workflow/SKILL.md` (OpenCode-compatible)
  - `.claude/skills/adr-workflow/SKILL.md` (Claude Code-compatible)

### Keeping Skills in Sync

- Canonical source: `.agents/skills/*` (entire skill directory)
- Sync command: `bash scripts/sync-skills.sh`
- Drift check (CI-friendly): `bash scripts/sync-skills.sh check`
- Local auto-sync hook install: `bash scripts/install-git-hooks.sh`
- CI enforcement: `.github/workflows/skills-sync-check.yml`

### Input Source Examples for Spec Shaping

- Conversation-driven: "Use our discussion above to draft a feature spec for checkout retries"
- Local-doc-driven: "Use `docs/specs/0004-payments/spec.md` and create a new spec for refund reconciliation"
- External-link-driven: "Use this Notion/Google Doc link and shape the spec from it"
- Direct-prompt-driven: "Draft a spec for tenant-level rate limiting with fallback behavior"
