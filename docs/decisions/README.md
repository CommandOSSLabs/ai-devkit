# Decisions

Architecture Decision Records: the choices that shape this system, with the
context and consequences that make them reviewable later.

## Conventions

- Name entries `NNNN-<slug>.md`; numbers are monotonic and never reused.
- Record a decision that shapes system structure, crosses a component
  boundary, or is costly to reverse — before the code that depends on it.
  Implementation details and library picks are not decisions; they belong in
  [`../design/`](../design/) or the change itself.
- Start from [`../templates/adr.md`](../templates/adr.md).
- Progress-neutral and tracker-neutral wording: no ticket IDs, no delivery
  status.
- Declare links: name the upstream docs this satisfies and the downstream docs
  it constrains.
- Update an entry in place while the decision holds; when the choice itself
  changes, add a new entry that supersedes it.

## When to read

Before proposing an architecture change — to find the constraint you are about
to break.
