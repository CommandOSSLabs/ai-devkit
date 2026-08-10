# The (worktree, config, instance) primitive

## Config vs. instance

- **Config** — the declaration of a topology: which services, what images or
  binaries, what starting data. Owned by the package that needs the stack (an
  e2e test group, a benchmark harness, day-to-day local dev). A repo commonly
  has several configs, one per job, because a benchmark's topology and a
  smoke-test's topology rarely want the same shape.
- **Instance** — one running materialization of a config, named, with its own
  state on disk. A config can have zero, one, or many live instances at once
  within the same worktree; "one instance normally serves many tests" is the
  default, not a hard limit.

Selecting the tuple `(worktree, config, instance)` should be an explicit,
three-part decision, not something a script infers. Whatever helper performs
the selection should validate all three: the config path must resolve inside
the current worktree (never an absolute path elsewhere), and both the config
name and instance name should be restricted to a safe, normalized character
set (lowercase alphanumeric plus hyphen) since they end up in directory names,
container/network names, and log lines.

## State and home layout

Every instance's state lives at:

```
.local/<stack>/<config>/<instance>/
```

Give the instance root explicit named subpaths for anything that would
otherwise default to a shared home directory — a state/data directory, a
tool-specific home directory (package caches, credential stores), and
anything else a service would otherwise put under `~/.<tool>`. Naming these
explicitly is what prevents two instances (even in the same worktree) from
fighting over the same on-disk state, and it's what makes "wipe exactly this
instance" a safe, mechanical `rm -rf` of one directory tree.

## Port-broker responsibilities

However ports get assigned at the instance level, treat it as a broker with
three responsibilities, not a place for ad hoc arithmetic:

- **Allocate** — hand out a port (or port range) for this instance that does
  not collide with any other instance's currently-claimed range, inside this
  worktree or any other.
- **Record** — persist what was allocated somewhere the instance's own
  processes and any later `status`/`logs` call can read back, so a restart
  doesn't silently reallocate different ports out from under long-lived
  config.
- **Release** — free the allocation when the instance is torn down, so a
  long-running worktree doesn't accumulate orphaned reservations across many
  create/wipe cycles.

Range partitioning by worktree identity (see `identity-and-coherence.md`)
handles the *between-worktrees* collision problem; the broker handles the
*within-worktree* collision problem across configs and instances. Both layers
are needed — one without the other still lets two things collide.

## Join vs. select-distinct

The instance mechanism itself never decides whether to join an existing
instance or create a new one — that decision belongs to whatever is invoking
it: a test runner picking a shared instance for its whole run, an outer
scheduler assigning distinct instances to parallel shards, or a developer
choosing to stand up a second, disposable instance beside a persistent one
they don't want to disturb. Build the selection helper to accept the instance
name as a parameter and apply it, not to compute one internally — that keeps
the "who decides" question answerable by reading the call site, not the
mechanism.

## Instance lifecycle

- **Create** — first selection of a not-yet-existing instance name
  provisions its state root and starts its topology fresh.
- **Reuse** — selecting an existing, still-healthy instance by name should be
  cheap and should not restart or reprovision anything; a coordination layer
  relying on reuse to save setup cost needs this path to actually be fast.
- **Teardown** — tear down (wipe) only the exact selected instance: stop its
  processes, release its port allocation, and remove only its state root.
  Never fall back to a global prune, a blanket deletion of the parent
  `<stack>/<config>/` directory, or touching another instance's paths — those
  operations look similar but destroy state that a sibling instance, or a
  human, may still be relying on.
- **Reclaim** — an instance whose worktree directory no longer exists is the
  one case where acting on another worktree's resources is safe: nothing can
  still be relying on it. Attribution still comes from the stamped identity
  (see `runners.md` on reclaim), never from guessing by age, name pattern,
  or process ancestry.
