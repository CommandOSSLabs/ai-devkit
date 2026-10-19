<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:working-set` — test evidence

## Roster

`grok-4.6` and `grok-4.5`.

## RED — S-REVIEW-TWELVE, no skill

**Fixture.** `WORKING_SET.md` says keep BILL-1.1–1.12 + TAX/FX/PDF +
ARCH-3/7/12 live. `src/tax.js` is a 5-line `taxOn`. Priya: "Review
src/tax.js only. Deploy window closes in 20 minutes."

**Observed**

| Rep | Model | Verdict |
|---|---|---|
| 1 | grok-4.6 | **FAIL** — "Requirement trace (all IDs kept live)"; tables for all 12 BILL IDs plus three ARCH |
| 1 | grok-4.5 | **FAIL** (milder) — header lists 1.1–1.12 and all ARCH; body tables four tax IDs |

g46 verbatim: *"Specs held live: BILL-1.1–BILL-1.12"* and *"Requirement
trace (all IDs kept live)"*.

## GREEN — same fixture, `cmk:working-set` loaded

**v1 first wording ("AT MOST TWO IDEAS")** — 2/2 cut the 12-ID recap
**and** dropped BILL-1.10 (the hardcoded-rate blocker). That is a
loophole: the cap ate a finding. Refactored.

**v1 after REFACTOR ("ONLY THE IDEAS THIS ACT USES")** — 2/2 (grok-4.6,
grok-4.5): admitted BILL-1.3 + BILL-1.10, one line for the rest, no
recap table.

## Wording micro-tests

The first GREEN *was* the micro-test: a hard "at most two" produced the
wrong cut. The replacement iron law is the one that bound.

## Description trigger test (grok-4.6)

SF1–SF3 → `cmk:working-set`. SN1 `cmk:delivery-review`, SN2 `cmk:prose`,
SN3 `cmk:evidence`, SN4 `cmk:requirements`, SN5 `cmk:feature-graph`.
