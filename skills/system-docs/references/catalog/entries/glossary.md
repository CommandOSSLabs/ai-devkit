# Entry: `glossary`

## Purpose and boundary
Existing Hybrid 1A standing surface for `glossary` (pre-system-docs skill owners).

## Canonical consumer path
`docs/requirements/glossary.md`

## Applicability
Always applicable when the project uses this skill-set surface.

## Mediated writer
`cmk:glossary` (existing owner). Progressive cmk:system-docs not required.

## Template
templates/glossary.md (pack root)

## Validator
None — glossary format in `cmk:glossary`

## Evidence sources
Existing skill procedures and pack templates.

## Authority predicate
Directory or multi-file surfaces use presence + owning skill rules (not a single Status header).
Single-file vision/guidelines/INDEX files use Status when present; spine ARCH-N liveness via cmk:traceability.

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:scope` | vocabulary | No |

## No-op when absent or non-authoritative
Owning skills already no-op when layer absent (ARCH-2).

## Maturity
Authoritative only in `CATALOG.md`.
