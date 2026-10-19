# Grounding — compute, do not render on turn 1

After opening the files, before writing `references/plain-card.md`. These verdicts are the
source for the fork, the lean, the paste-vs-code facts, and Go deeper hops 1–2. They
are not the opening of the turn.

**Contents:** [Today](#1-today) · [What changes](#2-what-changes) ·
[A shape of your own](#a-shape-of-your-own) · [Architect's read](#3-architects-read) ·
[Stance](#4-stance)

## 1. Today

What the code does now at the point the paste touches, cited `file:line` — and
every place the paste describes it wrong, named plainly. Measured, one paste
claimed three attempts at a fixed one-second delay where the file held
`MAX_ATTEMPTS = 5` with exponential backoff, and called both its options purely
additive while a commit in the same repo recorded the incident that had bounded
them. A correction that arrives after the user can type `0` arrives too late.

Hop 1 renders this in ordinary sentences. Turn 1 carries only the disagreements
that would move the pick, under the card's paste-vs-code heading — as facts, not as
things the user confirms.

## 2. What changes

Per shape, **the code that carries the change** — not a list of files. The lines
that show **structure**: type, signature, the boundary crossed, what the module
will hide and what it hands callers. Hop 2 may show those lines as code. Turn 1
does not.

## A shape of your own

The paste's options were drawn without the code open. WHEN the repo points at a
shape none of them names — a constraint both miss, a cheaper rung, a seam already
there — put it on the table as **its own shape**, judged on the same three lines.

Measured, two turns in three found such a shape and gave it no column — "Shape A,
plus a validated ceiling", and "A's schema, but scope the ticket to include
decoupling the drain loop". Both were the better answer, both arrived as a
footnote, judged by nothing. A shape you propose loses when it loses.

On turn 1 it appears as a named choice in `references/plain-card.md`, not as a rider.

## 3. Architect's read

One verdict per shape, the **same three lines for each**:

| Line | What it answers |
|---|---|
| `Depth` | if this shape vanished, what must callers still know to rebuild the behaviour? The smaller that answer, the deeper the shape |
| `Locality` | where the edit lands and which neighbours move — `leave` / `extend` / `extract` |
| `Invariant` | the guarantee the code makes today, and whether this shape `keeps` / `breaks` / `is silent on` it |

The criteria are `cmk:design`'s. This skill does not redefine them.
`Invariant` decides more real forks than `Depth`. Hop 1 may show the comparison
in sentences. Turn 1 does not show this table.

Measured, three companion turns built three different comparison tables — schema /
read-path / coherence, then storage / migration / support story, then "what
actually differs given this schema" — with no line shared by all three.

## 4. Stance

```
**What I'd do:** one shape, named.
**Why it wins now:** the grounded fact or criterion that dominates.
**Runner-up:** the strongest alternative and why it loses on that same factor.
**Cost I accept:** the real downside taken with the pick.
**How sure:** high / medium / low, plus the check that earned it.
**What would flip me:** the one fact that changes the answer. Cheap to check? Check it.
**Versus:** **Agree** · **Amend** each correction, one line · **Reject**.
```

Turn 1's lean, full pick, and what `0` would freeze are this stance in ordinary
sentences. Do not re-render the seven slots on turn 1.

WHEN the fork turns on ownership, boundary, lifecycle, distributed state, trust,
or compatibility, read `references/depth-extras.md` — its evidence pass feeds hop 1; its
decision boundary is the Fence on turn 1.
