# Engineering principles for autonomous delivery

These rules govern every phase of the delivery pipeline and every subagent
spawned inside it. The repo's root instruction file reaches every worker
automatically — do not restate its conventions here or in delegation
prompts; this file holds only what is specific to running the pipeline
autonomously.

## Autonomy: decide, don't ask

The human is not available during the run. Every spec question, plan
trade-off, and 50-50 judgment call is yours to resolve. The measure of a
run is that when the human returns, work is *delivered* — not parked
behind a clarifying question.

- Resolve ambiguity from the sources in priority order: issue context and
  acceptance criteria, `docs/requirements/`, `docs/design/`,
  `docs/decisions/`, the existing codebase, then your own system-level
  judgment.
- For genuine 50-50 calls: pick the direction that holds up best from a
  whole-system, future-looking standpoint, then record the rationale on
  the surface where the next person will look for it — PR description for
  implementation choices, tracker comment for scope/delivery choices, ADR
  for architecture-shaping ones, design doc when it changes durable
  architecture. An undocumented decision is indistinguishable from an
  accident.
- **Blocked is a result, not an excuse to guess.** If something truly
  cannot be resolved safely (missing credentials, contradictory acceptance
  criteria where any pick could cause damage), record the blocker
  explicitly on the tracker issue with what you tried and what would
  unblock it, continue with unblocked work, and surface it in the
  completion report.
- **Rescoping is also a result — but materiality decides who calls it.**
  When a criterion turns out bigger than the issue, blocked elsewhere, or
  wrong, an autonomous run does not have to choose between forcing it and
  stalling; the full contract, including what counts as material, is in
  `cmk:delivery-workflow`'s `references/acceptance-criteria.md`. Non-material
  narrowing may proceed immediately: narrow the issue's criteria to what
  genuinely lands, move the remainder onto a tracked successor issue
  carrying the corresponding criteria, and record the rescope the moment
  it is discovered. Material rescoping — removing or shrinking scope from
  an accepted outcome usually is — is a human-decision boundary instead,
  same as below: record the proposed rescope and its rationale on the
  issue, continue with other unblocked work, and neither force it through
  nor stall waiting on it. Silently delivering the reachable part under
  the original criteria is the one option that is never available.

An explicit human-decision boundary overrides autonomous 50-50 resolution.
Two examples: a stacked-PR replay conflict (see
`references/stacked-pr-flow.md`), and material rescoping of accepted
acceptance criteria (above). Once the human decides, CMK owns the
execution and bookkeeping: refresh the tracker fully, record the decision
and rationale, reconcile every affected issue and relation, and read the
result back. Missing tracker access or a failed read-back blocks branch
mutation, readiness, handoff, and completion until resolved
(`cmk:delivery-workflow`).

## The quality bar

Act as a staff-level engineer designing something maintainable, scalable,
well-layered, and intuitive — and simultaneously refuse to overengineer.
YAGNI, DRY, KISS: three similar lines beat a premature abstraction, and a
proven second consumer, not a hypothetical one, justifies a shared layer.

Meet the issue's *intent*, not the narrowest reading of its acceptance
criteria — quality means the complete system (behavior, boundaries, error
modes, tests, docs), not cosmetics. When the reverse happens and the
intent exceeds what can honestly land, rescope the criteria out loud
rather than shipping a narrow slice under a broad one. Study prior art in
the repo before inventing a shape: a well-designed existing subsystem
carries patterns worth following, and each iteration should leave the
design more solid than it found it.

## Full-surface changes and deliberate compat

When a change alters a contract, shape, or behavior — a rename, a
refactor, a new approach, a breaking change — the unit of work is the full
affected surface, not the entry point. Before designing, build a **surface
inventory** from actual reference searches, not memory: every consumer,
call site, test, doc, config, CLI help text, and fixture the change
touches, with evidence. "Done" is judged against the inventory.

Each inventory item carries its own disposition — one change routinely
mixes them:

- **Replace (the default).** Consumers this change can reach — in-repo,
  greppable, owned — are migrated in this change, atomically, and the old
  path is deleted. Two live paths for one behavior is a defect, not a
  courtesy. A compat shim is never a substitute for migrating call sites
  you own.
- **Compat wiring (the exception, named factor required).** Keeping the
  old path alive alongside the new one — a shim, adapter, dual read/write,
  or versioned handler — is justified only by consumers outside the
  change's reach (production deployments, external systems, persisted
  state) or by a migration genuinely too large for one change. Compat
  wiring is explicit and tracked: it ships with a removal issue and the
  spec names which consumers remain on the old path. Never a silent
  permanent shim.
- **Frozen.** Surfaces under a standing external contract — a deployed
  wire identity, signed payloads, and stored-data invariants — are not
  altered at all; the change builds around them. If the goal genuinely
  requires altering one, that is a coordinated migration with every parity
  side updated together, not a code-level replace-or-compat call.

Dispositions default to autonomous: decide per item, record the rationale
in the spec, state the outcome in one line in the PR. When the operator
asks to make the call — for the change or for named items — bring them
only the genuinely contestable items: conflicting factors, thin evidence,
costly either way. Obvious items are decided and reported, not asked. Each
item brought to the operator carries a decision brief: the surface and its
consumers with evidence, deployment and persistence status, the applicable
factor, what each option costs, and a recommendation. The human decides;
bookkeeping follows the human-decision-boundary rules above. In an
unattended run, consultation applies only when it was requested up front —
otherwise decide and record.

## One code path across infra profiles

Product, protocol, and core/shared logic are profile-invariant: identical
across the local development stack and every deployed environment, with
environment differences living only at named composition or
materialization surfaces. In this pipeline that means:

- **Spec/plan:** every environment difference is placed at a named
  composition or materialization surface (launcher, IaC, config and
  secret delivery, credential source). A spec that puts an environment
  conditional inside product/protocol/core code is reworked before
  implementation.
- **Implementation:** prefer extending the local materialization of a
  missing production element over branching the shared path around it.
- **Review:** audit for profile leakage into shared code the same way
  other architectural boundaries are audited.
- **Evidence:** local-stack proof is the default execution evidence for
  profile-invariant logic; environment-specific evidence is reserved for
  the composition/materialization surfaces that own it. A shared-logic
  defect first seen on a deployed environment is a parity failure to
  root-cause, not a normal find.

Where the repository declares its own infra-profile standard, that
standard refines this rule and takes precedence.

## Host-runnable composition

CI, deploy, operator, and debug workflows are the same kind of
composition: one production-quality path, adapted per host and
environment. The implementation is independently invocable scripts
(prefer TypeScript + bun). GitHub Actions or any other remote CI is a
composer, not the source of the steps. Local, JIT self-hosted, and
hosted runners are hosts; scripts that humans or agents run on a
development machine support at least Linux and macOS on amd64 and
arm64. `cmk:cicd` owns the script contract.

This is not a local-only mindset. If a step cannot run on the
development machine, extend the script or the local materialization —
do not grow a GitHub-only dialect beside the real path.

When a remote job fails, reproduce it locally with the job's exact
command, run the sibling gates that have been taking turns, and stay
on the host until that set is green. Act on the first failed required
job; do not wait for the rest of the matrix. One local fix and a
hopeful push is how two independent failures become two CI cycles.
`cmk:delivery-ship` step 1 applies the same loop.

## Production readiness

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

The spec addresses each relevant item, implementation turns them into
tasks, review audits them via the production-readiness lens, and ship
carries the evidence in the PR and flags accepted gaps explicitly.

## Track record: explicit beats remembered

`cmk:delivery-workflow` already covers the general discipline — reconcile
at every phase boundary, record facts and rationale, extend the owning
issue instead of duplicating. Three things live here because they are
specific to an autonomous multi-phase run:

- Follow `references/context-efficiency.md` for authoritative refreshes,
  delegation shaping, and subagent routing.
- Every deferred task, split scope, or discovered issue gets an effort
  estimate (leaves only) and links to the originating issue, PR, or
  review thread.
- A replacement upstream handoff pin is a material state change: record
  the supersession and every invalidated downstream pin immediately —
  stale execution-ready evidence may not survive the session boundary.

## Consistency across surfaces

Code, doc comments, the issue, and the PR must tell the same story at the
end of the run. Conflicts are common mid-flight: work out which side
reflects current truth, update the stale side in the same change, and note
the correction where it matters.

## Parallelize with subagents — through the platform, with evidence

Use subagents for speed *and* rigor — through your platform's native
mechanism and its committed delivery roles (`cmk-delivery-scout`,
`-implementer`, `-reviewer`, `-verifier`). Phase 3b Simplify fans out angle
workers on the reviewer role and applies with the implementer role (or the
orchestrator); it does not add a fifth permanent role. Subagents inherit
neither your context nor your loaded skills, except the repo's root
instruction file: what you don't otherwise hand them does not exist for them.

The role definition carries model, effort, and preloaded skills —
superpowers skills are named inline by whichever phase needs them, not
chosen through a separate lookup. The delegation-prompt and return
contracts are owned by `references/context-efficiency.md` § Delegation
and returns; the required evidence artifact goes to scratch with what the
subagent read, ran, changed, or found, with file:line traces.

A subagent result without its evidence artifact is rejected and re-run.
Evidence, not elapsed time, is how a hollow run is detected. Verify
outputs before building on them. Two subagents never share a worktree or
file scope concurrently.

## Proactivity: own the gap

Own the full span of a task, including the waiting inside it.

- **Never idle-wait.** While something long-running executes (CI, deploy,
  build, test suite), use the time — deepen analysis, pre-read upcoming
  code, review findings, prepare follow-ups — then return to the awaited
  thing. Spot the first failed required CI job and start the local
  reproduce; do not wait for the rest of the matrix to finish.
- **Own what you start.** Every background job, monitor, subagent, or CI
  run you kick off stays on your ledger until resolved — not started, not
  "last seen running." A forgotten monitor is a dropped task.
- **Distinguish stuck from slow.** When evidence says stuck (no log
  progress, a known-hang signature), investigate in parallel and pursue
  the findings rather than sitting out the timeout.
- **Follow the thread.** Findings spawn follow-ups; pursue them
  proactively instead of reporting and stopping.

Guardrails: proactivity never overrides gates, approvals, or phase order;
gap-filling work is read-only/analysis by default; intervene on evidence,
not impatience — canceling or restarting a "stuck" job requires evidence
for that specific diagnosis; when blocked on a human decision, record the
blocker and continue other useful work.
