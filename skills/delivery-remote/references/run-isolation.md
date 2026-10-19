# Run isolation

How two or more runs share one host without touching each other. Loaded from
`SKILL.md` Phase 2 whenever the host may hold more than one run — which is any
host whose manifest sets `max_concurrency` above 1.

**Contents:** [Slots](#slots) · [Worktree per run](#worktree-per-run) ·
[Ports and containers](#ports-and-containers) · [One plan, one run](#one-plan-one-run)

Everything here reads what the repo's own tooling reports. Nothing assumes a
repo parameterised its ports or named its compose project helpfully; a repo that
hardcodes both is the case this file is written for.

## Slots

The manifest's `max_concurrency` is a count of **slots**, numbered from 0. A run
takes the lowest free slot and holds it until reclaim. The slot — not the
feature code, not the branch — is what derives every number that must not
collide, so two runs of the same feature are as isolated as two runs of
different ones.

From slot `i`:

| Derived | Value |
|---|---|
| Port block | `port_base + i * port_block_size` (defaults 20000 and 100) |
| tmux session | `<tmux_prefix><CODE>-s<i>` |
| Worktree | `<run_root>/<repo>-wt/s<i>-<CODE>` |
| Compose project | `<repo>-s<i>-<CODE>`, lowercased |

Record the slot in the run record. A run whose slot cannot be determined has no
isolation, and dispatch stops.

**Prove the block is free before dispatch**, do not assume it: bind each port
you are about to hand out, or check with `lsof -nP -iTCP:<port> -sTCP:LISTEN`.
A stale process from a killed run holds ports the slot table thinks are free.

## Worktree per run

One worktree per run, one branch per run, off the shared warm clone:

```
git -C <RUNDIR> worktree add -b <branch> <worktree path> <BASE>
```

Each run derives its own branch name from its slot and feature code, so git's
refusal (`fatal: '<branch>' is already used by worktree at …`) should never come
up. If it does, the slot derivation was skipped.

Sharing the clone is deliberate and measured: six parallel `worktree add` plus
six parallel commits into one object store left `git fsck` clean. Runs share
objects and installed dependencies; they share nothing writable per-run.

## Ports and containers

### Repos with a compose file

Three things, in order. Skipping the third is the silent failure.

1. **Namespace the project.** Pass `-p <compose project>` on every compose
   command for the run. This overrides a project name hardcoded at the top of
   the file, so it works on repos that never anticipated a second copy. Without
   it, compose collapses several worktrees into one project and their containers
   become the same containers.
2. **Read the resolved model**, never the source file:
   `docker compose -f <file> -p <project> config --format json`. Every service's
   published host ports come back after interpolation, whether the repo wrote
   them as literals or as variables.
3. **Emit a per-run override** that remaps each published host port into the
   run's block, in the order the model lists them, and pass it as a second `-f`:

   ```yaml
   services:
     postgres:
       ports: !override
         - "127.0.0.1:<block base + n>:5432"
   ```

   The `!override` tag is load-bearing: compose merges a `ports:` sequence by
   concatenation, so without it the original host port stays published alongside
   the new one — measured as `50006` and `51006` both bound.

Bind to `127.0.0.1`, not `0.0.0.0`: a build host's test services have no reason
to be reachable from the network.

### Repos without a compose file

The repo still has to be told which ports to use, and there are only two honest
ways:

- **The verify command supports port 0** — the OS hands out a free ephemeral
  port (measured range 49152–65535 on macOS) and nothing can collide. Prefer
  this when the repo allows it.
- **The manifest names the port variables** (`repo.port_env:` — a list like
  `[API_PORT, DB_PORT]`). Each is assigned from the run's block and exported
  into the dispatch environment.

A repo with neither cannot run concurrently. Say so and cap that repo at one
run; do not guess a variable name.

## One plan, one run

A second dispatch for a feature code that already has a live run is **refused**.
Two runs of one `tasks.md` produce two branches whose relationship nobody
recorded, and the second one to finish quietly looks like the first.

The refusal is overridable by the user, and only by the user: they say so
explicitly, the second run takes its own slot like any other, and the run record
carries the override and who asked for it. An agent never lifts this on its own
reasoning about how useful a second attempt would be.
