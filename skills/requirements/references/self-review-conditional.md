# Conditional self-review scans

Loaded from Step 5's two `if`/`(when present)` pointers.

## Code-claim check (independent)

If any criterion asserts how the system currently works — a data format, an
existing behavior, a constraint — dispatch a review subagent to prove
each claim against the real code (grep/read the files, cite `file:line`, flag
any that don't hold), writing findings to `.skills/<CODE>/req-review.md`. A
false premise here — "the body is ProseMirror-JSON" when it is Markdown —
poisons design, plan, and code. Correct the criterion before the gate; do not
read the code yourself. (No subagents? Do the check yourself.)

## Close-package ingest (when present)

Paste Success / Boundaries / Accepted risks into Out of Scope, NFR, or story
criteria as appropriate; do not drop Reliability locks by marking NFR `None`
when the close package already locked prose targets or Owned unknowns for
Reliability.
