---
name: cmk:delivery-spec-plan
description: This skill should be used when the user asks for a "spec", "design", "implementation plan", or "how should we build this" for a tracker issue, after context intake for any non-trivial change, and as phase 2 of the cmk:delivery-pipeline skill.
version: 0.3.1
---

# Delivery Spec & Plan

The repo's `docs/design/` and `docs/requirements/` are the source of truth for
*what* and *why* at the system level — but realizing a specific issue needs
another layer of detail: current codebase reality, concrete approach choices,
and the back-and-forth reasoning that ends when the plan is solid enough to
execute without further debate. That layer is this phase's product.

Use `superpowers:brainstorming`, when present, to pressure-test the spec, and
`superpowers:writing-plans`, when present, to author the plan — otherwise
follow the same shape unaided. Two adaptations apply regardless: their
human-approval checkpoints do not apply here — decide, and record the
decision where this phase already requires it — and **the phase ends when
the plan is written.** Plan authoring normally chains straight into an
execution engine; here it stops, because the plan is the deliverable and the
next delivery phase (`cmk:delivery-pipeline`) owns engine selection.

Specs and plans go to git-ignored scratch. They are working artifacts, never
the record; durable conclusions reach `docs/design/`, `docs/decisions/`, the
tracker, and the PR description.

Read `cmk:delivery-workflow` and `cmk:delivery-pipeline`'s context-efficiency
reference before relying on the intake brief — the brief is a capsule, and
the context-efficiency continuity rules decide when mutable inputs must be
refreshed before planning on them. Confirm the intake brief's **scope band**
and **docs-ready** before planning implementable tasks: if docs-ready is
false for the band, stop and finish `cmk:requirements` (or an explicit
exemption) rather than planning around a hole.

Apply `cmk:delivery-pipeline`'s engineering-principles reference throughout:
decide everything yourself, staff-level bar without overengineering, existing
codebase as design input.

## Spec

Iterate until solid; one spec per issue.

1. **Approach selection.** Identify the 2–3 plausible approaches. Judge them
   against fit with existing patterns in the touched subsystems, the
   architecture in `docs/design/`, the recorded decisions in `docs/decisions/`,
   blast radius, and long-term system shape. A shortcut that works only locally, only in CI, or "until we harden it" loses to the production-ready foundation (`cmk:delivery-pipeline` engineering principles, No shortcut). Pick one. Record why the others lost — that rationale later goes in the PR description, and in an ADR
   first if it is architecture-shaping.
2. **Surface inventory and compat decisions.** When the change alters a
   contract, shape, or behavior, enumerate every affected surface from actual
   reference searches — consumers, call sites, tests, docs, configs, CLI
   help, fixtures — and give each item a disposition per the full-surface
   rules in `cmk:delivery-pipeline`'s engineering-principles reference:
   replace, compat wiring with a removal issue, or frozen. Mixed dispositions
   within one change are normal; record the driving factor per item. If the
   operator asked to decide — the whole change or named items — present
   decision briefs for the genuinely contestable items only and record the
   outcomes; obvious items are decided and reported, not asked.
3. **Low-level design.** Concrete types, module/package placement per the
   repo's role-first layout (`cmk:project-layout`), boundaries and who owns
   them, error modes, and how the change composes with what exists. Name
   things so an unfamiliar reader gets the correct first-pass mental model
   (`docs/rules/common/naming.md`, seeded by `cmk:agent-instructions`),
   using glossary terms where the repo keeps a glossary (`cmk:glossary`);
   a spec that coins a new system/component/actor term adds it there as
   part of the change. A new CI, deploy, or operator step names the
   host-runnable script and the composer that calls it (`cmk:cicd`).
4. **Invariant check.** Changes touching security, authorization, consensus,
   wire-format or cross-language parity vectors, settlement, or randomness
   invariants get the full-depth treatment (`docs/rules/common/testing.md`) —
   spell out exactly what must not change and which suites prove it.
5. **Doc impact.** List which `docs/design/`, `docs/requirements/`,
   decisions, or `docs/guides/` pages this change makes stale. Updating them
   is part of the implementation, not a follow-up.
6. **Production readiness.** Walk the production-readiness checklist in
   `cmk:delivery-pipeline`'s engineering-principles reference and address
   each item relevant to this change's blast radius: failure modes, config
   and secrets, migrations and compatibility, observability, rollout and
   rollback, performance limits, runbook and doc impact. Items the change
   deliberately does not cover are stated as accepted gaps with a reason —
   the review's production-readiness lens audits against this section.

## Plan

Break the spec into tasks with explicit dependency structure, so the next
delivery phase can run independent tasks concurrently.

Open with a **Global Constraints** section carrying the change's binding
obligations — the coverage bar, the surface inventory with its per-item
dispositions, the doc-impact list from the spec, tracker reconciliation duty,
the production-readiness tasks, and any invariant the change goes near with
the suites that prove it — one line each, exact values verbatim.

**Every task then carries these in its own `## Task N` body:**

```markdown
## Task 3: Persist the session ledger

Depends on: Task 1
File scope: libs/session/src/ledger.rs, libs/session/tests/ledger.rs
Exclusive resources: none

<what to build, the behavior to prove, the gate command that verifies it>
<plus the Global Constraints obligations that apply to THIS task, restated>
```

- **`Depends on:`** — genuine ordering requirements only, by task number.
  Omit it, or write `none`, when the task has none. This is what execution
  schedules from.
- **`File scope:`** — every path the task may touch. Disjoint scopes are
  necessary for two tasks to share a wave, not sufficient (execution also
  isolates worktrees and honors exclusive resources), and execution checks
  each task's commits against this list afterwards, so an inaccurate scope
  surfaces as a scope violation rather than silently permitting a race.
- **`Exclusive resources:`** — non-path shared services the task needs
  exclusively: a Docker daemon, a shared local chain or database, an
  external sandbox. Write `none` when there are none. Tasks with
  intersecting declarations never share an execution wave.
- **The obligations, restated inside the task body.** This duplication is
  deliberate and load-bearing. An execution engine builds an implementer's
  brief by slicing the plan at the task heading, so a header-level Global
  Constraints section reaches the *reviewer* and never the *builder*. The
  task text is the copy the implementer actually receives; Global
  Constraints is the copy the reviewer grades against. An obligation in
  neither place is an obligation nobody enforces.

Close with the issue's acceptance criteria mapped to the tasks that satisfy
them — cite `PREFIX-N.M` when the requirements doc defines IDs. An AC with
no task is a hole in the plan, and so is a surface-inventory item with no
covering task. Planning is the cheapest
moment to find out a criterion will not land: if no task can honestly
satisfy one, take its disposition now, on the issue, per `cmk:delivery-workflow`'s
`references/acceptance-criteria.md`.

A plan whose tasks all serialize on one file is worth re-partitioning before
it executes; sequential-by-accident is different from sequential-by-necessity,
and only the second is worth paying for.

## Exit gate

The phase is done when a competent engineer or subagent could execute the
plan without asking questions. Every open question from the intake brief is
resolved with a decision and a written rationale destined for a durable
surface. If one genuinely cannot be resolved safely it is a recorded
blocker per the principles — not a silent guess, and not a question parked
for the human.

Reconcile the tracker before exit: decisions or discoveries that change
scope, acceptance, constraints, relations, estimate, timing, risk,
interfaces, or another issue's plan are recorded on the owning issues now,
rather than waiting for implementation or ship.
