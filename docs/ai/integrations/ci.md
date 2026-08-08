# CI

## What
ai-devkit ships one workflow, `Skill Lint`, that runs `scripts/skill-lint.sh`
against `skills/*/SKILL.md` and `skills/*/references/*.md` on every pull
request and on push to `main`, path-filtered to `skills/**`,
`scripts/skill-lint.sh`, and the workflow file itself. The script lists every
violation before exiting non-zero rather than stopping at the first. It
checks five groups: frontmatter validity (delimiter lines, key order, the
`name`/`version` shapes, name-to-directory match), the SKILL.md size budget
(≤150 lines, with an allowlist for pre-existing exceptions), dangling
references (every `references/<file>.md` mention resolves to a real file and
every reference file is mentioned, including cross-skill citations and every
`cmk:<name>` citation resolving to a real skill directory), cross-package
paths (no `../` outside two allowlisted pre-existing files), and `eval.json`
validity (parses as JSON).

The sync-check CI pattern — a check-only validator that byte-compares vendor
adapter bodies against the adapter template (and adapter frontmatter against
the canonical skill) in a consuming repo — is defined by `cmk:agent-vendors`.
Upstream baseline tracking for vendored skills is defined by `cmk:sync`.

## Where
- Workflow: `.github/workflows/skill-lint.yml`.
- Lint script: `scripts/skill-lint.sh`.
- Sync-check CI convention: `skills/agent-vendors/references/sync-check-ci.md`.
- Upstream baseline (`.agents/skills.lock`) format: `skills/sync/references/skills-lock.md`.
