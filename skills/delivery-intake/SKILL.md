---
name: cmk:delivery-intake
description: This skill should be used when the user asks to "start work on TICKET-123", "pick up this issue", "get the context for this ticket", or begins any tracked work — and as phase 1 of the cmk:delivery-pipeline skill.
version: 0.1.0
---

# Delivery Intake

Turn a tracker issue ID into everything needed to work safely: the full
written context, a compliant branch/worktree, and an issue that reflects
reality. Skipping intake is how agents hallucinate scope — the leads are
almost always already written down.

Operates inside `cmk:delivery-workflow`; read it first if not already loaded
this session. Refresh state using `cmk:delivery-pipeline`'s context-efficiency
reference before reusing any prior context.

## 1. Pull the issue, then follow every thread

Fetch and read the issue in full: description, acceptance criteria, estimate,
priority, labels, status, assignee. Read every comment — later comments often
amend the description — and every relation (parent, children, blocking,
related), noting what each implies about scope boundaries: a sibling issue
may already own part of what the description mentions. Pull attachments and
linked PRs too, including merged prior art.

At a tracked session start or resume this is a full authoritative refresh,
not reconstruction from an earlier brief. Record scope, fetch time, cursor or
version, completion state, repository HEAD, and other external source
identities in the brief.

Then chase the references outward until they stop adding signal:

- Repo docs the issue cites, plus the obviously relevant `docs/requirements/`
  and `docs/design/` pages, decisions in `docs/decisions/`, and `docs/guides/`
  entries. Use `docs/ai/README.md` to locate subsystems.
- The code areas the issue touches — enough to know current shape and the
  patterns already established there.
- Sibling/predecessor issues whose outcomes this work builds on.

## 2. Enforce the clarity floor

Check the issue gives enough outcome, context, constraints, acceptance,
ownership, estimate, dependencies, and timing to act without reconstructing
an unrecorded conversation. Where it falls short, improve the issue itself —
write the missing context into the description or a comment. Do not force a
template; add only useful content.

An effort estimate is part of that floor, not an optional nicety — an
unestimated backlog can't be planned or sequenced. Estimate leaves only —
parents roll up from children, and estimating both double-counts. A
too-large estimate is a signal to split before starting, not a size to carry
into work. Fixing the issue instead of just knowing the answer is the point:
the next session (or teammate) starts from the issue, not from your memory.

The acceptance criteria get the same treatment, and they set up the rest of
the run: they must be a checklist whose items are individually provable,
because a criterion nobody can demonstrate is a criterion nobody can check
off. Rewrite vague or untestable ones into observable behavior, add the
criterion an obvious part of the outcome is missing, and tick anything
already proven by prior work with a pointer to that proof. See
`cmk:delivery-workflow`'s `references/acceptance-criteria.md` for how they
are maintained and rescoped from here on.

If reading reveals the issue's scope is stale (already partly delivered,
superseded, or split), update it and its relations now, before building on a
wrong picture.

## 3. Branch and worktree

- Use the tracker's suggested branch name, if it generates one; otherwise the
  repo's documented branch convention (always carrying the issue ID) — add a
  repository-required username prefix if applicable.
- Isolated worktree per issue, created through the selected runtime's native
  mechanism or documented fallback. Never use an ad-hoc path.
- Base it on the exact revision the work should diverge from: the canonical
  integration branch for independent work. Base a dependent task on the
  blocker's pinned, verified handoff commit, not a floating branch tip. A
  stacked PR may still target the blocker's branch so the code host can show
  the dependency, but create the dependent branch from the recorded handoff
  SHA and verify that pin before execution. Record both the pinned SHA and
  the PR base; every PR ultimately merges into the canonical branch.
- Run the repo's local-stack init and coherence scripts before any local dev
  (see `cmk:local-stack`). Never source another worktree's environment or
  bypass the coherence check.

## 4. Move to the in-progress state and write the context brief

Move the issue to its in-progress state when active work begins. Then
distill what you learned into a context brief in local scratch — git-ignored,
never committed:

```
# TICKET-123 context brief
Outcome: <the accepted outcome, in one paragraph>
Acceptance criteria: <the current checklist, each item marked met / unmet, met ones naming their proof>
Constraints & invariants: <from docs, the issue, or code — incl. any invariant classes touched>
Prior art & patterns: <files/subsystems to model after>
Scope boundaries: <what neighboring issues own; what is explicitly out>
Dependencies: <blockers, and what their branches/PRs provide>
Source checkpoints: <authority, scope, fetch time, cursor/version/commit, complete-without-gaps>
Open questions I will decide myself: <list — each gets a recorded rationale later>
```

The brief is the handoff to the spec phase (and to any subagent) — it must
stand alone without this session's context.

Before leaving intake, run the tracker reconciliation checkpoint: every stale
fact, missing relation, planning property, scope boundary, and downstream
handoff discovered during intake is already corrected on its owning issue.
The context brief may summarize the tracker; it may not be the only place a
valuable fact exists.

Using Linear as your tracker? Read `references/linear.md`.
