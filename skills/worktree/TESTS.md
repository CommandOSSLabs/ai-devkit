<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:worktree` — tests

## Edit — share `.worktrees/` instead of minting `.isolate-workspace/` (v1.1.0)

**Origin.** User request: isolation for skills / execute / check should live
under `.worktrees/`, the conventional project-local worktree parent, instead of
a parallel `.isolate-workspace/` directory and gitignore entry.

**RED (v1.0.0 text).** Git fallback priority:

1. explicit user instruction
2. existing `.isolate-workspace/`
3. existing `isolate-workspace/`
4. neither → **create `.isolate-workspace/`**

`cmk:repo-config` and `cmk:delivery-ship` restated the same parent. A repo that already
ignored `.worktrees/` still got a second ignored path.

**GREEN (v1.1.0).** Default parent is `.worktrees/`. Reuse an existing
`.worktrees/` (or `worktrees/`) rather than minting another directory. Append
`.gitignore` only when `$DIR` is not already ignored. Reuse a legacy
`.isolate-workspace/` / `isolate-workspace/` if one is already on disk, so a
second parent is not created beside it.


## Smoke after the cmk rename (2026-10-19)

skill-tester-haiku on harbor-ledger with the GitHub board (`KIT=cmk`, all skills): **PASS** — isolated workspace for #23: `.worktrees/` created and git-ignored, branch from dev, baseline `bun test` 12 pass.
