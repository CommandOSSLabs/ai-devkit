# Feature flags

Mechanics for the feature-flags facet in `SKILL.md`.

## Default off, gate the whole subsystem

A feature should default to disabled and turn on an entire optional capability — its own dependencies included — not toggle a lone `cfg` inside otherwise-always-compiled code:

```toml
[features]
default = []
wasm = ["dep:wasm-bindgen"]           # a whole optional build target
postgres = ["dep:sqlx"]                # a whole optional backend
test-support = []                      # test-only fixtures, kept out of production builds
remote-bindings = [                    # a whole optional subsystem's dependency cluster
    "dep:axum", "dep:reqwest", "dep:tokio-tungstenite",
]
```

`default = []` keeps a library a plain, minimal build for consumers who need none of the optional surface — a native unit-test run doesn't need to pull in `wasm-bindgen`, a crate that never touches Postgres shouldn't need `sqlx` in its dependency tree just because a sibling crate does.

## A test-only surface that must cross a crate boundary is a feature, not `#[cfg(test)]`

`#[cfg(test)]` only compiles for the crate's own test binary — it's invisible to a *different* crate's integration tests that need to construct a fixture from this one. When that's the actual need, gate the fixture behind a named feature (`test-support`) instead, and leave it off by default so production builds can't reach it by accident:

```toml
test-support = []   # exposes fixtures for other crates' integration tests;
                     # omitted from production builds so they can't call them
```

## Keep the workspace-tested feature union honest mechanically

Once more than one crate declares features, "which combination does CI actually test" stops being obvious — and a hand-maintained list of flags to pass drifts the moment a crate adds or renames one. Compute the union instead of hand-maintaining it: a small script walks every workspace member's `Cargo.toml`, unions their non-default feature names, and CI runs against exactly that computed set — with a drift check that fails loudly if a crate's declared features and the script's own expectations disagree, rather than silently testing a stale subset.

```
FEATURES=$(tool feature-universe --print-union)
cargo clippy --workspace --all-targets --features "$FEATURES" -- -D warnings
```

A narrower, second CI pass that tests specific *feature-off* combinations (a crate built with `--no-default-features`, or with only one named feature) is a legitimate addition on top of the full-union pass — it proves specific off-states compile and lint clean, which the union pass alone can mask if a feature-gated code path only ever gets exercised alongside every other feature.
