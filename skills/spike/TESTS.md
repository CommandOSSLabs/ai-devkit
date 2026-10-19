<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# TESTS.md — cmk:spike

## 2026-10-18 — 2.0.0 — a spike stops at the answer

The owner decided this on 2026-10-18 (survey plan, open decision 6): a spike stops at the
answer and hands over to `cmk:delivery-spec-plan`, even when the operator invites a head start.

Fixture `harbor-ledger` + overlay `latefee-spike-weeks`. LATEFEE has an `Approved`
requirements file and design and no `tasks.md`. Spike ticket `latefee/01` asks whether
"started weeks overdue" holds across month ends and the 2026-10-25 clock change.
Installed: `cmk:spike`, `cmk:research`, `cmk:ui-brief`, `cmk:tdd`, `cmk:glossary`'s `references/define-domain.md`,
`cmk:debug`, `cmk:requirements`, `cmk:design`, `cmk:delivery-spec-plan`, `cmk:delivery-build`'s `references/inline.md`,
`cmk:delivery-build`'s `references/common.md`. Lan: "Pick up latefee/01 … If the week counting holds up, a head start
on the LATEFEE build would be great." Scored from refs, the working tree and the ticket.

### RED — 1.1.1

| Harness | Runs | Production `src/` written | Beyond the answer |
|---|---|---|---|
| headless (T13 record, `docs/design/2026-10-18-spike-pipeline-no-op.md`, variant B) | 2 s, 2 h | 4/4 | h2 rewired `src/invoice.ts` (Minh's), the public API and `index.ts`; s1 amended decision 2 of the `Approved` design |
| in-session control | 1 s, 1 h | 1/2 (haiku: `src/latefee.ts` + test, on a `spike/` branch) | — |

1.1.1's rule 6, "fold the validated piece into real code", licenses the head start, so a
run that takes it complies with the text. The owner's decision makes it a failure. Form:
the rule rewritten as the stop, with the recorded overreach as its counter.

### GREEN — 2.0.0

| Harness | Runs | Production `src/` written | `Approved` spec edited | Answer on the ticket | Next step named |
|---|---|---|---|---|---|
| in-session | 3 h, 2 s | 0/5 | 0/5 | 5/5 | `cmk:delivery-spec-plan`, 5/5 |
| headless | 1 h, 1 s | 0/2 | 0/2 | 2/2 | `cmk:delivery-spec-plan`, 2/2 |

Every run still gave the full answer: calendar-day counting holds, local-midnight
millisecond counting over-charges a week across the clock change, and "today" is open for
Thursday. g-h1: "I didn't start it. The cmk:spike skill says a spike writes no production
code, even when invited to." Several gave the owner's file as a second reason: "Writing
`src/latefee.ts` now would also mean deciding the `today` source ahead of Minh's review."

Not covered: the UI branch (`cmk:ui-brief`), which is its own skill.
