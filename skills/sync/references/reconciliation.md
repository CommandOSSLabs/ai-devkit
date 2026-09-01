# Reconciliation

## The three-way frame

- **Base** — the pristine upstream copy at the lock's recorded SHA
  (`upstream_sha`). Fetch it fresh; never assume the local disk still has it.
- **Theirs** — the current upstream copy of the same skill, whatever ref
  upstream is on now.
- **Ours** — the repo's evolved copy: whatever local adaptation has
  accumulated on top of base.

## Semantic merge doctrine

Apply the *meaning* of the upstream delta (base→theirs) to ours. Rewording,
restructuring, and renumbering on either side are not conflicts — a
line-level differ would flag them, a semantic reconcile should not. A
genuine conflict is when an upstream change and a local adaptation disagree
about behavior, contract, or guidance: upstream tightens a rule the local
copy deliberately relaxed, or upstream removes a step the local copy still
depends on.

Genuine conflicts are presented to a human with both sides quoted and the
base for context. Sync never picks a winner — the reconcile stops short of
resolving a real disagreement and leaves the decision to the human reading
the report.

## The `## Project adaptations` seam

Separable project-specific amendments go under a marked
`## Project adaptations` section at the end of the file they amend. This
gives reconciliation stable seams: upstream deltas rarely touch that
section, so the semantic merge has a clean place to land, and local intent
stays legible to the next reader without archaeology through history.

Interleaved adaptations — local changes woven into the body of a skill
rather than isolated at the end — are legal, but they cost more at every
sync, since the reconcile has to separate local intent from upstream
material line by line instead of by section. The reconcile should offer, not
force, migrating interleaved adaptations to the marked section.

## Upstream-contribution candidates

A local amendment that contains no project vocabulary and would improve the
generic skill is flagged with its file, section, and a one-line rationale.
Flagging is sync's job; actually preparing and contributing it back upstream
is *contribute* mode's job, never a side effect of running sync.

Before contribute prepares that PR, name `/write-cmk-skill` for the user to
run on the candidate set — the kit's authoring Iron Law and ship checklist
live there. Do not invoke `cmk:write-cmk-skill` from sync (user-invoked).
Pure `## Project adaptations` stay local and skip that gate.

## Failure honesty

A skill whose reconcile did not complete keeps its old lock entry. The
report lists it as unreconciled, not silently skipped. Never update a lock
entry to a state that was not actually applied — a stale-but-honest entry is
always preferable to one that claims a reconcile that didn't happen.
