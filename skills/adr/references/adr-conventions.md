# ADR Conventions

## Canonical Placement

- ADR entry: `docs/adrs/{NNNN}-{decision-title}.md`
- Example: `docs/adrs/0001-initial-architecture-decision.md`

## File Convention

- One decision per file.
- Update the ADR in place when the decision evolves — the file is the current decision.
- Note what shifted in the rationale so future readers understand the evolution.

## Usage

1. Start from `references/adr-template.md`.
2. State the decision and alternatives clearly.
3. Make trade-offs explicit and durable for future readers.
4. When a decision changes, update the existing ADR rather than creating a new one.
