# Drawing the system

Load this when `references/plain-card.md` draws the neighborhood, or a Go deeper hop draws a finer grain.
It owns the form; those files own the trigger.

**Contents:** [What to draw](#what-to-draw) · [How much detail](#how-much-detail) ·
[Pick the shape of the picture](#pick-the-shape-of-the-picture) ·
[Mark what the fork touches](#mark-what-the-fork-touches) · [Worked](#worked) ·
[Form](#form)

## What to draw

**The system around the decision, not the decision.** The other window drew its options without
the code open; you have it open, and the picture is where that shows. It carries what the paste
never mentioned and the repo does: the callers of the value being changed, the resource more than
one actor shares, the reader nobody named, the bound some commit already set.

Measured, two companion drawings in four used **only** symbols the paste itself had already named
— redrawing the question. The one that reached furthest drew `drain()` and `dispatch()`, neither
of which appeared in the paste, and that drawing is the one that made the fork legible.

A reader should be able to point at the box where the problem happens, and see at least one box
they were not told about.

## How much detail

Every node carries the fact that makes it matter, not just its name. `readFrontmatter` says
almost nothing; `readFrontmatter — splits and parses, no validation` says why the fork exists.
A node label that is only an identifier is a node the reader has to go look up.

Put the numbers in: the limit, the count, the timeout, the ordering. `drain — one loop, 100 rows
a pass, in order` is three facts in one line, and each of them is load-bearing somewhere in the
argument above it.

## Pick the shape of the picture

One drawing, of the kind the fork turns on.

| Kind | The fork is about |
|---|---|
| **topology / architecture** | what calls what, where work happens, which layer owns a rule. *Who decides* a value is this, with the owner labelled on its box |
| **sequence** | order, blocking, a window, a race — the argument is "and then" |
| **before/after structure** | the change moves a boundary and the point is which side something lands on |
| **schema / references** | what points at what, and which key or constraint is missing |

## Mark what the fork touches

A reader should not have to diff two pictures. Draw the system once and mark it:

```
[*] this pick changes it        [!] it carries the guarantee
```

`[!]` goes on whatever the `Invariant` line is about. `[*]` on what the pick alters. Everything
unmarked is information too: the part of the system this decision does not reach. When `[*]` and
`[!]` land on different boxes, that gap *is* the argument.

## Worked

A fork over where page validation belongs, in a static site builder. The paste named only "the
loader" and "each consumer"; the drawing carries the whole pipeline, and the one box that turns
out to matter most is in neither option.

```
content/*.md
    |
    v
readFrontmatter — splits and parses, returns Raw, no validation      [!] its documented contract
    |
    v
toPage — assembles Page, silently defaults title/description/date    [*] the pick checks here
    |
    +--> itemXml — one RSS item, emits <description></description> when empty
    |
    `--> build — readdirSync().map(toPage), no per-file try/catch
              one bad file aborts the whole build, under every shape

[*] this pick changes it   [!] it carries the guarantee
```

Same system, the question of order instead:

```
t=0      a partner endpoint stops answering
t=0      delivery 1 starts its 5 attempts, 2s 4s 8s 16s 32s     [!] bound set by #412
t=62s    delivery 1 gives up, marked dead        ─┐
t=62s    delivery 2 starts                        │  deliveries 2..100 sat idle,
t=2h04m  delivery 100 finally starts             ─┘  nothing wrong with any of them
```

The second answers a question the first cannot: how far behind the queue gets. Draw the state
that changes; leave out the architecture that does not.

## Form

**Setup answered this.** ASCII or mermaid, and it is not yours to revisit each turn — the answer
is a fact about where the user reads, and switching mid-session makes the drawings incomparable.

**ASCII.** Labels do the work; boxes are optional, facts are not. The marks are `[*]` and `[!]`.
ASCII names the lines and arrows, never the words: labels stay in the companion language with
its own letters and accents intact. Measured, a drawing stripped every accent from its labels
and handed the reader a third spelling of words the card had just used.

**Mermaid.** Same content, same marks — carry them as node text (`"drain — one loop [!]"`) or with
`classDef`, whichever the diagram type allows. Pick the type from the table above:
`flowchart` for topology, `sequenceDiagram` for order, `erDiagram` for references,
`stateDiagram-v2` for lifecycle. Where a type may not render, `flowchart TD` always does.

Three mechanics for mermaid: an unknown word breaks the diagram; **a bad parameter fails
silently**, so a diagram that renders is not proof it says what you meant; and no braces inside a
`%%` comment. Keep node ids short and alphanumeric, and put the words in the label.

A drawing that has to travel — into a doc, a PR body, a repo markdown file — goes as mermaid
whatever the session setting, since that destination renders it and a terminal is not the reader
there.
