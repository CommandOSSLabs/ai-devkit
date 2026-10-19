---
name: cmk:worktree
description: Use when starting feature work, executing a plan, or making any multi-commit change that should not touch the user's current checkout — set up an isolated git worktree before the first file is edited.
version: 1.1.0
---

# Isolate Workspace

Give feature work an isolated workspace with a verified-clean starting point. Order of preference: detect isolation that already exists → the harness's native workspace tool → a manual `git worktree` fallback. Never fight the harness.

## Step 0 — Detect and get consent

Check whether you are already inside a linked worktree:

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" && pwd -P)
```

- `GIT_DIR != GIT_COMMON` → likely a linked worktree, **but guard against submodules first**: if `git rev-parse --show-superproject-working-tree` prints a path, you are in a submodule — treat it as a normal checkout. Otherwise you are already isolated: report the path and branch, skip creation, go to Step 2.
- `GIT_DIR == GIT_COMMON` → normal checkout. If the user has a stated worktree preference, honor it silently. If not, ask: "Want me to set this up in an isolated worktree so your current branch stays untouched?" Declined → work in place, go to Step 2.

Done when: you know which of the three cases you are in, and you have consent if creating.

## Step 1 — Create the workspace

**1a. Native tool first.** If the harness provides a workspace/worktree mechanism (a tool named like `EnterWorktree`, a `/worktree` command, a `--worktree` flag), use it and go to Step 2. A native tool manages placement, branching, and cleanup itself; creating a manual worktree alongside it leaves phantom state the harness can't see. Only fall through when no native tool exists.

**1b. Git fallback.** Pick the directory by priority:

1. An explicit user instruction — always wins
2. An existing `.worktrees/` at the repo root
3. An existing `worktrees/` (if both exist, `.worktrees/` wins)
4. None of the above → create `.worktrees/`

Bind the chosen directory to `$DIR` and use it in every command below — the priority list above is real only if the commands honor it:

```bash
DIR=.worktrees   # or DIR=worktrees if that existing dir was selected above
```

Before creating anything inside a project-local directory, you MUST confirm it is git-ignored. Leave the entry as an uncommitted working-tree change — git honors it immediately, and committing `.gitignore` here would write a commit to the user's **current** branch, the exact thing this skill promises not to touch:

```bash
git check-ignore -q "$DIR" || printf '%s/\n' "$DIR" >> .gitignore
```

Then create and enter:

```bash
git worktree add "$DIR/<branch-name>" -b "<branch-name>"
```

If creation fails on a sandbox/permission error, tell the user and work in place instead.

Done when: you are in the workspace (or have reported why not).

## Step 2 — Install dependencies

Auto-detect the package manager from lockfiles/manifests and run its install: `pnpm-lock.yaml` → pnpm, `bun.lock*` → bun, `yarn.lock` → yarn, `package-lock.json`/bare `package.json` → npm, `Cargo.toml` → `cargo build`, `uv.lock` → uv, `poetry.lock` → poetry, `requirements.txt` → pip, `go.mod` → `go mod download`. No manifest → skip.

## Step 3 — Clean baseline

Run the test suite using the command in `docs/agents/project.md` (missing → say so, suggest `cmk:repo-config`, and use the ecosystem's default runner).

- **Baseline green** → proceed.
- **Baseline red** → STOP and ask the user before proceeding. Starting on a failing baseline makes it impossible to tell your bugs from pre-existing ones.

## Report

```
Workspace ready at <absolute path> (branch <name>)
Baseline: <N> tests passing, 0 failures
Ready to start <task>.
```

## Red Flags — Never

- Create a worktree when Step 0 found you already in one
- Use `git worktree add` when a native tool exists
- Create a project-local worktree directory without the ignore check
- Skip the baseline run, or continue past a red baseline without asking
