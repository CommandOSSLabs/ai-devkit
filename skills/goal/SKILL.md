---
name: cmk:goal
description: Interviews you until what you want an agent to chase unattended is defined, then hands back one paste-ready goal prompt — the outcome, its checks, guards, a verify-every-round loop, and stop lines — for a fresh session on any agent. Run it with /cmk:goal.
version: 2.0.0
disable-model-invocation: true
---

# Forge Goal

Help the user find **what they actually want** an agent to keep working on, then forge it into **one goal prompt that ends** — one question at a time, in the language they write in, ending in a block they paste into a fresh session on any agent, with or without a `/goal` command.

**Where this sits:** beside `/cmk:prompt`, in no chain. That one forges a prompt for a session a person will steer; this one forges a goal for a run nobody steers. Nobody answers questions mid-run, and whoever judges it — a separate model, the agent itself, or the user in the morning — sees only what the run printed.

## The Iron Law

```
FIND THE WANT BEFORE THE CHECK.
EVERY DONE LINE IS SETTLED BY OUTPUT THE RUN PRINTS.
```

Two halves, two recorded failures. Skip the first and the goal chases what the repo makes easy to check: asked to make a small web app "better", two unskilled runs offered lint, README and path traversal, one recommended lint — the user wanted the settings page usable on a phone. Skip the second and the run never ends, or ends on its own say-so: Claude Code's `/goal` judge "doesn't run commands or read files independently", and a goal that "renders correctly at 375px" in a repo with no browser is a line nobody can settle.

<HARD-GATE>
Edit NO file and start NO part of the goal's work. You read, you ask, you run checks that change nothing. The work belongs to the run.
</HARD-GATE>

## 1. Read before you ask

Read what answers itself: the files the ask names, `package.json` scripts / `Makefile` / CI config, the test and bench commands that exist, and the code those checks exercise plus whatever calls it. Find callers with a pass, not a guess — `grep -rn "<function or file the ask names>" .` — and read every file it prints. Contract comments (`Do not rename fields`, `published contract`) live where code is consumed, not where it is measured.

**Never ask what you can read.** What you found goes in the card's Territory lines.

**Done when:** you can name the commands that could prove done, the objects the ask touches, and every caller the grep printed, with paths.

## 2. The interview

REQUIRED SUB-SKILL: use `cmk:interview` for the **channel** — inline chat, open-set stop. **One card per message, in the language the user writes in**; the next card waits for the answer. Its card shape does not apply; use this one, written out in your reply text with every label translated into the user's language (loading the sub-skill shows the user nothing):

```
**<what this pins>** · <short subject>

Thread
- Fixed so far: <earlier answers, or "nothing yet">
- This card: <the one thing being pinned>
- Still open after: <what remains>

Territory
- <facts you read or ran, with paths>

<the question, in plain language>

↳ <what changes in the goal if this answer flips>

- <option> — <consequence>        (only when real alternatives exist)
```

**No recommendation, no pre-filled default to accept.** Options carry consequences, never a pick. A proposed set the user only has to approve ("I suggest these three guards — A to accept") is a pick.

**Card order** — skip a card only when an earlier answer already pinned it:

1. **The want** — what they are trying to change, and what will be different for them when it is done, in their words. When the ask is vague ("make it better"), ask what bothers them now; never answer with a menu of what the repo makes checkable.
2. **One objective** — when the want holds outcomes that do not depend on each other, say so and ask which one this run is. The rest come back as separate goals.
3. **The bar** — the state or number that means done, turned into a check: a command that exits, plus the output that proves it. When no command can show it (how a page looks, "feels faster"), say so; the user names a check they accept or moves the criterion out.
4. **Guards** — what must not change, and what the run may touch: files, dependencies, commits, a branch.
5. **Stop calls** — which situations need a person instead of a guess.
6. **The bound** — how many rounds or hours.

"Don't grill me" means fewer cards, never zero: the want, the bar and the bound are theirs. "Your call" on **how** to do the work is right — method stays out of the goal. "Your call" on anything in cards 1–6 is not yours to fill: it becomes a `BLOCKED:` line. An unattended run has no `Open — ask me`; every question closes or becomes a stop.

**Done when:** no unanswered question would change a line of the goal.

## 3. Probe every check

Run each check that changes nothing (tests, lint, bench, `grep`, `git diff --stat`) once, **exactly as it will appear in the goal** — the same string — and record what it printed and how long it took. Each must run, and each DONE check must not pass yet: a check that errors burns rounds on setup; a check already green ends the goal in round one. A missing install step goes to the user, not into a hidden first step. A check that writes (migrate, deploy, seed) or never exits (`npm start`, a server, a watcher) is never run; mark it `[unprobed]`, and a never-exiting one cannot be a check at all. Every check you did not actually run is `[unprobed]` — blocked by a permission, failed on setup, or skipped because its output "is obvious".

**Done when:** every check carries the output you saw it print, or `[unprobed]` — there is no third state.

## 4. Assemble the goal — REQUIRED shape

````markdown
```
GOAL: <the outcome, in the user's words, one line>
WHY: <what is different for them when it is done, one line>

DONE WHEN — all true in the same final round, each shown by fresh command output:
1. `<command>` → <the output that proves it>

MUST HOLD — checked every round:
2. `<command>` → <the output that proves the guard held>

EACH ROUND:
3. Orient: read <progress file> and `git log --oneline -10`, run `<round check>`, show its output.
4. Take the one smallest step toward the first DONE line still failing.
5. Verify: run `<round check>` and every MUST HOLD command, show their output. A failing guard is fixed or reverted before any other step.
6. Record: append to <progress file> the step, the check's output line, and the next step. <Commit on <branch> | Leave changes uncommitted>.

FINISH — only when the last round passed every DONE line:
7. Re-run every DONE and MUST HOLD command fresh, in one message, and pair each DONE line with its output. Any line without its output, or any doubt, means not done — go back to EACH ROUND.
8. Then print `DONE:` followed by that pairing.

STOP EARLY — the run is also over when its last message starts with:
9. BLOCKED: <the decision only a person can make> — when <situation from the stop calls>
10. STOPPED: <progress, the last check output, what is left> — after <bound>

READ FIRST: <paths the worker needs — pointers, not pasted bodies>
```
````

Block rules:
- **Every line is the outcome, a check, a guard, a round step, a stop, or a pointer.** No method, no "profile first", no library pick the user did not make.
- **Every DONE and MUST HOLD line opens with a backticked command.** A promise ("desktop still renders", "you verify after") is a note for the hand-over, never a line in the goal.
- **`<round check>` is the cheapest command that moves when the work moves** — usually a DONE command; when the probe showed a DONE command takes minutes, the round runs a faster one the repo has, and FINISH runs the full one.
- **Stops live inside the goal.** A judge keeps answering "not yet" to a worker that stopped politely; "stop and tell me" written anywhere else is a loop until a no-progress guard fires.
- **Numbered lines, under 4,000 characters** — some runtimes collapse newlines, and `/goal` commands cap near there. Over it, the target is too broad: go back to card 2, do not compress.

## 5. Hand it over

Before rendering, check the goal against the interview line by line:
- every guard and stop call the user stated has its own line, none merged away or dropped;
- every guard, commit choice, stop call and bound traces to an answer — one that does not is invented: ask it, or drop it;
- every DONE / MUST HOLD line opens with a backticked command;
- no line says how to do the work — an algorithm, a library, an approach the user did not choose.

Render the block in a code block. Below it — REQUIRED:

```
Probes — one line for every DONE, MUST HOLD and round-check command, none skipped:
- `<command, character for character as in the goal>` → <what it printed just now, and how long>   |   [unprobed] <why>
Run it — paste it into `/goal` where the agent has one, or as the first message of a fresh session; unattended runs need the agent's auto-approve mode
Split off — every goal card 2 set aside, or "none"
Commits you to — the two or three highest-blast lines, in the user's words
```

Then stop.

## Rationalizations

| Thought | Reality |
|---|---|
| "'Better' is vague — I'll list what the repo makes checkable" | Two runs did; one recommended lint. The user wanted the phone layout. Ask what bothers them |
| "I'll propose a default set so they only say A" | A default to approve is a pick. Six of six skill-loaded runs did it; options carry consequences, never a choice |
| "They said don't grill me — I'll pick a sensible target" | Six of six unskilled runs asked nothing and invented 400 ms or 500 ms. Ask the bar |
| "'Check by loading the page' is clear enough" | The judge sees only printed output, and the repo has no browser |
| "'If stuck, stop and tell me' covers stopping" | Outside the goal, no judge reads it as an end. Write the `BLOCKED:` line in |
| "Done lines are enough; the agent knows to test as it goes" | Every v1 goal had done lines and no round protocol. A long run that verifies only at the end declares victory on stale output |
| "The tree is clean, so the guard prints nothing — no need to run it" | Then write `[unprobed]`. Runs reported unrun checks as holding, once from a pipeline the shell had refused |
| "This similar command shows the same thing" | A Haiku run probed `grep 'position:'` and reported it under a different command, one already passing. Run the exact string |

## Red Flags

Stop and re-read the Iron Law if you notice yourself:

- Asking about checks before the user has said what they want
- Two cards in one message, or a card in a language the user did not write in
- Offering a menu of what the repo makes easy, or marking any option as yours
- Writing a threshold, guard or bound the user never gave
- A DONE or MUST HOLD line with no command, or a command with no expected output
- A goal without EACH ROUND, FINISH, or a `STOPPED:` bound
- A stop condition written outside the block
- Reporting a check's result from what it *would* print, or from a different command
- Editing a file, or "just fixing" what the probe found

## Completion criterion

Done when the want and the objective came from the user; every DONE and MUST HOLD line is a probed (or `[unprobed]`) command with its expected output; the block carries EACH ROUND, FINISH, and every stop call and the bound as `BLOCKED:` / `STOPPED:` lines; it is numbered, under 4,000 characters, with no method lines; and the user has the Probes, Run it, Split off and Commits you to lines.
