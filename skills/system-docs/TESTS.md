<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# cmk:system-docs — test evidence

(Contract evals in eval.json predate this file; entries below record
per-change evidence.)

## standards/design-tokens entry (v1.1.0, 2026-08-18, sonnet)

New catalog entry: template + validator + entry package for
`docs/rules/common/design-tokens.md` — the product-UI visual contract (allowed
stack, token source of truth, color roles, scales, numeric floors, named
forbidden patterns, component inventory). Readers wired: `cmk:design`
Step 2b `Grounding:`, `cmk:ui-review` step 3 contract precedence, `cmk:visualize` §2
precedence list.

Shape check (reference-type test, 2026-08-18, sonnet, 1 rep): authored the doc
for the fieldwork fixture repo from the template alone. All 8 headings filled,
zero placeholders, values grounded in the repo's real `styles.css` (9 color
roles with actual hex, real font stack), honest handling of absences — the
undeclared 16px body size called out as a browser default rather than presented
as a token. One template awkwardness reported: a single-theme repo repeats
`None — no dark theme` per color row; template amended to allow a one-line
`Single theme — no dark values` note dropping the Dark column.
