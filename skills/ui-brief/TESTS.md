<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# cmk:ui-brief — test evidence

## RED (2026-08-18, sonnet, 1 rep)

Fixture: static vanilla-JS board at pre-implementation `main` (approved FILT
requirements only). Baseline = cmk:spike's UI branch text alone, task: "show
me genuinely different design directions in the browser; after I pick the
decision must carry into our spec docs."

Mechanics held (3 structurally different variants — tabs / chip toolbar /
vertical rail — behind a working switcher on real data). The three target
gaps all reproduced:

- **One design direction laid out three ways:** a single shared `styles.css`
  for all variants; the only non-house font was the switcher's; zero
  per-variant plans — pitches were purely structural ("tab bar", "chips",
  "rail").
- **No review loop:** hand-over went straight to a post-pick plan.
- **No durable brief:** the decision carrier was "the commit message states
  which variant won and why" + a later design.md authored from memory — type,
  density, states, and signature of the chosen direction survive nowhere.

## GREEN (2026-08-18, sonnet, 1 rep, two-phase)

Same fixture, full cmk:ui-brief text (cmk:visualize discipline inlined for the
sandbox).

**Phase 1 (build + show):** three named plans, each with its own Color / Type
/ Layout / Signature — solid-fill segmented capsule vs stat-block rail
(uppercase 12px caption over 20px numeral) vs pure-typographic middot
sentence — diverging on palette-spend AND type AND density while staying
inside the `:root` token sheet. Stopped at hand-over and **waited for the
pick without writing any brief** ("Waiting on your pick … before this gets
locked").

**Phase 2 (pick relayed: hybrid c+a, 3 amendments, "go"):** amendments
applied to the live variant and verified by screenshot before lock;
`ui-brief.md` written with Decision (user quoted), Grounding, Layout /
Components / States (including the composed overdue-and-selected state) /
Type & color / A11y, Signature, and the three Amendments as decided
constraints; one screenshot kept beside the brief; variants + switcher
deleted, `app.js` restored to committed baseline, cleanup commit references
the brief. The winner's draft code was deleted, not promoted.

## Trigger test (2026-08-18, sonnet)

12 routing queries against cmk:spike, cmk:visualize, cmk:ui-review, cmk:design,
cmk:scope: **12/12** — should-fire ("what should X look like", "variants
and let me pick", "mock both up for real", "explore design directions",
"clickable takes of the empty state") all reached cmk:ui-brief; traps landed
right (logic spike → cmk:spike; distinctive landing page and HTML report →
cmk:visualize; design-review a branch and mobile breakage → cmk:ui-review; brand-new
feature → cmk:scope; design.md for approved reqs → cmk:design).

## Fresh-eyes fix (v1.0.1, 2026-08-18, sonnet reviewer)

The step-4 "mirror 1:1" claim over-promised: Decision, Signature, and
Amendments have no design.md home. Wording now scopes the 1:1 lift to the
per-surface slots; the three brief-only slots stay in the brief, which the
design cites.

## v1.1.0 — compose the kit (2026-08-25, sonnet, 2 RED + 2 GREEN reps)

Fixture: the same static board, plus a real `components/` kit (`UI.button`,
`UI.setBusy`, `UI.badge`, `UI.toast`; `.btn` carrying
`:focus-visible { outline: 2px solid var(--accent); offset 2 }`) and a
`components/README.md` saying screens compose the kit and do not hand-roll or
restyle it. Approved `FILT-1…5` for a filter bar with saved views and an empty
state. Task: "what should this filter bar look like — show me a few directions
I can click through." Baseline = cmk:ui-brief v1.0.1.

### RED — the failure is variance, not a constant

| | rep 1 | rep 2 |
|---|---|---|
| raw `<button>` created | **19** | 0 |
| `UI.button` calls | 1 | 5 |
| kit chrome re-declared | ~10 variant classes | none |
| `:focus-visible` on new controls | 2 rules, **both on `<select>`** — none on any of the 19 buttons | n/a (kit's inherited) |

Rep 1 rebuilt the kit's button under variant names —
`.fbB__saveConfirm { border: none; background: var(--accent); color: var(--accent-ink); border-radius: 999px; padding: 5px 12px; }`
is `.btn--primary` with a different radius and padding — and every one of those
19 controls lost the focus ring the kit already had. Rep 2 did none of this. One
run in two is exactly the case the text is for: the form was not binding.

A second gap surfaced at the lock. Rep 2 was given a pick and an amendment and
finished the workflow correctly, but its brief's `Components:` slot was prose —
*"Toggle button, badged with the active-filter count"*, *"Saved Views: a single
bordered list"* — naming no kit piece and no rung, while its own Grounding line
listed `UI.button`, `UI.badge`, `UI.toast`. `design.md`'s template expects that
slot in ladder form, so the lift step receives a slot it cannot use.

### GREEN — 2/2 on the build rule

Added to §1 the component kit as grounding, to §2 **Compose the kit before
writing chrome** (naming what a re-declared control silently drops — focus ring,
disabled state, busy state), one rationalization row, one red flag.

- rep 1: every control built as `class: "btn btn--ghost" | "btn btn--primary" |
  "btn fbar__trigger"` — kit classes reused, variant classes only *modify*
  (`--active` border/color), **0** re-declared chrome.
- rep 2: `UI.button` for the triggers plus a modifier class; hand-rolled markup
  only for chips and tag-pills, patterns the kit does not have — and gave those
  **6** `:focus-visible` rules of their own.

### GREEN — the brief slot

§4's `Components:` clause was added after those runs started, so rep 1 was
resumed with a pick, an amendment, and a note that the guidance had changed. It
re-read it and locked:

```
Components:
- rung 2 — reuse `.btn` / `.btn--ghost` (components.css) for the Assignee/Due/Views triggers…
- rung 2 — reuse `.badge` for the existing `#count` element…
- new (rung 7) — dropdown trigger + popover checklist. Reason: the kit has no dropdown/popover control
- new (rung 7) — removable chip token. Reason: the kit has no chip/tag control
```

Cleanup verified independently of the report: `git diff` against baseline empty
for `app.js` and `index.html`, variants and switcher deleted, brief plus one
screenshot surviving. The same run flagged that its own chips had been drafted
without the kit's focus treatment — the red flag this version adds, caught by
the agent against itself.
