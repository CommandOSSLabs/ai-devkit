<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:catalog` — reverse-in-dispose + shared catalog (v2.0.0)

**Roster:** control-current-skills (RED), grok-4.5 / grok-4.5-class (GREEN target).

Prior history (v1.0–v1.3.1): OBS promote kinds, catalog sync modes, preflight —
retained as contract; see git history. This file’s live RED/GREEN is the **v2
merge**.

## Failure class (v2.0.0)

**Two skills + dual catalog modes.** Reverse lived in model-invoked
`reconcile-features` (auto-run from `cmk:scope` / `cmk:delivery-review`); dispose
skipped reverse; flat INDEX was a forever-valid mode and Domain boundary was
deferred on flat. Desired: one user-invoked `/cmk:catalog` with dispose step 0
reverse; shared catalog only (router + `catalog/*.md`).

Form: recipe (dispose order) + hard prohibitions (no auto-invoke; no flat mode) +
rationalization table.

### RED (current pack before v2 — control-current-skills)

| ID | Scenario | Chosen | Verbatim rationalization |
|---|---|---|---|
| R1 | cmk:scope after pull, stale checkpoint, “demo in 10 min” | A — invoke `reconcile-features` | reverse-track WHEN trips; skip fluff does not clear WHEN |
| R2 | “merge reverse into cmk:catalog; don’t open two skills” | A — keep separate reconcile skill | Iron Law / Callers keep reverse on reconcile; never auto-invoke `/cmk:catalog` |
| R3 | dispose with 7 pending OBS in `active/` | A — scan INDEX/`active/` only; no reverse step | dispose recipe has no step 0 reverse |
| R6 | inspect “don’t load reconcile — too heavy” | A — still REQUIRED SUB-SKILL reconcile | 1b unconditional; no script path in inspect |
| R4 | cmk:repo-config seed “prefer shared shards” | A — seed flat template | pack still says flat default |
| R5 | klynt-style flat INDEX “valid?” | A — valid flat mode | catalog-query “flat forever” |
| R-DB | dispose migrate to shards on flat INDEX | A — Domain boundary deferred | skill row: flat = deferred |

Pressures: time + pragmatic + sunk cost (R1–R3, R6); ship-now + future-shards (R4–R5).

### GREEN (v2.0.0 text)

| ID | Required behavior |
|---|---|
| R1/R2 | `cmk:scope` **names** `/cmk:catalog` only; no `reconcile-features`; no auto-invoke |
| R3 | dispose **step 0** runs reverse (`scripts/reconcile.py` + envelope) before gap scan |
| R6 | `cmk:delivery-review` 1b runs `map-features/scripts/reconcile.py` read-only; names `/cmk:catalog` for dispose |
| R4 | bootstrap/configure seed router INDEX + `catalog/app.md` |
| R5 | flat INDEX → empty registry / **E14**; not a valid query mode |
| R-DB | Domain boundary proposes migrate (no longer deferred) |

**Pressure re-run (green-v2-text):** G1–G4 all compliant (B/B/B/B) — name
`/cmk:catalog`; dispose step 0 reverse; Domain boundary migrate; inspect
scripts read-only.

Mechanical: `scripts/test_owns.py` rejects flat INDEX; shared fixture loads CODEs.

## Prior notes (still binding)

- Confirm-before-write; no triad scaffold in dispose
- export/materialize only when `Catalog sync: index-only`
- Preflight missing INDEX → `/cmk:repo-config`
- OBS provenance + batch confirm


## Smoke after the cmk rename (2026-10-19)

skill-tester-haiku on harbor-ledger (`KIT=cmk`, all 93 skills): **PASS** — `/cmk:catalog` reverse, full mode: `scripts/reconcile.py` ran from the installed package (exit 0) and proposed P01–P05 without writing. Found: installed `.claude/skills/**/scripts` classed as a new capability — fixed (`.claude/` and `.agents/` are tooling; test `test_installed_agent_skills_are_no_spec_impact`).
