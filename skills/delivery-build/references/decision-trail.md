# Decision trail

Loaded from `references/common.md` when any close-sequence predicate holds for a
**long or unattended** run, or the user asked for a decision trail / show-work.

<HARD-GATE>
OVERRIDE SHIP (2026-09-08): prior measurement dropped a TSV trail skill —
git log was enough on an evening fixture. User override required attaching
this trail to execute-family runs anyway.
</HARD-GATE>

## Format

One append-only TSV at `.skills/<CODE>/decisions.tsv` (gitignored with
`.skills/`). Header:

```
ts	phase	decision	why	evidence	result
```

- **ts** — ISO8601
- **phase** — workstream or task id
- **decision** — what was chosen, one line
- **why** — plain reason (no skill jargon)
- **evidence** — pointer only: commit SHA, `file:line`, artifact path, PR
- **result** — `tests green` / `reverted` / `INCONCLUSIVE` / `open` / …

Log forks, pivots, unit completions with verification, blockers — not every
keystroke. Wrong call → new superseding row; never edit history.

## Rules

1. Create the file on first decision after this lane arms.
2. At close (before whole-branch review): audit rows against the transcript —
   every row maps to a real action; evidence resolves; silent pivots get a row.
3. WHEN a second model family is available, spawn a read-only reviewer over the
   TSV + transcript; end the close notes with `Attention:` (`reviewed by
   <model>` + flags, or `No flags`).

## Rationalizations

| Thought | Reality |
|---|---|
| "git log is enough" | OVERRIDE: continuous forks need a single readable table |
| "progress.md already records Verified" | That is completion, not why a fork was taken |
| "Too small a run" | If this file was loaded, the predicate or user ask armed it |

*Done when: TSV exists for an armed run, close audit ran, Attention line written.*
