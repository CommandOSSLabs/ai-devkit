# Unblocking

WHEN a case is `blocked`, or a shared precondition (login, app down, seed)
blocks several — read from `run-dogfood/SKILL.md` § 4.

Build the missing precondition yourself on the local origin. A case stays
`blocked` only for the human-only list at the bottom. Clear a shared blocker
before single-case ones, because it unblocks every case that depends on it.

| Missing | Build it with the first rung that works |
|---|---|
| The app is down | Start it (`docs/agents/project.md`, `## Run locally (dev)`). A crash on start is a product defect: go to `references/failure-routing.md`. |
| A schema or migration | Run the repo's migrate command against the local DB. If code expects a column that no migration creates, that is a product defect. |
| Data in a given state | Create it through the app's own UI or API. Else use the repo's seed or fixture scripts. Else insert directly into the local store. Local dev store only. |
| An account or role | Create a local test user through the app's admin path, a seed script, or the local DB. Never reuse or change a real person's account. |
| Local config (env var, feature flag, mailer) | Set it in a local-only, untracked env file. Use a local stand-in the repo already supports or documents, such as a dev mail catcher or a log transport. Never point at a real external service, and never commit a secret. |
| A browser driver | No webbridge binary → Chrome extension tools. Neither connected → human-only. |
| A native `alert` / `confirm` | Use the driver's dialog handling if it has one. Otherwise human-only. |

Prefer runtime setup over editing tracked files. Edit a tracked file (a seed
script, a config) only when no runtime path exists. Commit it separately from
product fixes, and list it under Notable changes in the close report.

Append every unblock to the case's notes: what was missing, the command or
request that built it, and how to undo it. The close report's "Why it was
blocked" and "Notable changes" sections are built from these lines.

Once unblocked, drive the case (§3 steps 1–6). A `fail` now goes to
`references/failure-routing.md`.

## Human-only — park, do not wait

Mark `blocked` with notes starting `PARKED — needs <the exact thing>`, then
continue with the other cases:

- a non-local origin with no in-thread yes that names it
- credentials, API keys, or secrets you do not have
- a real-world side effect: a payment, email or SMS to a real person, any
  production data
- a physical device, a second factor, a captcha
- no browser driver connected (relay the webbridge help page in the report)

A shared precondition on this list parks every case that depends on it. The run
then goes to §5 close. It does not wait for the person.
