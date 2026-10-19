<!-- From cmk delivery-pipeline 0.5.3 `engineering-principles.md` (ADR 0001). -->
# Production readiness

Every change is designed, built, reviewed, and shipped as something that
will run in production, not something that merely passes tests. One
checklist, applied proportionally to blast radius — a docs-only change
skips it; anything touching runtime behavior, contracts, storage, or infra
runs every relevant line:

- **Failure modes** — what breaks when inputs are wrong, dependencies are
  down, or operations run twice; errors handled, surfaced, recoverable.
- **Config and secrets** — new knobs documented, defaults safe, secrets
  never in code or logs.
- **Migrations and compatibility** — storage, wire, and API changes carry
  a migration story, including any consensus/wire invariants the repo
  declares.
- **Observability** — the logs and metrics needed to operate and debug it.
- **Rollout and rollback** — how it deploys, reverts, and what breaks if
  half the system runs the old version.
- **Performance and limits** — hot paths measured or bounded; queues,
  buffers, and retries have limits.
- **Runbooks and docs** — operational impact lands in `docs/runbooks/` and
  `docs/design/` in the same change.

The plan's `## Production readiness` section takes each relevant line: the task that
covers it, or an **accepted gap** with its reason. Review audits against that section, and
ship carries the evidence in the PR with the accepted gaps named.
