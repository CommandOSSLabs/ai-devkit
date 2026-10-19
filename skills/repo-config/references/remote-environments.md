# Remote environments recipe

Load this file **only when Decision K (Remote environments) is offered**.

Explainer: `cmk:incident` and `cmk:observability` read a **Remote environments** table from `docs/agents/project.md` so they can query telemetry without inventing URLs or tokens. If this repo has no deployed env, skip.

Confirm, one row per environment the user names (`development`, `staging`, `production`):

- Deployed? yes / no / unknown
- Backend product (OpenObserve, Jaeger, Grafana, other) + base URL + org
- One **read** query that proves access (error-rate or `span_status=ERROR` shape — not a write, not a token)

Recommend skip unless they already have a backend. Tokens never go in the file.

Write step (Step 4, item 10): if decision K (Remote environments) was confirmed, merge the **Remote environments** table into `docs/agents/project.md` from `references/templates/agents/project.md` (additive). If skipped, write `None — not deployed` or omit the section.
