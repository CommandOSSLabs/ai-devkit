# Documentation Navigation

## Directory Structure

```
/docs
├── system-overview.md
├── codebase-summary.md
├── CLAUDE.md (AGENTS.md)
├── templates/
│   ├── adr.md
│   ├── feature-spec.md
│   └── ...
├── rules/
│   ├── CLAUDE.md (AGENTS.md)
│   ├── common/
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
- **`rules/` (Recommended)** — Coding rules, standards, conventions and practices: code style, git workflow, testing, development practices, etc
- **`system-overview.md` (Recommended)**  — High-level system architecture: tech stack, how services connect, infrastructure layout, external dependencies, etc.
- **`codebase-summary.md`** — **(Recommended)** Codebase structure and navigation: directories, modules, entry points. The "I just cloned the repo — where is everything?" doc.
- **`guides/` (Recommended)** — Operational and onboarding docs, team decides what's needed (e.g. onboarding.md, local-dev.md, deployment.md).
- **`CLAUDE.md`** and/or **`AGENTS.md`** - Give guidance to agents on how to navigate the `docs/` folder, find the right spots for the given tasks. Engineers can of course give more instructions to this

> **Note**: Engineers are free to add more files or folders to serve their own needs. The structure above is the baseline, not a restriction.
