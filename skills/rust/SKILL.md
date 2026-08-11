---
name: cmk:rust
description: This skill should be used when the user asks to "set up error handling", "add a feature flag", "structure this crate", "what's our clippy/lint policy", "why is this test flaky under nextest", "add dependency hygiene checks", or needs to apply idiomatic Rust practices — error types, module boundaries, feature flags, lint/format/test wiring, dependency hygiene — inside a crate whose shape is already decided by the system's design.
version: 0.1.0
---

# Rust

Apply idiomatic Rust practices *inside* a crate or module boundary the system's design already decided — never the reverse. `cmk:project-layout` decides which role directory and which crate a piece of code belongs to (design-first, language-agnostic); this skill starts one level in, once that decision is made, and covers what makes the Rust *inside* that crate good: error types, module boundaries, feature flags, lint/format/test wiring, and dependency hygiene. A design that reshapes itself to fit a generic Rust template has the relationship backwards.

## Modes

**Init** (default) — establish the five facets for a crate or workspace that doesn't have them decided yet: module convention, error-handling policy, feature-flag defaults, lint/test wiring, dependency hygiene.

**Update** — revise one facet (a new error-type family, a lint-strictness migration, adopting a policy scanner) without re-deciding the others.

**Verify** — report-only audit against the checks under `## Verify`; never mutates.

## Five facets, one split

- **Module boundaries** — a crate's public surface should mirror the design's own boundaries, not accumulate as a grab-bag. Read `references/module-boundaries.md`.
- **Error handling** — which of three legitimate shapes (typed/propagated, boundary/opaque, or plain classification data) fits a given error, chosen deliberately per crate rather than picked by habit. Read `references/error-handling.md`.
- **Feature flags** — default-off, gating whole optional subsystems rather than stray `cfg`s, with the workspace-tested feature union kept honest mechanically. Read `references/feature-flags.md`.
- **Build, test, and lint wiring** — the toolchain-pin/CI relationship, why a parallel test runner changes what "shared test state" means, and where lint/format strictness should live. Read `references/build-test-lint.md`.
- **Dependency hygiene** — a policy scanner for licenses/advisories/duplicates is a different tool than a hand-written "this crate must never pull in X" assertion; both are legitimate, and neither substitutes for the other. Read `references/dependency-hygiene.md`.

## What this teaches vs. what a project owns

This skill teaches shapes and the decision points inside them — never a single mandated style to copy verbatim into every crate. Recognize and avoid: **silent inconsistency** (a policy choice — which error shape, whether `unsafe_code` is forbidden, which module-facade convention — made once, then drifting per-crate with no one deciding whether that's deliberate or accidental); **redundant strictness layers** (a lint enforced both by a source-level `#![warn(...)]`/`#![deny(...)]` attribute and by a CI flag, which can silently diverge — pick one layer to own it); **template-first structure** (importing a generic Rust project layout wholesale instead of letting the design's own boundaries decide module shape).

Projects own: which error-handling shape each crate uses and why; which crates forbid `unsafe`; the workspace's actual `[workspace.dependencies]` choices and version-pin rationale; MSRV and edition (`cmk:toolchain` owns the pin file itself); which dependency-hygiene tool, if any, is adopted.

## Verify

Report-only — never mutate:

- Every crate's public surface follows one stated re-export convention (a curated facade, or full module paths) — not a mix within the same crate.
- Every non-test `.unwrap()`/`.expect()` carries a message stating the invariant that makes it safe, or is removed in favor of propagating the error.
- A crate's error-handling shape (typed, boundary/opaque, or plain data) is a stated choice, not an accident of which example the author copied from.
- Lint and format strictness is enforced at exactly one layer (source attributes, or CI, not both silently) and that layer is named somewhere a new contributor can find it.
- If the workspace tests more than one feature combination, a mechanical check keeps the tested feature union in sync with what crates actually declare — not a hand-maintained list that can silently drift.
