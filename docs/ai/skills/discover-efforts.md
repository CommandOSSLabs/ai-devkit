# cmk:discover-efforts

## What
Opt-in audit skill that reconciles an uncertain body of work — prompts,
requirements, designs, ADRs, code, or any mix — against the tracker and
repository reality into the smallest complete issue graph, before the
accepted issue set is known and before ordinary delivery begins.

## Approach
Builds a reconciliation ledger with one row per independently classifiable
source outcome, each given exactly one classification: `tracked-current`,
`tracked-stale-or-partial`, `delivered-unreconciled`, `documented-untracked`,
`new-territory`, `duplicate`, or `no-action`. Stops at the reconciled issue
graph — never creates or switches branches or worktrees, edits code, or
touches a PR; that authorization belongs to the skill it hands off to.
Ordinary tracked delivery never runs this automatically; it only mutates the
tracker when a user explicitly opts in. Fails closed on missing access or
ambiguous ownership, and reruns converge on the same graph without
duplicate issues.

## Where
- Skill body: `skills/discover-efforts/SKILL.md` — sections Operate inside
  the tracking contract, This is opt-in, Stop at discovery, Classify every
  source outcome, Fail closed make reruns idempotent, Exit and hand off.
- `references/ledger-and-topology.md` — the ledger's required fields,
  per-classification actions, and how to choose between an atomic issue, an
  integrating parent, and disjoint top-level issues.
- `references/linear.md` — the skill body's conditional tracker-binding
  pointer resolves here: source-search mechanics, native duplicate
  disposition, and relation vocabulary.

## Links
Runs inside `cmk:delivery-workflow`'s reconciliation loop and readiness
vocabulary. Hands a single accepted issue to `cmk:delivery-intake`, or the
reconciled issue graph to `cmk:delivery-pipeline` for end-to-end delivery.
