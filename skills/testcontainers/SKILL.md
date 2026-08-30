---
name: cmk:testcontainers
description: This skill should be used when the user asks to "use testcontainers for tests", "start a database container in tests", "testcontainers-rs", "container startup is flaky in CI", or needs to start and share a throwaway service container (Postgres, Redis, MinIO, or similar) from Rust test code via the `testcontainers` crate.
version: 0.1.0
---

# Testcontainers (Rust)

Mechanics for starting and sharing a throwaway service container from Rust test code via the `testcontainers` crate (with `testcontainers-modules` for common services), wired into the sharing shapes `cmk:test-resources` defines and the test-runner wiring `cmk:rust` sets up. This skill is the Rust-crate-specific layer under both — it assumes their principles and adds nothing generic of its own.

## Modes

**Init** (default) — wire a new container-backed test resource: retry/backoff, guard lifetime, host/port readback, and which of `cmk:test-resources`' two shapes applies.

**Update** — add a service module, or migrate an existing container-starting helper onto the retry/backoff idiom.

**Verify** — report-only audit against the checks under `## Verify`; never mutates.

## Retry and back off around container startup

Docker image pulls and container startup are the flakiest part of a test run — a bare `.start()` call with no retry turns a transient pull hiccup into a spurious test failure. Wrap it in a bounded retry with a per-attempt timeout and backoff, and fail loud once attempts are exhausted rather than returning a value that looks like success:

```rust
async fn start_postgres() -> ContainerAsync<Postgres> {
    const ATTEMPTS: u32 = 3;
    const PER_ATTEMPT: Duration = Duration::from_secs(90);
    for attempt in 1..=ATTEMPTS {
        match tokio::time::timeout(PER_ATTEMPT, Postgres::default().start()).await {
            Ok(Ok(container)) => return container,
            Ok(Err(_)) | Err(_) if attempt < ATTEMPTS => {
                tokio::time::sleep(Duration::from_secs(2 * u64::from(attempt))).await;
            }
            Ok(Err(_)) | Err(_) => panic!("start Postgres testcontainer after {ATTEMPTS} attempts"),
        }
    }
    unreachable!()
}
```

## Keep the container guard alive as long as anything uses it

`ContainerAsync` owns the container's lifetime through `Drop` — the container stops the moment its last handle drops. Bundle it inside whatever shared struct carries the connection info, not alongside it as a separate value someone could drop early:

```rust
struct SharedPostgres {
    _container: ContainerAsync<Postgres>,  // never read directly — its Drop is the point
    base_url: String,
}
```

In the lock-across-startup singleton shape (`cmk:test-resources`), the `Arc<SharedPostgres>` — not the bare container — is what every caller holds; the container only stops once every caller has dropped its `Arc`.

## Read back host and port; never assume a fixed one

The runner maps each exposed container port to an ephemeral host port, which differs across runs and across containers running concurrently:

```rust
let host = container.get_host().await.expect("read container host");
let port = container.get_host_port_ipv4(5432).await.expect("read mapped port");
let base_url = format!("postgres://postgres:postgres@{host}:{port}");
```

## Two shapes, same as `cmk:test-resources` — testcontainers is only one branch

Testcontainers implements `cmk:test-resources`' "same process" shape (start once, share via a lock-across-startup singleton) and *replaces itself entirely* for the "same external resource" shape — when a genuinely shared server exists (CI providing one Postgres for the whole job), that path connects to it directly instead of starting a container, selected by the two-flag override guard that skill describes. The two branches are alternatives, not layers: a test process either starts its own throwaway container or connects to the shared external one, never both.

## CI needs a container runtime available, stated up front

A container-backed test suite requires Docker (or an equivalent OCI runtime) on whatever runs it. State that requirement in the CI job definition itself — a runner image without it fails every container-backed test with an opaque connection error, which reads as a flaky suite rather than a missing prerequisite.

## Verify

Report-only — never mutate:

- Every container start is wrapped in a bounded retry with backoff, not a bare, unretried `.start()` call.
- The container guard's lifetime is bundled inside whatever struct carries its connection info, never held or dropped separately.
- Host and mapped port are read back after start, never hardcoded or assumed fixed.
- Exactly one of `cmk:test-resources`' two shapes applies per test path — a test never both starts its own container and connects to a shared external one.
- The CI job definition states its container-runtime prerequisite explicitly, not left to be discovered as a first-run failure.
