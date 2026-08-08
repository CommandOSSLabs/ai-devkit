# Engines

Depth is a decision this skill owns; the engine that carries out a chosen
depth is a runtime choice. Consult the repo's runtime binding
(`cmk:delivery-workflow`'s vendor-bindings reference) for what native
review tooling is installed, and `cmk:delivery-pipeline`'s run notes when
running inside the pipeline — probe rather than assume, and note that
standalone mode has no run notes to read.

## Quick and targeted pre-ship: reuse the whole-branch review

When phase 3 ran under `superpowers:subagent-driven-development`, its final
whole-branch review is already scoped to the branch and already reads the
ledger's deferred-minor and parked lines to triage them. Use it rather than
standing up a second reviewer beside it — add this skill's contract on
top: the issue and its acceptance criteria, adversarial verification, and
disposition authority. A reviewer without the issue's contract catches
typos, not defects.

## Full: the seven-lens fan-out

Run the lenses concurrently and corroborate. Where the runtime offers a
deterministic fan-out mechanism, prefer it: a script that dispatches one
agent per lens with a schema-validated return turns "a result without
evidence is rejected and re-run" from a rule someone has to enforce into a
contract the tool layer enforces — a reviewer physically cannot return
"looks fine" in place of findings with `file:line` traces. Otherwise fan
out `cmk-delivery-reviewer` subagents per lens, or run every lens inline
when subagents are unavailable.

Every lens's findings then pass through a verification stage — the
`cmk-delivery-verifier` role, or the runtime's adversarial mechanism —
before disposition; the fan-out produces claims, not a verdict.

## Mixed executors, deliberately

Draw the pool from dissimilar reviewers — the runtime's native review and
security-review commands, `superpowers:requesting-code-review` when
present, and `cmk-delivery-reviewer` workers for the lenses that need
repository context. Corroboration is only worth its cost when reviewers
have different blind spots: several runs of one reviewer agree with each
other cheaply and prove little, while tools built on different assumptions
fail in different places. A lens is covered when some executor covered it,
not when every executor ran.

A dedicated security capability, if the runtime has one, may supplement
the security lens rather than replace it.
