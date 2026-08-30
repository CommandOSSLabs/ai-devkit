---
name: cmk:sui-devstack
description: This skill should be used when the user asks to "author an e2e harness config for Sui", "set up local Sui dev with Devstack", "add a devstack.config.ts", "debug a Devstack harness", "wire Vitest to a local Sui stack", or "clean up a Devstack instance" — or needs a worktree-safe local Sui network (node, accounts, published Move packages, optional Walrus) for development or tests.
version: 0.1.0
---

# Sui Devstack

Devstack (`@mysten-incubation/devstack`) is Mysten's tool for materializing a
local Sui network from a declarative TypeScript config. This skill teaches
the worktree-safe selection layer `cmk:local-stack` prescribes on top of it —
Devstack itself is the external tool; its own CLI and plugin API are covered
by Devstack's own docs and README, not repeated here.

## What Devstack provides

A `devstack.config.ts` declares a topology and Devstack materializes it:

- a local Sui node (`mode: "local"`, optionally a pinned or custom image);
- ephemeral accounts, some pre-funded at construction for scenarios that need
  gas up front;
- local Move package publication — stage sources, publish, and capture
  on-chain ids/capabilities the config exposes to consumers;
- an optional local Walrus member for stacks that need blob storage alongside
  the chain.

A port broker assigns each instance's service ports internally; callers read
them back from Devstack's own context/manifest rather than hardcoding any.
For the plugin API (`account`, `sui`, `walrus`, `localPackage`, `definePlugin`),
the CLI (`up`, `apply`, `wipe`), and version-specific behavior, treat
Devstack's own documentation as authoritative — this skill covers only the
repo-side conventions layered on top.

## The worktree-safe selection layer

Devstack's own naming is global by default (an app/stack pair), which is not
enough for several worktrees of the same repo to run instances side by side
without colliding. `cmk:local-stack`'s `(worktree, config, instance)`
primitive fixes that for Devstack specifically:

- the worktree **identity** (normalized branch label + normalized worktree
  label + a short hash of the absolute repo path) becomes Devstack's app
  name;
- `<config>-<instance>` becomes the Devstack stack name;
- the instance gets an explicit root at `.local/devstack/<config>/<instance>/`,
  with named children for state (`state/`) and the tool's home directory
  (`move-home/`) — never a shared, ambient home.

A selection helper should take exactly three inputs — config name, instance
name, absolute config path — validate that both names are lowercase-normalized
(safe for directory, container, and log use) and that the config path resolves
inside the current worktree, then export the identity-derived app name, the
stack name, the config path, and the instance's state/home paths together as
one contract. Whatever consumes those values (a test's global setup, a bridge
process) should re-validate the same invariants at boot rather than trusting
inherited environment blindly — stale values from a parent process are exactly
the failure this guards against. Setting up or debugging that selection
mechanism? Read `references/instance-isolation.md`.

## Configs are package-owned

There is no single shared Devstack config: each e2e subject, benchmark, or dev
topology owns its own `devstack.config.ts` beside its tests, declaring exactly
the services, accounts, and packages that subject needs. Authoring one? Read
`references/config-authoring.md` for account-funding hygiene, cross-process
key handling, local Move package staging, and the publish-on-drift guard
shape.

## Join vs. select-distinct is instance naming, nothing more

The selection helper never decides whether to share or isolate — that is
purely which instance name gets passed in. The same `(config, instance)` tuple
joins an already-running instance (the default: one instance normally serves
many tests); a different instance name selects a distinct one. A reuse flag on
the consuming side (e.g. for a second-language process joining a live chain)
signals "attach, don't boot or clean" — it does not change the naming
mechanism itself.

## Global-state prohibitions

Never read or write a home-directory singleton (`~/.sui`, `~/.move` or
equivalent) — every instance gets its own Move-home path. Never source or
reuse another worktree's state. Never wipe anything but the one explicitly
selected instance: no tool-level prune, no deleting the whole `devstack/`
state tree, no touching a sibling instance's paths. Run the repo's local-stack
init and coherence scripts first (see `cmk:local-stack`) so the worktree
identity feeding all of this is fresh before selecting an instance.
