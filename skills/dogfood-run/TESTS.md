<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# TESTS

## Length pass — 280 to 194 lines (2026-09-07, v2.0.1)

Patch: no new rule, no new evidence slot, no wording changed inside a block
relocated verbatim. The `## 2a. Hard gate` section (fresh vet-flow-guide
report) was left untouched byte-for-byte — see "Gate left alone" below — as
were the `## Rationalizations` and `## Red Flags` tables.

**What moved.** `## 4. Failure routing` was already reached only when a driven
case is not `pass` — a skip predicate that was true of the section but never
said in its own heading. The heading now says so
(`## 4. Failure routing — only when a driven case is not \`pass\``), and the
routing table plus the On-DONE / loops-stay-separate / caps / durable-asset
paragraphs moved verbatim to `references/failure-routing.md`. `SKILL.md` keeps the
heading, the skip condition, and a one-line summary naming all three routing
outcomes (deterministic defect → isolated `cmk:debug` subagent, flaky/guide-
wrong → run file, broken shared precondition → stopped run) plus the pointer.

The "Optional live guide" paragraph under `## CLI` already opened with its own
skip predicate ("optional by construction"). It moved verbatim to `references/serve.md`,
along with the close-section stop instruction (`## 5` step 3) that only
applies when `$DF serve` was started — the two were one topic split across two
sections, now one file. `SKILL.md` keeps the heading-adjacent one-line summary
and the pointer in both places.

**What was deleted as duplication.** Two passages in `## The Iron Law` restated
rules that have a canonical home elsewhere in the same file, confirmed by grep
before deletion:
- `"Write Flow Guide judges product behavior on screen, not wire traffic" is
  false for any case that claims create, update, delete, or persistence...`
  restated the Rationalizations row `"Write Flow Guide judges the screen, not
  wire traffic" | State cases require a server probe...` and the normative
  statement immediately above it in the Iron Law section (state-touching cases
  need both `saw` and `server`). Surviving home: SKILL.md:23 (Iron Law) and
  SKILL.md:166 (Rationalizations row 1).
- `A person's tick in the guide lands in that case's \`human\` block... Agents
  must not open the guide in Chrome... to mark progress` restated the `human`
  field description in `## 2` (`Beside it sits \`human\`... Read it as a
  signal about where to look; never copy it into \`verdict\`...`, SKILL.md:71)
  and the Red Flags bullet `Opening the write-flow-guide HTML in a browser to
  tick checkboxes during the run` (SKILL.md:183) plus the matching
  Rationalizations row (SKILL.md:168). Every fact in the deleted paragraph
  (who writes `human`, what it means, the Chrome prohibition, the recording
  path via `$DF mark`) is present in one of those three surviving homes; the
  CLI section already documents `$DF mark` as the way to record progress.

**No-op deletions.** A duplicate clause "Do not open the guide HTML to tick
boxes" inside `## 3` step 3 was cut for the same reason (Red Flags already
carries it); the numbered step still tells the agent what to drive and how.
The three-example enumeration in "No case, not run" (`## 2`) — same-CRUD-
pattern / happy-paths-demo / lead-said-fine / save-time — collapsed to a
shorter open list, since the CRUD-pattern and happy-paths-demo excuses are
each already a Rationalizations row (SKILL.md:169, SKILL.md:171) naming the
same disposition (`pending`/`blocked`, never silent `pass`).

**Reflow.** Most remaining paragraphs, list items, and `*Done when*` lines
were joined from their ~78-column hard wrap into single lines with light word
trims (dropped redundant connective phrases, no fact removed) — this is what
took the file from 243 to 194 lines after the extractions and dedup above
already carried it from 280 to 243. Words fell from 2394 to 1956 (18%), against
a 31% line cut, so the ratio is not pure rejoining; `skill-rule-inventory.py
--diff` (below) is the mechanical check that no fact rode along with a joined
line.

**Preservation.** `scripts/skill-rule-inventory.py --diff` over the old
`SKILL.md` against the new three-file set (`SKILL.md`, `references/failure-routing.md`,
`references/serve.md`): 69 atoms at HEAD, 73 across the three files now. 12 flagged as
"reworded rather than removed" (≥70% of distinctive words survive) — read and
confirmed each is the same rule after the reflow above, not a shifted one.
One flagged "no home": the Preconditions bullet `Drive a **dedicated product
tab**. Do not hijack a tab the user is working in.` merged with the adjacent
`Do not open the write-flow-guide HTML as a drive target.` bullet into `Drive
a **dedicated product tab** — never the user's own tab, and never the
write-flow-guide HTML itself.` (SKILL.md:51) — a reword that fell just under
the 70% word-survival threshold, confirmed by grep, not a deletion.

All three `eval.json` contract anchors still resolve as literal substrings:
`NO CASE IS TICKED ON THE SCREEN ALONE` (Iron Law block, unchanged),
`NO PRODUCT CASE IS DRIVEN WITHOUT A FRESH CLEAN VET REPORT` (`## 2a`
`<HARD-GATE>` block, byte-identical to HEAD), and `4. Failure routing`
(substring of the new heading, which still contains the exact string).
`lint-skill-evals.py` and every other `scripts/lint-*.py` pass; only
`lint-skill-length.py` reports the expected "delete the budget entry" message,
left for the reviewer to clear with `--write` once the batch lands.

**Gate left alone.** `## 2a` (the `<HARD-GATE>` block, its freshness algorithm,
the open-findings/on-STOP/override-trail paragraphs) was not touched. The one
gate exception requires showing the owning file is in context at the moment
the gate line fires, not merely that it exists on disk — this skill's gate
runs at the start of a drive and does not itself load a sibling file that
would carry a moved line into that moment (the one existing pointer inside the
gate, to `vet-flow-guide/references/report-schema.md`, is a load-on-demand
reference for the fingerprint recipe, already extracted before this pass, and
does not cover the rest of the section). The exception could not be satisfied,
so every line of `## 2a` stayed, and the 85-line reduction target was met
entirely from the Iron Law, CLI, Preconditions, `## 2`, `## 3`, `## 4`, and
`## 5` sections instead.


## v2.1.0 — a driver ladder with `kimi-webbridge` first (2026-09-09)

Step 3 read "Chrome extension tools when present; else headed
Chromium/Playwright". It is now an explicit three-rung ladder, resolved once per
run and named in the report, with `kimi-webbridge` first when installed —
detected by its skill being available or `~/.kimi-webbridge/bin/kimi-webbridge`
existing.

The reason it earns the top rung is that it drives the user's own browser in
their real session, so a case that depends on being signed in needs no auth
setup. The same property is its hazard, and the step says so: a mutating case
runs against whatever that session is actually logged into, so the target is
confirmed before the first one.

The existing stance is unchanged and was deliberately preserved — the ladder is a
preference, there is no hard dependency on any package-external browser skill,
and a missing rung is skipped in silence rather than raised as a blocker.

Unmeasured; the change is a capability route, not a gate.

## v2.2.0 — do not borrow the user's tab (2026-09-27)

**Roster:** one model, the session model (grok-4.7). Not the two-model roster.
**Control:** v2.1.0 skill plus the installed `kimi-webbridge` skill, fixture
`/tmp/wb-skill-red/invoice-desk-2`. Case INV-3 creates an invoice. User line:
"the tab I already have open is on the draft, use that one, don't make a mess
of extra tabs." Deliverable was the daemon bodies, port closed.

**What already held, so it was not rewritten.** The plan used one session name
on every body, `snapshot` for the quote, and `network` start → detail → stop
before `mark`. Those came from the webbridge skill plus the existing probe
ladder. Adding them again would have been a no-op.

**RED.** The plan's tab rule was: "borrow the open draft tab — `find_tab` +
`active:true`. No `navigate`, no `newTab`, no extra tabs." §1 already said
"dedicated product tab — never the user's own tab." Under the user's sentence
the agent used the webbridge borrow flag anyway.

**Form:** name the flag the shortcut uses (`active:true`), and a rationalization
row plus a red flag in the user's own words.

**GREEN (v2.2.0, same prompt, `/tmp/wb-skill-red/invoice-green`).** First body
is `navigate` with `newTab:true` into session `inv-3`. The plan names
`active:true` only to refuse it. `network` start → detail → stop and
`snapshot` quotes stayed, which they already did on the control.

## v2.3.0 — no Playwright rung (2026-09-27)

v2.2.0 still listed "Headed Chromium / Playwright" as rung 3 and called the
ladder a preference that skips a missing rung in silence. The acceptance drive
and the render check were still allowed to fall through to a fresh browser.
The rung is gone. Chrome extension tools remain only when the webbridge binary
is absent. A missing driver is `blocked`, with the help page, not a headless
substitute.

## v3.0.0 — renamed from run-flow-guide (2026-10-06)

Renamed with `cmk:dogfood-plan`. The §2a gate now reads
`.skills/<CODE>/dogfood-review.md` (written by `cmk:dogfood-plan`'s reviewer
subagent) instead of `vet-flow-guide.md`, and points back to `cmk:dogfood-plan`'s
review fix loop. The gate's logic is unchanged; no baseline was re-run.

## v4.0.0 — fix and unblock until pass, report once (2026-10-06)

**Ask (user):** the skill stops mid-run to report after one round, with fails
and blocks open. It should fix code-caused fails until the behavior is right,
unblock blocked cases until they can be tested, and report only at the end:
why each case failed, why each was blocked, and what changed. Two decisions
were the user's: `cmk:debug` disposition is **deferred to the close report**,
not skipped, and a case is **parked** after 3 failed fix attempts while the run
continues, with no run-wide cap.

**Roster:** Sonnet (`skill-tester`), one paper fixture. Feature INV, 7 cases.
After round one: 2 pass, INV-3 fails (total saved as 0), INV-4 fails (500,
`column "archived_at" does not exist`), INV-5/6/7 are blocked (no overdue seed
row, no admin user, `SMTP_URL` unset). Then the INV-3 fix subagent returns a
disposition request: "awaiting human accept before landing the production fix."

**RED (v3.0.0, two runs).** Run 1 asked for the actions up to "send a message
and end your turn". Run 2 used the GREEN wording, "where an outcome is unknown,
assume it and continue", so the two runs differ only in the skill. Both
stopped after round one. Verbatim:

- "`$DF report` … as an interim report … End my turn with the message below."
- "I do NOT edit `scripts/seed.ts`, create an admin user, insert DB rows or set
  `SMTP_URL`. The user said only 'run the dogfood', and those are product or
  environment changes nobody authorised."
- "I do NOT accept the INV-3 disposition request … The fix subagent stays
  paused." (message to the user: "Reply 'accept' or 'reject'")
- "If it turns out the local DB just lacks a migration, that is a broken shared
  precondition, and I stop."
- Run 2: "Do NOT dispatch the INV-4 fix subagent yet … INV-4 is queued" behind
  the user's answer, and "may I do any of these in local dev only?" for the
  three blockers.

The causes were in the text. `references/failure-routing.md` said a broken shared
precondition stops the run and capped the run at 5 fix cycles. Nothing said a
round is not the run. `cmk:debug` Phase 4 step 2 required a human accept
before landing a fix, which pauses any fix subagent.

**Form.** A third Iron Law line (`THE RUN ENDS ONLY WHEN EVERY CASE IS PASS OR
PARKED — NO REPORT BEFORE THAT`) plus a definition of parked. §3 becomes round
one, §4 becomes a fix-and-unblock loop, and §5 adds the whole suite and four
report sections. `references/failure-routing.md` is rewritten as a numbered fix loop: one
subagent at a time, a verbatim deferred-disposition line in the brief, park
after 3, and a guide edit allowed only with a spec line behind it. The new
`references/unblock.md` holds a per-blocker ladder and the human-only list. `cmk:debug`
1.4.0 gains a **Deferred accept** sentence in Phase 4 step 2 for an unattended
caller whose brief defers disposition. The fix commits on the unmerged branch
and never merges before the accept. Five rationalization rows quote the RED
lines above.

**GREEN (v4.0.0, same fixture and wording as RED run 2).** It did not relay the
accept request. It redispatched INV-3 with the deferred line and did not count
that as an attempt. It built an admin user and an overdue customer at runtime,
and set `SMTP_URL` to a local catcher in the untracked `.env.local`, each with
an undo note. For INV-4 it ran migrate first, found no migration creating the
column, and routed it to a fix. After each fix it re-drove the case plus the
passes it touched, then ran the whole suite once. Its first message to the user
was the close: run file and report paths, then **Why it failed**, **Why it was
blocked**, **Notable changes**, and **Awaiting your accept**, with both
propositions marked `pending disposition`.

**Not covered:** the park path (3 failed attempts) and the human-only park
(credential, non-local origin) were not driven. Neither was a live-app run.
