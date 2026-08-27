# CLAUDE.md template

Load when: seeding or re-seeding the root instruction file (`CLAUDE.md`,
symlinked as `AGENTS.md`) for a repository that doesn't have one yet, or
whose existing one has grown past a screenful.

```markdown
# CLAUDE.md

[project identity: one paragraph — what this repository is, what it builds,
and the one or two things an unfamiliar reader most needs to know before
touching it]

## Layout

[layout map: role-first top-level directories and what each holds — the
actual directories in this repository, not a hypothetical set]

## Invariants

[invariants: the 2-5 things that must never break — e.g. a wire format
pinned across languages, a stable public identifier, a consensus-critical
name — stated as "never do X" rather than general advice]

## Build & test

[build & test commands: the commands a fresh checkout runs to build and test
the whole repository, plus any per-package equivalents worth naming]

## Rules

Detailed standards live in `docs/rules/common/{topic}.md` (or a
language/framework subfolder), loaded only when the matching task comes up:

| Doing this? | Read |
|---|---|
| Naming anything | `docs/rules/common/naming.md` |
| Writing a doc comment | `docs/rules/common/doc-comments.md` |
| Writing tests | `docs/rules/common/testing.md` |
| Committing or opening a PR | `docs/rules/common/git-workflow.md` |
| Adding or changing a CLI command | `docs/rules/common/cli-surfaces.md` |
| Long-running or background work | `docs/rules/common/agent-conduct.md` |

[add a row per every other file already present in `docs/rules/common/` (a
pre-existing baseline topic this skill didn't seed, or a project- or
language-specific rules file) so it stays reachable from `CLAUDE.md`; remove
any row above whose file was not seeded]

## Documentation

Start at `docs/README.md` for how the rest of the documentation tree is
organized and when to read each part of it.

When the entry skill is unclear, read `docs/guides/on-ramps.md` — one table
from situation → `cmk:*` skill. Do not invent a second router.

## Scratch

Agent scratch and temporary files go under `.local/tmp/`, never a system
temp directory or an ad-hoc `tmp/`.
```

## Seeding instructions

- Fill every bracketed slot from evidence already in the repository — actual
  directories, actual commands read from a package manifest or CI config,
  actual invariants stated by an existing design doc or ADR — never from
  aspiration about what the repository should eventually look like.
- Every pointer row in the rules table must resolve to a file that exists at
  seed time. Seed the matching rules file first (see the six templates
  alongside this one), then add its row; never add a row for a file the seed
  step didn't create.
- Drop a row entirely rather than pointing it at a file that doesn't exist —
  a dangling pointer is worse than a missing rule.
- Add a row for every other file already present in `docs/rules/common/`
  too, not only the six this skill seeds — a pre-existing baseline topic
  (for example one scaffolded earlier by a docs-setup pass) is unreachable
  from `CLAUDE.md` if it never gets a row, even though the file itself is
  fine.
- Keep the fixed lines (`docs/README.md` pointer, `.local/tmp/` scratch line)
  verbatim; they are part of the interface other tooling expects to find.
- If the result no longer fits a screenful-ish, that is a signal to extract
  another rules file and replace the inline text with a pointer row — not to
  leave the extra detail in `CLAUDE.md`.
