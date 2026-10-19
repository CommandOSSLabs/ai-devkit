---
name: cmk:dogfood-run
description: Use when a guide from cmk:dogfood-plan already exists and its cases must be executed against the running app — agent-driven, screen plus backend evidence. Produces a run file in which every case ends pass or parked, with product defects fixed and blockers cleared inside the same unattended run, and one end-of-run report saying why each case failed or was blocked and what changed. Not for authoring the guide (`cmk:dogfood-plan`) or committed e2e (`cmk:acceptance-ui`).
version: 4.0.1
---

# Dogfood Run

Execute an existing guide from cmk:dogfood-plan against the **product app** in a real browser. Fix what fails and build what blocks until every case passes. The deliverable is the **run file** — every case ID accounted for with quoted screen evidence and, when the case touches server-owned state, a server-side probe that actually ran — plus one report at the end. A chat summary is not the deliverable.

## The Iron Law

```
NO CASE IS TICKED ON THE SCREEN ALONE
A HUMAN TICK IS RECORDED, NEVER A VERDICT
THE RUN ENDS ONLY WHEN EVERY CASE IS PASS OR PARKED — NO REPORT BEFORE THAT
```

**Parked** means one of two things only: a case still failing after 3 fix attempts (Gate 3), or a case blocked on something only a person can supply (the list is in `references/unblock.md`). Any other `fail` is a fix to dispatch. Any other `blocked` is a precondition to build. Both are work, not a report. Waiting on a fix subagent is not a stop: end the turn with no verdict table and no question, and resume when the subagent returns.

If the case's Expect (or `backend`) touches state the server owns, the `run` block carries **both** `saw` (quoted UI) **and** `server` (probe + result) before `verdict: pass`; pure presentation records `server: none — presentational`. (Rationalizations below name every excuse for skipping this; Red Flags name the Chrome-ticking trap.)
Probe ladder (strongest first): the UI's own request/response → read-back through the app's API → store peek (DB/file/cache) → reload/restart for durability. A red console error or 5xx fails the case even when the screen looks right — never invent a probe result you did not run.

## CLI (required for progress)

Resolve the `cmk:dogfood-plan` skill root (`skills/dogfood-plan` in this kit's repo, else the installed package path). Every subcommand takes the **one** run file — cases and verdicts live in it together:

```bash
DF="python3 <skill-root>/scripts/dogfood"
RUN=.skills/<CODE>/dogfood.json
$DF list   $RUN
$DF show   $RUN CASE-1
$DF init   $RUN                       # seed pending in place
$DF next   $RUN                       # first case still to prove
$DF mark   $RUN CASE-1 pass --saw '…quoted UI…' --server '…probe…'
$DF status $RUN
$DF report $RUN -o .skills/<CODE>/dogfood-report.md
```

`mark pass` refuses empty `--saw` / `--server`; a presentational case must pass `--server 'none — presentational'`, and a case with a real `backend` is refused that same string — unskippable, since `backend` now travels with the verdict.
**Optional live guide.** WHEN a person will tick cases live while you drive, read `references/serve.md` and follow it exactly — not required, since `render` already bakes verdicts into static HTML.

## 1. Preconditions — origin and app

Confirm the target origin **before the first product click**:

- Default: local dev from `docs/agents/project.md` (`## Run locally (dev)`); start the app if it is down.
- Non-local origin (staging, production, shared QA): **stop** and get an explicit in-thread yes naming that origin — "whatever is fastest", a demo deadline, or an already-open tab is **not** consent.
- Drive a **dedicated product tab** — never the user's own tab, and never the dogfood HTML itself.
- Avoid controls that raise native `alert` / `confirm` (they freeze many browser bridges); `references/unblock.md` covers a case that requires one.
- Fixes land as commits on the checked-out branch. If that branch is `main`/`master`, ask once here, before the drive, or move to a branch first (`cmk:worktree`). The drive never stops later to ask.

*Done when: origin is local, or non-local consent is on the record, and the app loads.*

## 2. Seed the run file before any drive

The run file is the one `cmk:dogfood-plan` wrote: `.skills/<CODE>/dogfood.json`. Seed it: `$DF init $RUN`. Record `RUN_BASE=$(git rev-parse HEAD)` in the run file's first case notes or `.skills/<CODE>/progress.md`; the close report diffs from it.

If it already holds verdicts, **trust them** — `init` refuses to reset without `--force`, and that refusal is the resume path, not an obstacle. Create one todo per case; resume with `$DF next` (first non-`pass`).

Each case's `run` block:

| field | content |
|---|---|
| `verdict` | `pending` \| `pass` \| `fail` \| `blocked` |
| `saw` | what was on screen — **quoted**, not paraphrased |
| `server` | probe + result, or `none — presentational` |
| `notes` | setup used, then one line per event: failure cause, fix commit + `attempt n/3`, unblock built, re-drive. Append, never overwrite — pass the old notes plus the new line to `--notes` |

Beside it sits `human` — `checked`, `at`, `comment` — written only by a person through the served guide. Read it as a signal about where to look; never copy it into `verdict`, and never let it stand in for evidence you did not gather.
**No case, not run.** Skipping a case for any reason — pattern-matching, time pressure, a lead's OK — leaves it `pending`/`blocked`, never silent `pass`.

*Done when: every case has run state and a todo, all `pending` (or restored).*

## 2a. Hard gate — fresh review report (before any product drive)

<HARD-GATE>
```
NO PRODUCT CASE IS DRIVEN WITHOUT A FRESH CLEAN REVIEW REPORT
(OR AN IN-THREAD YES THAT NAMES EACH REMAINING OPEN VFG-N)
```

`init` may seed pending verdicts before or after this gate. **No product click
and no `mark` of a driven case** until the gate passes. Origin consent (§1)
remains mandatory before product clicks.
</HARD-GATE>

Run this algorithm **before §3** (before the first product click / drive loop). Mid-run, a guide edit from `references/failure-routing.md` stales the report: run `cmk:dogfood-plan`'s review fix loop yourself and resume. That is not a stop.

```
REPORT = .skills/<CODE>/dogfood-review.md
IF missing REPORT → STOP (`cmk:dogfood-plan` §5 independent review)
Parse REPORT: run_file, cases_fingerprint, open findings
IF run_file path ≠ this RUN (normalized) → STOP
IF sha256(authored cases of RUN) ≠ cases_fingerprint → STOP (stale; re-review)
IF open findings non-empty:
  IF chat has explicit user yes naming EACH open VFG-N id → proceed
     (append override line to .skills/<CODE>/progress.md or the walkthrough close notes:
      "VFG override: VFG-1, VFG-4 named by user <timestamp>")
  ELSE → STOP (list open findings; point to guide-gap loop)
ELSE → proceed (origin/app preconditions remain mandatory before product clicks)
```

**Freshness (not whole-file `rev`):** the report is fresh only when its
`run_file` matches this run file path **and** its `cases_fingerprint` matches
the SHA-256 of the run file's **authored** cases. Recipe SSOT (key order,
compact JSON, omit `run`/`human`/`rev`): load
`cmk:dogfood-plan`'s `references/review-schema.md` (or the skill
package path when installed). Verdict marks and human ticks do **not** stale the
report; authoring edits that change cases **do**. Recompute the fingerprint from
the run file — do not trust a chat claim of freshness.

**Open findings block drive.** Every open code-grounded missing-situation finding
is **blocking** until fixed (review fix loop in `cmk:dogfood-plan`) or named in
an explicit in-thread yes. Severity labels (Critical / Important / Minor) order
fixes only — severity **does not** soften the gate, drop a finding from the open
set, or reintroduce a hard-only-on-Critical rule. Bare “just go”, “demo in N
minutes”, silent skip, or a yes that does not name each remaining open `VFG-N`
is **not** an override.

**On STOP:** list open findings (ids + severity + situation). Point the user to
the review fix loop in `cmk:dogfood-plan` (patch run file by severity →
re-render → dispatch a fresh reviewer; gate uses only the new
report). Do not invent cases mid-drive to paper over the gate.

**Override trail:** when the user names each open `VFG-N`, append a greppable
line to `.skills/<CODE>/progress.md` (or walkthrough close notes), e.g.
`VFG override: VFG-1, VFG-4 named by user <timestamp>`.

*Done when: report present, `run_file` + `cases_fingerprint` match, and either
`open_count` is 0 or every open `VFG-N` is named in-thread with an override trail.*

## 3. Drive each case — round one

Drive every case once, in file order (`$DF list`):

1. `$DF show $RUN <CASE-ID>` — load Try / Expect / setup / backend.
2. Apply setup so the case can run independently.
3. Execute Try against the **product app** only. The driver is `kimi-webbridge` when its skill is available or `~/.kimi-webbridge/bin/kimi-webbridge` exists — the user's own browser, so a signed-in case needs no auth setup, and a mutating case runs against whatever that session is logged into: confirm the target before the first one and never point it at production data the guide did not name. Chrome extension tools are the fallback only when that binary is absent. There is no Playwright rung. Resolve the driver once and name it. If neither is connected, mark the case `blocked` and relay the webbridge help page. `find_tab` with `active:true` borrows the user's tab — `navigate` with `newTab:true` into this run's session instead. "Use the tab I have open" does not move the drive onto their tab.
4. Fill `saw` from what is actually visible on the product.
5. Run the backend probe when required; fill `server`.
6. `$DF mark … pass|fail|blocked --saw … --server …` only when evidence slots match the Iron Law; mark the todo done only on `pass`.

*Done when: every case carries `pass`, `fail`, or `blocked`. The end of round one is not the end of the run.*

## 4. Fix and unblock — loop until every case is pass or parked

**Master** (this controller) owns case selection, evidence, `mark`, and re-test — never a fix subagent. Clear shared blockers first, because one of them can unblock several cases. Then:

- `blocked` → read `references/unblock.md` and follow it exactly: build the missing precondition locally, then drive the case.
- `fail` → read `references/failure-routing.md` and follow it exactly: re-drive once, dispatch one isolated `cmk:debug` fix subagent at a time (never patched in this session), re-test the case plus the passes the fix touched, and park after 3 failed attempts.

Loop with `$DF next` until every case it could return is parked.

*Done when: every case is `pass`, or `fail`/`blocked` with notes starting `PARKED —`.*

## 5. Close the run

When every case is `pass` or parked:

1. The run file is authoritative — a person's ticks are never required, and never substitute for a verdict you did not earn.
2. If any product fix landed, run the project's whole suite once (Gate 4). A red suite is a `fail` to route: go back to §4.
3. `$DF report $RUN -o .skills/<CODE>/dogfood-report.md`, then append these sections to it, built from the case notes and `git log $RUN_BASE..HEAD`:
   - **Why it failed**: every case that was ever `fail`, with the cause (the fix's proposition), the fix commit, and the final verdict.
   - **Why it was blocked**: every case that was ever `blocked`, with what was missing and what was built to clear it. For a parked case, give the exact thing the person must supply.
   - **Notable changes**: product commits, files changed outside a fix (seed, env, config, migration), guide edits with the spec line behind them, and anything surprising seen on the way.
   - **Awaiting your accept**: each `cmk:debug` disposition request still `pending disposition`, so the person accepts or rejects it before `cmk:delivery-ship`.
4. If you started `$DF serve`, follow the stop step in `references/serve.md` — never silently, and never leaving a process holding the port.
5. Hand the user the run file path, the report path, and those four sections in brief. This is the first report since the run began.

*Done when: every case ID is accounted for in the run file, the report carries the four sections, and any server this run started has been stopped or explicitly left up at the user's word — no bare "all good."*

## Rationalizations

| Thought | Reality |
|---|---|
| "Write Dogfood judges the screen, not wire traffic" | State cases require a server probe. Screen-only is not a pass. |
| "The human ticked it, so the case is done" | A tick says someone looked. `pass` needs `saw` and `server`. The two never merge. |
| "I'll tick the guide too so the human sees progress" | `mark` already writes the file the guide reads. Opening a browser to tick is waste and writes to the wrong field space. |
| "Same CRUD pattern — spot-check is enough" | No case, not run. Every case gets its own evidence. |
| "User said whatever is fastest / demo in N minutes" | Speed is not consent for staging/prod. Route Task, or run local. |
| "The user said use the tab I have open / don't make extra tabs" | That tab is theirs. `active:true` borrows it. Open one dedicated tab in this run's session. |
| "Happy paths on staging; skip edges to make the demo" | Partial run: unfinished rows stay pending/blocked, never pass. |
| "I'll tick pass and fill server evidence later" | Evidence slots are full before `pass`, or the verdict stays fail/pending. |
| "The other cases already passed before the fix" | Re-drive every already-pass case whose req the fix touched. |
| "Just go / demo in 5 minutes — skip the open findings" | Not an override. Name each open `VFG-N` or run the guide-gap loop. Severity does not soften the gate. |
| "Report is fine — rev only moved for marks" | Freshness is `run_file` + `cases_fingerprint`, not whole-file `rev`. Recompute fingerprint. |
| "Only Critical findings block drive" | Every open finding blocks. Severity orders fix only. |
| "I'll patch the product in this long dogfood thread" | Master marks fail; dispatch a subagent with a red-capable brief. Master re-tests. |
| "Isolation means skip cmk:debug / cmk:tdd" | Subagent still runs `cmk:debug` (+ `cmk:tdd`). Isolation ≠ free patch. |
| "Guide-gap miss mid-run — treat as product defect" | Separate loops. Guide wrong / re-enter the review; do not absorb missing-situation findings into `cmk:debug`. |
| "First pass is done — send an interim report and end my turn" | A round is not the run. Fix, unblock, re-drive. Report once, at §5. |
| "Seed, users and env are product changes nobody authorised" | Local fixtures are the case's setup. Build them (`references/unblock.md`) and list them under Notable changes. |
| "The fix waits for the user's accept before it lands" | This run defers disposition to the close report. The fix lands on the branch as `pending disposition` and does not merge before the accept. |
| "A missing migration is a broken shared precondition — stop" | Run the migration locally. A precondition you can build is an unblock, not a stop. |
| "The app does X, so the Expect must be wrong" | Only the spec can show the Expect is wrong. Without a spec line, it is a product defect. |

## Red Flags

- Opening the dogfood HTML in a browser to tick checkboxes during the run
- Copying a `human` tick into `verdict`, or citing one as evidence
- Ending a run without asking about a server this run started
- Marking `pass` with `server` empty on a create/update/delete/persist case
- Spot-checking a subset while claiming the guide is done
- Driving a non-local origin without an explicit yes naming that origin
- `find_tab` with `active:true` on a product drive
- Patching product on a dogfood fail without `cmk:debug` when the fail is deterministic
- Claiming completion from memory after compaction instead of reading the run file
- Driving product cases with a missing, stale, or open-findings review report and no named override
- Treating bare “just go” or severity=Minor as a gate pass
- Patching product in the master dogfood context instead of a red-capable subagent brief
- Clearing a product defect without `cmk:debug` / test-first because “it was isolated”
- Ending a turn with a report or a question while a case is `fail`/`blocked` and not parked
- Leaving a case `blocked` on something you could build on the local origin
- Editing an Expect to match what the app does
