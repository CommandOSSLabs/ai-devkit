# Project-docs layer recipe

Load this file **only when Decision I (Project-docs layer) is offered**.

Explainer: large or long-lived projects can add an optional repo-level layer above the feature workflow — a product vision (`docs/requirements/vision.md`), an IDed architecture-invariant spine (`docs/design/`), and engineering guidelines (`docs/requirements/guidelines.md`), all authored by `cmk:vision`. When these exist, `cmk:scope`, `cmk:design`, `cmk:delivery-spec-plan`, `cmk:delivery-build`'s `references/continuous.md`, and `cmk:delivery-review` consult them; when they do not, nothing changes. Small repos should decline — it can be added later with `/cmk:vision`.

If **Yes**: note it for Step 4 (seed the three docs + the Agent-skills line). If `docs/agents/project.md` or an existing `CLAUDE.md`/`AGENTS.md` already carries engineering guidelines, offer to migrate them into `docs/requirements/guidelines.md`, leaving a pointer behind.
