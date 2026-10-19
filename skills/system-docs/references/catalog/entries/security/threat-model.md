# Entry: `security/threat-model`

## Purpose and boundary
Hybrid 1A document for `security/threat-model`.

## Canonical consumer path
`docs/security/threat-model.md`

## Applicability
Adopt when the project needs this standing document.

## Mediated writer
`/cmk:system-docs` (`SKILL.md`)

## Template
`references/templates/security/threat-model.md`

## Validator
`references/validators/security/threat-model.md` (structural pass/fail)

## Evidence sources
Repository/runtime facts with grades; human confirmation for high-risk classes.

## Authority predicate
- **Absent:** no file at `docs/security/threat-model.md`
- **Non-authoritative:** missing Approved status or structural validator fail
- **Approved:** `Status: Approved` and structural validator pass

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:requirements` | NFR Security grounding (Step 2b) | Yes — once per entry when Security NFR material |
| `cmk:design` | Security: citations / trust design | Yes |
| `cmk:traceability` | TB/THR referential integrity | No suggest |

## No-op when absent or non-authoritative
Named readers continue without failing solely for absence.

## Maturity
Authoritative only in `CATALOG.md`.
