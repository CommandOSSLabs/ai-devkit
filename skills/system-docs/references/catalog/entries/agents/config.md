# Entry: `agents/config`

## Purpose and boundary
Existing Hybrid 1A standing surface for `agents/config` (pre-system-docs skill owners).

## Canonical consumer path
`docs/agents/`

## Applicability
Always applicable when the project uses this skill-set surface.

## Mediated writer
`cmk:repo-config` (existing owner). Progressive cmk:system-docs not required.

## Template
templates/agents/* (pack root)

## Validator
None — cmk:repo-config wizard

## Evidence sources
Existing skill procedures and pack templates.

## Authority predicate
Directory or multi-file surfaces use presence + owning skill rules (not a single Status header).
Single-file vision/guidelines/INDEX files use Status when present; spine ARCH-N liveness via cmk:traceability.

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:tdd` | verify commands | No |

## No-op when absent or non-authoritative
Owning skills already no-op when layer absent (ARCH-2).

## Maturity
Authoritative only in `CATALOG.md`.
