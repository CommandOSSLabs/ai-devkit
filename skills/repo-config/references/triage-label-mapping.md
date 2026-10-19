# Triage label mapping recipe

Load this file **only when Decision B (Triage label mapping) runs**.

Explainer: `cmk:triage` moves issues through canonical roles, but it must apply the label strings this repo actually uses, or it will create duplicates.

The canonical roles — nine states and two categories:

| Role | Meaning |
|---|---|
| needs-triage | awaiting evaluation |
| needs-info | waiting on the reporter |
| ready-for-agent | fully specified; an agent can pick it up cold |
| ready-for-human | needs human judgment or access |
| shaping | its spec or root cause is being written |
| building | claimed; a build is running on it |
| in-review | its pull request is open, waiting on a person |
| shipped | closed and in a release |
| wontfix | will not be actioned |
| bug | something is broken |
| enhancement | new capability or improvement |

List the tracker's existing labels next to the roles and propose a mapping (default: each role's string equals its name; `status:<role>` for the four newer states `shaping`, `building`, `in-review`, `shipped`); the user confirms it. For any mapped label the tracker does not have yet, offer to create it — only with the user's explicit consent. For local trackers, the role names themselves are the vocabulary; defaults are fine. For **linear**, list the team's existing workflow states and labels first (via the MCP server or API), then map the state roles to Linear workflow states where one fits (e.g. `ready-for-agent` → a "Todo"/"Ready" state, `wontfix` → a "Canceled" state) and the category roles (`bug`/`enhancement`) to Linear labels.
