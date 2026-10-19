# Entry: `architecture/integrations`

## Purpose and boundary
Standing Hybrid 1A document for `architecture/integrations`.

## Canonical consumer path
`docs/design/integrations.md`

## Applicability
Adopt when the project needs this standing product or architecture-shape document.

## Mediated writer
Primary progressive author: `/cmk:system-docs` (`SKILL.md`).
`cmk:vision` may also maintain product/architecture layer docs when updating the project layer; it must not invent parallel SSOTs.

## Template
`references/templates/architecture/integrations.md`

## Validator
`references/validators/architecture/integrations.md` (structural pass/fail)

## Evidence sources
Product interviews, vision goals, codebase topology; human confirmation for standing claims.

## Authority predicate
- **Absent:** no file at `docs/design/integrations.md`
- **Non-authoritative:** file exists but `Status` is not `Approved`, or structural validator fails
- **Approved:** `Status: Approved` and structural validator returns pass

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:design` | Technical design / Locality / seams | Yes — once per entry per design run when shape material |
| `cmk:vision` | Architecture domain maintenance | No auto; may name cmk:system-docs |

## No-op when absent or non-authoritative
Named readers continue without failing solely for absence.

## Maturity
Authoritative only in `CATALOG.md`.
