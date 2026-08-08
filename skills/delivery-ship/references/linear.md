# Linear

This file binds `cmk:delivery-ship`'s tracker-neutral contract to Linear
specifically; other trackers can be added as sibling binding files
alongside this one.

## Moving to the review state

The review state this skill moves the issue to is Linear's **In Review**
status.

## Comment rules on ship

A delivery-summary comment is self-contained — assume the reader has no
memory of the session that produced it — and evidence-carrying: name the
outcome, the notable decisions and scope deviations, and the delivery
consequences, with links to the PR, the review thread, and any successor
issue rather than a bare restatement. Skip the comment when the automatic
PR link already carries everything a reader needs; a comment that only
repeats the link adds noise, not information.

## Filing follow-up issues

Every deferred review finding still lacking one gets a Linear issue (or an
extension of the one that already owns it) carrying context, why it was
deferred, acceptance criteria, priority, and an effort estimate, with a
link back to the exact Diff comment or PR review comment that raised it.
Adjust related issues whose scope this delivery changed rather than leaving
their descriptions stale.

## Notifying downstream stakeholders

When the issue names downstream people in `Visibility`, add them as Linear
subscribers if not already, and mention them on the PR at ship when seeing
the diff helps their integration — visibility alone does not make them
required reviewers. Notify them immediately, rather than waiting for this
transition, when a material interface, compatibility, or blocker change
cannot wait.
