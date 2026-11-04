# Preserve merge traceability

The branch and the pull request description carry the same primary issue
ID. Use the tracker's suggested branch name, if it generates one; otherwise
the repo's documented branch convention (always carrying the issue ID).
Trusting only automatic linking is not enough — keep the ID in both the
branch and the PR body.

## What the description must cover

Always load and follow `pr-writing` (`skills/pr-writing/SKILL.md`) when authoring or updating a pull request description. Order the body for a skimmer (1. Problem in one paragraph -> 2. What changed -> 3. Real evidence that fits the change -> 4. Details & trade-offs -> 5. 2–3 sentence ELI5), and ensure it covers:

- context and the primary issue reference near the start;
- what was achieved and the main code or documentation entry points;
- consequential design and implementation choices, rationale, related
  design references, and non-obvious gotchas;
- material risks, concerns, gaps, security implications, effects, and
  mitigations, when they exist; and
- reproducible automated testing evidence, including meaningful scenarios,
  commands or CI evidence, and the passing result.

Risk content is optional when there is no material concern. Testing
evidence is mandatory — do not narrate obvious code or provide exhaustive
file lists; give reviewers concise entry points and the information needed
to assess the change, not a puzzle to reconstruct it.

## Target the canonical branch

Every merge-eligible PR targets the canonical integration branch. A stacked
change may temporarily target its blocker's branch as a draft, but the
final destination is always canonical — retarget explicitly once the
blocker merges rather than relying on automatic retargeting or a manual
step someone might forget.

## Move to review, then resolve in one place

Move the issue to its review state when the work is ready to be judged.
Keep PR review on one surface — the code host's PR or the tracker's synced
review thread, if it has one — never both. Before a PR exists, use the
ordinary issue for design, direction, scope, acceptance, dependencies, and
delivery discussion; it remains available afterward for those non-review
topics and for delivery-relevant changes to ownership, estimate, priority,
timing, status, risk, or blockers.

When review discovers work that is separate from the current accepted
outcome, record the finding and the deferral in the review thread, then
create a new issue with a backlink to the exact review thread (or the PR,
with the finding restated, if no exact permalink exists). Work required by
the current acceptance criteria is not a deferrable follow-up: address it
before merge, rescope it onto a tracked successor (`references/acceptance-criteria.md`),
or formally block the current delivery.

Canonical design and navigation docs stay ticket-neutral: never embed an
issue ID, issue URL, or ticket-progress language in that documentation.
Delivery state lives in the tracker, the PR, and reports instead.
