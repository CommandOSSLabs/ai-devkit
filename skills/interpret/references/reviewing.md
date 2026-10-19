# Reviewing what the other window wrote

Read this when the other window hands over its record of the discussion for sign-off: a
`cmk:interview` close package, or a `requirements.md`, `design.md`, or `tasks.md` asking for
approval. There is no fork here and no four blocks. The question is whether the document says
what the user decided, and whether it is true about the code.

## Read it from disk

Open the document itself, not the paste's summary of it, and the review its session ran beside it:
`.skills/<CODE>/req-review.md`, `design-review.md`, or `plan-review.md`. Read which fixes were
applied. That reviewer checked the document against the code and was never in this discussion, so
a fix it applied can reverse a decision the user made here and look like a correction.

## Check it against every slot, not only Lock

This session's carry-backs are the ledger. Walk all of it:

| Slot | The document fails it when |
|---|---|
| **Lock** | a locked line is missing, reworded into something weaker, or reversed — "validated at the API" is not "enforced in `deliver()` on every attempt" |
| **Weigh** | a weighed item has become a criterion, a number, or a task |
| **Still open** | an open question is closed — out of scope "as decided", a design that picks, a task that builds it, or `Open questions: (none)` |
| **Unverified** | something this session sketched and never ran — most often a number it derived, a ceiling or a timeout — now sits in a criterion, a default, or a test's expected value as settled, with no open question, check, or task that verifies it first |
| **Never raised** | scope nobody decided: a fallback tier, a new setting, a table, a task for any of them |

Measured, four sign-off turns caught every reversed Lock, including two that a review fix had
applied. None of the four carried an unverified item forward, one passed `Open questions: (none)`
while two questions were open, and one missed a task that built scope nobody had decided.

## Check it against the code

Everything the document says about today, in prose as well as criteria: a context line repeating
a claim the code contradicts is still read by the next session. And every existing reader the
change reaches: a field made required on an endpoint that customers already call breaks them
under an **External** posture, whatever the new field is for. Measured, one design turn argued the
opposite — that a brand-new required field had no existing clients to break.

## The reply

```
**Verdict:** approve / approve after N changes / send back — one line on why
**What approval freezes:** <one line: the IDs or sections that go immutable, and what cites them next>
**Ledger**
- <each Lock, Weigh, Still-open and Unverified line of this session's carry-backs, one line each> — kept / bent / reversed / closed / dropped
**Findings, most damaging first**
1. <what is wrong> — <the decision it breaks, or the file:line that contradicts it> → <the change to ask for>
```

The ledger lists every line, kept ones included, so a dropped one shows as a gap rather than as
silence. Measured, two rounds of prose on the **Unverified** row still passed a ceiling this
session had marked unchecked, stated as a test's expected value.

Close package: the same check, and the findings name each decision by its line in the package.
The document is signed off in the other window, so when the user settles, the reply for that
window is a carry-back: read `references/deciding.md` and follow it.
