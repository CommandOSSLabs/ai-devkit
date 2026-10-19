# Deterministic passes (rfeat-1.0)

## Contents

- [Constants](#constants)
- [On-disk layout](#on-disk-layout)
- [Pass order](#pass-order)
- [Classification rules](#classification-rules)
- [Checkpoint advance](#checkpoint-advance)

## Constants

```text
FINDINGS_MAX = 12
EVIDENCE_MAX = 8
SURFACE_ROOTS_MAX_PER_CARD = 3
PATH_STOPWORDS = apps, app, src, lib, internal, routes, features, crates, packages,
                 backend, frontend, server, client, test, tests, __tests__,
                 node_modules, target, dist, build, vendor, generated, gen
                 (web is NOT a stopword — monorepo package name apps/web/…)
CLUSTER_KEY = two directory segments: first two meaningful, or one meaningful
              + next raw segment (crates/enclave/src/a.rs → enclave/src;
              apps/web/src/features/labels/x.ts → web/labels). Never use a
              filename as a cluster segment.
NOVEL_SINGLETON_SOFT_MAX = 3
              # size-1 novelty-boosted OBS capped so larger unowned clusters
              # still enter FINDINGS_MAX; excess novelty_boost demoted to 0
GENERATED_PATH_GLOBS = **/node_modules/**, **/target/**, **/dist/**, **/build/**,
                       **/*.lock, **/pnpm-lock.yaml, **/Cargo.lock, **/package-lock.json,
                       **/generated/**, **/*.pb.go, **/__generated__/**
```

## On-disk layout

Only this tree (consuming repo, gitignored `.skills/`):

```text
.skills/reverse-features/
  state.json              # last_reconciled_sha, recipe_id, unresolved_finding_ids
  active/<domain>.md      # compact pending/reopened OBS cards only
  observations/OBS-*.json # evidence detail for active rows
  tombstones.jsonl        # dismissed/absorbed signatures; lookup only — never load into context
```

`<domain>` slug: prefer the catalog domain id when surface roots match a domain
router row; else the first non-stopword path segment of the dominant evidence
locator, lowercase kebab, max 32 chars. Never use a proto-CODE or a full crate
path (`mail_labels_service` is acceptable only when it is that segment; prefer
`mail` / `labels` when a shorter domain token is already in the router).

If `.skills/` is missing, not writable, or not ignored, run **stateless**: print
the envelope, write nothing, set `checkpoint.advanced_to: null`.

Forbidden alternate roots (baseline failures): `.skills/reconcile/`,
`.skills/observations/` (bare), `.skills/_pending-*/`, any path under `docs/`.

## Pass order

1. **Resolve range.** Read `.skills/reverse-features/state.json` when present.
   - Valid checkpoint ancestor of `HEAD` → `base = last_reconciled_sha`.
   - Missing/stale/non-ancestor → `full` or `brownfield-bootstrap`; for a just-pulled
     range prefer `ORIG_HEAD` / reflog pre-pull tip when the caller is post-pull.
2. **Rename-aware path inventory** (read full output):

```bash
git diff --name-status -z -M <base>..<head>
```

3. **Drop generated/vendor/lockfile paths** via `GENERATED_PATH_GLOBS`. Remaining
   paths are candidates.
4. **Load catalog ownership.** From live `docs/specs/` (tracked or local overlay),
   following **`skills/execution/load-subgraph/references/catalog-query.md`**
   (shared catalog only: Domain router + `catalog/*.md`) and cmk:feature-graph Pass R
   for the full CODE set on disk. Prefer the shared extractor
   `scripts/owns.py` when running mechanically:
   - Router → shard feature cards → CODE → spec dir (**index-first**; do **not**
     require a `Feature code:` line in `requirements.md`)
   - Flat feature tables on INDEX → empty registry + note `flat_index_rejected`;
     name `/cmk:catalog` Domain boundary migrate — do not parse flat as CODEs
   - each feature `tasks.md` fence-aware `**Files:**` / `Files:` tokens plus
     File Structure backtick path cells
   - compute `owns_coverage` like cmk:feature-graph (with_owns / registered);
     missing spec dirs go in coverage `missing_dirs`
   - Cluster unowned behavior paths with `scripts/cluster.py` (`CLUSTER_KEY`)
     before minting OBS cards; cap surface roots per card at
     `SURFACE_ROOTS_MAX_PER_CARD`
   - When surfacing cards to the caller, apply catalog-query context caps — do
     not paste the whole registry into the reply
5. **Load active overlay.** Parse `active/*.md` OBS cards; tombstone-lookup
   evidence signatures before inventing a duplicate OBS.
6. **Classify each candidate path** (rules below). Cluster unowned behavior
   paths by `CLUSTER_KEY` into `new-capability-candidate` findings. Known-impact
   is **one row per CODE** (a path may appear under multiple CODEs), never one
   row per CODE-tuple — combo explosion must not starve OBS candidates.
7. **Render envelope** per `envelope.md`. Cap at `FINDINGS_MAX` with a balanced
   budget: emit `new-capability-candidate` clusters first (largest first),
   reserve up to `KNOWN_IMPACT_SOFT_MIN` (4) slots for `known-impact` (one row
   per touched CODE), keep at most one `uncertain` and one `no-spec-impact`.
   Set `findings_truncated` when uncapped count exceeds the cap.
8. **Index then advance** (see Checkpoint advance).

No Graphify read in rfeat-1.0. No LLM-only finding without a locator from pass 2.

## Classification rules

Apply first match:

1. Path under `GENERATED_PATH_GLOBS` after filter → ignore (not a finding).
2. Exact/ancestor match to a Recognized Files token or surface root →
   `known-impact` on that CODE (confidence high for exact/ancestor; medium if
   only a stopword-stripped segment matched more than one CODE → prefer
   `uncertain`). Ancestor match requires the OWNS token to end with `/` **or**
   have ≥ 3 path segments — a bare two-segment root like `crates/enclave`
   is exact-only (does not own the whole tree).
3. New behavior-bearing surface (added non-generated source, route, migration,
   schema, permission, public API) with no Recognized owner →
   `new-capability-candidate` + new `OBS-<6hex>` unless tombstoned.
   When applying `FINDINGS_MAX`, **novel singletons** (size-1 cluster whose
   first meaningful path segment is absent from the OWNS vocabulary) sort
   ahead of larger generic unowned clusters so Critical-miss surfaces stay
   visible — but at most `NOVEL_SINGLETON_SOFT_MAX` (3) keep the boost; the
   rest are demoted so bulk clusters are not starved.
   Setup readiness notes (`skills_not_ignored`, `specs_index_missing`) are
   advisory on the envelope; they name `/cmk:repo-config` and do not block
   classification.
4. Docs-only, comment-only, or internal rename within an owned surface with no
   contract file → `no-spec-impact` (still record briefly when the caller asked
   about that range).
5. Else → `uncertain`.

Never promote OBS → Feature CODE in this skill. Never absorb into a CODE without
explicit human disposition in the calling session.

## Checkpoint advance

After findings for the range are **indexed** into `active/<domain>.md` (and
per-OBS json for new/pending candidates):

1. Write/update `state.json`:
   - `last_reconciled_sha = head`
   - `recipe_id = "rfeat-1.0"`
   - `unresolved_finding_ids = [ pending/reopened OBS ids… ]`
2. Set envelope `checkpoint.advanced_to` to that sha.

Unresolved OBS **stay** in active shards. Advance does **not** require human
disposition. Do not refuse to advance solely because findings are pending —
that was a baseline rationalization that re-scans forever.

Promoted/absorbed/dismissed: remove from `active/`, append tombstone, keep
detail json only if useful for audit — default delete active card.
