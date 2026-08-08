# Instance isolation mechanics

Deeper detail behind the selection layer in `SKILL.md`. `cmk:local-stack`
covers the general worktree-identity model; this file is the Devstack-specific
materialization of it.

## Identity derivation

Compute a worktree identity once per worktree, then reuse it everywhere the
selection helper runs:

- **Branch label** — the current branch name, with any leading type prefix
  (`feature/`, `fix/`, `chore/`, …) stripped, then normalized to lowercase
  alphanumeric-and-hyphen and truncated to a safe length. A detached checkout
  (no symbolic branch) falls back to `detached-<short-commit>` rather than an
  opaque or random label, so the identity stays legible and reproducible for
  the same checked-out commit.
- **Worktree label** — a normalized label for the checkout itself: a fixed
  label for the primary checkout, derived from the worktree directory name for
  any other one.
- **Path hash** — a short hash (a handful of hex characters is enough) of the
  absolute repository root path, appended to disambiguate two worktrees that
  otherwise produced the same branch/worktree label pair.

Concatenate the three into one identity string. That identity becomes
Devstack's app name (`DEVSTACK_APP`) for every instance selected from this
worktree — it is the axis that keeps worktrees from colliding with each other;
the `(config, instance)` pair is the axis that keeps stacks and their
materializations from colliding with each other *within* one worktree.

## Selection-helper validation

A selection helper takes exactly three inputs — config name, instance name,
absolute config path — and must reject anything that would produce an unsafe
or ambiguous instance root:

- both the config name and the instance name match a lowercase-normalized
  pattern (`^[a-z0-9][a-z0-9-]*$` or equivalent) — they end up in directory
  names, container/network names, and log lines, so anything else risks
  breaking a downstream tool or misreading in logs;
- the config path is absolute, exists, and resolves inside the current
  worktree root — never an absolute path belonging to another checkout;
- the derived instance root, state directory, and tool-home directory are
  exactly `.local/devstack/<config>/<instance>/`, `.../state`, and
  `.../move-home` — never overridden ad hoc by a caller.

On success, export the full contract together: app name, stack name
(`<config>-<instance>`), the config path, the instance root, and the state and
move-home paths. Whatever consumes these — a test framework's global setup, a
second-language bridge process — should **re-validate the same invariants at
its own boot time** rather than trust inherited environment values verbatim:
confirm the config path still matches what that consumer expects, confirm the
state and move-home paths are still children of the same instance root. This
catches a stale environment left over from a different selection (a common
failure when a shell or CI job inherits variables across unrelated steps).

## Safe-wipe pattern

Tearing down an instance is a three-step sequence, always in this order:

1. **Validate containment.** Re-derive `<config>` and `<instance>` from the
   instance root path and confirm the path is exactly
   `<worktree-root>/.local/devstack/<config>/<instance>` — reject anything
   that resolves (after following symlinks) outside that shape. This is the
   guard against a corrupted or hand-edited environment causing a wipe of the
   wrong directory.
2. **Invoke the tool's own wipe**, passing only the app, stack, and state-dir
   identifiers the tool expects — not a glob, not a shell wildcard.
3. **Remove exactly the validated instance root** — nothing above it, nothing
   beside it.

Never substitute a tool-level prune, a global container/daemon cleanup, or a
recursive delete of the entire `devstack/` (or `<config>/`) parent directory
for this sequence — those destroy sibling instances' state, including
another worktree's or another developer's.

## Version-pinned CLI quirks

Devstack's CLI behavior changes across releases; treat any specific flag
behavior as pinned to the version it was observed on, and re-verify on
upgrade. As of Devstack 0.7.2, two quirks are worth flagging explicitly rather
than assuming they generalize:

- `wipe` rejects a `--config` flag — pass only app, stack, and state-dir
  identifiers to the wipe invocation, even though the config path is part of
  selection.
- `up`/`apply` refuse to act against an already-live stack (a validator that's
  still running) — republishing or reconfiguring a live instance requires
  tearing it down first, not a live in-place update.

Do not carry these two specifics forward as general Devstack behavior once the
pinned version changes; confirm against the current release's own docs or
changelog before relying on them again.
