# Cluster mode

Two entry shapes, one behavior. The point of modeling dependencies in the
tracker is that both the *membership* and the *execution order* of a body
of work can be read off the graph instead of guessed:

- **Explicit list** — the named issues are the accepted seed set.
- **Single seed issue** — the named issue is the seed; include its
  independently deliverable children when they jointly own its outcome.

Compute the transitive closure of the accepted dependency graph. Walk the
blocking relation recursively to include every unfinished prerequisite.
Walk the blocked-by-this relation recursively only while the downstream
issue belongs to the same accepted outcome or is in the seed set.
Parent/child edges determine grouping, never execution order; a related
edge is only a pointer. State every included issue and every adjacent
issue deliberately excluded, with the relation and outcome boundary that
decided it, at the top of the plan and in the completion report.

Then:

1. **Repair shared truth before scheduling.** Validate reciprocity, cycles,
   status, and stale or missing edges. If analysis discovers a real
   dependency, update the tracker immediately; the orchestration plan may
   add a local serialization edge for file contention that is not itself a
   delivery dependency.
2. **Two distinct readiness gates**, matching `cmk:delivery-workflow`'s
   readiness vocabulary:
   - **Execution-ready**: every blocker has a pinned, verified handoff
     commit — implementation, tests and coverage, applicable review depth,
     and finding disposition all complete. It does not require the final
     cumulative review, human PR review, or merge. A done blocker also
     satisfies it.
   - **Ship-ready**: the completed issue/branch has its final cumulative
     review at its recorded depth, plus PR evidence and passing merge
     gates — concretely, the PR targets a canonical branch and satisfies
     the code host's checks and configured human review. Never an
     execution prerequisite for downstream work.
3. **Recompute the readiness frontier continuously.** The frontier holds
   each unfinished issue whose blockers are done or execution-ready.
   Partition it into parallel tracks; serialize true chains. A join starts
   only when every feeder is execution-ready, bases on the pinned feeder
   commit with the largest code overlap, integrates the other pinned
   commits, passes its own combined gates, and publishes its own pinned
   handoff commit. After every completion, blocker, relation repair, scope
   discovery, verification failure, or pin publication or supersession,
   reload the tracker and reschedule. Diamonds, fan-in, and re-splits are
   normal.
4. **One worktree and branch per issue**, via the runtime's native
   worktree mechanism — never an ad-hoc path — always on the tracker's
   suggested branch name (or the repo's documented convention) with its
   issue ID preserved. Independent issues branch from the canonical
   integration branch; dependent issues branch from the blocker's pinned
   handoff commit. Run the repo's local-stack init and coherence scripts
   in each worktree before any local dev (see `cmk:local-stack`); never
   source another worktree's environment or bypass its coherence check.
5. **Orchestrate, don't implement.** Own the graph, the tracks, the
   per-issue state, dispatching and verifying workers, cluster assurance,
   and the final report. Do not edit code in any issue's worktree
   yourself. Keep per-issue state in scratch artifacts, not in your head.
6. **A handoff pin is immutable evidence, not a floating branch.**
   Publishing a replacement pin supersedes the old one and immediately
   revokes execution-ready status for dependents whose evidence used it.
   Recompute the frontier, integrate the replacement, and rerun the
   affected combined tests, coverage, review, disposition, and
   verification before publishing replacement downstream pins. This
   applies when human review changes an upstream branch after dependent
   execution has begun.
7. **Cluster assurance.** A join triggers a targeted review over the
   combined diff: interface consistency, duplicated logic, naming and docs
   alignment, integration behavior. Run the full review over every
   completed issue and over the final combined output. Findings route to
   the owning issue's disposition flow; the cluster review holds no
   separate disposition authority.

If an issue fails or blocks, don't stall the run: finish everything not
downstream of it, record the blocker on that issue, and report it.

Branch and PR mechanics: `references/stacked-pr-flow.md`.

Using Linear as your tracker? Read `references/linear.md`.
