---
name: cmk:cicd
description: This skill should be used when the user asks to "set up CI", "speed up CI", "add a deploy workflow", "structure GitHub Actions", "self-hosted runners", "run CI locally", "JIT runner", "protect the main branch", "add security scanning", "scan for vulnerabilities", or needs to structure CI, deployment, and policy automation as composable host-runnable scripts that GitHub Actions only automates.
version: 0.4.0
---

# CI/CD

Structure a repo's GitHub Actions automation into three concerns that stay
separated: what validates every change, what ships a specific commit
somewhere, and what gates or authenticates either one.

## Modes

**Init** (default) — stand up the path-filtered CI pipeline, its security
scans, per-environment deploy workflows, policy gates, and the workflows
README.

**Update** — add, rename, or retire a workflow; update the README
table and required checks in the same change.

**Verify** — report-only audit against the checks under `## Verify`;
never mutates.

## Three facets, one split

- **CI structure** — one path-filtered validation pipeline gating everything
  that runs on a push or PR, security scans included. Read
  `references/ci-structure.md` when setting up or speeding up CI, and
  `references/security-scanning.md` when adding or gating a scan.
- **Deploy & release** — dispatch-against-ref deployment of a reviewed commit
  to a named environment, plus release integrity for anything irreversible.
  Read `references/deploy-and-release.md` when adding or changing a deploy or
  release workflow.
- **Policy & auth** — required-check gates, branch-protection rulesets, and
  automation credentials. Read `references/policy-and-auth.md` when wiring a
  gate or an automation identity.

Never fold validation and deployment into one workflow: a push that only
changes docs must not queue behind a deploy, and a deploy must never
accidentally run on every push that happens to touch the workflow file.

## Scripts are the workflow

GitHub Actions is a composer. The steps themselves are independently
invocable scripts (TypeScript + bun, or the repo's existing runtime)
that run on a development machine, a JIT self-hosted runner, or hosted
compute with the same behavior. Read `references/host-runnable.md` when
adding a job, a runner, choosing a script language, extracting a fat
`run:`, or reproducing a CI failure. This is not a local-only mindset:
local, AWS, GCP, and production are profiles over one production-ready
path (`cmk:infra`, `cmk:local-stack`). JIT concurrent-job count,
language, extract, and mutate-gate rules are `references/host-runnable.md`;
attested packing is `cmk:enclave`.

## GitHub ↔ IaC mapping is this skill's contract

`cmk:infra` names environments as first-class, tool-neutral entities
(`production`, `staging`, `dev`, `canary`, plus ephemeral per-effort stacks)
and requires each to have a deploy path; this skill specifies that path. The
contract is **1:1:1**: every IaC stack pairs with exactly one GitHub
Environment of the same name and exactly one deploy workflow that targets it.
Secrets live only in that protected GitHub Environment, never in
repository-wide secrets or plain variables. Read `cmk:infra` for the
environment vocabulary itself; read `references/deploy-and-release.md` here
for how the pairing is wired.

## `workflows/README.md` is the operating doc

Every workflow gets one row in a table at `.github/workflows/README.md`:
name, purpose, and trigger. A workflow with a non-obvious contract (a release
gate's promotion rule, a reconciliation job's opt-in variable) gets its own
subsection below the table. Adding, renaming, or retiring a workflow updates
this table in the same change — it is the first thing a reader or another
agent opens to learn what automation exists, not a changelog reconciled
later.

## What this teaches vs. what a project owns

This skill teaches shapes and the traps around them — never a frozen workflow
catalog to copy verbatim. Recognize and avoid: **cold-cache poisoning** (a
scheduled cold job whose own setup step silently re-warms a shared cache, so
the regression it exists to catch can no longer show up); **skipped-job-
reports-success** (a path-filtered job that didn't run still reports a green
check, so the gating job itself, not the per-area jobs, must be what's
required); **empty-scan-reads-as-clean** (the same failure one level in — a
scanner missing its binary, its credentials, or its ruleset returns zero
findings, which is indistinguishable from a passing scan, so coverage must
be reported separately from findings); **workflow-token-doesn't-trigger-CI**
(automation that pushes with the built-in workflow token produces commits
that never fire downstream CI, silently leaving a rewritten ref
unverified); **speedup misattribution** (a
multi-part change to CI's wall-clock cuts the total, and every part gets
credited — but tracing the win to its actual cause can reveal that one part
did all of it and a sibling part is silently inert, contributing nothing
while looking identical to the part that worked — isolate which change
moved the number before crediting any of them; `cmk:test-resources`
covers that trap one layer down); **evidence-floor negation** (a
test-evidence gate that scans for `fail` treats `0 fail` and
`fail-closed` as a non-passing claim); **composer-contract drift**
(extracting a fat `run:` into a script leaves YAML-body pins and path
filters on the old site — raising the line-count baseline is not the
fix).

Projects own: which area jobs exist and their path filters; runner labels and
pool sizing; which policy gates are enabled; deploy-leg composition; label
names, schedules, and cache backends; which checks become required in the
ruleset.

## Verify

Report-only — never mutate:

- Exactly one path-filtered CI workflow exists, with a required
  change-detection job every other CI job depends on.
- Every deployable has exactly one deploy workflow, and it takes a commit SHA
  and a target environment as explicit inputs — never an implicit
  branch-only trigger for anything promotable.
- Required checks are pinned by name in a branch-protection ruleset and match
  actual workflow job names — no drift between the two.
- No long-lived cloud credential sits in a secret where OIDC federation is
  available.
- A secret-scanning job runs on every pipeline invocation, not gated on
  changed paths, and the dependency scan also runs on a schedule.
- A scan that could not run fails its gate; the exit code for incomplete
  coverage is distinct from the one for a clean run.
- Every scan suppression carries a reason and an expiry, and an expired one
  fails the gate.
- `.github/workflows/README.md` lists every workflow and is current with the
  workflows on disk.
- A claimed speedup names the specific job, step, or mechanism it traces to —
  not just a before/after total — so a sibling change that contributed
  nothing doesn't ride along uncredited and unverified.
- Jobs that humans or agents can run on a development machine have a
  script entry point the workflow only invokes.
- Those scripts support Linux and macOS on amd64 and arm64, or fail
  closed with a stated reason.
- A JIT host registration names how many concurrent jobs it will run.
- Programmable workflow steps are TypeScript (or the repo's chosen
  runtime); remaining shell is host bootstrap only.
- A mutating host-runnable script refuses without an explicit confirm
  or a documented CI environment variable.
