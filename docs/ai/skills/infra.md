# cmk:infra

## What
Skill that establishes or audits a repo's infrastructure-as-code layout:
isolated IaC packages under `infra/` (code-and-pipeline isolation between
independently deployable stacks), first-class environments (`production` /
`staging` / `dev` / `canary` plus ephemeral per-effort stacks), and where
cloud-provider specifics belong versus what stays tool-neutral.

## Approach
IaC packages are isolated by construction — no shared code or pipeline
wiring between independently deployable stacks, even similar-looking ones.
Each package owns one deployment concern and names its environments
explicitly rather than inferring them from ad-hoc config. Local topologies
that mirror a deployed environment are `cmk:local-stack`'s facet, not this
one; the 1:1:1 stack-to-environment-to-deploy-workflow mapping is
`cmk:cicd`'s facet, which this skill names and points to. Cloud-provider
choice and its resulting resources accumulate per-repo via `docs/rules/`,
never into the shared pattern. Tool-specific mechanics bind in as siblings —
Pulumi is the first binding. Ends with a `## Verify` section for report-only
checks a caller can run against a target repo.

## Where
- Skill body: `skills/infra/SKILL.md` — sections `` `infra/` holds isolated
  IaC packages ``, `One package per deployment concern; environments are
  first-class`, `Local stacks are a different facet`, `GitHub ↔ IaC mapping
  is `cmk:cicd`'s contract``, `Cloud-provider choice stays out of the
  upstream kit`, `Tool bindings`, `Verify`.
- `references/pulumi.md` — stack-per-environment `Pulumi.<env>.yaml` files,
  single-entry-point program layout with `pulumi.Config` and stack
  references (no cross-stack code imports), state-backend and
  secrets-provider trade-offs, and the config-vs-secret split.

## Links
- `cmk:local-stack` — worktree-safe local topologies that mirror an
  environment's shape.
- `cmk:cicd` — the GitHub-to-IaC deploy-workflow contract.
