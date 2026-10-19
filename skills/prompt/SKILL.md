---
name: cmk:prompt
description: Turns a short, unclear ask into one paste-ready prompt block — targets, boundaries, evidence, open questions, and a done signal — for a fresh session to pick up. Run it with /cmk:prompt.
version: 1.0.1
disable-model-invocation: true
---

# Forge Prompt

Turn a short, unclear ask into **the prompt it deserved** — one question at a time, in the language the user picks, ending in a block they paste into a fresh session.

**Where this sits:** nowhere in a chain — independent of `cmk:scope`, `cmk:interpret`, and every lane. It produces one artifact and stops; the receiving session decides for itself what the work is and how to open it, by design, not by omission. It also runs happily beside `/cmk:interpret` in a parallel window — hand that window the finished prompt and nothing else, no interview trail, no reasoning, so it reads the artifact cold.

**Any subject.** Code is the common case, not the boundary — a migration, a document, a dataset, a vendor conversation, a decision to be made elsewhere can all be forged.

## The Iron Law

```
NAME WHAT IT TOUCHES. NEVER PRESCRIBE WHAT TO DO ABOUT IT.
```

Two halves, two different failures — and a prompt can carry both at once. Miss the first and the receiving session **guesses the object**: wrong-target action rises from **9.6% to 75.1%** as target identity blurs, and **55.8–67.8%** of acted runs cross a boundary nobody wrote down. Miss the second and it **stops looking**: handing a downstream agent your reasoning and your chosen direction helps up to a threshold, then converges it prematurely on your assumptions instead of on its own reading of the territory.

<HARD-GATE>
Write NO code, edit NO project file, and begin NO part of the work the prompt describes. This skill asks questions and produces one artifact. Doing the work — including deciding what the work is — belongs to the session that receives it.
</HARD-GATE>

## What it closes, what it leaves open

**It closes the *what*. It records the *how* as open.**

| Closed here | Left open |
|---|---|
| The outcome the user wants, in their words | Which approach, pattern, or library gets there |
| Which exact objects it touches | How those objects should change |
| What must not be touched; what must keep working | What order to do anything in |
| What evidence already exists | What the receiving session should do first |
| What would count as done | Whether this is a bug, a feature, or a spec change |

**Never recommend. Never decide.** A question the user cannot answer becomes an `Open` line in the prompt, not your pick. Recommending is what turns this into a design interview — and that interview belongs to whatever session receives the prompt.

## Setup — once, before the first question

Ask both in English; the interview language is not chosen yet. A one-tap picker is fine **here** — this is setup, not an interview card.

1. **Interview language.** Offer **English** and **native / other** as equal first-class choices, with no default. When the user has already written in a non-English language, propose that one and let them confirm in a tap — still showing English as an equal option. From the loop onward, every question, label, and explanation is in the chosen language. **The forged prompt itself stays in the language of the session that will receive it** — English unless the user says otherwise. Paths, identifiers, and error text stay verbatim.
2. **Where the territory is.** This repository · another codebase the user can point at · outside code entirely. This decides whether you may read the answer instead of spending a question on it.

## The interview

REQUIRED SUB-SKILL: use `cmk:interview` for the **channel** — one question per message in ordinary chat, never a picker that truncates the consequence line, and the open-set stop rule with no fixed round count. Load it when the interview starts. Only the card shape and the ordering below differ; everything about the channel lives in that skill.
**The card.** Leaner than a decision card, because most of these are facts the user already holds rather than forks they must weigh:

```
**<what this pins>** · <short subject>

Thread
- Fixed so far: <what earlier answers already pinned, or "nothing yet">
- This card: <the single thing being pinned now>
- Still open after: <names of what remains>

Territory
- <grounded facts you read, with paths — or "not readable from here", and why>

<the question, in plain language>

↳ <what changes in the prompt if this answer flips>

- <option> — <consequence>        (only when real alternatives exist)
```

The card carries no **Recommendation** slot — see *What it closes, what it leaves open* above.
**Order the questions by where the measured loss is:**

1. **Error information** — WHEN something is reported as misbehaving: the message, the failing command, the request id, the screenshot. Nothing misbehaving? This rank does not apply; start at 2 rather than asking a feature request for its error text
2. **Target identity** — which file, screen, endpoint, job, table, document, dataset, or person
3. **Boundary and environment** — what must not change; which environment, version, account
4. **Done signal** — what the user would look at to say it worked

**Never ask what you can read.** When setup said the territory is reachable, go read it and put what you found in the card's Territory lines. A question the repo already answers spends the user's attention on your homework.
**Stop when no unanswered question would change a line of the prompt** — not at a count.
**Watch the answers, not the counter.** When answers start coming back as "I don't know" or "whatever you think", the useful frontier is behind you: what remains is not the user's to hold. Move it to `Open` and close the interview. Answerable questions fall as a clarification set grows, and success plateaus well before the questions run out.

## The forged prompt — REQUIRED shape

````markdown
```
<the ask, one line, in the user's own words>

What this touches
- <exact path / object / ID>              [confirmed | unconfirmed]

Off limits
- <what must not be touched>
Must keep working
- <what must not regress>

What is already known
- <fact> — <where it came from, and when>

Not yet checked
- <assumption, including any solution the ask took for granted>

Open — ask me, do not assume
- <question the interview could not close>

Done when
- <the observable that settles it>
```
````

Block rules:
- **Every line is a fact, an object, a boundary, an assumption, or an open question.** Nothing about method, order, or next steps belongs in it — no lane, no skill name, no step list, no "start by". A classification is a prescription too: write the symptom and the evidence, and let the receiving session decide whether it is a bug, a feature, or a spec change.
- **Load-bearing first, done signal last.** Attention is strongest at the beginning and the end of a long input and weakest in the middle; the touches-list and the done-line are the two that must never land in the middle.
- **`[unconfirmed]` is information, not a defect.** It tells the receiver exactly where not to guess. A prompt where every line reads `[confirmed]` after a short interview is not more finished, it is less honest.
- **Pointers, not paste.** Every line names something the reader can open — a path, a command, a query, a URL. A block that quotes a file body has spent its best tokens on content the reader could have fetched.
- **Under ~40 lines.** Overflow is a symptom of a target still too broad. Narrow the target; do not compress the prose.

### Worked example

Full four-card run — error information, then target identity, then boundary, done signal left unresolved — in `references/worked-example.md`. Same shape, in the same order, compacted:

```
Empty CSV files are written for accounts whose export runs after a plan downgrade.

What this touches
- src/export/job.ts (runExport)                    [confirmed]

Off limits
- src/export/schedule.ts
Must keep working
- scheduled nightly exports for active plans

What is already known
- "wrote 0 rows, uploaded 214 B" — apps/api/logs, request id 8f2c-4b11; 2026-08-24

Not yet checked
- That the downgrade is the cause. Three of four reports share it

Open — ask me, do not assume
- Whether an empty result should fail loudly or upload a header-only file

Done when
- The downgraded-account fixture stops uploading an empty file, and npm test is green
```

No lane, no step, no claim that this is a bug — only that something is reported as misbehaving and here is the evidence, with the suspected cause under *Not yet checked* and the one open fork left open instead of decided for the user.
**Optional record.** When the user wants the trail kept, write the block plus the question-and-answer history to `.skills/prompts/<slug>.md`. What gets pasted is still the block alone.

## Hand it over

1. Render the block in a code block so it copies cleanly.
2. Below it, in the **interview language**, say in one or two lines what this prompt commits them to and what it deliberately leaves open. When the block runs long, name the two or three highest-blast lines instead of summarising. They must not paste a prompt in a language they chose not to decide in.
3. Stop there.

## Rationalizations

| Thought | Reality |
|---|---|
| "I know what they should do — I'll put it at the end as a hint" | That is the one thing this skill exists not to do. A downstream session converges on a handed-over direction instead of testing it against the territory |
| "Naming the lane is just helpful routing" | A lane name is a conclusion wearing a label. State what is true; let the receiver classify |
| "They said it's a bug, so I'll write bug" | They reported a symptom. Write the symptom and the evidence and let the reader decide what it is |
| "The user said what they want — that's the target" | An outcome is not a target. A path, an ID, or a symbol is the target |
| "The agent will figure out which files" | Then it will pick some. Underspecification does not produce a question, it produces a guess |
| "It's obviously low-risk — Off limits is overhead" | Agents act at the same rate on shared production surfaces as on contained ones. Danger that is not written is danger that is not seen |
| "I should recommend, otherwise I'm handing the work back" | Different skill. `/cmk:interpret` names a pick; this one elicits and records. Recommending here forecloses a decision nobody asked you to make |
| "That's about three questions, which is the budget" | The budget is the open set, not a number. Stop when nothing left would change a line of the prompt |
| "They're tiring — I'll fill in the rest myself" | An invented answer is the exact failure this skill exists to prevent. It becomes `Open` |
| "A picker would be faster than typing this card" | Channel Iron Law. A UI that truncates the consequence line is a different, worse interview |
| "I'll paste the file so the prompt is self-contained" | Every model degrades as input grows, and the middle degrades worst. A pasted body buries the touches-list |
| "The interview is in their language, so the prompt should be too" | The prompt is read by a session that may not share it. The interview language and the prompt language are two separate choices |
| "Everything came back confirmed, so the prompt is ready" | Check whether you asked or assumed. `[unconfirmed]` is a finding |

## Red Flags

Stop and re-read the Iron Law if you notice yourself:

- Writing a skill name, a lane, a step list, or "start with" into the block
- Classifying the request as a bug, a feature, or a refactor inside the block
- Naming your recommendation on a fork the user has not answered
- Writing a `What this touches` line with no path, object, or ID in it
- Producing a block with no `Off limits` line
- Asking the user something the repository answers
- Asking another question after the answers turned into "I don't know" / "whatever you think"
- Marking a line `[confirmed]` that nobody confirmed
- Pasting a file body instead of its path
- Handing over the block without saying what it commits them to
- Offering to start the work in this session

## Completion criterion

Done when the interview stopped on an empty open set rather than a count; every line of the block is a fact with a source, an object with a confirmation mark, a boundary, an assumption, or an explicit open question; the block is under ~40 lines and names no method, order, or next step; and the user has been told, in their interview language, what pasting it commits them to.
