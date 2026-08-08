# cmk:cicd

## What
Skill that structures a repo's GitHub Actions automation into three
separated concerns: one path-filtered CI validation pipeline, deploy and
release workflows that ship a specific commit to a named environment, and the
policy gates plus automation credentials that govern both.

## Approach
CI structure: a `changes` job path-filters the diff and gates per-area jobs,
with concurrency-per-ref, ecosystem caching, config-selected runner tiers, and
a scheduled, deliberately cache-isolated cold-resolve job. Deploy and release:
`workflow_dispatch` inputs carry an explicit commit SHA and target
environment (dispatch-against-ref), a deploy orchestrator calls per-piece
`workflow_call` legs under two concurrency layers, and irreversible releases
add pinned-artifact reuse, provenance attestation, `always()` cleanup, and
read-back verification. Policy and auth: traceability and test-evidence gates
run as workflows, required checks are pinned by name in a branch-protection
ruleset with the change-detection job itself required, and automation uses
pinned actions, non-persisted checkout credentials, GitHub App identities
where pushes must trigger CI, and OIDC over static cloud keys. Specifies the
GitHub ↔ IaC 1:1:1 mapping (stack ↔ GitHub Environment ↔ deploy workflow)
that `cmk:infra` names but leaves to this skill to wire. Ends with a
`## Verify` section for report-only checks a caller can run against a target
repo.

## Where
- Skill body: `skills/cicd/SKILL.md` — sections `Three facets, one split`,
  `GitHub ↔ IaC mapping is this skill's contract`, `` `workflows/README.md`
  is the operating doc ``, `What this teaches vs. what a project owns`,
  `Verify`.
- `references/ci-structure.md` — the `changes` job/path-filter shape,
  concurrency and caching, config-selected runner tiers, deliberate
  cold-cache isolation, CI self-contract tests, label-gated diagnostics.
- `references/deploy-and-release.md` — validation-vs-deployment split,
  dispatch-against-ref inputs and what they buy (canary test deploy,
  rollback, ancestry-verified promotion), the GitHub ↔ IaC contract in full,
  orchestrator-plus-legs with two-layer concurrency, release integrity
  (pinned artifact reuse, attestation, `always()` cleanup, read-back
  verification).
- `references/policy-and-auth.md` — traceability and test-evidence gates,
  branch-protection ruleset contract, automation auth (pinned actions,
  non-persisted credentials, GitHub App vs. workflow token, OIDC), and
  critical-invariant verification as its own required job class.

## Links
- `cmk:infra` — names the environment vocabulary and requires a deploy path
  for each; this skill specifies and wires that path.
