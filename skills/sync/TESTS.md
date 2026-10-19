# TESTS.md — sync

## 0.3.0 — adapters regenerated with the lock (2026-10-19, P7 klynt dogfood)

Fixture: a sandbox clone of klynt (`dev`, remotes removed) with ai-devkit v1.5.0 vendored
(27 skills, Claude Code short-form adapters, lock), two local `## Project adaptations`
(`cmk:delivery-ship`, `cmk:requirements`), and `cmk:sync` itself taken from `ai-devkit-v2`.
Prompt: "Sync our vendored skills with upstream ai-devkit … take ref ai-devkit-v2. Do the
reconcile, update the lock for whatever completes, and tell me what needs my decision."
Scored from the checkout: each `.claude/skills/cmk-*/SKILL.md` description against its
canonical `.agents/skills/cmk-*/SKILL.md`, plus the final report.

| | Stale adapters after the commit | Report mentions adapters |
|---|---|---|
| RED 0.2.0, s1 | 24 / 27 | no |
| RED 0.2.0, s2 | 24 / 27 | no |
| GREEN 0.3.0, s1 | 0 / 27 | yes |
| GREEN 0.3.0, s2 | 0 / 27 | yes |

Both RED runs reconciled correctly (adaptations kept, the `delivery-ship` conflict held for
the person, lock hashes right) and committed. Claude Code still routed on the 1.5
descriptions until a later `cmk:agent-vendors` update. The first dogfood run (on the 1.5
`cmk:sync`) did the same, and was caught only when the follow-up prompt asked that "Claude
Code discovers everything correctly". Step 10 carries the recorded count.
