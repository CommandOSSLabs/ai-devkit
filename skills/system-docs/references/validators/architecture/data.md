# Validator: architecture/data (structural only)

Returns **pass** or **fail**. No semantic judgment.

## Required headings

Match the template required `##` headings for this entry.

## Fail conditions

1. Missing required heading.
2. Required slot empty without `None — <reason>`.
3. Table slots without ≥1 data row and without `None — <reason>`.
4. Forbidden placeholders: TBD, TODO, ..., lorem (case-insensitive).
5. Unresolved `Blocker:` lines.
6. Missing `Status: Approved` for canonical-write readiness.

## Non-goals

Does not judge correctness of personas, metrics numbers, or architecture prose.
