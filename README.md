# AI DevKit

Evolvable agent skills for the full software development lifecycle — requirements, design, decisions, repo setup, and delivery. Vendored into your repo, they adapt to how your team works and still sync with upstream.

Documentation-first: agents and humans work from the same knowledge, memory, and context — structured docs are the shared state.

## Install

Three paths — vendored with sync (recommended, fully evolvable), skills.sh, or a zero-setup plugin trial. The install path decides whether your per-repo adaptations survive upgrades; [INSTALLATION.md](./INSTALLATION.md) covers every scenario and its consequences. Tell your agent:

```
Fetch and follow https://raw.githubusercontent.com/CommandOSSLabs/ai-devkit/refs/heads/main/INSTALLATION.md
```

## Quick Start

Skills trigger from natural language — describe what you need and the right one picks it up (slash commands like `/cmk:requirements` work too). Straight after installing, try any of these:

```
Set up this repo
```
```
We just discussed the billing system requirements — save that as requirements
```
```
We decided to use event sourcing over CRUD for the audit trail — record that as an ADR
```
```
Work on TICKET-123
```

Each request lands in the right skill, which asks only what it must and writes the result where it belongs under `/docs`. The rest of this README is depth — the skills work without reading it.

## How It Works

One mental model runs through every skill: **the SDLC is a flow of documents that build on each other**, and the repository's `/docs` tree is where that flow lives.

```
Requirements ──▶ Design ──▶ Plan ──▶ Implement ──▶ Simplify ──▶ Review ──▶ Ship
 what & why      how, as an          └────────── delivery family ──────────┘
                 implementation-
                 agnostic spec

  cross-cutting at every stage:
  Decisions (cmk:adr) · Glossary (cmk:glossary) · Learnings (cmk:learn) · Rules (cmk:rule)
```

Three principles keep the flow coherent:

- **Guidance over forms.** The requirements and design skills follow shaping directives, not fixed templates — they interview when the input is still an idea and distill documents specific to your product rather than generic ones.
- **Coherence cascades.** Docs cross-reference each other, so changing one means checking what it links to and what links back. Skills detect conflicts — a design contradicting a locked decision, a term drifting from the glossary — and flag them for you to resolve instead of silently overriding.
- **Progressive disclosure.** Every docs folder README is a concise navigation index; depth lives one level down. Agents and humans read only what the task at hand needs.

The full phase definitions live in [`docs/design/sdl-phases.md`](./docs/design/sdl-phases.md).

## Motivation

AI agents lose context between sessions. Teams repeat requirements, re-explain decisions, and re-establish scope every time a new conversation starts. There is no shared memory between agents and humans.

This devkit solves that by using structured documentation as the shared state. The repository becomes the single source of truth — agents read it to get up to speed, humans and agents write to it to preserve decisions, and both act on the same base of knowledge.

> This is a guideline, not a rulebook. The goal is better structure, not more files. Teams can draft in Notion, Google Docs, or conversation — but finalized, development-critical context should live in the repository.

## Skills

| Skill | Purpose |
|---|---|
| `cmk:docs` | Bootstrap or update the `/docs` directory structure |
| `cmk:requirements` | Create or iterate product/feature requirements in docs/requirements/ |
| `cmk:design` | Create or iterate distilled design in docs/design/ — system-wide or per-feature |
| `cmk:adr` | Create or update decisions in docs/decisions/ |
| `cmk:glossary` | Create or maintain the shared normative glossary of systems, components, and actors |
| `cmk:codebase-docs` | Generate or update hierarchical, AI-navigable docs under `docs/ai/` |
| `cmk:learn` | Extract and record non-obvious learnings and gotchas |
| `cmk:rule` | Codify engineering standards into `docs/rules/` |
| `cmk:project-layout` | Establish or audit a role-first monorepo layout and package placement |
| `cmk:toolchain` | Assign tool roles, pin runtime versions, and set a gitignore baseline |
| `cmk:agent-instructions` | Maintain a thin, multi-vendor root instruction file backed by `docs/rules/` |
| `cmk:mcp-config` | Set up checked-in, per-vendor MCP server configuration |
| `cmk:local-stack` | Create or iterate worktree-isolated local development stacks |
| `cmk:infra` | Establish or audit infrastructure-as-code packages and environment boundaries |
| `cmk:cicd` | Structure CI, deployment, and policy automation around GitHub Actions |
| `cmk:test-resources` | Share an expensive test resource (container, database, external service) safely across a parallel test runner |
| `cmk:rust` | Idiomatic Rust practices — error handling, module boundaries, feature flags, lint/test wiring, dependency hygiene — inside a design-decided crate |
| `cmk:testcontainers` | Start and share a throwaway service container from Rust test code via the `testcontainers` crate |
| `cmk:agent-vendors` | Vendor the kit's skills into one canonical home with per-vendor adapters |
| `cmk:sync` | Reconcile vendored skills with upstream without flattening local evolution |
| `cmk:repo-setup` | Orchestrate every setup facet into one bootstrap, adopt, update, or verify pass |

### Delivery family

| Skill | Purpose |
|---|---|
| `cmk:delivery-workflow` | The tracker-neutral contract every delivery skill operates inside — reconciliation loop, readiness vocabulary, acceptance criteria |
| `cmk:discover-efforts` | Reconcile an uncertain body of work into a complete tracker issue set before delivery begins |
| `cmk:delivery-intake` | Pull full context for a tracker issue, set up its branch/worktree, and move it to in-progress |
| `cmk:delivery-spec-plan` | Produce a low-level design spec and an executable, dependency-aware implementation plan |
| `cmk:delivery-simplify` | Behavior-preserving quality cleanup (reuse, simplification, efficiency, altitude) — phase 3b after implement |
| `cmk:delivery-review` | Multi-lens review — correctness, quality, spec/AC compliance, security, and more — with verified findings |
| `cmk:delivery-ship` | Finalize delivery: verified evidence, a review-ready PR, and tracker reconciliation |
| `cmk:delivery-handoff` | Generate a self-contained handoff prompt to continue tracked work in a different agent |
| `cmk:delivery-pipeline` | End-to-end autonomous delivery of one issue, or a dependency-aware cluster, across phases 1–5 (incl. 3b) |

### Knowledge family

| Skill | Purpose |
|---|---|
| `cmk:sui-sdk` | gRPC-first guidance for talking to a Sui full node — JSON-RPC is deprecated |
| `cmk:sui-devstack` | Worktree-safe local Sui network setup for development and e2e tests |

## Usage

A deeper tour, in the order docs build on each other when starting a new project. Every line in the blocks below is a real trigger — paste and go.

### 1. Scaffold — `cmk:docs`

Set up the `/docs` structure once; re-run it to verify or update as the project grows.

```
Set up the docs structure for this project
Check if our docs structure is up to date with the latest devkit
```

### 2. Requirements — `cmk:requirements`

Define what to build and why — the upstream source of truth everything downstream references. Works from conversation, Notion/Google Docs links, or an interview when all you have is an idea.

```
We just discussed the billing system requirements — save that as requirements
Use this Notion doc to draft requirements for the new onboarding flow: [link]
Update the requirements — we're cutting the SSO requirement from v1
```

### 3. Design — `cmk:design`

Design how to build it as an implementation-agnostic spec — system-wide or per-feature. Checks upstream requirements and decisions for conflicts; cascades accepted changes downstream.

```
Draft a system design for our payments service
Create a feature-level design for checkout retry logic
Update the system design — we switched from PostgreSQL to DynamoDB
```

### Any stage: Decisions — `cmk:adr`

Record system-level decisions as numbered ADRs as they come up. A decision that changes direction gets a new record that supersedes the old one — history stays readable.

```
We decided to use event sourcing over CRUD for the audit trail — record that as an ADR
Update ADR-0003 — we revisited the decision and switched from REST to gRPC
```

### Any stage: Glossary — `cmk:glossary`

Lock the shared vocabulary — one term, one meaning, used identically in docs, code, and tickets. Fires on its own whenever a term is coined, contested, or drifting.

```
Create a glossary from our existing requirements and design docs
We keep saying relay and router for the same thing — lock one term in the glossary
```

### Any stage: Learnings & rules — `cmk:learn` + `cmk:rule`

Capture non-obvious knowledge into `docs/knowledge/`, then promote what should be enforced into `docs/rules/`.

```
Save that Redis connection pooling gotcha we just discovered
Promote the Redis pooling learning to an infrastructure rule
Add a rule that all API endpoints must validate auth tokens before processing
```

### Any stage: Codebase docs for AI — `cmk:codebase-docs`

Maintain a hierarchical tree of short navigation docs under `docs/ai/` so an agent (or a human skimming) finds the right source file fast.

```
Set up AI docs for this repo
Update the AI docs — I added a new TUI input handler
```

### Repo setup — `cmk:repo-setup` and its facets

Orchestrates project layout, toolchain, agent instructions, MCP config, local stack, infra, and CI/CD through init, adopt, update, and verify passes; each facet also runs standalone.

```
Set up this repo
Make local dev worktree-safe
Structure our CI
```

### Vendoring & sync — `cmk:agent-vendors` + `cmk:sync`

One canonical `.agents/skills/` home with the thinnest adapter each coding-agent vendor needs, kept current with upstream through lock-tracked semantic reconciliation — never a blind overwrite of local adaptations.

```
Vendor the devkit skills into this repo
Sync our vendored skills with upstream
```

### Delivery — `cmk:delivery-pipeline` and its phases

Deliver tracker-tracked work end to end — intake, spec and plan, implementation, review, ship — autonomously, or invoke any phase skill standalone.

```
Work on TICKET-123
Review this PR
Generate a handoff prompt so I can continue this in another agent
```

Throughout, skills warn when a change conflicts with an upstream doc — requirements scope, a recorded decision, a glossary term — and you decide how to resolve it; accepted changes cascade downstream.

## Works With

### Claude Code

Install via any path — vendored adapters, skills.sh, or the plugin. Skills are auto-discovered and available as slash commands. See [INSTALLATION.md](./INSTALLATION.md) for setup.

### OpenCode

Direct-discovery vendor: install via skills.sh, or vendor the skills and point OpenCode's skill-paths config at `.agents/skills/`. See [INSTALLATION.md](./INSTALLATION.md) for setup.

### Specialized Agents

The `/docs` directory is the shared protocol. Any agent — research, architecture, planning, QA — can participate by reading from and writing to the same structure:

```
┌──────────┐     ┌────────────────────┐     ┌──────────────┐
│ Research │────▶│ Requirements       │────▶│ Design       │
│ Agent    │     │ (cmk:requirements) │     │ (cmk:design) │
└──────────┘     └────────────────────┘     └──────────────┘
                                                   │
                                                   ▼
                                            ┌──────────────┐
                                            │ Knowledge    │
                                            │ (cmk:learn)  │
                                            │      │       │
                                            │      ▼       │
                                            │ Rules        │
                                            │ (cmk:rule)   │
                                            └──────────────┘
```

- A research agent saves findings → `cmk:requirements` reads them to draft requirements
- A planning agent reads the design → breaks it into tasks
- A QA agent reads the design → generates test cases from acceptance criteria
- A debugging session surfaces gotchas → `cmk:learn` captures them → `cmk:rule` promotes to standards

The docs are the interface between agents. Each agent reads what it needs, writes what it produces, and the next agent picks up where the last one left off.

## Documentation Structure

Refer to [`docs/README.md`](./docs/README.md) for the full directory structure and conventions.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how skill changes are proposed, reviewed, and upstreamed from a repo that vendored them.

## License

[MIT](./LICENSE) © 2026 CommandOSS Labs
