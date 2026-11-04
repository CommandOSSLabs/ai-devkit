# cmk:agent-instructions

## What
Skill that establishes or maintains the root instruction file every agent
vendor reads (`CLAUDE.md`, mirrored to `AGENTS.md` via symlink) as a thin,
progressive-disclosure entry point — identity, layout map, invariants,
commands, and conditional pointers into `docs/rules/` — backed by seven
ready-to-seed engineering-rules templates.

## Approach
`CLAUDE.md` stays readable in one screenful-ish; growth pressure goes into a
`docs/rules/common/{topic}.md` file loaded on demand, never into the root
file itself. `AGENTS.md` is a symlink, not a copy, so every vendor reads
identical content with zero drift. Init/Update/Verify modes mirror
`cmk:docs`: init seeds the template, the symlink, and the rules templates;
update reconciles new pointers and files without flattening a project's own
edits to a rule it has since evolved; verify reports only. This skill seeds
baseline content into the same `docs/rules/common/` file set `cmk:rule` owns
— never a parallel vocabulary — so an existing target topic file is merged
(baseline upgraded, project additions kept) rather than silently skipped or
overwritten; `cmk:rule` maintains every topic file going forward.

## Where
- Skill body: `skills/agent-instructions/SKILL.md` — sections `Thin-instructions
  doctrine`, `Multi-vendor mirroring`, `Modes`, `Rules seeding` (canonical
  target and reconciliation rule), `Template`, `Verify`.
- `references/claude-md-template.md` — the fenced `CLAUDE.md` template with
  bracketed slots and seeding instructions.
- The seven rules templates, each seeded into `docs/rules/common/` under the
  matching topic name:
  - `references/rules-naming.md` — naming anything → `naming.md`.
  - `references/rules-doc-comments.md` — writing a doc comment → `doc-comments.md`.
  - `references/rules-testing.md` — writing tests → `testing.md`.
  - `references/rules-git-workflow.md` — committing or opening a PR → `git-workflow.md`.
  - `references/rules-cli-surfaces.md` — adding or changing a CLI command → `cli-surfaces.md`.
  - `references/rules-agent-conduct.md` — long-running or background work → `agent-conduct.md`.
  - `references/rules-untrusted-input.md` — reading anything the repository
    didn't author → `untrusted-input.md`.
- Canonical `docs/rules/common/` topic set (shared vocabulary with
  `cmk:rule`): `skills/rule/references/rule-conventions.md`.
- Eval scenarios: `skills/agent-instructions/eval.json`.
