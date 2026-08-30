---
name: cmk:test-resources
description: Use when the user asks to "share a testcontainer across tests", "speed up integration tests", "tests are slow because of container or database startup", "design test isolation", "why isn't my shared test fixture actually shared", or needs to design how a test suite shares an expensive resource (a container, a database, an external service) safely across tests a parallel runner may execute concurrently or in separate processes.
version: 0.1.1
---

# Test resources

Design how a test suite shares an expensive-to-start resource (a container, a database, an external service) across tests, without the sharing silently doing nothing or silently racing.

## Modes

**Init** (default) — design a new resource-sharing pattern for a test suite from scratch: verify the process model, pick the sharing shape, wire namespacing.

**Update** — revise an existing pattern after a new resource is added or the test runner changes, without re-deriving the process-model check from zero.

**Verify** — report-only audit against the checks under `## Verify`; never mutates.

## The core mistake this exists to prevent

A resource-sharing optimization is designed against an assumed execution model — usually "all tests in this binary or file run in one process" — that the actual test runner does not honor. Many modern parallel runners (Rust's `cargo-nextest`, for instance) execute **each test as its own OS process**, even when they compile into one binary. In-process shared state (a `static`, a lazily-initialized singleton, a process-wide connection pool) never persists across tests under that model — every test starts fresh, the "sharing" degrades silently into "works, but shares nothing," and no test fails to reveal it.

**Verify the runner's actual process model empirically before designing any in-process sharing.** Don't infer it from "these tests live in one file" or "this compiles into one binary." Log a process identifier from two tests in the same binary and confirm whether it repeats. Read `references/resource-sharing-under-parallel-runners.md` for the detection technique and the two valid sharing shapes once the real model is known.

## Two valid shapes, chosen by what's actually shared

- **Same process across tests** (thread-parallel runners: Jest workers reusing a worker, `pytest-xdist` within one worker, `cargo test` by default): an in-process singleton genuinely works. A lock held across the resource's async startup, keyed by a weak reference so the last user's drop tears it down, is the standard idiom.
- **Same external resource across processes** (nextest, or any runner that forks or execs per test): there is no shared process to hold a singleton in. The resource itself must be started once *outside* the test run (by the harness or CI, never by test code) and every test process connects to it — which then requires per-consumer namespacing (below), because the processes cannot coordinate through memory.

Never assume which shape applies without checking. The wrong shape compiles, passes locally, and produces zero benefit — or a race — under the runner's real concurrency.

## Namespace by every scope that can race

Once a resource genuinely is shared across concurrent processes, every test still needs its own slice of it (its own database, bucket, or table), and the name carving out that slice must be unique across every scope that can race concurrently — not just the scope its naming counter happens to live in. A per-process counter restarts at zero in every fresh process; naming a shared resource by that counter alone is only safe if nothing else is racing it, which is false the moment two test processes hit the same shared server concurrently. Compose a process-unique discriminator with the counter. Read `references/resource-sharing-under-parallel-runners.md` for the naming idiom and an override-guard pattern for opting a test into the shared resource without an empty default being mistaken for a deliberate choice.

## Trust, but verify

- **Grep for prior art before inventing a pattern.** If another part of the codebase already talks to a shared external resource from tests, its naming and isolation scheme is either the answer or the counter-example to learn from — check before designing from scratch.
- **A negative-control or mutation test only proves what it can reach.** A test asserting "these two runs don't collide" is meaningless if the conditions it runs under structurally can't produce a collision — for instance, running locally against a private per-process fallback instead of the real shared resource the assertion is actually about. Run the negative control under the same resource-sharing conditions the real suite runs under, or it passes for the wrong reason.
- **A measured speedup proves the mechanism you changed only if you traced it there.** When a suite gets faster after a multi-part change, isolate which specific part moved the number before crediting any of them — a real win from one part can fully mask a second part that changed nothing. `cmk:cicd`'s cold-cache-poisoning trap is the same principle applied to CI caching instead of test resources.

## Verify

Report-only — never mutate:

- Every "shared resource" test pattern has been checked against the runner's real process model, not assumed from file or binary layout.
- Every name carved out of a resource shared across processes composes a process-unique discriminator with any per-call counter.
- Any override that redirects a test at an external resource is guarded so an empty or unset value can't be mistaken for a deliberate opt-in.
- A negative-control test for resource isolation runs under conditions where the collision it disproves is actually reachable.
