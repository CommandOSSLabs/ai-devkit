---
name: cmk:explain
description: Use when someone wants to understand how a feature, component, module, flow, endpoint, job, or change works — or a library, protocol, or concept they need for it — "explain X", "how does X work", "walk me through X", "what happens when", "I'm new to this repo", onboarding, "what does this diff / PR / branch do", "teach me", "quiz me" — produces a code-grounded explainer — a short plain-language answer and, when the subject spans several files, one local HTML page with a runtime-path diagram, a step-through of one example, the surprises, and self-check questions. Not for why a design was chosen (cmk:research) or for picking between options (cmk:interpret).
version: 1.0.0
---

# Understand

Help a person **get** how something works — fast, from the real code, in a form
they can take in at a glance: plain sentences first, then a picture, then a page
they can click through.

## The rule

```
EVERY BOX, ARROW, AND SENTENCE ABOUT THE CODE POINTS TO A file:line YOU OPENED THIS SESSION
```

A hop you did not open is drawn dashed and labelled `unverified` — never guessed.
A clean diagram that is wrong teaches the wrong system.

## Your first reply is the answer

Read the code and answer in the same turn. The user wrote one message; that is
the whole setup.

**Language:** the chat answer and the page — headings, labels, buttons, and
questions included — are written in the language of the user's message. Code,
paths, and identifiers stay verbatim.

Ask first only when the message names no subject you can find, or two real
candidates match equally (`refunds.py` and `refund_v2/`): one question naming
both, nothing else.

## Steps

1. **Trace what they named.** A feature, flow, or endpoint: start where the
   action enters (route, CLI command, UI handler, job) and follow it to where
   its effect lands (row written, response sent, message queued, file changed).
   A single function or class: its body, what it calls, and its direct
   callers — not the whole flow around it. Open every hop. Include the
   shared parts the subject plugs into but does not own — the registry, event
   bus, queue, import, or config that wires it in.
   *Done when: the path reaches the effect and every hop has a `file:line`.*
2. **Size it.** The trace touches 3 or more files → write the page (step 3)
   and the chat answer (step 4). Fewer → the chat answer alone.
   *Done when: you know which.*
3. **The page.** One self-contained HTML file at
   `.skills/explain/<slug>.html` in the repo root (create the folder). No
   CDN, no remote fonts or scripts; readable in light and dark. Sections, in
   order:
   1. **In short** — at most 5 sentences, written to the sentence rules below.
   2. **Map** — the primary figure: the traced path as inline SVG, entry on
      the left, effect on the right, each node labelled with its `file:line`.
      Parts the subject does not own get a second style; `unverified` hops are
      dashed. The SVG scales to the page width (`viewBox`, no fixed width), so
      no node is cut off. REQUIRED SUB-SKILL: use `cmk:visualize` for the figure
      and the page design.
   3. **Walk one example** — one concrete input with realistic values, stepped
      hop by hop with two buttons to step back and forward, labelled in the
      user's language. Each step shows the real code
      excerpt (≤12 lines, with `file:line`) and what the data looks like at
      that moment.
   4. **Surprises** — every place the code behaves differently from what its
      entry point suggests. Each: what happens, what it costs, `file:line`.
   5. **Check yourself** — 3 questions that need the map to answer, each
      answer hidden in `<details>` and citing `file:line`.

   *Done when: the file exists, all five sections are filled, and the figure
   is SVG, not ASCII.*
4. **The chat answer.** Exactly three parts, in this order:
   1. **The gist** — with a page: at most 5 sentences; chat only: at most 8.
      Written to the sentence rules.
   2. **The page path** — when there is one.
   3. **One question** — the hardest from *Check yourself*, or for a chat-only
      answer, one about the subtlest hop — inviting them to answer.

   The walk, the surprises, and the other questions live on the page; the
   chat points to them.
   *Done when: the message has those three parts and ends on the question.*
5. **Their answer.** Say right or wrong in one sentence, cite the `file:line`
   that settles it, and give the correction in one more sentence when wrong.
   No score, no record kept.

## Sentence rules (in every language)

Based on ASD-STE100, softened:

- One idea per sentence; at most 20 words.
- Active voice: name who does it — "the worker calls the gateway".
- One word per thing: once it is "the worker", it is never "the job runner".
- Define a term the first time it appears, in under 10 words.
- Concrete before abstract: the example value first, the general rule after.

Write about the code only. Methodology words (stage, checkpoint, ledger, tier,
mode) and the names of other skills stay out of the user-facing text unless
they ask what to do next.

## When the subject is…

| Subject | Change to the recipe |
|---|---|
| A diff, commit, branch, or PR | Trace the paths the change touches. Map marks changed nodes. The walk shows before → after for the same input. Surprises include behavior that changed for callers outside the diff. Say which range you read |
| A finished build with `.skills/<CODE>/implementation-notes.md` | Add a section **How it was built** after Surprises: per notes entry, what the plan said, what the code showed, what was done instead, and its open `Revisit:` line |
| Not code in this repo (a library, protocol, or concept) | Same shape; the Map draws the mechanism. Every external claim carries its source link; when a claim decides the answer, REQUIRED SUB-SKILL: use `cmk:research` |
| "Quiz me" / "drill me" | One question at a time from the trace, each graded per step 5. Stop when they answer two in a row right, or they stop |
| "Go deeper on X" | X is the new subject — same recipe, new page |

The page stays local. Publish it anywhere else only when the user asks.

## Red Flags

- Opening with questions about language, level, goals, pace, or format
- Teaching the domain in general before reading the code
- A wall of chat prose for a subject that spans 3+ files, with no page
- A diagram node or claim with no `file:line`, or ASCII art as the figure
- Marking the user as having understood something they never answered
- Ending by sending the user to other skills instead of the one question
- Publishing the page to an external surface nobody asked for

**Done when:** the user has the chat answer (and the page path, when sized
for one), every claim is cited, and the message ends on one question.
