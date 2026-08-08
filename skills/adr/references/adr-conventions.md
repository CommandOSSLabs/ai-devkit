# ADR Conventions

## Canonical Placement

- ADR entry: `docs/decisions/{NNNN}-{decision-title}.md`
- Example: `docs/decisions/0001-initial-architecture-decision.md`
- Numbering is monotonic; never reuse a number, even for a superseded or
  rejected decision.

## What Qualifies as an ADR

Record a decision that shapes system structure, crosses a component or team
boundary, or is costly to reverse — not implementation details or library
choices. Record it before the code that depends on it lands.

## File Convention

- One decision per file.
- Update the ADR in place when the decision evolves — the file is the current decision.
- Note what shifted in the rationale so future readers understand the evolution.
- Progress-neutral wording: no ticket IDs, no delivery status.

## Usage

1. Start from `references/adr-template.md`.
2. State the decision and alternatives clearly.
3. Make trade-offs explicit and durable for future readers.
4. When a decision changes, update the existing ADR rather than creating a new one.
