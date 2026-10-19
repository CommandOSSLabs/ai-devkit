# Host provisioning

First-run setup for a build host, plus the two schemas every later run reads —
the host manifest and the per-run record. Run once per host, then once per repo.

This file holds **actions**, not rules. The rules those actions serve — why the
tmux server must come from the console, why a warm clone is never wiped, why an
env value never travels unnamed — live in `SKILL.md` and only there.

## What only the user can do

These need a browser, a password, or a device code. Surface all of them at once
with the exact command; never half-finish the setup and dispatch anyway.

| Need | One-time command | Why it cannot be automated |
|---|---|---|
| A tmux server from the console | start tmux on the host's own screen or via Screen Sharing | Only a console-started server can open the login keychain |
| Agent login | the driver's `login_cmd` | Device-code or browser flow |
| Return-leg credential | `gh auth login` on the host, or a scoped **fine-grained PAT** — the two options and their trade-off are in `references/return-leg.md` | The credential is a secret the user owns |

Those two differ in scope, not in difficulty: under full autonomy an agent
holding a full-account `gh` login can push and open pull requests on every repo
in the account, not only the one it was dispatched for. Say which one is in
place when reporting a `pr` return.

## The manifest

`docs/agents/host-build.md`, committed:

```yaml
host:
  alias: jayden-host          # tried first
  fallbacks: [host-ts, host]  # tried in order
  path: $HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$HOME/.bun/bin:$HOME/.cargo/bin:$PATH
  run_root: ~/builds
  tmux_prefix: bh-
  max_concurrency: 6
  port_base: 20000
  port_block_size: 100
agent:
  default: grok
  model: ~                    # driver default when empty
repo:
  install: pnpm install
  verify: pnpm test -- --run
  env_files: [.env.local]     # names only
  compose: [compose.yml]      # [] when the repo has none
  port_env: []                # var names to fill from the slot's block
return: pr                    # pr | fetch
```

`max_concurrency` is a count of slots, and a property of the machine rather than
of any plan: a plan asking for more lanes is degraded to the cap, and the
degradation is recorded. `port_base` and `port_block_size` carve the slot's
non-colliding range; `references/run-isolation.md` derives everything else from the slot.

`compose` and `port_env` are how a repo declares what has to move per run.
Leave both empty and the repo is capped at one run at a time — say so rather
than guessing a variable name.

`path` exists because a non-interactive `ssh host '<cmd>'` runs zsh without
sourcing `.zshrc` or `.zprofile`. Every dispatched command exports it first, and
it must reach every tool the install and verify commands need — a Docker CLI in
`/usr/local/bin` and a runtime under `$HOME` are both installed, working, and
invisible without it.

## The run record

`.skills/<CODE>/host-run.json`, local-only, one per run. The manifest describes
the *host*; this describes the *run*, and it is the only place a per-run value is
written down — `host-status.sh` reads it rather than being edited per feature.

```json
{
  "code": "SURF", "slot": 0,
  "branch": "feat/s0-SURF",
  "base_sha": "08bb54c3f27e6060b44e4561c0bda2d5c75de6d2",
  "route": "continuous", "agent": "grok", "model": "grok-4.5",
  "driver_status": "verified",
  "alias": "build-host", "path": "<the manifest PATH, verbatim>",
  "session": "bh-SURF-s0",
  "workdir": "~/builds/app-wt/s0-SURF",
  "log": "<workdir>/.skills/SURF/host-run.log",
  "sentinel": "<workdir>/.skills/SURF/host-run.exit",
  "plan": "docs/specs/2026-09-10-surface-composition/tasks.md",
  "progress_glob": "~/.grok/sessions/<url-encoded workdir>/*/summary.json",
  "compose_project": "app-s0-surf",
  "port_env": {"POSTGRES_PORT": 20000, "APP_BACKEND_PORT": 20003},
  "return": "pr", "dispatched_at": "2026-09-10T06:06:08Z",
  "env_files_transferred": [".env"], "notes": []
}
```

Four fields exist only so a later read needs no guesswork, and each is cheap to
write at dispatch and expensive to reconstruct afterwards:

| Field | Why it is recorded, not derived |
|---|---|
| `path` | The manifest is a YAML block inside a markdown file; a reader would have to parse it to send a single command |
| `plan` | Repo-relative path to `tasks.md`, so checkbox progress is readable without knowing the spec directory |
| `progress_glob` | The driver row's `progress` field, resolved to this run's directory. Driver-specific knowledge stops here |
| `port_env` | The slot's block, already assigned — what a tunnel forwards and what a port check looks for |

Set `closed: true` at reclaim. The record itself stays: it is how an artifact
with no live run is recognised later.

## The status script

One copy per repo at `scripts/host-status.sh` (or wherever the repo keeps its
scripts), seeded verbatim from `references/templates/host-status.sh` beside `SKILL.md` and
committed. It is the user's read of a run from their own machine:

```
scripts/host-status.sh                 # status of the only open run
scripts/host-status.sh -c SURF wait    # poll to a terminal state
scripts/host-status.sh diff --stat     # what the run has committed since BASE
scripts/host-status.sh tunnel          # the run's ports, forwarded here
```

**Never edit a run's values into it.** A per-run copy is how the next feature
ends up with a script pointing at the last feature's session. Everything that
varies is in the run record; if the script needs something the record lacks, the
record gains a field.

It is read-only by construction — no return, no push, no reclaim. Those are
`references/return-leg.md` and `references/reclaim.md`, and neither is one keystroke.

## Per-host setup

1. **Pick the alias.** Try each candidate: `ssh -o BatchMode=yes -o
   ConnectTimeout=8 <alias> true`. Prefer one that resolves off-LAN — a VPN or
   mesh name keeps working away from the network the LAN address lives on.
2. **Confirm the tmux server**: `ssh <alias> 'tmux ls'`. Then run a
   keychain-backed driver's `version_cmd` inside a pane and compare it against
   the same command over plain SSH. Both results go in the run record.
3. **Create the run root**: `mkdir -p <run_root>`.
4. **Log in each agent** you intend to dispatch, then run its `auth_check`
   inside the tmux server and date the result in `references/runner-drivers.md`.

## Per-repo setup

1. **Bare repo** on the host: `git init --bare <run_root>/<repo>.git`.
2. **Working clone**: `git clone <run_root>/<repo>.git <run_root>/<repo>`.
3. **Local remote**: `git remote add hostbuild <alias>:<run_root>/<repo>.git`.
   Verify with `git ls-remote hostbuild`.
4. **Return leg**, when `return: pr` — follow `references/return-leg.md` § Credential on
   the host, and add GitHub as the run clone's second remote there.
5. **Warm the clone**: push a first base SHA, then run the manifest's `install`.
6. **Env files**: transfer the files the manifest names, on confirmation, with
   `scp`/`rsync` and mode 600.
7. **Smoke**: run the driver's `auth_check` from inside the clone. A green smoke
   here is what lets Phase 1 pass cheaply on later runs.
8. **Status script**: copy `references/templates/host-status.sh` to the repo's script
   directory, `chmod +x`, and commit it. Once per repo, not once per run.
