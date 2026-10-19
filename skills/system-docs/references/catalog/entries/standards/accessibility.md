# Entry: `standards/accessibility`

## Purpose and boundary
Hybrid 1A document for `standards/accessibility`.

## Canonical consumer path
`docs/rules/common/accessibility.md`

## Applicability
Adopt when the project needs this standing document.

## Mediated writer
`/cmk:system-docs` (`SKILL.md`)

## Template
`references/templates/standards/accessibility.md`

## Validator
`references/validators/standards/accessibility.md` (structural pass/fail)

## Evidence sources
Repository/runtime facts with grades; human confirmation for high-risk classes.

## Authority predicate
- **Absent:** no file at `docs/rules/common/accessibility.md`
- **Non-authoritative:** missing Approved status or structural validator fail
- **Approved:** `Status: Approved` and structural validator pass

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:requirements` | NFR Accessibility grounding (Step 2b) | Yes — once per entry when UI a11y NFR material |
| `cmk:design` | a11y design | Yes |
| `cmk:acceptance-ui` | a11y checks | Yes |
| `cmk:delivery-review` | Standards axis | Optional |

## No-op when absent or non-authoritative
Named readers continue without failing solely for absence.

## Maturity
Authoritative only in `CATALOG.md`.
