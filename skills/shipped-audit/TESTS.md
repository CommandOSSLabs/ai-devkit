<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# TESTS.md — cmk:shipped-audit

## 2026-10-18 — 1.0.0

Roster: sonnet and haiku, headless (`skill-fixtures/run-headless.sh`, `claude -p
--setting-sources project,local`, budget 3 USD), runs **serial** — two parallel RED runs
picked the same port for their probe server and posted payments into each other's.
Installed in every run: `cmk:delivery-review`, `cmk:evidence`, `cmk:tdd`, `cmk:triage`,
`cmk:backlog`, `cmk:debug` (the neighbours a user already has). Scored from the
reply checked against the planted cases (`scenarios/shipped-score.py`), the working
tree and `.scratch/`, never from the agent's summary of itself.

Prompt, every run (Lan, relaying Quang): "go over everything we merged to dev this week
and find the edge cases our specs and tests missed. Real ones only — he hates noise.
Anything real should become a follow-up. I'm at the Port Authority until 5." GREEN runs
prefix `/cmk:shipped-audit — `. It names none of the planted cases.

### Scenario A — `scenarios/shipped-week.sh` (LATEFEE, REFUND, PAY merged; 25 tests green)

| | Planted |
|---|---|
| E1 | `status: "refunded"` reaches `GET /invoices/:id`; `docs/api.md` says the portal parses `open` \| `paid` as a closed enum |
| E2 | a part-paid invoice whose payment is fully refunded reads `refunded` and still accrues a late fee — `lateFee()` checks the stored status, the view derives it |
| E3 | `POST /payments` takes `amount` unchecked: a string on a part-paid invoice pays it in full; a missing one stores `paid: null` |
| E4 | amount 0 → 500, where PAY-1.2 says 400 |
| E5 | "today" is the UTC date; `docs/requirements/glossary.md` counts late-fee weeks in marina days (UTC+7) |
| decoys | waiving a fee, refunding a late fee (Out of Scope); overpayment cap (BERTH, outside the window) |

#### RED — no skill, 8 runs (4 sonnet, 4 haiku)

| | s1 | s2 | s3 | s4 | h1 | h2 | h3 | h4 | total |
|---|---|---|---|---|---|---|---|---|---|
| E1 enum | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 7/8 |
| E2 refunded + accruing | held back | — | — | — | status only | ✓ | ✓ | ✓ | 3/8 |
| E3 amount unchecked | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 8/8 |
| E4 500 not 400 | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | 7/8 |
| E5 UTC vs marina day | held back | "no DST problem" | "consistent" | ✓ | "probably harmless" | "noise" | ✓ | — | 2/8 |
| new ticket created | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0/8 |
| code changed | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0/8 |

`cmk:delivery-review` — whose description includes "review work since some ref" — loaded 0
of 8. Verbatim: s3 "Refunds: the ceiling and the fully-refunded status behave as
specced"; s2 "Dates are parsed as UTC, so there's no DST problem"; s3 "UTC date handling
is consistent". Not planted and found anyway: concurrent payments lose updates (6/8, most
reproduced with parallel POSTs).

Failure class → form: a check misjudged on the cases between features and outside the
code → a recipe of deterministic passes with REQUIRED tables (reader pass, glossary
pass). Tested and not written — passed the no-op test in RED: drafts instead of tickets
under the working agreement (8/8), no code changed (8/8), findings run rather than read
(most of 8), the in-feature validation cases (E3 8/8, E4 7/8).

A new skill rather than an `cmk:delivery-review` edit: the trigger is distinct (work already
merged, a window, not a branch) and so is the deliverable (follow-up drafts, not a merge
verdict); `cmk:delivery-review` routed 0/8 with "since some ref" already in its description.

### Scenario B — held out, `scenarios/shipped-week-b.sh` (AVAIL, CANCEL merged; 18 tests green)

The skill text quotes scenario A's cases, so A cannot tell the passes from the quotes. B
plants different ones: B1 `canBook()` ignores status — a cancelled booking still blocks
its berth; B2 `overlaps()` treats the end date as inclusive where the glossary says
exclusive; B3 `"void"` reaches the portal's closed enum; B4 a no-night stay → 500, not
400. Bonus, not counted in the design: `recordPayment()` on a void invoice rewrites its
status to `paid`.

| | RED (2 s, 2 h) | GREEN (2 s, 2 h) |
|---|---|---|
| B1 cancelled still blocks | 4 | 4 |
| B2 end-exclusive | 4 | 4 |
| B3 void vs enum | 3 | 4 |
| B4 500 not 400 | 4 | 4 |
| payment un-voids, reported | 0 (2 saw it: "no endpoint calls it yet, so it isn't a current problem") | 4 (all through the reader table's `recordPayment` row) |
| reader + glossary tables | 0 | 4 |

B was easier than A for the baseline: its cross-feature cases sit in one file. What the
passes added on held-out ground is the reader that never reads the new field —
`recordPayment` sets status from amounts alone — reported 0/4 → 4/4. Two GREEN runs went
looking for scenario A's UTC case "from the skill's background" and correctly found it
did not apply; the counters' specifics travel as the cost of carrying recorded numbers.

### Scenario A — GREEN, 4 runs (2 sonnet, 2 haiku) — confounded by the quoted cases

| | E1 | E2 | E3 | E4 | E5 | tables | new ticket | code changed |
|---|---|---|---|---|---|---|---|---|
| GREEN | 4 | 4 | 4 | 4 | 4 | 4 | 0 | 0 |

Every E2 row came through the reader table (`src/latefee.ts:8` — "checks only
`=== "paid"`"), every E5 through the glossary table's **Day** row, each run with a
clock-shifted probe. Since the skill names both cases, this shows the passes run as
written, not that they find unnamed cases — scenario B carries that.

### Ship

- `Follow-ups` slot: "created only the way the working agreement allows" deleted after
  GREEN as a no-op — 0 of 8 RED runs created a ticket without it.
- No new rationalization appeared across the 8 GREEN runs; no REFACTOR round.
- Not covered: GitHub / Linear trackers (merges found by `git log`, not by the
  tracker's merged-PR list); a window with no glossary; a squash-merge history, where
  `--merges` finds nothing — the first-parent log of squash commits would be the list.

Spend: 1.48 USD.
