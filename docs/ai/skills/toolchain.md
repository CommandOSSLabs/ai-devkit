# cmk:toolchain

## What
Skill that establishes or audits a repo's toolchain: an explicit, unambiguous
role for every tool (one runtime for repo-owned scripts, one package manager
per ecosystem, one formatter/linter per language), checked-in runtime version
pins that CI and local setup both read, single-root-per-ecosystem workspace
config, and a baseline gitignore.

## Approach
Tool roles are declared, not inferred — recorded in a thin agent-instructions
commands section or a `docs/rules/` entry, with product packages keeping
their documented choices unless a migration explicitly includes them and no
ecosystem ever gaining a second lockfile. Workspace shape itself defers to
`cmk:project-layout`; this skill covers pins, role assignment, and the
gitignore baseline. The gitignore reference groups entries by concern (
worktree-local root, dependency dirs, build outputs, env-file policy, editor/
OS noise, AI working-artifact scratch, logs/local databases) with a stated
rationale per group so a repo prunes rather than copies wholesale. `.local/`
is always ignored — full ownership of that directory is `cmk:local-stack`'s.
Ends with a `## Verify` section for report-only checks a caller can run
against a target repo.

## Where
- Skill body: `skills/toolchain/SKILL.md` — sections `Explicit tool-role
  assignment`, `Runtime pins`, `Workspace config`, `gitignore baseline`,
  `Verify`.
- `references/gitignore-baseline.md` — the annotated baseline gitignore,
  grouped by concern with a per-group rationale.
