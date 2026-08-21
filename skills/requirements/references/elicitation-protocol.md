# Elicitation Protocol

Load when Create input is thin, solution-shaped, or otherwise not a settled
requirements package — and on Iterate when the change adds or shifts behavior.
This file is the **one home** for the interview shape and the close package.

- [When it applies](#when-it-applies)
- [Scope band](#scope-band)
- [Problem lock](#problem-lock)
- [Question cards](#question-cards)
- [Close package](#close-package)
- [Hand-off into Create / Iterate](#hand-off-into-create--iterate)

## When it applies

**Create:** input is an idea, a solution sketch, or partial notes — not an
already-confirmed problem, success signal, scope, and constraints package.

**Iterate:** the change adds behavior, widens scope, or touches surfaces that
already have acceptance criteria (guards will be required in the guidance).

**Skip elicitation** only when the user hands a complete, non-generic package
(problem, users, success with targets, in/out scope, constraints) and you can
restate it as a close package they immediately confirm. Thin labels ("billing
dashboards"), stack prescriptions ("lock Redis in"), and "just write something
sensible" never skip.

## Scope band

State the band **out loud** before the first card (or before drafting when
elicitation is skipped). Band names and **When** meanings are shared with
`cmk:delivery-workflow` (its scope-band reference is the delivery docs-bar
home). This skill only adds what Create/Iterate does next:

| Band | What follows here |
|---|---|
| `trivial` | Do not open or revise a requirements doc for behavior |
| `patch` | Iterate the owning doc: new AC + guards for existing behavior |
| `feature` | Create (or major Iterate) with full narrative + AC |

Saying the band *is* the sizing step. Skipping it is not "being pragmatic".

## Problem lock

When the ask is solution-shaped (names a store, API, flag, or "just do X") or
has no clear desired outcome, lock the **problem** before preference cards:

- **Observed** — who hurts / what is true now
- **Desired** — observable result when done (not "it works")
- **Non-goals** — deliberate outs

Options on a problem-lock card are alternate *problem statements*, not
implementations. Stack and mechanism stay assumptions until design — never
acceptance criteria.

## Question cards

Exactly **one** decision per message, in ordinary chat (not a truncated picker):

1. **Locked so far** — 1–3 settled constraints (or "none yet")
2. **This card** — the single fork
3. **Territory** — facts from the repo or prior answers; do not ask the user to
   recall what you can read
4. **Question** — plain language
5. **Why it matters** — what rewrites if the answer flips (scope, AC, users)
6. **Options (2–4)** — each with a consequence line; recommend one and why
7. **Stop** — wait for the answer; then next card or close package

Blast-radius first: users, success/measurement, scope boundaries, constraints,
non-goals — before polish. No fixed "question k of N"; stop when high-blast
product unknowns are empty or explicitly owned in Open Points.

## Close package

Before any Create draft (and before treating a behavior-changing Iterate as
done), emit this package and get an **explicit yes** on it:

1. **Scope band** — `trivial` | `patch` | `feature`
2. **Problem** — Observed / Desired / Non-goals (short)
3. **Success / done signal** — 1–3 observables with how you would check them
4. **Boundaries** — In scope / Out of scope
5. **Constraints & assumptions** — locks vs hypotheses (mechanism stays here or
   in design — not in AC)
6. **Open points** — each with owner or "blocks draft" — do not invent answers
7. **Confirmation ask** — "Confirm this close package before I draft/update
   `docs/requirements/…`?"

**Provenance rule:** every line in slots 2–5 is either (a) the user's words /
prior confirmed locks, or (b) explicitly labeled `hypothesis` / `assumption`
awaiting confirmation. A close package that fills Observed, Desired, and
Success with industry-default prose from a bare label — then asks the user to
rubber-stamp — has **not** finished elicitation. When input is only a label,
the first message is one problem-lock card (or one focused question), not a
fully invented package.

Not confirmation: silence, "looks fine, just write it", "standup — skip the
table", drafting in the same turn as the first interview question, or "yes"
on a package whose problem/success lines were unlabeled inventions.

## Hand-off into Create / Iterate

On yes: run Workflow Create or Iterate in `SKILL.md`. On correction: edit the
package and re-confirm. Never draft from an unconfirmed package.
