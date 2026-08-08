---
name: cmk:adr
description: This skill should be used when the user asks to "record this decision", "we decided to use X over Y", "document why we chose this approach", "record an ADR", "update ADR-0003", or needs to create or update architecture decision records for system-level technical choices like choosing a database, communication protocol, or infrastructure pattern.
version: 0.2.0
---

# ADR

Create or update architecture decision records for system-level technical choices — databases, protocols, infrastructure patterns, and other decisions with trade-offs that affect multiple features or core architecture.

## References

Read `references/adr-conventions.md` for placement rules and `references/adr-template.md` for section structure.

## Workflow: Create

1. Gather decision context from conversation/docs/links.
2. Validate scope is system-wide (not feature-scoped).
3. Place at the repository's existing ADR path, or fallback: `docs/decisions/{NNNN}-{decision-title}.md`. Determine `{NNNN}` by scanning existing ADRs and incrementing, monotonically and never reusing a number (start at `0001` if none exist).
4. Fill template from `references/adr-template.md` (or local template if present).
5. Set status to `proposed`.

## Workflow: Iterate

1. Read the existing ADR in full.
2. **Upstream check:** If a relevant design doc exists under `docs/design/`, check whether the revised decision conflicts with current architecture. Warn the user if so.
3. Identify what changed and why.
4. Update in place: revise decision/rationale, update alternatives and consequences, note what shifted.
5. Update `Last updated` date.
6. Transition status: `proposed` → `accepted` when team agrees. `accepted` stays `accepted` when decision evolves.

## Output

- Create: complete ADR file using canonical naming
- Iterate: update in place with current decision and rationale
- Decision statement is clear and implementable
- Alternatives section is always present with concrete trade-offs
- Consequences section is always present with short-term and long-term impact
- If decision changed, rationale explains what shifted
