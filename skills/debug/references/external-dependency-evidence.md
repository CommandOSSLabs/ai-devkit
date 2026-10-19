# External dependency evidence (after Phase 2, before Phase 3)

Runs only when the minimized failure path crosses a versioned external
dependency — a library, framework, SDK, database, cache, search/observability
platform, cloud service, external API, CLI, provider distribution, or
protocol. The Phase 1 signal and Phase 2 minimal repro remain the gate;
documentation never replaces either.

1. **Runtime identity.** Capture product, distribution/provider, server/runtime
   version, client/SDK version, topology/deployment mode, effective relevant
   configuration, and the exact error/output. The artifact cites the literal
   Phase 1 command and red output; a handoff claim that they ran is not evidence.
   Unknown fields stay `unresolved`.
2. **Owning documentation.** REQUIRED SUB-SKILL: use `cmk:research` for the exact
   failing concept. For libraries/frameworks/APIs, it resolves current
   documentation through Context7 first. Match the source to the observed
   version/provider; latest docs do not establish older-runtime behavior.
3. **Contract diff.** Produce this artifact before Phase 3:

| Surface | Actual runtime evidence | Official documented expectation | Applicability | Match |
|---|---|---|---|---|
| `<failing concept>` | `<captured value/error>` | `<owning-source behavior>` | `<matching version/provider, mismatch, or unresolved>` | `<yes, no, unresolved>` |

4. **History check.** When actual and current docs disagree, inspect the owning
   changelog, migration guide, deprecation notice, or official issue history for
   the observed version. A community answer may locate a source; it is not the
   evidence entered in the table.
5. **Claim status.** `match=no` becomes a hypothesis candidate, not a confirmed
   cause. `applicability=unresolved` blocks dependency-behavior claims; report the
   missing identity/source instead of filling it from model memory.

When runtime access or identity is unavailable, use this disposition verbatim in
the artifact:

```text
Runtime evidence unavailable: <missing access/artifact>.
Version-matched owning documentation cannot be resolved.
Current official documentation is reference only; applicability is unresolved.
Phase 3 external-behavior hypotheses are blocked pending: <required evidence>.
```

**Gate check:** the Phase 1 command/red output is cited; runtime identity is
explicit; an owning source is version-matched or explicitly unavailable; every
table cell is filled; and no Phase 3 hypothesis claims external behavior beyond
that artifact.
