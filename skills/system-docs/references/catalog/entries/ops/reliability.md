# Entry: `ops/reliability`

## Purpose and boundary
Hybrid 1A document for `ops/reliability`.

## Canonical consumer path
`docs/ops/reliability.md`

## Applicability
Adopt when the project needs this standing document.

## Mediated writer
`/cmk:system-docs` (`SKILL.md`)

## Template
`references/templates/ops/reliability.md`

## Validator
`references/validators/ops/reliability.md` (structural pass/fail)

## Evidence sources
Repository/runtime facts with grades; human confirmation for high-risk classes.

## Authority predicate
- **Absent:** no file at `docs/ops/reliability.md`
- **Non-authoritative:** missing Approved status or structural validator fail
- **Approved:** `Status: Approved` and structural validator pass

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:requirements` | NFR Reliability grounding (Step 2b) | Yes — once per entry when Reliability NFR material |
| `cmk:design` | Reliability: SLO citations | Yes |
| `cmk:traceability` | SLO referential integrity | No suggest |

## No-op when absent or non-authoritative
Named readers continue without failing solely for absence.

## Maturity
Authoritative only in `CATALOG.md`.
