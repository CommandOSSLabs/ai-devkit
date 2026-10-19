# Review report — schema

Canonical field list and fingerprint recipe for
`.skills/<CODE>/dogfood-review.md`. The reviewer, `cmk:dogfood-run`'s gate, and tests
use the same shapes.

## Fresh stamp fields

| Field | Meaning |
|---|---|
| `slug` | Run slug |
| `run_file` | Path to the JSON run file (repo-relative) |
| `cases_fingerprint` | SHA-256 hex of canonical authored content (recipe below) |
| `stamped_at` | ISO-8601 UTC when this pass finished |
| `pass_kind` | `initial` \| `re-check` |
| `prior_report` | Path of previous report on re-check, or `—` |
| `open_count` | Integer count of open missing-situation findings |
| `gate_hint` | `clean` if open_count=0 else `blocked` (informational; walkthrough re-reads findings) |

## Authored-cases fingerprint recipe

Exact — agents and tests use the same steps:

1. Parse run JSON.
2. Build a JSON array of sections, each `{ "name": <section.name>, "cases": [ … ] }`
   where each case includes **only** the eight authored slots as a JSON object
   with **sorted keys** (ASCII sort): `backend`, `expect`, `id`, `kind`, `req`,
   `setup`, `title`, `try`.
3. Omit `run`, `human`, top-level `rev`, and any other keys.
4. Serialize the array with compact separators (`,`, `:`) and no trailing
   whitespace; section objects use sorted keys (`cases`, `name`).
5. `cases_fingerprint = sha256(utf-8 bytes).hexdigest()`.

Any authoring edit (add/reshape case) changes the fingerprint → prior report is
not fresh. Verdict marks and human ticks do **not**.

## Report document skeleton

```markdown
# Dogfood review — <slug>

- **slug:** `<slug>`
- **run_file:** `.skills/<CODE>/dogfood.json`
- **cases_fingerprint:** `<hex>`
- **stamped_at:** `<ISO-8601 UTC>`
- **pass_kind:** `initial` | `re-check`
- **prior_report:** `<path>` | `—`
- **open_count:** <n>
- **gate_hint:** `clean` | `blocked`

## Open findings

### VFG-N
- **status:** open
- **severity:** Critical | Important | Minor
- surface_key: `<stable miss key>`
- **situation:** <missing-situation prose>
- **evidence:** <file/symbol/route pointers>

## Cleared this pass

(optional audit trail — open list is authoritative for the gate)
```

## Finding block shape

```markdown
### VFG-3
- **status:** open
- **severity:** Important
- surface_key: `ui:settings/empty — no rows`
- **situation:** Settings list already renders empty-state copy when zero rows; guide has only happy create/list.
- **evidence:** `src/pages/Settings.tsx:88` (EmptyState), route `/settings`
```

### `surface_key` and id stability

- Finding ids are `VFG-N` (integer N only) — never criterion shape `VFG-N.M`.
- On re-check: still-open same `surface_key` keeps the same `VFG-N`; new misses
  get the next free integer; resolved misses move to `## Cleared this pass`
  (or omit from open list).
- Id allocation: scan prior report for max `VFG-N` and `surface_key`→id map;
  reuse; assign max+1 for new keys.

## Non-goals of this schema

- Mechanical schema/kind/status counts are not a product-completeness claim.
- Severity orders the fix loop only; it does not drop findings from the open set
  for the dogfood gate.
