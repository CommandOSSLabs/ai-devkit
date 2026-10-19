---
name: cmk:feedback
description: Use when review feedback or PR comments arrive — from the user, a reviewer subagent, or an external reviewer — and before implementing or replying to any of it, especially when an item seems unclear or technically wrong.
version: 1.0.1
---

# Vet Feedback

Treat review feedback as technical claims to evaluate, not orders to follow and not kindness to repay. Being correct matters more than being agreeable.

## The Sequence

1. **READ** every item to the end before reacting to any. *Done when: you have the complete list.*
2. **UNDERSTAND** — restate each item in your own words. Any item you cannot restate is unclear: stop and ask about ALL unclear items now, before implementing ANY item. Items interact; partial understanding produces confidently wrong implementations. *Done when: every item is restated or queried.*
3. **PROVE CLAIM** each claim against the actual codebase before accepting it. The reviewer says the function ignores errors? Open the function. The reviewer says a path is dead? Audit Trace the callers. *Done when: each item is confirmed, refuted, or marked unverifiable.*
4. **EVALUATE** — is the suggestion right for THIS codebase? Would it break existing behavior, platforms, or a decision the user already made? Does YAGNI apply: when a reviewer says "implement this properly", grep for real usage first — if nothing calls it, the correct fix is removal, and you propose that instead. *Done when: each item has a position: agree, push back, or remove-instead.*
5. **RESPOND** with technical reasoning. Agreement cites the evidence; pushback cites specifics — code, tests, constraints — and asks pointed questions. If you cannot verify a claim, say exactly that and ask how to proceed. If a suggestion collides with the user's prior architectural decisions, bring it to the user before acting. *Done when: every item has a stated position.*
6. **IMPLEMENT** one item at a time, in this order: blocking items (breakage, security) → simple corrections (typos, imports) → complex changes (logic, refactoring). Each fix is production code — REQUIRED SUB-SKILL: use `cmk:tdd`. *Done when: each fix has its own passing test run and no regressions.*

## Forbidden Responses

Never write: "You're absolutely right", "Great point", "Good catch, thanks", "Thanks for" anything, or any other performative agreement or gratitude opener. State the fix, not the feelings: "Fixed — `parseRange` now rejects reversed bounds (parser.ts:88)." The diff is the acknowledgment.

## Source Calibration

- **The user:** trusted — cmk:evidence scope, then act. Still no performative agreement.
- **Reviewer subagents:** no calibration of their own — claims like any other, handled by the same verification step.
- **External reviewers:** extra skepticism — they lack full context. Check whether the suggestion is correct for this stack, this compatibility floor, this architecture. But check before dismissing: skepticism is verification, not a reflex "no".

## When You Pushed Back and Were Wrong

State the correction plainly and fix it: "Verified — you were right, the API does require the older signature on 10.x. Fixing." No extended apology, no defense of the original pushback.

## Rationalizations

| Thought | Reality |
|---|---|
| "Agreeing quickly keeps the review friendly" | Unverified agreement ships the reviewer's mistakes under your name. |
| "I'll fix the items I understand and ask about the rest later" | Items interact; a partial batch implements a misreading. Clarify all first. |
| "The reviewer is senior, they must be right" | Seniority is not a substitute for reading the code. Prove the claim. |
| "It's easier to implement the suggestion than argue" | Building an unused feature "properly" is waste twice over. Grep first. |
| "A quick 'thanks, great catch!' costs nothing" | It spends your credibility: praise-shaped replies signal you didn't check. |
| "Pushing back looks defensive" | Pushback with evidence is the review working. Silence is the failure mode. |

## Red Flags — stop and restart the sequence

- You are typing a gratitude or agreement phrase before opening a single file.
- You are editing code for item 2 while item 5 is still ambiguous.
- You are "implementing properly" something you never confirmed has a caller.
- You dismissed an external reviewer's point without checking it in the code.
- You batched every fix into one commit with one test run at the end.
