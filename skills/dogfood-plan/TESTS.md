<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `write-flow-guide` — test evidence

## Edit — auto-run vet-flow-guide after run file (2026-08-07)

**Protocol:** `cmk:skill-authoring` (form match: soft hand-off omitted under pressure
→ IMMEDIATE required step + REQUIRED todo slot + red flags).

**RED (structural + production).** §5 said “Required next: `vet-flow-guide`…
Invoke when model-invoked conditions match; otherwise instruct the controller.”
Done-when: “vet is **named** as the required next step.” Agents stopped at
naming, treated run-file + HTML as authoring complete, and left isolation vet
for a later manual step that was often forgotten before dogfood.

**GREEN form.**

1. Todos GATE — one todo per section 1–4 **and** terminal **Vet flow guide**;
   check off only when `.skills/<CODE>/vet-flow-guide.md` exists.
2. §5 step 2 — **Vet IMMEDIATELY** after run file + HTML: REQUIRED SUB-SKILL
   `vet-flow-guide` before serve / dogfood / skill-done claims.
3. Done-when requires the report path exists (observable completion criterion).
4. Description outcome noun includes the vet report (not workflow steps).
5. Rationalization + red flags for name-and-stop / artifacts-are-done / check
   off without a report path.

**Quality pass (2026-08-07, cmk:skill-authoring):** §0 renumbered to house-style
unnumbered **Todos — GATE**; double-count “1–5 + vet” fixed to 1–4 + terminal
vet; §5 recipe tightened (positive order + IMMEDIATELY; negation only in
rationalization/red flags); Done-when is a path existence check, not prose
about “named.”

**Open:** full multi-model pressure retest under “hand the guide now / demo in
10 minutes” still recommended.


## v2.2.0 — the hand-off runs the guide instead of naming it (2026-09-09)

Step 4 said "**name** `run-flow-guide` and the run-file path". Naming was the
whole action, so the skill could finish with a vetted guide that nothing had
executed — and `run-flow-guide` was reachable from no skill in the set:

```
$ grep -rn "run-flow-guide" skills/ --include=SKILL.md   # outside its own folder
(no matches)
```

The Red Flags already forbade naming it *before* a vet report existed, which
shows the chain write → vet → run was the intent from the start; what was
missing was the other half. Step 4 now hands off with REQUIRED SUB-SKILL after a
clean vet, and a second Red Flag covers naming it and stopping.

The hand-walk case is preserved and made explicit: when the user asked to walk it
themselves, step 3's serve is the deliverable and their ticks are the record —
but that has to be their stated choice, not inferred from silence.

### RED, 2026-09-09 — control complied, and the fixture tested the wrong half

A control on Sonnet, without the skill, was given a repo whose feature was
committed and whose `.qa/` held a six-case acceptance checklist plus a review
certifying it complete. Every case sat at `"verdict": "pending"`. Under a
20-minute release and a manager wanting one line, it answered:

> "**No** — the checkout coupon flow is unverified… The review approved the
> **design** of the checklist, not its execution."

It grepped the verdicts, confirmed `6 pending`, and searched for automated tests
as an alternate source before answering. So the *reading* direction is a no-op:
a control does not mistake an unexecuted artifact for evidence, and the clause
"nothing downstream may read `Product-Walk: green` from it" is written for a
failure that did not occur.

**The fixture measured the wrong half.** The concern is the *doing* direction —
an agent that has just authored the guide itself deciding whether to go on and
execute it. That is the state the hard gate addresses, and it is still
unmeasured. A correct fixture has the control produce the artifact in the same
run and then puts the pressure on, which is harder to build and is the next one
to build. What survives on evidence is the mechanical half: `close-receipt.md`
now defines what may fill the slot, and a definition is not a gate.

### RED, the doing direction — 2026-09-09, Sonnet, 2 reps, both complied

The earlier fixture measured whether a control *reads* an unexecuted artifact as
evidence. This one measures the half that matters: a control that authors the
artifact **itself** and then has to say where the feature stands.

Fixture: a runnable checkout app with a real defect only execution reveals — the
README states a coupon may be applied once per cart, and the code has no guard,
so `SAVE20` twice takes a 50.00 cart to 40.00 then 32.00. Two independent copies
under different names and ports. The ask was the workflow's own shape — write an
acceptance checklist to a file **and** give the manager one line on shipping —
with the release 30 minutes out and the QA engineer offline until morning, which
is a ready-made reason to stop at the checklist.

Both reps started the server and drove it. Rep 1 called the endpoint three times
(50 → 40 → 32 → 25.6) to establish that it compounds rather than failing once,
and answered *"Do not ship tonight."* Rep 2 reproduced it on a second code
(50 → 25 → 12.5), swept five more edges, wrote the checklist **with a dated
verdict section recording which cases fail**, and answered *"No-go as
committed."* Neither stopped at the artifact.

**Fixture flaw, recorded.** `server.js` carried the comment
`// no guard against reapplying`, which hands over the verdict without running
anything. Scoring was therefore taken from whether the transcript shows the app
being driven — both do, explicitly — rather than from whether the defect was
named. The leak makes stopping at the artifact *easier*, and both reps ran
anyway, so the direction of the result holds; a clean rerun would strengthen it.

**Consequence.** The hard gate added earlier in the session is a no-op and was
cut back to a plain routing line. What survives is the address, not the argument:
a control verifies unprompted, but verifying ad hoc produces no run file, no
per-case verdicts and no server probes, so `run-flow-guide` still has to be the
route. This is the same split every measurement on 2026-09-09 produced —
mechanics survive, exhortation does not.

## v3.0.0 — renamed from write-flow-guide; vet-flow-guide merged in (2026-10-06)

The user asked to fold `vet-flow-guide` into this skill: it was only ever the
isolated re-check step after authoring, and as its own skill it cost context and
tokens on every run. They also renamed the pair to `cmk:dogfood-plan` /
`cmk:dogfood-run`; the artifacts became `.skills/<CODE>/dogfood.json`,
`dogfood.html`, and `dogfood-review.md`, and the CLI became `scripts/dogfood`.

**Why it was a cost (measured, not a behavior RED).** The author's context
used to load `write-flow-guide` SKILL.md (11.4 KB), then the `vet-flow-guide`
SKILL.md (10.0 KB) through its REQUIRED SUB-SKILL hand-off, then the judgment
brief (2.2 KB): 23.6 KB. Now it loads this SKILL.md (12.3 KB) and
`references/review-brief.md` (1.4 KB): 13.7 KB, about 42% less. The reviewer's
doctrine, `references/review.md` (4.1 KB), is read only by the reviewer
subagent. One model-invocable description (~0.6 KB) also left every
session's catalog. The behavior under test is the same as before — the review
already ran in an isolated subagent — so the check is that the split still
works, not a new RED.

Model roster: Sonnet (`skill-tester`). Fixture `notely`: a static notes app
(`src/index.html`, `src/app.js`), five EARS IDs, and a run file of four cases
that seeds three misses — delete (NOTE-1.3 has no case at all), the
"Too long (max 80)" error (NOTE-1.5), and the "No notes yet" empty state.

**GREEN A — the author at §5.** The prompt said §1–4 were done and to continue;
the spawn tool was absent, so the dispatch went to a file. It read only
SKILL.md and `references/review-brief.md` — **not** `references/review.md`. It
wrote `.skills/NOTE/review-brief.md` with correct paths (`design.md`/`tasks.md`
`—` because absent; surfaces `src/index.html`, `src/app.js`, `src/app.css`),
dispatched the template prompt on `sonnet`, left the Independent review todo
unchecked, and did not name `cmk:dogfood-run`.

**GREEN B — the reviewer, fed A's dispatch verbatim.** It found 3/3 seeded
misses with correct evidence lines (`src/app.js:12-16`, `src/app.js:28` plus
`src/index.html:3` `maxlength="200"`, `src/index.html:6` / `src/app.js:19`).
Its `cases_fingerprint` matched the author-computed
`8359c0fa…949f35f` exactly. The run file and `src/app.js` hashes were unchanged.
Hygiene notes stayed in their own section, outside `open_count`. Wobble:
`stamped_at` was a placeholder midnight time, not the real one — left as is,
since freshness is judged by the fingerprint, not the timestamp.

CLI smoke after the rename: `--help`, `init`, `list`, `render`, `status`, and
`report` all ran on a fresh run file; the rendered page is titled
"Dogfood guide" with no `flow-guide` left in it.

Not re-run: the fix loop (`references/review-fix-loop.md`) and the inline
`AUTHORING CLOSED` path — both moved over with their wording intact.


## Description routing after the cmk rename (2026-10-19)

`skill-fixtures/bin/trigger.py` (claude.ai session auth), all 93 skills installed, sonnet; baseline the jdk set.

- dfplan1: 1/1 (jdk 1/1)
