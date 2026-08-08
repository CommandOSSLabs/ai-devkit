# AI DevKit

Documentation-first skills for AI-powered software development. Agents and humans work from the same knowledge, memory, and context — structured docs are the shared state.

## Install

Two paths: vendor the skills into your repo with sync-backed upgrades (recommended), or try the kit first with zero setup.

### Vendored with sync (recommended)

Tell your agent:

```
Vendor the ai-devkit skills into this repo and set up adapters for Claude Code
```

This runs `cmk:agent-vendors` to establish the canonical `.agents/skills/cmk-<name>/` home and generate the adapters your vendors need, then `cmk:sync` to record the upstream baseline in `.agents/skills.lock`. Upgrades later go through `cmk:sync`'s semantic three-way reconcile against that baseline — never a blind overwrite of local adaptations (more under Usage below).

Per-vendor guide, by discovery tier:

- **Claude Code** — adapter-mirror: a generated `.claude/skills/cmk-<name>/SKILL.md` per skill.
- **Grok Build** — adapter-mirror: the same generated-adapter treatment at `.grok/skills/cmk-<name>/SKILL.md`.
- **Codex** — direct-discovery: reads `.agents/skills/` directly, no adapter needed.
- **OpenCode** — direct-discovery: points its skill-paths config at `.agents/skills/` directly.
- **Cursor** — rule-mirror: a narrower `.cursor/rules/cmk-<name>.mdc` covering only the skills that function as standing rules.

### Plugin trial (zero setup)

Try the kit before vendoring anything into your repo.

#### Claude Code

```bash
claude plugin add CommandOSSLabs/ai-devkit
```

#### OpenCode

Tell OpenCode:

`Fetch and follow the instructions at https://raw.githubusercontent.com/CommandOSSLabs/ai-devkit/refs/heads/main/.opencode/INSTALL.md.`

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
| `cmk:delivery-review` | Multi-lens review — correctness, quality, spec/AC compliance, security, and more — with verified findings |
| `cmk:delivery-ship` | Finalize delivery: verified evidence, a review-ready PR, and tracker reconciliation |
| `cmk:delivery-handoff` | Generate a self-contained handoff prompt to continue tracked work in a different agent |
| `cmk:delivery-pipeline` | End-to-end autonomous delivery of one issue, or a dependency-aware cluster, across all five phases |

### Knowledge family

| Skill | Purpose |
|---|---|
| `cmk:sui-sdk` | gRPC-first guidance for talking to a Sui full node — JSON-RPC is deprecated |
| `cmk:sui-devstack` | Worktree-safe local Sui network setup for development and e2e tests |

## Usage

Skills trigger automatically from natural language — just describe what you need. You can also invoke directly with slash commands (e.g. `/cmk:requirements`).

Docs build on each other. Follow this order when starting a new project:

### Step 1. Scaffold — `cmk:docs`

Set up the `/docs` directory structure. Do this once, then use it to verify or update as the project grows.

```
Set up the docs structure for this project
```
```
Check if our docs structure is up to date with the latest devkit
```

### Step 2. Product Requirements — `cmk:requirements`

Define what to build and why. This is the upstream source of truth — everything downstream references it.

```
We just discussed the billing system requirements — save that as requirements
```
```
Use this Notion doc to draft requirements for the new onboarding flow: [link]
```
```
Update the requirements — we're cutting the SSO requirement from v1
```

### Step 3. Design — `cmk:design`

Design how to build it, system-wide or per-feature. Informed by the requirements — the skill checks for conflicts with upstream scope and success criteria.

```
Draft a system design for our payments service
```
```
Update the system design — we switched from PostgreSQL to DynamoDB
```
```
We're adding a message queue between the API and worker — update the architecture
```
```
Create a feature-level design for checkout retry logic
```
```
Use this Notion doc to draft a feature design for tenant-level rate limiting: [link]
```
```
Update the retry design — we changed the backoff strategy to exponential with jitter
```

### At any point: Architecture Decisions — `cmk:adr`

Record system-level decisions as they come up during any step. The skill checks for conflicts with the current design.

```
We decided to use event sourcing over CRUD for the audit trail — record that as an ADR
```
```
Record an ADR: chose Redis over Memcached for session caching because of pub/sub support
```
```
Update ADR-0003 — we revisited the decision and switched from REST to gRPC
```

### At any point: Capture Learnings — `cmk:learn`

Extract non-obvious knowledge from any source — conversations, debugging, research, files. Saves to `docs/knowledge/` for downstream use.

```
That was a long research session — extract the key learnings
```
```
Save that Redis connection pooling gotcha we just discovered
```
```
Review our accumulated learnings on infrastructure
```

### At any point: Engineering Rules — `cmk:rule`

Codify standards into `docs/rules/`. Create rules directly, or promote knowledge entries into enforceable standards.

```
Add a rule that all API endpoints must validate auth tokens before processing
```
```
Promote the Redis pooling learning to an infrastructure rule
```
```
Update the security rules — we now require CSP headers on all responses
```

### At any point: Codebase Docs for AI — `cmk:codebase-docs`

Build a hierarchical tree of short docs under `docs/ai/` so AI (or a human skimming) can quickly find the right source file for a topic. Update as the codebase evolves.

```
Set up AI docs for this repo
```
```
Update the AI docs — I added a new TUI input handler
```
```
Refresh docs/ai/ for the rcp module
```

### Upstream changes

When an upstream doc changes (e.g., requirements scope shifts), review downstream docs for consistency. Skills will warn when they detect conflicts with upstream — you decide how to resolve them.

### Repo setup — `cmk:repo-setup`

`cmk:repo-setup` orchestrates the setup facets (project layout, toolchain, agent instructions, MCP config, local stack, infra, CI/CD) through init, adopt, update, and verify passes; each facet is also independently invocable on its own.

```
Set up this repo
```
```
Make local dev worktree-safe
```
```
Structure our CI
```

### Vendoring & sync — `cmk:agent-vendors` + `cmk:sync`

`cmk:agent-vendors` establishes one canonical `.agents/skills/` home per repo
and generates the thinnest adapter each coding-agent vendor needs to discover
it. `cmk:sync` keeps that vendored copy current with upstream ai-devkit
through a lock-tracked, semantic three-way reconciliation — never a blind
overwrite of local adaptations.

```
Vendor the devkit skills into this repo
```
```
Sync our vendored skills with upstream
```

### Delivery — `cmk:delivery-pipeline`

Deliver tracker-tracked work end to end — context intake, spec and plan, implementation, review, and shipping — autonomously, or invoke any phase skill standalone.

```
Work on TICKET-123
```
```
Review this PR
```
```
Generate a handoff prompt so I can continue this in another agent
```

## Works With

### Claude Code

Install as a plugin. Skills are auto-discovered and available as slash commands. See [Install](#install) for setup.

### OpenCode

Install as a plugin via `opencode.json`. Skills are auto-registered via the config hook. See [`.opencode/INSTALL.md`](https://github.com/CommandOSSLabs/ai-devkit/blob/main/.opencode/INSTALL.md) for setup and troubleshooting.

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
