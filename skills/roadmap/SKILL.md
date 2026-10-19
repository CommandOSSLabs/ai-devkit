---
name: cmk:roadmap
description: Use when the user asks to plan, break down, sequence, or reorder milestones — a quarter's or a project's work into milestones, what order to build things in — or to edit an existing roadmap (drop, reorder, reword, commit to, or ship a milestone; draft the next one in Notion for sign-off); produces or revises docs/roadmap/INDEX.md, the registry of stable MILE-N and ROAD-N IDs feature specs bind to. Not for one feature's requirements (cmk:requirements) or for where the plan stands now (cmk:roadmap-status).
version: 1.3.1
---

# Roadmap

Author and maintain `docs/roadmap/INDEX.md` — the program layer between the product vision
and a single feature's spec: which milestones exist, in what order, holding what work, and
which are actually committed to. **Where this sits:** `cmk:vision` (vision) →
**`cmk:roadmap`** (milestones) → `cmk:scope` → `cmk:requirements` → … A roadmap item
becomes a feature once `cmk:requirements`, the sole registrar of feature codes, registers it
in `docs/specs/INDEX.md` — a file this skill never touches.

## The Iron Law

```
THE ROADMAP RECORDS INTENT. PROGRESS IS DERIVED, NEVER STORED HERE.
```

Intent is what no tool can work out for itself: the outcome a milestone promises, the
order, what belongs to it, what was deferred and why, and whether a human has committed
to it. Progress is already written down once — as `Status:` in each feature's own
`requirements.md`, mirrored into its `docs/specs/INDEX.md` row — and a second copy of it
here would only drift from that one (see Rationalizations for why).

So this file gets **no** progress column, status field, change log, or percentage complete;
`/cmk:roadmap-status` derives the current picture on demand from the specs and git.
`Commitment` is not progress, though: `Planned | Committed | Closed` records a *human
decision* that nobody can derive — keep that field, and keep nothing that tracks progress.

## Modes

- **create** — no `docs/roadmap/INDEX.md`. Author it.
- **update** — it exists. Revise it against a change signal.

Pack seeds live in `references/templates/`. Every heading in `references/templates/roadmap-INDEX.md`
is a REQUIRED slot — fill it or write `None`. Its comment block carries the authoritative
structural rules **S1–S8** and the ID rules; read them there rather than restating them.

## Create

1. **Read the inputs:** `docs/requirements/vision.md` when it exists, for the `**GOAL-N**` IDs
   milestones cite; `docs/specs/INDEX.md`, since a brownfield project's shipped work
   belongs in an early milestone, not nowhere; and any decomposition you were handed from
   `cmk:scope`.
   *Done when: you can name the goals in play and the work already shipped.*
2. **Fill the template** to `docs/roadmap/INDEX.md`. One `MILE-N` per milestone; one
   `ROAD-N` per item, under exactly one milestone, identified by ID and slug.
   *Done when: every REQUIRED slot is filled or reads `None`.*
3. **Group by user value.** A milestone's `Outcome:` names, in one sentence, what a person
   can do once it lands, testable by a reader who has not seen the code. An outcome only
   phrasable as work performed ("the storage layer is rewritten") is a technical layer, not
   a milestone — fold it into the milestone it enables. Prefer fewer, larger milestones when
   the design is settled; split where early feedback could redirect what follows.
   *Done when: every milestone has a testable outcome.*
4. **Cite goals.** WHERE a vision exists, each milestone's `Goals:` names the live `GOAL-N`
   IDs it serves, and every live goal no milestone cites goes under `## Goal dispositions` as
   `Deferred` or `Out-of-scope`, dated and reasoned. WHERE none exists, write `Goals: None`
   and leave the dispositions table empty.
   *Done when: no live goal is unaccounted for, or there is no vision.*
5. **Declare order and surfaces.** Each item's `After:` names, in the template's form,
   what it waits for, or `none`. Its `Surfaces:` names the components or paths it
   is expected to touch, or `None` with a reason when the surface is not yet knowable.
   *Done when: every item has an `After:` and a `Surfaces:` line.*
6. Run **## The approval gate**.

## Update

The change signal is a new milestone, a reordering, a scope change, a commitment, a closure,
or an item no longer wanted.

**A resequencing is written as `After:`** on every member of each milestone it touches,
in the template's form; list position alone carries no order once `After:` is present.

**Every ID already in the file is permanent.** Reordering the table changes order, never an
ID; an item moved to another milestone keeps its `ROAD-N`. Retire one only by strikethrough
with a reason — `~~**ROAD-4**~~ dropped 2026-07-25: no custom search UI` — so history stays
readable and no reference dangles. **An item you no longer want is deferred, not deleted**:
move it to its milestone's `Deferred:` slot with a date and a reason — deleting the line
destroys the one record that the option was ever considered (see Rationalizations).

**A material change to an `Approved` roadmap demotes it.** Set `Status: Draft`, then run the
gate again. Material means any milestone's outcome, membership, ordering, commitment state,
or goal citations (see Rationalizations for why an edit does not stay pre-approved).

**Closing a milestone** — only on a `Committed → Closed` transition, skipped for every other
edit — asserts a milestone *delivered*, which nothing in this file can establish on its own say-so.

<HARD-GATE>
Refuse a `Committed → Closed` transition that arrives without an assessment handoff, and name
`/cmk:milestone-review` for the user to run. This holds in every repo, including one that has
never run that skill.

Given a handoff — a `MILE-N`, an assessment ordinal, an effective verdict, and a candidate
closing revision SHA — **re-derive every value by reading**
`docs/roadmap/assessments/<MILE-N>.md` at that ordinal. The handoff's values are claims to
check, never facts to trust. Verify all five:

1. the block names the same `MILE-N`;
2. the referenced ordinal exists;
3. its `Candidate closing revision` equals the handoff's SHA;
4. its current `Human disposition` is **terminal** (`Accepted` or `Overridden`);
5. its effective verdict and `Close decision` match what the handoff asserts.

Any mismatch → refuse the close and report which value disagreed. Validate against `A1`–`A7`
in `references/templates/milestone-assessment.md` first; an unparseable assessment cannot authorise
anything.
</HARD-GATE>

Once the gate clears, read `references/closure-writeback.md` and follow it exactly —
it covers writing the `Closed:` SHA and re-running the approval gate.

*Done when: the change is applied, no ID moved or vanished, and the gate has run.*

## The approval gate

WHEN `docs/agents/issue-tracker.md` reads **Draft surface** `notion`, read `references/notion-draft.md` and follow it before this gate: the sign-off role signs off that page.

<HARD-GATE>
Validate S1–S8 from the template's rule block. Report every defect you find and STOP —
a roadmap with a structural defect does not reach the user for approval. When the file is
clean, present it WHOLE and STOP. `Status: Approved` is written only after the user has
explicitly approved it. Conversational agreement is not approval; a roadmap you approved
yourself was never approved.
</HARD-GATE>

Walk S1–S8 as a checklist, naming each defect and where it sits, then present the file and
stop. On approval, set `Status: Approved`; `/cmk:roadmap-status` reports where the plan
stands whenever the user wants it.

*Done when: the S1–S8 walk is clean, the user has approved the written file, and `Status:`
reads `Approved`.*

## ROAD-N is a slot, not a feature

**One home for this rule** (other skills point here; do not restate the table elsewhere).

| | ROAD-N (program **slot**) | Feature CODE (delivery **unit**) |
|---|---|---|
| Lives in | `docs/roadmap/INDEX.md` | `docs/specs/` + INDEX row |
| Exists before triad? | Yes — unspecced is normal (`R7`) | Only after `cmk:requirements` registers it |
| Progress | Never stored here | `Status:` on requirements / INDEX |
| Join | — | INDEX **Roadmap item** → at most one CODE per ROAD (`R6`) |

Creating a ROAD does not create a feature — binding is later, when `cmk:requirements`
writes the INDEX cell; matching slug text does not merge the IDs. A milestone **outcome**
often needs **several** ROAD slots (member list order), each binding its own feature when
work starts: never fold a whole milestone into one CODE, and never mint two CODEs for one
ROAD (`R6`). This skill never creates remote tracker program objects (GitHub milestones,
Linear initiatives, Projects) either; that mirror is opt-in via `cmk:repo-config` →
`docs/agents/issue-tracker.md` (**Program sync**) and local-only by default.

## Rationalizations

Every row below is a verbatim rationalization from a baseline run, or its direct echo.

| Thought | Reality |
|---|---|
| "A status column would make this trackable" | It makes it *stale*. Feature progress lives in `requirements.md` `Status:`, mirrored into the INDEX row. `/cmk:roadmap-status` derives the rest |
| "I'll add a change log so status history survives" | That is the same second copy wearing a different hat. Git already holds the history of this file |
| "Reuse the feature lifecycle at milestone granularity" | `Draft → Approved → In-progress → Implemented → Shipped` describes a *spec*. A milestone carries a commitment, not a lifecycle |
| "Sharing matters more now, so it should be MILE-2" | Order is table position; identity is the ID. Move the row, keep the number |
| "I renumbered so the order reads naturally" | Every renumber silently repoints anything that cited the old number |
| "We are not doing it, so remove the line" | Defer it with a date and a reason. A deleted item takes its rationale with it |
| "It is a planning artifact, so no approval gate applies" | The gate is what makes the roadmap a commitment rather than a draft someone wrote. It applies |
| "The user is the approver and they asked for this edit, so it stays Approved" | They asked for the *edit*, not for the result to be pre-approved. Demote to `Draft` and show them what they now own |
| "I signed off two weeks ago, this is just an amendment" | An amended plan is a different plan. It gets its own approval |
| "No template exists here, so I'll invent a shape" | `references/templates/roadmap-INDEX.md` is the shape. Two invented shapes cannot be checked by one rule set |
| "ROAD slug equals the feature, so they are the same ID" | Slot vs delivery unit. INDEX binding joins them; the roadmap still carries no CODE |
| "I'll open a Linear Project / GH milestone per ROAD so the board matches the roadmap" | Not this skill's job; program remote is opt-in and usually body/label on the feature issue only |
| "One milestone outcome → one ROAD → one feature" | One outcome often needs several ordered ROAD slots; each binds its own feature when started |

## Red flags — stop

- You are about to add a column, field, or section that records how far work has got
- You are about to change a number that already exists in the file
- You are about to delete a line naming an item rather than deferring it
- You are about to write `Status: Approved` without the user having said so in this session
- You are about to write a feature code into the roadmap
- A milestone's outcome describes work performed rather than something a person can do
- You are treating a ROAD slug as a feature code or inventing a CODE inside this skill
- You are creating remote tracker program objects (milestones / initiatives / projects) from this skill

## No-op

If asked to consult a roadmap when `docs/roadmap/INDEX.md` does not exist, say the project
has no roadmap layer yet and that this skill can author one, then stop — the layer is
optional and nothing here gates the feature flow without it.
