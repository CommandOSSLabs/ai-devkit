# Linear

This file binds `cmk:delivery-pipeline`'s tracker-neutral contract to
Linear specifically; other trackers can be added as sibling binding files
alongside this one.

## Branch names per issue

Each issue in a cluster gets its own worktree and branch: use Linear's
suggested branch name for that issue, which already carries its
identifier, adding a repository-required username prefix only in front of
it. Never reuse one issue's branch name for another, and never derive a
branch name by hand when Linear can generate one.

## The relation vocabulary cluster mode maps onto Linear

Linear's native relations are parent/sub-issue, blocked-by/blocks,
related, and duplicate. The closure walk in `references/cluster-mode.md`
maps onto them directly:

- **blocked-by** — walked recursively to pull in every unfinished
  prerequisite of an accepted issue.
- **blocks** — walked recursively only while the downstream issue belongs
  to the same accepted outcome or is already in the seed set; a blocks
  edge into unrelated work is not followed.
- **parent/sub-issue** — determines grouping and membership only, never
  execution order. Use parent-to-parent relations to show outcome order
  and child-to-child relations to show exact execution handoffs.
- **related** — a pointer only; never treated as a dependency edge.
- **duplicate** — resolved before scheduling, per the native duplicate
  disposition: mark the loser and point at the survivor.

Verify targets, reciprocity, and the absence of cycles on every edge the
closure walk follows before scheduling from it.

## Reload Linear and reschedule

"Reload the tracker and reschedule" means: refetch every accepted issue in
the cluster with its current status, comments, and the complete relevant
relation graph — not a delta against a remembered snapshot — then
recompute the readiness frontier from that refreshed state. Do this after
every completion, blocker, relation repair, scope discovery, verification
failure, or handoff-pin publication or supersession; a frontier computed
from stale Linear state can schedule a join whose feeder is no longer
execution-ready.
