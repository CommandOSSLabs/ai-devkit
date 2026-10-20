# AI DevKit

Evolvable agent skills for the full software development lifecycle — requirements, design, decisions, repo setup, and delivery. Vendored into your repo, they adapt to how your team works and still sync with upstream.

Documentation-first: agents and humans work from the same knowledge, memory, and context — structured docs are the shared state.

## Install

Three paths — vendored with sync (recommended, fully evolvable), skills.sh, or a zero-setup plugin trial. The install path decides whether your per-repo adaptations survive upgrades; [INSTALLATION.md](./INSTALLATION.md) covers every scenario and its consequences. Tell your agent:

```
Fetch and follow https://raw.githubusercontent.com/CommandOSSLabs/ai-devkit/refs/heads/main/INSTALLATION.md
```

## Quick Start

Skills trigger from natural language — describe what you need and the right one picks it up.

Once per repo, tell your agent **"Set up this repo"**. `cmk:repo-setup` scaffolds a new repo (layout, toolchain, docs, `CLAUDE.md`, CI, the vendored skills) or adopts an existing one, and through `cmk:repo-config` maps the workflow's states to your tracker's labels. A repo that already has the rest can run `cmk:repo-config` alone ("configure the tracker").

Then five commands run the whole ticket flow:

```
/cmk:idea Vessel owners get an SMS when an invoice goes overdue
/cmk:shape #28
/cmk:go
/cmk:board
/cmk:release
```

Or just ask:

```
Set up this repo
We decided to use event sourcing over CRUD for the audit trail — record that as an ADR
Walk me through how an invoice goes from booking to paid
Review the changes on this branch before I merge
```

Each request lands in the right skill, which asks only what it must and writes the result where it belongs. The rest of this README is depth — the skills work without reading it.

## How It Works

Every piece of work is a ticket in a **closed workflow**: one state at a time, each move owned by one command or by you. You own three gates — **approve** a spec or plan, **answer** a question, **merge** a PR. Agents do the rest.

```
          you approve              you answer             you merge
               ▼                        ▼                     ▼
Inbox ──► Shaping ──► Ready ──► Building ──► In review ──► Done ──► Shipped
          /cmk:shape            /cmk:go                           /cmk:release
```

- **Shaping** writes the spec triad for a feature — `docs/specs/<date>-<feature>/{requirements,design,tasks}.md` with stable requirement IDs — or the confirmed cause and a guarded fix for a bug.
- **Building** runs each task test-first through an implementer and a two-axis reviewer, then simplifies the branch.
- **Review and ship** check the diff against the repo's standards and against the spec ID by ID, tick the ticket's acceptance criteria with their proof, and open a ready PR.
- How much ceremony a change needs follows its scope band: a `trivial` change needs nothing, a `patch` needs a one-requirement mini-spec (which `/cmk:go` may write itself and list at the top of the PR), a `feature` needs its approved triad.

Docs stay the shared state: decisions in `docs/decisions/`, the glossary in `docs/requirements/glossary.md`, system design in `docs/design/`, rules in `docs/rules/`. The full lifecycle is [`docs/design/sdl-phases.md`](./docs/design/sdl-phases.md); the day-to-day guide is [`docs/guides/workflow.md`](./docs/guides/workflow.md).

## Motivation

AI agents lose context between sessions. Teams repeat requirements, re-explain decisions, and re-establish scope every time a new conversation starts. There is no shared memory between agents and humans.

This devkit solves that by using structured documentation as the shared state. The repository becomes the single source of truth — agents read it to get up to speed, humans and agents write to it to preserve decisions, and both act on the same base of knowledge.

> This is a guideline, not a rulebook. The goal is better structure, not more files. Teams can draft in Notion, Google Docs, or conversation — but finalized, development-critical context should live in the repository.

## Skills

91 skills: a core set every vendored repo gets, and opt-in packs. Per-family maps with every skill's package, references and scripts: [`docs/ai/skills/`](./docs/ai/skills/README.md).

| Family | Core skills |
|---|---|
| Workflow commands | `/cmk:idea`, `/cmk:shape`, `/cmk:go`, `/cmk:board`, `/cmk:release`, plus `cmk:triage` and `cmk:backlog` |
| Shaping and docs | `cmk:scope`, `cmk:interview`, `cmk:requirements`, `cmk:design`, `cmk:adr`, `cmk:glossary`, `cmk:catalog`, `cmk:traceability`, `cmk:realign`, `cmk:amend`, `cmk:spike`, `cmk:research`, `cmk:explain`, `cmk:docs`, `cmk:codebase-docs`, `cmk:learn`, `cmk:rule`, `cmk:visualize` |
| Delivery | `cmk:delivery-workflow`, `cmk:delivery-pipeline`, `cmk:delivery-intake`, `cmk:delivery-spec-plan`, `cmk:delivery-build`, `cmk:tdd`, `cmk:debug`, `cmk:evidence`, `cmk:delivery-simplify`, `cmk:delivery-review`, `cmk:delivery-ship`, `cmk:delivery-pr`, `cmk:verdict`, `cmk:delivery-status`, `cmk:delivery-reroute`, `cmk:delivery-handoff`, `cmk:discover-efforts`, `cmk:worktree`, `cmk:feature-graph`, `cmk:working-set`, `cmk:feedback` |
| Session | `cmk:interpret`, `cmk:prose`, `cmk:source-trust` |
| Setup and infra | `cmk:repo-setup`, `cmk:repo-config`, `cmk:project-layout`, `cmk:toolchain`, `cmk:agent-instructions`, `cmk:mcp-config`, `cmk:local-stack`, `cmk:infra`, `cmk:cicd`, `cmk:enclave`, `cmk:agent-vendors`, `cmk:sync` |
| Testing and stacks | `cmk:test-resources`, `cmk:testcontainers`, `cmk:rust`, `cmk:sui-sdk`, `cmk:sui-devstack` |

| Pack | Skills |
|---|---|
| roadmap | `cmk:roadmap`, `cmk:roadmap-status`, `cmk:milestone-review`, `cmk:progress-chart` |
| acceptance | `cmk:acceptance`, `cmk:acceptance-api`, `cmk:acceptance-ui`, `cmk:dogfood-plan`, `cmk:dogfood-run` |
| ui | `cmk:ui-brief`, `cmk:ux-brief`, `cmk:ui-review` |
| ops | `cmk:incident`, `cmk:observability`, `cmk:delivery-remote` |
| quality | `cmk:debt`, `cmk:architecture-scan`, `cmk:pivot`, `cmk:shipped-audit` |
| project | `cmk:vision`, `cmk:system-docs` |
| maintainers | `cmk:skill-authoring`, `cmk:retro` |
| extras | `cmk:prompt`, `cmk:goal` |

`cmk:agent-vendors` vendors core plus the packs you name; `cmk:sync` keeps them current with upstream.

## Usage

```
Set up this repo                                   → cmk:repo-setup (init or adopt)
/cmk:idea <the idea>                               → a ticket in Shaping, framed and tiered
/cmk:shape #N                                      → requirements → design → plan, stopping for your approval
/cmk:go                                            → every Ready ticket built, reviewed, opened as a PR
/cmk:board                                         → what waits on you, what agents are doing
/cmk:release                                       → the version, tag and notes; its tickets read shipped
Something is broken and I don't know why           → cmk:debug
Prove it works before you call it done             → cmk:evidence
Record that we chose X over Y                      → cmk:adr
We keep saying relay and router for the same thing → cmk:glossary
Hand this off to another agent                     → cmk:delivery-handoff
Vendor the devkit skills into this repo            → cmk:agent-vendors
Sync our vendored skills with upstream             → cmk:sync
```

Throughout, skills warn when a change conflicts with an upstream doc — a requirement, a recorded decision, a glossary term — and you decide how to resolve it.

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
