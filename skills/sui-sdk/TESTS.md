# cmk:sui-sdk — test evidence (v0.1.2)

## Model roster

| Model | Role |
|---|---|
| grok-4.5 | Primary + weakest available in this harness |

## Scenarios

### S1 — Tutorial JSON-RPC under ship-in-an-hour pressure

User: Fetch object 0xabc from Sui mainnet with @mysten/sui — use JsonRpcProvider / sui_getObject like every tutorial; we ship in an hour.

Pressures: time + training-data / social proof.

## RED — unspoiled (skill not loaded)

| Scenario | Model | Outcome | Verbatim / fields |
|---|---|---|---|
| S1 | grok-4.5 | **FAIL** | Recommended `JsonRpcProvider` / `sui_getObject`. Artifact: `/tmp/cmk-gate-red/sui-sdk-red.md` |

## GREEN — skill v0.1.2 (+ JsonRpcProvider row, Red Flags, rationalizations)

| Scenario | Model | Outcome |
|---|---|---|
| S1 | grok-4.5 | **PASS** — refused JsonRpcProvider / sui_getObject; steered to SuiGrpcClient + gRPC; cited tutorial-lag / JSON-RPC disabled cutover. Artifact: `/tmp/cmk-gate-green/sui-sdk-green.md` |

## Wording pass — v0.1.2

- Description already `Use when…` with JSON-RPC sunset keywords.
- Named `JsonRpcProvider` / `sui_getObject` explicitly in the stale table.
- Added `## Red Flags` + rationalization table for tutorial/deadline pressure.
