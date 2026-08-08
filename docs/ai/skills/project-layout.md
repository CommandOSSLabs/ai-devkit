# cmk:project-layout

## What
Skill that establishes or audits a monorepo's top-level layout: role-first
directories, one workspace per language ecosystem rooted at the repo root,
when a shared library graduates into a common `libs/` area, private test
package ownership (including cross-language parity packages), the
`external/` vendoring pattern, and how `scripts/` groups by responsibility.

## Approach
A placement rubric answers "where does this go" in order: role, existing
role-area ownership, cross-role-area sharing (triggers the library
promotion rule the moment a second role-area imports something), test-package
status, and external governance. Cross-language name collisions are resolved
only when they actually happen, by suffixing an ecosystem tag. Ends with a
`## Verify` section for report-only checks a caller can run against a target
repo.

## Where
- Skill body: `skills/project-layout/SKILL.md` — sections `Role-first top
  level`, `One workspace per ecosystem, rooted at the repo root`,
  `Cross-language name collisions`, `Library promotion rule`, `Private test
  packages`, `` `external/` vendoring ``, `` `scripts/` grouped by
  responsibility ``, `Placement rubric`, `Verify`.
- `references/parity-testing.md` — the cross-language parity package
  pattern: golden vectors, per-language renderers, the stale-fixture check,
  where the package lives, and the update discipline for a format change.
