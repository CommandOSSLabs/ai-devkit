# Entry: `adr`

## Purpose and boundary
Existing Hybrid 1A standing surface for `adr` (pre-system-docs skill owners).

## Canonical consumer path
`docs/decisions/`

## Applicability
Always applicable when the project uses this skill-set surface.

## Mediated writer
`cmk:glossary`'s `references/define-domain.md` (existing owner). Progressive cmk:system-docs not required.

## Template
None — ADR three-part gate in cmk:glossary's references/define-domain.md

## Validator
None — directory of ADRs

## Evidence sources
Existing skill procedures and pack templates.

## Authority predicate
Directory or multi-file surfaces use presence + owning skill rules (not a single Status header).
Single-file vision/guidelines/INDEX files use Status when present; spine ARCH-N liveness via cmk:traceability.

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:design` | hard-to-reverse decisions | No |

## No-op when absent or non-authoritative
Owning skills already no-op when layer absent (ARCH-2).

## Maturity
Authoritative only in `CATALOG.md`.
