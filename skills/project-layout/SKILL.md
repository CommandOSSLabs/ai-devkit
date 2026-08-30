---
name: cmk:project-layout
description: Use when the user asks to "set up the repo structure", "organize the monorepo", "where should this package live", "restructure folders", "add a new package", or needs to establish or audit a role-first monorepo layout with per-ecosystem workspaces, library placement rules, and vendored-source conventions.
version: 0.2.1
---

# Project Layout

Establish or audit a monorepo's top-level layout: which directory a new
package joins, how many workspaces each language ecosystem gets, when a
shared library graduates out of a single role-area, and how vendored upstream
source stays editable without becoming unmanageable.

## Modes

**Init** (default) — establish the role-first top level: pick the roles the
product actually needs, place existing packages by the rubric, and set one
workspace per ecosystem.

**Update** — place a new package, promote a shared library, or add a role
directory as the repo grows; change only what the request touches.

**Verify** — report-only audit against the checks under `## Verify`;
never mutates.

## Role-first top level

A repo-root directory names a **role** — what a thing is — never a language
or framework. Typical roles: `ui/` (frontends), `backend/` (deployable
services), `cli/` (operator tooling), `libs/` (shared libraries),
`contracts/` (on-chain or similarly deployed packages, when the product has
any), `infra/` (platform and IaC), `scripts/` (developer and operational
automation), `docs/` (documentation), `tests/` (private test packages). A
repo picks the roles it actually needs — not every project has `contracts/`
— but whatever roles exist stay named for role, not implementation language.
A new package always joins by role first: decide what it *is* before
deciding what its own language ecosystem wants inside that role.

Two languages can coexist inside one role directory (a Rust service and a TS
service both under `backend/`) — the role groups by responsibility, not by
toolchain.

## One workspace per ecosystem, rooted at the repo root

Each language ecosystem gets exactly one workspace, rooted at the repo root
— not one per role directory: one Cargo workspace covers every Rust crate
regardless of which role directory holds it, one package-manager workspace
(single lockfile) covers every JS/TS package the same way. Never create a
second, nested workspace file inside a subdirectory — a nested workspace
manifest or a second lockfile fragments dependency resolution and defeats the
point of a single workspace.

Package-filtered installs and commands (installing, building, or testing one
package by name) are how independent CI and deployment cadence is preserved
*without* nested workspaces — filter the command, don't fork the workspace.

## Cross-language name collisions

Two ecosystems sometimes want the same package name for related code (a wire
protocol implemented once in Rust and once in TypeScript). Only when that
collision actually happens, suffix the name with `-rs` / `-ts` (or the
equivalent for the ecosystems in play) to disambiguate. Do not suffix
pre-emptively — an unsuffixed name is correct until a second ecosystem
actually claims it.

## Library promotion rule

A library used by exactly one role-area may live inside that role area next
to its only consumer (e.g. a support crate under `cli/my-tool/core/`). The
moment a second role-area imports it, move it to the shared `libs/` root —
don't wait for a third consumer, and don't leave it in the original role area
"just this once" out of convenience. The trigger is the second real import,
not a predicted future one.

## Private test packages

`tests/e2e/` and `tests/parity/` (or a repo's equivalents) are private test
packages, not shared libraries: each owns its own runtime configuration and
lifecycle rather than inheriting one from a product package. A parity
package specifically owns cross-language renderers, golden vectors, and a
stale-fixture check that fails when a vector and its renderer drift apart.
Read `references/parity-testing.md` for the full pattern.

## `external/` vendoring

`external/` holds complete, editable mirrors of upstream source that is
governed in another repository — normal tracked files, not a submodule or a
dependency cache. Add one only when both halves are true: product-local
development on that source is actually needed, *and* a safe way to
round-trip changes back upstream exists. Every `external/` package needs a
baseline lockfile recording the upstream state it was mirrored from, and a
scripted round-trip: edit product-first, test in place, export the change
immediately, and sync again after upstream merges it. Exclude the vendored
tree's own nested git metadata and any build artifacts — the mirror is
source, not a second repository.

## `scripts/` grouped by responsibility

Group scripts by what they do, not by which package calls them: typical
groups are `dev/`, `workflow/`, `setup/`, `benchmark/`, and similar
responsibility buckets. Keep the scripts root itself down to stable, public
command wrappers — thin entry points meant to be called by name from outside
the directory. Anything else belongs inside a responsibility subdirectory.

## Placement rubric

When it's unclear where a new thing goes, answer in this order:

1. **What is its role?** (frontend, service, operator tool, library,
   on-chain package, infra, script, doc, test package)
2. **Does a role-area already own something like it?** If so, join that
   role area.
3. **Is it shared across role-areas?** If a second role-area needs to
   import it, it belongs in `libs/`, not inside either consumer.
4. **Is it a test package?** Private test packages own their own
   configuration; they don't inherit a product package's.
5. **Is it externally governed?** Source mirrored from an upstream
   repository with round-tripping obligations belongs in `external/`, not
   mixed into a product role area.
6. **Still unresolved?** Don't force-fit. Derive a proposal from widely
   accepted practice for the ecosystem, its conventions, and the repo's own
   existing precedents — and when more than one placement remains genuinely
   defensible, present the options, ask what the human has in mind, and help
   carry that intent through rather than deciding silently.

## Verify

Report-only — never mutate:

- Every top-level directory names a role, not a language or framework.
- Exactly one workspace/lockfile exists per language ecosystem, at the repo
  root — no nested workspace file or second lockfile in a subdirectory.
- No library is imported by two or more role-areas while still living
  inside one of them.
- Every private test package under `tests/` owns its own runtime
  configuration rather than inheriting a product package's.
- Every `external/` package has a baseline lockfile and a documented
  round-trip script; none embed nested git metadata or build artifacts.
- The `scripts/` root holds only stable, public command wrappers; everything
  else sits under a responsibility subdirectory.
