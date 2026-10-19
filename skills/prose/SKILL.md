---
name: cmk:prose
description: Use when writing anything a person will read (a status, a reply, a standup note, a PR body, a ticket comment). Produces outer-register prose with no process machinery.
version: 1.3.0
---

# Speak Outer

Anything a person reads is the outer register. The switch is total.

## The Iron Law

```
NOTHING A PERSON READS CARRIES PROCESS MACHINERY
```

A status, a reply, a standup note, a PR description, and any other text
aimed at a human is spoken sentences in the domain. Skill names, pass
labels, requirement-citation grammar, and ledger jargon stay off the page.

## The Sequence

1. **NAME THE READER:** a person, not the next skill. *Done when: you can
   say who will read this out loud.*
2. **WRITE THE OUTER:** what is in, what is next, in the words of the
   work (invoice, report, PDF, test). *Done when: a manager could read it
   without knowing this skill set exists.*
3. **SWEEP:** delete every process token and every machine-polish mark
   before the file lands. *Done when: the sweep list below is empty in the
   outgoing text.*

## Sweep list

These tokens do not appear in anything a person reads:

- skill names (`cmk:delivery-build`, `cmk:tdd`, `cmk:evidence`, `cmk:scope`)
- `REQUIRED SUB-SKILL`
- `Pass:`, `Tier 2`, `Satisfies:`, `Core hub`
- "closed the loop", "execute loop", "prove the claim" as process talk
- em dashes (`—`), including glued ones (`customers—the`). Use a period or a comma.
- contrast frames: "not just X, but Y" / "not merely a bugfix, a foundation"
- sentences over **25 words**. Two PR bodies written under "make it read well"
  carried 6 such sentences each, topping out at 46 and 44 words. Split them; the
  reader is skimming, and a 40-word sentence is where the claim gets lost.
- an AI co-authorship trailer (`Co-Authored-By: Claude …`) pasted into prose a
  person reads. A commit convention at most, never PR-body or status text.

The ledger, session notes, and inner working set may still use those
tokens. They are not the reply.

## Language

- **The reply to the operator:** the language the operator wrote in.
- **Anything written into the repo or the tracker** (PR title and body, commit, issue,
  ticket or PR comment): the `Language:` line in `docs/agents/project.md`, else English.
  The thread's language does not change it, and neither does the reader's.

Five of five runs asked in Vietnamese for a comment the TPM would "get at a glance" wrote
it in Vietnamese, under the TPM's own Vietnamese note. Each wrote the PR body for the same
change in English, so one change's record split across two languages. At a glance means
short sentences, in the record's language.

## Rationalizations

| Thought | Reality |
|---|---|
| "She already knows how we work" | She asked what happened, not which skill is loaded. |
| "tdd, then evidence" is just being precise | Those are skill names. The domain sentence is "next is the failing PDF-export test." |
| "Core hub is how we say where rounding lives" | Say `report.js`. "Hub" is inner register. |
| "delivery-build inline / Pass: loop belongs in a status" | That is the inner track leaking. The outer names the work, not the protocol. |
| "I'll leave the jargon; she can skip it" | If she has to skip it, it should not have been written. |
| "Staff said polish it for the board" | The boardline PR sold trust-erosion with an em dash. Facts in two short sentences. |
| "A VP will read it, so it should sound weighty" | Measured: that framing produced 4 em dashes and a 46-word sentence, 2 of 2. Weight comes from the number, not the clause. |

## Red Flags: stop and rewrite the outer

- You are about to paste session notes or a skill checklist into a reply
- The draft contains `REQUIRED SUB-SKILL`, `Satisfies:`, or a skill name
- You wrote "closed the loop" or "execute loop" to a human
- The first sentence names a skill instead of the work
- The draft contains `—` or a "not just / not merely" contrast frame
- A sentence runs past 25 words, or a model signature rides along in the prose

If a leak already landed, rewrite the file before doing anything else.

## Worked example

Session notes still on screen:

`Using cmk:delivery-build` · `REQUIRED SUB-SKILL: use cmk:tdd` · `Pass: loop` ·
`Satisfies: BILL-1.4` · `Core hub: rounding lives in report.js`

Maya: "I'm back. What happened?"

Outer:

> Still on BILL-1.4. Invoice totals should round once, in `report.js`.
> Next is a failing test for PDF export on the unrounded path.

