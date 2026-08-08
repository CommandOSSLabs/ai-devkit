# cmk:delivery-spec-plan

## What
Produces a low-level design spec and an executable, dependency-aware
implementation plan for a tracker issue, grounded in the actual codebase and
existing design/requirements docs, with every open question decided
autonomously and the rationale recorded. Phase 2 of `cmk:delivery-pipeline`.

## Approach
The spec covers approach selection (2–3 options judged against existing
patterns and recorded decisions), a full-surface inventory with a
disposition per affected surface, low-level design, an invariant check for
security/consensus/wire-format-class changes, doc impact, and a
production-readiness walk. The plan breaks the spec into tasks, each
carrying `Depends on:`, `File scope:`, and the binding obligations restated
in the task body (not just a header section) so an execution engine that
slices the plan at the task heading still hands the obligations to the
builder. Closes with acceptance criteria mapped to the tasks that satisfy
them. Uses `superpowers:brainstorming` and `superpowers:writing-plans` when
present, with human-approval checkpoints replaced by recorded autonomous
decisions, and stops the moment the plan is written — engine selection
belongs to `cmk:delivery-pipeline`, not this phase.

## Where
- Skill body: `skills/delivery-spec-plan/SKILL.md` — sections Spec, Plan,
  Exit gate. No `references/` directory: it points into sibling skills'
  references instead (`cmk:delivery-pipeline`'s
  `references/engineering-principles.md`, `docs/rules/common/naming.md`,
  `docs/rules/common/testing.md`).
- Specs and plans land in git-ignored scratch, never committed; durable
  conclusions go to `docs/design/`, `docs/decisions/`, the tracker, and the
  PR description.

## Links
Reads `cmk:delivery-workflow` and `cmk:delivery-pipeline`'s
context-efficiency and engineering-principles references; disposes
acceptance criteria per `cmk:delivery-workflow`'s
`references/acceptance-criteria.md`; places modules per `cmk:project-layout`.
