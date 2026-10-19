# Failure routing

WHEN a driven case is `fail` — read from `SKILL.md` § 4. A
`blocked` case goes to `references/unblock.md` instead.

Re-drive the failed case once from a clean setup, then classify by observation.
**Master** (this controller) owns case selection, evidence slots, `mark`
pass/fail/blocked, and **re-test** after a fix — never hand those to a fix
subagent.

| Observation | Action |
|---|---|
| Deterministic fail on a real Expect / backend assertion | **Product defect.** Run the fix loop below. |
| Flaky: passes and fails across three drives from clean setup | A race is a product defect too. Run the fix loop, and put the pass/fail ratio in the brief. |
| Guide wrong: a stale label or selector, or an Expect the spec contradicts (`docs/specs/<feature>/requirements.md`, the design, a decision record) | Fix the case's authored slots in the **run file** and cite the spec line in its notes. The edit stales `cases_fingerprint`, so run `cmk:dogfood-plan`'s review fix loop yourself, then re-drive. What the app does is never, alone, evidence that the guide is wrong: with no spec line behind the edit, it is a product defect. Do not send guide bugs to `cmk:debug`. |

## Fix loop

1. Master marks `fail` with full evidence (`saw`/`server`) and appends
   `attempt n/3` to the notes.
2. Dispatch **one** isolated fix subagent at a time on the run's branch.
   Never put two in the same worktree. State the model tier. The brief is
   red-capable and nothing more: case id, `req`, try/expect, saw/server, repro,
   and the propositions of earlier attempts with why each failed. It carries
   **no** session history and no long dogfood context. Master does **not**
   patch product code in the walkthrough session.
3. The subagent's brief says **REQUIRED SUB-SKILL: use `cmk:debug`** (and
   **test-first**). Isolation is **not** a free patch without root-cause. The
   brief also carries this line verbatim:
   > This run defers causal disposition to its close report. Write the
   > disposition request, then apply the fix on this branch and commit it
   > marked `pending disposition`. Do not ask the user. Do not write
   > `confirmed`.
4. **On DONE**: restart the app if needed, re-drive the failed case from a
   clean setup, **and** re-drive every already-`pass` case whose `req` the fix
   touched (grep the diff for requirement IDs or the modules those cases
   exercise). A case that regresses is a new `fail`: send it through this loop.
5. Still failing → next attempt, with a fresh subagent and the falsified
   proposition in its brief. An attempt counts only when a fix was applied and
   the re-drive failed. A subagent that comes back blocked (it cannot
   reproduce, or needs a missing precondition) goes through `references/unblock.md` and is
   redispatched without spending an attempt.
6. **Park after 3 failed attempts on one case (Gate 3).** Keep `fail`. Write
   notes starting `PARKED — 3 fix attempts:`, then list the three propositions
   and the architecture question they raise. Move on to the next case. The run
   does not stop, and there is no run-wide cap.

Do not mark untested cases `pass` to clear the board.

**Loops stay separate.** The review fix loop (`cmk:dogfood-plan`: patch run
file → fresh reviewer) is **not** this product-defect dogfood loop. Guide-gap findings
are **not** routed here — the §2a gate should have blocked drive; if a missing
situation is discovered mid-run, treat it as guide wrong / re-enter the review, not as
a product defect. Product defects do not absorb missing-situation findings.

Durable asset for a product fix: the regression test `cmk:debug` already requires
under TDD — not a silent promotion of the whole guide into a new browser
harness. `cmk:acceptance-ui` is the kimi-webbridge acceptance drive, not a second suite.
