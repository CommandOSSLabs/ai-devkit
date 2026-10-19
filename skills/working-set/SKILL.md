---
name: cmk:working-set
description: Use when more is live than one or two ideas — a long working set, a review that walks every requirement ID, a change that must stay consistent — produces a stage of the ideas this act uses, with the rest left on disk.
version: 1.0.0
---

# Hold Stage

The stage holds what this act uses. Everything else stays on the page.

## The Iron Law

```
ONLY THE IDEAS THIS ACT USES
```

A review, an edit, or a status that names every ID in the working set is
not being thorough. It is overloading the bottleneck. Cite the IDs this
file implements or violates. The unused IDs remain in `requirements.md`.

Usually that is one or two. If this file clearly fails a third, name it.
Do not table persist / PDF / void because they exist in the spec.

## The Sequence

1. **ADMIT** — the ideas this file implements or violates. *Done when: you
   can say them in one breath.*
2. **LEAVE THE REST** — one line, "other IDs live in requirements.md." No
   table of non-homes. *Done when: the outgoing text has no recap of IDs
   this file does not touch.*
3. **USE THEM** — write the review or the edit against the admitted set.
   *Done when: each admitted idea was used once, immediately.*

## Rationalizations

| Thought | Reality |
|---|---|
| "Keep ALL of these live so nothing is forgotten" | Forgetting is what the file on disk is for. Reciting twelve IDs is the dual-task cost. |
| "A requirement trace of every ID is the review" | A review of `tax.js` names the tax IDs. The persist/PDF/void IDs are not this file. |
| "I'll list the others as out of scope so I'm complete" | A one-line "other IDs live in requirements.md" is enough. A table of eight non-homes is the stage again. |
| "The working set told me to hold twelve" | The working set is a warehouse. The stage is a bottleneck. |
| "At most two, so drop the blocker" | The cap is on recap, not on findings. If this file violates an ID, that ID is on the stage. |

## Red Flags — stop and cut the outgoing text

- You are writing a table of every `CODE-N.M` in the spec
- The header says "specs held live: BILL-1.1–BILL-1.12"
- You scored an ARCH-N that has no text on disk and no bearing on this file
- The review is longer than the file under review because of ID recap
- You omitted a failing ID on this file in order to keep the stage at two

If the recap already landed, cut it before doing anything else.
