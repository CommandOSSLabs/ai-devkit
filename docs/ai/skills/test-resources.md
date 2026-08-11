# cmk:test-resources

## What
Skill that designs how a test suite shares an expensive-to-start resource
(a container, a database, an external service) across tests safely, when a
parallel test runner may execute those tests concurrently or in entirely
separate OS processes.

## Approach
Names the core mistake: an in-process shared-resource optimization (a
`static` singleton) is designed against an assumed execution model — "these
tests run in one process" — that many parallel runners (Rust's
`cargo-nextest`, for instance) don't honor, since they execute each test as
its own process. The fix is empirical, not assumed: probe the runner's real
process model before designing sharing. From there, two valid shapes exist —
a lock-across-startup singleton when tests genuinely share a process, or a
resource started once outside test code with per-consumer namespacing when
they don't. Namespacing must compose a process-unique discriminator with any
per-call counter, since a counter alone only disambiguates within the
process it lives in. Closes with three verification habits: check for prior
art before inventing an isolation pattern, run negative-control/mutation
tests under conditions where the failure mode they disprove is actually
reachable, and trace a measured speedup to the specific mechanism that
produced it rather than crediting every part of a multi-part change.

## Where
- Skill body: `skills/test-resources/SKILL.md` — sections `The core mistake
  this exists to prevent`, `Two valid shapes, chosen by what's actually
  shared`, `Namespace by every scope that can race`, `Trust, but verify`,
  `Verify`.
- `references/resource-sharing-under-parallel-runners.md` — the process-model
  detection probe, the lock-across-startup singleton shape, the
  process-id-plus-ordinal namespacing idiom, the two-flag override-guard
  pattern, and why a negative control has to run where the failure mode
  lives.

## Links
- `cmk:cicd` — the cold-cache-poisoning trap and the speedup-misattribution
  trap in its `What this teaches vs. what a project owns` section are the
  same "verify the mechanism, not the metric" principle applied to CI
  orchestration instead of a test suite's own resource model.
