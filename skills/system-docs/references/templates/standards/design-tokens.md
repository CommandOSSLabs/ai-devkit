# Design tokens & UI stack

Status: Approved
Date: <YYYY-MM-DD>

## Purpose and boundary

<The visual contract for product UI: the allowed stack, the token vocabulary,
the numeric floors, and the named forbidden patterns. Or: None — <reason>>

## Stack (allowed)

| Layer | Choice |
|---|---|
| UI framework | <e.g. React 19 / Vue / vanilla> |
| Styling | <e.g. CSS custom properties / Tailwind / CSS modules> |
| Component library | <e.g. shadcn/ui / in-house under src/components / none> |
| Icons | <set, or None — <reason>> |

Anything outside this table needs an ADR before first use.

## Token source of truth

- Tokens live in: <file path(s) — the only place raw color/size values may appear>
- Every color, spacing, radius, and type-size value in product code references
  a token from that file; raw hex, `rgb()`, or magic px elsewhere is a defect.

## Color roles

| Role | Token | Light | Dark | Used for |
|---|---|---|---|---|
| <accent / danger / surface / text …> | <--token> | <value> | <value> | <where> |

<Single-theme project? State `Single theme — no dark values` once here and
drop the Dark column instead of repeating None per row.>

## Type & spacing scales

- Type scale: <the sizes/roles in use — e.g. 12/14/16/20/24, which role gets which>
- Spacing scale: <the steps — e.g. 4/8/16/24/40 via --space-1..5; off-scale values are defects>

## Numeric floors

- Body-text contrast ≥ 4.5:1; large text ≥ 3:1 (WCAG AA)
- Interactive targets ≥ 44×44px on touch surfaces
- Keyboard focus visible on every interactive element — suppressing an outline
  requires a visible replacement in the same change
- <project-specific floors, or None — <reason>>

## Forbidden

- Raw hex / `rgb()` outside the token source of truth
- A new component when the inventory below already has one — search first
- <named looks this project bans — e.g. gradient heroes, new fonts without an ADR — or None — <reason>>

## Component inventory

- Components live in: <path>; before creating one, search there and extend.

Or: `None — <reason>`
