# Contributing

## Proposing a skill change

Open a PR against `main`. Describe what the skill gets wrong, ambiguous, or
misses today, and how your change fixes it — reviewers and skill-lint judge
the diff, not the intent.

## The kit's bar

Every skill stays generic: no product name, repo name, or team-specific
vocabulary in `skills/`. Knowledge-family skills (`cmk:sui-sdk`,
`cmk:sui-devstack`) exist to correct stale model knowledge with the current,
official answer — cite an official source, not a memory of how things used
to work.

## House style

- Frontmatter is exactly three fields, in order: `name: cmk:<skill>`,
  `description`, `version` (semver).
- `SKILL.md` stays under 150 lines; move detail into `references/*.md` and
  point to it from the skill.
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
candidates and prepares them as a PR back here.

## Commits

Conventional Commits: `<type>: <subject>` (`feat`, `fix`, `docs`, `test`,
`chore`, `ci`, …). Subject ≤ 50 characters, imperative, lowercase after the
type, no trailing period. Skip the body unless one line can't carry the
reasoning.
