# Catalog sync recipe

Load this file **only when Decision L (Catalog sync) is offered**. The
Thought/Reality rationalization table for this decision stays inline in
`SKILL.md` — read it there too.

Explainer: sync a **thin** shared feature catalog on git (`docs/specs/INDEX.md` router + `docs/specs/catalog/`) while keeping full triad files local — useful when teammates use different skill sets or do not want requirements noise on GitHub. When `index-only`, `/cmk:catalog` gains `export` and `materialize`. Guide: `docs/guide/skills/catalog-sync.md`. Reverse-track inside `/cmk:catalog` dispose never writes INDEX or triad without confirm.

Options:

- **unset** (default) — omit the field; same as **full-triad**. Do **not** add specs gitignore rules. `/cmk:catalog` dispose-only.
- **full-triad** — triad dirs under `docs/specs/<slug>/` stay committed.
- **index-only** — track INDEX (± `catalog/`); ignore feature triad dirs; enable cmk:catalog `export` / `materialize`.

Recommend **unset** unless the user asks for catalog-only sync. Never force `index-only` on a repo already committing triads without an explicit yes.

## Write step (Step 4, item 11)

**If decision L is `index-only`:** append the catalog-sync gitignore block from this skill's `references/templates/gitignore-index-only.snippet` (`cmk:catalog` ships the same snippet) **only when** those lines are not already present. Show the user the snippet and warn: do not `git add -f` triad dirs. If L is unset or `full-triad`, do **not** add specs ignore rules.
