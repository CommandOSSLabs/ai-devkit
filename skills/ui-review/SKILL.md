---
name: cmk:ui-review
description: Use when a diff or branch touching browser-rendered surfaces (HTML, CSS/styling, JSX/TSX/Vue/Svelte components, templates) needs its visual and interaction quality judged in the real running app before merge — the live design review invoked by `cmk:delivery-review`'s UI lane, or when the user asks to design-review a change, check how it looks, responsive breakage at mobile widths, focus visibility, contrast, dark mode, or off-token styling. Produces a screenshot-backed UI finding set across desktop/tablet/mobile viewports, interaction and composed states, and design-contract conformance — settling cascade and severity questions by driving the app, never by inference from the diff. Not for asserting spec'd behavior e2e (cmk:acceptance-ui), authoring a human product walk (cmk:dogfood-plan), or styling a standalone page (cmk:visualize).
version: 2.1.2
---

# UI Review

The one rule: **a visual claim is settled by rendering, never by inference.**
A careful read of a style diff produces hypotheses — "these two classes may
collide", "this might overflow at phone width", "this pair looks low-contrast"
— and a hypothesis reported as a finding is a guess wearing evidence's
clothing. This skill turns each one into a verdict with a screenshot behind it.

## 0. Scope the surfaces

From the range: `git diff <base>...HEAD --name-only`, keep the files a browser
renders (HTML, CSS/styling, JSX/TSX/Vue/Svelte components, templates). None →
report `no rendered surface` and stop. Map each kept file to the screen(s) or
route(s) where its change shows. *Done when: every changed rendered file has a
named screen.*

## 1. Get it running — live first

Read `docs/agents/project.md` **Run locally (dev)** and start the app; missing
→ discover the command, confirm the app loads, and write it back (same
contract as `cmk:acceptance-ui`). Cannot run it (no browser, server broken) → the
review **degrades, loudly**: the report's first line says
`cannot drive — static review only`, and every visual conclusion below carries
the label `unverified (static)`. Static reading is admissible only under that
label. *Done when: the app is loaded in a browser, or the degraded mode is
declared.*

## 2. Deterministic floor passes

Run before opening the browser, record the output:

- **Off-token color:** `grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\('` over the
  changed style files. When the repo has a token system, a hit outside the
  token-definition file(s) is an Important finding; no token system → note
  that instead.
- **Suppressed focus:** `grep -nE 'outline: *(none|0)'` over the changed
  styles. A hit with no visible replacement (`:focus-visible` rule, custom
  outline/box-shadow) in the same diff is an Important finding.

These are the floor, not the review. *Done when: both passes ran and their
hits are recorded.*

## 3. Hold the contract

What does "right" look like, in precedence order: the feature's `design.md`
`## UI design` section (its `States:` lines are the case list for step 4, its
tokens the palette of record) → an Approved `docs/rules/common/design-tokens.md`
(stack, token vocabulary, numeric floors, forbidden patterns — its floors set
severity) → else the repo's token/theme file plus the visual language of the
screens around the change. Name which contract you hold. *Done when: the contract source is named in the report.*

## 4. Drive, capture, judge

Per changed surface, in the running app, driven with kimi-webbridge (one
session, `navigate` with `newTab:true`, never `find_tab` `active:true`). Set
each viewport with `cdp` `Emulation.setDeviceMetricsOverride` before
`screenshot`: 1440×900, 768×900, and 375×900 (`deviceScaleFactor` 1, `mobile`
false). A shot of the window's current size is not one of those three. Do not
use Playwright. Screenshots land under
`.skills/<CODE>/ui-review/` (no CODE → `.skills/ui-review/<branch>/`); the
working tree stays untouched.

- **Viewports — 1440×900, 768, 375.** At each: screenshot, and check
  `document.scrollingElement.scrollWidth <= window.innerWidth`. Horizontal
  overflow, clipping, or overlap at any of the three is **Important**. Spec
  silence does not downgrade it: the requirement is the page, and the rest of
  the page reflows — a surface that breaks at a common width is broken.
- **States.** Exercise every reachable state: hover, keyboard focus (Tab to
  each new interactive element and screenshot — is focus visible?),
  selected/active, disabled, empty, error — and every **composed** state the
  code makes possible (two classes on one element, emphasis while selected).
  The collision a static read can only call "fragile" is settled here by
  producing it and looking.
- **Contract walk.** Each `States:` line in the UI design section gets
  exercised; a state the contract names but the screen cannot reach — or
  reaches looking wrong — is a finding. Colors on screen trace to tokens.
- **Contrast.** For each new text/background pair, compute the WCAG ratio
  from the actual rendered values. Defaults: body text below 4.5:1 is
  Important; below 1.5:1 the content is effectively invisible — Critical. An
  Approved `design-tokens.md`'s floors override these defaults.
- **Themes.** WHEN the app's styles define a second theme
  (`prefers-color-scheme` media query or a `data-theme` selector) → capture
  each changed surface in both themes; a token redefined in one theme but not
  the other, or a new raw value that ignores the theme split, is a finding.
  No second theme in the styles → skip, note once.

Read every screenshot you capture. *Done when: every changed surface has its
three viewport shots plus one per exercised state, all read.*

## 5. Report — fixed shape

- One block per finding: severity (Critical / Important / Minor), `file:line`,
  **screenshot path**, why it matters, the fix unless obvious. A visual
  finding with no screenshot path and no `unverified (static)` label is not
  done — go back and capture it.
- `needs-human-eyes:` — the genuine taste calls the running app cannot settle
  (does this feel right for the brand? is this treatment too loud?). Write
  `none` when empty; this line feeds the product-walk predicate in
  `cmk:delivery-build`'s `references/common.md`.
- Verdict line: `UI: clean | findings | cannot drive (static only)`.

## Rationalizations

| Thought | Reality |
|---|---|
| "The CSS read already shows the bug — no need to run it" | A read is a hypothesis. The screenshot settles it, and catches what reading can't: cascade order, inheritance, real widths |
| "No responsive requirement in scope — overflow at 375 is Minor" | The rest of the page reflows. Broken at a common width is Important, banked nowhere |
| "Tests are green, so it renders fine" | The tests assert strings and DOM state, not pixels. The invisible-text bug passes a `.match()` test |
| "Both classes probably compose — different properties" | Produce the composed state and look. Declaration order is not a verdict |
| "Screenshot captured — attach and move on" | An unread screenshot is not evidence. Read it, then judge |
| "Playwright is the reliable camera" | The review drives the user's browser through kimi-webbridge, at the three set sizes |

## Red Flags

- A visual verdict with no screenshot path and no `unverified (static)` label
- Skipping the 375px viewport
- Judging a composed state from declaration order instead of producing it
- `outline: none` passing because "the design never mentioned focus"
- Mutating the working tree, index, or branch state during review
