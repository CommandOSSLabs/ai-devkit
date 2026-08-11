# Build, test, and lint wiring

Mechanics for the build/test/lint facet in `SKILL.md`.

## One toolchain pin, read by both local dev and CI

`cmk:toolchain` owns the requirement that a pin file exists; for Rust that file is `rust-toolchain.toml`, and it should name the channel and the components every contributor and CI both need (`rustfmt`, `clippy`) so `rustup` installs them identically everywhere the pin is read:

```toml
[toolchain]
channel = "stable"
components = ["rustfmt", "clippy"]
profile = "minimal"
```

A separate `clippy.toml` can carry lints that need an explicit MSRV to reason about correctly (`msrv = "..."`, kept aligned with the pin above) — treat drift between the two as a bug, not two independent settings.

## Lint and format strictness lives at exactly one layer

Two ways to make a lint or format violation fail a build both work: a source-level attribute (`#![warn(clippy::...)]`, `#![deny(...)]`) baked into a crate, or an external CI invocation (`cargo clippy ... -- -D warnings`, `cargo fmt --check`) applied uniformly across the workspace. Pick one layer to own strictness and keep it there — a crate with its own `#![deny(...)]` on top of a workspace-wide `-D warnings` CI gate can silently diverge from its siblings (stricter, or differently configured) with no single place a reader can check what's actually enforced. A workspace-wide CI gate is usually the simpler choice: one invocation covers every crate uniformly, and a new crate is covered automatically without anyone remembering to add source attributes to it.

The same reasoning applies to a crate-level policy like forbidding `unsafe`: `#![forbid(unsafe_code)]` opted into by some crates and not others, with no stated rule for which, is a policy nobody can name — either make it workspace-uniform (every crate, or every crate below a stated boundary) or document explicitly which crates are exempt and why, so "does this crate forbid unsafe" has a discoverable answer instead of requiring a grep.

## Nextest changes what "shared test state" means

If the workspace's test runner is `cargo-nextest` rather than bare `cargo test`, every test executes as its own OS process — see `cmk:test-resources` before designing any pattern that shares an expensive resource (a container, a database, a connection pool) across tests, since the process-per-test model silently defeats in-process singletons that would work fine under `cargo test`'s default thread-per-test model. `cmk:testcontainers` covers the Rust-specific mechanics of starting and sharing containers correctly under either model.

## A computed feature union feeds the same CI invocation

Where the workspace has more than one crate declaring features (see `references/feature-flags.md`), the clippy and test invocations should run against the computed union, not an unparameterized `--workspace` that silently exercises only default features:

```
FEATURES=$(tool feature-universe --print-union)
cargo clippy --locked --workspace --all-targets --features "$FEATURES" -- -D warnings
cargo nextest run --locked --workspace --features "$FEATURES"
```

`--locked` on both keeps CI from silently resolving a different dependency set than the committed lockfile.
