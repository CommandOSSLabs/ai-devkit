# cmk:write-cmk-skill

## What

User-invoked skill for creating, editing, or reviewing a `cmk:*` skill before
it ships. Applies test-driven authoring (RED baseline → GREEN minimal text →
REFACTOR under pressure) so a skill only lands when a failing baseline proves
the text is needed.

## Approach

Neither create/iterate nor a setup facet nor a delivery phase. An Iron Law
forbids shipping skill text without a failing baseline first. Frontmatter
follows kit house form (`name` / `description` / `version`, optional
`disable-model-invocation`); model-invocable descriptions are trigger +
outcome noun, user-invoked descriptions are one plain deliverable line.
Companion material (pressure-testing protocol, influence wording) lives in
`references/` and loads on demand. Structural checks run through
`scripts/skill-lint.sh`.

## Where

- Skill body: `skills/write-cmk-skill/SKILL.md`
- Pressure-testing protocol: `skills/write-cmk-skill/references/pressure-testing.md`
- Influence wording: `skills/write-cmk-skill/references/influence-principles.md`
- Eval fixtures: `skills/write-cmk-skill/eval.json`
- Mechanical lint: `scripts/skill-lint.sh`
- House style for PRs: `CONTRIBUTING.md`
