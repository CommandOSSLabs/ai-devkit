# Decision-record pass

Load when `.skills/decisions/` exists. Runs the shipped validator and merges its
lines verbatim; it emits no findings of its own.

finding set from every pass that ran remains unchanged.

When `.skills/decisions/` exists, run the shipped validator (path relative to this
skill set install, beside `cmk:verdict`):

```bash
sh cmk:verdict`'s `references/validate-records.sh --mode=audit-trace
```

Merge its diagnostic lines into the report **verbatim**. Exit code 1 → treat as
cmk:traceability errors (gate fail). Exit code 2 → decision-record passes **not-run**
(never "passed"). Exit 0 → no decision-record errors (warnings may still appear).

Do not reinterpret validator findings. **Crossing-without-record:** the validator
does not emit an automated finding for “a production crossing lacks a record,”
because it cannot tell skill-mediated verdicts from direct human action or
external contribution. If an agent or human notes such an absence, treat it as a
**warning-level concern only — never an error and never a cut-release/prove-claim gate
fail**. Do not reinterpret validator lines; the opening finding table still applies.
