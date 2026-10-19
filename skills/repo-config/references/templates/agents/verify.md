# Verify / control — cold-start drive recipe

Written by `cmk:repo-config` (Decision M). Read by `cmk:acceptance`,
`cmk:acceptance-ui`, `cmk:acceptance-api`, and `cmk:dogfood-plan`. A later agent that has
never seen this app follows this file instead of inventing commands.

**App:** `<name>`
**Primary surface:** `<web UI | CLI | API | desktop | other>`
**Other surfaces:** `<none | list>`

## Launch

Start command (must match `docs/agents/project.md` **Run locally (dev)**):

```
<command>
```

Ready when: `<log line | port answering | prompt>`.
Teardown: stop the PID/process this Launch started — never kill by process name.

## Doctor

One read-only check: is this instance worth driving?

```
<command — health URL, port owner, version, auth>
```

Pass: `<observable>`. Fail: do not Drive; fix Launch or record the blocker.

## Drive

Harness: `<kimi-webbridge | curl | PTY | other>` with **stable handles** (ARIA /
data attributes / prompt strings / routes), not coordinates.

Isolation: `<two instances can run | refuse to double-drive a shared instance>`.

## Evidence

Keep under `.skills/verify/` (gitignored). A proof captures **the action and
the resulting state**, including a **reload / re-open / re-read** when the
feature claims persistence. A final screen alone is not enough. Mocks only at
a production boundary.

Cleanup never deletes evidence.

## Cleanup

Stop what Launch started. Remove scratch the run created. Leave `.skills/verify/`.

## Features

Index (top 3–5 to start):

| Feature | How a user reaches it | Observable end state |
|---|---|---|
| `<name>` | `<route / command>` | `<including persist check>` |

### `<feature-1>`

- **Sub-features:** `<or none>`
- **How to get to it (user POV):** `<steps>`
- **Driving it with `<harness>`:** `<exact locators or commands>`
- **Gotchas:** `<auth, seed, flags>`
- **Persist check:** `<reload / re-open / re-read — or presentational, no store>`
