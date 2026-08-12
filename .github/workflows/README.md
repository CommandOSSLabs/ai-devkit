# Workflows

| Workflow | Purpose | Trigger |
|---|---|---|
| [`skill-lint.yml`](./skill-lint.yml) | Validates skill frontmatter/structure under `skills/**` | PR and push to `main` touching `skills/**`, `scripts/skill-lint.sh` |
| [`frontend-ci.yml`](./frontend-ci.yml) | Lints, type-checks, and builds the skills landing page | PR and push to `main` touching `skills/**` (data source), `app/**`, `components/**`, `lib/**`, `package.json` |

## frontend-ci.yml

The landing page under `app/` reads skill data live from `skills/*/SKILL.md`
at build time (`lib/skills.ts`), so this workflow is path-filtered on
`skills/**` in addition to the app's own source — a skill added or edited
upstream must still fail the build if it breaks the frontend (missing
frontmatter, etc.), not just changes to `app/`.

**No deploy step yet.** This workflow is validation-only (`npm run lint`,
`type-check`, `build`). Railway auto-deploy is deferred until the UI is
finalized — adding it later means one new deploy workflow paired 1:1 with a
named Railway environment, per `cmk:cicd`'s deploy-and-release contract; it
should not be folded into this validation workflow.
