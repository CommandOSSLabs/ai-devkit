# Workflows

| Workflow | Purpose | Trigger |
|---|---|---|
| [`skill-lint.yml`](./skill-lint.yml) | Validates skill frontmatter/structure under `skills/**` | PR and push to `main` touching `skills/**`, `scripts/skill-lint.sh` |
| [`frontend-ci.yml`](./frontend-ci.yml) | Lints, type-checks, and builds the skills landing page | PR and push to `main` touching `skills/**` (data source), `app/**`, `components/**`, `lib/**`, `package.json` |
| [`deploy-frontend.yml`](./deploy-frontend.yml) | Deploys the skills landing page to Railway (`production`) | Automatically after `frontend-ci.yml` succeeds on `main`, or manual dispatch of a named commit |

## frontend-ci.yml

The landing page under `app/` reads skill data live from `skills/*/SKILL.md`
at build time (`lib/skills.ts`), so this workflow is path-filtered on
`skills/**` in addition to the app's own source — a skill added or edited
upstream must still fail the build if it breaks the frontend (missing
frontmatter, etc.), not just changes to `app/`.

This workflow is validation-only (`npm run lint`, `type-check`, `build`) and
never deploys. `deploy-frontend.yml` is a separate workflow, per `cmk:cicd`'s
deploy-and-release contract.

## deploy-frontend.yml

Ships a specific commit to the Railway `ai-devkit-fe` service in the
`production` environment.

- **Dispatch-against-ref, not branch-triggered promotion**: the workflow
  takes a commit SHA as input (via `frontend-ci.yml`'s `workflow_run` success
  event on `main`, or an explicit `workflow_dispatch`), never "whatever is
  currently at the tip of the branch." Re-dispatching a known-good SHA is
  how you roll back.
- Deploys with `railway up`, authenticated via `RAILWAY_TOKEN` — a Railway
  project token scoped to this project's `production` environment, stored
  only in the GitHub `production` Environment's secrets.
- One IaC/Railway environment (`production`) ↔ one GitHub Environment
  (`production`) ↔ this one deploy workflow.
