# Contributing

## Proposing a skill change

For a new skill or a behavior-shaping edit, run `/write-cmk-skill` first: it
enforces a failing-baseline Iron Law and the ship checklist before text
lands under `skills/`. Then open a PR against `main`. Describe what the
skill gets wrong, ambiguous, or misses today, and how your change fixes
it — reviewers and skill-lint judge the diff, not the intent.

## The kit's bar

Every skill stays generic: no product name, repo name, or team-specific
vocabulary in `skills/`. The knowledge family (see the roster in
[README.md](./README.md)) is the one deliberate exception: each of those
skills exists to correct stale model knowledge about one specific external
technology with the current, official answer — cite an official source, not
a memory of how things used to work.

## House style

- Frontmatter is `name: cmk:<skill>`, `description`, `version` (semver),
  in that order. A user-invoked skill may add `disable-model-invocation:
  true` as a fourth field; nothing else belongs in the block.
- `SKILL.md` stays within the 150-line budget (≤ 150); move detail into
  `references/*.md` and point to it from the skill. Pre-existing exceptions
  are allowlisted in `scripts/skill-lint.sh` and not granted to new skills.
- A skill file never reaches outside its own package with a relative `../`
  path. Name a target-repo artifact repo-root-relative, and cite another
  skill by its `cmk:` name.

## Checks that must pass

```bash
bash scripts/skill-lint.sh
```

This mechanically enforces frontmatter shape, the 150-line budget, reference
integrity (no dangling or orphaned `references/*.md`), that every `cmk:`
citation resolves to a real skill, the cross-package path rule, and valid
`eval.json` fixtures. Genericity (the kit's bar, above) is a review
judgment, not something the script greps for — keep product/repo vocabulary
out of your own diff. CI runs the same script on every PR touching
`skills/**`.

## Upstreaming from a consuming repo

If your repo vendored the skills via `cmk:agent-vendors` and evolved one
locally, don't just keep the fix local. Run `cmk:sync` in **contribute**
mode: it reviews local amendments flagged as generic-looking upstream
candidates, names `/write-cmk-skill` for you to run on those candidates,
then prepares them as a PR back here. Pure `## Project adaptations` stay
local and skip that gate.

## Commits

Conventional Commits: `<type>: <subject>` (`feat`, `fix`, `docs`, `test`,
`chore`, `ci`, …). Subject ≤ 50 characters, imperative, lowercase after the
type, no trailing period. Skip the body unless one line can't carry the
reasoning.
