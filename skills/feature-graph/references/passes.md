# cmk:feature-graph passes (shipped SSOT)

Deterministic recipes. Run against the consumer **repo root**. Two agents on the
same tree with the same query MUST produce the same edge set and seed set
(finding-set identity, not wording).

## Contents

- [Constants](#constants-immutable-for-v1--fsubr-12)
- [Derivation snapshot (two-stage)](#derivation-snapshot-two-stage-per-query)
- [Pass R — Registry](#pass-r--registry)
- [Pass O — Active observations](#pass-o--active-observations)
- [Pass P1 — OWNS](#pass-p1--owns)
- [Pass D — Denoise](#pass-d--denoise)
- [Pass P2 — OVERLAPS](#pass-p2--overlaps)
- [Pass P0 — TERMS](#pass-p0--terms-only-when-caller-supplies-terms)
- [Pass P3 / P4 / P5](#pass-p3--implements)
- [Query: neighbors](#query-neighborscodec-terms)
- [Query: cluster](#query-clusterfocus)
- [Query: ancestors / descendants / blast_radius / subgraph](#query-ancestors--descendants--blast_radius--subgraph)
- [Envelope (every query)](#envelope-every-query)

Consumer claim rules live in **`grounded-claims.md`** (sibling file), not here.

**Constants (immutable for v1 / FSUBR 1.2):**

| Name | Value |
|---|---|
| `NEIGHBORS_MAX` | `12` |
| `P0_SEED_MAX` | `12` |
| `CLUSTER_K` | `1` |
| `CLUSTER_MEMBERS_MAX` | `8` |
| `PATH_EVIDENCE_MAX` / `TERM_EVIDENCE_MAX` | `5` / `5` |
| `OOS_ITEM_MAX` / `OOS_TEXT_CEILING` | `6` / `1200` display code points |
| `OBSERVATIONS_MAX` | `4` |
| `schema_version` / `recipe_id` | `"1.1"` / `"fsubr-1.2"` |
| Line-suffix strip | trailing `:[0-9]+([,-][0-9]+)*` on the path token only |
| Note kinds | `p1_block_skipped`, `p1_file_unreadable`, `cluster_focus_invalid` |
| Note cap | **none** (dedupe `kind+code+detail` only) |

**Stop-list — basenames (exact):**  
`package.json` `Cargo.toml` `go.mod` `pyproject.toml` `Gemfile` `composer.json`  
`Package.swift` `package-lock.json` `yarn.lock` `pnpm-lock.yaml` `Cargo.lock`  
`poetry.lock` `Gemfile.lock` `composer.lock`

**Stop-list — single path segment only (exact, whole token):**  
`src` `lib` `app` `apps` `packages` `services` `crates` `cmd` `internal`  
`vendor` `node_modules` `dist` `build` `target` `out` `skills` `templates`  
`hooks` `scripts` `docs`

---

## Derivation snapshot (two-stage, per query)

Build an in-memory **DerivationSnapshot** once per invocation, then run the query
as a **pure function of the snapshot** (zero further file IO).

### Stage A — Core (every query)

Read each path **at most once**; record every path in `read_ledger` as
`{path, op: "read"|"stat_absent"}`:

1. `docs/specs/INDEX.md` (registry).
2. For each registered CODE: `tasks.md` under its spec dir — parse OWNS (Pass P1).
   - **Missing** `tasks.md` → empty OWNS, **no** `p1_file_unreadable`.
   - **Unreadable** (exists, read/UTF-8 fails) → empty OWNS + `p1_file_unreadable`;
     continue other features.
3. **Pass O** — active OBS overlay (see below).
4. When the query supplies terms (P0) **or** kind is `subgraph` (not `cluster`):
   also buffer each feature’s `requirements.md` and `design.md` if present.
   Cluster Stage A is INDEX + `tasks.md` + optional layers + OBS only; member
   `requirements.md` loads in Stage B after membership from Stage A OWNS.
5. **Optional-layer presence sentinels** (always):
   - `docs/roadmap/INDEX.md`
   - `docs/design/system.md`
   - `.skills/reverse-features/active/` (dir)  
   Absent → `fingerprints[path] = {sha256: null, present: false}` and
   `stat_absent` in the ledger. Present → content hash + `present: true`.

### Stage B — Cluster OOS (only `kind == cluster`)

After eligible members are computed **in memory from Stage A OWNS only**
(focus first; weight ≥ `CLUSTER_K`; cap `CLUSTER_MEMBERS_MAX`):

1. For each **returned** member only, load `requirements.md` if not already in
   `source_texts`. Non-member triad files are never read for cluster queries.
2. Never re-read a path already buffered. Member eligibility/caps use Stage A
   only; OOS union may use Stage A+B texts.

### Snapshot fields

| Field | Content |
|---|---|
| `registry` | INDEX rows |
| `observations` | active OBS cards (pending/reopened only) |
| `source_texts` / `source_bytes` | successful reads only |
| `owns` | CODE → path set |
| `owns_coverage` | with_owns, registered, ratio |
| `notes` | all reliability notes (no count cap; dedupe kind+code+detail) |
| `fingerprints` | path → `{sha256, present}` for every path considered |
| `read_ledger` | ordered; **each path at most once** |
| `schema_version` / `recipe_id` | `"1.1"` / `"fsubr-1.2"` |

### Queries after snapshot

`neighbors`, `cluster`, `ancestors`, `descendants`, `blast_radius`, `subgraph`
take only `(snapshot, query_args)`. They MUST NOT open files. Fingerprints for
package validity hash **buffered bytes** (or a single validation read that
becomes the Stage A buffer) — never read-then-read-again for the same path in
one invocation.

---

## Pass R — Registry

Mode detect and card grammar: **`catalog-query.md`** (sibling). Pass R still
builds the **full** in-memory registry for determinism; it does not authorize
dumping that set into model context.

1. Read `docs/specs/INDEX.md` if present; else empty registry, stop after reporting
   no specs.
2. **Mode:** if INDEX has a Domain router header
   (`| Domain | … | Feature catalog |`) → **sharded**; else **flat**.
3. **Flat:** each table row matching
   `\| CODE \| … \| ./path/ \| Status \| ROAD-or-— \|`
   where `CODE` is `[A-Z][A-Z0-9]{1,11}` length 2–12.
   Spec dir = path relative to `docs/specs/` (strip `./` and trailing `/`).
4. **Sharded:** for each router row, read the listed shard path (under
   `docs/specs/`). Parse feature cards `| CODE | … | Spec |`. Missing shard →
   note + continue. Spec dir from the Spec cell (relative to `docs/specs/` or
   the shard’s directory as written).
5. For each CODE, if `requirements.md` has `Feature code: X`, prefer registry
   CODE for membership; note mismatch in envelope `notes` — never key by
   directory slug.
6. `registered` = union of all CODEs from flat rows or all shards. Active OBS
   cards are **not** registry members (they do not raise `registered`).

---

## Pass O — Active observations

Read-only merge of reverse-track overlay into the snapshot. OBS never become
registry CODEs and never enter `neighbors[]`.

1. If `.skills/reverse-features/active/` is absent → `observations = []`,
   fingerprint the dir as `stat_absent`, stop Pass O.
2. Read each `active/*.md` once. Parse compact OBS cards (see
   `cmk:catalog` references/passes.md / `catalog-query.md`). Keep only `pending` /
   `reopened`.
3. For each card record: `observation_id`, `state`, `confidence`, `capability`,
   `match_terms` (list), `surface_roots` (path prefixes), optional evidence
   pointer text already on the card (do **not** open `observations/*.json`
   unless the card is selected into the capped envelope band and the caller
   needs detail).
4. Store in `snapshot.observations`. Tombstones are lookup-only — never load
   `tombstones.jsonl` into context.

---

## Pass P1 — OWNS

For each registered CODE with `tasks.md`:

### Multi-block + fence-aware stop

1. Find **every whole-line** Files header (`**Files:**` or `Files:` alone on the
   line), **outside fenced code** (fence tracker toggles on lines starting with
   `` ``` ``). Do **not** treat mid-line prose such as table cells
   ``**Files:**` grammar`` as headers.
2. For each such header, body starts on the following line. Take the body until
   the next **stop boundary outside fenced code**:
   - next whole-line Files header
   - `#{2,6}` markdown heading
   - Reuse / Interfaces / Depends-on section headers
   - Steps / checklist step headers (`**Steps`, `Steps:`, `- [ ] Step…`)
3. If fence depth ≠ 0 at the stop boundary (unclosed fence), skip **that block
   only**, emit `p1_block_skipped` with `detail: unclosed_fence`, and keep valid
   sibling Files blocks (malformed block should be last when authoring fixtures).
4. Extract candidates **only inside** each accepted Files body (never after a
   stop boundary; never from headers found inside fences).

### Candidate provenance

Tag each raw candidate at extraction:

| provenance | Source |
|---|---|
| `labeled` | Create/Modify/Move/Test bullet path |
| `backticked` | `` `path` `` token inside Files body |
| `slash_path` | unquoted token containing `/` |
| `unquoted_prose` | other unquoted path-like token in Files body |

### Classifier (fixed order, reject-unsafe-first)

For each candidate with its provenance:

1. **Normalize:** strip surrounding backticks for the working string; strip
   trailing `#` comments; apply line-suffix strip
   (`:[0-9]+([,-][0-9]+)*`).
2. **Empty → drop.**
3. **Reject unsafe / sentinel forms (before any accept):**
   - token ∈ {`.`, `..`}
   - URL schemes: `://` or leading `http:` / `https:` / `file:`
   - absolute path: starts with `/` or Windows `^[A-Za-z]:[\\/]`
   - traversal: any segment `..` after split on `/`
   - trailing prose punctuation: ends with `.` `,` `;` `:` `)` `]` `}`
4. **Provenance-gated accept:**
   - `labeled` / `backticked`: accept **plausible path form** — contains `/`,
     **or** single segment `^[A-Za-z0-9._-]+$` with no consecutive `..`, **or**
     starts with `.` and length > 1 (dotfile). Unknown extensions allowed.
   - `slash_path`: accept if segments non-empty and no remaining reject rules.
   - `unquoted_prose`: accept **only if**:
     - root **dotfile** `^\.[A-Za-z0-9][A-Za-z0-9._-]*$`, or
     - basename matches **broad extension set**:  
       `.md .py .ts .tsx .js .jsx .mjs .cjs .sh .bash .zsh .json .yml .yaml
       .toml .lock .txt .html .css .svg .rs .go .java .kt .swift .rb .php .cs
       .cpp .h .hpp .sql .proto .graphql .vue .svelte .r .jl .scala .clj .ex
       .exs .erl .hs .lua .pl .pm .rake .gradle .cmake .mk`, or
     - single-segment **well-known root** (no `.` in token), exact set  
       `{Makefile, Dockerfile, LICENSE, COPYING, NOTICE, AUTHORS,
       CONTRIBUTING, CHANGELOG, HISTORY, Rakefile, Procfile,
       Vagrantfile}` (case-sensitive as written). **Not** `Gemfile` —
       denoise basenames own that token (would always be stripped).
5. **Denoise** with Pass D stop-lists; drop stop-listed tokens.
6. Else **drop**.

Explicit non-accepts for dotted identifiers as unquoted prose:
`self.assertEqual`, `unittest.TestCase`, `json.loads`, `re.search`.

### Result shape + reliability

- `extract` result for a feature: `{ paths: set[str], notes: [Note] }`.
- **Missing `tasks.md`:** empty paths, **no** `p1_file_unreadable` note.
- **Unreadable** (exists but read/UTF-8 decode fails): empty paths + note
  `{kind: p1_file_unreadable, code: CODE, detail: …}`; continue other features.
- Notes: **no silent count cap** — retain all reliability notes for the query;
  dedupe only by `kind+code+detail`.

OWNS(CODE) = union of accepted paths across all non-skipped Files blocks.
Missing Files blocks → empty set (do not invent paths).

---

## Pass D — Denoise

For a path set S, keep only tokens where:

1. basename (last segment) ∉ stop-list basenames, and  
2. token is **not** a single segment in the single-segment stop-list.

**No ancestor expansion.** Equality is exact string match after denoise.  
Directory ownership: a token counts as a directory only if it ends with `/` or
has no `.` in the last segment **and** was listed as a full Files entry — never
imply children from a parent path.

`meaningful(S) = denoise(S)`.

---

## Pass P2 — OVERLAPS

For each unordered pair of distinct CODEs:

- weight = `|meaningful(OWNS_a) ∩ meaningful(OWNS_b)|`
- if weight > 0, emit undirected edge with that weight
- stop-list-only intersection ⇒ weight 0 ⇒ no edge

---

## Pass P0 — TERMS (only when caller supplies terms)

1. Filter terms: trim; drop length < 3.
2. For each CODE, read available `requirements.md`, `design.md`, `tasks.md` under
   its spec dir (skip missing). Concatenate text; casefold to lower.
3. For each term, casefold; count substring occurrences in that text.
4. `distinct` = number of terms with count > 0; `hits` = sum of counts.  
   If distinct = 0, CODE is not a seed.
5. score = `distinct * 1000 + hits`.
6. Sort seeds by score desc, then CODE asc.  
   `matched` = full count; keep first `P0_SEED_MAX`;  
   `truncated = matched > P0_SEED_MAX`.

---

## Pass P3 — IMPLEMENTS

From INDEX Roadmap-item cell: if it matches `ROAD-\d+` once, edge CODE → ROAD-N.  
Empty, `—`, or missing → no edge (not an error).

---

## Pass P4 — CONTAINS (only if `docs/roadmap/INDEX.md` exists)

1. For each `## MILE-N` section, collect `ROAD-\d+` under Members.  
2. Goals: lines with `Goals:` → collect `GOAL-\d+` as GOAL → MILE.  
3. Absent file → no-op (empty).

---

## Pass P5 — RESPECTS (only if `docs/design/` exists)

In each `docs/specs/**/design.md`, lines containing `Respects:`: extract
`ARCH-\d+`. Absent architecture dir → no-op. Display-only; does not change
`cmk:traceability`.

---

## Query: neighbors(CODE[, terms])

Pure function of the snapshot (zero file IO).

1. Path candidates = other CODEs with P2 weight > 0; `path_weight` =
   `|meaningful(OWNS_focus) ∩ meaningful(OWNS_other)|` (integer).  
2. If terms given, term candidates = P0 seed CODEs minus focus.  
3. **Union** path ∪ term candidates **before** any cut.  
4. For each candidate build a **schema 1.1** row:  
   - `shared_paths` = `path_weight` (0 when term-only).  
   - `via` = both | path | term.  
   - `path_evidence.items` = shared meaningful paths **lex ascending**,
     length ≤ `PATH_EVIDENCE_MAX` (5); `path_evidence.truncated` = true iff
     more shared meaningful paths exist than listed.  
   - `term_evidence`: among caller seed terms (trim; drop length < 3) that
     appear as casefold/lower substrings in that feature’s buffered triad
     text, **casefold-dedupe** keeping the **first original** form in seed
     order; `items` length ≤ `TERM_EVIDENCE_MAX` (5); `truncated` when more
     unique matched seeds exist than listed. Empty items when no terms or
     none match.  
   - `via_traces`: **always** exactly two objects, in order:  
     `{kind: path_overlap, items, truncated}` then  
     `{kind: term_match, items, truncated}` — items/truncated mirror the
     corresponding evidence objects. No other Wave A kinds.  
   - sort key = `(shared_paths desc, via_rank desc, CODE asc)`  
     where both=2, path=1, term=0.  
5. **Truncate once** to `NEIGHBORS_MAX`. Never append after truncate.
6. **Observations band** (separate from `neighbors`): from
   `snapshot.observations`, keep cards whose `surface_roots` exact/ancestor-match
   any seed path **or** whose `match_terms` hit caller terms (same P0 length≥3
   filter). Rank path hits before term hits, then `observation_id` asc. Truncate
   once to `OBSERVATIONS_MAX`. Build ObservationRow per `envelope.md`.
7. Envelope carries `schema_version: "1.1"`, `recipe_id: "fsubr-1.2"`,
   `advisory: true`, `owns_coverage`, `observations` (possibly empty), snapshot
   `notes` (P1 reliability notes included). Never emit `depends_on` /
   `DEPENDS_ON`, untyped `provenance`, or `edge_extensions`. Never put OBS ids
   into `neighbors[]`.

---

## Query: cluster(focus)

Pure function of the snapshot after Stage B (zero file IO). **Not** a global
`communities()` partition of the registry.

1. **Focus:** require exactly one focus CODE. Reject zero or many (list/empty/
   missing) with note `{kind: cluster_focus_invalid, code, detail}` and empty
   members. Unregistered focus → same note (`detail: not_registered`).
2. **Eligible non-focus:** CODEs with meaningful OVERLAPS weight
   `|meaningful(OWNS_focus) ∩ meaningful(OWNS_other)|` ≥ `CLUSTER_K` (1).
3. **Rank:** non-focus sort key `(weight desc, CODE asc)`.
4. **Members:** focus **first**, then ranked eligible until
   `CLUSTER_MEMBERS_MAX` (8) total (cap **includes** focus; never exceeds
   `NEIGHBORS_MAX`).
5. **`members_truncated`:** `(1 + eligible_non_focus_count) > CLUSTER_MEMBERS_MAX`
   — true when eligibility exceeds the cap even if only 8 rows are returned.
6. **Non-focus path_evidence:** shared meaningful paths with focus, lex
   ascending, length ≤ `PATH_EVIDENCE_MAX` (5); `truncated` honesty same as
   neighbors. Focus row has `code` only (no `path_evidence`).
7. **Out-of-Scope union** (from returned members only; texts in
   `snapshot.source_texts` via Stage B `requirements.md`):
   - Parse `## Out of Scope` section bullets (`-` / `*`) until the next
     `#{1,6}` heading.
   - Walk members in returned order; within each file, bullet order.
   - **Dedupe key** = collapse whitespace + casefold of bullet text (no LLM).
   - **Display text** = first original form seen for that key.
   - **sources** = sorted unique member CODEs that contributed the key.
   - Apply **`OOS_ITEM_MAX` (6)** then **`OOS_TEXT_CEILING` (1200)** display
     code points (sum of emitted `text` lengths). Dropping content →
     `oos_truncated: true`; else false.
8. **Observations band:** OBS whose `surface_roots` overlap meaningful OWNS of
   the focus (exact/ancestor). Cap `OBSERVATIONS_MAX`. Empty list if none.
9. Envelope: `schema_version: "1.1"`, `recipe_id: "fsubr-1.2"`, `advisory: true`,
   `owns_coverage`, `observations`, snapshot `notes`. No `depends_on` /
   `communities()`.

---

## Query: ancestors / descendants / blast_radius / subgraph

- **ancestors(CODE):** CODE, then IMPLEMENTS ROAD if any, then MILE containing that
  ROAD, then GOALs of that MILE; if no roadmap layer → `[CODE]` only.
  `observations: []`.
- **descendants(MILE-N):** member ROADs + CODEs with IMPLEMENTS into those ROADs.
  `observations: []`.
- **blast_radius(path):** strip line-suffix; CODEs whose OWNS contain exact path,
  or directory-token ownership (dir token only) where path is under that dir;
  never expand arbitrary ancestors. Also fill `observations` for OBS whose
  surface_roots match the path (same rank/cap as neighbors).
- **subgraph(seeds):** resolve terms→P0, paths→OWNS owners, codes as-is; expand
  one hop via OVERLAPS; bound node list to `NEIGHBORS_MAX * 3` (seeds first, then
  CODE asc). Fill `observations` like neighbors (path/term match, cap
  `OBSERVATIONS_MAX`); OBS ids never enter `nodes` / `seeds`.

---

## Envelope (every query)

Always set:

- `advisory: true`
- `schema_version: "1.1"`, `recipe_id: "fsubr-1.2"`
- `owns_coverage: { with_owns, registered, ratio }` where  
  `with_owns` = count of CODEs with non-empty OWNS,  
  `registered` = registry size
- `observations: [ ObservationRow, … ]` length ≤ `OBSERVATIONS_MAX` (empty
  array when Pass O found none or the query leaves the band empty)
- `p0: { matched, returned, truncated }` when P0 ran; else zeros
- never a `depends_on` / `DEPENDS_ON` field
- never write any file under `docs/` for the graph
