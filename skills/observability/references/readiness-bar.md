# Readiness bar — pass / fail rules

Load from `SKILL.md` when filling Must rows. Backend-neutral. OpenObserve
snippets are examples.

## Must rows

| Row | `pass` when | `fail` when |
|---|---|---|
| Identity `service.name` | A read of recent resources shows a stable name, never `unknown_service*` | Any recent export is `unknown_service*` |
| `service.version` | Version matches a deploy id (semver, git, image tag) | Missing or not correlatable |
| `deployment.environment.name` | Values are `development` / `staging` / `production` / `test` | Missing; prod and staging indistinguishable |
| W3C `traceparent` | Child services share `trace_id` with the entry span | Broken traces at hop boundaries |
| Current HTTP/RPC/DB semconv | Attributes use `http.request.method`, `http.response.status_code`, … (or documented `http/dup`) | Only pre-v1.23 names with no opt-in |
| SERVER 4xx unset | A 404 SERVER span has status Unset | 4xx stamped Error "to find them" |
| Logs carry TraceId/SpanId | Request-path logs include both (or backend-mapped fields) | Logs exist with no join |
| Golden signals | Latency, traffic, errors, saturation each have a query | Traces-only with no SLI |
| Sampling keeps rare errors | Policy is written **and** (no sample, or tail keeps ERROR/slow, or 100%) | Head-only on high QPS with no tail |
| Backend search | Can filter `trace_id`, `service.name`, error/status | Traces unsearchable |
| PII | URL credentials redacted; headers opt-in | Secrets or raw auth in spans/logs |
| Black-box probe | External check of the user path exists | White-box only |

`unresolved` = the proving read was not run. `unresolved` on a Must row
makes the verdict `not-complete`.

## OpenObserve (example reads)

Use only when `project.md` names this backend:

```text
span_status = "ERROR"
# resource: service.name, deployment.environment.name
```

Log↔trace join is **not** automatic — org settings must map Trace ID /
Span ID field names. Service Graph is Enterprise; do not require it.
`ZO_PROF_*` profiles OpenObserve itself, not the app — not a Profiles pass.

## Not-must

OTel Profiles is Alpha (not for critical prod). A missing profile store
is not a Must fail. If the question is "which function on CPU", name
Pyroscope / pprof / eBPF as a **Should** follow-on.

## Disposition of a fail

One `cmk:scope` or `cmk:amend` per row (or a small epic that still
lands one row at a time). Promotion stays local → dev → staging → prod.
This skill does not implement the rows.
