# Scaffold Manifest

Complete file manifest for bootstrapping a repository's `/docs` structure.
Each section defines a file path and its exact content.

---

## Root AGENTS.md

**Path:** `AGENTS.md`

```markdown
# Project Overview Entry

[`/docs`](./docs) is the source of truth for this repository.

It exists for two purposes:
- Store essential and critical documentation for this repository
- Organize living specs, decisions, and guides used during development

Start in [`docs/AGENTS.md`](./docs/AGENTS.md) for navigation and task routing.
```

---

## docs/AGENTS.md

**Path:** `docs/AGENTS.md`

```markdown
# Agent Entry

[`/docs`](.) contains shared documentation that both humans and agents rely on.

It exists for two purposes:
- Store essential and critical documentation for this repository
- Organize templates and living specs used during development

Start in [`README.md`](./README.md) in this folder for documentation structure and conventions.

## Orientation

Before starting work, read the docs that apply to your task:

- **Any task:** [`codebase-summary.md`](./codebase-summary.md) — understand repo structure and entry points
- **New feature or product change:** [`prd.md`](./prd.md) — current product requirements and scope
- **Architecture or technical work:** [`system-design.md`](./system-design.md) — system architecture and tech stack
- **Feature implementation:** [`specs/`](./specs/) — find the relevant feature spec
- **System-level decision:** [`adrs/`](./adrs/) — existing architecture decisions
- **Coding standards:** [`rules/`](./rules/) — engineering conventions and practices
```

---

## docs/README.md

**Path:** `docs/README.md`

```markdown
# Documentation

This directory is the source of truth for documentation in this repository.

## Directory Structure

/docs
├── README.md
├── AGENTS.md
├── prd.md
├── system-design.md
├── codebase-summary.md
├── templates/
│   ├── adr.md
│   ├── feature-spec.md
│   ├── prd.md
│   ├── system-design.md
│   ├── codebase-summary.md
│   └── ...
├── rules/
│   ├── AGENTS.md
│   ├── README.md
│   ├── common/
│   │   ├── AGENTS.md
│   │   ├── README.md
│   │   └── ...
│   └── ...
├── adrs/
│   ├── AGENTS.md
│   ├── README.md
│   └── ...
├── specs/
│   ├── AGENTS.md
│   ├── README.md
│   └── ...
├── guides/
│   ├── AGENTS.md
│   ├── README.md
│   └── ...
├── reference/
│   ├── AGENTS.md
│   ├── README.md
│   └── ...
└── ...

- **`adrs/` (Required)** — Architecture Decision Records. System-wide decisions that affect multiple features (e.g. framework choices, infrastructure, protocols). See [`docs/adrs/README.md`](./adrs/README.md) for structure and conventions.
- **`specs/` (Required)** — Feature specifications. One folder per feature. `spec.md` is required as the entry point. See [`docs/specs/README.md`](./specs/README.md) for structure and conventions.
- **`rules/` (Recommended)** — Coding rules, standards, conventions, and practices: code style, git workflow, testing, development practices, etc. See [`docs/rules/README.md`](./rules/README.md) for structure and conventions.
- **`prd.md` (Recommended)** — Product requirements: problem, success criteria, user needs, scope. Upstream of system design and feature specs.
- **`system-design.md` (Recommended)** — High-level system architecture: tech stack, service connections, infrastructure layout, external dependencies, etc.
- **`codebase-summary.md` (Recommended)** — Codebase structure and navigation: directories, modules, entry points.
- **`guides/` (Recommended)** — Operational and onboarding docs, team decides what's needed (e.g. onboarding.md, local-dev.md, deployment.md).
- **`reference/` (Recommended)** — Cross-cutting reference docs shared across phases and teams. See [`docs/reference/README.md`](./reference/README.md) for structure and conventions.
- **`AGENTS.md`** — Agent navigation instructions for this docs subtree.

## Recommended Templates

- PRD template: [`docs/templates/prd.md`](./templates/prd.md)
- System design template: [`docs/templates/system-design.md`](./templates/system-design.md)
- Codebase summary template: [`docs/templates/codebase-summary.md`](./templates/codebase-summary.md)
- Feature spec template: [`docs/templates/feature-spec.md`](./templates/feature-spec.md)
- ADR template: [`docs/templates/adr.md`](./templates/adr.md)

> **Note**: Engineers can add more files or folders as needed. This structure is a baseline, not a restriction.
```

---

## docs/specs/AGENTS.md

**Path:** `docs/specs/AGENTS.md`

```markdown
# Agent Entry

[`/docs/specs`](.) contains living feature specifications for this repository.

It exists for two purposes:
- Capture evolving feature context from research through implementation
- Keep decisions, scope, and flows current as work evolves

Start in [`README.md`](./README.md) in this folder for structure and naming conventions.
```

---

## docs/specs/README.md

**Path:** `docs/specs/README.md`

```markdown
# Feature Specifications

This directory contains one folder per feature specification.

## Canonical Placement

- Reusable Feature Spec template: `docs/templates/feature-spec.md`
- Feature spec entry: `docs/specs/{NNNN}-{feature-name}/spec.md`
- Example: `docs/specs/0001-user-authentication/spec.md`

## Folder Convention

- Use one folder per feature inside `docs/specs/`
- Example feature: `0001-user-authentication/`
- `spec.md` is required as the entry point in each feature folder
- Additional docs are optional (for example: `backend-design.md`, `api-reference.md`, `migration-plan.md`) and can be freely added by the team when needed

## How to Use

1. Copy [`docs/templates/feature-spec.md`](../templates/feature-spec.md) into a new feature folder under `docs/specs/{NNNN}-{feature-name}/`.
2. Rename and fill it as `spec.md`.
3. Keep `spec.md` updated as the latest source of truth.
```

---

## docs/adrs/AGENTS.md

**Path:** `docs/adrs/AGENTS.md`

```markdown
# Agent Entry

[`/docs/adrs`](.) contains architecture decisions that apply across features.

It exists for two purposes:
- Record system-level technical choices and trade-offs
- Preserve stable decision context for future implementation work

Start in [`README.md`](./README.md) in this folder for structure and naming conventions.
```

---

## docs/adrs/README.md

**Path:** `docs/adrs/README.md`

```markdown
# Architecture Decision Records

This directory contains system-wide architecture decisions for this repository.

## Canonical Placement

- ADR template: [`docs/templates/adr.md`](../templates/adr.md)
- ADR entry: `docs/adrs/{NNNN}-{decision-title}.md`
- Example: `docs/adrs/0001-initial-architecture-decision.md`

## File Convention

- Use one file per decision in `docs/adrs/`
- Example file: `0001-initial-architecture-decision.md`
- Update the ADR in place when the decision evolves

## How to Use

1. Copy [`docs/templates/adr.md`](../templates/adr.md) and create `docs/adrs/{NNNN}-{decision-title}.md`.
2. Fill context, choice, and rationale.
3. When a decision changes, update the existing ADR rather than creating a new one.
```

---

## docs/rules/AGENTS.md

**Path:** `docs/rules/AGENTS.md`

```markdown
# Agent Entry

[`/docs/rules`](.) contains coding standards and workflow conventions.

It exists for two purposes:
- Guide implementation decisions with consistent engineering practices
- Reduce ambiguity in style, quality, and development workflow

Start in [`README.md`](./README.md) in this folder for structure and navigation.
```

---

## docs/rules/README.md

**Path:** `docs/rules/README.md`

```markdown
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
```

---

## docs/rules/common/AGENTS.md

**Path:** `docs/rules/common/AGENTS.md`

```markdown
# Agent Entry

[`/docs/rules/common`](.) contains shared engineering rules that apply across languages and frameworks.

It exists for two purposes:
- Provide default implementation standards when task-specific rules are absent
- Keep style, quality, and workflow decisions consistent across the repository

Start in [`README.md`](./README.md) in this folder for structure and rule conventions.
```

---

## docs/rules/common/README.md

**Path:** `docs/rules/common/README.md`

```markdown
# Common Rules

This directory contains language-agnostic engineering rules.

## Canonical Placement

- Rule entry: `docs/rules/common/{rule-topic}.md`

## File Convention

- Keep one topic per file
- Use concise, actionable guidance
- Keep guidance broadly applicable across languages and frameworks

## How to Use

1. Start here before applying language-specific or framework-specific rules.
2. Follow these rules as defaults when no narrower rule overrides them.
3. Update rule files when team conventions change.
```

---

## docs/guides/AGENTS.md

**Path:** `docs/guides/AGENTS.md`

```markdown
# Agent Entry

[`/docs/guides`](.) contains operational and onboarding procedures.

It exists for two purposes:
- Provide step-by-step workflows for common engineering tasks
- Preserve practical runbooks for setup, deployment, and troubleshooting

Start in [`README.md`](./README.md) in this folder for structure and naming conventions.
```

---

## docs/guides/README.md

**Path:** `docs/guides/README.md`

```markdown
# Guides

This directory contains operational and onboarding guides.

## Canonical Placement

- Guide entry: `docs/guides/{guide-name}.md`
- Guide name format: `kebab-case` task or context name (for example: `local-dev.md`, `deployment.md`, `onboarding.md`, `troubleshooting.md`)
- Optional supporting assets: `docs/guides/{guide-name}/...`

## File Convention

- Use one file per guide topic when possible
- Use descriptive, task-oriented names (for example: `local-dev.md`, `deployment.md`)
- Keep steps runnable and verify commands before publishing

## How to Use

1. Start from the concrete goal (for example: run locally, deploy, troubleshoot).
2. Add prerequisites, exact steps, and expected outcomes.
3. Update guides when workflows, commands, or environments change.
```

---

## docs/reference/AGENTS.md

**Path:** `docs/reference/AGENTS.md`

```markdown
# Agent Entry

[`/docs/reference`](.) contains shared reference documents used across multiple phases and areas.

It exists for two purposes:
- Define stable cross-cutting concepts that guide execution
- Provide reusable context without duplicating folder-specific instructions

Start in [`README.md`](./README.md) in this folder for structure and naming conventions.
```

---

## docs/reference/README.md

**Path:** `docs/reference/README.md`

```markdown
# References

This directory contains cross-cutting reference documents used across phases and features.

## Canonical Placement

- Reference entry: `docs/reference/{reference-name}.md`
- Reference name format: `kebab-case` noun-based name (for example: `sdl-phases.md`)

## File Convention

- Keep one cross-cutting topic per file
- Keep definitions stable and link to executable docs (specs, rules, guides) instead of duplicating details

## How to Use

1. Use references for shared concepts that span multiple phases or folders.
2. Link to references from root `README.md` and relevant subfolder READMEs.
3. Update references when lifecycle or process definitions change.
```

---

## Templates

The following templates should be copied from the devkit's `docs/templates/` directory into the target repository's `docs/templates/`:

- `docs/templates/prd.md`
- `docs/templates/system-design.md`
- `docs/templates/codebase-summary.md`
- `docs/templates/feature-spec.md`
- `docs/templates/adr.md`
