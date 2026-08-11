# cmk:rust

## What
Skill that applies idiomatic Rust practices inside a crate or module
boundary the system's design already decided — error types, module
boundaries, feature flags, lint/format/test wiring, and dependency hygiene —
without reshaping the design to fit a generic Rust template.

## Approach
Five facets, each a deliberate choice rather than a single mandated style:
module boundaries mirror the design's own concepts, with two legitimate
public-surface conventions (curated facade vs. full module-path imports)
picked once per crate and held consistently, plus disciplined use of
`pub(crate)` as a real middle visibility tier. Error handling picks per type
among three shapes — typed/propagated (`thiserror`), boundary/opaque
(`anyhow`), or plain classification data with no `Error` impl at all — and
never lets a bare `.unwrap()` assert an invariant silently. Feature flags
default off and gate whole optional subsystems, with a computed feature
union (not a hand-maintained list) keeping what CI actually tests honest.
Build/test/lint wiring names one layer (source attributes or CI) as the
owner of strictness, and calls out that a process-per-test runner like
`cargo-nextest` changes what "shared test state" even means — deferring to
`cmk:test-resources` for that. Dependency hygiene distinguishes a
policy-scanner tool (license/advisory/duplicate checks) from a hand-written
graph assertion (an architecture-specific "must never depend on X"), naming
both as legitimate and neither as a substitute for the other.

## Where
- Skill body: `skills/rust/SKILL.md` — sections `Five facets, one split`,
  `What this teaches vs. what a project owns`, `Verify`.
- `references/module-boundaries.md` — the two public-surface conventions,
  `pub`/`pub(crate)`/private tiers, when a module is crate-shaped.
- `references/error-handling.md` — the three error shapes with code, the
  mutex-poison `.expect()` idiom, never leaking a secret through `Display`.
- `references/feature-flags.md` — default-off gating, a cross-crate
  test-only feature vs. `#[cfg(test)]`, the computed feature-union pattern.
- `references/build-test-lint.md` — the toolchain-pin/CI relationship, why
  strictness should live at one layer, the nextest process-model pointer.
- `references/dependency-hygiene.md` — policy scanner vs. hand-written
  `cargo tree` assertion, curating `[workspace.dependencies]` with rationale
  comments for non-obvious choices.

## Links
- `cmk:project-layout` — decides which role directory and crate a piece of
  code belongs to; this skill starts one level in, once that's decided.
- `cmk:toolchain` — owns the toolchain pin file itself; this skill only adds
  what's Rust-specific about reading it (`rustfmt`/`clippy` components,
  `clippy.toml`'s MSRV-aware lints).
- `cmk:test-resources` — the generic principle behind why a process-per-test
  runner changes shared-resource design; this skill just names where it
  applies.
- `cmk:testcontainers` — the Rust-crate-specific mechanics for
  container-backed tests, one layer under this skill.
