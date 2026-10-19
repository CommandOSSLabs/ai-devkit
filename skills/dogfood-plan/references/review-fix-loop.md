# Review fix loop

Load when `.skills/<CODE>/dogfood-review.md` has open findings. You — the
controller that wrote the guide — run this loop. The reviewer stays read-only;
patches happen outside the review, then a fresh reviewer re-checks.

| Step | Owner | Rule |
|---|---|---|
| 1. Order | controller | Order open findings by severity: Critical → Important → Minor. Severity orders work only; it does not drop findings from the gate. |
| 2. Patch | controller or fixer | Patch the **run file only** (add or reshape cases, sections, authored slots), then re-render the HTML with `dogfood render`. **No product-code patches.** |
| 3. Re-review | fresh subagent | **Immediately** after patching — before the drive, before any "clean" claim — dispatch a **new** reviewer (never the previous one) with `pass_kind: re-check` and `prior_report` set to the previous report. The gate reads **only the new report** — never the prior open list, never hand-edited "fixed" marks. |
| 4. Clear | new report | A finding clears only when it is **absent from the new open list**, or the user names it in an explicit **named override**. Never declare clean without a new report. |
| 5. Escalate | controller | **≥ 5** open findings, or a rewrite spanning **≥ 2** ability areas → dispatch an isolated **fixer** subagent instead of patching in this context. |
| 6. Cap | controller | Cap at **2 re-review cycles**. Still open after the second → **stop for the human**: fix more, a named override listing the remaining `VFG-N`, or a smaller surface. |

## Fixer subagent (when escalated)

Write `.skills/<CODE>/review-fix-brief.md`: the open findings (`VFG-N`,
severity, situation, evidence), the run-file path, and the render command — not
the session history. The fixer patches the run file and re-renders only, and
never declares clean. After it reports DONE, dispatch a fresh reviewer.

## Rationalizations

| Thought | Reality |
|---|---|
| "I fixed the cases — it's clean now" | Only a new report clears findings. Dispatch a fresh reviewer |
| "I'll mark the old report's findings fixed" | That is not a re-check. Write nothing to the old report |
| "Five small misses — I'll keep patching here" | ≥ 5 or ≥ 2 areas → fixer subagent |
| "A third review will clear it" | The cap is 2; stop for the human |
| "The drive will find the gaps anyway" | Inventing cases mid-drive is the failure the review exists to prevent |
