---
name: cmk:agent-instructions
description: This skill should be used when the user asks to "set up CLAUDE.md", "set up AGENTS.md", "agent instructions", "add engineering rules", "make the instructions thinner", or needs to establish or maintain a thin, multi-vendor root instruction file backed by on-demand engineering rules under docs/rules/.
version: 0.2.2
---

# Agent Instructions

Establish or maintain the root instruction file every agent vendor reads
before touching a repository, and the `docs/rules/` files it points into.
The file itself stays thin; standards grow in rules files loaded on demand.

## Thin-instructions doctrine

The root instruction file carries only: project identity, a layout map,
the 2-5 invariants that must never break, build/test commands, and
*conditional pointers* into `docs/rules/` ("writing tests? read
`docs/rules/common/testing.md`"). Detailed standards never live inline — they live
in a rules file, loaded only when the triggering task comes up. A rules
file's `Load when:` line means exactly that — read the file before acting
whenever the named situation applies; otherwise it stays unloaded. Load
when needed, never preloaded wholesale. Target
length: readable in one screenful-ish. When a section keeps growing, that is
pressure to extract a rules file and replace the section with a pointer, not
license to let the root file grow indefinitely.

## Multi-vendor mirroring

`CLAUDE.md` is the source of truth; `AGENTS.md` is a symlink to it
(`ln -s CLAUDE.md AGENTS.md`) so every vendor that reads its own filename —
Codex, OpenCode, and others — reads identical content with zero drift.
Vendor-specific mechanics (hooks, plugin manifests, tool-specific bindings)
never live in this file; they arrive separately, at whatever layer wires up
a given vendor, and stay out of the shared instructions entirely.

## Modes

**Init** (default) — seed `CLAUDE.md` from `references/claude-md-template.md`,
symlink `AGENTS.md` to it, and seed `docs/rules/common/` from the six rules
templates below. Never overwrite an existing `CLAUDE.md`; for each rules
topic file, follow the reconciliation rule below rather than skipping or
overwriting it outright.

**Update** — reconcile after a kit change: add new pointers or new rules
files, but never flatten or overwrite a project's own edits to a rule it has
since evolved. Confirm with the user before touching an existing file.

**Verify** — dry run; see `## Verify` below.

## Rules seeding

This skill seeds baseline content into the same `docs/rules/common/{topic}.md`
file set `cmk:rule` owns and evolves afterward — it never invents a parallel
vocabulary. Canonical target: `docs/rules/common/{topic}.md`. Doing initial
setup? Seed these six templates, each into the topic file its conditional
pointer names:

- Naming anything? `references/rules-naming.md` → `docs/rules/common/naming.md`
- Writing a doc comment? `references/rules-doc-comments.md` → `docs/rules/common/doc-comments.md`
- Writing tests? `references/rules-testing.md` → `docs/rules/common/testing.md`
- Committing or opening a PR? `references/rules-git-workflow.md` → `docs/rules/common/git-workflow.md`
- Adding or changing a CLI command? `references/rules-cli-surfaces.md` → `docs/rules/common/cli-surfaces.md`
- Any long-running or background work? `references/rules-agent-conduct.md` → `docs/rules/common/agent-conduct.md`

After seeding files into `docs/rules/common/`, add or refresh a row for each
seeded topic in `docs/rules/README.md` — the index `cmk:rule` maintains
afterward.

Each is seeded once as a ready-to-use starting point, not a frozen mandate —
the repository owns and evolves its copy afterward (`cmk:rule` maintains
rules going forward; this skill only seeds the baseline).

**Reconciling an existing target file.** If a target topic file already
exists (seeded earlier by this skill, by `cmk:docs`'s baseline scaffold, or
hand-written by the project), never silently skip it and never silently
overwrite it. Read it, compare it against the template, and propose a merge
that keeps every project-specific addition while upgrading the shared
baseline content the two files have in common. Report each of the six topics
as **seeded** (file didn't exist), **merged** (file existed and gained the
upgraded baseline alongside its own additions), or **kept** (file existed and
the user declined the merge) — with the reason — rather than reporting bare
success for a file that was actually left untouched.

## Template

Seeding or reconciling `CLAUDE.md`? Read `references/claude-md-template.md`
for the fenced template, its bracketed slots, the fixed lines every seed must
keep (the `.local/tmp/` scratch pointer, the `docs/rules/` pointer table, the
`docs/README.md` pointer), and the seeding instructions that follow it.

## Verify

Report-only — never mutate:

- `CLAUDE.md` exists and stays thin: no inline naming/testing/git/CLI
  standard that belongs in a rules file instead.
- `AGENTS.md` exists and is a symlink to `CLAUDE.md`, not a copy.
- `docs/rules/common/` is populated with at least the seeded topic files
  still referenced from `CLAUDE.md`.
- Every conditional pointer in `CLAUDE.md` resolves to a file that exists.
- The `.local/tmp/` scratch line is present in `CLAUDE.md`.
