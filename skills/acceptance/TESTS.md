<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:acceptance` — test evidence

## v1.2.0 — consume `docs/agents/verify.md` when present

**Roster:** grok-4.5 (this edit).

**RED (v1.1.1).** The skill starts the app from `project.md` **Run locally
(dev)** only. A repo that already has `docs/agents/verify.md` (Launch / Doctor /
Drive / Evidence) is treated as if that file did not exist — the agent rediscovers
commands and can skip the persist check the recipe named.

**GREEN:** IF `docs/agents/verify.md` exists, Launch and Doctor from it before
checklist items; Drive matching Feature sections; Evidence includes that file's
persist check. IF missing, continue from **Run locally** and **name**
`/cmk:repo-config` once (Decision M) — never invoke it.

**Observed (grok-4.5, fixture `notegreen`).** PLAN.md first action was read
`docs/agents/verify.md` for Launch/Doctor; third action mapped the
create-note persist-reload check. Did not invent a start command from
memory.


## Description routing after the cmk rename (2026-10-19)

`skill-fixtures/bin/trigger.py` (claude.ai session auth), all 93 skills installed, sonnet; baseline the jdk set.

- acc1 "LATEFEE is built. Before we call it accepted, drive it through the running service…": 1/1 (jdk fired validate-api)
