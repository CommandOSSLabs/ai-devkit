---
name: cmk:delivery-handoff
description: This skill should be used when the user asks for "a handoff prompt", "a prompt for codex/grok/claude", "something I can paste into another agent", or wants to continue tracked work in a different tool — and at any phase boundary of the cmk:delivery-pipeline skill when the operator prefers a different agent for the next phase.
version: 0.2.0
---

# Delivery Handoff

The operator runs a multi-agent relay: different agents have different
strengths (one may plan better, another execute faster, another review
more sharply), so phases of one delivery are deliberately split across
agents. The handoff prompt is the **only** thing that crosses the
boundary — the receiving agent has none of this session's context, may be
a different product entirely, and may not have this kit's skill-invocation
mechanism. Everything it needs must be in the prompt or in files the
prompt points to.

Before acting, read your runtime's binding for mechanics only:
`.agents/bindings/<vendor>.md` (see `cmk:delivery-workflow`'s
`references/vendor-bindings.md`). A binding supplies mechanics; it never
changes phase order, gates, evidence, or acceptance.

## Hard rules

- **Same worktree, same branch.** The relay continues in the exact
  worktree and branch this session used — never a fresh clone, worktree,
  or branch. State both as absolute facts and tell the receiver to verify
  before touching anything (`git -C <worktree> status` and
  `git -C <worktree> branch --show-current`), and to stop and report if
  they don't match. In cluster mode each issue keeps its own existing
  worktree; the receiver navigates between them and must never re-create,
  re-base, or wipe one.
- **Files over memory.** Durable state must already live in artifacts
  (context brief, spec, plan, review record — per the phase skills)
  before handing off. If something important exists only in this
  conversation, write it to the scratch artifacts first; a handoff prompt
  that narrates unrecorded state is a bug. Reconcile every valuable
  delivery fact on its owning tracker issue too; scratch files preserve
  execution continuity but are not the authoritative delivery ledger.
- **Resume with a full refresh.** A handoff breaks continuity. The
  receiver follows `cmk:delivery-pipeline`'s
  `references/context-efficiency.md`, refreshes mutable authorities in
  full, and records new source checkpoints before relying on a prior
  context capsule.
- **Skills by name, with a path fallback.** Reference other phase skills
  by their `cmk:<name>` — the receiving runtime's own skill mechanism, if
  any, resolves that name. When the receiver has none, point it at that
  skill's file in this repo instead of narrating its content inline.
- **Trust, but re-verify.** The receiver re-runs the relevant gates before
  building on prior work — claims in a handoff are claims, and the
  previous agent may have erred. Include the exact commands.
- **Canonical merge target.** The prompt restates the canonical-branch PR
  flow: every merge-eligible PR targets the canonical integration branch.
  A feature-base stacked pull request stays draft until the code host
  retargets it to a canonical base and repository automation, where a
  repo runs it, replays only the child's commits and verifies exact
  parent lineage — see `cmk:delivery-pipeline`'s
  `references/stacked-pr-flow.md`. Neither the sending nor the receiving
  agent performs that transition by hand.

## Prompt structure

Produce the prompt in one fenced block, ready to paste. Cover (adapt
freely; completeness matters, sections don't):

1. **Mission** — issue ID(s) and title, which phases are done, exactly
   which phase(s) the receiver performs next, and the exit gate for it
   (from the phase skill).
2. **Workspace** — absolute worktree path, branch, base branch (= future
   PR base), the verify-before-touching commands, and the same-worktree
   rule. For clusters: the issue → worktree/branch/base table plus where
   the orchestration plan lives and which wave is active. For a handoff
   mid-way through a phase-3 wave, additionally enumerate every live task
   worktree — path, task branch, wave-base SHA, and join state (pending /
   integrated / escalated), from the wave manifest in the ledger — and
   state that task worktrees follow the wave protocol's retention rules,
   never ad-hoc cleanup.
3. **Read first** — ordered absolute paths: the phase skill(s) to follow,
   the tracking contract (`cmk:delivery-workflow`), the context-efficiency
   reference, the receiver's runtime binding
   (`.agents/bindings/<vendor>.md`), the run notes, this issue's context
   brief/spec/plan/review record, and the repo's `CLAUDE.md` (symlinked as
   `AGENTS.md`). State what each is.
4. **State of the work** — what is done and *verified* (gates, evidence
   location) vs. merely claimed; decisions already made with their
   recorded rationale locations (the receiver must not silently relitigate
   them — reopening one requires updating its record); open items in
   play.
5. **Operating rules** — autonomous (no questions to the operator), the
   continuous-ledger principle (reconcile every material fact and state
   change, not only decisions and deferrals), and any run-mode constraints
   in force (e.g. dry-run rules).
6. **Handback** — what artifacts the receiver updates on completion, and
   an instruction to end by generating the next handoff prompt in this
   same format (so the relay continues regardless of which agent holds
   the baton).

## Quality bar

Read the finished prompt as a stranger with an empty context: could you
start working within two minutes, without guessing a single path,
decision, or constraint? If any sentence needs this conversation to be
intelligible, inline the missing fact or point to the file that holds it.
Lean is good — pointers beat pasted file bodies for anything already on
disk — but never at the cost of the receiver reconstructing an unrecorded
conversation.

Before emitting it, reconcile every valuable delivery fact on its owning
tracker issue: run the tracker reconciliation checkpoint before generating
the prompt. A handoff may point to current tracker truth; it may not
carry an update the tracker still lacks.
