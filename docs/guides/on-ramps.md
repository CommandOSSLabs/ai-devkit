# On-ramps

**One home** for which `cmk:*` skill starts a situation. Root agent instructions
point here; they do not restate this table.

| Situation | Start here |
|---|---|
| Brand-new / adopt / verify repo facets | `cmk:repo-setup` |
| Docs tree missing or drifted | `cmk:docs` |
| Save / draft product requirements; close package; AC + guards | `cmk:requirements` |
| How to build it (mechanism, architecture) | `cmk:design` |
| Record a hard-to-reverse decision | `cmk:adr` |
| Lock a term / vocabulary drift | `cmk:glossary` |
| Capture a gotcha | `cmk:learn` → promote with `cmk:rule` when it must be enforced |
| AI navigation map under `docs/ai/` | `cmk:codebase-docs` |
| Uncertain body of work → issue set | `cmk:discover-efforts` |
| Start / pick up a tracker issue | `cmk:delivery-intake` (or `cmk:delivery-pipeline` end-to-end) |
| Spec + plan for a ticket | `cmk:delivery-spec-plan` |
| Review diff / PR | `cmk:delivery-review` |
| Open PR / close ticket with evidence | `cmk:delivery-ship` |
| Handoff to another agent | `cmk:delivery-handoff` |
| Vendor skills / sync upstream | `cmk:agent-vendors` / `cmk:sync` |
| Create / edit / review a `cmk:*` skill | `cmk:write-cmk-skill` (user-invoked) |
| CI / local stack / MCP / toolchain alone | matching setup facet (`cmk:cicd`, `cmk:local-stack`, …) |

Rules of thumb:

> Never draft `docs/requirements/` from a bare label — close package first (`cmk:requirements`).

> State **scope band** before implement; meet **docs-ready** (`cmk:delivery-workflow`).

> When two skills both seem to apply, the delivery / process skill wins; it will call the docs skill.
