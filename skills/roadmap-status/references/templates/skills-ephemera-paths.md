# Skills ephemera paths

SSOT for where agents write git-ignored working files under `.skills/`.
Skill bodies prescribe these forms; there is no runtime path library (ARCH-3).

## Roots

| Kind | Root | When |
|---|---|---|
| **Feature** | `.skills/<CODE>/` | Feature code registered (`docs/specs/INDEX.md` / `Feature code:` line) |
| **Pending** | `.skills/_pending-<slug>/` | Feature-scoped work **before** CODE registration |
| **Adhoc** | `.skills/_adhoc/<short-slug>/` | Tier-0 / one-off with no Feature code path |
| **Shared** | see below | Cross-feature or multi-session |

### Feature code only

`<CODE>` is the Feature code alone (2–12 chars, `A-Z0-9`, starts with a letter).
**No long human title or branch name in the path segment.**

Examples: `.skills/SPAY/`, `.skills/WEBPAR/`, `.skills/SKNS/`.

### Shared roots (never under `<CODE>/`)

| Root | Contents |
|---|---|
| `.skills/pathfind/<effort-slug>/` | Multi-session decision maps / knowns packages |
| `.skills/research/` | Dated research notes (`<date>-<topic>.md`) |
| `.skills/decisions/` | Boundary decision records (`DEC-*.md`, adoption) |
| `.skills/pr-packages/<stable-id>/` | **Retired.** `cmk:delivery-ship` no longer writes this tree. Leave existing dirs; do not author new ones. |
| `.skills/understand/` | Explainer pages (`<slug>.html`) from `cmk:explain` |
| `.skills/dashboard/` | Weekly progress pages from `/cmk:progress-chart` (`<date>.json` snapshot, `<date>.notes.json`, `<date>.html`) |
| `.skills/system-docs/<entry-key>/` | System-doc authoring digests (`state.md`, `evidence.md`, `proposal.md`) for `/cmk:system-docs`; entry-key path mirroring (e.g. `codebase/map`) |

## Resolution order for `<CODE>`

1. Active plan / task brief / session feature context (controller injects `FEATURE_CODE` or equivalent)
2. Feature `requirements.md` line `Feature code: <CODE>`
3. Matching row in `docs/specs/INDEX.md` for the active spec directory

Do not invent a second identifier when a CODE is available.

## Feature basenames (under `.skills/<CODE>/` or pending/adhoc root)

| Basename | Role |
|---|---|
| `progress.md` | Execute progress ledger — **only** for this feature |
| `close-receipt.md` | Final review/verification/acceptance evidence bound to base + HEAD for `cmk:delivery-ship` |
| `implementation-notes.md` | Mid-build deviations (append-only: Task, Unknown class, Map said, Territory showed, Deviation, Cause, Choice, Map impact, Revisit) |
| `global-constraints.md` | Optional copy for implementer briefs |
| `corrections.md` | Reroute-plan evidence fingerprints (this feature's plan flight) |
| `task-N-brief.md` | Implementer / controller brief for task N |
| `task-N-report.md` | Task N report |
| `review-<base7>..<head7>.diff` | Task or unit review package |
| `knowns.md` | Discovery knowns inventory |
| `scan.md` | Scan subagent digest |
| `req-review.md` | Requirements code-claim review |
| `design-review.md` | Design independent review |
| `plan-review.md` | Plan independent review |
| `acceptance.md` | cmk:acceptance ledger |
| `dogfood.json` | Product-flow run file |
| `dogfood.html` | Rendered guide |
| `dogfood-report.md` | Walkthrough report |
| `dogfood-review.md` | Independent review of the dogfood guide (`cmk:dogfood-plan`) |

Prefer these fixed basenames. Do not scatter `<slug>-scan.md` at the bare `.skills/` root.

## Pending promote

WHEN a Feature code is registered in INDEX and a `.skills/_pending-<slug>/` directory
was used for that work:

1. If `.skills/<CODE>/` does not exist → `mv .skills/_pending-<slug> .skills/<CODE>`
2. Else merge contents carefully, then remove empty pending dir
3. All **subsequent** writes use `.skills/<CODE>/` only

## Legacy flat root

| Rule | Behavior |
|---|---|
| **Read** | IF `.skills/<CODE>/` missing AND a root path clearly holds this feature's only active state → may **read once** for resume |
| **Write** | All **new** feature-scoped artifacts go under `.skills/<CODE>/` (create the directory) |
| **Forbidden writes** | Do **not** create new loose `progress.md`, `task-N-*.md`, `review-*.diff`, `implementation-notes.md`, knowns/scan/acceptance files at the **bare** `.skills/` root |
| **Auto-migrate** | **MUST NOT** auto-migrate or bulk-move a consumer repo's historical `.skills/` tree. Cleanup is human-initiated (`rm -rf .skills/<CODE>` or manual moves) |

Shared roots (pathfind, research, decisions) may still be written at their shared locations. Do not write new `.skills/pr-packages/` trees.

## Two features, two ledgers

`.skills/AAA/progress.md` and `.skills/BBB/progress.md` are independent.
Never append task-complete lines for AAA into BBB's ledger or into a global multi-feature root `progress.md`.
