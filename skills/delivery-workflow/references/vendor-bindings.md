# Vendor bindings

This binding supplies mechanics only. The active CMK skill owns phase
order, artifacts, evidence, review lenses, and acceptance.

A consuming repository provides one binding file per agent runtime it
uses, at `.agents/bindings/<vendor>.md` (for example
`.agents/bindings/claude.md`, `.agents/bindings/codex.md`,
`.agents/bindings/grok.md`). The plugin-trial installation of this kit
ships none — every runtime falls back to the native mechanics described
inline in each skill when no binding exists. Missing native mechanics do
not change the phase contract.

A binding never restates skill content: it maps a fixed set of
responsibilities onto this runtime's actual tools, and nothing else. Fill
in each section below per vendor.

## Invoke a skill

How this runtime loads and runs a named CMK skill — a native
skill-invocation mechanism, a thin adapter over an authoritative file, or a
direct file read.

## Spawn subagents

How to launch a subagent preloaded with one of the kit's roles —
`cmk-delivery-scout`, `cmk-delivery-implementer`, `cmk-delivery-reviewer`,
`cmk-delivery-verifier` — each with its own disjoint file scope and no
dependence on the orchestrator's loaded context. Record the runtime's
actual dispatch mechanism (a dedicated agent tool, a role-preloaded prompt,
a manual sub-session) and any constraint on nesting further subagents.

## Enter a worktree

How to enter an isolated worktree for delegated or stacked work, and the
repository fallback — the repo's local-stack init and coherence scripts
(see `cmk:local-stack`) — when native isolation is unavailable.

## Tool mappings

How repository reads, edits, and pattern search map onto this runtime's
native tools, and which native review commands, if any, are available to
the review skill.

## Model and effort routing

How model and reasoning effort are resolved for a spawned subagent —
declared per role, an explicit per-dispatch override, or inherited from the
parent — and any override this runtime allows, for example escalation
after repeated fix-loop failures, or a deliberate cheap-tier downgrade for
transcription-grade work.

## Return evidence

What a subagent returns to its caller: a concise result, files changed or
inspected, commands run with outcomes, authoritative source identities, and
any required scratch-evidence path. Raw successful output stays out of the
return message; relevant failure excerpts remain.

## Fallbacks

What happens when native skill invocation, role preload, subagents, or
worktree isolation is unavailable: read the authoritative skill files
directly and perform the workflow inline. Missing native mechanics do not
change the phase contract.

## Runtime probes

A binding may record dated, runtime-specific observations — for example,
which tool surfaces reach a spawned subagent — as a dated note, not a
permanent guarantee. Re-probe before relying on an old observation again
rather than inheriting it across a runtime upgrade.
