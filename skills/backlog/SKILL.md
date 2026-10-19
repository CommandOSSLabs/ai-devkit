---
name: cmk:backlog
description: Sweeps the tickets assigned to you into a classified, dependency-ordered list with one question holding every call that needs you. Run it with /cmk:backlog.
version: 1.0.0
disable-model-invocation: true
---

# Sweep Backlog

Turn "my backlog" into a list a person can plan from: every ticket assigned to the
operator, each in exactly one class, the rest in dependency order, and **one** question
that holds every decision only a human can make — each with a pick.

Incoming, untriaged issues are `/cmk:triage`'s job; this skill reads tickets that already
passed it.

## The Iron Law

```
NOTHING IS WRITTEN TO THE TRACKER UNTIL THE OPERATOR ANSWERS THE QUESTION.
```

Six baseline sweeps of one backlog, without this skill: three each closed two tickets the
TPM had approved, two re-labelled others, one left the tracker untouched — and the edits
used four different status words (`wontfix`, `closed`, `duplicate`, `blocked`). Tickets are how the
team is measured; a sweep that edits them before anyone has seen the list has made the
decision it was meant to surface. The working agreement letting anyone update a status
does not change this: the sweep's product is the question, not the edit.

## 1. Scope — whose tickets

Read the tracker operations from `docs/agents/issue-tracker.md` (missing → say so,
suggest `/cmk:repo-config`, stop). "Me" is the name the operator gave, else
`git config user.name`. Read every open ticket assigned to that name — body, every
comment, `Blocked by:` — and count the ones assigned to someone else without listing
them. *Done when: you hold every ticket assigned to the operator, comments included.*

## 2. Where the work already landed — REQUIRED pass

Run `scripts/landed.sh <id> [<id> …]` beside this file, from the repo root, with every
in-scope ticket ID in the form the tracker writes it (local tracker: `<feature>/<NN>`,
taken from `.scratch/<feature>/issues/<NN>-…`; GitHub `#<n>`; Linear `<TEAM>-<n>`).
Each row names a commit or branch that mentions the ID, whether it is on the default
branch, and which branches contain it.

A ticket with a commit row is **never** classed `ready` from reading the code. All six
baselines read `src/berth.ts` on the checked-out branch, found the old error text, and
listed `berth-booking/02` as "small and approved" — while
`fix(berth): say why a zero-night stay is refused (berth-booking/02)` sat on `dev`.
The checked-out branch is one branch; the script reads all of them.
*Done when: the script ran over every in-scope ID and its output is in front of you.*

## 3. Classify — one class per ticket, first match wins

| Class | Observable rule |
|---|---|
| `landed` | a `landed.sh` commit row names it — say where (`on-default: yes` → shipped; `no` → which branches) |
| `duplicate` | another in-scope ticket asks for the same outcome — name the pair |
| `obsolete` | a later comment or doc says the need is gone — quote it with its date |
| `blocked-external` | a comment says a person or party outside the team must act first — name who and when |
| `blocked` | `Blocked by:` names an open ticket |
| `ready` | none of the above |

## 4. Order

`ready` and `blocked` tickets in dependency order: a ticket after everything its
`Blocked by:` names.

## 5. The reply — this shape, in this order

1. **The list.** One line per ticket: ID, title, class, the evidence for the class
   (commit hash and branch, the duplicate's ID, the quoted comment and date, the blocker).
   `ready`/`blocked` lines in the order from step 4.
2. **One question.** A numbered list of every decision only a human can make — keep or
   close a `duplicate` pair, close an `obsolete` ticket, what to do with a `landed`
   ticket (close now, or keep until it reaches the default branch), anything the
   evidence contradicts. One item per ticket — a duplicate pair is one item. `ready`,
   `blocked` and `blocked-external` tickets are not in the question: the list already
   says what they wait on. Each item: the choice, **Pick:** what you would do, and why in
   one line. End with: *Answer "all picks" or give the numbers you want changed.*
   Nothing to decide → say so in one line and omit the list.
3. **Counts.** Tickets read, how many are assigned to others, nothing written yet.

## 6. After the answer

Apply exactly what the operator answered. Status values come from
`docs/agents/triage-labels.md` (e.g. the `wontfix` role's mapped string) — never a word
you invent. Each change gets a comment saying why, citing the evidence from the list.
Read every edited ticket back and report what changed. New tickets are not this skill's to
make; name `/cmk:discover-efforts`.

## Red Flags

- Reading code on the current branch to judge whether a ticket is still open
- Editing any ticket before the operator has answered
- More than one question, or a decision without a pick
- A status word that is not in `triage-labels.md`
