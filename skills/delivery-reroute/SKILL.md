---
name: cmk:delivery-reroute
description: Use when a mid-execution discovery invalidates an already-approved plan — "the plan is wrong," a re-plan is needed, scope changed mid-flight, or a divergence surfaces during cmk:delivery-build's references/continuous.md or test-first that the current task can't absorb — or when the operator amends a running build — adds a constraint, cuts scope, drops a requirement. Produces a blast-radius classification of the lowest invalidated artifact plus a re-entry decision or change proposal, never a silent rewrite. Not for a post-ship in-scope tweak (cmk:amend), broken code against a still-valid spec (cmk:debug), or the mechanical reconciliation that runs after the decision (cmk:realign).
version: 1.1.1
---

# Delivery Reroute

The mid-flight rewind decision for when a discovery falsifies an approved plan. It is a **thin router**: it decides *which artifact is now false and how far back to rewind*, then delegates, per Thin-router exit below. `cmk:delivery-build`'s `references/continuous.md` hands off here when it hits "the plan itself is wrong" or a circuit breaker whose root cause sits above the current task; a user may also invoke it directly the moment something feels off.

Three phases, in order: diagnose, classify, route. Two hard stops, never an auto-rewrite.

**Who found the change decides the entry.** You or a worker found it → Phase 1. It is
in the operator's own message — they say what is added, changed, or cut → Operator
amendment, below.

## Operator amendment — their message is both approvals

The operator who says "take the status out" has already ruled go and chosen the change;
Phase 1 and Phase 2 do not stop again. Twelve baseline runs got such a message while the
operator was in meetings until 4: one stopped at Phase 1 and did nothing all afternoon;
three read this skill and skipped its stops on their own authority.

1. Classify the lowest invalidated artifact as in Phase 2, and append the ledger line
   (Idempotency, below). The level says which artifacts change; nobody is asked.
2. Edit those artifacts and everything below them, the way their owning skill would,
   without that skill's file-approval stop.
3. Carry the build on as the operator said.
4. The report ends with a REQUIRED **Check this wording** block: every requirement,
   design, and task line you wrote or struck, verbatim, with its file. This block is
   where the approval you skipped happens. Across twelve baseline amendments, eleven
   rewrote an `Approved` spec and not one quoted the words it wrote.

## Phase 1 — Diagnose (hard stop for the user)

A discovery — not an operator amendment.

Author a structured diagnosis notice with five labelled parts:

- **What** is wrong or changed
- **Where** the deviation surfaced
- **Why** the current plan is no longer valid
- **How** it impacts the remaining execution
- Any other **context** needed to decide

Present the notice and **STOP**. Do not classify, do not touch any artifact, do not proceed until the user has ruled explicitly.

**Done when:** the user has ruled go or no-go.

If the user declines: make no spec or code change and return control without a rewind. This is a clean no-op, not a partial rewind — nothing on disk moves.

## Phase 2 — Classify the lowest invalidated artifact

Only after the diagnosis go-ahead. Identify the **lowest** level in the chain genuinely invalidated, and cite the evidence for it:

| Level | The discovery falsified… | Re-entry (Phase 3) |
|---|---|---|
| **Task-local** | only the current task's approach; the spec still holds | back to `cmk:delivery-build`'s `references/continuous.md`/`cmk:tdd` |
| **Plan** | task breakdown / sequencing / coverage; design holds | `cmk:delivery-spec-plan` |
| **Design** | an architecture/design decision; requirements hold | `cmk:design` → `cmk:delivery-spec-plan` |
| **Requirements** | what was promised — a criterion is wrong or missing | `cmk:requirements` → design → plan |
| **Vision** | the feature's premise conflicts with product scope | name `/cmk:pivot` when shipped code/specs collide with the new premise; else the vision layer (`/cmk:vision`), else escalate to a human |

**The classification law:** pick the *lowest* level with evidence. Rewinding to a higher level "to be safe," without evidence for that higher level, is **prohibited**. A discovery that only breaks the current task's approach does not earn a trip to `cmk:requirements` just because the rewind feels safer big.

Present a **change proposal** — the chosen level, its evidence, and the proposed re-entry — and **STOP** for the user's approval before routing.

**Done when:** the user approves the proposal.

The proposal is **ephemeral**: it lives in the conversation for the go/no-go and is **never** written as a standalone artifact on disk. Nothing under `docs/specs/` records "a change was proposed" — only the eventual re-entry skill's own edits, and the ledger below, leave a trace.

## Idempotency — the evidence ledger

Every rewind must be driven by **newly discovered evidence** — not a second look at the same fact. Before classifying, read `.skills/<CODE>/corrections.md` (ephemeral, git-ignored scratch, parallel to `.skills/<CODE>/progress.md`, scoped to the in-flight plan). It carries one line per acted-on correction: an **evidence fingerprint**, the **chosen level**, and the **outcome**.

IF the current divergence would re-classify the **same already-acted-on evidence to the same lowest invalidated artifact**, with no new evidence, do **NOT** re-enter that level again. Escalate to the user instead — this breaks the `cmk:delivery-build → cmk:delivery-reroute → write-* → cmk:realign → cmk:delivery-build` loop before it spins. A genuinely new discovery is not blocked by this: record its fingerprint, its level, and its outcome as a new ledger line, and classify normally.

**Done when:** the ledger has been read before classifying, and either escalation fired (repeat, no new evidence) or a new line was recorded (genuinely new evidence).

Note the ledger is scratch, not a durable spec artifact — recording to it does not conflict with the ephemeral-proposal rule above, which concerns the change *proposal*, not this correction log.

## Phase 3 — Route and re-enter

On proposal approval, route to the matching re-entry. Invoke each as a REQUIRED SUB-SKILL **directly** — never merely suggest the user run it — and let that skill run its **own** approval gate:

- **Task-local** → return to `cmk:delivery-build`'s `references/continuous.md`/`cmk:tdd`; no upstream artifact is rewound.
- **Plan** → REQUIRED SUB-SKILL: use `cmk:delivery-spec-plan`.
- **Design** → REQUIRED SUB-SKILL: use `cmk:design`, which flows forward into `cmk:delivery-spec-plan`.
- **Requirements** → REQUIRED SUB-SKILL: use `cmk:requirements`, which flows forward into design and plan.
- **Vision** → WHERE shipped code or specs collide with the new premise, **name**
  `/cmk:pivot` for the user (user-invoked; do not invoke it). WHERE the
  collision is doc-only and `docs/requirements/vision.md` exists, name
  `/cmk:vision` (update). WHERE neither layer exists, **escalate to the
  user**, and re-enter REQUIRED SUB-SKILL: use `cmk:scope` **only if** the user
  agrees the premise is genuinely in question.

**Done when:** the matching sub-skill has been invoked directly and its own gate is running — `cmk:delivery-reroute` does not fabricate a second approval step on top of it.

## Thin-router exit — delegate, reconcile, record, resume

`cmk:delivery-reroute` **never** rewrites requirements, design, plan, tasks, or traceability metadata itself. All spec-content generation delegates to the `write-*` skills; all triad reconciliation delegates to `cmk:realign`.

After the re-entry skill's approval gate passes:

1. **Reconcile.** WHEN the re-entry changed already-approved artifacts or their trace links, REQUIRED SUB-SKILL: use `cmk:realign` to realign `Status` and the traceability — it owns the strikethrough-with-reason retirement and the INDEX update; `cmk:delivery-reroute` does not reimplement any of it.
2. **Record.** WHEN the final approved change carries an **architectural consequence**, record it as an ADR via REQUIRED SUB-SKILL: use `cmk:adr`. Design-level rewinds usually qualify; Requirements or Vision rewinds only when architecturally weighty. **Task-local and Plan-level never** get an ADR. **Never** persist an ADR for a proposal the user did not approve.
3. **Resume.** Return control to `cmk:delivery-build`'s `references/continuous.md`, which resumes **automatically** against the corrected plan off its own ledger — no manual restart. For a **Task-local** rewind, `.skills/<CODE>/progress.md` is untouched. For a **Plan / Design / Requirements** rewind that rewrote `tasks.md`, **re-baseline the ledger** first: keep the entries whose committed work survives the rewrite, drop the entries the rewrite superseded, so `cmk:delivery-build`'s `references/continuous.md` resumes after the last *still-valid* completed task rather than a stale task number. The ledger is git-ignored scratch, so this touches no spec artifact.

**Done when:** reconciliation has run if artifacts changed, an ADR exists only if warranted and approved, and `cmk:delivery-build`'s `references/continuous.md` is resuming against a ledger that matches the (possibly rewritten) `tasks.md`.

## Red Flags — wrong skill

- **A post-ship, in-scope tweak** to a shipped feature (a recolor, a copy edit, a small follow-on) → that is `cmk:amend`, not cmk:delivery-reroute. Nothing was "approved and then invalidated" here — the feature already shipped.
- **Broken code against a still-valid spec** → that is `cmk:debug`, not cmk:delivery-reroute. The spec is still true; only the implementation is wrong.
- **`cmk:realign` is an exit, not a decision-maker.** It is the mechanical reconciler that runs *after* the rewind decision, realigning `Status` and the trace. cmk:delivery-reroute makes the call about which artifact is false; it does not do cmk:realign's bookkeeping, and cmk:realign does not make the rewind call.
- The pre-flight plan review inside `cmk:delivery-build`'s `references/continuous.md` (its pre-dispatch consistency scan) is pre-execution, not a mid-flight discovery — it is not this skill's trigger.

| Thought | Reality |
|---|---|
| "This discovery smells big, I'll just rewind to requirements to be safe" | Classify the LOWEST invalidated artifact with evidence. Over-rewinding without evidence for the higher level is prohibited — it burns approvals the discovery never earned. |
| "The user already agreed something's wrong, I can skip straight to routing" | The diagnosis go/no-go and the change-proposal approval are two separate stops. Agreeing something is wrong is not the same as approving a specific re-entry. |
| "I'll just fix the plan file directly, it's faster" | cmk:delivery-reroute holds no editing logic. Route to `cmk:delivery-spec-plan`/`cmk:design`/`cmk:requirements` — they own the content and their own gate. |
| "Same bug came up again, let me rewind again" | Read `.skills/<CODE>/corrections.md` first. Same evidence, same level, no new discovery → escalate to the user instead of looping. |
