# Core and packs

The kit ships a **core** set every vendored repo gets, and **packs** a repo opts into (ADR
0001 decision 5). Only installed skills cost description tokens on every turn, so a repo
takes a pack when its work needs it, not by default.

## Packs

| Pack | Skills | Take it when |
|---|---|---|
| `roadmap` | `cmk:roadmap`, `cmk:roadmap-status`, `cmk:milestone-review`, `cmk:progress-chart` | Work is planned as milestones (`docs/roadmap/`) |
| `acceptance` | `cmk:acceptance`, `cmk:acceptance-api`, `cmk:acceptance-ui`, `cmk:dogfood-plan`, `cmk:dogfood-run` | Features are accepted by driving the running product |
| `ui` | `cmk:ui-brief`, `cmk:ux-brief`, `cmk:ui-review` | The repo renders a UI people use |
| `ops` | `cmk:incident`, `cmk:observability`, `cmk:delivery-remote` | Something is deployed and on call, or builds run on a remote host |
| `quality` | `cmk:debt`, `cmk:architecture-scan`, `cmk:pivot`, `cmk:shipped-audit` | The team tracks debt and audits what shipped |
| `project` | `cmk:vision`, `cmk:system-docs` | The repo keeps product vision and system docs |
| `maintainers` | `cmk:skill-authoring`, `cmk:retro` | The repo writes or tunes its own skills |
| `extras` | `cmk:prompt`, `cmk:goal`, `cmk:problem`, `cmk:pathfind` | Operators want the prompt, goal and problem-framing tools |

Every other skill under the kit's `skills/` is **core**.

## Choosing at vendor time

`init` vendors core plus the packs the user names; propose a pack only from evidence in the
repo (a `docs/roadmap/`, a UI framework, a deploy workflow). `update` adds a pack's skills when
the user asks for one, and removes a pack only on their word. Record the choice in
`.agents/skills.lock`:

```toml
[packs]
installed = ["ui", "ops"]
```

`cmk:sync` then brings in new upstream skills of core and of the installed packs only.

## A core skill naming a pack skill

A core skill reaches a pack skill only when it is installed — "with `cmk:incident`
installed, REQUIRED SUB-SKILL: use `cmk:incident`; without it, …" — and says what to do
without it. `scripts/skill-lint.sh` in the kit fails a `REQUIRED SUB-SKILL` line in a core skill
that names a pack skill without that condition.
