---
name: cmk:evidence
description: Use when about to say anything that implies success — "done", "fixed", "passing", "works", or any paraphrase — and before committing, opening a PR, closing a task, or reporting a subagent's result.
version: 1.5.1
---

# Prove Claim

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If the proving command did not run just now, in this session, the claim is unavailable to you. An unverified claim isn't optimism — it's a false statement.

## The Gate Function

Before any status claim or expression of satisfaction:

1. **IDENTIFY** — which command proves this exact claim? (Commands come from `docs/agents/project.md`. Missing? Say so, suggest `cmk:repo-config`, and identify the command manually.) When the claim is that some record now *holds* a change — a ticket, a remote, a stored row — the proving command is the **read**, never the write that made it, so IDENTIFY resolves to a pair and the write alone can never satisfy this gate.
2. **RUN** — execute it fresh and complete: the project's whole suite command, not a path- or pattern-scoped subset of it. No cached results, no "it passed earlier". A scoped run's totals are that scope's, never the suite's — quote them as the suite's and the claim is false even though a real command really ran.
3. **READ** — the full output: exit code, failure count, warnings. Not the last line.
4. **CONFIRM** — does the output actually support the claim? If no: report the real status, with the evidence. If yes: make the claim, with the evidence.

Skip any step and you are lying, not verifying.

## Claim → evidence

| Claim | Requires | Never sufficient |
|---|---|---|
| "Tests pass" | Full fresh run, zero failures, output read | An earlier run; a subset; "should pass" |
| "Task gate green" | That gate at the final commit, its scope named: changed units, their dependents, lint against the baseline — or the whole suite with the escalation reason | Quoting it as "Tests pass"; a scope missing a changed unit or a dependent |
| "Build/lint/typecheck clean" | That command, exit 0, zero warnings | A different tool passing |
| "The feature works" | The affected flow driven through the running system and observed (REQUIRED SUB-SKILL: use `cmk:acceptance`; for a product walk, the guide **executed** — `cmk:dogfood-run`'s run file, or recorded human ticks) | Green unit tests alone; a `cmk:dogfood-plan` guide that exists but was never walked |
| "The bug is fixed" | Original symptom re-tested and gone | The code changed |
| "The agent/subagent completed X" | You inspected the diff yourself | The agent's own success report |
| "The ticket is updated / moved / commented" | The record read back after the write — re-read the issue through the tracker's own read command and see the exact change present in it | The write command's success line; exit 0; the fact you ran it |
| "Requirements met" | the docs-only cmk:traceability check is clean (REQUIRED SUB-SKILL: use `cmk:traceability` — task/definition integrity, not ID-in-test greps) AND each acceptance criterion checked off individually against observed behavior | Green tests alone; presence of `CODE-N.M` strings in test files |
| "Verified" written on a ledger or checkpoint | the line names the proving command **and** what that run covered | The ID alone (`Verified: BILL-1.4`); "the suite was green" |

## Regression-proof pattern

A regression test only counts once it has demonstrably caught the bug:

```
write test → passes → revert the fix → test MUST fail → restore fix → passes
```

A test that survives the revert is testing nothing.

## Red flags — stop and run the gate

- "Should work", "probably", "seems to", "I'm confident"
- Satisfaction before evidence ("Great, that's done!")
- Claiming from memory of an earlier run
- A ledger `Verified:` line that is only an ID, with no command and no coverage
- A write command printed a success line and you have not re-read the record it claims to have changed
- About to commit, push, or PR without a fresh run
- Tired and wanting the task over — exhaustion is not evidence

| Thought | Reality |
|---|---|
| "It should pass now" | Run it |
| "I just ran it ten minutes ago" | The code changed since; run it again |
| "The agent said success" | Read the diff |
| "Partial check is enough" | Partial proves nothing about the rest |
| "I ran the tests for the file I changed" | You ran a subset and quoted its count as the suite's. The regression lives in the file you did not pick |
| "Verified: BILL-1.4 is enough — I just ran the suite" | The ID is not coverage. The line names the command and what it covered |
| "I'll batch-verify everything at the end" | Each claim is verified when made; a batch at the end lets earlier false claims stand as fact meanwhile |
| "CI will catch it after merge" | CI runs after the claim ships; the gate is before you claim, not after someone else pays |
| "Different phrasing, so the rule doesn't apply" | The rule covers paraphrases and implications |

Run the command. Read the output. Then — and only then — say it.
