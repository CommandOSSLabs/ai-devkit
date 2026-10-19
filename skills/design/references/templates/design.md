# Design: <Feature Name>

Feature code: <CODE>
Status: Draft
Date: <YYYY-MM-DD>
Requirements: ./requirements.md

## Context

<Why this feature, what exists today, what constraint shapes the approach.
2-4 paragraphs maximum.>

## Decisions

<Numbered list of decisions locked during discovery, each 1-2 sentences.
Anything hard-to-reverse AND surprising AND a real trade-off also gets an ADR.>

## Architecture

Vocabulary for every section below: **module**, **interface**, **implementation**,
**seam** (public surface where behavior is observable and substitutable). Prefer
deep modules — an interface much simpler than what it hides.

### <Module / area 1>

Satisfies: <CODE>-1.1, <CODE>-1.2
Reuse: <rung> — <concrete target, or none — new code (rung 7) with reason>
Respects: <ARCH-N if the design relies on a spine invariant; else omit this line>
Surface: <required when this section changes the behavior, value, shape, or signature of something that already has readers; else omit this line. One row per affected reader, each with exactly one disposition: replace | compat | frozen>
Interface: <what callers know — names, inputs, outputs; keep this smaller than the implementation>
Depth: <deletion test for new modules (Reuse rung 7): if this module vanished, what must callers still know to rebuild the behavior? Answer in one sentence. If that answer is "nearly everything it did", redesign before continuing.>
Locality: <where a change for these Satisfies IDs lands; neighbor impact on existing modules: leave | extend | extract — one line>

<What it is, where it lives, how data flows through it. Diagrams welcome.>

### <Module / area 2>

Satisfies: <CODE>-2.1
Reuse: …
Interface: …
Depth: <required when Reuse is rung 7; for reuse of an existing module, write `n/a — extends <target>`>
Locality: …

...

## UI design

<Required when any Satisfies ID above is delivered through a browser-rendered
surface — a page, screen, component, or style the user sees. Delete this whole
section when none is.>

Grounding: <precedence: the user's own words → the project's existing visual
system → your choices. Name the token / theme / component-style file(s) this
section draws from — or the locked ui-brief.md this section lifts from — or
`none found — inventing; flag for a design-tokens doc`>

### <Surface 1>

Layout: <the composition in 1–2 sentences — placement, alignment, spacing rhythm by token>
Components: <existing classes/components reused or extended vs new — same ladder discipline and format as Reuse: `rung N — <target>`, or `new (rung 7)` + reason>
States: <one line per reachable visible state: default, hover/focus, selected/active, empty, loading, error — a state with no line ships as the browser default>
Type & color: <sizes/faces and color roles by token name — never raw hex>
A11y: <keyboard path, visible focus, contrast>

## Seams for testing

<The public boundaries tests will be written at, agreed here — the test-first skill
refuses tests at unconfirmed seams. Prefer existing seams; the ideal number of
new seams is zero or one.>

| Seam | Kind | Covers |
|---|---|---|
| <module/interface> | unit / integration / e2e | <CODE>-1.x |

## Coverage check

<Every requirement ID from requirements.md appears in exactly one Satisfies:
line above. List any deliberately unmapped IDs and why.>
