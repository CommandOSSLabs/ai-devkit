# Catalog integrity passes

Load when `docs/specs/INDEX.md` exists. Produces **E11**–**E14**, **W4**, **W5**;
the finding table in `SKILL.md` defines them and stays their one home.

If `docs/specs/INDEX.md` is missing, skip this section (the "nothing to check"
stop already applies when the whole specs tree is absent). Shape: load
`cmk:feature-graph`’s `catalog-query.md` — **shared catalog only** (Domain router +
`catalog/*.md`).

**C0. Shared shape** — INDEX must carry a Domain router header
(`| Domain | … | Feature catalog |`). If INDEX instead has a flat feature table
(`| Code | … |` rows with CODE grammar and no Domain router) → **E14**. Name
`/cmk:catalog` Domain boundary migrate. Do not parse flat INDEX rows as
`catalogCodes`.

**C1. Catalog CODE rows** — collect Code cells with CODE grammar
`[A-Z][A-Z0-9]{1,11}` length 2–12 from each **shard** only. Shard paths come from
the router `Feature catalog` cell (`./catalog/…` or `catalog/…`), then:

```bash
# after resolving each shard path from the router
grep -nE '^\| [A-Z][A-Z0-9]{1,11} \|' docs/specs/catalog/<domain>.md
```

Ignore Domain-id cells on INDEX. Build `catalogCodes` as CODE → [file:line, …].

**C2. Shard path existence** — for each router `Feature catalog` cell that looks
like a relative path (`./catalog/…` or `catalog/…`), resolve under `docs/specs/`.
Missing or not a file → **E12**.

**C3. OBS tokens in canonical Code cells** — grep canonical catalog files for
OBS-shaped first cells (hyphenated; they will not match the C1 CODE pattern):

```bash
grep -rnE '^\| OBS-[0-9a-f]{6} \|' docs/specs/INDEX.md docs/specs/catalog \
  --include='*.md' 2>/dev/null
```

Each hit → **E13**.

**C4. Spec pointer liveness** — for each catalog row whose Spec cell is neither
empty nor `—`, resolve the directory under `docs/specs/` (strip `./` and trailing
`/`). Missing directory → **W4**.

**C5. Active OBS uniqueness (optional overlay)** — when
`.skills/reverse-features/active/` exists, grep `OBS-[0-9a-f]{6}` in those files
only. Same id in two cards → **W5**. Do not walk the rest of `.skills/`.

Do **not** judge whether a Recognized card *should* have a triad (Spec `—` is
allowed). Do **not** promote OBS into CODEs here.
