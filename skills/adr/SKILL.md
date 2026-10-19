---
name: cmk:adr
description: Use when the user asks to "record this decision", "we decided to use X over Y", "document why we chose this approach", "record an ADR", "update ADR-0003", "this ADR is obsolete", "prune / archive / clean docs/decisions", or another skill reaches a decision that may need one — produces an architecture decision record in docs/decisions/ that passes the three-part gate, or a keep/archive/drop classification of the existing records.
version: 1.0.0
---

# ADR

Create or update architecture decision records for system-level technical choices — decisions that shape system structure, cross a component or team boundary, or are costly to reverse. An ADR captures the decision and the reasoning so the *why* survives after the people involved have moved on. Keep it short: a record, not a design doc.

## References

Read `references/adr-conventions.md` for placement and lifecycle rules and `references/adr-template.md` for the record shape.

## Whether to write one

Offer an ADR only when **all three** hold:

1. **Hard to reverse** — changing course later carries real cost.
2. **Surprising without context** — a future reader would ask "why on earth this way?"
3. **A real trade-off** — genuine alternatives existed and one was chosen for specific reasons.

Any one missing → no ADR. A 200 ms debounce on the search box trades responsiveness against
request volume and would surprise a reader, yet flipping it later is a one-line change: it
fails "hard to reverse". Record it in the code, not an ADR. If a new decision contradicts an
existing ADR, flag the conflict to the user and resolve it explicitly by superseding the old
record (§ Iterate).

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
4. A decision that *changes direction* is a new ADR under its own number; the supersession mechanics — forward links, partial supersession, never deleting or rewriting the old record — follow `references/adr-conventions.md` § Lifecycle.
5. Refresh the index one-liners for every record the change touched.

## Pruning

WHEN asked to prune, audit, archive, or tidy `docs/decisions/`, read `references/prune.md`
and follow it exactly — every live record is classified keep, archive, or drop.

## Output

- Create: complete ADR using canonical naming, plus its index entry
- Record shape: status/date header, Context, Decision, Consequences; Alternatives only when they carry real trade-offs
- Decision statement is clear and implementable, in active voice
- Superseded records remain in place, linked forward to their replacement
- If a decision evolved in place, the record explains what shifted
