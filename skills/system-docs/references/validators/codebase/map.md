# Validator: codebase/map (structural only)

Returns **pass** or **fail** with reasons. No semantic judgment of whether placement is correct.

## Required headings (exact)

1. `## Purpose and boundary`
2. `## Top-level layout`
3. `## Placement rules`
4. `## Not spine / not feature registry`

## Completeness rules

| Heading | Pass when |
|---|---|
| Purpose and boundary | Non-empty body after heading, OR a line matching `None — ` (em dash or hyphen-minus after None) |
| Top-level layout | Markdown table with header + ≥1 data row, OR `None — ` line |
| Placement rules | ≥1 non-empty bullet/paragraph, OR `None — ` line |
| Not spine / not feature registry | Non-empty body (disclaimer present) |

## Fail conditions

1. Missing required heading.
2. Slot fails completeness rule.
3. Unresolved blocker: a line matching `^(?:\*\*)?Blocker:` that is not struck through and has no later `Resolved:` companion for the same session content.
4. Forbidden placeholders in required-slot bodies (case-insensitive): `TBD`, `TODO`, `...`, `lorem`.
5. Canonical-write readiness / authority: no line `Status: Approved` (exact status token Approved).

## Non-goals

Does not check that paths exist on disk, that rules are wise, or that prose is factually true.

## Agent / test implementation

Pack tests implement these rules in Python against fixture strings. Agents running `/cmk:system-docs` apply the same rules before offering approval.
