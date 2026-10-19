# Export field schema (`index-only`)

When `/cmk:catalog` runs **export**, only these INDEX / shard card cells may be
proposed for refresh (from **local** triad files). Never invent CODE or ROAD-N.

| Field | Source (local) | Rule |
|---|---|---|
| Name / Capability title | `requirements.md` H1 or first heading | Non-empty; trim |
| Status | Explicit `**Status:**` in requirements (Draft / Approved / Implemented / Shipped) | Only if present; do not invent Approved |
| Spec path | Existing INDEX Spec cell, or triad dir relative to `docs/specs/` | Must match on-disk workbench |
| Surface roots | Stable directory prefixes from `tasks.md` **Files:** (≥3 segments or trailing `/`) | Max 3; optional |
| Match terms | Optional nouns from requirements glossary / title tokens | Bounded; optional |
| Roadmap | Unchanged unless user confirms bind to an **existing** `ROAD-N` | Never mint ROAD |

Dry-run: show before/after cells per CODE. Write only confirmed cells. Never
`git add` triad paths.
