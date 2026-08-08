# Linear

This file binds the tracker-neutral contract in `SKILL.md` to Linear
specifically; other trackers can be added as sibling binding files
alongside this one.

## Issue states

Linear's state machine maps onto the tracking contract's readiness
vocabulary: work sits in **Backlog** or **Todo** before it starts, moves to
**In Progress** once active work begins, moves to **In Review** when the PR
is ready (`references/pr-traceability.md`), and reaches **Done** only once
every acceptance criterion is disposed
(`references/acceptance-criteria.md`). Move an issue to Done only after
acceptance is verified — merging alone does not do it.

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
