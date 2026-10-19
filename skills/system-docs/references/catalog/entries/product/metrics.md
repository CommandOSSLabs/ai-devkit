# Entry: `product/metrics`

## Purpose and boundary
Standing Hybrid 1A document for `product/metrics`.

## Canonical consumer path
`docs/requirements/metrics.md`

## Applicability
Adopt when the project needs this standing product or architecture-shape document.

## Mediated writer
Primary progressive author: `/cmk:system-docs` (`SKILL.md`).
`cmk:vision` may also maintain product/architecture layer docs when updating the project layer; it must not invent parallel SSOTs.

## Template
`references/templates/product/metrics.md`

## Validator
`references/validators/product/metrics.md` (structural pass/fail)

## Evidence sources
Product interviews, vision goals, codebase topology; human confirmation for standing claims.

## Authority predicate
- **Absent:** no file at `docs/requirements/metrics.md`
- **Non-authoritative:** file exists but `Status` is not `Approved`, or structural validator fails
- **Approved:** `Status: Approved` and structural validator returns pass

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:scope` | Product scope / users / goals check | Yes — once per entry per cmk:scope when material |
| `cmk:requirements` | NFR Performance grounding (Step 2b) | Yes — once per entry when Performance NFR material |
| `cmk:acceptance` | Acceptance checklist / success criteria | Yes — once per entry per cmk:acceptance when metrics/personas material |
| `cmk:vision` | Project layer create/update | No auto; may name cmk:system-docs |

## No-op when absent or non-authoritative
Named readers continue without failing solely for absence.

## Maturity
Authoritative only in `CATALOG.md`.
