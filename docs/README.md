# Documentation

This directory is the source of truth for documentation in this repository.

## Directory Structure

```
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
│   │   ├── coding-style.md
│   │   ├── security.md
│   │   ├── git-workflow.md
│   │   ├── patterns.md
│   │   ├── testing.md
│   │   └── ...
│   ├── typescript/
│   │   └── ...
│   ├── rust/
│   │   └── ...
│   └── {framework}/
│       └── ...
├── adrs/
│   ├── AGENTS.md
│   ├── README.md
│   ├── 0001-initial-architecture-decision.md
│   └── ...
├── specs/
│   ├── AGENTS.md
│   ├── README.md
│   ├── 0001-user-authentication/
│   │   ├── spec.md
│   │   └── ...
│   └── ...
├── guides/
│   ├── AGENTS.md
│   ├── README.md
│   └── ...
├── reference/
│   ├── AGENTS.md
│   ├── README.md
│   ├── sdl-phases.md
│   └── ...
└── ...
```

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
