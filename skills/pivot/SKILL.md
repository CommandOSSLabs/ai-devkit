---
name: cmk:pivot
description: Produces a disposition ledger when a product pivot puts shipped code at odds with a new vision or architecture. Run it with /cmk:pivot.
version: 1.0.0
disable-model-invocation: true
---

# Assess Pivot Impact

When the product's **intent** changes and the **shipped world** no longer matches, this
skill owns the handoff from "we decided to pivot" to "every live commitment has a
fate." It does not rewrite the vision layer. It produces the ledger that makes a
rewrite honest.

**Where this sits:** after the user has a new direction; **before** `/cmk:vision`
update rewrites `docs/requirements/vision.md` or `docs/design/`. Opposite of
`cmk:realign` (code is truth → fix the spec) and of brownfield `cmk:vision` create
(code is truth → ratify it). Opposite of `cmk:architecture-scan` (vision-neutral
deepening). Mid-plan invalidation stays with `cmk:delivery-reroute`.

## The Iron Law

```
NO VISION OR ARCHITECTURE DOC IS REWRITTEN FOR A PIVOT
UNTIL EVERY CONTRADICTED SHIPPED FEATURE AND LIVE ARCH-N
HAS A USER-CONFIRMED DISPOSITION IN THE LEDGER
```

A deadline, an investor update, a board deck, or "that's decided" changes **when you
report**, never **what must be true** before the project docs claim a new product.

## When this is the skill

Use it when **all** of these hold:

1. The project has a vision or architecture layer (`docs/requirements/vision.md` and/or
   `docs/design/`), **or** shipped features under `docs/specs/INDEX.md`.
2. The user wants a new product direction, new goals, or new invariants.
3. That direction **contradicts** at least one shipped/Implemented feature, live
   `**GOAL-N**`, live `**ARCH-N**`, non-goal, or hard constraint — observable by reading
   those files against the stated intent.

If (3) is false — pure wording, additive goal with no collision — this skill is the
wrong tool. Name `/cmk:vision` (update) for the user and stop.

## What this skill writes

Exactly one durable artifact:

```
docs/requirements/pivot-ledger.md
```

(or `.skills/pivot-ledger.md` if the user forbids a docs write until confirmation —
same shape either way). It never writes `docs/requirements/vision.md`,
`docs/design/**`, or feature `requirements.md` itself.

`cmk:vision` remains the sole writer of the vision layer. `cmk:roadmap` remains
the sole writer of `docs/roadmap/INDEX.md`. After the ledger is confirmed, **name**
`/cmk:vision` (update) for the user to run — agents never auto-run it
(`disable-model-invocation: true`).

## Steps

### 1. Inventory what the new intent collides with

Read, in order: `docs/requirements/vision.md`, `docs/design/system.md` (and any
per-domain files), `docs/specs/INDEX.md`, and every `Status: Shipped` or `Implemented`
feature's `requirements.md` that the new intent touches. Skim the source paths those
specs name when the contradiction is about a concrete module.

Build the candidate set:

| Kind | Source |
|---|---|
| Feature | every `Shipped` / `Implemented` row in `docs/specs/INDEX.md` |
| Goal | every live (non-struck) `**GOAL-N**` |
| Invariant | every live `**ARCH-N**` |
| Non-goal / hard constraint | vision non-goals and scope hard constraints the new intent reverses |

*Done when: the candidate set is written down, each row cites a file path or ID.*

### 2. Write the disposition ledger — before any other durable edit

Write it in the **application repo the user named**, not in the skill-pack
checkout this skill file happens to live in. If the session root and the named
repo differ, `cd` (or write by absolute path) into the named repo. Do not stop
to ask which repo is real when the path was given explicitly.

Fill every candidate row. Disposition is one of:

| Disposition | Meaning |
|---|---|
| **Keep** | still serves the new intent as-is |
| **Adapt** | survives, but must change (routes later to normal spec cycle) |
| **Retire** | intentional removal |
| **Deprecate** | keep temporarily; needs an end date and a migration path |
| **Freeze** | no further investment; do not delete |
| **Carve out** | move to another repo or product |
| **Accept debt** | known contradiction; keep living with it (ADR required later via `cmk:glossary`'s `references/define-domain.md`) |
| **Unknown** | not enough evidence → stop that row; name `cmk:research` or `cmk:spike` |

Each row also records **entrenchment** in one line: shipped to users? public API? data
schema? one-way door already walked? The cost of the pivot is the cost of these
commitments, not the elegance of the new vision.

**Proposed** dispositions are agent-authored. They are not decisions.

*Done when: `pivot-ledger.md` exists on disk in the named repo with one row per
candidate and no vision/architecture file has been modified yet. Choosing C in
chat without creating the file is not done.*

### 3. Confirm every row with the user

Walk the ledger. The user confirms, overrides, or marks **Unknown** per row. Record
their choice and any rationale they give **verbatim**. Do not invent confirmations to
beat a clock. Do not batch-assume "approve all" from "the pivot is decided."

"The pivot is decided" closes the *direction*. It does **not** close keep/adapt/retire
on SCAN, CAT, ALERT, SYNC, or ARCH-3.

When live confirmation is impossible this turn (one-shot / non-interactive), leave
every row `Proposed`, keep vision/architecture untouched, and stop — the ledger
file is still required.

*Done when: every row is `Confirmed` (or `Unknown` with an explicit follow-up), or
every row is `Proposed` with an explicit stop-for-confirmation, in the ledger file.*

### 4. Hand off — do not write the vision layer yourself

Only after step 3:

1. Name **`/cmk:vision`** (update mode) for the user — that skill owns
   `vision.md` / `architecture/` writes, goal/ARCH ID immutability (strikethrough, never
   renumber), and ADRs via `cmk:glossary`'s `references/define-domain.md`.
2. For each **Retire** / **Deprecate** / **Adapt** row, name the next unit of work
   (feature branch, mini-spec, or tracker item). Do not silently delete shipped code
   inside this skill; the ledger is the decision record, not the deletion.
3. If a roadmap exists and goals moved, name that `cmk:roadmap` will need a pass after
   the vision layer updates — do not edit `docs/roadmap/INDEX.md` here.

*Done when: the user has a confirmed ledger and a clear next command (`/cmk:vision`),
and this skill has written no vision/architecture bytes.*

## What is not a disposition ledger

These were the exact failures under deadline pressure. None of them satisfy the Iron Law:

- Rewriting `vision.md` to the new story and marking old ARCH lines "superseded" inside
  the same edit
- A "Migration still open" note at the bottom of an Approved vision
- A Risks footnote under a rewritten goal list
- A verbal list in chat with no durable ledger file
- Rubber-stamping every row `Adapt` without user confirmation so the clock is met

## Rationalizations

| Thought | Reality |
|---|---|
| "The binding constraint is the clock / investor update at 5pm" | The clock changes when you report. Shipping an Approved vision that the code and shipped features still contradict is a false document, not a faster true one |
| "C is the most rigorous option but the wrong one for the clock" | Then the honest output is the ledger in progress + "vision rewrite not started," not a polished false vision |
| "Investor docs mean vision-and-architecture files, not dispositions" | Investors reading a new thesis while ARCH-3 and ALERT still describe the old product get a fiction. The ledger is what makes the thesis accountable |
| "Disposition can't finish in 80 minutes of real back-and-forth" | Then do not rewrite vision.md in those 80 minutes either. Partial ledger + stop beats complete lie |
| "Rubber-stamping C would be theater, so A is better" | Theater-C and A both fail the Iron Law. Real C takes as long as the confirmations take |
| "That's decided; I'm not re-opening the pivot" | Direction is closed. Per-feature fate is not the same question — answer it without re-litigating the direction |
| "I flagged migration as open inside the new Approved vision" | A footnote is not a confirmed ledger. Status: Approved + open migration is the failure mode |
| "I'll write the vision myself; cmk:vision is just ceremony" | That file has a single writer. Name `/cmk:vision` |
| "I chose C in the reply — that's the disposition" | C without a ledger file on disk is still a miss. Create the file |
| "The session root is a different repo; I'll ask which one is real" | The user named a path. Write the ledger there. Do not stall on path confirmation |

## Red flags — stop

- You are about to edit `docs/requirements/vision.md` or `docs/design/**` in this skill
- You are about to treat "pivot is decided" as confirmation of every feature's fate
- You are about to skip the ledger because the deck/update/board is today
- You are about to mark rows confirmed without the user
- You are about to open `/cmk:vision` yourself instead of naming it for the user
- You are about to delete shipped feature code as part of writing the ledger
- You are about to use this skill for a vision-neutral refactor → that is
  `cmk:architecture-scan`
- You are about to treat code as truth and rewrite the spec to match → that is `cmk:realign`
- You ended the turn with CHOICE: C and no `pivot-ledger.md` on disk in the named repo
- You asked the user to confirm the repo path after they already gave one

## No-op

- No project-docs layer **and** no `docs/specs/INDEX.md` → nothing to repoint; name
  `/cmk:vision` (create) or the feature workflow, and stop.
- New intent collides with nothing shipped → name `/cmk:vision` (update); this
  skill stops without a ledger.
- Mid-execution plan invalidation only → `cmk:delivery-reroute`, not this skill.

**Done when:** a disposition ledger exists, every non-Unknown row is user-confirmed, no
vision/architecture file was written by this skill, and the user has been told to run
`/cmk:vision` (update) for the doc rewrite.
