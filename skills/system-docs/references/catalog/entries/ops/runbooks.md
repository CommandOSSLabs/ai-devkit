# Entry: `ops/runbooks`

## Purpose and boundary
Hybrid 1A document for `ops/runbooks`.

## Canonical consumer path
`docs/ops/runbooks.md`

## Applicability
Adopt when the project needs this standing document.

## Mediated writer
`/cmk:system-docs` (`SKILL.md`)

## Template
`references/templates/ops/runbooks.md`

## Validator
`references/validators/ops/runbooks.md` (structural pass/fail)

## Evidence sources
Repository/runtime facts with grades; human confirmation for high-risk classes.

## Authority predicate
- **Absent:** no file at `docs/ops/runbooks.md`
- **Non-authoritative:** missing Approved status or structural validator fail
- **Approved:** `Status: Approved` and structural validator pass

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:debug` | runbook selection after RED | Yes — never skip red-loop |

## No-op when absent or non-authoritative
Named readers continue without failing solely for absence.

## Maturity
Authoritative only in `CATALOG.md`.
