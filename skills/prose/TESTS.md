<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:prose` — test evidence

## Roster

`grok-4.6` and `grok-4.5`. Green when the weakest complies.

## Method note

An earlier J-Space RED (Maya: "put status in STATUS.md, I have to read it
out loud") **complied** 2/2 — the "read out loud" cue already selected
the outer register. That batch is not this skill's evidence.

This skill is owned by a harder prompt: Maya says only "I'm back. What
happened?" No "read out loud." No A/B/C. Process notes are on screen.

A first g45 run produced a reply **byte-identical** to g46's. That copy is
quarantined and discarded as possible contamination. g45 was re-run in a
fresh directory with "do not search outside this working directory."

## RED — S-REPLY, current pack, no `cmk:prose`

**Fixture.** `SESSION_NOTES.md` holds `cmk:delivery-build`'s `references/inline.md`, `REQUIRED SUB-SKILL:
use test-first`, `REQUIRED SUB-SKILL: use prove-claim`, `Pass: loop`,
`Satisfies: BILL-1.4`, `Core hub`, `Tier 2`. Ledger Next is the PDF-export
failing test.

**Prompt.** Mid BILL-1.4, compacted, exhausted, "pragmatic not dogmatic."
Maya: "I'm back. What happened?" Write `REPLY.md`. Do not edit `src/`.

Pressures: compaction + exhaustion + pragmatic slogan + manager return.

**Observed**

| Rep | Model | Verdict | Tokens that leaked |
|---|---|---|---|
| 1 | grok-4.6 | **FAIL** | `Core hub`, `cmk:tdd`, `prove the claim`, `cmk:delivery-build`'s `references/inline.md`, `closed the loop` |
| 1 | grok-4.5 | discarded (byte-identical to g46) | — |
| 2 | grok-4.5 | **FAIL** (milder) | `cmk:tdd`; "ledger's next step"; no `cmk:delivery-build`'s `references/inline.md` / `Satisfies` |

g46 verbatim shape: *"Core hub is `report.js`"*, *"(test-first, then prove
the claim). Execute loop is cmk:delivery-build's references/inline.md. Have not closed the loop."*

g45 r2: *"Plan is set — rounding lives in `report.js`, test-first — but
the ledger’s next step is still the failing PDF-export test."*

They answered the question. They leaked the inner register to do it.

### Rules this evidence owns

| Rule | Evidence |
|---|---|
| A person-facing reply does not carry skill names or pass/tier/Satisfies grammar | g46 named `cmk:delivery-build`'s `references/inline.md`, `cmk:tdd`, `prove the claim` |
| "She knows how we work" does not license the leak | Maya is the eng manager; both reps still dumped protocol |
| "test-first, then prove the claim" is process talk, not precision | g46 used that exact pairing; g45 r2 still said `cmk:tdd` |

## GREEN — same fixture, `cmk:prose` loaded

Same prompt, isolated directory per rep, skill body in context.

**Observed, 4/4 PASS.** Sweep list empty on disk. Four distinct MD5s
(not a copy). Each reply named BILL-1.4, `report.js`, and the PDF-export
test. None named a skill.

| Rep | Model | Sweep |
|---|---|---|
| 1 | grok-4.6 | clean |
| 1 | grok-4.5 | clean |
| 2 | grok-4.6 | clean |
| 2 | grok-4.5 | clean |

## Meta-test (grok-4.6, GREEN r1)

Text was clear. Quoted iron law. Asked for a SESSION_NOTES → REPLY
worked example; added one. No new rule.

## Description trigger test

Both roster models: SF1–SF8 + H1 → `cmk:prose`. SN1 `cmk:source-trust`,
SN2 `cmk:feedback`, SN3/SN8/H3 `cmk:evidence`, SN4 `cmk:debug`,
SN5 `cmk:delivery-review`, SN6 `cmk:delivery-handoff`'s `references/handoff-document.md`, SN7 `cmk:delivery-ship`,
H2 `cmk:feedback`.

## Wording micro-tests

Not run as a 5-rep A/B. One form bound 4/4.

## v1.1.0 — machine polish on a PR body (2026-09-08)

**Roster:** grok-4.5. A/B/C menus in an earlier batch named the dry option
and 3/3 complied; that batch is discarded as a leak.

**RED (v1.0.0 loaded).** Maya needs a GitHub PR in four minutes. Staff:
"Polish it. Dry notes bounce off the board. Sell why rounding matters."
No option menu. No tell-vocabulary in the prompt.

| Rep | File | Verdict |
|---|---|---|
| boardline | `PR.md` | **FAIL** glued em dash `customers—the` plus trust-erosion sell |
| execfold | `PR.md` | **FAIL** spaced em dash `PDF — and how finance` |

Process tokens were already gone. The remaining leak is polish punctuation
the boardline file actually shipped.

**GREEN:** sweep list adds em dashes and "not just / not merely" frames.
Worked example no longer models an em dash. Re-run the same PR prompt.

**Observed (grok-4.5 ×2, `pressline` / `inkboard`).** Both `PR.md` files name
`report.js` and the PDF-export test. Zero em dashes. Zero "not just / not
merely". Zero process tokens.

## RED — PR prose under "make it read well", 2026-09-09, Sonnet, 2 reps

Both reps got the same real branch (a retry-jitter plus dead-letter-callback
diff with tests) on independent copies under different names, and the same ask:
write the PR title and description, knowing a VP would lift wording from it and
a manager had said "make this one read well". Neither prompt named a pattern,
a section, or a rule. Scoring was mechanical, by script, not by reading.

**Failed 2 of 2, on four things:**

| Pattern | Rep 1 | Rep 2 |
|---|---|---|
| em dashes | 4 | 4 |
| sentences over 25 words | 6 (max 46w, mean 25.4) | 6 (max 44w, mean 27.2) |
| a `Test plan` section | yes (bolded) | yes (`## Test plan`) |
| the five-section structure | absent — invented What / Why / Changes | absent — invented What / Why / What's covered |
| `Co-Authored-By: Claude …` in the body | yes | yes |

**Clean 2 of 2**, and this is the load-bearing half of the result: zero hits
across 20 AI-vocabulary words (`delve`, `crucial`, `tapestry`, `robust`,
`leverage`, …), 11 puffery phrases, "fancy ways to say is" (`serves as`,
`boasts`), superficial `-ing` phrases, vague attributions, and the
"not just X, but Y" frame.

**What was written, and what was not.** The second skill set's cleanup pass
carries roughly sixteen prose patterns; twelve of them produced no failure here,
so they were not imported — that catalogue would have been mostly no-op text.
Its four-layer technical-writing standard collapses, on this evidence, to one
measurable rule: sentence length. That rule and the model-signature tell are the
only additions to the sweep list.

Two rules already shipped in be76a44 were confirmed rather than added: the ban
on `## Test plan` (rep 2 wrote exactly that heading) and the five-section
fallback (neither rep invented anything close to it unaided).

## v1.3.0 — the language of each surface (2026-10-18)

Roster: sonnet (`skill-tester`) and haiku (`skill-tester-haiku`), in-session runners.
Fixture `harbor-ledger` + `scenarios/lang-pr.sh`: Lan's nightly-backup branch is done; a
bare origin stands in for GitHub and a `gh` shim logs the PR. Installed: `cmk:delivery-ship`,
`cmk:prose`. Prompt, in Vietnamese: open the PR, leave Quang a note on the ticket, send
me the link. It names no language and no rule. Scored by `scenarios/lang-score.py`:
Vietnamese diacritics in the new ticket comment and in the PR title and body; the chat
reply read by hand.

### RED — 1.2.0

| Prompt | Runs | Chat to Lan | PR body | Ticket comment |
|---|---|---|---|---|
| plain: "comment for Quang that the PR is up" | 3 h, 2 s | Vietnamese 5/5 | English 5/5 | English 5/5 |
| Quang's own note on the ticket is Vietnamese; Lan dictates three points, "viết sao cho anh Quang đọc là hiểu liền" | 3 h, 2 s | Vietnamese 5/5 | English 5/5 | **Vietnamese 5/5** |

The plain prompt is a no-op for this edit: the agents already split the two surfaces. The
second fails on every run, haiku and sonnet alike. The thread's language and "he'll get it
at a glance" pulled the comment into Vietnamese, while the PR body for the same change
stayed English. v1 read `cmk:prose` and `cmk:delivery-ship` and still wrote Vietnamese: 1.2.0
says nothing about language. Fixture note: in RED the Vietnamese note was edited in on the
feature branch. v4 noticed the diff and asked Quang to confirm the wording. GREEN puts the
note on `dev` before the branch, and two control runs re-ran RED there.

Failure class → form: behavior that should depend on a condition → an observable
conditional (`Language:` in `docs/agents/project.md`, else English), with the 5/5 split
as its counter. The new `Language` field is in the `project.md` template, optional.

### GREEN — 1.3.0, note on `dev`

| | h1–h5 | s1–s2 | control (1.2.0) c1–c2, haiku |
|---|---|---|---|
| ticket comment | English 5/5 | English 2/2 | Vietnamese 2/2 |
| PR body | English 5/5 | English 2/2 | English 2/2 |
| chat to Lan | Vietnamese 5/5 | Vietnamese 2/2 | Vietnamese 2/2 |

Every GREEN reply gave the reason in Lan's language. h1: "Em viết bằng tiếng Anh vì repo
không khai báo `Language:` khác." s1 left the comment uncommitted, to keep the PR at one
commit, and said so. The language was right; where the comment went is outside this edit.
The weakest model is 5/5 on both surfaces. Plan T5's Done line is met.

Not written: pointers in `cmk:delivery-ship`, `cmk:delivery-pr` and `cmk:discover-efforts`'s `references/publish.md`. 7 of 7 GREEN runs
reached `cmk:prose` on their own (its description now names a ticket comment), and no PR
body failed in any of 17 runs. Not covered: a repo that sets `Language:`, and a real
tracker, where the comment is a tracker call rather than a file edit.
