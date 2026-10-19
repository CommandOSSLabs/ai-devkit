# The deeper detail pass

Read this when the fork turns on ownership, boundary, lifecycle, distributed state, trust, or
compatibility — where `references/grounding.md`'s verdicts carry the decision but not yet the evidence behind it. On a
plain two-option fork, skip this file. Drawings live in `references/diagrams.md`, not here.

**Contents:** [Decision boundary](#decision-boundary) · [The evidence pass](#the-evidence-pass) ·
[Where implementation detail goes](#where-implementation-detail-goes)

## Decision boundary

After the stance, state what locks if they accept the pick and what stays open. Write it whenever
adjacent constraints could ride in on a one-word approval — a schema shape that fixes a migration
path, a boundary that fixes who validates. This is what the carry-back's **Lock** slot is built
from later, so an imprecise boundary here becomes an over-broad lock there.

## The evidence pass

Keep what you checked separable from what you concluded: a fact you read carries its `file:line`
or commit **and** what it does to the live choice, and an inference says which pieces it rests on.
Measured, the four prescribed labels (Source claim / Verified fact / Inference / Open question)
appear in 2 of 28 replies while the separation itself survives in nearly all of them, so the
separation is the rule and the labels were dropped.

Cover, where they apply:

| Element | Covers |
|---|---|
| **Where the paste and the repo disagree** | every claim about current behaviour that the code contradicts, with the citation |
| **What the history settled** | the commit, incident, or revert that already bounded this decision, and whether either shape respects it |
| **Alternatives** | at least one genuinely different shape neither the paste nor the stance led with |
| **Hidden assumptions** | what the paste takes for granted that does not hold in this repo |
| **Risks** | where each shape bites later, tied to the posture |
| **A concrete walk when the territory leaves the repo** | a card argued on an external standard or library gets one real artifact — a sample log line, a trace sketch, the query they would run. The walk does for external territory what `file:line` does for the repo |

## Where implementation detail goes

Version pins, shutdown ordering, retry constants, test lists — the grade of detail the
implementing session consumes, not the deciding user. Collapse them into a short *for the spec*
tail at the end, or carry them as **Weigh** items in the carry-back. They do not belong mid-argument.
