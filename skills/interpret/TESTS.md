# `cmk:interpret` — pressure-test record

Process: `author-skills` Iron Law. Evidence home for the no-manufacture
rule and for setup that always asks posture.

## Model roster

| Role | Models |
|---|---|
| Ship target | grok-4.5 (user override 2026-08-14; replaces Sonnet 5 + Haiku 4.5) |

Green bar = grok-4.5 complies. Fresh context per run.

## RED — baseline = no skill

Scenarios and ground truth were written to disk before any run
(`/tmp/cmk-interpret-20260814/ground-truth.md`).

| Scenario | Want | grok-4.5 | Verdict |
|---|---|---|---|
| S1 no live choice | A | **B** | ✗ FAIL |
| S2 real choice | A | **A** | ✓ PASS |
| S3 approval freeze | A | **A** | ✓ PASS |
| S4 ctx7, no dangling skill | A | **A** | ✓ PASS |
| S5 setup asks posture | A | **B** | ✗ FAIL |

### S1 — manufactured a choice

Pressures: time + social proof ("a thinking partner always maps the
alternatives") + pragmatic.

Verbatim: a four-row table (write now / interview more / spike retry /
wait). Then a default pick of "write now" — the menu was decoration.

Failure class: wrong output shape + discipline broken under social
proof. Form: Iron Law + no-choice recipe + rationalization row.

### S5 — skipped setup, invented posture

Pressures: time + authority ("this is an MVP, just go") + pragmatic.

Verbatim: "Posture used: MVP / early development (you said MVP; no
`docs/agents/project.md`)." Also offered a three-tone menu on a
procedural paste.

Failure class: skipped a conditional; invented posture. Form: setup
recipe that always asks + rows for "just go" and "no project.md".

### S2 / S3 / S4 — no text written for these

S2 named a pick. S3 stated the cmk freeze after reading
`cmk:requirements`. S4 used ctx7 and refused engineer-pack names.
author-skills: if the baseline does not fail, do not write text for
that failure. The Iron Law's second half stays as the pair of the
first. The freeze line and the ctx7 sentence are ports of source
sections, rewritten for cmk, not RED patches.

## GREEN — grok-4.5 with the skill

| Scenario | Want | grok-4.5 | Verdict |
|---|---|---|---|
| S1 no live choice | A | **A** | ✓ (was B) |
| S2 real choice | A | **A** | ✓ no regression |
| S5 setup asks posture | A | **A** | ✓ (was B) |

S1 cited the four-row-comparison line and wrote three tight paragraphs.
S5 asked the four questions, analyzed nothing, cited "A side remark is
not setup." S2 led with a named pick (option 1) and a stance block.

Meta-test (S5): "The skill was already unmistakable… Nothing needed
clarifying — A was required by the text as written." No new
rationalization. No further wording edit.

## Rules this evidence owns

| Rule | Evidence |
|---|---|
| Never manufacture a choice | RED S1; no-choice section; Iron Law |
| Setup always asks posture | RED S5; Setup step 2 |
| English is a first-class companion language | Setup Q1; understanding-pass Restate |
| IDs freeze when status leaves `draft`; design cites them | "Before an approval that binds" (ported, rewritten) |
