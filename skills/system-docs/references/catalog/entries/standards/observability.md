# Entry: `standards/observability`

## Purpose and boundary
Hybrid 1A document for `standards/observability`.

## Canonical consumer path
`docs/rules/common/observability.md`

## Applicability
Adopt when the project needs this standing document.

## Mediated writer
`/cmk:system-docs` (`SKILL.md`)

## Template
`references/templates/standards/observability.md`

## Validator
`references/validators/standards/observability.md` (structural pass/fail)

## Evidence sources
Repository/runtime facts with grades; human confirmation for high-risk classes.

## Authority predicate
- **Absent:** no file at `docs/rules/common/observability.md`
- **Non-authoritative:** missing Approved status or structural validator fail
- **Approved:** `Status: Approved` and structural validator pass

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:design` | instrumentation design | Yes |
| `cmk:delivery-spec-plan` | observability constraints | Yes |

## No-op when absent or non-authoritative
Named readers continue without failing solely for absence.

## Maturity
Authoritative only in `CATALOG.md`.
