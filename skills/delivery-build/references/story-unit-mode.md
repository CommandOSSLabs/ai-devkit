# Story-unit recipes — derivation and barriers

Load this file during Setup (derive) and at every unit barrier.
`SKILL.md` owns the iron laws; this file owns the **recipes**.

- [Leading words](#leading-words)
- [Derive partition](#derive-partition-deterministic)
- [File count](#file-count-preflight-table)
- [Unit table](#unit-table-print-at-setup)
- [Per-unit barrier](#per-unit-barrier)
- [Unit summary contract](#unit-summary-contract-required-slots)
- [Whole-branch review](#whole-branch-review)

## Leading words

| Token | Meaning |
|---|---|
| **review unit** | One non-NFR user story (or merge of stories), one human review stop |
| **Execution-mode** | Plan header; this skill requires `story-unit` |
| **straddle** | Task `_Requirements:` cites two+ non-NFR story numbers → merge those stories |
| **human unlock** | Explicit continue after looking, or a written mode change |

## Derive partition (deterministic)

Run against the feature's `requirements.md` and `tasks.md`.

1. **NFR set** — every `## N` section that contains `**Section-kind:** nfr`.
   - **absent = story** — section without that line is a behavioral story.
2. **Live IDs** — bold `**CODE-N.M**` not inside `~~…~~` strike spans.
3. **ID → story** — story number is `N` in `CODE-N.M` (same N as `## N`).
4. **Task → stories** — for each task, parse `_Requirements:` IDs; drop IDs
   whose story is in the NFR set for **merge** purposes.
5. **MERGE on straddle** — union-find: if a task's non-NFR story set has size ≥ 2,
   merge those stories. Report merge count and straddling task numbers.
6. **Assign tasks** — each task joins the unit of its (merged) story set.
7. **NFR-only tasks** — after step 4 the non-NFR story set is empty:
   - join the unit of tasks listed in `Depends-on:`;
   - if `Depends-on: none` / absent → first unit (lowest story number among units);
   - if Depends-on spans multiple units → join the **latest prereq unit in topo
     order** + report line (never rewrite Depends-on to tidy units).
8. **Unit order** — edge U→V if any task in U has `Depends-on` naming a task in V.
   Topo-sort; tie-break **lowest story number**. Cycle → **hard fail** preflight.
9. **Hard fail preflight** — task with zero parseable IDs; task citing only struck
   IDs. **Empty non-NFR story** (no tasks) → omit unit + report (aligns with cmk:traceability
   W1 — do not promote to hard fail).

**Not inputs to partition:** authored "Human review order", PM waves, Risk labels,
or freeform comments in `tasks.md`.

## File count (preflight table)

For each unit, cardinality of path strings from that unit's tasks:

```text
lines matching:  ^- (Create|Modify|Test):\s*(\S+)
strip trailing :line-range from capture group 2
dedupe exact path string
directory path counts as one (do not expand trees)
exclude Consumes:/Produces: (Interfaces)
```

## Unit table (print at Setup)

```text
unit <k>  stories {…}  "<title>"  <n> tasks  <m> files  merges: <count>
reports: <empty stories | NFR-only placement | straddlers | none>
```

## Per-unit barrier

After every task in the unit is DONE and ledgered:

1. `UNIT_BASE` = base of first task in unit; `UNIT_HEAD=$(git rev-parse HEAD)`.
2. Package `.skills/<CODE>/review-unit-<k>-<base7>..<head7>.diff` (same shape as a task
   package: log, stat, `git diff -U10`).
3. Dispatch **task reviewer** once at **unit scope** (two-verdict) over that
   range, using `references/task-reviewer-prompt.md`. Human is never first
   reviewer of the unit diff.
4. Fix loop until clean (same circuit breaker as tasks).
5. **STOP.** Send the human-facing message using the **Unit summary contract**
   below — every REQUIRED slot filled. Then wait. Do not start the next unit.
   Do not ledger `Unit <k>: complete` until unlock (step 6).
6. Unlock (see `SKILL.md` unlock table).
7. On continue: ledger
   `Unit <k>: complete (tasks …, range <base>..<head>)`.
8. Optional PR into feature branch — never the unlock.

## Unit summary contract (REQUIRED slots)

The STOP message is a **recipe**, not free prose. Under time pressure still fill
every slot. Order is fixed:

```text
## Unit <k> — STOP for human review

**Stories:** {…} — "<title or titles>"
**Tasks:** <list N – work one-liner – requirement IDs>
**Range:** <base7>..<head7>
**Diff package:** .skills/<CODE>/review-unit-<k>-<base7>..<head7>.diff

**Unit agent review**
- Spec: <COMPLIANT | ISSUES FOUND → fixed → clean>
- Quality: <Approved | Needs fixes → fixed → clean>

**Open minors (rolled to whole-branch):** <none | bullet list>
**Merges / straddle notes:** <none | explanation>

I am stopped. I will not start the next unit until you unlock.

- **continue** (after looking) → next unit only; mode stays story-unit
- **stop stopping** / **just run it all** → I write Execution-mode: continuous
  into tasks.md first, then hand remaining work to build-in-waves (chat-only is
  not a mode change)
```

| Slot omitted under pressure | Failure |
|---|---|
| Range or diff package path | Human cannot review the unit |
| Agent verdicts | Human cannot trust agent pre-pass |
| Open minors | Silent discard of deferred findings |
| continue vs mode-change semantics | Wrong unlock; plan header drifts from behavior |
| Explicit "I am stopped" | Agent may narrate and keep going |

## Whole-branch review

After the last unit unlock, `SKILL.md` **After the last unit** still runs
whole-branch agent review from merge-base. Unit human reviews and whole-branch
agent review are not substitutes.
