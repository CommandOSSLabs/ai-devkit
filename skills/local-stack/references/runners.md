# Runners

## Interactive runner

Purpose: a single command that brings up an entire stack in one terminal for
a human, with live output and live-reload, so the feedback loop stays fast
while editing code.

Expectations:

- **One command** starts everything — infra, then apps — in dependency order.
  A human should never need to remember a multi-step sequence just to get a
  working stack.
- **Live-reload per language.** Never run a plain interpreter/compile-and-run
  command for a service under active development; always run it through
  whatever the language's ecosystem provides for file-watching restart. What
  that tool is varies by stack — the requirement is "some file-watching
  wrapper exists and is used," not any specific tool name.
- **Heavy processes are opt-in.** A component that's expensive to start
  (a full chain node, a large model server, anything that takes real time or
  resources) should default to off in the interactive config, with an
  explicit flag or separate process group to bring it up when actually
  needed.
- **Clean up on exit.** Anything the interactive session started outside its
  own process tree (compose-managed containers, background daemons) needs a
  signal handler (EXIT/INT/TERM) so quitting the multiplexer doesn't leave
  orphaned containers running.
- Source the worktree identity and run the coherence guard (see
  `identity-and-coherence.md`) as the first step of every process entry, not
  just once globally — a process started later in the same session should
  still catch a mismatch.

A process multiplexer (mprocs-style tool) is the usual shape: one config file
listing named process entries, each composed of "source env → validate
coherence → run with live-reload."

## Headless runner

Purpose: start the same stack without a TTY, for an agent or CI, and leave it
running as a persistent background service until explicitly stopped.

Contract — a single entry point exposing these subcommands:

- **`start`** — idempotent. Calling it again against an already-running,
  healthy stack should be a fast no-op (or a clear "already running"
  message), not a restart. Start components in dependency order, gate each
  readiness check with a real health probe (an HTTP/TCP check, not just
  "the process didn't immediately exit"), and use a bounded timeout with a
  clear error naming which component failed to become healthy.
- **`status`** — report-only; reads PID files and health checks, prints a
  summary, and does not start or stop anything.
- **`logs [service]`** — with no argument, an aggregate view across every
  service; with one, that service's own log. Prefer a single aggregate log
  file plus per-service log files over re-deriving the aggregate from
  scratch each time.
- **`stop`** — graceful shutdown (try a graceful signal before a forceful
  one), release any port-broker reservations the instance held, and leave
  state on disk intact — stopping is not the same operation as wiping an
  instance.
- **`reclaim`** — recover from runs that died without `stop`. Inventory
  resources stamped with a worktree identity — containers by compose
  project/label, processes by the identity marker in their environment,
  recorded port reservations, instance state roots — and diff that against
  what PID files and instance records still account for. Report each stray
  with the evidence that attributes it, then remove it. Scope strictly to
  the current worktree's identity, or to an identity whose worktree
  directory no longer exists (a deleted worktree cannot object). Anything
  unattributable is reported, never killed, and there is no machine-wide
  prune mode.

Additional rules:

- No TTY assumptions anywhere in the start path — no interactive prompts, no
  reliance on a controlling terminal for output.
- Exit codes must be meaningful: zero only on genuine success, non-zero (and
  distinguishable, if the caller needs to branch on failure mode) otherwise,
  so CI can gate on them directly.
- PID files and logs live under `.local/pids/` and `.local/logs/`
  respectively — never scattered elsewhere, and never under a shared/global
  temp directory that a second worktree might also write to.
- Before recording or acting on a PID found on disk, confirm the process it
  names is actually still owned by this worktree/instance (not just "some
  process happens to have this PID now") before trusting or killing it.
- Stamping is what makes ownership checkable: start every child process with
  the worktree identity exported in its environment, so a process stays
  attributable even after its PID file is lost or a run crashes. Process
  ancestry is never the check — a single agent session runs across multiple
  worktrees, so walking parent/child PID trees kills another worktree's
  services.

## Choosing a mode

Default to interactive for a human actively editing code — the fast
live-reload loop is the point. Default to headless for anything unattended:
an agent's own session, a CI job, or a long-lived shared stack other people's
sessions depend on. The two modes may coexist against different stacks in the
same worktree, but never against the same instance at the same time — running
both is a resource fight, not a supported layout.

Headless persistence is a deliberate choice, not a default to hide behind. A
run that started a stack for its own task calls `stop` before it finishes;
only a stack other sessions are meant to join stays up, and that intent
belongs to the invoking layer, stated explicitly — never an accident of a
forgotten teardown.

## Log hygiene

Keep one colorized aggregate log (interleaved, each line tagged with its
source service and a distinct color) alongside individual per-service log
files. The aggregate is what a human tails to get a feel for overall stack
health; the per-service file is what an agent or a debugging session greps
when it already knows which component is suspect. Assign colors from a small
rotating palette keyed by service name so the same service reads the same
color across a session.
