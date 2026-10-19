# Entry: `standards/api`

## Purpose and boundary
Hybrid 1A document for `standards/api`.

## Canonical consumer path
`docs/rules/common/api.md`

## Applicability
Adopt when the project needs this standing document.

## Mediated writer
`/cmk:system-docs` (`SKILL.md`)

## Template
`references/templates/standards/api.md`

## Validator
`references/validators/standards/api.md` (structural pass/fail)

## Evidence sources
Repository/runtime facts with grades; human confirmation for high-risk classes.

## Authority predicate
- **Absent:** no file at `docs/rules/common/api.md`
- **Non-authoritative:** missing Approved status or structural validator fail
- **Approved:** `Status: Approved` and structural validator pass

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:design` | API design sections | Yes once/entry |
| `cmk:delivery-spec-plan` | API-related constraints | Yes once/entry |
| `cmk:acceptance-api` | API acceptance | Yes once when API surface |
| `cmk:delivery-review` | Standards axis | Optional suggest |

## No-op when absent or non-authoritative
Named readers continue without failing solely for absence.

## Maturity
Authoritative only in `CATALOG.md`.
