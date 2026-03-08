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

Skills trigger automatically from natural language. Just describe what you need and the right skill activates.

### Docs — scaffold the `/docs` directory

```
Set up the docs structure for this project
```
```
Check if our docs structure is up to date with the latest devkit
```
```
We added a new service — update the docs scaffold to include it
```

### PRD — product requirements

```
We just discussed the billing system requirements — save that as a PRD
```
```
Use this Notion doc to draft a PRD for the new onboarding flow: [link]
```
```
Update the PRD — we're cutting the SSO requirement from v1
```

### System Design — architecture and tech stack

```
Draft a system design for our payments service
```
```
Update the system design — we switched from PostgreSQL to DynamoDB
```
```
We're adding a message queue between the API and worker — update the architecture
```

### Feature Spec — feature specifications

```
Create a feature spec for checkout retry logic
```
```
Use this Notion doc to draft a feature spec for tenant-level rate limiting: [link]
```
```
Update the retry spec — we changed the backoff strategy to exponential with jitter
```

### ADR — architecture decisions

```
We decided to use event sourcing over CRUD for the audit trail — record that as an ADR
```
```
Record an ADR: chose Redis over Memcached for session caching because of pub/sub support
```
```
Update ADR-0003 — we revisited the decision and switched from REST to gRPC
```

### Codebase Summary — repository navigation

```
Document the repository structure and key entry points
```
```
Update the codebase summary — we reorganized the src/ directory
```
```
Map the codebase so new contributors can get oriented quickly
```

### Slash Commands

You can also invoke skills directly with slash commands:

| Command | Action |
|---|---|
| `/cmk:docs` | Bootstrap or update docs structure |
| `/cmk:prd` | Create or iterate a PRD |
| `/cmk:system-design` | Create or iterate system design |
| `/cmk:feature-spec` | Create or iterate a feature spec |
| `/cmk:adr` | Create or iterate an ADR |
| `/cmk:codebase-summary` | Create or iterate codebase summary |

## Documentation Structure

Refer to [`docs/README.md`](./docs/README.md) for the full directory structure and conventions.
