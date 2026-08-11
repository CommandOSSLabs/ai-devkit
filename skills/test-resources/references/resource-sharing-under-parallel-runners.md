# Resource sharing under parallel runners

Mechanics for the process-model and namespacing facets in `SKILL.md`.

## Detect the real process model

Add a temporary probe to two tests that live in the same binary or file, run them, and diff the output:

```rust
#[test]
fn probe_a() { eprintln!("probe pid={}", std::process::id()); }
#[test]
fn probe_b() { eprintln!("probe pid={}", std::process::id()); }
```

Same identifier both times: the runner executes these tests in one process, and an in-process singleton (a `static` behind a lock) will genuinely share state. Different identifiers: the runner forks or execs per test, and any `static` resets every time — there is nothing to share in-process, and the resource must be started once outside the run instead.

Remove the probe once the question is answered; it exists to answer one question, not to stay in the suite.

## Shape 1: same process — lock-across-startup singleton

```rust
static SHARED: OnceCell<AsyncMutex<Weak<Resource>>> = OnceCell::const_new();

async fn shared_resource() -> Arc<Resource> {
    let cell = SHARED.get_or_init(|| async { AsyncMutex::new(Weak::new()) }).await;
    let mut guard = cell.lock().await;
    if let Some(r) = guard.upgrade() {
        return r;
    }
    let r = Arc::new(start_resource().await);
    *guard = Arc::downgrade(&r);
    r
}
```

The lock is held across the startup await, not just the swap, so two callers racing the empty-weak-reference case don't both start a second instance. This shape is only valid when the runner actually executes these tests in one process — see the detection step above.

## Shape 2: same external resource — mint a namespaced slice per call

The resource itself is started once, outside test code (by the harness, or by CI before the test binary runs), and its connection info reaches test code through an environment variable. Every test process that connects still needs its own database, bucket, or table, named uniquely across every process that might be racing it:

```rust
static ORDINAL: AtomicU64 = AtomicU64::new(0);

async fn fresh_slice(base_url: &str) -> String {
    // `ordinal` alone restarts at 0 in every fresh process — it only
    // disambiguates multiple slices requested by the *same* process.
    // The process id disambiguates across processes racing the same
    // external resource.
    let ordinal = ORDINAL.fetch_add(1, Ordering::SeqCst);
    let name = format!("test_{}_{ordinal}", std::process::id());
    create_slice(base_url, &name).await;
    name
}
```

Naming by ordinal alone is the failure mode to watch for: it works perfectly in any run where only one process ever touches the resource (a solo local run, a CI job that happens to serialize) and only collides once two processes race the same shared instance concurrently — exactly the condition a quick local check won't reproduce.

## Guard an external-resource override with two flags

A single environment variable can't distinguish "intentionally pointed at the shared resource" from "the variable happened to be empty and a default kicked in." Pair the value with an explicit presence flag:

```rust
if let (Ok(url), Ok(_)) = (env::var("EXTERNAL_RESOURCE_URL"), env::var("EXTERNAL_RESOURCE_URL_SET")) {
    // deliberate override — a caller had to set both
} else {
    // local fallback — start a throwaway instance
}
```

A caller that sets the URL but forgets the second flag falls through to the safe local fallback instead of silently taking an unintended path.

## A negative control has to run where the failure mode lives

A test built to prove "two callers don't collide" is only informative if it runs under the conditions where a collision could occur — against the resource the real suite actually shares, exercised the way the real suite exercises it (concurrently, across processes, against the shared instance). Point it at a private per-process fallback instead, and it reports green regardless of whether the isolation scheme is correct, because nothing was ever racing it.
