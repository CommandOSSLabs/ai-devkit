---
name: cmk:debt
description: Banks findings that were judged real and deliberately left unfixed into the durable debt ledger at docs/quality/debt.md. Run it with /cmk:debt.
version: 1.2.0
disable-model-invocation: true
---

# Record Debt

A finding that was judged real and consciously left unfixed is a **decision**. Decisions
survive the session that made them; observations do not need to.

Everything this skill writes goes to `docs/quality/debt.md` — a tracked file, in git, in
`docs/`. Not `.skills/` (git-ignored, reconstructed from `git log`, and a finding is not in
`git log`). Not a session report. Not a commit message body.

## Intake

The user runs this, so the findings arrive however they arrive. Take them in this order:

1. **Findings named in the invocation** — a pasted list, or "bank what cmk:delivery-simplify just found".
   This is the live path: `cmk:delivery-simplify` and `cmk:delivery-review` each close their report with a
   **banked** slot naming the findings they judged real and left unfixed, and name this skill
   for you to run while that report is still in front of you.
2. **Nothing given** — ask what to bank. Do **not** go read the code and invent findings;
   a fresh reading produces observations, and observations fail the admission test below.

*Done when: you hold a concrete list of candidate findings, or you have asked for one.*

## What earns an entry

An entry requires **all three**. Miss one and there is nothing to record:

1. **A named finding** — a specific defect, smell, gap, or risk at a specific place.
2. **A judgment that it is real** — someone (agent or human) evaluated it and did not
   dismiss it as a false positive.
3. **A decision not to fix it now**, with a reason.

| Situation | Entry? |
|---|---|
| `cmk:delivery-simplify` dropped it as "outside the pinned diff" | **Yes** — real, judged, deferred |
| `cmk:delivery-simplify` dropped it as a false positive | No — fails (2). The drop reason is the record |
| `cmk:delivery-review` Minor nobody will action this branch | **Yes** |
| `cmk:delivery-review` Critical/Important | No — those are fixed before merge, not banked |
| `cmk:repo-config` step 6 content failure (pre-existing red suite) | **Yes** |
| `cmk:repo-config` step 6 wiring failure | No — that is a config bug, fix it |
| `cmk:feedback` item confirmed correct but deferred | **Yes** |
| `cmk:feedback` item refuted or removed-instead | No — fails (2) |
| Code you think could be nicer, that no pass flagged | No — fails (1) and (2). A ledger that admits opinions stops being read |

## The entry

Every entry fills every slot. A slot with no answer gets `Unknown` — never omit the line.

```markdown
### **DEBT-7** `src/report-builder.ts` — buildMonthlyReport nests four levels deep on `opts: any`

- **Found:** 2026-08-10 · polish-diff on `feat/csv-export`
- **Cost:** every new report option adds another branch; the tax rule is duplicated
  between the paid and pending arms, so a rate change must find both
- **Deferred because:** outside the pinned diff; restructuring it is its own change
- **Fix shape:** extract the row-builder, type `opts`
- **Ticket:** none
- **Status:** open
```

- **Found** — the date, the pass that found it, and the branch or range. This is the line
  a later reader cannot reconstruct, and the reason the ledger exists.
- **Cost** — what it makes harder or riskier, concretely. Not "this is ugly". An entry
  whose cost you cannot state in one line does not earn a row.
- **Deferred because** — the actual reason at the time. "Out of scope for the pinned diff"
  and "the owner is on leave" are both honest reasons; "no time" is a reason too.
- **Fix shape** — one line on what fixing it looks like, so planning can size it. `Unknown`
  is allowed and is itself information.
- **Ticket** — see the tracker rule below.
- **Status** — `open`, `scheduled`, or `fixed` (see Closing).

## The file

`docs/quality/debt.md`. Create it from `references/templates/quality-debt.md` if absent.
Pack seeds live in `references/templates/`.

IDs follow the pack's ID grammar, the same rules `ARCH-N` and `GOAL-N` obey:

- `**DEBT-N**` in bold, flat, repo-wide, assigned as you write.
- **Never renumber and never reuse.** Continue past the highest in use, including past
  retired ones.
- Retire by strikethrough with a reason (`~~**DEBT-3**~~ fixed in a1b2c3d`), never by
  deletion — a struck row is how a reader learns the debt was paid.

## Do not build a second issue tracker

Read `docs/agents/issue-tracker.md` when it exists.

- **Tracker configured AND the item is big enough to schedule** → the ledger row is the
  record of the *decision*; the ticket is the record of the *work*. Write the row, then
  name `/cmk:discover-efforts` for the user to run, and put the returned ID on the **Ticket**
  line. Never open a ticket yourself from here.
- **Tracker configured, item too small to schedule** → row only, `Ticket: none`.
- **No tracker, or `local`** → row only. The ledger is the tracker for this class of item.

The ledger holds every deferred finding; the tracker holds the subset someone will
schedule. A row without a ticket is normal, not a gap.

## Closing an entry

An entry closes when the finding is gone, and closing requires the same proof any other
completion claim does. REQUIRED SUB-SKILL: use `cmk:evidence` — then strike the ID and cite
the commit that fixed it. An entry whose file was deleted or rewritten past recognition
closes as `~~**DEBT-N**~~ obsolete — <one line>`.

Never close an entry because it is old, because nobody has complained, or because the
ledger is getting long.

## Reading the ledger

When asked what debt the repo carries, answer from this file — the open rows, with their
`Found` dates. Do **not** substitute a fresh read of the code: a smell you spotted just now
is an observation, and reporting it as known debt erases the distinction between what the
team decided and what you noticed. If the file is absent, say the repo keeps no ledger
rather than improvising one.

## Red Flags — Never

- Write a finding to `.skills/` or a session report and call it recorded
- Open an entry for something no pass judged real
- Bank a Critical or Important finding instead of fixing it before merge
- Renumber, reuse, or delete a `DEBT-N`
- Open a tracker ticket from inside this skill
- Close an entry without a fresh proving run
- Answer "what debt do we have?" from a fresh reading of the code
