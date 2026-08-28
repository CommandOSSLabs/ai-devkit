# Security scanning

Scanners fail quiet. An absent binary, an expired token, a ruleset that
never shipped — each returns an empty finding list indistinguishable from a
clean result, and the gate stays green while checking nothing. Everything
here follows from that.

## Four classes

A class is a question, not a product. Each is answered by a scanner of that
category or equivalent; name the chosen one in `docs/rules/`.

| Class | Answers | Reads |
|---|---|---|
| Code | injection, authz gaps, unsafe APIs, secrets in logic | source |
| Dependencies | known advisories, malicious packages, license policy | manifests, lockfiles |
| Secrets | credentials committed to the tree or its history | the diff; history on adoption |
| Infrastructure | misconfigured IaC, over-permissioned roles, image findings | IaC, Dockerfiles, workflows |

## Selecting classes

Running every class on every change trains people to ignore the result.
Scope them the way `cmk:delivery-review` scopes lenses:

- **Adaptive when unstated** — select from what the diff touches. Source
  implicates code; a changed manifest or lockfile implicates dependencies;
  IaC or workflow edits implicate infrastructure. A docs-only diff
  implicates none.
- **Binding when stated** — an explicit class list is honored exactly, in
  both directions. Where it contradicts a risk signal, run what was asked
  and name the unacted signal.
- **Disclosed unconditionally** — state which classes ran and which did not,
  each absence with its reason. No reader recovers that from a findings
  list.

Secrets is the exception and always runs: a committed credential is not
proportional to the size of the change that carried it.

Escalate to every class when the effort changes a trust boundary, an
authn/authz path, a signed or serialized wire format, a deployment surface,
or the release pipeline itself.

## Not applicable is not could not run

Two absences a findings list renders identically:

- **Not applicable** — the diff touched no manifest, so the dependency class
  did not run. Coverage intact.
- **Could not run** — the scanner was missing, unauthenticated, timed out,
  or loaded zero rules. Coverage has a hole.

Collapsing the second into the first is how a gate stops gating. A run with
any *could not run* class is incomplete, never clean, and says so before it
lists a finding. This is `empty-scan-reads-as-clean`, the scanner-level form
of `skipped-job-reports-success`: there the job never ran, here it ran and
checked nothing.

## Placement

| Class | Runs | Why there |
|---|---|---|
| Secrets | pre-commit and CI | Cheapest scan, unrecoverable miss. Hooks are bypassable, so CI repeats it. |
| Code | pull request | Needs the diff. A whole-tree pass belongs on a schedule. |
| Dependencies | pull request on manifest/lockfile change, and on a schedule | Advisories are disclosed against code that has not changed. |
| Infrastructure | pull request on IaC, container, workflow change | Cheap to catch, expensive to deploy. |

The scheduled dependency run is the one usually skipped and the only one
that catches an advisory published since the last merge.

Path gating is the one pipeline convention these jobs do not follow;
`references/ci-structure.md` covers how they are wired instead.

## Exit codes

| Code | Meaning | CI treats as |
|---|---|---|
| 0 | Selected classes ran, nothing at or above threshold | pass |
| 1 | Findings at or above threshold | fail |
| 2 | Scan could not run at all | fail |
| 3 | Ran, but a class could not run | fail |

If a gate must be non-blocking during adoption, make it non-blocking for
findings and keep it blocking for coverage — the opposite of the usual
choice, and the one that keeps the gate honest while a backlog is worked
down.

## Suppressions are accepted gaps

`cmk:design` requires a security section stating assumptions, gaps, and
controls. A suppression is that same accepted gap expressed where it is
enforced, so it carries the same obligation: a reason, and an expiry. An
expired suppression fails the gate rather than renewing silently. Accepted
must not decay into forgotten.

On adoption, baseline the existing findings rather than blocking on them —
a fresh gate against an accumulated backlog gets disabled within a week —
then block on new findings from day one.

## Prove the gate gates

A security job's failure mode is silence, so it needs the same evidence any
critical path does:

- Commit a canary — a known-vulnerable dependency or an obvious injection on
  a scratch branch — and confirm the gate fails.
- Fail the job when the scanner reports an implausibly low rule count.
- Read the coverage line, not the conclusion. Every class reporting *could
  not run* under a green check is a failing scan wearing a passing badge.
- On a codebase with history, a gate that has never once failed is evidence
  of breakage rather than cleanliness.

## Reporting

Emit SARIF or equivalent so findings land in the review surface. Every
result must reference a rule the report also declares — consumers silently
drop results whose rule they cannot resolve, and the upload still succeeds.
Carry the coverage report into the format's notification channel so a
consumer can tell a clean scan from one that did not run.
