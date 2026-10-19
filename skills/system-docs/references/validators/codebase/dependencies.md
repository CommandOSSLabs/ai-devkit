# Validator: codebase/dependencies (structural only)

Returns **pass** or **fail**. No semantic judgment.

## Required headings

Same as template: Purpose and boundary; entry-specific slots; disclaimer heading; plus `Status: Approved` for write readiness.

## Fail conditions

1. Missing required heading from template.
2. Required slot empty without `None — <reason>`.
3. Table slots without ≥1 data row and without `None — <reason>`.
4. Forbidden placeholders: TBD, TODO, ..., lorem (case-insensitive).
5. Unresolved `Blocker:` lines.
6. Missing `Status: Approved` for canonical-write readiness.

## Non-goals

Does not verify owners exist, imports match rules, or prose is correct.
