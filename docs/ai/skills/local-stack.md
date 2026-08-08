# cmk:local-stack

## What
Skill that sets up or improves a worktree-isolated local stack: multiple git
worktrees of the same repo running local service topologies simultaneously,
on the same machine, without port collisions, stale config, or cross-worktree
contamination. Serves human developers, headless AI agents, and CI. Supersedes
the prior single-script-list version of this facet, reorganized around two
composable axes instead of a fixed eight-component script list.

## Approach
Two axes, described in the skill body itself: between-worktrees identity
derivation plus a fail-loud coherence guard, and within-a-worktree the
`(worktree, config, instance)` primitive (config = topology owned by a
consuming package; instance = one named, state-isolated materialization with
broker-assigned ports). A repo may own several peer stacks side by side — no
single blessed "the local stack." Two runner modes cover both audiences:
interactive (mprocs-style, for humans) and headless persistent
(`start|status|logs [service]|stop`, for agents/CI). The `.local/` directory
is the shared, git-ignored root for all ephemeral state across every stack
and every agent vendor. Ends with a `## Verify` section for report-only
checks a caller can run against a target repo.

## Where
- Skill body: `skills/local-stack/SKILL.md` — sections `Model` (Axis 1
  identity/coherence, Axis 2 the config/instance primitive), `Peers, not a
  singleton`, `Service classes and runners`, `` `.local/` convention ``,
  `Global-state prohibition`, `Test-infrastructure composition`,
  `Where this stops`, `Verify`.
- `references/identity-and-coherence.md` — derivation recipe, what identity
  feeds, coherence-guard checks, init-script shape, a generic shell sketch.
- `references/instance-primitive.md` — config vs. instance, state/home
  layout, port-broker responsibilities, join-vs-select-distinct, lifecycle.
- `references/runners.md` — interactive and headless runner contracts, mode
  selection, log hygiene.
- Eval scenarios: `skills/local-stack/eval.json`.
