# Identity and coherence

## Contents

- [Derivation recipe](#derivation-recipe)
- [What the identity feeds](#what-the-identity-feeds)
- [Coherence-guard checks](#coherence-guard-checks)
- [Init-script shape](#init-script-shape)
- [Generic shell sketch](#generic-shell-sketch)

## Derivation recipe

Compute the identity from things the worktree already knows about itself —
never from a counter, a random value, or anything requiring shared state:

1. **Branch label.** Current branch name, with any conventional-commit-style
   prefix stripped (`feature/`, `fix/`, `chore/`, …) and normalized: lowercase,
   non-alphanumeric runs collapsed to a single hyphen, leading/trailing
   hyphens trimmed. A detached checkout gets `detached-<short-commit>` instead
   — never leave the label empty.
2. **Worktree label.** The primary checkout (the one `git worktree list`
   reports first) gets a fixed label (e.g. `primary`) so its identity stays
   readable and stable even though its directory name varies by clone.
   Secondary worktrees derive their label from their own directory name,
   normalized the same way as the branch label.
3. **Path hash.** A short hash (4–8 hex chars is enough) of the worktree's
   absolute path. This is the collision-breaker: two worktrees can share a
   branch label (rare, but possible after a rebase or a rename) and still
   diverge here, and it is *stable* — it doesn't change when the branch is
   renamed, unlike a hash of branch name alone.
4. **Combine**, truncating each normalized piece to a fixed budget so the
   joined identity stays short enough for compose project names, container
   names, and log prefixes: `<branch-label>-<worktree-label>-<path-hash>`.

Collision stance: the path hash is short by design, so treat identity
collisions as a real (if rare) possibility, not an impossibility — the
coherence guard (below) is what actually prevents two worktrees from
silently sharing state, not the hash's uniqueness alone.

## What the identity feeds

- The compose/orchestrator project name, so containers from two worktrees
  never share a name or a network.
- The base of every port range this worktree binds (see `runners.md` and the
  instance primitive for how instance-level ports layer on top).
- The env-file name(s) this worktree writes and reads.
- The root of every stack's state directory under `.local/`.
- The ownership stamp on every started resource — container labels and the
  identity marker exported into each child process's environment — so
  dangling resources stay attributable to their worktree after records are
  lost (see `runners.md` on reclaim).

Write the derived identity to a small file under `.local/` on init (atomically
— write to a temp file, then rename) so later commands can compare against it
without re-deriving from scratch every time, and so a stale file left behind
after a path move or branch switch is detectable rather than silently reused.

## Coherence-guard checks

Run this before any service starts, and make it a hard stop (non-zero exit) —
not a warning — on any mismatch:

1. **Identity match.** Recompute the identity fresh and compare it, byte for
   byte, against the file written on init. A mismatch means the worktree
   moved, was renamed, or switched branches since init last ran.
2. **Port/URL match.** For every env file this stack writes, extract any
   value that looks like it points at localhost (`127.0.0.1`, `localhost`,
   `0.0.0.0`) and confirm the port matches what this worktree's identity
   computes today. Skip remote endpoints entirely — they are not this
   worktree's to validate.
3. **State-dir ownership.** Confirm every stack's recorded state directory is
   a descendant of this worktree's root, not an absolute path landing
   somewhere else.
4. **Cross-worktree leakage.** Grep env files for another worktree's path
   fragment and fail if found — this is the single check that catches a file
   copied wholesale from a sibling checkout.
5. **Synced-copy drift.** If any canonical `.local/` env file is mirrored out
   to a place a framework or tool actually reads from (many frameworks expect
   their own `.env.local`), diff the two and fail if they've drifted — the
   fix is always "re-run the sync step," never a manual edit.

Refuse-and-report contract: on failure, print what's wrong, what value was
expected, and the one command that fixes it. Never attempt to auto-correct
the mismatch as a side effect of running the guard — repair happens only when
init is re-run explicitly.

## Init-script shape

One script is the mandatory entry point; nothing else should assume it hasn't
run:

1. **Derive** — compute the identity and every port/path value from it.
2. **Write env** — generate any missing env files with dev-safe defaults
   (never production credentials), and normalize localhost references in
   files that already exist without touching values a developer already
   filled in.
3. **Validate** — invoke the coherence guard; stop hard on failure.
4. **Start infra** — bring up the compose-managed pieces so later steps
   (dependency install, service start) have something to talk to.

Make the whole script idempotent: running it twice in a row must produce the
same result as running it once, so agents and CI can call it defensively at
the start of every session.

## Generic shell sketch

Illustrates the shape only — adapt naming, port list, and normalization rules
to the project:

```bash
#!/usr/bin/env bash
# Source this; do not execute it directly.
set -uo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

normalize_label() {
  printf '%s' "$1" | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/^[a-z]+\///; s/[^a-z0-9]+/-/g; s/^-+//; s/-+$//' | cut -c1-40
}

branch="$(git -C "$repo_root" symbolic-ref --quiet --short HEAD || true)"
if [ -z "$branch" ]; then
  branch="detached-$(git -C "$repo_root" rev-parse --short HEAD)"
fi
branch_label="$(normalize_label "$branch")"

worktree_label="$(normalize_label "$(basename "$repo_root")")"
path_hash="$(printf '%s' "$repo_root" | shasum -a 256 | cut -c1-6)"

export STACK_WORKTREE_IDENTITY="${branch_label}-${worktree_label}-${path_hash}"
export STACK_PORT_OFFSET=$(( 0x$(printf '%s' "$repo_root" \
  | shasum -a 256 | cut -c1-4) % 200 ))
```
