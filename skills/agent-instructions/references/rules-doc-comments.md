# Doc comments

Load when: adding, editing, or reviewing a documentation comment on a
declaration.

Documentation comments are exceptional. Add one only when removing it would
lose load-bearing information that the name and signature cannot express:
rationale, an invariant, a boundary contract, an important side effect or
error mode, a compatibility constraint, a surprising mechanism, or a
non-obvious edge case. Everything else is noise a reader has to read past.

## Must not document the trivial

Delete a comment that restates a declaration, a field, a type, a return
value, or an obvious control flow step. A comment reading `// the retry
count` above a field named `retryCount` carries zero information; delete it.
Being on an exported symbol, or being picked up by a doc generator, does not
by itself justify keeping a comment that says nothing the name doesn't.

## Fix the name instead of translating it

A comment must never exist just to explain which domain object a vague
parameter refers to, or to narrow an overclaiming name. If a parameter named
`data` needs a comment saying "this is the request's line items," rename the
parameter to `lineItems` and delete the comment — the name should carry that
information permanently, not a comment a future edit can silently drift out
of sync with.

## Document only real boundary contracts

Preconditions, postconditions, failure modes, side effects, and caller
obligations belong on an exported API only when they are not already obvious
from its types and the language's own idioms. A function that returns
`Result<T, E>` does not need a comment saying "returns an error on failure" —
the type already says that. It does need one if, say, it retries internally
with a capped backoff before giving up, since that behavior isn't visible in
the signature.

## Internal helpers usually need none

A private helper with a clear name and a small body rarely needs a doc
comment at all; its only reader is someone already looking at its
implementation a few lines below.

## Keep it short and load-bearing

Prefer a tight one-to-three-line block over a paragraph. Write for the
constraint or the surprise, not for completeness or symmetry with
neighboring declarations.

## Delete stale comments aggressively

When a change invalidates a comment's claim, fix or delete that comment in
the same change. A wrong comment actively misleads the next reader; a
missing one only leaves them to infer — a wrong comment is strictly worse
than no comment.

## Never reference the issue tracker from source

A doc comment, test name, or identifier must never name a tracked issue,
pull request, review round, finding label, acceptance-criterion number
(`AC4`), or requirement/workstream label with no in-repo definition — the
reader of the code has no guaranteed access to that system, and the
reference rots the day the ticket does. Write the reasoning the ticket stood
for, in the code's own words, even if that duplicates wording that also
lives in the tracker. A path to another file inside the same repository (a
design doc, a decision record) is fine, since anyone with the repository can
open it. A label is canonical only if the repository itself defines it; a
delivery report merely quoting it does not count.
