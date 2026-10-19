<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# cmk:ui-review — test evidence

## RED (v1.0.0 baseline, 2026-08-18, sonnet)

Fixture: static vanilla-JS board, branch `filt` implementing FILT (filter bar +
counts + empty state + overdue emphasis) with four planted visual defects that
pass 11/11 string-based unit tests: (1) `.filter-btn:focus { outline: none }`
with no replacement, (2) `.filter-btn.active` on raw hex `#7c3aed` outside the
token sheet, (3) `min-width: 150px` × 4 buttons → horizontal overflow below
~660px, (4) `.board-empty { color: var(--paper) }` on `--card` ≈ 1.03:1
contrast. Baseline = `cmk:delivery-review` inline fallback, no UI lane.

Result: the static read caught (1), (2), (4) at sensible severities — a strong
CSS reader — but:

- **Overflow (3) was banked as an unactioned Minor**, verbatim rationalization:
  *"no mobile/responsive requirement is in scope for FILT"* — a broken-at-375px
  surface downgraded to debt.
- **Zero rendering, zero screenshots** — every visual conclusion was inference;
  the `.active` × `.overdue-hot` cascade interaction was reported only as
  *"fragile … reordering would quietly break both requirements"*, a hypothesis
  with no verdict.
- FILT-2.2 settled as "untestable" by code reasoning alone.

Failure class: unverified inference + severity rationalization → the skill's
one rule ("a visual claim is settled by rendering, never by inference"), the
severity absolute (broken at a common width is Important, spec silence does
not downgrade), and the rationalization table.

## GREEN (2026-08-18, sonnet)

Same fixture, `cmk:delivery-review` + 3d UI lane + full cmk:ui-review text:

- All four planted defects found at target severity **with evidence**: contrast
  computed 1.09:1 → Critical; overflow measured `scrollWidth` 648 vs
  `innerWidth` 375 → Important (rationalization did not recur); focus confirmed
  by Tab screenshot; hex flagged by the floor grep.
- **Fifth, unplanned defect found only by driving**: composed
  `active`+`overdue-hot` renders a pink button with a purple `border-color`
  ring (`.overdue-hot` never overrides the border) — the exact state RED could
  only call "fragile", settled by producing it and reading computed styles.
- 13 screenshots under `.skills/FILT/inspect-ui/` (3 viewports × states, hover,
  two focus shots); working tree untouched; `needs-human-eyes: none`;
  verdict `UI: findings`, merge verdict No.

## Trigger test (2026-08-18, sonnet)

16 routing queries against 7 neighbor descriptions (cmk:acceptance-ui,
write-flow-guide, cmk:delivery-review, cmk:visualize, cmk:spike, root-cause):
**16/16** — 8/8 should-fire ("design review this branch", "break on mobile?",
"focus visibility and contrast", "dark mode", "visually broken in the running
app", "screenshots please") reached cmk:ui-review; 8/8 traps landed on the right
neighbor (e2e-with-Playwright → cmk:acceptance-ui; eyeball-guide-for-me →
write-flow-guide; generic "review this branch" and API-only diff →
cmk:delivery-review; distinctive landing page → cmk:visualize; mock-up-variants →
cmk:spike; failing tests → root-cause).

## Review-pass fixes (v1.1.0, 2026-08-18)

Author-skills ship-checklist sweep over the shipped set found the description
promising "dark mode" with no backing step — an observable conditional added
to step 4 (**Themes**: second theme defined in styles → capture both, flag
one-sided token redefinitions; none → skip, note once). Cosmetic: stray space
in the floor-pass grep removed. Companion fixes elsewhere: cmk:delivery-review
inline fallback now names the UI lane and `## UI` heading (1.3.1); cmk:spike's
"Rules for both branches" retitled to the logic branch and the stale
"variant switch" phrase dropped (1.1.1).

## Fresh-eyes fixes (v1.2.0, 2026-08-18, sonnet reviewer)

Independent fresh-context review of the shipped set surfaced: off-token-color
floor pass had no assigned severity (now Important when a token system
exists); Step 3's "floors set severity" and Step 4's fixed contrast numbers
had no precedence rule (now: 4.5:1 / 1.5:1 are defaults, an Approved
design-tokens.md overrides).

## v2.1.0 — the camera is kimi-webbridge (2026-09-27)

v2.0.0 named the camera as "the repo's e2e harness, a browser MCP tool, or
`npx playwright screenshot`". A public page could be shot headless and miss
the signed-in session. The three sizes stay. They are set with
`Emulation.setDeviceMetricsOverride` before each webbridge screenshot.
Playwright is not a camera. A same-day control of v2.0.0 on a login-walled
admin page already refused Playwright and kept 1440 / 768 / 375; this edit
closes the public-page hole the wording still left open.


## Description routing after the cmk rename (2026-10-19)

`skill-fixtures/bin/trigger.py` (claude.ai session auth), all 93 skills installed, sonnet; baseline the jdk set.

| Prompt | jdk `inspect-ui` | cmk |
|---|---|---|
| "Review the layout and styling changes on the statement page branch for visual problems before merge." (×5) | 1/5 | 0/5 (0/5 with a front-loaded variant) |

Weak on both kits when no such branch exists in the checkout; the skill's main entry is `cmk:delivery-review`'s UI lane. Not a regression; description unchanged.
