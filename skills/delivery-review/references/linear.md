# Linear

This file binds `cmk:delivery-review`'s tracker-neutral contract to Linear
specifically; other trackers can be added as sibling binding files
alongside this one.

## The Diff is the one review surface

A Linear issue with a linked pull request gets a synced **Diff** — this is
the tracker's synced review thread. In standalone mode, post every finding
there or in the GitHub pull request, never both, and never start a
parallel thread on the ordinary issue. Before a PR exists, use the
ordinary issue for scope, acceptance, and other non-review delivery
discussion; it remains available afterward for those topics.

## Defer with an issue: field expectations

A deferred finding files a Linear issue (or extends the one that already
owns it) carrying:

- Context: what the finding is and where it was found, in enough detail
  that the reader has no need to reopen the review thread to understand
  it.
- Why deferred: the reasoning that took it out of the current scope
  rather than fixing it now.
- Acceptance criteria: a checklist the successor issue can be closed
  against.
- Priority and an effort estimate on the team's configured scale.
- A link back to the exact Diff comment or PR review comment that raised
  it — never a bare restatement with no traceable source.

A deferral filed without these is a dropped finding, not a lighter one.

## Reconcile at exit

Before either exit, read back that every newly filed or extended issue
carries the finding, its link to the review thread, and current status.
Rescoped acceptance criteria move to the successor issue's description,
not just a comment. Standalone mode's verdict — approve or request
changes — is the Diff or PR review's terminal state; pre-ship mode's
disposition list is what the owning issue's reconciliation is checked
against.
