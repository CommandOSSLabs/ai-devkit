# cmk:delivery-intake

## What
Turns a tracker issue ID into everything needed to work safely: full written
context pulled from the issue and everything it links to, a compliant
branch and isolated worktree, and an issue enriched to a clarity floor.
Phase 1 of `cmk:delivery-pipeline`.

## Approach
Pulls the issue in full — description, acceptance criteria, comments,
relations, attachments, linked PRs — then chases references outward into
`docs/requirements/`, `docs/design/`, `docs/decisions/`, `docs/ai/README.md`,
the touched code areas, and sibling issues. Enforces a clarity floor
(outcome, context, constraints, acceptance, ownership, estimate,
dependencies, timing) and rewrites acceptance criteria into an individually
provable checklist, fixing the issue itself rather than just knowing the
answer. Creates the branch/worktree — from the canonical branch for
independent work, or from a blocker's pinned handoff commit for dependent
work — moves the issue to in-progress, and distills findings into a
git-ignored context brief that stands alone for the next phase or agent.

## Where
- Skill body: `skills/delivery-intake/SKILL.md` — sections 1. Pull the
  issue then follow every thread, 2. Enforce the clarity floor, 3. Branch
  and worktree, 4. Move to the in-progress state and write the context
  brief.
- `references/linear.md` — the skill body's conditional tracker-binding
  pointer resolves here.

## Links
Operates inside `cmk:delivery-workflow`; phase 1 of `cmk:delivery-pipeline`,
which supplies the context-efficiency refresh discipline. Its context brief
is the handoff into `cmk:delivery-spec-plan`.
