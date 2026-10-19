# Run file schema (v2)

Load when authoring or validating a cmk:dogfood-plan run file. One JSON file per run holds
the authored cases **and** the verdicts, so what the agent records is what the
person reads.

## Path

`.skills/<CODE>/dogfood.json`

## Shape

```json
{
  "version": 2,
  "rev": 0,
  "feature": "notes",
  "slug": "notes",
  "title": "Notes App — Dogfood",
  "origin": "http://localhost:5173",
  "intro": "Local app: http://localhost:5173. API: http://localhost:3001.",
  "sections": [
    {
      "name": "Create & persist",
      "cases": [
        {
          "id": "CASE-1",
          "req": "NOTE-1.1",
          "kind": "happy",
          "title": "Create a note",
          "setup": "empty notes list",
          "try": "Open app → New note → title Alpha, body hello → Save.",
          "expect": "Note \"Alpha\" appears in the list with body preview \"hello\".",
          "backend": "GET /api/notes includes title Alpha",
          "run":   { "verdict": "pending", "saw": "", "server": "", "notes": "" },
          "human": { "checked": false, "at": "", "comment": "" }
        }
      ]
    }
  ]
}
```

## Required top-level

| Field | Type | Notes |
|---|---|---|
| `version` | `2` | Only version supported; v1 cases YAML is not readable |
| `rev` | integer | Bumped on every write; defaults to `0` |
| `feature` | string | Short label |
| `slug` | string | Path stem for the guide, report, and pidfile names |
| `title` | string | Human guide H1 |
| `origin` | string | Local app origin, e.g. `http://localhost:5173` |
| `intro` | string | Optional multi-line intro |
| `sections` | list | Non-empty |

## Authored per case — write these

| Field | Notes |
|---|---|
| `id` | Stable, unique (`CASE-1`) |
| `req` | Requirement id (`NOTE-1.1`) |
| `kind` | `happy` \| `edge` \| `error` \| `nonbehavior` \| `persist` \| `visual` \| `journey` |
| `title` | Human label |
| `setup` | Independent precondition |
| `try` | Copy-pasteable steps |
| `expect` | What the user must see (grounded) |
| `backend` | Server assertion, or the literal `presentational` |

## Run state per case — the CLI fills these

Both blocks are created for you when absent, so an authored file needs neither.
Their key names never overlap, and that is load-bearing rather than cosmetic: it
is what lets a person's tick and an agent's verdict be written concurrently
without either clobbering the other.

| Block | Fields | Written by |
|---|---|---|
| `run` | `verdict` (`pending`/`pass`/`fail`/`blocked`), `saw`, `server`, `notes` | the agent, via `dogfood mark` |
| `human` | `checked`, `at`, `comment` | a person, via the served guide |

A `human` tick records that someone looked. It never becomes a `verdict`, it
never advances `dogfood next`, and no flag makes it evidence — see
`docs/decisions/0006-human-ticks-are-recorded-never-authoritative.md`.

## CLI

Every subcommand takes the one run file.

```bash
DF="python3 skills/acceptance/write-dogfood/scripts/dogfood"
RUN=.skills/<CODE>/dogfood.json

$DF list   $RUN
$DF show   $RUN CASE-1
$DF init   $RUN                      # seed pending in place; --force to reset
$DF next   $RUN                      # first case whose verdict is not pass
$DF mark   $RUN CASE-1 pass --saw 'list shows "Alpha"' --server 'GET /api/notes includes Alpha'
$DF status $RUN
$DF report $RUN -o .skills/<CODE>/dogfood-report.md
$DF render $RUN -o .skills/<CODE>/dogfood.html
$DF serve  $RUN                      # optional live guide on 127.0.0.1:8787
$DF serve  $RUN --stop
```

`mark pass` refuses an empty `--saw` or `--server`. A `presentational` case
requires `--server 'none — presentational'`, and any other case is refused that
string.

Resolve the script relative to this skill package when installed via the skills
CLI (not only this monorepo path).
