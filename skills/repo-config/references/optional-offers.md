# Optional offer — Context7 MCP

Load this file **only when Step 5 (Offer Context7 MCP) runs**.

The skill set installs nothing into the repo beyond the `docs/agents/` config — no linters, no CI steps, no git hooks, no session-start hook.

**Context7 MCP — for live library docs.** Several skills reason about third-party libraries — `cmk:research` when a question turns on how a library behaves, `cmk:design` when the reuse ladder reaches a new dependency. Left to training knowledge alone, an agent cites versions and APIs that may be months stale. Recommend the user install the **Context7 MCP server**, which serves current, version-specific documentation from the source; explain that the library skills prefer it when present and fall back to fetching official docs when it is absent. It is an agent-environment tool, not a repo file: for Claude Code add it to the project's `.mcp.json` (or the user's MCP config); for another harness (Kimi, Codex, …) add it to that harness's MCP configuration. When the user opts in, record it in `docs/agents/project.md` (a one-line "Library docs: Context7 MCP (preferred)" note) so the skills know to reach for it. This is a recommendation only — never block setup on it, and do not attempt to install or authenticate it yourself.
