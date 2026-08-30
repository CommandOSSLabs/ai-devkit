---
name: cmk:mcp-config
description: Use when the user asks to "set up MCP", "configure MCP servers", "add serena", "connect the tracker MCP", ".mcp.json", or needs a checked-in, per-vendor Model Context Protocol server configuration for a repo.
version: 0.2.1
---

# MCP Config

Establish or audit a repo's Model Context Protocol (MCP) server
configuration: one checked-in server set every clone and agent shares, wired
into each agent vendor's own registration mechanism, with secrets kept out
of the repo.

## Modes

**Init** (default) — create the checked-in server set and wire each vendor's
registration at it.

**Update** — add or remove a server in the checked-in config once;
per-vendor registration follows from it.

**Verify** — report-only audit against the checks under `## Verify`;
never mutates.

## Checked-in server set

Repo-level MCP config is checked in — `.mcp.json` at the repo root, or the
vendor equivalent — so every clone and every agent session gets the same
servers without manual setup. User-level MCP config (personal servers,
personal auth) stays out of the repo entirely; it is the individual's own
settings, layered on top of the checked-in baseline, never replacing it.

## Server classes worth wiring

Pick servers by the class of work they unblock, not by name — the examples
below are illustrative, never mandated:

- **Semantic code navigation** (e.g. a symbol-aware code server) — activate
  per project; it needs a language server or index scoped to the repo it
  runs against.
- **Tracker** — the delivery memory layer: where in-flight work, status, and
  history live. Canonical docs (`docs/decisions/`, `docs/requirements/`,
  `docs/design/`) stay tracker-neutral by convention (see `docs/README.md`,
  maintained by `cmk:docs`; enforceable standards for this live under
  `cmk:rule`) — no ticket IDs, no delivery status in those files. A tracker
  MCP server is how an agent reaches that delivery state without pulling
  tracker vocabulary into canonical docs.
- **Library docs** (e.g. a docs-lookup server) — current, versioned
  reference for a library/framework/API in play, so an agent doesn't work
  from stale training data.

A repo may need zero, one, or several of these; add a server only when a
real, recurring task needs it.

## Per-vendor wiring

One coherent server set, registered once per vendor. Each agent vendor has
its own registration mechanism — a project-level config file, a CLI
subcommand, or an editor/settings entry — and the checked-in server set is
the single source those registrations point at, not something each vendor
re-declares independently. Adding or removing a server updates the
checked-in config once; per-vendor registration follows from it.

Secrets and tokens never go in the checked-in file — reference them by
environment variable name only, resolved at each vendor's own
config-loading time from whatever secret store the repo already uses.

## Hygiene

A server whose auth is interactive (a browser login flow, a device code)
must degrade gracefully when nothing can answer the prompt — headless runs
and CI never hang waiting on it. Document, per server, whether it is
load-bearing (a task genuinely fails without it) or optional (a task
degrades but proceeds) — an agent reading the config should not have to
guess which failures to treat as blocking.

## Verify

Report-only — never mutate:

- The checked-in MCP config file exists and parses as valid config for its
  format.
- No secret or token value appears inline — every credential is an
  environment variable reference.
- Each configured server's transport is reachable, or the server is
  explicitly marked optional/degrades-gracefully for headless runs.
- Per-vendor registrations (whatever mechanism each vendor uses) resolve to
  the same checked-in server set — no vendor drifting to a different,
  undeclared server list.
