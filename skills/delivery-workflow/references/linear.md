# Linear

This file binds the tracker-neutral contract in `SKILL.md` to Linear
specifically; other trackers can be added as sibling binding files
alongside this one.

## Issue states

The closed workflow's roles map onto Linear's workflow states (and onto labels where Linear
has no state) through `docs/agents/triage-labels.md` — see `references/closed-workflow.md`
§ On Linear. Read the mapping; never assume a state name. A ticket reaches its Done state
only once every acceptance criterion is disposed (`references/acceptance-criteria.md`) —
the PR's `Closes` line and the merge do that after `cmk:delivery-ship` checked them off.

## The Diff is Linear's synced review surface

A Linear issue with a linked pull request gets a synced **Diff** — this is
the tracker's synced review thread. Resolve all PR review there or in the
GitHub pull request, never both; do not start or continue a parallel review
thread on the ordinary issue.

## Branch names

Linear generates a suggested branch name per issue that preserves the issue
identifier. Use it, adding a repository-required username prefix only in
front of it, never in place of the identifier.

## Relation types

Linear's native relations are parent/sub-issue, blocked-by/blocks, related,
and duplicate. Use parent-to-parent relations to show outcome order and
child-to-child relations to show exact execution handoffs; do not create
mixed-level edges merely to restate hierarchy that already exists. Verify
targets, due-date feasibility, reciprocity, and the absence of cycles before
a material replan.

## Estimates and labels

Estimate leaves, not parents — do not double-count a parent's roll-up.
Use the team's configured estimate scale and existing labels rather than
inventing new ones per issue; a new label is a team-level decision, not a
per-issue improvisation.

## Comments

Comments are self-contained and explicitly cross-linked: assume the reader
has no memory of the session that produced them. Prefer a summary and a
link over copying content — the automatic PR link is sufficient unless a
comment adds delivery information the automatic link doesn't carry.
