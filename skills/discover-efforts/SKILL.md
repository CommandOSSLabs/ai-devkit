---
name: cmk:discover-efforts
description: This skill should be used when the user asks to "discover the delivery efforts here", "audit this body of work before we file issues", "reconcile these prompts, requirements, designs, or code against the tracker", "figure out what issues we actually need before starting", or hands over an uncertain body of work that needs a reconciled tracker issue set before delivery begins.
version: 0.1.0
---

# Discover Efforts

Reconcile source obligations — prompts, requirements, designs, ADRs, code,
or any uncertain body of work — with tracker and repository reality into
the smallest complete issue graph. Treat the tracker as the continuous
delivery ledger, not as a destination for a one-time backlog dump.

## Operate inside the tracking contract

This skill runs inside `cmk:delivery-workflow` and uses its reconciliation
loop, readiness vocabulary, and write/read-back contract. Refresh state
using `cmk:delivery-pipeline`'s context-efficiency reference: a full
refresh at session start and every phase boundary, a delta refresh after
each discovered change, and provenance on every fact you rely on.

## This is opt-in

Ordinary tracked delivery does not run an effort-discovery audit
automatically. Discovery mutates the tracker only when the user has opted
into this skill — by invoking it directly or explicitly asking to
reconcile an uncertain corpus or issue set. Keep recording ordinary
in-flight discoveries under the tracking contract regardless.

## Stop at discovery

Inspect sources and reconcile the tracker only. Never create or switch
branches or worktrees, produce an implementation plan, edit code, commit,
push, or create or update a pull request. Terminate at the reconciled
issue graph and an exact-ID handoff; success here never authorizes
implementation, and the receiving skill runs its own gates. Treat any PR
review-thread or PR-specific record as a downstream handoff to ordinary
delivery or review, never an effort-discovery action.

## Classify every source outcome

Build a reconciliation ledger — one row per independently classifiable
source outcome — and give each row exactly one classification. Building
or updating the ledger? Read `references/ledger-and-topology.md` for the
full method: what to capture before you classify, the ledger's required
fields, per-classification actions, and how to choose between an atomic
issue, an integrating parent, and disjoint top-level issues.

- `tracked-current` — current scope and relations fully own the outcome.
- `tracked-stale-or-partial` — an issue owns it, but scope, acceptance,
  planning fields, state, or relations are stale or incomplete.
- `delivered-unreconciled` — authoritative implementation evidence proves
  delivery the tracker does not accurately record.
- `documented-untracked` — an authoritative source establishes the
  outcome, but no issue owns it.
- `new-territory` — the outcome isn't established by the inspected corpus
  or issue graph and needs a concrete requirements, decision, or design
  action first.
- `duplicate` — another issue already owns the same independently
  finishable outcome.
- `no-action` — evidence proves no delivery or tracking change is
  warranted; never use this as a substitute for an uncertain search.

## Fail closed, make reruns idempotent

Missing tracker access or a failed read-back is a stop condition, same as
the tracking contract's: it blocks branch mutation, readiness, handoff,
and completion. If a fetch is partial, provenance is missing, authorities
conflict, or ownership stays ambiguous, record the unresolved row and the
evidence needed to resolve it — never guess a final classification.

Read back the affected issue and relations after every write. If a
multi-write action fails partway, list confirmed and unconfirmed writes by
exact issue ID, fully refresh the tracker, and resume from observed state.
Never claim a write that read-back hasn't confirmed.

On rerun, identify prior work by source identity, outcome, and existing
issue relations; reuse what already exists, repair stale fields, and
create only outcomes that still lack an owner. A successful rerun
converges on the same graph without duplicate issues, comments, or
relations.

## Exit and hand off

Before exit, reconcile every affected issue and relation, then read back
exact IDs, descriptions or changed fields, statuses, estimates, parents,
children, blockers, related issues, and duplicate dispositions.

Return an exit report with: source identities and completeness; each
ledger row's outcome, classification, matching coverage, and action; every
created, reused, updated, narrowed, split, reparented, completed,
reopened, and unchanged issue ID; final topology, estimates, statuses, and
relations; read-back proof and any unresolved blocker; and the exact
accepted issue IDs ready for ordinary delivery.

Hand a single accepted issue to `cmk:delivery-intake`, or the reconciled
issue graph to `cmk:delivery-pipeline` for end-to-end delivery. Never hand
off while a reconciliation blocker remains unresolved.

Using Linear as your tracker? Read `references/linear.md` for source-search
mechanics, native duplicate disposition, and relation vocabulary.
