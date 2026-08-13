---
name: cmk:infra
description: This skill should be used when the user asks to "set up infra", "add IaC", "structure the infrastructure code", "add an environment", "isolate infra stacks", or needs to establish or audit infrastructure-as-code packages, environment boundaries, and their pipeline wiring.
version: 0.3.0
---

# Infra

Establish or audit a repo's infrastructure-as-code layout: how IaC packages
are isolated from each other, how environments are named and bounded, and
where cloud-provider specifics live versus what stays in the shared pattern.

## Modes

**Init** (default) — create isolated IaC packages per deployment concern and
declare each package's environments.

**Update** — add an environment or package; preserve code-and-pipeline
isolation between stacks.

**Verify** — report-only audit against the checks under `## Verify`;
never mutates.

## `infra/` holds isolated IaC packages

Infrastructure-as-code lives under `infra/`, organized as separate packages
rather than one shared program. Each independently deployable stack — a
different product generation, a different deployment target, a rewrite living
alongside what it replaces — gets its own package with **code-and-pipeline
isolation**: no shared code paths between them, and no shared pipeline
wiring. A change to one package's modules, config, or workflow must not be
able to ripple into another's deploy. When two packages look similar, resist
merging them on that basis alone — isolation is the point, not deduplication.

## One package per deployment concern; environments are first-class

A package owns one deployment concern end to end, not a slice of several.
Within a package, environments are explicit, named entities — not ad-hoc
variable overrides. The standard vocabulary: `production`, `staging`, `dev`,
`canary`, plus **ephemeral per-effort stacks** spun up for a single unit of
work (a feature branch, a review, a bounded experiment) and torn down when it
closes. A repo may not need every tier, but whatever tiers exist are declared,
not inferred from whichever config happens to get passed at deploy time.

## Local stacks are a different facet

A package's environments describe remote, deployed infrastructure. A stack
that mirrors that same topology locally (e.g. a local object store standing
in for the cloud one) so it can run on a developer machine or in CI is
`cmk:local-stack`'s facet, not this one — it must stay worktree-safe there
regardless of what it mirrors. Read `cmk:local-stack` when the task is making
a local topology worktree-safe rather than shaping the deployed packages
themselves.

## Environments are profiles, not forks

Product, protocol, and operator workflows are one production-ready path.
Named environments (and the local stack) adapt composition and
materialization. They do not fork the path. A cloud-only or GitHub-only
implementation of a step that can run as a script is the same defect as
an environment conditional in product code. `cmk:cicd` owns the
host-runnable script contract; this skill owns the environment
vocabulary the composer adapts.

## GitHub ↔ IaC mapping is `cmk:cicd`'s contract

The contract is **1:1:1**: every IaC stack pairs with exactly one GitHub
Environment of the same name and exactly one deploy workflow that targets it.
This skill names that pairing and requires it to exist; the workflow
triggers, branch/tag rules, and approval gates that implement it are
`cmk:cicd`'s facet. Read `cmk:cicd` when wiring the deploy path itself.

## Cloud-provider choice stays out of the upstream kit

This skill does not pick a cloud provider or bake in provider-specific
resources — that choice, and the resources, quotas, and account structure
that follow from it, accumulates per-repo. Record provider-specific decisions
in a `docs/rules/` entry (or the repo's equivalent) and adapt this skill's
guidance to them; do not push provider specifics back into the shared
pattern.

## Tool bindings

The principles above are tool-neutral: they hold regardless of which IaC
tool renders them. Using Pulumi? Read `references/pulumi.md` for the
stack-per-environment file layout, program structure, and state/secrets
trade-offs. An alternative IaC tool joins as a sibling binding alongside it,
not a replacement for the tool-neutral core above.

## Verify

Report-only — never mutate:

- Every IaC package under `infra/` is isolated: no cross-package imports or
  shared modules between independently deployable stacks.
- Every environment named in a package's IaC (`production`, `staging`, `dev`,
  `canary`, or a documented ephemeral pattern) has a corresponding deploy
  path — no environment exists in config with no way to ship to it.
- No credentials, tokens, or account IDs are embedded in tracked IaC files.
- Where a repo claims local-stack mirroring of an environment's topology, the
  mirrored pieces and the divergence from production are documented, not
  assumed.
