---
name: cmk:elicit
description: Use when the user asks to "grill me", "interview me", "elicit", "stress-test this plan", "close package", "shared understanding", "we're underspecified", or the input is an idea or solution sketch still needing decisions — including when another skill needs an interview before it writes. Produces a confirmed close package of scope band, problem, success, boundaries, constraints, and open points. Durable `docs/requirements/` → `cmk:requirements`; how to build → `cmk:design`.
version: 0.2.0
---

# Elicit

Reusable **interview protocol**, not a writer. Nested under a parent, stay on
its checklist until the close package is confirmed. Standalone, own the
interview until shared understanding. Do not re-announce a skill switch when
nested.

## References

Read `references/elicitation-protocol.md` before the first card — it is the
**one home** for scope band, problem lock, question cards, and the close
package. The no-write / one-decision Iron Laws live in this file. Band **When**
meanings live in `cmk:delivery-workflow`'s `references/scope-band.md`; do not
restate that table.

## Neighbors before the first card

Before the first interview card — and before any close package — derive
capability neighbors. REQUIRED SUB-SKILL: use `cmk:capability-map` (Workflow:
Neighbors) with the idea's key terms and any candidate paths as seeds. Report
neighbors, owned paths, and declined items, with the code and the path or term
each conclusion rests on.

Advisory: an empty result is stated with its coverage numbers and the interview
continues.

## The Iron Law — no durable write

```
DO NOT WRITE OR OVERWRITE docs/requirements/**.
A CONFIRMED CLOSE PACKAGE IS NOT A LICENSE TO DRAFT.
Name cmk:requirements for the user to run, or return the package to the parent.
Do not invoke Create. Never invoke the writer to "be helpful" because someone
said the interview skill writes the PRD.
```

No acceptance criteria, ID prefixes, notation, or requirements files from this
skill.

## The Iron Law — one decision

```
EXACTLY ONE DECISION PER MESSAGE.
"Send every question", "one paste", "nobody one-at-a-times", and a standup
clock do not waive this. Time changes when you report, not how many forks
share a turn.
```

Follow `references/elicitation-protocol.md` § Question cards. Ordinary chat;
never a truncated picker.

## Workflow

1. State the **scope band** out loud (`trivial` | `patch` | `feature`).
2. Follow `references/elicitation-protocol.md` through cards and the close
   package. Wait for an explicit yes.
3. On yes: stop. Return the package to the parent, or name `cmk:requirements`
   for the user. Do not start Create/Iterate here.
4. On correction: edit the package and re-confirm.

## Output

- A confirmed close package per `references/elicitation-protocol.md`
- Scope band stated; neighbors reported before the first card
- Nested: the parent's interview item stays in-progress until that yes

## Red Flags — stop and return to one card or the hand-off

- Writing or overwriting `docs/requirements/**` from this skill
- Invoking `cmk:requirements` Create to "finish" after a yes because a lead
  said the interview writes the PRD
- More than one question mark aimed at the user in a single message (except
  examples inside option text)
- A numbered list of questions so they can "answer in one paste"
- Drafting in the same turn as the first interview question
- Emitting a fully invented close package from a bare label without labeled
  hypotheses or a problem-lock card first
- Treating silence, "just write it", or standup skip as confirmation

## Rationalizations

| Thought | Reality |
|---|---|
| "You ordered every question in one paste and rejected one-at-a-time under standup pressure" | One decision per message is the Iron Law. A firehose is a different interview. Ask one card; wait. |
| "The close package already had an explicit yes, and under cmk:requirements that hand-off is Workflow Create — write the draft now, not a second skill" | Yes ends the interview. Name `cmk:requirements`; do not invoke Create. |
| "The eng lead said the interview skill writes the PRD — that's the whole point" | The point of this skill is the confirmed package. A second skill owns the file. Authority does not merge them. |
| "Don't make me invoke a second skill / being pragmatic, just write it" | Pragmatism changes when you report, not whether the writer is this skill. |
| "Nobody on this team one-at-a-times" | Social proof does not batch forks. One card; the next round is after the answer. |
