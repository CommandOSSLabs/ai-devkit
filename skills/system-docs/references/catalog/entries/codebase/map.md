# Entry: `codebase/map`

## Purpose and boundary
Codebase Map: placement and top-level layout guidance for where new code belongs. Not the architecture invariant spine and not the feature registry (`docs/specs/INDEX.md`).

## Canonical consumer path
`docs/codebase/map.md`

## Applicability
Use when planning or placing production code paths and the repository benefits from standing placement rules.

## Mediated writer
`/cmk:system-docs` → `SKILL.md` (one artifact per invocation)

## Template
`references/templates/codebase/map.md` (skill-local under cmk:system-docs)

## Validator
`references/validators/codebase/map.md` (structural pass/fail)

## Evidence sources
Repository tree listing; existing path conventions; human confirmation for ownership claims.

## Authority predicate
- **Absent:** no file at `docs/codebase/map.md`
- **Non-authoritative:** file exists but `Status` is not `Approved`, or structural validator fails
- **Approved:** `Status: Approved` and structural validator returns pass

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:delivery-spec-plan` | File Structure / path placement | Yes — when placement uncertain and map not authoritative; exact `/cmk:system-docs codebase/map` |

## No-op when absent or non-authoritative
`cmk:delivery-spec-plan` continues without failing solely for map absence; may suggest authoring once per run.

## Maturity
Authoritative only in `CATALOG.md` (do not duplicate maturity here).
