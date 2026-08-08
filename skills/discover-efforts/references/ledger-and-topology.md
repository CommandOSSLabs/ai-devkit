# Ledger and topology

The full method for building a reconciliation ledger and choosing how the
reconciled outcomes land on the tracker.

## Capture enough to classify, without prematurely designing

For every candidate source outcome, capture:

- source kind, title, path or URL, and the relevant section;
- an immutable commit, revision, version, or external cursor when
  available;
- fetch time and whether the source was read completely, without gaps;
  and
- repository HEAD and code locations when implementation evidence
  matters.

Extract the source's concepts, promised outcomes, domain terms, aliases,
and observable acceptance signals. Search the tracker across those terms
and their synonyms, then search by outcome rather than relying on title
matches alone — search for every issue that may own all or part of the
outcome before creating or decomposing anything.

Inspect every plausible overlap completely: description, all comments,
properties, parent, children, blockers, blocked issues, related issues,
attachments, linked changes, and relevant transitive relations. Include
open work plus done, canceled, duplicate, and relevant archived work.
Follow references until they stop changing an ownership or coverage
conclusion.

Inspect repository code, tests, docs, history, and deployed or merged
evidence when they can prove an obligation is already delivered or that
an issue's record is stale. Record exact paths and revisions; never infer
delivery from status or a merge alone.

## The reconciliation ledger

Create one row per independently classifiable source outcome and keep it
current as evidence changes.

| Required field | Record |
|---|---|
| Source identity | Exact source, section, revision or cursor, fetch time, completeness |
| Outcome | One observable, independently finishable result |
| Code evidence | Paths, commits, tests, deployments, or explicit absence |
| Matching issues and coverage | Exact issue IDs plus the portion each owns |
| Classification | One classification from the enum in `SKILL.md` |
| Action | Reuse, update, narrow, split, reparent, create, relate, complete, reopen, close, or no action |
| Read-back proof | Exact issue IDs and confirmed fields, status, and relations after writes |

## Reconcile each classification's action

- **`tracked-stale-or-partial`** — update the existing owner in place when
  ownership doesn't move, preserving still-valid scope and history. When
  ownership must move, follow the fail-safe scope sequence below; never
  narrow first.
- **`delivered-unreconciled`** — add exact evidence, correct acceptance
  and relations, and set the status the tracking contract justifies.
  Verify acceptance before the done state.
- **`documented-untracked`** — determine the earliest unresolved concrete
  action before creating an issue from the authoritative source. Give it
  the outcome, context, constraints, acceptance, non-goals, source
  identity, ownership, priority, timing, and relations needed to act.
  Estimate a leaf; leave an integrating parent unestimated. Name the
  actual action in the title — Define, Decide, Design, Implement, Verify,
  Document, Migrate, Roll out, or Operate — never a generic intake label.
- **`new-territory`** — determine the concrete action that closes the
  current uncertainty, then create or reuse that owner before deep work
  (for example, `Define ... requirements`, `Decide ...`, or `Design ...`).
  Put the question, user intent, known constraints, decision boundary,
  and action acceptance on that issue; read it back before deeper
  research, requirements, or design work, and record conclusions on the
  owning issues as soon as they become material. Never defer genuinely
  new work into an unmodeled final catch-all issue — resolve enough
  uncertainty to identify the real outcomes, then reconcile those
  outcomes before completing this action's acceptance.
- **`duplicate`** — preserve useful source evidence on the surviving
  owner, then use the tracker's native duplicate disposition, if it has
  one, else a documented convention (for example, closed with a comment
  linking the survivor). Never maintain two active owners.
- **`no-action`** — state the evidence that makes inaction correct; never
  use it as a substitute for an uncertain search.

Every acknowledged effort must have a read-back-proven owner for its next
unresolved concrete action. Deadlines change sequencing, priority, and
status; they never redefine completeness. Continue until every source
outcome has a classification, action, and read-back proof, or report the
run as incomplete with an explicit blocker.

## Choose the issue topology

Establish the required requirements, decision, and design acceptance
before declaring a later concrete action, integrating parent, or disjoint
top-level issue set ready for delivery. Record the chosen direction,
considered alternatives and why they lost, material risks and
mitigations, acceptance, and every required product or architecture
decision on the owning issues, then read them back. If alternatives
materially change product scope or architecture, pause for an explicit
human decision; record the options and trade-offs, and do not finalize
topology or hand off until the accepted decision is written and read
back.

Use one of these owning-issue topologies:

1. **Atomic concrete-action issue.** One estimated issue when a bounded
   action is coherent, independently finishable, and ready for ordinary
   delivery.
2. **Integrating parent.** One unestimated parent when multiple
   estimated, independently finishable leaves jointly deliver one
   meaningful outcome. Give the parent integration acceptance and keep
   implementation acceptance on the owning leaves.
3. **Completed requirements, decision, or design issue with disjoint
   top-level issues.** Complete the current owner only after its action
   acceptance is recorded and every disjoint outcome has its own
   estimated top-level issue with correct relations.

Use the tracker's native relation types — parent/child, blocking,
related, duplicate — or a documented convention where the tracker lacks
one. Put parent-to-parent ordering at the outcome level and child-to-child
ordering at the exact handoff level; don't add mixed-level edges merely
to repeat hierarchy, and verify reciprocity and the absence of cycles.

### Move scope explicitly and fail-safely

1. Capture the old owner's current contract.
2. Create or update every replacement leaf or sibling and its native
   relations.
3. Read back every replacement owner and relation; prove they retain all
   moved scope.
4. Only then narrow the old owner and read it back.

If any write or read-back fails before narrowing, leave the old owner
intact and enter the reconciliation-required stop condition. If narrowing
or its read-back fails, restore the captured contract and read it back
before any other action; until restoration is proved, remain in that stop
condition and report potentially ambiguous ownership. Never make work
disappear from the graph during a split or reparenting.

## Put reconciliation output on the right surface

Put the current durable outcome, context, constraints, acceptance,
non-goals, and source references in the issue description. Put
chronological discoveries, decision rationale, reconciliation notes, and
evidence updates in comments when they shouldn't rewrite the current
contract. Put containment, blockers, related work, and duplicates in
native relations — never encode a required relation only in prose.

Search for and update the existing owning issue before creating another
one. Avoid duplicate comments on reruns; update stale current-state
fields and add a comment only when it preserves new history or
rationale.

Ordinary quality and PR review are gates inside the owning issue and its
synced review thread, not a discovery phase. Create a separate review or
audit issue only when that review is itself an independently deliverable
outcome.
