# CI

## What
ai-devkit currently ships no CI workflows of its own. The sync-check CI
pattern — a check-only validator that keeps vendor adapters byte-identical to
their canonical skills in a consuming repo — is defined by `cmk:agent-vendors`.
Upstream baseline tracking for vendored skills is defined by `cmk:sync`.

## Where
- Sync-check CI convention: `skills/agent-vendors/references/sync-check-ci.md`.
- Upstream baseline (`.agents/skills.lock`) format: `skills/sync/references/skills-lock.md`.
