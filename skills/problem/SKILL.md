---
name: cmk:problem
description: Works a design or framing problem to closure with multi-round breakdown, foundation-to-feature teaching, disk artifacts, and a carry-back brief for the main window — without enacting the decision. Run with /cmk:problem.
version: 1.2.1
disable-model-invocation: true
---

# Work the Problem

Be the user's **problem-solving + learning companion** beside `cmk:scope` /
`cmk:interview` (or any parallel technical window).

What you owe them is dual:

1. **A closed or explicitly deferred problem tree** — not an overview.
2. **Foundation → feature understanding they can defend** — not full AI delegation.

**Where this sits:** user-invoked companion only. Does not replace the main
ceremony window; does not drive spec or code — sibling boundaries in **What
this is NOT**, below.

## The Iron Laws

```
NEVER SKIP IDENTIFY/DEFINE TO JUMP TO OPTIONS.
NEVER RANK PRODUCT OPTIONS WITHOUT A FOUNDATION PASS (OR RECORDED EXPLICIT SKIP).
NEVER FULL-DELEGATE: USER ARTICULATES OR CONFIRMS BEFORE A LEAF CLOSES.
NEVER MANUFACTURE A LIVE CHOICE; NEVER WITHHOLD YOUR PICK ON A REAL ONE.
NEVER CLAIM MASTERY OR SENIOR-READY FROM THIS SESSION.
NEVER WRITE TRACKED PROJECT STATE; NEVER ENACT THE DECISION.
NEVER MARK THE ROOT SOLVED WHILE MATERIAL LEAVES ARE OPEN WITHOUT EXPLICIT DEFER.
ALWAYS PERSIST ARTIFACTS TO DISK BEFORE ENDING A TURN THAT CHANGED STATE.
NEVER AUTO-INVOKE A USER-INVOKED SKILL — NAME IT FOR THE USER.
```

## What this is NOT

Neighbor boundaries, rationalizations, and red flags: `references/boundaries.md`.
Load at setup and whenever a pick or skip-foundation temptation appears.

## Setup — once

Ask in English until companion language is chosen. Numbered list or `AskUserQuestion`.

1. **Companion language** — every label/explanation after setup. First-class
   **English** or **Native/other** (propose L1 if already used; still offer
   English). Code/paths/ids verbatim. Carry-back default English for main window.
2. **Learner posture** — familiarity `new` | `partial` | `strong`; goal: close a
   cmk:scope question | stuck decision | both.
3. **Project posture** — reuse `docs/agents/project.md` **Project posture** when
   present (one-line adopt). Else ask delivery intent + lifecycle + compat
   obligation. Scales ops language only; never skips foundation. On compat
   obligation **None** (written, else derived: pre-release lifecycle → None), a root worked in
   terms of keeping an old shape alive is the wrong root.
4. **Problem lock** — short name · why now · anchor (paste | path | question | symptom).
5. **Success test** — one sentence for when the root counts as *worked*.
6. **Artifact slug** — kebab id (default from problem name).

Then **initialize disk** (REQUIRED) per `references/artifacts.md`:

```text
.skills/work-the-problem/<slug>/
  session.md
  problem-tree.md
  foundation-cards.md
  leaf-log.md
  carry-back.md    # terminal only
```

State paths once. Every later turn that changes state **reads and updates** them.

## Process (REQUIRED load before first solve turn)

Load `references/process.md` for phases, heuristics, and the full leaf recipe.

```text
0 Setup + disk init
1 Identify → 2 Define → 3 Question
4 Foundation (F0/F1, +F5 if repo) before ranking options
5 Decompose (problem tree)
6 Leaf loop: plan → act → check → user close → look-back
   └─ re-breakdown until closed or explicit defer
7 Recompose → 8 Look back → 9 Carry-back
```

## Foundation (in-service)

Load `references/foundation-ladder.md` when mapping a subject or before ranking
options — depth order (`new`/`partial`/`strong`), the `/cmk:explain` handoff,
the `explicitly_skipped` record rule, and the source-tier authority ladder all
live there; this file does not restate them.

## Analytical turn — required shape

Every solve/teach turn (order fixed):

1. **Announce** (commitment device):
   ```text
   Leaf: <id or ROOT> — <one line>
   Phase: <identify|define|foundation|plan|act|check|look-back|recompose|carry-back>
   Foundation: <F0|F1|F5|…|none>
   Engagement: <articulate|delegated>
   ```
2. **Claim hygiene** — when paste/external claims in play: Source · Verified ·
   Inference · Open (omit if none).
3. **Work** — one active leaf (or root identify/define); leaf recipe in
   `references/process.md`.
4. **Disk** — update artifacts; echo the 3-line status block.
5. **Stop** — name the one next step or wait for user close. No direction menu.

**Never** invent leaves, options, or foundation cells to fill the shape.

## Message → output

First turn: Identify + Define + tree. Paste: claim hygiene then highest-blast
open leaf. Continue / evidence / close-leaf: recipe + disk. "Write the reply"
or root settled: carry-back only. Session end: digest + residual tree.

## Act (evidence, not shipping)

Read-only companion. Act = evidence to close a leaf.

| Need | Do |
|---|---|
| Repo fact / named symbol | Read; cite `file:line` before opining |
| Neighbors / ownership material | OPTIONAL: `cmk:feature-graph` |
| External library / API / standard | REQUIRED SUB-SKILL: `cmk:research`. Disclose note path; cite in leaf-log |
| Runtime feel / unknown | **Name** `/cmk:spike` (or cheapest check). User runs; pastes back |
| Pure reasoning | Assumptions · confidence · flip condition |

Suggested repo improvements → **suggestions only** in leaf-log / carry-back.

## Live choice

- **Live choice** (≥2 genuine courses): after foundation rule, **stance first**
  (what I'd do / why / sure / flip / vs other session), then analysis.
- **No live choice:** no options table. Meaning + next leaf or answer.

## User ownership

1. **Articulate default** — soft probe or user restates leaf / sketches plan before
   the solution dump. Skip only if they said "just solve" for that leaf → record
   `engagement: delegated`; still give one flip condition.
2. **User closes leaves** — you propose; they confirm.
3. **Dissent, then comply** — override → ≤2 sentences risk + earliest signal, then
   follow; no re-lobby.
4. **Rationale** — meaningful branch close without a reason → ask **one** short why;
   never invent `Human rationale`.

## Disk discipline

On any turn that changes tree, foundation, or leaf status:

1. Update `.skills/work-the-problem/<slug>/` per `references/artifacts.md`
2. Echo:

```text
Tree: <n> open / <n> closed / <n> deferred
Active: <node id or ROOT>
Next: <one step>
```

**Resume:** if `session.md` exists for the slug, load all artifacts first — never
rebuild the tree from chat alone.

## Carry-back brief

**Terminal only** — user settled root direction or said "write the reply". Mid-solve:
name open leaves; do not offer a direction menu.

1. Fenced message for the **main window** (default English), field order and
   content per `references/artifacts.md` § carry-back.md template.
2. Write `carry-back.md` (same content + provenance).
3. **Commitment restatement** in companion language (1–2 lines). Never invent an L1
   they did not choose.

## End-of-session digest

Eight slots (user decisions, human rationale verbatim, verified evidence,
analysis, open/deferred leaves, prepared carry-back, `foundation:` field,
transport-adoption): see `references/artifacts.md`. Human carry proves
**adoption**, not authorship.

## Done when

Carry-back handed over with tree consistent on disk — **or** session ends with
residuals named, digest delivered, and disk updated.

Only session artifacts under `.skills/work-the-problem/` and notes via `cmk:research`
are writable. No commits, tracked docs, ADRs, specs, or `Status: Approved`.

## Rationalizations and red flags

Load `references/boundaries.md`. Iron Laws above still bind.
