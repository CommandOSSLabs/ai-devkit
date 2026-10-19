# Catalog query (one home)

Query-first **shared** capability catalog for agent **context** selection.
Deterministic registry snapshots (`passes.md` Pass R) may still enumerate every
CODE on disk; **chat/context must not**. Callers that need selected cards point
here — do not restate the caps or grammars elsewhere.

## Contents

- [Shape](#shape)
- [Card grammars](#card-grammars)
- [Context caps](#context-caps)
- [Query recipe](#query-recipe)
- [Exact CODE lookup](#exact-code-lookup)
- [Forbidden](#forbidden)

## Shape

The only valid on-disk shape:

| File | Role |
|---|---|
| `docs/specs/INDEX.md` | **Domain router** — `| Domain | Scope | Surface roots | Feature catalog |` |
| `docs/specs/catalog/<domain>.md` | Feature cards for that domain |

Infer shared catalog when INDEX carries a Domain router header. A flat
`| Code | … |` feature table **on INDEX** is invalid — empty registry for query;
name `/cmk:catalog` (Domain boundary migrate). Do not invent a tracked
automation config. Flat is not a supported mode.

## Card grammars

**Domain router row (INDEX):** Domain id, one-line scope, 1–3 surface roots, path
to feature shard (`./catalog/<domain>.md`).

**Recognized feature card (shard row):**

| Field | Rule |
|---|---|
| Code | Immutable `[A-Z][A-Z0-9]{1,11}` length 2–12 |
| Maturity / Status | Catalog lifecycle or requirements Status — do not invent a third status system in prose |
| Capability | One sentence |
| Match terms | Bounded nouns/verbs; not full Files lists |
| Surface roots | 1–3 stable ownership prefixes |
| Spec | Relative pointer to triad dir (may be empty for Recognized-without-triad until a later slice) |

**Observed card** (local `.skills/reverse-features/active/*.md`): same compact
shape with `OBS-<6hex>`, state, confidence, evidence pointer — see
`cmk:catalog` `references/passes.md`. `cmk:feature-graph` Pass O merges matching OBS
into the envelope `observations[]` band (not `neighbors[]`); never treat OBS as a
Feature CODE.

## Context caps

Pack constants for **agent context selection** (not for Pass R disk enumeration):

| Name | Value |
|---|---|
| `DOMAINS_MAX` | `2` |
| `DIRECT_CARDS_MAX` | `4` |
| `NEIGHBOR_CARDS_MAX` | `2` |

`cmk:feature-graph` envelope caps (`NEIGHBORS_MAX` = 12, etc.) stay in `passes.md`.
Do not raise context caps to match the envelope.

## Query recipe

1. Extract intent **terms** + candidate **paths** from the ask / scan / diff.
2. Score domain rows by surface-root path match first, then terms; keep ≤
   `DOMAINS_MAX` domain cards.
3. Query Recognized rows in the selected shards **and** active OBS overlay for
   those domains. Rank: exact/ancestor surface-root hits first, then term hits.
   Drop generic path stopwords (`apps`, `src`, `internal`, … — same spirit as
   cmk:feature-graph / cmk:catalog reverse stop-lists).
4. Keep ≤ `DIRECT_CARDS_MAX` direct cards (Recognized + OBS) and ≤
   `NEIGHBOR_CARDS_MAX` one-hop neighbors if already known from a prior
   cmk:feature-graph package; otherwise leave neighbors to `cmk:feature-graph`.
5. Present two bands: **Recognized features** and **observations** (active OBS
   cards; not Feature CODEs).
6. Open `requirements.md` / `tasks.md` / OBS evidence **only** for selected cards.
7. Absence claims must carry catalog shape + `owns_coverage` when a subgraph
   package exists (grounded-claims.md).

## Exact CODE lookup

Resolve a known CODE with fixed search — do not load the whole catalog into
context:

```bash
rg -n '^\\| <CODE> \\|' docs/specs/catalog -g '*.md'
```

## Forbidden

- Claiming INDEX is “small” as a reason to dump every row into context
- Pasting the full feature table into knowns, scan digests, or step-1 chat
- Treating OBS ids as Feature CODEs
- Writing `docs/specs/GRAPH.md` or a second catalog SSOT
- Treating a flat Code table on INDEX as a valid registry
- Requiring a second “flat forever” mode
