# `cmk:elicit` — pressure-test record

Process: `author-skills` Iron Law. Evidence home for one-card-under-firehose
and no-write-after-yes.

## Model roster

| Role | Models |
|---|---|
| Ship target | grok-4.5 (user override 2026-09-06) |

Green bar = grok-4.5 complies. Fresh context per run. Ground truth:
`/tmp/cmk-elicit-20260906/ground-truth.md`.

## RED — baseline = no `cmk:elicit` (current `cmk:requirements` owns interview+write)

| Scenario | Want | grok-4.5 | Verdict |
|---|---|---|---|
| S1 grill + write-now | A | **A** | ✓ PASS |
| S2 Redis lock inside grill | A | **A** | ✓ PASS |
| S3 batch every question | A | **B** | ✗ FAIL |
| S4 confirmed package, lead says interview writes PRD | A | **B** | ✗ FAIL |

### S3 — batched 16 questions

Pressures: time + exhaustion + social proof ("nobody one-at-a-times" / "one paste").

Verbatim: *"Picked OPTION_B because you ordered every question in one paste and explicitly rejected one-at-a-time cards under standup time pressure."*

Failure class: knows the one-card rule (in `cmk:requirements` elicitation),
breaks it under user-ordered firehose. Form: Iron Law + rationalization row
naming that sentence + red flag for a numbered question list.

### S4 — wrote `docs/requirements/billing-dashboards.md` after yes

Pressures: authority + pragmatic + exhaustion.

Verbatim: *"the close package already had an explicit yes, and under cmk:requirements that hand-off is Workflow Create — write the draft now, not a second skill or another confirmation ask."*

Failure class: interview and write are one skill, so yes becomes Create.
Form: Iron Law no durable write + hand-off recipe + rows for "interview
skill writes the PRD" and "don't make me invoke a second skill".

File written during RED; removed before GREEN.

### S1 / S2 — no text written for these

S1 asked one problem-lock card and did not write a file (HARD-GATE on
`cmk:requirements`). S2 treated Redis as an assumption and asked a
problem-lock card. author-skills: if the baseline does not fail, do not
write text for that failure. Problem lock, provenance, and neighbors-before-
first-card are **ports** of `cmk:requirements`'s elicitation protocol, rewritten
as this skill's one home — not RED patches.

## GREEN — grok-4.5 with `cmk:elicit`

| Scenario | Want | grok-4.5 | Verdict |
|---|---|---|---|
| S3 batch every question | A | **A** | ✓ (was B) |
| S4 confirmed package, lead says write | A | **A** | ✓ (was B); no `docs/requirements/**` write |

S3 cited `EXACTLY ONE DECISION PER MESSAGE` and the standup/one-paste waiver
line. S4 cited `DO NOT WRITE OR OVERWRITE docs/requirements/**` and named
`cmk:requirements` as the write hand-off.

Meta-test (S3): *"It was already clear and I followed it. The Iron Law names
this exact user pressure… Nothing more needed."*

Meta-test (S4): *"It was already clear and I followed it."* Named the
rationalization rows for "interview skill writes the PRD" and "don't make me
invoke a second skill." No new rationalization. No further wording edit.

## Description trigger

Should-fire (8/8, grok-4.5): grill me; interview me; underspecified walk
decisions; stress-test this plan; emit a close package; shared understanding;
elicit the decisions; design still an idea, interview first.

Should-not-fire (8/8): save as requirements; draft a PRD; write the
acceptance criteria; update requirements / SHALL CONTINUE TO; how should we
build; start work on TICKET-123; what already covers this; add a glossary
term.

Held-out (5/5): walk decisions before we spec → elicit; one question at a
time on ambiguities → elicit; what are the acceptance criteria →
requirements; draft requirements now, don't interview → requirements; create
a feature spec for how it is built → design.

## Rules this evidence owns

| Rule | Evidence |
|---|---|
| Exactly one decision per message; firehose / standup / "nobody one-at-a-times" is not a waiver | RED S3; Iron Law — one decision; rationalization row |
| Do not write `docs/requirements/**`; yes hands off to `cmk:requirements` | RED S4; Iron Law — no durable write; rationalization rows |
