---
name: cmk:shipped-audit
description: Audits what merged in a window for the edge cases its specs and tests missed, and drafts a follow-up for each real one. Run it with /cmk:shipped-audit.
version: 1.0.0
disable-model-invocation: true
---

# Audit Shipped

Read what merged to the integration branch in a window, find the edge cases its specs
and tests missed, run each one, and draft a follow-up per real finding. A branch not yet
merged is `cmk:delivery-review`'s job; this skill reads work that already landed.

Eight baseline audits of one week — three features merged — found the bugs inside a
feature: 8 of 8 the unvalidated payment amount, 7 of 8 the 500 where the spec says 400.
They missed what sits between features or outside the code. Five of eight missed that a
part-paid invoice whose payment is fully refunded reads `refunded` and still accrues a
late fee — the fee checks the stored status, the view derives it — and three of those
wrote "the fully-refunded status behaves as specced". Six of eight missed that "today" is
the UTC date where the glossary counts late-fee weeks in marina days (UTC+7); three wrote
the opposite, "UTC date handling is consistent". Steps 2 and 3 are for those two.

## 1. Pin the window

The branch is `Default PR base:` in `docs/agents/project.md`, else `main`. The window is
the operator's, else the last 7 days. Run:

```bash
git log --first-parent --merges --since=<start> --format='%h %ad %s' <branch>
```

For each merge: its `Closes` line names the ticket; the feature's catalog row names its
`requirements.md` and `design.md`. The base is the earliest merge's first parent
(`<sha>^1`). *Done when: every merge has its ticket and spec, and
`git diff --stat <base>..<branch>` is in hand.*

## 2. Reader pass — REQUIRED

From `git diff <base>..<branch> -U0 -- src`, list every new state the window gives an
existing field or type: a member added to a union or enum, a value a function now
returns, a field now written. For each, run
`git grep -n -e '<field>' -e '<record type>' <branch>` over the whole repo, docs included.
The record type matters: the reader that breaks is often one that never reads the new
field. Fill one row per reader:

| Field — new state | Reader (`file:line`) | Feature that owns the reader | What it returns for a record in the new state |
|---|---|---|---|

A reader owned by another feature, or a doc describing an external consumer, is a
cross-feature case. Build the one input that reaches both features, run it, and record
the output in the row. Each feature behaving as its own spec says is not this pass: the
refunded-and-accruing invoice satisfies REFUND-1.3 and LATEFEE-1.1, each read alone.

*Done when: every new state has every reader, and every cross-feature row has a run.*

## 3. Glossary pass — REQUIRED

For each term in the glossary (`docs/agents/project.md` Paths, else `docs/requirements/glossary.md`) that
the window's specs or diff use, quote the definition and the line that implements it:

| Term | Definition (quoted) | Implementing line (`file:line`) | Holds? |
|---|---|---|---|

A definition the line does not implement is a finding, whatever noise level the operator
asked for. "Probably harmless" was the reason given each time the UTC "today" was
dropped, and it makes the late fee one week short for seven hours of every week.

*Done when: every such term has a row.*

## 4. Report

1. **Findings**, most severe first. Each names the requirement ID or glossary term it
   breaks and carries the command that shows it with its output, or says `read, not run`.
2. The two tables from steps 2 and 3.
3. **Follow-ups** — one draft per real finding.

*Done when: the three parts are delivered.*
