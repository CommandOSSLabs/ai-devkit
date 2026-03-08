# AI DevKit

Documentation-first skills for AI-powered software development. Agents and humans work from the same knowledge, memory, and context — structured docs are the shared state.

## Install

Install all skills:

```bash
npx skills add CommandOSSLabs/ai-devkit
```

Install specific skills:

```bash
npx skills add CommandOSSLabs/ai-devkit --skill docs
npx skills add CommandOSSLabs/ai-devkit --skill prd
npx skills add CommandOSSLabs/ai-devkit --skill system-design
npx skills add CommandOSSLabs/ai-devkit --skill feature-spec
npx skills add CommandOSSLabs/ai-devkit --skill adr
npx skills add CommandOSSLabs/ai-devkit --skill codebase-summary
```

Contributing to this repo — install git hooks for auto-sync:

```bash
bash scripts/install-git-hooks.sh
```

## Motivation

AI agents lose context between sessions. Teams repeat requirements, re-explain decisions, and re-establish scope every time a new conversation starts. There is no shared memory between agents and humans.

This devkit solves that by using structured documentation as the shared state. The repository becomes the single source of truth — agents read it to get up to speed, humans and agents write to it to preserve decisions, and both act on the same base of knowledge.

> This is a guideline, not a rulebook. The goal is better structure, not more files. Teams can draft in Notion, Google Docs, or conversation — but finalized, development-critical context should live in the repository.

## Skills

| Skill | Purpose |
|---|---|
| `cmk:docs` | Bootstrap or update the `/docs` directory structure |
| `cmk:prd` | Create or iterate product requirements |
| `cmk:system-design` | Create or iterate system architecture |
| `cmk:feature-spec` | Create or iterate feature specifications |
| `cmk:adr` | Create or update architecture decisions |
| `cmk:codebase-summary` | Create or iterate codebase navigation docs |

## Usage

Skills trigger automatically from natural language — just describe what you need. You can also invoke directly with slash commands (e.g. `/cmk:prd`).

Docs build on each other. Follow this order when starting a new project:

### Step 1. Scaffold — `cmk:docs`

Set up the `/docs` directory structure. Do this once, then use it to verify or update as the project grows.

```
Set up the docs structure for this project
```
```
Check if our docs structure is up to date with the latest devkit
```

### Step 2. Product Requirements — `cmk:prd`

Define what to build and why. This is the upstream source of truth — everything downstream references it.

```
We just discussed the billing system requirements — save that as a PRD
```
```
Use this Notion doc to draft a PRD for the new onboarding flow: [link]
```
```
Update the PRD — we're cutting the SSO requirement from v1
```

### Step 3. System Design — `cmk:system-design`

Design how to build it. Informed by the PRD — the skill checks for conflicts with upstream scope and success criteria.

```
Draft a system design for our payments service
```
```
Update the system design — we switched from PostgreSQL to DynamoDB
```
```
We're adding a message queue between the API and worker — update the architecture
```

### Step 4. Feature Specs — `cmk:feature-spec`

Break the system design into implementable features. Informed by both the PRD and system design — the skill checks for upstream conflicts.

```
Create a feature spec for checkout retry logic
```
```
Use this Notion doc to draft a feature spec for tenant-level rate limiting: [link]
```
```
Update the retry spec — we changed the backoff strategy to exponential with jitter
```

### At any point: Architecture Decisions — `cmk:adr`

Record system-level decisions as they come up during any step. The skill checks for conflicts with the current system design.

```
We decided to use event sourcing over CRUD for the audit trail — record that as an ADR
```
```
Record an ADR: chose Redis over Memcached for session caching because of pub/sub support
```
```
Update ADR-0003 — we revisited the decision and switched from REST to gRPC
```

### At any point: Codebase Summary — `cmk:codebase-summary`

Map the repository for navigation. Update as the codebase evolves.

```
Document the repository structure and key entry points
```
```
Update the codebase summary — we reorganized the src/ directory
```
```
Map the codebase so new contributors can get oriented quickly
```

### Upstream changes

When an upstream doc changes (e.g., PRD scope shifts), review downstream docs for consistency. Skills will warn when they detect conflicts with upstream — you decide how to resolve them.

## Works With

### Claude Code

Skills install as slash commands under `.claude/skills/`. Use natural language or invoke directly:

```
/cmk:prd
```
```
We just discussed auth requirements — save that as a PRD
```

### OpenCode / ohmyopencode

Skills install under `.agents/skills/` — the standard OpenCode convention. Natural language triggers work the same way:

```
Draft a system design for the API gateway
```

### Specialized Agents

The `/docs` directory is the shared protocol. Any agent — research, architecture, planning, QA — can participate by reading from and writing to the same structure:

```
┌─────────────┐     ┌──────────┐     ┌──────────────┐
│ Research    │     │ PRD      │     │ Architecture │
│ Agent       │────▶│ Agent    │────▶│ Agent        │
│             │     │ (cmk:prd)│     │ (cmk:system- │
│ writes to   │     │ reads    │     │  design)     │
│ docs/       │     │ docs/    │     │ reads docs/  │
└─────────────┘     └──────────┘     └──────────────┘
```

- A research agent saves findings to `docs/` — then `cmk:prd` reads them to draft requirements
- A planning agent reads the feature spec — then breaks it into tasks
- A QA agent reads the spec — then generates test cases from acceptance criteria

The docs are the interface between agents. Each agent reads what it needs, writes what it produces, and the next agent picks up where the last one left off.

## Documentation Structure

Refer to [`docs/README.md`](./docs/README.md) for the full directory structure and conventions.
