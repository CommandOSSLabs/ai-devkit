# Entry: `standards/ui`

## Purpose and boundary
Hybrid 1A document for `standards/ui`.

## Canonical consumer path
`docs/rules/common/ui.md`

## Applicability
Adopt when the project needs this standing document.

## Mediated writer
`/cmk:system-docs` (`SKILL.md`)

## Template
`references/templates/standards/ui.md`

## Validator
`references/validators/standards/ui.md` (structural pass/fail)

## Evidence sources
Repository/runtime facts with grades; human confirmation for high-risk classes.

## Authority predicate
- **Absent:** no file at `docs/rules/common/ui.md`
- **Non-authoritative:** missing Approved status or structural validator fail
- **Approved:** `Status: Approved` and structural validator pass

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:design` | UI design | Yes |
| `cmk:delivery-spec-plan` | UI constraints | Yes |
| `cmk:acceptance-ui` | UI acceptance | Yes |
| `cmk:delivery-review` | Standards axis | Optional |

## No-op when absent or non-authoritative
Named readers continue without failing solely for absence.

## Maturity
Authoritative only in `CATALOG.md`.
