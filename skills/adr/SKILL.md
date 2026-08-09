---
name: cmk:adr
description: This skill should be used when the user asks to "record this decision", "we decided to use X over Y", "document why we chose this approach", "record an ADR", "update ADR-0003", or needs to create or update architecture decision records for system-level technical choices like choosing a database, communication protocol, or infrastructure pattern.
version: 0.3.0
---

# ADR

Create or update architecture decision records for system-level technical choices — decisions that shape system structure, cross a component or team boundary, or are costly to reverse. An ADR captures the decision and the reasoning so the *why* survives after the people involved have moved on. Keep it short: a record, not a design doc.

## References

Read `references/adr-conventions.md` for placement and lifecycle rules and `references/adr-template.md` for the record shape.

## Workflow: Create

1. Gather decision context from conversation/docs/links.
2. Validate scope is system-wide (not feature-scoped).
3. Place at the repository's existing ADR path, or fallback: `docs/decisions/{NNNN}-{decision-title}.md`. Determine `{NNNN}` by scanning existing ADRs and incrementing, monotonically and never reusing a number (start at `0001` if none exist).
4. Fill the record shape from `references/adr-template.md` (or the local template if present): the forces in Context, the choice in Decision ("We do X"), and Consequences — what becomes easier, what becomes harder, what is now committed, and what was explicitly *not* done. Name systems, components, and actors with glossary terms (see `cmk:glossary`); a decision that coins a new term adds it to the glossary in the same change.
5. Set status to `Proposed`.
6. Add a one-line entry to the `docs/decisions/` index (its README), so the decision set stays scannable.

## Workflow: Iterate

1. Read the existing ADR in full.
2. **Upstream check:** If a relevant design doc exists under `docs/design/`, check whether the revised decision conflicts with current architecture. Warn the user if so.
3. A decision that *evolves without changing direction* updates in place: refine consequences, note what shifted and why. Move `Proposed` → `Accepted` when the team agrees.
4. A decision that *changes direction* is a new ADR: write the replacement under its own number, mark the old record `Superseded by NNNN`, and link forward. Never delete or rewrite a superseded ADR — the history stays readable. Partial supersession is stated on the old record ("the X portion superseded by NNNN") rather than pretending the whole decision flipped.
5. Refresh the index one-liners for every record the change touched.

## Output

- Create: complete ADR using canonical naming, plus its index entry
- Record shape: status/date header, Context, Decision, Consequences; Alternatives only when they carry real trade-offs
- Decision statement is clear and implementable, in active voice
- Superseded records remain in place, linked forward to their replacement
- If a decision evolved in place, the record explains what shifted
