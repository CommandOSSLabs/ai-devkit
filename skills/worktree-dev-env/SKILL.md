---
name: cmk:worktree-dev-env
description: This skill should be used when the user asks to "set up local dev", "worktree dev environment", "port conflicts between worktrees", "headless dev mode", "mprocs config", "process-compose setup", or needs to create or iterate worktree-isolated local development environments with deterministic port isolation, coherence validation, interactive and headless service runners, and env file management.
version: 0.1.0
---

# Worktree Dev Environment Setup

Set up (or improve) a worktree-isolated local development environment. The goal is a system where multiple git worktrees of the same repo can run full local dev stacks simultaneously on the same machine — without port conflicts, stale configs, or cross-worktree contamination.

This pattern is valuable for three audiences:
- **Human developers** who want to work on multiple branches with live-reloading services
- **AI agents** (Claude Code, OpenCode, Cursor, etc.) that need to spin up, test against, and tear down local dev in headless mode
- **CI pipelines** that run integration tests against real services

## The Pattern (Stack-Agnostic)

The system has eight components. Each is a shell script or config file. Adapt implementation to the project's actual tech stack, but preserve the architectural boundaries — they exist because each component has a single responsibility and can fail independently.

### 1. Port Isolation (`scripts/worktree-env.sh`)

**Purpose:** Derive deterministic, unique port numbers from the repo's absolute path so that two worktrees on the same machine never collide.

**How it works:**
- Compute a numeric offset from a hash of the repo root path: `offset = SHA256(repo_root) % 200`
- Apply that offset to every port the project uses: `SERVICE_PORT = BASE_PORT + offset`
- Export all computed ports as environment variables
- Also derive a unique compose project name (e.g., `COMPOSE_PROJECT_NAME=myapp-<sanitized-path>`) so Docker containers don't collide

**Why SHA256 mod 200:** SHA256 is deterministic (same path = same ports every time, no state file needed) and the mod 200 range keeps ports in a safe user-space band while making collisions between different paths extremely unlikely.

**Key rules:**
- This script is **sourced**, never executed directly — it exports vars into the caller's environment
- It must be idempotent (sourcing it twice produces the same result)
- Provide an escape hatch env var (e.g., `MYAPP_WORKTREE_ISOLATION_DISABLED=1`) for cases where someone wants to override

**Edge case — file-based databases (SQLite, DuckDB):** These don't use ports. Instead, isolate them via path — each worktree gets its own DB file under `.local/` (e.g., `.local/dev.db`). The coherence guard should validate the DB path prefix matches the current `REPO_ROOT` to prevent cross-worktree contamination.

**Template logic:**
```bash
#!/usr/bin/env bash
# worktree-env.sh — source this, don't execute it
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OFFSET=$(echo -n "$REPO_ROOT" | shasum -a 256 | cut -c1-4)
OFFSET=$((16#$OFFSET % 200))

# Adapt these to your project's services:
export MYAPP_DB_PORT=$((55432 + OFFSET))
export MYAPP_API_PORT=$((8080 + OFFSET))
export MYAPP_FRONTEND_PORT=$((3000 + OFFSET))
export COMPOSE_PROJECT_NAME="myapp-$(basename "$REPO_ROOT" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')"
```

### 2. Init Script (`scripts/init-worktree-dev.sh`)

**Purpose:** One-command bootstrap that prepares a worktree for local development. This is the **mandatory entry point** — nothing else should run before it.

**What it does (in order):**
1. Source `worktree-env.sh` to compute ports
2. Create `.local/` directory with all needed config and secret files (if they don't exist)
3. Generate default configs with safe dev values (never production credentials)
4. Normalize env files — replace placeholder values, rewrite ports/DSNs to match computed values
5. Validate coherence (call the coherence script — hard stop on failure)
6. Sync env vars to service-specific locations (call the sync script)
7. Print a summary showing all service endpoints and their ports

**Key rules:**
- Use `set -euo pipefail` — fail fast on any error
- Use atomic writes (write to temp file, then `mv`) for config files to avoid partial writes
- Never overwrite files that already have real values — only fill in defaults/placeholders
- When rewriting DSNs or URLs, only touch localhost entries (skip remote/production DSNs)

### 3. Coherence Guard (`scripts/ensure-worktree-coherence.sh`)

**Purpose:** Hard-fail safety check that validates all config files, env vars, and ports are internally consistent. If this fails, **nothing starts** — the developer must fix the mismatch first.

**What it checks:**
- All referenced config files exist and are within the current worktree (reject absolute paths pointing elsewhere)
- All database connection strings use the correct computed port (parse the DSN, don't just check the raw number)
- All service URLs reference the correct computed ports
- Compose project name is consistent
- Any inter-service references (e.g., service A's URL for reaching service B) match the computed values
- For file-based databases, the path prefix matches `REPO_ROOT`

**Why this exists:** Without this check, it's easy to accidentally run with a stale `.env` file from before a port change, or to source config from a sibling worktree. These bugs are silent and maddening to debug — authentication failures, connection refused, or worse, writes to the wrong database. The coherence guard makes these bugs loud and immediate.

**Key rules:**
- Support a `--quiet` flag that suppresses success output (for use in mprocs/headless wrappers)
- Exit 1 with a descriptive error on any mismatch — say exactly what's wrong and what the expected value should be
- Check every DSN, every URL, every port reference — be thorough

### 4. Env Sync (`scripts/sync-service-envs.sh`)

**Purpose:** Propagate worktree-computed values to the specific env files that each service reads. Many frameworks (Next.js, Vite, Rails, etc.) expect a `.env.local` in their own directory.

**What it does:**
- Read the canonical env files from `.local/`
- Generate service-specific env files (e.g., `frontend/.env.local`, `backend/.env.local`)
- Only write the vars each service needs — don't dump everything everywhere

**Why a separate script:** Services have different env file conventions and variable names. The frontend might need `VITE_API_URL` while the backend needs `DATABASE_URL`. This script is the translation layer. Keeping it separate from init means services can re-sync without re-running the full init.

### 5. Interactive Mode (`mprocs.yaml` or `process-compose.yaml`)

**Purpose:** Run all services in a single terminal with live-reload for human developers.

**Use [mprocs](https://github.com/pvolok/mprocs) or [process-compose](https://github.com/F1bonacc1/process-compose)** — both are lightweight process multiplexers. Choose based on the team's preference.

**Each process entry should:**
1. Source the worktree env vars
2. Run the coherence check (`--quiet` flag)
3. Start the service with file-watching/live-reload

**Common process types:**
- **infra**: Database, message queue, cache (via docker compose). Include signal handlers (EXIT, INT, TERM) to auto-clean containers on exit.
- **backend**: Application server with watch mode (e.g., `cargo watch`, `bun --watch`, `nodemon`, `air` for Go)
- **frontend**: Dev server (Vite, Next.js dev, etc.)
- **bootstrap**: One-shot processes that seed initial data (admin accounts, dev fixtures). These should be idempotent and retry-capable since they depend on other services being ready.
- **workers**: Background job processors, if any

**Always use live-reload tooling**, not plain run commands. The right tool depends on the stack:

| Stack | Live-reload tool | NOT this |
|-------|-----------------|----------|
| Rust | `cargo watch -x run` | `cargo run` |
| Go | `air` or `gow` | `go run` |
| Node/Bun | `bun --watch` / `nodemon` | `node` |
| Python | `uvicorn --reload` / `watchfiles` | `python` |
| Elixir | `mix phx.server` (has built-in reload) | `mix run --no-halt` |
| Django | `python manage.py runserver` (has built-in reload) | `gunicorn` |

### 6. Headless Mode (`scripts/start-headless.sh`)

**Purpose:** Start all services in the background without a TTY, for use by AI agents and CI. This is what makes the project "agent-friendly."

**Start flow:**
1. Create `tmp/pids/` and `tmp/` directories
2. Source env files + worktree isolation
3. Validate coherence (hard stop on failure)
4. Sync service envs
5. Start each service with `nohup`, writing:
   - Stdout/stderr to `tmp/<service>.log`
   - PID to `tmp/pids/<service>.pid`
6. Run health checks (HTTP endpoint probes or port readiness checks) for critical services
7. Print status summary

**Stop flow** (`--stop` flag):
1. Read PID files from `tmp/pids/`
2. Kill each process
3. Bring down docker compose infrastructure
4. Clean up PID files

**Key rules:**
- Start services in dependency order (infra first, then backends that other services depend on, then frontends). Think about the dependency graph — if service A calls service B, start B first.
- Health checks should have reasonable timeouts (10-30s) and clear error messages
- Use `tmp/` (gitignored) for all ephemeral state — never write PIDs or logs elsewhere
- The stop command should be graceful — try SIGTERM before SIGKILL
- For non-HTTP services (gRPC, message brokers), use TCP port checks (`nc -z`) rather than HTTP probes

### 7. Service Logs (`scripts/logs.sh`)

**Purpose:** Color-coded log viewer for headless services. Usable standalone by humans (`./scripts/logs.sh`) and called by `start-headless.sh --logs` internally.

**Usage:**
- `./scripts/logs.sh` — tail all services, color-coded
- `./scripts/logs.sh api` — tail only the api service
- `./scripts/logs.sh --no-follow` — dump current logs and exit (no live tail)

**How it works:**
- Discover services from `tmp/pids/*.pid` (same source of truth as headless start/stop)
- Assign each service a distinct ANSI color from a rotating palette
- Prefix every line with a colored `[service-name]` tag
- Default is `--follow` (live tail); `--no-follow` dumps and exits

**Template logic:**
```bash
#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

COLORS=(36 33 32 35 34)  # cyan, yellow, green, magenta, blue
follow=true
service_filter=""

for arg in "$@"; do
  case "$arg" in
    --no-follow) follow=false ;;
    *) service_filter="$arg" ;;
  esac
done

tail_cmd="tail"; $follow && tail_cmd="tail -f"

color_idx=0
for pidfile in "$REPO_ROOT"/tmp/pids/*.pid; do
  svc="$(basename "$pidfile" .pid)"
  logfile="$REPO_ROOT/tmp/${svc}.log"
  [ -n "$service_filter" ] && [ "$svc" != "$service_filter" ] && continue
  [ -f "$logfile" ] || continue

  color="${COLORS[$((color_idx % ${#COLORS[@]}))]}"
  color_idx=$((color_idx + 1))
  $tail_cmd "$logfile" | sed "s/^/$(printf '\033[%sm' "$color")[${svc}]$(printf '\033[0m') /" &
done

[ $color_idx -eq 0 ] && echo "No service logs found in tmp/" && exit 1
wait
```

**Integration with `start-headless.sh`:**
- `start-headless.sh --logs [service]` delegates to `scripts/logs.sh` — no duplicated logic
- After starting services and health checks pass, print a hint: `View logs: ./scripts/logs.sh`

### 8. Agent Instructions

**Purpose:** Tell AI agents how to use the dev environment. Without this, an agent will try to `npm start` or `docker-compose up` and get confused.

**Add a section to the project's agent configuration file** — `CLAUDE.md` for Claude Code, `AGENTS.md` for OpenCode, or both if the project supports multiple agents:

```markdown
# Worktrees

- Use `.claude/worktrees/` for git worktrees (already gitignored)

## Worktree-safe local dev (required)

- For any request to start local development, always run `./scripts/init-worktree-dev.sh` first.
- Never source env files from another worktree path; only use `.local/` files in the current repo root.
- Never bypass `scripts/ensure-worktree-coherence.sh`; if it fails, stop and report the mismatch.
- For interactive human sessions, start services with `mprocs --config mprocs.yaml`.
- For non-interactive/headless agent runs (no TTY), use `./scripts/start-headless.sh` (stop with `--stop`).
  View logs with `./scripts/logs.sh [service]`. Logs go to `tmp/*.log`, PIDs to `tmp/pids/`.
```

For OpenCode (`AGENTS.md`), the content is identical — just placed in the file OpenCode reads.

## Workflow: Create

1. **Discover the project** — Read the project structure, identify services, databases, message queues, and existing dev setup (docker-compose files, Makefiles, existing scripts).
2. **Identify ports and services** — List every network port the project uses (databases, APIs, frontends, caches, etc.).
3. **Implement each component** in order (1-8 above), adapting to the project's tech stack.
4. **Test the setup** — Run init, verify coherence, start services in headless mode, confirm health checks pass.
5. **Update .gitignore** — Ensure `.local/`, `tmp/`, and any generated env files are gitignored.

## Workflow: Iterate

1. **Understand what exists** — Read the current scripts, identify which components are implemented.
2. **Identify the gap or issue** — Determine what to change: new service, flaky health check, missing coherence check.
3. **Make targeted changes** — Edit the specific component, preserving the architecture.
4. **Re-validate** — Run the coherence check and a headless start/stop cycle to verify.

## Adapting to Tech Stacks

The pattern is the same regardless of stack. Here's how the implementation details change:

| Component | Node/Bun project | Python project | Go project | Rust project | Elixir project |
|-----------|------------------|----------------|------------|-------------|----------------|
| **Backend watch** | `bun --watch` / `nodemon` | `watchfiles` / `uvicorn --reload` | `air` / `gow` | `cargo watch -x run` | `mix phx.server` |
| **Frontend dev** | `vite dev` / `next dev` | N/A or Jinja live-reload | N/A or templ | `trunk serve` (WASM) | N/A (Phoenix LiveView) |
| **DB migration** | `drizzle-kit` / `prisma` | `alembic` / `django migrate` | `goose` / `migrate` | `sqlx migrate` | `mix ecto.migrate` |
| **Package install** | `bun install` / `npm ci` | `pip install -e .` / `uv sync` | `go mod download` | `cargo build` | `mix deps.get` |
| **Health check** | `curl http://localhost:$PORT/health` | Same | Same | Same | Same |
| **gRPC health** | N/A | `grpc_health_probe` or `nc -z` | Same | Same | Same |

The scripts themselves are always bash — they're the orchestration layer. The services they manage can be anything.

## Common Pitfalls

- **Don't hardcode ports in application code.** Services must read their port from environment variables, or the isolation layer can't work. If the project currently hardcodes ports, refactor those first.
- **Don't use `docker-compose.override.yml` for port mapping.** It's not worktree-aware. Instead, use env var substitution in the compose file: `ports: ["${MYAPP_DB_PORT}:5432"]`.
- **Don't skip the coherence check "just this once."** The whole point is that it catches silent misconfigurations. If it's too strict, fix the check — don't bypass it.
- **Don't put secrets in the init script.** Generate random dev-only secrets at init time (e.g., `openssl rand -hex 32`), but never embed real credentials.
- **Don't use plain `go run` or `cargo run` in interactive mode.** Always use a file-watching wrapper (`air`, `cargo watch`) so that code changes trigger automatic restarts.
- **Don't forget inter-service dependency ordering.** If service A depends on service B, start B first and health-check it before starting A. Think about the full dependency graph.

## File Layout Reference

After setup, the project should have:

```
project-root/
├── .local/                          # Gitignored. Per-worktree config & secrets.
│   ├── .env.<service>.local         # One per service needing secrets
│   └── <config-files>               # Service configs, TLS certs, etc.
├── tmp/                             # Gitignored. Headless runtime state.
│   ├── pids/                        # PID files for headless services
│   └── *.log                        # Service logs from headless mode
├── scripts/
│   ├── worktree-env.sh              # Port isolation (sourced, not executed)
│   ├── init-worktree-dev.sh         # Bootstrap entry point
│   ├── ensure-worktree-coherence.sh # Hard-fail validation
│   ├── sync-service-envs.sh         # Env propagation to service dirs
│   ├── start-headless.sh            # Headless start/stop
│   └── logs.sh                      # Color-coded service log viewer
├── mprocs.yaml                      # Interactive process multiplexer config
├── CLAUDE.md                        # Agent instructions for Claude Code
└── AGENTS.md                        # Agent instructions for OpenCode
```
