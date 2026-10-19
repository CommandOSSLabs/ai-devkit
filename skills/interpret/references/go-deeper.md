# Go deeper

The menu that ends every live-choice turn, and every turn that answers a pick
from it. Two engineering hops, then carry-back. A message the user wrote
themselves ends without it, even one asking for what a hop would have offered;
so does a carry-back.

**Contents:** [The menu](#the-menu) · [Hop 1](#hop-1--the-system-in-more-detail) ·
[Hop 2](#hop-2--walk-it-fileline) · [After a hop](#after-a-hop)

## The menu

The last thing in the turn, under a header and labels **in the companion
language**. Each label names **this turn's** target — the graph, the file, the
guarantee — not a generic "technical overview":

```
**Go deeper**
1 · The system in more detail — <this turn's target>
2 · Walk it file by file — <this turn's target>
───
0 · Write the reply to carry back
```

Always these two hops, in this order. `Deeper`, `Lowest`, `Hop`, `Carry-back` are
the internal names in this file — they are not labels. A companion language other
than English gets these three lines written in it, in wording a reader of it would
use; measured, a turn left the labels in English while the rest of the card was
translated, and another rendered `Lowest` word-for-word into a label that named
nothing.

A number answers the menu, never the paste: a bare `1` is hop 1 even when the
paste has an Option 1. `0` always writes the carry-back. A number with no matching
line is not the carry-back.

Number this menu from this file, not from a previous turn or another agent's
session. A five-line menu that ends `5 · Write the carry-back` with labels
*Explain again* / *Walk it* / *Impact* is the retired form — measured, a resumed
session copied it. A menu of Walk / Challenge / Stress / Verify is the v2.16 form;
this file replaced it.

Do not offer "the card, plainly" or Explain — turn 1 already spent those.

## Hop 1 — the system in more detail

The whole system, still in sentences. Render from `references/grounding.md`: **Today** (what
the code does, every paste-vs-repo miss with `file:line`) and the Architect
comparison on Depth / Locality / Invariant, in ordinary sentences, not as the
turn-1 table. A **middle diagram** of the same neighborhood, one grain finer than
turn 1 — still the system, not the options. Read `references/diagrams.md`.

`Depth`, `Locality` and `Invariant` are internal criterion names. Say what they
mean in the companion language — what a caller would still have to know, where the
edit lands and which neighbors move, which guarantee holds or breaks — and do not
print them as headings.

Two to four **pressure-test** questions may close this hop — weakest assumption,
irreversible cost, likely future requirement, failure mode. Not a menu of
directions.

Do not re-render turn 1. Do not write a carry-back.

## Hop 2 — walk it `file:line`

One concrete case through `file:line → file:line`, today and under the pick, with
numbers derived from the code. Close on the guarantee the code makes today. Show
the **code that carries the change** (the What-changes fragments). A **low
diagram** if hop 1's picture cannot carry the walk. Run the stance's **What would
flip me** if a check is in reach; otherwise name the smallest probe, where it
runs, and the result that flips the pick.

Do not re-render turn 1 or hop 1. Do not write a carry-back.

## After a hop

End with the menu again. If hop 1 was taken, hop 1 may drop (number unused) and
hop 2 stays `2`. If hop 2 was taken, both hops may drop; `0` remains. Labels
copied from the previous menu are a failure.

**0 · the carry-back.** Read `references/deciding.md`. No shape named with the pick → the
stance's pick.
