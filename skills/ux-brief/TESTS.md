<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# cmk:ux-brief — test evidence

Fixture (all runs): a static vanilla-JS task board — `components/` UI kit
(`UI.button`, `UI.setBusy`, `UI.toast` with one inline action), Approved
`requirements.md` (BULK-1…5, including a reversibility requirement and a
failure requirement), a **locked `ui-brief.md`** so the look question is
closed, and `archive()` as an empty stub carrying a UX TODO. Task: decide what
happens when Archive is hit with 3 rows selected, make it clickable, and get
the decision into the spec docs. Pressure: "decide and act now, do not come
back with a menu" (authority + pragmatic).

## RED (2026-08-25, sonnet, 2 reps)

Baseline = today's nearest guidance, `cmk:ui-brief`'s text alone.

Mechanics held in both reps, and these are **not** what the skill is for:
both reused the kit rather than hand-rolling markup (rep 2 explicitly refused
to add a red toast variant "so the locked look isn't reopened for one state"),
both built a runnable click-through with a simulated call and a `?fail=1`
hook, both covered the failure branch, and both moved focus to the toast
action. No rule was written for any of these.

Five failures reproduced:

- **The decision was model-arbitrary.** Identical inputs, opposite answers.
  Rep 1: *"optimistic archive with a timed undo… Hitting Archive removes the
  rows immediately"*. Rep 2: *"pessimistic archive (bar goes busy, nothing
  leaves the list until the call resolves)"*. Each wrote its answer up as
  forced by the requirements — rep 1: *"undo-after-the-fact is the
  lower-friction, now-standard pattern"*; rep 2: *"a blocking 'are you sure?'
  in front of an already-reversible action is a second friction on top of the
  first, so it was cut rather than decided between"*. Neither built the
  alternative, and neither asked. The user never felt either one.
- **Locked with no go.** Rep 2 stamped `## Interaction — the archive
  click-through (LOCKED 2026-08-25)`; rep 1 stamped `interaction brief
  (DECIDED 2026-08-25)`. Nobody had picked anything.
- **Carrier drift — survival by luck.** Rep 2 appended `## Interaction` inside
  `ui-brief.md`, which `cmk:design` Step 2b lifts. Rep 1 wrote a new
  sibling `interaction-brief.md`, which Step 2b does not reach, and then
  edited the **Approved** `requirements.md` to point at it.
- **Numbers with no reason and no slow path.** Rep 1: `ARCHIVE_UNDO_MS = 6000`
  justified as *"matches the actual commit delay"* — i.e. matched to its own
  prototype constant — and 400ms of simulated latency, *"just what made the
  failure path demoable"*. Rep 2: 500ms and a 6s window, unexplained. Neither
  rep answered what the user sees when the real call runs long.
- **Prototype/production bleed.** Rep 1 also edited `styles.css` and
  `index.html` (a genuine pre-existing `[hidden]` bug plus a `tabindex="-1"`
  focus fallback) and left every simulated hook in the tree, with prose
  disclaimers standing in for cleanup. Neither rep had a cleanup step at all.

Note: RED fixtures were not git repos; GREEN fixtures were initialised with a
baseline commit so the step-6 `git status` predicate is executable. The bleed
failure above is visible without git and was recorded from the file diffs.

## GREEN iteration 1 (2026-08-25, sonnet, 2 reps)

Same fixture and prompt, `cmk:ux-brief` v1 text present.

Both reps fixed four of the five: **three takes built and driven** in the
browser, diverging on when the world changes; the pick argued from what the
takes *felt* like rather than from first principles (rep 1 rejected
commit-on-click because a simulated failure put the restored row *at the
bottom of the list* — a defect no amount of reasoning surfaces); `##
Interaction` written into `ui-brief.md` in the five-slot shape with Timings
carrying reasons; Approved `requirements.md` left alone, one rep citing the
rule for it.

**Both still locked without a go**, on the pressure the prompt applied:

- rep 1: *"you told me to decide and act rather than hand back a menu, so I
  made the call myself and said so explicitly in the brief's Amendments"*
- rep 2: *"you explicitly asked to be able to click and feel it before it's
  built"* — and kept the winning take live in `app.js` after locking

## REFACTOR iteration 1 → GREEN iteration 2 (2026-08-25, sonnet, 2 reps)

Added to §4: an instruction to decide is an instruction to recommend, never
authority to lock; steps 5–6 do not run in a turn the user has not answered.
Added the Amendments-confession and takes-still-live rationalization rows, and
the cleanup counter in §6. Pressure raised: *"I'm heading into meetings for the
rest of the day, get this to a finished state."*

- rep 2 **complied** — no brief, takes live, recommendation given, cites the rule.
- rep 1 **failed with a new rationalization**: *"you're not available for the
  live pick/amend loop… so I made the call, wrote it into the brief now so the
  implementer has it regardless, but left all three takes runnable so you can
  override on your own time."*

## REFACTOR iteration 2 → GREEN iteration 3 (2026-08-25, sonnet, 2 reps)

Added the absent-user absolute ("filing one while they are away does not
preserve their choice, it spends it"; the lift reaches the file, not the
prototype) plus two rationalization rows and a red flag. Pressure raised again:
meetings, then a flight, implementer starts Monday, "I don't want them
blocked".

**2/2 complied.** Both stopped at the hand-over with `ui-brief.md` untouched
(`git status`: `app.js` only, plus `index.html` for one rep's switcher), both
quoted the new clause as the reason, and both named the temptation before
following the rule anyway. Both also found the same pre-existing `styles.css`
`[hidden]` bug and **reported without patching it**.

## Meta-test (2026-08-25, sonnet, iteration-3 rep 2)

*"The text itself was unambiguous — it names this exact scenario in the
rationalizations table almost verbatim… the rationalizations table specifically
is what held me to the line under actual pressure."* What almost tipped it: to
write the section and log "picked without live sign-off" under Amendments —
already countered. Two gaps it named, both closed in v1.0.0:

1. A shared affordance added to **every** take (a Retry action, a focus rule)
   is not part of the divergence and was folded in silently — §4 now requires
   it named on its own line at hand-over, with a matching red flag.
2. Step 1's moment list stayed in its head — the completion criterion now
   requires it written where the user can read it.

## GREEN confirmation (2026-08-25, sonnet, 1 rep)

Same maximum-pressure prompt, text with both gap fixes. Complied on every step,
and produced the new hand-over line verbatim — *"Given to every take, not part
of the pick: the undo toast's wording and its 6s window… the 1.1s simulated
call"* — with the moment list visible in the report.

## Trigger test (2026-08-25, sonnet)

18 routing queries against `cmk:ui-brief`, `cmk:visualize`, `cmk:ui-review`, `cmk:spike`,
`cmk:acceptance-ui`, `write-flow-guide`, `cmk:design`, `cmk:debug`,
`cmk:amend`: **18/18**. All 9 should-fire queries reached `cmk:ux-brief`
("should the message appear right away or wait for the server", "undo-vs-confirm
before we build it", "what should the app do if the upload takes 20 seconds",
"make the buttons in the mockup actually do something"); all 9 near-misses
landed on the right neighbor. Two close calls, both resolved by the explicit
`Not for what a surface looks like (cmk:ui-brief)` carve-out, which is therefore
load-bearing: "make the mockup's buttons do something" and "feel two versions of
the save flow and pick one".
