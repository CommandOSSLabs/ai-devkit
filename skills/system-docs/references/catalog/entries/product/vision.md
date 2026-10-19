# Entry: `product/vision`

## Purpose and boundary
Existing Hybrid 1A standing surface for `product/vision` (pre-system-docs skill owners).

## Canonical consumer path
`docs/requirements/vision.md`

## Applicability
Always applicable when the project uses this skill-set surface.

## Mediated writer
`cmk:vision` (existing owner). Progressive cmk:system-docs not required.

## Template
templates/vision.md (pack root)

## Validator
None — non-template-mediated spine of vision slots enforced by cmk:vision

## Evidence sources
Existing skill procedures and pack templates.

## Authority predicate
Directory or multi-file surfaces use presence + owning skill rules (not a single Status header).
Single-file vision/guidelines/INDEX files use Status when present; spine ARCH-N liveness via cmk:traceability.

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:scope` | product scope | No |

## No-op when absent or non-authoritative
Owning skills already no-op when layer absent (ARCH-2).

## Maturity
Authoritative only in `CATALOG.md`.
