# Development Documentation Guideline

## Context
At CommandOSS, our development culture is shaped by a few core principles:
- Engineers are expected to deeply understand the product — its goals, fundamentals, and constraints — and actively contribute to product evolution and ownership.
- AI agents are first-class collaborators in our development workflow and are used extensively across planning, implementation, and iteration.

To support this AI-powered development workflow, we introduce a documentation guideline that ensures technical knowledge is structured, accessible, and actionable. This guideline aims to:

- Establish the project repository as the single source of truth for progressive feature planning and technical solutions.
- Provide structured context that both engineers and AI agents can rely on to make better decisions.
- Minimize unnecessary resource usage (e.g., external MCP/HTTP/API calls) by keeping essential specifications directly within the repository.
- Promote best practices in documentation structure and clarity.

> **Note:** This is a guideline, not a rigid rulebook. The goal is not to create more files, but to create better structure — so both engineers and AI agents can work more effectively and with higher confidence. Engineers may use other tools (e.g., Notion, Google Docs, etc.) for drafting and collaboration. However, all finalized and development-critical documentation must be consolidated into the repository to maintain a single source of truth.

We call this **Development Guideline #3: Project Repository as the Source of Truth for Technical Specifications**.  
This repository provides the recommended documentation structure and templates that teams can adapt to their real projects.

## Documentation Structure
All documentation should be organized within the `/docs` directory, located at the project root.
```
/docs
├── development-rules.md
├── system-overview.md
├── codebase-summary.md
├── CLAUDE.md
├── AGENTS.md
├── templates/
│   ├── adr.md
│   ├── feature-spec.md
│   └── ...
├── adrs/
│   ├── 0001-initial-architecture-decision.md
│   └── ...
├── specs/
│   └── 0001-user-authentication/
│       ├── spec.md
│       └── ...
├── guides/
│   └── ...
└── ...
```
- **`adrs/` (Required)** — Architecture Decision Records. System-wide decisions that affect multiple features (e.g. framework choices, infrastructure, protocols). One file per decision, immutable once accepted.
- **`specs/` (Required)** — Feature specifications. One folder per feature. spec.md is required as the entry point — it describes the feature as a system: overview, design principles, data model, flows, boundaries. Additional docs are optional and team-defined — whatever helps (e.g. backend-design.md, smart-contract-design.md, api-reference.md, migration-plan.md).
- **`development-rules.md` (Recommended)** — Coding rules, standards and conventions: code style, git workflow, testing, development practices, etc
- **`system-overview.md` (Recommended)**  — High-level system architecture: tech stack, how services connect, infrastructure layout, external dependencies, etc.
- **`codebase-summary.md`** — **(Recommended)** Codebase structure and navigation: directories, modules, entry points. The "I just cloned the repo — where is everything?" doc.
- **`guides/` (Recommended)** — Operational and onboarding docs, team decides what's needed (e.g. onboarding.md, local-dev.md, deployment.md).
- **`CLAUDE.md`** and/or **`AGENTS.md`** - Give guidance to agents on how to navigate the `docs/` folder, find the right spots for the given tasks. Engineers can of course give more instructions to this

> **Note**: Engineers are free to add more files or folders to serve their own needs. The structure above is the baseline, not a restriction.
