# Entry: `codebase/ownership`

## Purpose and boundary
Path/module ownership (advisory). Complements Codebase Map; not the feature registry or architecture spine.

## Canonical consumer path
`docs/design/codebase/ownership.md`

## Applicability
Use when the repository has multi-module structure, ownership notes, or dependency direction rules agents should respect.

## Mediated writer
`/cmk:system-docs` → `SKILL.md`

## Template
`references/templates/codebase/ownership.md`

## Validator
`references/validators/codebase/ownership.md` (structural pass/fail)

## Evidence sources
Repository tree; package manifests; CODEOWNERS if present; human confirmation for ownership claims.

## Authority predicate
- **Absent:** no file at `docs/design/codebase/ownership.md`
- **Non-authoritative:** file exists but `Status` is not `Approved`, or structural validator fails
- **Approved:** `Status: Approved` and structural validator returns pass

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:delivery-spec-plan` | File Structure / placement | Yes — `/cmk:system-docs codebase/ownership` when relevant and not authoritative |
| `cmk:design` | Architecture / Locality when cross-module | Yes — once per entry per design run |
| `cmk:delivery-review` | Spec/Standards context when diff hits surfaces | Optional suggest once; never auto-invoke |

## No-op when absent or non-authoritative
Named readers continue without failing solely for absence.

## Maturity
Authoritative only in `CATALOG.md`.
