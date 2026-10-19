---
name: cmk:catalog
description: Confirm-then-write the shared capability catalog (reverse-track, dispose, export/materialize).
version: 2.0.1
disable-model-invocation: true
---

# Catalog

Confirm-then-write ops for the **shared** capability catalog
(`docs/specs/INDEX.md` domain router + `docs/specs/catalog/*.md`). Sibling of
`cmk:repo-config`. Reverse-track (ex-`reconcile-features`) is **dispose step 0** —
not a separate skill.

Model-invoked skills that see mapping gaps or a stale reverse checkpoint MUST
**name** `/cmk:catalog` for the user and MUST NOT auto-invoke this skill.

**Load when needed:** `cmk:feature-graph`’s `catalog-query.md` (shared card grammar);
`references/passes.md` + `references/envelope.md` (reverse); `references/export-fields.md`;
`references/templates/` (stubs, gitignore). Do not paste `tombstones.jsonl` into chat.

## Preflight

1. Missing `docs/specs/INDEX.md` → **stop**. Name `/cmk:repo-config`. Do not invent INDEX.
2. INDEX must be a **Domain router** (`| Domain | … | Feature catalog |`). A flat
   `| Code | … |` feature table on INDEX → propose **Domain boundary** migrate; do
   not treat flat rows as the live registry.
3. Read `Catalog sync:` from `docs/agents/project.md`:

| Catalog sync | Modes allowed |
|---|---|
| `index-only` | `dispose` · `export` · `materialize` |
| `full-triad` / unset / absent | `dispose` only |

Ask which mode when unclear. Never run `export` / `materialize` unless sync is `index-only`.

## Mode recipes

### dispose (default)

#### 0. Reverse (always first)

Run the mechanical reverse track before gap scan. Prefer:

```bash
python3 scripts/reconcile.py \
  --repo <root> --base <sha> --head <sha> --mode <mode>
```

Add `--write-overlay` when `.skills/` is writable and gitignored. Modes:
`changes-since-checkpoint` | `full` | `brownfield-bootstrap` — see
`references/passes.md`. Print exactly one `references/envelope.md` envelope
(advisory). Index OBS under `.skills/reverse-features/` or stay stateless
(`advanced_to: null`). Show every runner `notes[]` entry. Do **not** mint Feature
CODEs or write INDEX here — only the overlay + envelope.

*Done when: envelope held; pending OBS visible before proposals.*

#### 1–3. Scan → propose → confirm-write

Scan INDEX / shards / tasks / roadmap / `.skills/reverse-features/active/` (+
observation json when needed). Propose **only** these kinds:

| Kind | On confirm |
|---|---|
| Domain boundary | Shared router + shard stub(s); migrate flat INDEX rows into `catalog/<domain>.md` |
| Missing Feature code | `Feature code:` line in requirements |
| Empty ROAD bind | Shard Roadmap cell → live `ROAD-N` only (never mint) |
| OWNS gap | `tasks.md` Files Create/Modify/Test line |
| DEPENDS_ON candidate | Reuse prose only — never a feature-graph edge |
| Recognized capability | Compact catalog card in a **shard** (Spec may be `—`); **no triad** |
| OBS disposition | promote / absorb / dismiss + tombstone; promote writes Recognized shard card |

**OBS provenance:** when path/term overlap is clear, attach `observation_id` (+
surface_roots). Prefer promoting that OBS over a free-floating Recognized row.

**Batch confirm:** group (Core / Integrations / Docs). Accept
`Confirm P01-P06; decline P07-P15` or `Confirm batch Core`. Promote/absorb rows
still need an explicit CODE token.

Write only confirmed rows. No `GRAPH.md`. No triad scaffold in dispose.
Register new CODEs in the owning **shard**, not on the router INDEX.

### export (`index-only`)

Refuse unless Catalog sync is `index-only` (name `/cmk:repo-config`). For each
selected CODE with a local triad, propose shard (or router) cell updates per
`references/export-fields.md`. Dry-run before/after. Never stage triad files.
Missing triad → gap; suggest `materialize`.

### materialize (`index-only`)

Refuse unless Catalog sync is `index-only`. Confirm or offer
`references/templates/gitignore-index-only.snippet`; warn against `git add -f`.

For each CODE, resolve Spec dir under `docs/specs/`:

- Missing → propose Draft stubs from `references/templates/triad-stub/requirements.md`,
  `references/templates/triad-stub/design.md`, `references/templates/triad-stub/tasks.md`
- Files without `<!-- catalog-materialize-stub: v1 -->` → **refuse clobber**
- Stub-fingerprinted only → may refresh on confirm

Stubs: Status Draft, CODE + title from shard card, no invented Approved EARS. After
write, name `cmk:requirements` when SHALLs are needed.

## Callers (name only — never invoke)

| Skill | When to **name** `/cmk:catalog` |
|---|---|
| `cmk:scope` | Reverse predicate holds (stale/missing checkpoint or post-pull) — before treating surfaces as greenfield |
| `cmk:delivery-review` | After read-only reverse scripts; pending OBS need dispose |
| `cmk:feature-graph` | Envelope/observations band shows pending OBS |
| standalone | User asks to reverse-track, dispose OBS, migrate flat→shared, or catalog backfill |

`cmk:delivery-review` may run `scripts/reconcile.py` **read-only** for an advisory
envelope; it must not perform dispose writes.

## Rationalization

| Thought | Reality |
|---|---|
| "No INDEX — write one from my proposal table" | Preflight stop; `/cmk:repo-config` seeds router + shard |
| "Keep reconcile-features as its own skill" | Deleted; reverse is dispose step 0 only |
| "cmk:scope should auto-run reverse" | Name `/cmk:catalog`; never auto-invoke |
| "Flat INDEX is still fine" | Shared catalog only; Domain boundary migrate |
| "Slug folder is the CODE" | CODE from shard / Feature code: / confirmed row only |
| "Confirm later, write now" | No write without explicit confirm |
| "OBS-5682de is obviously LABL" | Promote proposes; CODE confirmed per row |
| "Materialize while Catalog sync is unset" | export/materialize require index-only |
| "Overwrite their half-written requirements" | Refuse without stub fingerprint |
| "Skip reverse — active/ already has OBS" | Step 0 still runs (checkpoint/range); active/ alone is not a substitute |
| "REQUIRED SUB-SKILL cmk:catalog from cmk:scope" | User-invoked only; name it |

## Red Flags

- Skipping INDEX preflight or inventing INDEX
- Treating a flat Code table on INDEX as the live registry
- Writing without per-row or batch confirm
- Inventing ROAD-N or unconfirmed CODE
- Scaffolding a triad in dispose
- export/materialize when Catalog sync ≠ `index-only`
- Clobbering non-stub triad files
- Leaving promoted OBS in `active/` without a tombstone
- Writing `OBS-*` into a Code cell
- Inventing Approved EARS in stubs
- Auto-invoking this skill from cmk:scope / cmk:delivery-review / reconcile leftovers
- Skipping dispose step 0 reverse
- Minting Feature CODEs during reverse

## Done when

Preflight passed; mode explicit; reverse envelope held (dispose); proposals shown
(OBS provenance when available); only confirmed writes applied; materialized stubs
are Draft + fingerprinted; gaps listed; flat INDEX either migrated or proposed as
Domain boundary.
