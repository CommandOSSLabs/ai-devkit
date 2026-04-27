# CI

## What
GitHub Actions workflow that runs on PRs and pushes to `main`. Its job is to verify skills are in sync across distribution paths.

## Where
- Workflow: `.github/workflows/skills-sync-check.yml` — job `check-sync`, step "Verify skills are in sync".
- Trigger paths it watches: `.agents/skills/**`, `.claude/skills/**`, `scripts/sync-skills.sh`, and the workflow file itself.
- The check command: `bash scripts/sync-skills.sh check` — referenced by the workflow but the script is not currently present in the repo tree, so the check will only fire once that script lands.
