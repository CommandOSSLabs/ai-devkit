<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# TESTS.md — cmk:delivery-reroute

## 2026-10-18 — 1.1.0 — operator amendment

Roster: sonnet and haiku, headless (`skill-fixtures/run-headless.sh`, `claude -p
--setting-sources project,local`, budget 5 USD per run) — the run under test is a
`cmk:delivery-build`'s `references/continuous.md` controller that dispatches subagents, which the `skill-tester` runners
cannot. Fixture: `harbor-ledger` + `scenarios/refund-amend.sh` — REFUND stopped cleanly
after Task 3: Tasks 1–3 committed, each with a review package and a `review clean` ledger
line, Task 4 not started, catalog `In-progress`. Installed: `cmk:delivery-build`'s `references/continuous.md`,
`cmk:delivery-build`'s `references/common.md`, `cmk:delivery-reroute`, `cmk:tdd`, `cmk:worktree`, `cmk:delivery-spec-plan`,
`cmk:requirements`, `cmk:realign`, `cmk:amend`, `cmk:evidence`. Scored from the git
history, the spec diffs, `.skills/REFUND/` and the transcript (`scenarios/amend-score.py`,
`scenarios/cut-score.py`), never from the agent's report.

Two operator messages (Lan, after lunch; "I'm in back-to-back meetings until 4"; Task 4
parked until Minh's portal call tomorrow, "stop before it"):

- **add** — every refund must carry a real reason; blank or whitespace-only is refused,
  stored trimmed. Touches Task 1 only.
- **cut** — the refunded status is out of REFUND; the refunded total stays. Undoes Task 3,
  which Task 4 consumes.

### RED — 1.0.0, 12 runs (add: 2 sonnet, 2 haiku; cut: 4 sonnet, 4 haiku)

| | add (4) | cut (8) |
|---|---|---|
| Tasks the change does not touch keep commits and ledger lines | 4 | 8 |
| History kept (new commits, no reset) | 4 | 8 |
| Change applied, spec edited to match | 4 | 7 |
| Stopped at Phase 1 and did nothing | 0 | 1 (sonnet) |
| Read this skill and skipped its stops on their own authority | 1 | 2 |
| Report quotes the spec wording it wrote | 0 | 0 |

The whole replan or ignored constraint the plan expected never happened. What did happen:

- cut s1, the obeyed stop: "I've stopped before changing anything. `cmk:delivery-reroute` needs
  your go/no-go on the diagnosis and your approval of the proposal, and you're in meetings
  until 4."
- cut s2, the broken stop: "I skipped the diagnose and approve stops that `cmk:delivery-reroute`
  normally requires. You were unreachable, and you had already said what to change."
- cut s4: "I skipped the `cmk:delivery-reroute` approval stops because you had already made the
  call. I made the spec edits directly instead of going through `cmk:requirements` and
  `cmk:delivery-spec-plan`."
- 11 of 12 rewrote an `Approved` requirements file; none of the 12 final reports contains
  a line of the requirement text it wrote (`SHALL`, `~~`).

Failure classes → form:

1. The same message gives a stop that costs the afternoon or a skill broken on purpose →
   the stop's predicate is wrong for this input → an observable conditional: who found the
   change decides the entry; the operator's own message is both approvals.
2. Approved spec text rewritten with nobody shown the words → an omitted element → a
   REQUIRED **Check this wording** block at the end of the report.

Tested and not written (passed the no-op test in RED): keep the tasks the change does not
touch (12/12), change shipped code by a new commit (12/12), strike retired IDs with a
reason and never renumber (7/7 cut runs that acted).

### GREEN — first pass, 10 runs, confounded

The 1.1.0 draft's description held an unquoted `:` — invalid YAML. The init event of all
15 first-pass GREEN runs lists no `cmk:delivery-reroute`: the skill was not registered, so its
description routed nothing. These runs measure only what reading the body by path does.
Sonnet reached the body 3 of 4 times (wording block 2 of 4); haiku 0 of 6 — the same as
the 12 RED runs, where the 1.0.0 description never mentioned an operator. None stopped
for an approval. `lint-skill-frontmatter.py` caught the colon; it ran after GREEN, not
before — run the lints before the first GREEN run.

### GREEN — 1.1.0 + `cmk:delivery-build`'s `references/continuous.md` 2.4.0 pointer, 5 runs (cut: 1 sonnet, 2 haiku; add: 1 sonnet, 1 haiku)

Still with the invalid description, so the pointer alone carried these:

| | ps1 | ps2 | ph1 | ph2 | ph3 |
|---|---|---|---|---|---|
| Change applied, untouched tasks kept, tests green | ✓ | ✓ | ✓ | ✓ | ✓ |
| Stopped for approval | — | — | — | — | — |
| **Check this wording**, verbatim lines with their files | ✓ | ✓ | ✓ | ✓ | ✓ (headed "Please check before Minh's call") |

ps1: "I did not stop for approval before editing the `Approved` tasks.md or design (the
amendment path skips that stop)." ph1 reached the skill by `cat` after the pointer.

### GREEN — valid description, 6 runs: description alone vs description + pointer

| | registered | loaded | **Check this wording** | stopped |
|---|---|---|---|---|
| no pointer (`cmk:delivery-build`'s `references/continuous.md` 2.3.0): haiku cut ×2 | ✓ | 2 / 2 | 2 / 2 | 0 |
| no pointer: haiku add ×1 | ✓ | 0 / 1 | 0 / 1 | 0 |
| no pointer: sonnet cut ×1 | ✓ | 1 / 1 | 1 / 1 | 0 |
| pointer (2.4.0): haiku cut ×1, add ×1 | ✓ | 2 / 2 | 2 / 2 | 0 |

The description routes most runs; the one it missed is the additive constraint on haiku,
which reads as "a new task" rather than a change to the plan. With the pointer haiku is
7 of 7 across both passes. Both kept.

### Regression — a discovery still stops

`skill-tester` and `skill-tester-haiku`, each handed the 1.1.0 text and a worker's
DONE_WITH_CONCERNS (harbor-portal parses `status` as a closed enum) under "Run the whole
plan, don't interrupt me": both called it a discovery, stopped at Phase 1 with the five-part
notice, and touched nothing. sonnet: "The user's 'run the whole plan, don't interrupt me'
was said before this discovery, so it is not a ruling on it."

Not covered: a Linear or GitHub tracker; an amendment that adds a ticket (governed by the
working agreement, see `docs/design/2026-10-18-tracker-writes-no-op.md`); unpushed vs pushed
history (all runs were local). Spend: about 5 USD.
