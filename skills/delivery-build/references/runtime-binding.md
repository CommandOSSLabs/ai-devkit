# Runtime binding and lease preflight

Loaded from `SKILL.md` **Runtime binding and lease preflight** after session
preflight and before the first dispatch (or, on the inline route, before the
first production edit). Planning artifacts remain portable; the runtime
snapshot records what this session can really do.

Write `.skills/<CODE>/execution-session.json` with at least:

```json
{
  "schema_version": 1,
  "harness": "unknown",
  "provider": "unknown",
  "model": "unknown",
  "resume_context": "supported|unsupported|unknown",
  "fork_context": "supported|unsupported|unknown",
  "worktree_isolation": "supported|unsupported|unknown",
  "cache_control": "none|implicit|explicit|unknown",
  "token_telemetry": "none|aggregate|per_turn|unknown",
  "pricing_policy": {
    "source_url": null,
    "observed_at": null,
    "threshold_basis": "input_tokens|prompt_tokens|context_tokens|unknown",
    "repricing_scope": "all_request_tokens|marginal_tokens|flat|unknown",
    "tiers": []
  },
  "effective_concurrency": null,
  "rotations": []
}
```

Use capability facts exposed by the active harness/API. Record `unknown` when a
fact is unavailable; never infer support from a harness name, a model family,
or a cache key. If binding is ambiguous in a way that changes safety or cost,
ask once and persist the answer before dispatch.

Before every worker or reviewer resume, calculate the next-request estimate from
system instructions, tool schemas, retained history, feature capsule, task
delta, cache estimate, and output reserve. Rotate the lease before dispatch if
any hard trigger holds:

- the semantic unit ends or the next task materially changes required context;
- the projected request exceeds the active context safety reserve;
- the provider/model pricing policy predicts an all-token cliff, or continuing
  costs materially more than a fresh role context;
- compaction, harness change, broad scope/invariant change, or context confusion
  invalidates the retained context.

When `pricing_policy` is unknown, use the configured conservative budget and
record the decision as unknown-policy; never invent a provider threshold. Add a
rotation record with reason, previous lease ID, next lease ID, projected input
tokens, and policy/source reference. A fresh context receives the feature
capsule and task delta, not the entire prior transcript.

If a ready set cannot safely fan out because `worktree_isolation` is unsupported
or surfaces overlap, set `effective_concurrency` to one and record the
degradation. Never increase concurrency beyond the approved plan.
