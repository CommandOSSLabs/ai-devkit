# Persistent self-hosted runner fleets

Use this reference for long-lived GitHub Actions runner agents managed as
services. JIT and ephemeral hosts remain in `references/host-runnable.md`.

## Contents

- [Start with the concurrency model](#start-with-the-concurrency-model)
- [Give every pool one owner](#give-every-pool-one-owner)
- [Standardize identity and directories](#standardize-identity-and-directories)
- [Scope mutable state](#scope-mutable-state)
- [Separate bootstrap authority from job authority](#separate-bootstrap-authority-from-job-authority)
- [Model lifecycle as state transitions](#model-lifecycle-as-state-transitions)
- [Own Docker resources exactly](#own-docker-resources-exactly)
- [Migrate without a routing gap](#migrate-without-a-routing-gap)
- [Verify the boundary](#verify-the-boundary)

## Start with the concurrency model

One persistent runner agent accepts one assigned job at a time. Treat one
configured agent, its installation directory, and its service as one
concurrent slot:

```text
eligible online agents = maximum fleet job concurrency
```

Do not start multiple processes from one configured directory. They share one
agent identity and contend for the same server session and mutable files.
Provision `N` separately registered agents for capacity `N`.

Workflow `jobs.<job_id>.strategy.max-parallel` is a matrix admission cap. It
limits how many generated matrix jobs may run simultaneously even when more
runners are available; it does not make one runner agent execute multiple jobs.
Workflow/job `concurrency` is another admission and cancellation policy, not a
runner capacity control.

When current platform behavior matters, recheck GitHub's official
[matrix documentation](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations),
[runner routing reference](https://docs.github.com/en/actions/reference/runners/self-hosted-runners),
and [runner source](https://github.com/actions/runner).

## Give every pool one owner

A pool has one project ownership domain and an explicit repository allowlist.
Do not make a runner eligible for unrelated projects merely to reduce the
registration count: it saves little lifecycle work and turns every shared
directory, cache, cleanup rule, and credential into a cross-project contract.

Choose the strongest GitHub-side boundary available:

- Prefer repository-scoped runners for a one-repository project.
- For an organization pool, put agents in a project-specific runner group and
  restrict that group to the project's repositories.
- Require the project group and/or a project-qualified label in `runs-on`.
  Labels select capabilities; they are not an access-control boundary.
- Never route a multi-project host job using only generic labels such as
  `self-hosted`, `linux`, or `x64`.

One Unix service account across trusted projects provides operational
separation, not hostile-tenant security: jobs under that identity can usually
read or alter sibling state and reach the same Docker daemon. Use separate
Unix accounts plus daemon boundaries, separate VMs/hosts, or ephemeral runners
when repositories or contributors are not mutually trusted.

## Standardize identity and directories

Keep mutable fleet state under the dedicated runner account's home. Given a
stable lowercase project key and host key:

```text
~/actions-runners/<project>/
  instances/r01/          # one extracted and configured runner
  instances/r02/
  cache/                  # explicitly project-shared caches only
  state/                  # lifecycle inventory and last-known metadata
  logs/                   # fleet-level operational logs
  locks/                  # project-level operation locks
```

Use project-qualified identities everywhere:

```text
runner name:  <host>-<project>-r01
service:      actions.runner.<owner>-<project>.<host>-<project>-r01.service
route label:  <project>-<capability>
```

Treat project key, host key, owner/repository, runner group, required labels,
instance count, runner version, and retention policy as one checked-in fleet
configuration. Derived names and paths come from that configuration; operators
do not hand-compose them differently across setup, status, cleanup, and remove.

Resolve managed paths canonically before privileged operations. Reject empty
or traversal-bearing keys, roots outside the configured project root, symlinked
managed roots or instance directories, and prefix lookalikes such as
`project-old` when the owner is `project`.

## Scope mutable state

Each slot gets its own runner work directory and every cache or tool home that
is not proven concurrency-safe. A sensible default is slot-local state beneath
`instances/rNN/`; project-shared caches under `cache/` are opt-in and require
the cache's own locking or immutable/content-addressed writes.

Do not silently fall back to account-global paths such as `~/.cache/<tool>` or
a shared checkout. Make project and slot scope visible in environment variables,
container names, Compose project names, buildx builder names, and temp paths.
Host-global state is exceptional: put only true cross-project coordination
locks there, document their protocol, and never turn the directory into a
miscellaneous cache.

Persistent runners are not clean machines between jobs. Install pre/post-job
hooks before an agent can accept work, and make cleanup idempotent, exact, and
safe after partial failure. A failed cleanup must fail the job or quarantine
the slot; it must not silently return a contaminated agent to the pool.

## Separate bootstrap authority from job authority

The runner service and CI jobs run as a dedicated, non-login account such as
`gh-runner`. Operators connect with their own SSH identity and use narrowly
scoped privilege escalation; the runner account does not need an SSH password
or broad passwordless sudo.

Keep the trusted control plane out of job-writable paths. Bootstrap sources,
systemd units, environment files, and job hooks that root installs or sources
must be root-owned, with no runner-writable ancestor. This is the deliberate
exception to keeping mutable runner data under `~`: a job must not be able to
replace the next privileged bootstrap input or cleanup hook.

Download the official prebuilt runner archive, pin its version and checksum,
and give every slot a distinct extraction directory. The archive bundles the
runner runtime, but Linux hosts can still need native OS libraries; run the
release's bundled `bin/installdependencies.sh` once per host image as the
authoritative compatibility installer. Copy it to a root-private temporary
directory before executing it rather than executing a runner-writable file as
root. Do not install a general .NET SDK unless project jobs themselves need it.

## Model lifecycle as state transitions

Make setup, reconcile, status, drain, remove, and repair project-scoped
commands over the same inventory. A safe bootstrap order is:

```text
verify host and artifact
  -> configure registration as the runner user
  -> install a stopped, disabled service
  -> install and verify hooks/environment
  -> enable and start
```

`--skip-start` means the unit remains stopped **and disabled across reboot**.
`--skip-hooks` is valid only with `--skip-start`; otherwise the agent could
accept a job before its isolation controls exist.

Registration and removal use distinct short-lived tokens. A forced replace is
an explicit transaction:

```text
stop + disable old unit
  -> remove unit definition
  -> mint removal token
  -> deregister old agent
  -> configure new registration
  -> install stopped + disabled unit
  -> install controls
  -> enable + start
```

Fail closed on any step and report the remaining local and GitHub state. Do
not delete the configured directory before deregistration succeeds unless an
explicit break-glass path also records and reconciles the stale remote agent.
Removal targets exact inventory-derived names and paths, never project-prefix
globs or every runner visible to the operator token.

Service status is not enough. Reconcile local inventory, configured files,
systemd unit state, process state, and GitHub's runner record; surface drift
instead of guessing which side is authoritative.

## Own Docker resources exactly

Shared Docker access is the most common cross-project cleanup hazard. Every
resource creator—Compose, direct `docker`, test frameworks, buildx, and helper
scripts—must emit an exact project ownership marker and, where relevant, a
workflow-run marker.

Prefer exact labels owned by the project. When a third-party tool exposes only
a closed native label schema, match a documented exact label/value pattern;
never fall back to substring name matching. Use project-qualified Compose
projects and buildx builders. Cleanup enumerates only positively owned
containers, networks, volumes, images, builders, and caches.

Preserve unlabeled resources and sibling-project resources. Never use a
host-wide image/volume/system prune from a project job. Immediate cleanup may
target the exact run marker; retention cleanup uses the project marker plus an
age gate and a project lock. Any daemon-wide coordination lock belongs to an
explicit host-global control namespace because all project pools share the
daemon.

## Migrate without a routing gap

Change capacity and layouts as a staged pool migration:

1. Give the old pool a legacy route and keep current workflows pinned to it.
2. Bootstrap the new pool stopped and disabled.
3. Verify registrations, units, hooks, paths, labels/groups, and cleanup in a
   non-production probe.
4. Enable the new pool, then switch workflow routing.
5. Drain in-flight work from the old pool before exact removal.

Rollback switches routing to the still-intact old pool. Do not mutate all
registrations in place and discover an invalid label or hook after capacity is
already gone.

## Verify the boundary

Contract checks should derive from the fleet configuration and prove:

- capacity `N` produces exactly `N` distinct agent identities, directories,
  and services; no configured directory is shared;
- required project group/labels survive operator overrides, while generic-only
  routing and cross-project repository access are rejected;
- traversal, symlinked roots/instances, and prefix-lookalike paths fail closed;
- stopped bootstrap units remain disabled after reboot and cannot start before
  required hooks exist;
- replacement uses a removal token before deleting old configuration, and a
  partial failure leaves explicit recoverable state;
- slot workspaces and non-concurrent-safe caches never overlap;
- every known Docker creator stamps ownership, while cleanup preserves an
  unlabeled fixture and a sibling-project fixture of every resource type;
- no project cleanup path invokes a global prune or prefix/substring selector;
- the docs state whether the chosen account/daemon topology is operational
  isolation or a security boundary.

Also run a real two-slot collision probe: two jobs concurrently create the
same logical fixture name and cache key. Both must complete without sharing a
checkout, overwriting mutable cache state, or deleting the other's Docker
resources.
