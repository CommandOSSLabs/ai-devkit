---
name: cmk:local-stack
description: This skill should be used when the user asks to "set up local dev", "make dev worktree-safe", "add a local stack", "port conflicts between worktrees", "headless dev mode", "run services locally for agents/CI", "clean up dangling services", or hits orphaned containers/processes, "port already in use" from leftover runs, stale state from a deleted worktree, or needs worktree-isolated local development stacks with deterministic identity, coherence validation, and interactive/headless runners.
version: 0.4.0
---

# Local Stack

Set up or improve a worktree-isolated local stack: a system where multiple git
worktrees of the same repo run local service topologies simultaneously, on the
same machine, without port collisions, stale config, or cross-worktree
contamination. Serves three audiences: human developers, AI agents running
headless, and CI.

## Modes

**Init** (default) — derive the worktree identity, install the coherence
guard, and stand up the first stack config with both runner modes.

**Update** — add a stack, config, instance, or runner mode as needs
grow; never touch another worktree's or instance's state.

**Verify** — report-only audit against the checks under `## Verify`;
never mutates.

## Model

Two independent axes compose to make this work.

### Axis 1 — between worktrees: identity and coherence

Every worktree derives a deterministic **identity** from its own state: a
normalized branch label, a normalized worktree label (the primary checkout
gets a fixed label; others derive from directory name), and a short hash of
the absolute repo path. That identity feeds everything else — the compose
project name, the base of every port range, env-file naming, and the root of
all state directories — so two worktrees on the same machine never land on
the same values.

A **coherence guard** runs before anything starts: it recomputes the identity
fresh, compares it against what was last written to disk, and checks that
every env file's recorded ports and paths match the freshly computed ones. On
any mismatch it fails loudly and says exactly what's wrong and how to fix it
(normally: re-run init) — it never silently "fixes" a stale file itself. Read
`references/identity-and-coherence.md` for the derivation recipe, what it
feeds, the guard's checks, and the init-script shape.

### Axis 2 — within a worktree: the (worktree, config, instance) primitive

A single worktree may run several stacks, and any one stack may run several
parallel materializations. A **config** is owned by whichever package needs a
stack (an e2e test group, a benchmark harness, day-to-day dev) and declares its
topology. An **instance** is one running materialization of that config, with
an explicit state/home root at `.local/<stack>/<config>/<instance>/` and ports
assigned by a broker rather than hand-carved arithmetic. Consumers join a
shared instance by default; an invoking coordination layer — never the config
or the instance mechanism itself — decides when to select distinct instances
instead (parallel e2e shards, a disposable test instance beside a persistent
dev one, comparing two topologies). Read `references/instance-primitive.md`
for ownership, layout, broker responsibilities, and lifecycle.

## Peers, not a singleton

A repo may own several purpose-specific local stacks side by side — different
topologies for different jobs (a lightweight dev stack, a heavier e2e stack, a
production-mirroring benchmark stack). Each is its own package: it owns its
config, its runner entry point, and its tests. There is no single blessed "the
local stack" every job must fit.

## Service classes and runners

Every stack manages some mix of: compose-managed infra (database, cache,
object store), application processes, and heavyweight components (e.g. a
local chain node or similar out-of-process runtime). Two runner modes cover
both audiences:

- **Interactive** (mprocs-style): one command brings up infra and apps
  together in a single terminal, live-reloading, for a human. Heavy or
  rarely-needed processes are opt-in, not on by default.
- **Headless persistent** (`stack start|status|logs [service]|stop`):
  idempotent, no-TTY, for agents and CI. Logs and PIDs live under `.local/`.

Read `references/runners.md` for the contract each mode must satisfy, log
hygiene, and when to reach for which.

## `.local/` convention

The single git-ignored per-worktree root for all ephemeral state and scratch,
shared by humans and every agent vendor:

```
.local/
├── tmp/        # scratch (instead of /tmp or ad-hoc tmp/)
├── logs/       # service + stack logs
├── pids/
├── <stack>/    # per-stack state and instances
└── env files   # worktree-derived env, ports
```

## Global-state prohibition

No home-directory state (`~/.<tool>` singletons), no global processes, no
fixed ports. Never source another worktree's env files. Never wipe a stack
other than the one explicitly selected instance — no global prune, no deleting
`.local/<stack>` wholesale.

## Lifecycle discipline

Whoever starts a stack owns stopping it. An agent or CI job that brings up
services for its own task stops them when the task ends — a dangling stack
silently starves the next run's ports, memory, and CPU. Only a deliberately
persistent instance — a long-lived stack other sessions are meant to join —
outlives its starter, and it is stopped through its own explicit lifecycle:
never left up by accident, and never blanket-killed by another session's
cleanup.

Cooperative `stop` only reaches what the runner's own records still account
for. Crashed runs leave real dangling state — containers with no PID file,
processes that outlived their records, instances of a since-deleted worktree
— and reclaiming that safely requires ownership stamped on the resource
itself:

- **Stamp identity at creation.** Everything a stack starts carries the
  worktree identity it belongs to: the compose project name and a label on
  each container, the identity exported into every child process's
  environment, every state root under `.local/`. A resource that cannot name
  its owner cannot be reclaimed safely.
- **Never attribute by process ancestry.** One agent session runs across
  many worktrees, so parent/child PID relationships are not ownership —
  killing a session's process tree sweeps services belonging to other
  worktrees. Attribute by the stamped identity: labels, environment markers,
  recorded port ownership.
- **Reclaim in two scopes only.** A reclaim pass (`references/runners.md`)
  inventories stamped resources, diffs them against what the records still
  account for, and removes strays attributed to the current worktree — or to
  an identity whose worktree directory no longer exists. Anything it cannot
  attribute it reports and leaves alone. There is no global prune.

## Test-infrastructure composition

Test groups join a shared instance by default. Select distinct instances to
isolate parallel shards or to avoid one group's teardown affecting another's
fixtures. Declare Docker-backed tests as such so CI can gate on the daemon
being present.

## Where this stops

Remote environments and IaC are `cmk:infra`'s facet, not this one. A local
stack may mirror production topology (e.g. a local object store standing in
for the cloud one) but must stay worktree-safe here regardless of what it
mirrors.

## Verify

Report-only — never mutate:

- `.gitignore` covers `.local/`.
- An identity derivation exists and is worktree-deterministic (same inputs →
  same identity, no hidden shared state).
- No fixed/hardcoded ports appear in stack configs — all derive from the
  worktree identity or a broker.
- A coherence guard exists and runs on the init path before anything starts.
- No env file references another worktree's absolute path.
- Each stack's state root lives under `.local/`, not elsewhere.
- Every resource a runner starts is stamped with the worktree identity:
  compose project name and container labels, an identity marker in each
  child process's environment, identity-derived state root paths.
- A reclaim path exists, attributes strays by stamped identity — never by
  process ancestry — and scopes to one worktree identity or to identities
  whose worktree directory is gone, never the whole machine.
