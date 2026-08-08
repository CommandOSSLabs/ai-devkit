# Scratch-repo end-to-end validation of `cmk:repo-setup` init

**Date:** 2026-08-09
**Kit revision validated:** `a42c6f57f3c7e159fc9215759a24011fb1527db8`
(branch `phase-e-validation-polish`); one fix landed mid-run, ending revision
`18584917646ad682481537632793f8b5c7a32f11`.

## What this is

An agent played the role of a community user's agent applying
`skills/repo-setup/SKILL.md` — the `cmk:repo-setup` init flow — to a
brand-new, empty scratch repository, following the on-disk skill text
literally: no prior knowledge of intent, only what the files said. The goal
was to find where the skills are wrong, ambiguous, or impossible to follow,
not to demonstrate a clean run.

The scratch repo lived outside this repository (a disposable local seed with
one `git init` commit adding a single TypeScript module) and is not part of
this repository's tree. Every deviation, ambiguity, missing instruction, or
contradiction hit along the way is recorded below as a defect, whether or
not it blocked progress.

## Facets run, in the order `skills/repo-setup/SKILL.md` specifies

| Facet | Outcome |
|---|---|
| `cmk:project-layout` | Applied |
| `cmk:toolchain` | Applied |
| `cmk:docs` | Applied (init) |
| `cmk:agent-instructions` | Applied (init) |
| `cmk:mcp-config` | Skipped — no tracker, no multi-language semantic-navigation need, no library needing versioned docs lookup; the skill explicitly allows zero servers |
| `cmk:local-stack` | Skipped — no service topology, nothing to run for a one-file library |
| `cmk:infra` | Skipped — no deployable, no cloud target |
| `cmk:cicd` | Skipped — no remote, no deployable, no CI runner target |
| `cmk:agent-vendors` | Applied (init) — vendored one skill, generated one adapter |
| `cmk:sync` | Baseline mode exercised as part of the vendoring step |

The `cmk:agent-vendors` facet's vendoring flow was exercised concretely, not
just read: one skill (`cmk:toolchain`) was vendored into
`.agents/skills/cmk-toolchain/`, one adapter-mirror vendor's adapter (Claude
Code) was generated from `references/adapter-template.md`'s short-form
template, and a `.agents/skills.lock` baseline entry was recorded per
`skills/sync/references/skills-lock.md`'s format. The generated adapter was
independently re-derived from the template file and byte-compared
(`diff`/`cmp`) against what was written — a clean match, confirming
"byte-exact" holds in practice, not just in wording.

The `cmk:toolchain` facet's output was exercised functionally as well as
structurally: install, format-check, lint, and typecheck all completed with
exit code 0 (see the per-check table below), and the vendored skill copy was
confirmed still byte-identical to its source after running the repo's own
formatter over everything else (a formatter-ignore rule protects vendored,
hash-pinned content from being silently rewritten).

## Defects found

1. **Open, assumption made.** `skills/project-layout/SKILL.md` gives a
   placement rubric ("what is its role? does a role-area already own
   something like it? is it shared? is it a test package? is it externally
   governed?") but no worked guidance for a repo whose only file fits none
   of `ui/`, `backend/`, `cli/`, `contracts/` cleanly — a standalone
   exported function with no consumer context yet. Assumption made: treated
   it as a shared library and placed it at `libs/hello/src/hello.ts`, the
   closest fit among the named roles. Left open because the rubric's silence
   on this case is a documentation gap, not a wrong instruction to correct
   inline.

2. **Fixed in this revision.** `cmk:agent-instructions` instructs adding a
   row to `docs/rules/README.md`'s index for each seeded rules topic, but
   `cmk:docs`'s own scaffold template for that file had no table to hold
   such rows — one facet assumed a structure the facet that creates the file
   never provided. Fixed by adding a `## Topics` section to the
   `docs/rules/README.md` scaffold in
   `skills/docs/references/scaffold-manifest.md`, with the explanatory
   sentence about how the table fills in kept as manifest prose above the
   fenced payload rather than as a comment inside content the manifest ships
   verbatim (the payload block is documented as "exact content for every
   file the scaffold owns," so a comment inside it would ship into every
   scaffolded repo's checked-in file). This repository's own `docs/`
   dogfoods the scaffold (`docs/ai/skills/docs.md` names it the live
   example), so its own `docs/rules/README.md` got the same `## Topics`
   section, populated with a row per existing `docs/rules/common/` file
   (Coding Style, Git Workflow, Patterns, Security, Testing) — otherwise
   `cmk:docs`'s own Verify, run against this repository, would have reported
   the divergence the fix just introduced. Re-verified against the scratch
   repo: the six rows `cmk:agent-instructions` adds now have a well-formed
   home, and re-verified against this repository: the corrected manifest and
   this repository's own scaffolded file now agree in structure (see
   Evidence).

3. **Open.** `skills/agent-vendors/references/vendored-layout.md` instructs
   repos to keep an explicit list of vendor directories that must not exist,
   but never specifies where that list lives or what shape it takes —
   unlike the upstream lock file, which has a fully specified path and
   schema. A repo that needs to declare an actual unsupported vendor has
   nowhere the skill tells it to write that down. Not fixed here because the
   right artifact is a design decision for the skill's maintainers, not a
   one-line correction; this scratch repo's own run wasn't blocked by it,
   since nothing needed to be declared unsupported.

4. **Open, assumption made.** The six `agent-instructions` rules reference
   files each open with an unfenced line describing when to load the
   reference, directly followed by the actual rules content, with nothing
   delimiting "meta commentary" from "content to seed" — unlike the
   `CLAUDE.md` template, which fences its copyable payload separately from
   surrounding prose. It is genuinely ambiguous whether that opening line
   belongs in the seeded rules file. This run treated it as meta and
   stripped it, by analogy with the fenced convention used elsewhere, and
   records that as an assumption rather than a settled fact. Left open
   because both readings are defensible.

5. **Open, minor.** Six of the nine repo-setup facets have no explicit modes
   section (Init/Adopt/Update/Verify) the way four others do; an agent has
   to infer mode-specific behavior from prose alone for those six. This
   didn't block the run — those six are audit/decision guidance rather than
   file-scaffolding, so the same guidance applies regardless of mode — but
   it's an inconsistency in how thoroughly each facet documents its own
   behavior.

No other dangling references, contradictions, or impossible verify checks
were found across the nine facets exercised or skipped: every
`references/*.md` pointer named by every facet's `SKILL.md` resolves to a
file that exists.

## Verify results, per facet, per check

### `cmk:project-layout`

| Check | Result |
|---|---|
| Every top-level product directory names a role | PASS — `libs/` |
| Exactly one workspace/lockfile per ecosystem, at root | PASS — one `pnpm-workspace.yaml`, one `pnpm-lock.yaml` |
| No library imported by 2+ role-areas while living in one | PASS (N/A — single package) |
| Private test packages own their own runtime config | PASS (N/A — no `tests/`) |
| `external/` packages have baseline lockfile + round-trip | PASS (N/A — no `external/`) |
| `scripts/` root holds only stable public wrappers | PASS (N/A — no `scripts/`) |

### `cmk:toolchain`

| Check | Result |
|---|---|
| `.local/` is ignored | PASS |
| Version file exists per runtime, matches workspace config | PASS — `.nvmrc`=24, `engines.node`>=24, `packageManager` pinned |
| No ecosystem has more than one lockfile | PASS |
| Every declared tool role maps to exactly one tool | PASS — pnpm/prettier/eslint, recorded in `CLAUDE.md` |
| Formatter/linter configs live at workspace root | PASS |
| `pnpm install` | PASS — exit code 0 |
| `pnpm run format` (Prettier `--check .`) | PASS — exit code 0, "All matched files use Prettier code style!" |
| `pnpm run lint` (ESLint) | PASS — exit code 0, no problems reported |
| `npx tsc --noEmit` | PASS — exit code 0, no output |

### `cmk:docs` (Verify mode / Output criteria, per repo-setup's own special-case for this facet)

| Check | Result |
|---|---|
| Every directory has exactly one `README.md` | PASS |
| `docs/README.md` → per-directory chain intact | PASS |
| Templates directory has all baseline templates | PASS — 3/3 (`requirements.md`, `design.md`, `adr.md`) |
| Init mode never modified an existing file | PASS (N/A — fresh scaffold) |
| Connectedness: no orphans / no dangling links | PASS — automated link-check across every `.md` file found one hit, a bracketed `<topic>` placeholder inside `docs/templates/requirements.md` itself, not a real dangling link |

### `cmk:agent-instructions`

| Check | Result |
|---|---|
| `CLAUDE.md` exists and stays thin | PASS — 47 lines |
| `AGENTS.md` is a symlink to `CLAUDE.md`, not a copy | PASS — `readlink AGENTS.md` → `CLAUDE.md` |
| `docs/rules/common/` populated with referenced topics | PASS — 6/6 (naming, doc-comments, testing, git-workflow, cli-surfaces, agent-conduct) |
| Every conditional pointer resolves | PASS — 6/6 files exist |
| `.local/tmp/` scratch line present | PASS |

### `cmk:agent-vendors`

| Check | Result |
|---|---|
| Canonical skill has valid frontmatter | PASS — 3-field, name/description/version |
| Adapter-mirror vendor has exactly one adapter per canonical skill, byte-identical frontmatter + template-output body | PASS — independently re-derived expected output from the template and byte-compared: `diff` reported no difference, `cmp` reported no difference |
| No adapter for a nonexistent skill | PASS (trivial — only `cmk-toolchain` exists and only it has an adapter) |
| Declared-unsupported vendor roots absent | PASS (vacuous — none declared; see Defect #3) |
| `AGENTS.md` symlink target | PASS |
| Cross-package path rule (no `../` escapes) | PASS — `grep -rn '\.\./' .agents/skills/ .claude/skills/` found none |

### `cmk:sync` (baseline mode only)

| Check | Result |
|---|---|
| `.agents/skills.lock` exists and parses | PASS — parsed successfully as TOML |
| One lock entry per vendored skill dir, and vice versa | PASS — 1/1 (`cmk:toolchain` ↔ `.agents/skills/cmk-toolchain`) |
| Each entry carries name, version, content hash | PASS — `upstream_ref`, `upstream_sha`, `content_hash` all present |
| Local-amendment marking (`## Project adaptations`) | PASS (N/A — freshly vendored, no amendments yet) |
| Drift-candidate reporting | PASS (N/A — no upstream releases exist to compare against) |

## Final scratch-repo tree

`find . -not -path './.git/*' -not -path './node_modules/*' -not -path './libs/*/node_modules/*' | sort`
(`node_modules/` excluded — regenerated from `pnpm-lock.yaml`, per the
toolchain facet's own gitignore baseline; nothing under it is source):

```
.
./.agents
./.agents/skills
./.agents/skills.lock
./.agents/skills/cmk-toolchain
./.agents/skills/cmk-toolchain/references
./.agents/skills/cmk-toolchain/references/gitignore-baseline.md
./.agents/skills/cmk-toolchain/SKILL.md
./.claude
./.claude/skills
./.claude/skills/cmk-toolchain
./.claude/skills/cmk-toolchain/SKILL.md
./.git
./.gitignore
./.nvmrc
./.prettierignore
./.prettierrc.json
./AGENTS.md
./CLAUDE.md
./docs
./docs/ai
./docs/ai/README.md
./docs/decisions
./docs/decisions/README.md
./docs/design
./docs/design/README.md
./docs/guides
./docs/guides/README.md
./docs/knowledge
./docs/knowledge/README.md
./docs/README.md
./docs/reports
./docs/reports/README.md
./docs/requirements
./docs/requirements/README.md
./docs/research
./docs/research/README.md
./docs/rules
./docs/rules/common
./docs/rules/common/agent-conduct.md
./docs/rules/common/cli-surfaces.md
./docs/rules/common/doc-comments.md
./docs/rules/common/git-workflow.md
./docs/rules/common/naming.md
./docs/rules/common/README.md
./docs/rules/common/testing.md
./docs/rules/README.md
./docs/runbooks
./docs/runbooks/README.md
./docs/templates
./docs/templates/adr.md
./docs/templates/design.md
./docs/templates/README.md
./docs/templates/requirements.md
./eslint.config.js
./libs
./libs/hello
./libs/hello/package.json
./libs/hello/src
./libs/hello/src/hello.ts
./package.json
./pnpm-lock.yaml
./pnpm-workspace.yaml
./tsconfig.json
```

## Evidence

- Every applied facet's `## Verify` checklist passed against the scratch
  repo, per-check, as tabulated above; skipped facets' skip reasons were
  recorded at plan time rather than silently omitted, per
  `cmk:repo-setup`'s own applicability-judgment rule.
- The generated Claude Code adapter matched an independently re-derived
  expected output byte-for-byte (`diff` and `cmp` both reported no
  difference).
- `pnpm install`, `pnpm run format` (Prettier), `pnpm run lint` (ESLint), and
  `tsc --noEmit` all completed with exit code 0 against the seeded
  TypeScript module.
- A relative-link sweep across every markdown file in the scratch repo found
  no genuine dangling link; its one hit was a bracketed placeholder inside a
  template file, not a real reference.
- This repository's own `docs/rules/README.md` (the dogfooded scaffold
  instance `docs/ai/skills/docs.md` names as the live example) carries the
  same `## Topics` section the corrected manifest now scaffolds, populated
  with the five rules files that already exist under `docs/rules/common/` —
  confirmed by reading both files side by side after the fix.

## Disposition

One defect (#2) was fixed in this revision, including the follow-on
corrections needed to keep the fix from breaking this repository's own
dogfooded copy and from re-introducing the same meta-vs-content ambiguity
(Defect #4) inside the shipped payload. Four (#1, #3–#5) remain open,
recorded here rather than resolved unilaterally, since each requires a
design decision beyond what a single validation pass should settle on its
own.
