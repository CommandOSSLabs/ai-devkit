# Naming

Load when: naming or renaming a variable, function, type, module, file, or
package.

A name must give an unfamiliar reader the correct first-pass mental model
from the name, signature, and type shape alone — the domain subject, the
responsibility it owns, any state or guarantee it carries, and the family of
related concepts it belongs to. If a name permits two materially different
readings that would change how a value is used or trusted, the name fails.

## Judge names where consumers read them

A standalone public type, or anything flattened into a crate/package root
export, needs enough context to stand alone: `RetryQueue` reads correctly
out of context, a bare `Queue` does not. A module-qualified item can lean on
its module (`scheduler::Queue` is fine inside `scheduler`), and an enum
variant can lean on its enum — `JobStatus::Cancelled` should stay short
rather than becoming `JobStatus::JobCancelledStatus`. Tight local scopes
(a five-line loop body) may use short names when the meaning stays obvious
from the surrounding three lines.

## State only what the code establishes

Distinguish proposed, submitted, verified, committed, and observed values
whenever the difference changes behavior. A job that has been enqueued but
not yet run is a `PendingJob`, not a `ScheduledJob`, if nothing has actually
scheduled it yet. A value read once from a flaky upstream is an
`ObservedBalance`, not a `ConfirmedBalance` — the second claims a guarantee
the code never established.

## Expose responsibility and boundaries

A name must not imply that a caller, orchestrator, or downstream system owns
work or policy that actually lives here. A client's own internal backoff
policy is a `RetryPolicy`, not a `CallerRetryHint` — the second wrongly
suggests the caller controls it. Separate two concepts into two names rather
than folding "what this is" and "where it runs" into one overloaded name.

## Keep subsystem vocabulary stable and grep-able

Related concepts share an established subject prefix — `Job`, `JobQueue`,
`JobStatus`, `JobHandle` — so a repository search for the subject finds the
whole family. Don't invent a near-synonym (`Task`, `WorkItem`) for the same
concept elsewhere in the same subsystem; it splinters search and forces a
reader to learn two vocabularies for one idea.

## Category words are not meaning

`Manager`, `Handler`, `Data`, `Info`, `Config`, `State`, `Result`, `Helper`,
and `Util` are fine only when the surrounding name identifies the actual
subject: `ConnectionPoolManager` works, a bare `Manager` does not. Never
reach for a category word to avoid naming the concept it's supposed to
manage.

## Shortest unambiguous name wins

Add tokens only to restore domain or semantic context that would otherwise
be lost — not to repeat an enclosing namespace or narrate implementation
details already visible in the type.

## Renames are atomic and compatibility-aware

Update every call site, import, test, and doc reference in the same change.
A rename that touches a wire format, a stored record, a deployed contract
identifier, or any other external-compatibility surface needs an explicit
migration or compatibility plan — it is never a style-only change.

## Match the language's conventions

Casing, pluralization, and file naming follow whatever the language and
its standard library already establish; don't import another ecosystem's
naming habits just because they're familiar.
