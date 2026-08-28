---
name: cmk:delivery-review
description: Use when the user asks to "review my changes", "review this PR", "take a look at this diff", or "is this ready to ship" — before shipping tracked work (phase 4 of cmk:delivery-pipeline) or standalone against any pull request or local diff. Produces a depth-disclosed verdict with evidence-backed findings dispositioned against acceptance criteria (citing requirement IDs when present).
version: 0.2.4
---

# Delivery Review

One contract, two occasions, three depths. This skill owns the lens list,
the evidence bar, adversarial verification, and disposition authority; the
fan-out mechanics are an engine choice.

- **Pre-ship mode** (own work, before a PR exists): findings are fixed in
  the working tree or deferred with a tracker issue. Nothing is posted.
- **Standalone mode** (an existing PR, or someone else's diff): findings
  are reported — for a PR, on one surface, the code host's PR or the
  tracker's synced review thread if it has one, never both; for an
  unpushed local diff, to the operator directly.

First assemble the same context an author would have: the issue and its
acceptance criteria, the spec including its production-readiness section,
the relevant `docs/design/` and `docs/requirements/` pages, and any
`docs/decisions/` ADRs governing the touched area — refreshed against the
current diff, HEAD, and PR state before dispatch. On pipeline pre-ship,
re-read HEAD after phase 3b; do not re-apply simplify (review judges).
**Reviewing a diff without its contract only catches typos** — that is why
this skill exists rather than a bare reviewer.

## Review depth

Depth is chosen before an engine, and applies to every review this skill runs.

| Depth | Engine | Fits |
|---|---|---|
| **Quick** | one pass on the runtime's native review command | ordinary PRs, small or mechanical diffs |
| **Targeted** | only the lenses the diff implicates | the usual case |
| **Full** | the seven-lens corroborated fan-out | a diff where a wrong answer is expensive |

- **Adaptive when unstated.** Select from the diff — size, blast radius,
  subsystem — defaulting to targeted. Changes touching security,
  authorization, consensus, wire-format or cross-language parity vectors,
  settlement, or randomness invariants get the full-depth treatment
  (`docs/rules/common/testing.md`), and so does a cross-cutting
  replacement or refactor of a shared surface.
- **Binding when stated.** An explicit depth is honored exactly, in both
  directions — never silently escalated or reduced. Where it contradicts
  a risk signal, run at the chosen depth and name the unacted signal.
- **Disclosed unconditionally.** Every verdict states the depth reached
  and whether it was chosen or adaptive — no reader can recover that
  difference unless it is written down.

Choosing or running a review engine at full depth? Read `references/engines.md`.

## The two occasions

**Boundary review** — a concrete cross-work or risk boundary: a join of
two or more issues or branches, a shared or public contract, a persisted
format, a deployable-component handoff, an upstream pin replacement, or a
changed consumer interface. State the trigger and inspect every relevant
lens.

**Pre-ship review** — mandatory before every completed issue or branch
ships, and before every combined integration output; `cmk:delivery-ship`
gates on it having run and its depth being disclosed. It never reduces
depth adaptively — absent an explicit instruction it runs full. An
operator may reduce it, but the completion report then says plainly the
run shipped below its standard gate: a decision that leaves a trace, not
a quiet default.

## The lenses

The seven lenses (correctness, spec/AC compliance with requirement IDs,
code quality, cross-surface consistency, edge cases, security, production
readiness) — full definitions: read `references/lenses.md`.

## Evidence, or it did not happen

Every lens writes findings with `file:line` traces and severity, plus a
"what I read / ran / checked" section: files examined, commands executed
with output, criteria walked. A review with zero findings and a thin
evidence section is a failed review — re-run it. An empty findings list is
only credible next to a substantial evidence trail.

## Verify before acting

Reviewer output is claims, not truth. Adversarially verify each finding —
the `cmk-delivery-verifier` role, or the runtime's adversarial mechanism —
by reproducing it or tracing its exact path, before acting on it. Discard
what does not survive. This applies at every depth, including quick: a
false positive fixed is a new bug, and one posted to a teammate's PR is
noise that erodes trust. A faster reviewer raises findings sooner, which
makes verification more necessary, not less.

## Disposition (every finding gets exactly one)

- **Fix now** — anything required by the current acceptance criteria,
  plus cheap-and-clear improvements. AC-required work is never
  *deferred*: fix it, rescope the criterion in the open, or formally
  block the delivery. A finding that reveals delivery truth another
  session needs still reconciles its owning issue, even fixed.
- **Rescope the criterion** — the criterion is real but will not land
  here. Narrow the issue's criteria to the honest outcome and move the
  remainder to a tracked successor per `cmk:delivery-workflow`'s
  `references/acceptance-criteria.md`. This is the only way AC-required
  work leaves an issue, available only when the issue and its successor
  are both updated before the verdict.
- **Defer with a tracker issue** — real, out of current scope. File a
  thorough issue (context, why deferred, acceptance criteria, priority,
  estimate, links) or extend the issue that already owns it; in
  standalone mode link the review thread to the new issue. A deferral
  without an issue is a dropped finding.
- **Discard with a reason** — did not survive verification. Keep the
  reason in the review record so the same ghost is not chased twice.

A finding that collides with what a plan's text mandates is dispositioned
here, not escalated: where the plan and the repository's quality bar
disagree, the bar wins and the plan is corrected in the same change.

Re-run gates after fixes. Pre-ship mode exits when every finding is
dispositioned and gates are green. Standalone mode ends with a verdict —
approve or request changes — and findings posted to one surface. Before
either exit, reconcile every delivery consequence on the affected tracker
issues.

## Red Flags

- Bare "LGTM" / approve with a thin or empty evidence section
- Skipping the AC walk because "nothing jumps out"
- Treating Quick depth as permission to skip adversarial verification
- Social proof ("nobody writes evidence sections") waiving the evidence bar

## Rationalizations

| Thought | Reality |
|---|---|
| "Just say LGTM if nothing jumps out" | Zero findings need a substantial evidence trail or the review failed — re-run it. |
| "Nobody writes evidence sections" | Social proof does not replace `file:line` traces and commands-run. |
| "Ship tonight — full lenses are overkill" | Depth may be Quick/Targeted; evidence and AC walk still run. |

Using Linear as your tracker? Read `references/linear.md`.
