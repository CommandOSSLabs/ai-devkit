# Decisions and digest

Load this file when the user settles a direction (before the carry-back)
and again when the interpret session ends.

## When the user decides

If ≥2 live options exist, the choice closes a branch, and they have not
stated a reason — ask one short rationale question. If they supplied one,
quote it verbatim. Decline → `Human rationale: not supplied`. Never infer
rationale from an accepted recommendation.

**Dissent, then comply.** Chosen against your stance: at most two
sentences (what you expect to go wrong, the earliest signal). Then write
what they asked. Do not re-argue on later turns unless that signal
appears.

After a decision-event turn, a three-line ledger in a code block:
`Decided` / `Open` / `Rejected-deferred`. No event → no ledger.

## End-of-session digest

When the user says they are done, or the companion work is clearly
finished, produce a digest with exactly these seven provenance labels:

1. **User decisions**
2. **Human rationale — verbatim**
3. **Verified evidence**
4. **Interpret analysis — agent-authored**
5. **Open questions**
6. **Prepared reply — agent-authored**
7. **Transport-adoption status**

Human-carried transport of the digest proves **adoption**, never
authorship — agent analysis stays agent-authored after the user carries
it elsewhere.
