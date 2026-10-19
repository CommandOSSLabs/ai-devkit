# Canonical-branch and stacked-PR flow

Every merge-eligible PR targets a canonical integration branch. A stacked
issue's dependent may open its PR early against the blocker's branch for a
clean diff, but it stays a draft and cannot merge there — the final
destination is always canonical.

## The manual flow (baseline)

This is the default in every repository, with no automation required:

1. Branch the dependent issue's work from the blocker's branch (or its
   pinned handoff commit, per `references/cluster-mode.md`).
2. Open the dependent's PR as a draft against the blocker's branch, so the
   code host shows the dependency and the diff stays reviewable.
3. When the blocker's PR merges into the canonical branch, retarget the
   dependent's PR to canonical.
4. Rebase the dependent's own commits onto the new canonical base,
   replaying only this branch's commits — never the blocker's, which are
   already on canonical.
5. Force-push the rebased branch and confirm the PR's diff now shows only
   this issue's changes against canonical.

Agents and humans performing this flow do it explicitly and by hand; nothing
here assumes a repository automation layer exists.

## Optional repo automation (disabled by default)

A repository may additionally enable trusted stacked-PR reconciliation
automation that performs steps 3–5 above itself once the blocker's PR
merges. Where present, prefer it over improvising a manual retarget,
rebase, or force-push on a stacked PR — but its absence is normal, and the
manual flow above is always correct.

When enabled, the automation:

- **Records exact parent identity before retargeting.** Before the
  blocker's PR merges, it captures the exact parent PR identity and parent
  head SHA the dependent was based on, and marks the dependent PR with a
  `cmk/stacked-base` label it owns.
- **Derives its result from the commit graph, never a merge-mode name.**
  After the code host deletes the merged blocker branch and retargets the
  dependent, it refreshes the PR and classifies the outcome from the exact
  commit graph and immutable base-change evidence:
  - **ancestry-preserved** — the exact final parent head already exists in
    the canonical lineage; no rewrite occurs.
  - **replay-verified** — a replay proved one-to-one ordered preservation
    of every dependent-only commit plus an independent aggregate-tree
    equivalence check, publishing the proved candidate and a deterministic
    backup ref atomically under exact-SHA leases, then verifying the
    canonical, dependent, and backup identities from the remote.
  - **repair-required** — everything else: a conflict, an
    empty/skipped/changed or merge commit, stale lineage, a concurrent
    update, ambiguous proof, or a publication mismatch.
- **Never resolves a repair-required case automatically.** The dependent
  stays draft, retains `cmk/stacked-base`, receives an idempotent
  repair-required label and a structured comment, and waits for an
  explicit human disposition. CMK then records that disposition and
  reconciles affected tracker truth under `cmk:delivery-workflow` — the
  human decides, CMK does the bookkeeping. A successful repaired rerun
  resolves the repair record before stack cleanup and readiness.
- **Never auto-resolves ordinary merge conflicts either** — enabling clean
  reconciliation never enables autonomous conflict resolution of any kind.
- **Serializes same-PR runs** and refreshes current PR state so an
  automation-generated event cannot replay stale state. Agents and humans
  do not manually retarget, rebase, force-push, or reopen a PR the
  automation owns while it is active. Canonical branch protection, CI, and
  review remain the ship-ready gate regardless.

Git itself cannot lease an unchanged canonical ref in the same push: if
canonical moves after the last preflight read but across the atomic
dependent/backup publication window, the acknowledged rewrite and exact
backup remain, and post-publication read-back enters repair-required and
blocks cleanup and readiness. Preventing the race itself — not merely
detecting it — requires separately configured server-side coordination
covering every canonical writer; ordinary client-side Git cannot provide
that guarantee on its own.

Enabling or disabling this automation is a repository-level, documented
opt-in/opt-out; its presence or absence never changes the manual flow's
correctness, only who performs steps 3–5.
