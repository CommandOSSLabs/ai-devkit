# Entry: `ops/disaster-recovery`

## Purpose and boundary
Hybrid 1A document for `ops/disaster-recovery`.

## Canonical consumer path
`docs/ops/disaster-recovery.md`

## Applicability
Adopt when the project needs this standing document.

## Mediated writer
`/cmk:system-docs` (`SKILL.md`)

## Template
`references/templates/ops/disaster-recovery.md`

## Validator
`references/validators/ops/disaster-recovery.md` (structural pass/fail)

## Evidence sources
Repository/runtime facts with grades; human confirmation for high-risk classes.

## Authority predicate
- **Absent:** no file at `docs/ops/disaster-recovery.md`
- **Non-authoritative:** missing Approved status or structural validator fail
- **Approved:** `Status: Approved` and structural validator pass

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:debug` | recovery context | Optional |

## No-op when absent or non-authoritative
Named readers continue without failing solely for absence.

## Maturity
Authoritative only in `CATALOG.md`.
