# ADR Conventions

## Canonical Placement

- ADR entry: `docs/decisions/{NNNN}-{decision-title}.md`
- Example: `docs/decisions/0001-initial-architecture-decision.md`
- Numbering is monotonic; never reuse a number, even for a superseded or
  rejected decision. Numbers match the references other docs and code make.
- `docs/decisions/README.md` indexes every record: one line per ADR with a
  compressed statement of the decision, plus supersession parentheticals
  ("(§1 superseded by 0020)") so a reader can scan the current decision set
  without opening every file.

## What Qualifies as an ADR

Record a decision that shapes system structure, crosses a component or team
boundary, or is costly to reverse — not implementation details, library or
component choices, or a feature adopting an already-recorded pattern. Record
it before the code that depends on it lands. Keep it short: an ADR records a
decision; it is not a design doc.

## Lifecycle

- Status moves `Proposed → Accepted → (Superseded by NNNN)`.
- A decision that evolves without changing direction updates in place, noting
  what shifted so future readers understand the evolution.
- A decision that changes direction gets a **new** ADR; the old record is
  marked `Superseded by NNNN` and links forward. Never delete a superseded
  ADR — the history stays readable. Partial supersession is stated precisely
  ("the settle-auth portion superseded by 0007"), on the old record and in
  the index.
- Progress-neutral wording: no ticket IDs, no delivery status.

## Usage

1. Start from `references/adr-template.md`.
2. State the decision and the forces behind it clearly.
3. Make trade-offs explicit and durable for future readers.
4. Keep the index README current in the same change.
