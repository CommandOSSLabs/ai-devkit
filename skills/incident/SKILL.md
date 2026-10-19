---
name: cmk:incident
description: Use when a failure is reported on a deployed environment — production, staging, or a remote dev — and the red signal must come from live telemetry or a non-prod replay (OpenObserve, traces, spans, request id, error rate, incident, crash-loop, 500/502) rather than a local debugger. Produces a remote evidence pack and, when impact warrants it, a human-executed containment brief — separate from causal proof. Not for a failing local test or CI job (cmk:debug). Not for asking whether production tracing is complete enough (cmk:observability).
version: 1.1.2
---

# Incident

The remote evidence plane for a deployed failure. Investigation after the
pack exists is `cmk:debug`. This skill builds the pack and forbids the
**agent** writing the environment. Human-executed containment: see
**Containment vs cause** (one home).

## The Iron Law

```
NO WRITES TO A DEPLOYED ENVIRONMENT
NO MUTATING REPLAY AGAINST PRODUCTION
```

Read-only on `development` / `staging` / `production` that already serve
users or shared data. A `POST` that creates carts, charges, or side effects
is a write — including via `kubectl port-forward` onto that environment.
Promotion and hotfix exceptions: `references/evidence-pack.md` § Promotion (one home).

<HARD-GATE>
Do not `kubectl exec`, `kubectl set image`, `docker push` to a live
namespace, SSH, restart a prod pod to install logs, or raise log level on
a shared environment as the investigation. Temporary `[DBG-…]` probes
start in a local or dedicated checkout, never on the reported environment.
</HARD-GATE>

## Evidence pack — REQUIRED shape

Write every slot. Unknowns stay `unresolved`. WHEN filling Identity,
Phase 1, Trace/log join, or Access, load `references/evidence-pack.md` — slot
Done-when, join codes, and backend query shapes live only there.

```markdown
# Remote evidence pack — <env> <symptom>

## Identity
- Environment: <development | staging | production>
- Image / version: <tag or unresolved>
- Sampling: <head ratio / tail / none / unresolved>
- Backend: <product + base URL or unresolved>
- Deploy marker: <what shipped when, or unresolved>

## Phase 1 signal
- Command: <literal read-only query or non-prod curl>
- Red output: <paste or "not run — <why>">
- Kind: <telemetry-query | black-box-non-prod | captured-replay-local>

## Trace / log join
- Request or trace id: <id or none>
- Query result: <hit | empty-sampled | empty-unknown>
- Logs carry trace_id?: <yes | no | unresolved>

## Access
- `docs/agents/project.md` remote-env block: <present | missing>
- If missing: named `/cmk:repo-config` (do not invent URLs)

## Refusals
- <commands not run, and why>
```

## Which Phase 1 signals count

A remote Phase 1 command is red **now** for this symptom and can go green
when the cause is gone, **without writing the reported environment**.

Valid:

1. Read-only telemetry: error rate, `span_status = ERROR`, log filter on
   the request id, black-box probe that does not mutate (GET/health).
2. `curl` / replay against **local** or a **non-prod** copy you are
   allowed to dirty.
3. Replay of a captured payload from logs/HAR on that non-prod copy.

Invalid (recorded S4 failure):

- `kubectl port-forward` + N× `POST` against **production**
- `kubectl logs` **alone** as the loop (history does not go green)
- An empty trace search used as “cannot reproduce”
- OpenObserve / traces treated as *never* a signal (5% head sample can
  miss one id; an **error-rate** query in the window still can be red)

Empty `trace_id` search: `empty-sampled` when head/tail sampling can
explain it; `empty-unknown` otherwise. Neither is a close.

Missing remote-env config: name `/cmk:repo-config` once; continue with
user-supplied read URLs; leave the rest `unresolved`.

## After the pack

*Done when:* every slot is filled and a Phase 1 command has been **run**
(or the pack lists what could not be built). Then REQUIRED SUB-SKILL:
use `cmk:debug` — this pack **is** Phase 1. Do not rebuild a mutating
prod loop.

## Containment vs cause (orthogonal)

Pack completion is not causal confirmation. Confirmed cause is not required
before a human may contain impact. Presenting the brief below is not an
agent write.

WHEN active impact warrants containment, write every slot:

```markdown
## Containment brief (human-executed)
- Who executes: <named human / on-call — not the agent>
- Action: <runbook traffic-shift | rollback | …>
- Intended effect: <impact / risk reduction>
- Reversibility: <how to undo>
- Causal claims: <remain open — list live hypotheses or "open">
```

Do not tell the human to wait for `cmk:debug` or a confirmed cause before
containment may be discussed. Do not treat containment success as accepted
cause. Causal disposition: REQUIRED SUB-SKILL: use `cmk:debug`.

## Rationalizations

| Thought | Reality |
|---|---|
| "The 12% 500 *is* the red signal — exec and log" | Rate is a symptom. The loop is a command you run that can go green |
| "Phase 3 allows `[DBG-…]` — do that on prod" | Probes start local. Prod is read-only |
| "port-forward + 100 checkouts is just curl" | A mutating `POST` on production is a write |
| "No trace = cannot-reproduce / not a bug" | Head sampling and missing `trace_id` on logs explain a miss |
| "OpenObserve is never Phase 1" | A read-only error-rate / ERROR-span query is a valid remote loop |
| "Phase 4 — laptop green — kubectl set image" | Phase 4 re-runs the **original** symptom on a non-prod copy first |
| "Staff lead / Legal / I'll take the blame" | Hotfix exception is human-executed, not agent `kubectl` |
| "project.md has no remote block — invent the URL" | Name `/cmk:repo-config`; unknown fields stay `unresolved` |
| "Only builds the pack — refuse containment framing until cause is confirmed" | Pack is the evidence product; human-executed containment may be presented now; cause stays open |
| "Pack done = cause confirmed / open the corrective fix" | Pack is Phase 1 only; hand off to `cmk:debug` |

## Red Flags — stop

- About to `exec` / SSH / `set image` / restart to add logs
- About to `POST` a checkout, payment, or write against production
- Closing because a single `trace_id` search was empty
- Shipping a laptop image to production
- Calling the work `cmk:debug` Phase 3 so the Iron Law "doesn't apply"
- Telling the human to wait for confirmed cause before any containment discussion
- Treating pack completion as agent-confirmed cause or a corrective fix

## User signals — back to the pack

| The user says | It means |
|---|---|
| "Stop guessing" / "Don't touch prod" | You left the evidence plane — rewrite the pack |
| "Is that actually happening?" | Empty trace is not a close; run a valid Phase 1 command |
