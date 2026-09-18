---
name: cmk:trace-audit
description: Use when the user asks to "check the docs are consistent", "audit traceability", "do the requirement IDs still line up", "check the capability registry", "find orphan docs", or before claiming tracked work is ship-ready — and as the mechanical docs check `cmk:delivery-review` and `cmk:delivery-ship` run. Reports referential integrity across `docs/requirements/`, `docs/design/`, and `docs/capabilities/INDEX.md`. Docs-only: never searches application source or tests.
version: 0.1.1
---

# Trace Audit

The vertical layer of the docs tree: do the acceptance-criterion IDs, the design
documents that cite them, and the capability registry still agree?

Not a discipline — a fixed sequence of text-search passes with a fixed rule on
their output.

## References

Read `references/passes.md` before reporting anything. It is the **one home**
for the passes, their exact patterns, and the rule that turns their output into
findings.

## Scope

- **Reads:** `docs/requirements/**`, `docs/design/**`, `docs/capabilities/INDEX.md`.
- **Never reads:** application source, tests, commit messages, the tracker.
- **Reports:** referential integrity only — does a cited ID exist, is it defined
  once, does a registry row point at a real file.
- **Never judges:** whether a design section genuinely satisfies the criterion it
  cites. That reading is `cmk:delivery-review`'s, and keeping it out of here is
  what makes this pass deterministic.

## Findings

| Code | Severity | Meaning |
|---|---|---|
| **E1** | error | a design document cites an ID defined in no requirements document |
| **E2** | error | the same ID is defined twice |
| **E3** | error | the same capability code appears on two registry rows |
| **E4** | error | a registry row points at a document that does not exist |
| **W1** | warning | a criterion in an `active` requirements document is mapped by no design document |
| **W2** | warning | a requirements or design document has no registry row |
| **W3** | warning | a document is missing a required header line |

An ID retired by strikethrough (`~~**SPKN-1.2**~~`) counts as **undefined**.
That is the point: the moment a criterion is retired, every design section still
citing it surfaces as **E1**. Retirement cannot be done quietly.

## Workflow: Audit

1. Run the passes in `references/passes.md`, in order, exactly as written.
2. Apply the finding rules to their output. Do not interpret; the rules are
   mechanical so that two runs on one tree agree.
3. Report findings grouped by code, each naming the file, the line, and the ID
   or row involved. Report `no findings` explicitly when there are none — a
   silent pass is indistinguishable from a skipped one.
4. State what was **not** checked: no source, no tests, no semantic judgement.

If `docs/capabilities/INDEX.md` is absent, run the ID passes and skip the
registry passes, reporting the skip. An absent registry is a supported state,
not a finding.

## Workflow: Gate

When called before shipping tracked work:

1. Run Workflow: Audit.
2. **Any error blocks ship-readiness.** Report the errors and stop; do not
   proceed to a ship claim.
3. **Warnings never block on their own.** Report them and continue.
4. Where an error is a deliberate in-flight state, the disposition is recorded
   on the owning issue by `cmk:delivery-workflow` — not waived here.

## Output

- Findings grouped by code, each with file, line, and the ID or code involved
- An explicit `no findings` when clean
- An explicit statement of what was not checked
- Byte-identical output across two runs on one unchanged tree

## Red Flags

- Reporting a finding the passes did not produce
- Judging whether a design "really" satisfies a criterion
- Searching application source or tests for requirement IDs
- Treating an absent registry as an error
- Waiving an error here instead of recording its disposition on the issue
- Silently passing without saying so

## Rationalizations

| Thought | Reality |
|---|---|
| "The ID is obviously the same requirement, just renumbered" | Renumbering is what the immutability rule forbids. Retire by strikethrough and let E1 surface the citations. |
| "W1 is noise — designs cover it in prose" | W1 says a criterion has no mapped design section. Prose similarity is not a mapping; add the `Satisfies:` line. |
| "One error, everything else is green — ship it" | Errors block ship-readiness. Fix it or record the disposition on the issue. |
| "I'll grep the tests too, to be thorough" | Docs-only by design. Test-side coverage is the tracker's and the review's job; widening the pass costs the determinism that makes it worth running. |
| "Registry is missing, that's a finding" | Absence is supported. Skip the registry passes and say so. |
