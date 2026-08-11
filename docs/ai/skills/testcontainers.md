# cmk:testcontainers

## What
Skill that covers starting and sharing a throwaway service container
(Postgres, Redis, MinIO, or similar) from Rust test code via the
`testcontainers` crate — the Rust-crate-specific mechanics layer under
`cmk:test-resources`' generic sharing principles and `cmk:rust`'s test-runner
wiring. Carries no generic content of its own; everything here assumes both.

## Approach
Wrap container startup in a bounded retry with a per-attempt timeout and
backoff, since a Docker pull or start is the flakiest part of a test run and
a bare unretried `.start()` turns a transient hiccup into a spurious
failure. Keep the `ContainerAsync` handle alive for as long as anything
uses the container — its `Drop` is what stops the container, so it belongs
bundled inside whatever shared struct carries the connection info, not held
separately where something could drop it early. Read back host and mapped
port after start rather than assuming a fixed one. Maps directly onto
`cmk:test-resources`' two sharing shapes: testcontainers implements the
"same process" shape (a lock-across-startup singleton holding the
container) and is skipped entirely for the "same external resource" shape,
where a test instead connects to a CI-provided server — the two are
alternative branches, never both active for one test. Closes with a CI
prerequisite often discovered the hard way: a container runtime (Docker or
equivalent) must actually be available on whatever runs container-backed
tests.

## Where
- Skill body: `skills/testcontainers/SKILL.md` — single file, no
  `references/` split (content is narrow enough to stay self-contained):
  retry/backoff code, the container-guard-lifetime idiom, host/port
  readback, the two-shapes mapping, the CI prerequisite.

## Links
- `cmk:test-resources` — the generic sharing-shape and namespacing
  principles this skill implements in `testcontainers`-crate terms.
- `cmk:rust` — build/test/lint wiring, including the process-per-test
  runner note that motivates checking which sharing shape actually applies.
