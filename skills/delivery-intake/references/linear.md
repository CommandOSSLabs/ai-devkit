# Linear

This file binds `cmk:delivery-intake`'s tracker-neutral contract to Linear
specifically; other trackers can be added as sibling binding files.

## What to fetch

From Linear, fetch and read:

- The issue: description, acceptance criteria, estimate, priority, labels,
  status, assignee.
- All comments — later comments often amend the description.
- Relations: parent, sub-issues, blocks/blocked-by, related. Note what they
  imply about scope boundaries — a sibling issue may own part of what the
  description mentions.
- Attachments and linked PRs, including merged prior art.

## Estimates and labels

Set the estimate on the team's configured estimate scale (e.g. relative
Fibonacci 1/2/3/5/8), covering
implementation, review, tests, docs, and rollout. Estimate leaves only —
parents roll up from children, and estimating both double-counts. An 8 is a
signal to split before starting, not a size to carry into work.

Use the team's configured labels rather than inventing new ones per issue; a
new label is a team-level decision, not a per-issue improvisation.

## Moving to In Progress

The in-progress state this skill moves the issue to is Linear's **In
Progress** status.
