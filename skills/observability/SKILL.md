---
name: cmk:observability
description: Use when production or staging telemetry may be insufficient — "is tracing complete", upgrade tracing, OpenObserve or OTLP enough, head vs tail sampling, span status, golden signals, log-trace join — and the deliverable is a readiness finding set, not an incident pack. Not for a live 500/trace hunt (cmk:incident). Not for a local failing test (root-cause).
version: 1.0.1
---

# Assess Observability

A readiness verdict for deployed telemetry. It does not investigate an
incident (`cmk:incident`) and it does not write Hybrid 1A canonical
docs (`/cmk:system-docs`).

## The Iron Law

```
NO COMPLETENESS STAMP WITHOUT A GREEN FINDING SET
NO CANONICAL OPS OR STANDARDS FILE FROM THIS SKILL
```

"We export OTLP to OpenObserve" is not complete. `Status: Approved` or
"production observability is complete" on a Hybrid 1A path is a stamp.
This skill never writes `docs/ops/observability.md` or
`docs/rules/common/observability.md`.

<HARD-GATE>
Do not PR a one-liner (4xx → span Error, blanket `RecordException`,
raise head sample "for the board") as the completeness close. Each
failed row is a tracked change via `cmk:scope` or `cmk:amend`.
Promotion: `references/readiness-bar.md` § Disposition (one home).
</HARD-GATE>

## Finding set — REQUIRED shape

Write every row. Unknowns stay `unresolved`. Verdict is `not-complete`
unless **every Must row is `pass`**. `pass` requires a proving **read**
(query, resource dump, probe) — not "we installed the backend."

```markdown
# Observability readiness — <date>

## Verdict
<complete | not-complete>

## Must
| Row | Result | Evidence | Tracked change |
|---|---|---|---|
| Identity `service.name` not `unknown_service*` | pass/fail/unresolved | <read> | <none \| frame-change/amend-feature> |
| `service.version` deploy-correlatable | | | |
| `deployment.environment.name` set | | | |
| W3C `traceparent` across hops | | | |
| HTTP/RPC/DB spans use current semconv | | | |
| SERVER 4xx status left unset | | | |
| Logs carry TraceId/SpanId | | | |
| Golden signals (latency, traffic, errors, saturation) | | | |
| Sampling policy written; rare errors kept (tail or 100%) | | | |
| Backend can search trace_id / service / error | | | |
| PII: no credentials in urls; headers opt-in | | | |
| Black-box probe of the user path | | | |

## Should (do not block complete)
| Row | Result | Evidence |
|---|---|---|
| `service.instance.id` | | |
| Collector in front (redact / tail) | | |
| Deploy markers on dashboards | | |
| RUM if the failure can start in the browser | | |

## Not-must / Access
- See `references/readiness-bar.md` (Profiles are not-must).
- `docs/agents/project.md` Remote environments: <present | missing>
- If missing: named `/cmk:repo-config` once
```

WHEN scoring a Must row, load `references/readiness-bar.md` — pass/fail rules and
backend examples live only there.

## After the set

- `not-complete`: do not stamp. Each `fail` row is one change
  (`cmk:scope` / `cmk:amend`). Do not batch them into a live
  prod patch.
- `complete`: still do not write the Hybrid 1A file. Suggest
  `/cmk:system-docs ops/observability` so the map can be Approved
  there.
- A live symptom appearing during the assess: REQUIRED SUB-SKILL: use
  `cmk:incident` — this skill stops.

## Rationalizations

| Thought | Reality |
|---|---|
| "OpenObserve is on — stamp Approved / complete" | A backend is a row, not the verdict |
| "Legal / VP / standup — write the complete doc" | A false stamp is worse in the room than a short not-complete set |
| "I'll write Draft to docs/ops/observability.md" | Canonical path is `/cmk:system-docs`; this skill writes the set only |
| "404s don't show — set SERVER Error on all 4xx" | SERVER 4xx MUST stay unset; that is a fail row, not a close |
| "5% head sample is traces on" | Rare errors are dropped; tail or 100% is the Must |
| "One-liner now, assess later" | The one-liner becomes the stamp |
| "This is an incident — cmk:incident" | No live 500; readiness first |

## Red Flags — stop

- About to write `Status: Approved` or "observability is complete"
- About to create or clobber `docs/ops/observability.md`
- About to PR 4xx → Error or blanket exceptions "for the board"
- About to call head-only sampling complete on a high-QPS path
