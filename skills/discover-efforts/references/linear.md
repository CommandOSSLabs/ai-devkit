# Linear

This file binds the tracker-neutral contract in `SKILL.md` to Linear
specifically; other trackers can be added as sibling binding files
alongside this one.

## Searching Linear for source identity

Search across issue titles, descriptions, comments, and relations using
the source's concepts, promised outcomes, domain terms, aliases, and
acceptance signals — not just title matches. Include Backlog, Todo, In
Progress, In Review, Done, Canceled, and Duplicate issues; a source
outcome can already be settled in a state that a narrower search would
skip.

Inspect every plausible overlap completely before classifying: the full
description, every comment, properties, parent, children, blocked-by/
blocks, related issues, attachments, and linked pull requests. Follow a
reference until it stops changing an ownership or coverage conclusion.

## Native duplicate disposition

Use Linear's duplicate relation to mark the loser and point at the
survivor, preserving any evidence worth keeping on the survivor first. Do
not close a duplicate with only a comment when the native relation is
available — the relation is what a later search will actually find.

## Relation vocabulary

Linear's native relations are parent/sub-issue, blocked-by/blocks,
related, and duplicate. Use parent-to-parent relations for outcome-level
ordering and child-to-child relations for exact execution handoffs;
avoid mixed-level edges that merely restate hierarchy that already
exists. Verify targets, due-date feasibility, reciprocity, and the
absence of cycles before a material replan.
