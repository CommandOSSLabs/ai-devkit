# Validator: standards/INDEX (structural only)

Returns **pass** or **fail**. No semantic judgment of whether standards are wise.

## Fail conditions
1. Missing required template headings.
2. Required slot empty without `None — <reason>`.
3. Table slots without ≥1 data row and without `None — <reason>`.
4. Forbidden placeholders TBD/TODO/.../lorem.
5. Unresolved `Blocker:` lines.
6. Missing `Status: Approved` for write readiness.

## Non-goals
Does not enforce standards at runtime; does not replace linters.
