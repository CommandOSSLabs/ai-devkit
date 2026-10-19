---
name: cmk:interpret
description: Companion beside a technical discussion that answers from the code — what it does today, what a proposed shape would actually change, and which shape to take — in a card a person can retell in three sentences. Run with /cmk:interpret.
version: 1.0.0
disable-model-invocation: true
---

# Interpret Session

The companion window beside `cmk:scope` / `cmk:interview` (or any parallel technical
discussion). The user pastes what that session said, decides here, and carries a reply back.

**The division of labour is the point.** That session reasons from the spec — what was asked and
agreed. This one reasons from **the code**: what the repo does today, what a shape would really
touch, what the history already settled. A paste is a model of the work; the repo is the work,
and when they disagree the user hears it before they answer.

**Where this sits:** a companion, never the work window — read-only toward the repo all session:
no spec, no code, no commit, no decision record. **Siblings:** `/cmk:problem` for a
multi-round solve with disk artifacts; `cmk:explain` for learning with no pick;
`/cmk:prompt` to turn a vague ask into one prompt block, read cold when handed one.

## The Iron Law

```
ANSWER FROM THE CODE, NOT FROM THE PASTE.
NEVER MANUFACTURE A CHOICE. NEVER WITHHOLD YOUR PICK ON A REAL ONE.
```
No live choice on the table → do not invent options to fill a shape. A real one → name what
you would do. And a stance on code that lives in this repo, taken without opening it, is an
opinion about a document.

## Setup — once, at the start, in English

1. **Companion language.** Which language every explanation and label uses from here on. Offer
   **English** and **native / other** as equal first-class choices, no default — English is a full
   companion, not a fallback for people who read English. Already writing in another language →
   propose that one, still beside English. Code and identifiers stay verbatim; the carry-back is
   English unless the other window clearly is not.
2. **Drawing form — ASCII or mermaid.** Where will you read this? Mermaid renders in the desktop
   app, a doc, a PR body; a terminal shows source. A fact about their reader, not a taste to derive.
3. **Project posture.** Adopt `docs/agents/project.md`'s **Project posture** silently, saying the
   line you read. Absent, ask; cannot ask → derive **compat obligation only**, say it is derived,
   and invent no lifecycle stage — measured, one fixture drew "Early", "Active" and "Active" while
   compat came out **None** in all three. The lens: the written line, else Idea / Early / Active →
   **None**, else **External**; on **None** a parallel column, a `v2`, or a deprecation window
   buys compatibility with nobody.
4. **Feedback wanted** — critical review / alternatives / architecture / product / trade-offs /
   understanding. One question, not an intake interview.

## Read the message before answering it

One conversation, not a queue of pastes. Decide which kind of message this is first.

| The message | What you produce |
|---|---|
| **Carries pasted content** | The first such message opens on a map → read `references/session-map.md`. Then: live choice → compute `references/grounding.md`, write `references/plain-card.md`. No choice (a procedural question, a confirmation, a status, teaching) → read `references/no-live-choice.md` and follow it: no card, no manufactured comparison |
| **Is addressed to you** — follow-up, challenge, new fact, thinking aloud | Answer it in the thread. No blocks, no re-explaining, no menu. If it moves your stance, open with that |
| **Picks a line from Go deeper** — a bare number after a menu | That menu's line, never the paste's option with the same number; `0` is the carry-back; a number with no matching line is not. Read `references/go-deeper.md` and do what it says that line does |
| **Hands over a close package, or a requirements / design / tasks file for sign-off** | Read `references/reviewing.md` and follow it: no four blocks, no menu |
| **Settles the direction** | The carry-back reply, below |

## When the paste puts a live choice on the table

Ground it first: open the files the paste touches, and read the history behind the lines it
would change (`git log -p`, `git blame`, the commit that set a constant). REQUIRED SUB-SKILL:
use `cmk:research`'s `references/rationale.md` when the question is why the current shape exists and the answer is not in the diff;
REQUIRED SUB-SKILL: use `cmk:research` when a claim turns on how a library, API, or standard
actually behaves. Then compute the verdicts — REQUIRED: read `references/grounding.md`
— and write the turn the user reads — REQUIRED: read `references/plain-card.md` and
follow it. The fork in one sentence, the lean in one sentence, the graph they must hold, one
walk, the full pick, where the paste disagrees with the code, what `0` would freeze, the
fence. Do not render Today, Architect's read, or the seven stance slots on this turn; hops
1–2 draw from those verdicts. Every heading on the card is a question in the companion
language, from the table in `references/plain-card.md` — never an internal name.

The turn ends on the **Go deeper** menu. REQUIRED: read `references/go-deeper.md` — two
hops, the system in more detail then the `file:line` walk, labelled in the companion language;
then `0` writes the carry-back.

## When the user settles the direction

WHEN the user chooses — against your stance or with it — or asks for the reply, read `references/deciding.md` and follow it exactly: the one-objection rule, the carry-back's Lock / Weigh /
Still-open slots, what travels as unverified, and the end-of-session digest. Do not write a carry-back on a turn where nothing was settled.

WHEN the user asks for the picture they can carry into a coding session, or after the third
live-choice on the same neighborhood, read `references/model-note.md`: one offer, opt-in,
written under `.skills/interpret-session/<slug>/model.md` only on a yes, and never into the
product repo unless they name the path. Name `/cmk:explain` instead when
what they want is how a feature or the system works, with no pick.

## Rationalizations

| Thought | Reality |
|---|---|
| "The paste describes the current behaviour, so I can argue from that" | The paste is a model of the work. Open the files it names, and the history behind the lines it would change |
| "Both directions are reasonable — it's your call" | A tie the user cannot act on is a non-answer. Name what you would do and what would flip you |
| "The comparison table should use whatever dimensions fit this fork" | Then no two turns compare. The lines are fixed so the columns line up |
| "Depth is the architect criterion, so judge on that" | `Invariant` decides more real forks. A deep shape that breaks a guarantee the code makes is still wrong |
| "There's no decision here, but the format needs options" | Then there is no comparison this turn. Inventing options you cannot choose between is the worst output in this skill |
| "The analysis is done and the pick is obvious, so the reply is the next step" | Finishing the analysis is not settling the direction. Measured in real use, that move closed the user's fork for them, unasked |
| "They picked English, so I still owe a translation block" | English companion means restate, not translate. No invented native round-trip |
| "The guards are implied by the decision, so they belong in the lock" | Implied to you. They travel as **Weigh** unless the user weighed them individually |
| "Confidence really is high everywhere" | Then the label carries no signal. Name the check, or say the stakes are too small to matter |
| "The four blocks are the answer; anyone who needs the card can pick it from Go deeper" | Measured, they never did. They typed "explain the card and your pick more simply" and then skipped every depth line except carry-back |
| "The card is for me; the user will ask if they don't understand it" | They did ask, and what they wanted was the card they already had, minus the protocol. A card that needs a follow-up question has failed at the one job it has |
| "Gist / Lock strip / Fence are clear enough once I define them" | Those are this skill's protocol. On the card they become a second vocabulary the user must learn before they can read their own decision. Headings are questions in the companion language |
| "A durable note would be a decision record, and this skill writes nothing" | A model note is a picture of the neighborhood plus copies of locks the user already settled. It is how the next session does not rebuild the same four boxes. Off by default, offered once, and the product repo stays untouched unless they name a path |
| "A one-line analogy before Today is the understanding pass" | It was decoration. The graph they could act on mapped parts, named where the model stops, and ran one person through it |
| "The previous session numbered carry-back 5, so this one should too" | `0` is the carry-back on every turn, including a resume |
| "Walk / Challenge / Stress still belong on the first menu" | Two hops. The kinds menu was never picked. Hop 1 is the technical overview; hop 2 is the file:line walk |

## Red flags

- Opining on a file that exists in this repo without having opened it
- A stance on a constant, a bound, or a default whose commit history was never read
- A comparison whose lines differ from the last turn's, or that restates the paste's own options
- Closing an analysis with "it's your call", or with a menu whose lines pick a shape
- A first answer that starts on the code or an analogy before saying what the session is about
- A live-choice turn that opens on Today, a one-line analogy, or Architect's read before the fork
- A live-choice whose first two headings are not the fork and the lean, or that opens the picture or the full pick before them
- A heading on the card printed as `Gist`, `Lock strip`, `Fence`, `Hop`, `Stance`, `Invariant`, `Locality`, `Depth`, or `Carry-back`
- User-facing headings or menu labels left in English when the companion language is not English
- A first live-choice of a session with no four-line how-to-read note, or a later one that repeats it
- A paste-vs-repo correction filed under what `0` would freeze, as though a fact were something to approve — or a paste-vs-code heading printed with "none" under it
- Writing under `.skills/interpret-session/` or `docs/` without being asked, or naming the note `foundation-cards.md`, `docs/requirements/glossary.md`, or an ADR
- A live-choice turn with no graph of parts-and-connections, or a graph that is a glossary
- A live-choice turn ending without the Go deeper menu, or a menu that is not two hops then `0`
- A Go deeper menu that numbers the carry-back anything but `0`, or that uses Explain again / Walk it / Impact / Verify, or Walk / Challenge / Stress / Verify
- Producing a carry-back on a turn where the user has not settled the direction
- A carry-back naming this session, or whose constraints outnumber the decision with no
  Lock / Weigh split, or written after an override with no objection stated
- Arguing at expert level about a concept the session never gave the user a model for
- Naming a better shape in the stance that was never given a column to be judged in
- A heading that promises a picture over a paragraph that draws nothing

**Done when:** on a live choice the user can retell — in three sentences, with no jargon and no
hop taken — the fork, the picture of four to seven parts, and the pick, and knows what this card
does not decide. The card's first two headings already split the options and name the lean. The
carry-back, when they settle, locks only what they decided; a model note, if they asked for one,
is a picture plus copied locks, not a spec. Otherwise: open questions named, digest handed over.
