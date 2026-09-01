# cmk:sync

## What
Skill that keeps a consuming repo's vendored generic skill layer
(`.agents/skills/cmk-*/`) current with upstream ai-devkit without flattening
local evolution. Vendored skills evolve in place; sync is a baseline-tracked
semantic three-way reconciliation, never a blind overwrite.

## Approach
`.agents/skills.lock` records, per vendored skill, the upstream skill name,
the upstream version (release tag or SHA), and the content hash of the
pristine upstream copy at vendor/sync time — the join key across upstream and
vendored sides is the frontmatter `name:`, not the directory name. Three
modes: **baseline** (record or refresh lock entries at vendor time or after a
completed sync, hashing the pristine upstream copy, never the local
adaptation), **sync** (the three-way reconcile: base = pristine copy at the
lock's recorded SHA, theirs = current upstream, ours = the repo's evolved
copy; apply the upstream delta base→theirs to ours as a meaning-level merge,
surface genuine conflicts for human decision, never auto-resolve), and
**contribute** (review local amendments flagged as generic and prepare them
as upstream contributions — for each upstream-bound candidate, name
`/write-cmk-skill` for the user to run first; never invoke that user-invoked
skill; skip the gate for pure `## Project adaptations`). Separable local
amendments sit under a marked `## Project adaptations` section, giving the
reconcile a stable seam. Truly project-owned skills (deploy steps, product
workflows) carry no lock entry and sync never touches them. Ends with a
report-only `## Verify` section.

## Where
- Skill body: `skills/sync/SKILL.md` — sections `What the lock records`,
  `Modes`, `Workflow (sync mode)`, `Workflow (contribute mode)`, `Scope rule`,
  `Verify`.
- `references/skills-lock.md` — the normative `.agents/skills.lock` TOML
  shape, field semantics, and the naming mapping between upstream and
  vendored directories.
- `references/reconciliation.md` — the three-way frame, the semantic merge
  doctrine (rewording is not a conflict; behavior/contract disagreement is),
  the `## Project adaptations` seam, upstream-contribution candidates (incl.
  the `/write-cmk-skill` gate), and failure honesty (an incomplete reconcile
  keeps its old lock entry).
- Eval scenarios: `skills/sync/eval.json`.

## Links
- Vendored layout and adapters: `cmk:agent-vendors`.
- Authoring gate before upstream contribute: `cmk:write-cmk-skill` (user-invoked).
