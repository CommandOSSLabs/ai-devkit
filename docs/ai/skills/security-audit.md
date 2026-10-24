# cmk:security-audit

## What

Defensive, source-first security review of a codebase. It finds
vulnerabilities that violate a real trust boundary and hands owners the
source trace, a bounded local reproduction, a priority, and the smallest
source fix. Two modes: **guidance** (the default — a focused question, a
triage, one finding, no files written) and **full audit** (only on an
explicit audit, pen-test, or full-review request, or when report artifacts
are asked for).

## Approach

A full audit runs six phases: reconnaissance into an architecture summary
and a deterministic coverage ledger; coverage-led hunting waves by isolated
agents, closed by coverage critics; independent validation of every
candidate by an agent that did not find it; structured output to
`findings.json`; a fresh-eyes verification of every final record; and
target-neutral reports derived from the verified records only.

Three verdicts stay distinct: `confirmed` (complete source trace plus a
bounded observed result, the only verdict with severity), `needs_validation`
(a source-grounded hypothesis blocked on one exact fact, with a local or
owner-observed plan), and `rejected` (disproved, kept so later runs do not
repeat it). Severity never exceeds demonstrated impact.

The execution boundary holds in both modes: source reads are read-only;
target code runs only in an OS-enforced sandbox with no external network,
an allowlisted environment, read-only target and toolchain, scratch-only
writes, and explicit resource limits; nothing touches a deployed or shared
system. A missing control turns into a `needs_validation` blocker, never a
reason to run anyway.

The deterministic parts are code, not prose: `assets/report-schema.json`
and two zero-dependency Node validators (`validate-findings.cjs`,
`validate-coverage-ledger.cjs`) gate Phase 4 and every later update. Ten
domain companions in `references/` (native code, AI/LLM, HTTP and identity,
client side, supply chain, cloud, RPC and messaging, availability, data
isolation, desktop/mobile/IPC) are selected per boundary found in
reconnaissance, not per language.

Run artifacts default to `~/security-audit/<repo-name>/run-<N>`, outside
the audited repository; a directory inside it is used only when the user
picks it and version control ignores it. Runs are additive: prior ledgers
and findings target gaps and changed source, never suppress coverage. No
single pass is complete — upstream reports that in its own test runs one
run found roughly half of what repeated runs found in total — so a
`quick`, scoped, or budget-limited run always presents itself as partial.

A full audit needs three things from the host: a coding agent that can
delegate to parallel sub-agents, Node.js for the two validators, and an
OS-enforced sandbox for any target-controlled execution. Without the
sandbox the audit still runs from source, and every lead that needed
execution stays `needs_validation`.

Neighbours: `cmk:delivery-review`'s security lens borrows guidance mode for
a diff; `cmk:cicd` owns scanner gates in CI. An empty scanner result is not
audit coverage.

## Where

- Skill body: `skills/security-audit/SKILL.md`
- Full-audit setup, write isolation, profiles, budget:
  `skills/security-audit/references/full-audit.md`
- Phases: `references/reconnaissance.md`, `references/hunting.md`,
  `references/validation-and-reporting.md`
- Ordinary attack classes: `references/attack-classes.md`
- Domain companions: the other ten files in `skills/security-audit/references/`
- Schema and validators: `skills/security-audit/assets/`
- Validator and prompt-block tests: `tests/security-audit/` (run by `npm test`)
- Pressure-test record: `skills/security-audit/TESTS.md`
- Eval fixtures: `skills/security-audit/eval.json`
- Provenance and license: `skills/security-audit/NOTICE.md`

## Upstream

Adapted from
[cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill)
(MIT) at `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8`, the single-repo skill
that seeded the multi-stage harness described in
[Build your own vulnerability harness](https://blog.cloudflare.com/build-your-own-vulnerability-harness).
Every upstream Markdown
file maps one-to-one onto a lowercase file in `references/`, except the
upstream `SKILL.md`, whose setup and planning sections became
`references/full-audit.md`. The text is otherwise unchanged, so an upstream
diff applies file by file. To take a newer upstream: diff the two commits,
apply each hunk to the mapped file, carry the validators and schema across
verbatim (keeping the provenance header line), port any new test cases into
`tests/security-audit/`, then update the pin here and in `NOTICE.md`.
