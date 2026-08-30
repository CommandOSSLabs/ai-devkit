# Deploy and release

Mechanics for the deploy-and-release facet in `SKILL.md`, and the GitHub ↔ IaC
contract it specifies on behalf of `cmk:infra`.

## Contents

- [Validation and deployment are separate workflows](#validation-and-deployment-are-separate-workflows)
- [Dispatch-against-ref, not branch-triggered promotion](#dispatch-against-ref-not-branch-triggered-promotion)
- [The GitHub ↔ IaC contract, specified](#the-github-iac-contract-specified)
- [Deploy orchestrator plus legs](#deploy-orchestrator-plus-legs)
- [Release integrity](#release-integrity)

## Validation and deployment are separate workflows

The CI workflow validates; it never deploys. Each deployable thing gets its
own `deploy-<name>.yml`. Anything irreversible or high-consequence (a signed
release, an immutable package publish) gets its own manual-only release
workflow, separate again from routine deploys — a routine deploy can safely
re-run; a release cannot.

## Dispatch-against-ref, not branch-triggered promotion

A deploy or release workflow takes the commit to ship and the environment to
ship it to as explicit `workflow_dispatch` inputs — never "whatever is
currently at the tip of the branch":

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        type: choice
        # production is absent: it's reached only via Promotion below,
        # never dispatched to directly.
        options: [dev, staging, canary]
      commit:
        description: Full 40-character commit SHA
        required: true
        type: string
```

This buys three things directly from the input shape:

- **Deploy a reviewed branch to a lower environment** (canary) without
  merging first — the SHA doesn't have to be the branch tip.
- **Rollback** is re-dispatching a known-good SHA — no revert commit, no new
  merge; the workflow runs exactly the way it always does.
- **Promotion** to an environment that requires it verifies the dispatched
  SHA's exact ancestry against a recorded freeze commit before proceeding —
  promoting an unreviewed or out-of-order commit fails the workflow instead
  of silently shipping it.

## The GitHub ↔ IaC contract, specified

`cmk:infra` requires every environment to have a deploy path; this is that
path, exactly 1:1:1:

- One IaC stack (one `cmk:infra` environment) ↔ one GitHub Environment of the
  same name ↔ one deploy workflow whose `environment:` key targets it.
- The GitHub Environment is **protected**: required reviewers configured, and
  the person who requested the run is never also its approver.
- Non-secret config that varies per environment (region, sizing, feature
  flags) lives in that GitHub Environment's **variables**, under a naming
  contract consumers can rely on (a stable prefix, a documented suffix for
  environment-specific overrides) — never duplicated as inline workflow
  constants.
- Anything that grants access (a deploy signer's key, an API credential)
  lives in that GitHub Environment's **secrets**, scoped to it alone — never
  a repository-wide secret two environments would then share.
- Custody and funding routes (which account owns a deploy signer, which route
  funds it) are named as variables identifying the accountable owner, never
  embedded as literal credentials in workflow YAML.

## Deploy orchestrator plus legs

A product with several independently deployable pieces (a frontend, a
backend, an infra stack, several worker roles) gets one orchestrator workflow
that selects which pieces to run — a path-filter union on push, an explicit
input on manual dispatch — and calls each piece as a reusable `workflow_call`
leg:

```yaml
jobs:
  select: { ... }
  frontend:
    needs: [select]
    if: needs.select.outputs.run_frontend == 'true'
    uses: ./.github/workflows/deploy-frontend-service.yml
    with:
      environment: ${{ needs.select.outputs.environment }}
```

Legs that only build or read run in parallel; legs that mutate the same
deployed stack must not race. Use **two concurrency layers**: the
orchestrator itself holds a per-environment group so two dispatches against
the same environment serialize; separately, only the jobs that actually
mutate shared stack state (an apply, a publish) hold a second, narrower
per-environment "stack mutator" group, so read-only or build-only legs still
run in parallel while state-mutating legs queue behind each other:

```yaml
# Orchestrator-level:
concurrency:
  group: deploy-${{ inputs.environment || github.ref_name }}

# On the mutating leg only, distinct from the orchestrator's group:
concurrency:
  group: deploy-stack-${{ inputs.environment }}
```

## Release integrity

A release that is explicitly non-promotable (a live-environment test publish
off a working branch) is a first-class, clearly labeled state — not a
shortcut that looks identical to a real promotion in the logs.

- **Artifact reuse is pinned, never floating.** Reusing a prior release's
  output names the exact producing run id and a content digest, both
  verified before reuse; nothing resolves a "latest" tag.
- **Provenance attestation** on every published artifact, so consumers can
  verify what produced it.
- **`always()` cleanup** tears down any isolated credential or signer state
  the job created, whether it succeeded or failed — a failed release must not
  leave a temporary keystore lying around on the runner.
- **Read-back verification** re-reads what was actually published (the
  uploaded artifact, the on-chain or external record it produced) after
  publication completes, rather than trusting the local exit code alone.
