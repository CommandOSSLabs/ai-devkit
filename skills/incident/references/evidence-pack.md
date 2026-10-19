# Remote evidence pack — slot rules

Load from `SKILL.md` when filling the pack. Backend-neutral: the command is
whatever this repo's remote-env block names. OpenObserve snippets are
examples, not a vendor lock.

## Identity

| Field | Done when |
|---|---|
| Environment | One of `development`, `staging`, `production` (OTel `deployment.environment.name`) |
| Image / version | Running tag/digest, or `unresolved` |
| Sampling | Head ratio, tail policy, or `none`; from env/`project.md`, or `unresolved` |
| Backend | Product + org + base URL from `docs/agents/project.md` **Remote environments**, or `unresolved` |
| Deploy marker | What shipped at the symptom start, or `unresolved` |

`service.name` / `service.version` on the resource are how queries stay
scoped. If they are unknown, write `unresolved` — do not invent.

## Phase 1 kinds

**telemetry-query** — HTTP GET or SQL/filter that cannot create user
data. Must be red for *this* symptom (error count, `span_status`, log
line for the request id).

**black-box-non-prod** — probe against local/`dev`/staging that you may
dirty. Prefer the same path the user reported.

**captured-replay-local** — HAR/log payload replayed on a local process
or a disposable env, never as a 100× spray on production.

`kubectl logs` can *supply* a payload for replay. It is not itself the
loop: old lines do not go green when the fix lands.

## Trace / log join

| Result | Meaning |
|---|---|
| `hit` | A span or correlated log exists for this id |
| `empty-sampled` | Sampler or missing log `trace_id` can explain the miss |
| `empty-unknown` | Sampler unknown or should have kept this id (tail-keep-errors, 100% sample) |

`empty-sampled` and `empty-unknown` keep the incident open. Next Phase 1
is an error-rate query or a non-prod replay, not a close.

## Example read-only queries (OpenObserve)

Use only when the remote-env block says the backend is OpenObserve.
Replace host, org, stream, window.

```text
# Error spans in the incident window (filter UI / search API)
span_status = "ERROR"

# A known request id if logs mapped Trace ID / Span ID
trace_id = '<id>'
```

OTLP HTTP ingest (not a debug write): `POST /api/<org>/v1/traces` is
how apps send data. Do not POST traces from the agent as a probe.

Jaeger / Tempo / Grafana: same slots; the literal query comes from
`project.md`, not from this file.

## Access

If `docs/agents/project.md` has no **Remote environments** table, name
`/cmk:repo-config` once. Suggested table the wizard should grow (this
skill does not write it):

```markdown
## Remote environments

| Environment | Deployed | Backend | Read query |
|---|---|---|---|
| production | yes | OpenObserve https://oo.example.com org=default | span_status = "ERROR" |
```

Auth tokens never go in the pack or in git. "Where the operator gets a
token" is enough.

## Promotion

After `cmk:debug` + `cmk:tdd` locally: merge to `dev`, deploy
staging, re-run the **original** Phase 1 symptom there, then production
by the team's release path. The agent does not `kubectl set image` on
production. A named human hotfix is outside this skill.
