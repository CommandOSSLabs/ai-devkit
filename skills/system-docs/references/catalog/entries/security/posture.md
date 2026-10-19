# Entry: `security/posture`

## Purpose and boundary
Hybrid 1A document for `security/posture`.

## Canonical consumer path
`docs/security/posture.md`

## Applicability
Adopt when the project needs this standing document.

## Mediated writer
`/cmk:system-docs` (`SKILL.md`)

## Template
`references/templates/security/posture.md`

## Validator
`references/validators/security/posture.md` (structural pass/fail)

## Evidence sources
Repository/runtime facts with grades; human confirmation for high-risk classes.

## Authority predicate
- **Absent:** no file at `docs/security/posture.md`
- **Non-authoritative:** missing Approved status or structural validator fail
- **Approved:** `Status: Approved` and structural validator pass

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:design` | security-relevant design | Yes |

## No-op when absent or non-authoritative
Named readers continue without failing solely for absence.

## Maturity
Authoritative only in `CATALOG.md`.
