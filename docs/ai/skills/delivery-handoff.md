# cmk:delivery-handoff

## What
Generates a self-contained, copy-paste relay prompt that transfers tracked
work to a different AI agent at a phase boundary of `cmk:delivery-pipeline`
— same worktree, same branch, zero shared session context. The prompt is
the only thing that crosses the boundary.

## Approach
Hard rules: continue in the exact worktree and branch (never a fresh
clone), durable state must already live in artifacts rather than only in
this conversation, the receiver performs a full refresh rather than
trusting a context capsule, sibling skills are referenced by `cmk:<name>`
with a file-path fallback, the receiver re-verifies claims rather than
trusting them, and every merge-eligible PR still targets the canonical
branch. The prompt covers mission, workspace, read-first paths, state of
the work (done-and-verified vs. merely claimed), operating rules, and
handback — including an instruction to generate the next handoff prompt in
turn. Quality bar: a stranger with an empty context could start within two
minutes without guessing a path, decision, or constraint.

## Where
- Skill body: `skills/delivery-handoff/SKILL.md` — sections Hard rules,
  Prompt structure, Quality bar. No `references/` directory.

## Links
Invoked at any phase boundary of `cmk:delivery-pipeline`; reads
`cmk:delivery-workflow`'s `references/vendor-bindings.md` and
`cmk:delivery-pipeline`'s `references/context-efficiency.md` and
`references/stacked-pr-flow.md` to build the prompt.
