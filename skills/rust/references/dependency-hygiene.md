# Dependency hygiene

Mechanics for the dependency-hygiene facet in `SKILL.md`.

## Two different tools, not substitutes for each other

**A policy scanner** (`cargo-deny` or equivalent) checks properties that apply uniformly across the whole dependency graph: license compatibility, known security advisories, banned crates, and duplicate versions of the same crate bloating the build. It runs against a declarative config, not hand-written per-crate logic, and catches a newly-added transitive dependency violating policy without anyone having to think to check for it.

**A hand-written graph assertion** checks something only that crate's own architecture cares about — "this crate must never pull in an HTTP client, because it runs inside a constrained enclave" — which a general-purpose policy scanner has no way to know or express:

```
if cargo tree -p enclave-bound-crate -e normal | grep -qE '(^|[[:space:]])(reqwest|hyper)( |$)'; then
  echo "enclave-bound-crate must not depend on an HTTP client (network egress is disallowed here)"
  exit 1
fi
```

A repo with only hand-written assertions and no policy scanner has covered its own known architectural invariants but has no defense against a license violation or a disclosed advisory landing silently in a transitive dependency — that gap is worth naming explicitly rather than assuming the hand-written checks already cover it.

## Curate `[workspace.dependencies]`, and say why for anything non-obvious

A single dependency table shared across every workspace member keeps versions from drifting per-crate. Where a version or feature choice isn't the obvious default — a non-default TLS backend chosen to avoid two crypto providers loading simultaneously, a fork or replacement of a crate for a reason that isn't visible from the `Cargo.toml` line alone — a comment at that line is cheaper than every future reader re-deriving why:

```toml
[workspace.dependencies]
# enable-rustls-ring (not enable-rustls): keeps this crate's TLS on the same
# CryptoProvider a sibling dependency already pulls in, avoiding a
# multi-provider panic at runtime.
some-crate = { version = "...", default-features = false, features = ["enable-rustls-ring"] }
```
