# cmk:mcp-config

## What
Skill that establishes or audits a repo's checked-in Model Context Protocol
(MCP) server configuration: one shared server set every clone and agent
picks up, registered per agent vendor, with secrets kept out of the repo.

## Approach
Repo-level config (`.mcp.json` or vendor equivalent) is checked in;
user-level config stays personal and layers on top. Servers are chosen by
class of work — semantic code navigation, a tracker MCP for reaching
delivery state (canonical docs stay tracker-neutral per `docs/README.md` /
`cmk:docs`; enforceable standards live under `cmk:rule`), library docs —
never by name; examples are illustrative only. Each agent vendor keeps its
own registration mechanism, but all vendors point at the same checked-in
server set; secrets are environment-variable references, never inline.
Servers with interactive auth degrade gracefully in headless/CI runs, and
each server is documented as load-bearing or optional. Ends with a
`## Verify` section for report-only checks.

## Where
- Skill body: `skills/mcp-config/SKILL.md` — sections `Checked-in server
  set`, `Server classes worth wiring`, `Per-vendor wiring`, `Hygiene`,
  `Verify`.
