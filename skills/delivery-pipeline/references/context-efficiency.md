# Context efficiency and freshness

Optimize context after correctness, quality, and completeness. Saving
tokens is useful only when the same delivery proof remains available.

Escalate a tier when a fix loop survives three rounds: past that point the
implementer cannot see its own problem, and a fourth round on the same
approach burns more context than a stronger worker would. Record the
escalation and its reason. An assurance level may be escalated but never
silently downgraded.

## Authoritative freshness

Fetch mutable facts from their authority instead of relying on memory. Do
a full refresh at session start or resume, after handoff, on missing
provenance, after a partial fetch or a scope/relation conflict, before
consequential transitions, and whenever continuity, a cursor, a fetch, or
the evidence is in doubt.

A full refresh covers tracker-accepted issues with all comments and
properties, the complete relevant transitive relation graph, the current
code-host pull request (refs, reviews, checks) when relevant, and
repository ancestry when lineage matters.

A delta refresh is allowed only inside one uninterrupted session with a
reliable cursor or version, a complete previous fetch, and unchanged scope
— and only while the source can enumerate every change since that
checkpoint. Any gap forces a full refresh.

Elapsed time alone does not prove staleness or require re-fetching
immutable evidence: exact-commit repository evidence and deterministic
results may be reused while every relevant input identity remains
unchanged.

## Context capsules

A context capsule is a cache, never an authority. Record authority and
exact scope, fetch time, cursor/version/commit identity, whether the fetch
completed without gaps, and the paths or artifacts derived from it.

At reuse, prove that continuity and scope still hold, or refresh the
authority. An old summary, chat transcript, run profile, or subagent
return is never evidence that mutable state is current.

## Delegation and returns

Every delegation prompt includes exact task and file/system scope,
authoritative skill and source paths, source identity (or an instruction
to refresh it), stop/escalation conditions, and the required evidence
artifact. Model, effort, and preloaded skills come from the delivery role
definition, not a per-task classification — a delegation prompt does not
compute or restate them.

Point to authoritative material instead of pasting full issues, skills,
documents, or logs. Combine small tasks that need the same context; split
work only when independence, specialization, or parallelism justifies the
transfer cost. Prefer deterministic scripts for repeatable mechanical
facts.

Returns contain conclusions, relevant paths, source identities, commands
and outcomes, and only the failure excerpts needed to act — keep raw
successful logs and full transcripts in their artifacts, not repeated in
messages.

Token guidance limits verbosity and duplication, never investigation
depth, proof, or completion. Spend more context whenever it resolves
uncertainty. Never optimize away tracker reconciliation, dependency
closure, tests, coverage, review lenses, finding disposition, independent
verification, or required evidence.
