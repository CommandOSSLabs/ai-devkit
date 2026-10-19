# Entry: `standards/INDEX`

## Purpose and boundary
Engineering standards document for `standards/INDEX`.

## Canonical consumer path
`docs/rules/common/INDEX.md`

## Applicability
Adopt when the project maintains standing engineering standards under `docs/rules/common/`.

## Mediated writer
`/cmk:system-docs` → `SKILL.md`.  
`cmk:vision` owns migration of `docs/requirements/guidelines.md` to a pointer when standards exist.

## Template
`references/templates/standards/INDEX.md`

## Validator
`references/validators/standards/INDEX.md` (structural pass/fail)

## Evidence sources
Existing guidelines; house rules; test commands in `docs/agents/project.md`; human confirmation.

## Authority predicate
- **Absent:** no file at `docs/rules/common/INDEX.md`
- **Non-authoritative:** file exists but `Status` is not `Approved`, or structural validator fails
- **Approved:** `Status: Approved` and structural validator returns pass

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:delivery-spec-plan` | Global Constraints engineering rules | Yes — once per entry when standards material |
| `cmk:tdd` | TDD procedure (testing.md) | Yes — once for standards/testing when material |
| `cmk:delivery-review` | Standards axis sources | Optional suggest once; never auto-invoke |
| `cmk:vision` | Guidelines migration / project layer | Name cmk:system-docs; never parallel SSOT |

## No-op when absent or non-authoritative
Named readers fall back per skill rules (guidelines pointer or project.md).

## Maturity
Authoritative only in `CATALOG.md`.
