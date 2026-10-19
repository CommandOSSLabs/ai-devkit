# Entry: `standards/design-tokens`

## Purpose and boundary
Hybrid 1A document for `standards/design-tokens` — the product-UI visual
contract: allowed stack, token vocabulary and source of truth, numeric floors,
named forbidden patterns, component inventory.

## Canonical consumer path
`docs/rules/common/design-tokens.md`

## Applicability
Adopt when the project ships browser-rendered UI and wants its visual
vocabulary enforced rather than re-invented per feature.

## Mediated writer
`/cmk:system-docs` (`SKILL.md`)

## Template
`references/templates/standards/design-tokens.md`

## Validator
`references/validators/standards/design-tokens.md` (structural pass/fail)

## Evidence sources
The repo's real token/theme/component files (paths, values); human
confirmation for stack and forbidden-pattern choices.

## Authority predicate
- **Absent:** no file at `docs/rules/common/design-tokens.md`
- **Non-authoritative:** missing Approved status or structural validator fail
- **Approved:** `Status: Approved` and structural validator pass

## Real readers and decision points
| Reader | Decision point | Suggestion protocol |
|---|---|---|
| `cmk:design` | Step 2b `Grounding:` | Yes |
| `cmk:ui-review` | Step 3 contract | Yes |
| `cmk:visualize` | §2 precedence (existing system) | Optional |
| `cmk:acceptance-ui` | UI acceptance | Optional |

## No-op when absent or non-authoritative
Named readers continue without failing solely for absence.

## Maturity
Authoritative only in `CATALOG.md`.
