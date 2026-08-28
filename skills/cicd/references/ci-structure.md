# CI structure

Mechanics for the single validation pipeline in `SKILL.md`'s CI structure
facet.

## One pipeline, many gated area jobs

A single workflow validates every push and PR. A `changes` job runs first,
diffing against the pipeline's base ref with a path-filter action, and
publishes one boolean output per area (`area_build`, `area_docs`, …). Every
area job declares `needs: changes` and gates itself with
`if: needs.changes.outputs.<area> == 'true'` (usually OR'd against a
"pipeline definition itself changed" output, so editing the pipeline always
re-runs everything it touches). Only what the diff actually touches runs; an
unrelated docs-only change never waits behind a full test matrix.

```yaml
jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      area_build: ${{ steps.filter.outputs.area_build }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            area_build:
              - 'area/**'

  area-build:
    needs: changes
    if: needs.changes.outputs.area_build == 'true'
    runs-on: ubuntu-latest
    steps: [ ... ]
```

## The security job is the exception to path gating

Area gating assumes a change's blast radius matches its file paths. That
holds for build and test jobs and breaks for security: a lockfile bump
touches one file and can alter the whole dependency graph, and a credential
lands in fixtures a `src/**` filter never sees.

Gate the dependency scan on manifests and lockfiles rather than on the area
that owns them, and run the secret scan unconditionally — no `if:` on a
`changes` output. Read `references/security-scanning.md` for the class list
and what each gate does with a scan that could not run.

## Speed structure

- **Concurrency group per ref**, `cancel-in-progress` on pull requests only —
  a new push to the same PR cancels its superseded run; a push to a
  long-lived branch does not cancel an in-flight run others may depend on.
- **Compiler and dependency caching** scoped per ecosystem (a systems-language
  build cache, a package manager's store), keyed on the lockfile, restored by
  every warm job.
- **Warm dependency-resolve jobs** run inside the same cache scope as normal
  CI so day-to-day resolution stays fast; a *separate* scheduled job (below)
  exists specifically to prove the cold path still works.
- **Group build variants instead of rebuilding the workspace per variant.** A
  check that would otherwise run once per feature combination, target, or
  lint pass pays a full workspace compile that many times over. Compute the
  union of what needs checking and cover it in one `--workspace --all-targets`
  pass; reserve a second pass only for a genuinely narrow proof the grouped
  pass can't express (one feature forced off to check a specific invariant),
  not as a second full workspace universe alongside the first. `cmk:rust`'s
  feature-flags facet covers the Rust-specific mechanic — a mechanically
  computed feature union, not a hand-maintained list.

## Tiered runners are configuration, not a workflow edit

Select the runner class through a repository variable with a hosted
fallback, not a hardcoded label:

```yaml
runs-on: ${{ vars.CI_STANDARD_RUNNER || '<hosted-fallback-label>' }}
```

Flipping a pool outage over to the hosted fallback is then a variable change,
never a YAML edit: set every runner variable to the hosted label, then
restore them (or delete the variables) once the self-hosted pool recovers.
Because the pool choice hides behind a variable, tool setup itself must
branch on `runner.environment` (`self-hosted` vs. `github-hosted`), never on
the label — a local composite action (`.github/actions/setup-<tool>`) owns
install and caching once, and every workflow calls it instead of inlining
setup steps that would otherwise silently diverge per job.

## Cold-cache isolation is a trap, not a given

A scheduled job exists to prove CI still works from nothing — no dependency
cache, no warm resolve. The trap: the very setup action every job calls (to
keep install/caching in one place) typically *exports* the shared cache
location into the job environment. A cold job that merely runs after that
normal setup step inherits the shared cache and silently becomes warm,
masking exactly the regression it exists to catch.

Isolate deliberately, after setup, not instead of it:

```yaml
- uses: ./.github/actions/setup-<tool>
# Setup above exports the shared cache path into the job env — override
# it here or this "cold" job silently runs warm.
- name: Isolate the dependency cache
  run: |
    cold_home="$(mktemp -d)"
    echo "TOOL_CACHE_HOME=$cold_home" >> "$GITHUB_ENV"
- run: <dependency-resolve command>
- name: Assert the resolve step respected the cold override
  run: test -n "$(ls -A "$TOOL_CACHE_HOME" 2>/dev/null)"
```

Run this job on a schedule against the tip of the trunk branch with no path
filter at all — a scheduled event has no diff to filter against, so gating it
by changed area would mean it often never runs at all, and the empty-cache
regression would hide behind an unfiltered warm day.

## CI self-contract tests

A test suite (in whatever language the repo's automation scripts already use)
pins the CI workflow's own job IDs, human-readable job names, and runner
assignments as data, then asserts the live YAML matches. Renaming a job or
moving it to a different runner class without updating the ruleset (see
`policy-and-auth.md`) becomes a CI failure instead of a silently
broken required check.

Pin the **implementation site**, not a copy of the step body. A
policy-bearing job is asserted to invoke a named script; the script
carries the policy assertions. A path-filter union (orchestrator
`on.push.paths`, a derived list, a frozen snapshot) is generated or
asserted from one source of truth. Extracting a fat `run:` without
retargeting those pins is **composer-contract drift** —
`host-runnable.md`.

## Label-gated diagnostic jobs

Expensive, rarely-needed diagnostics (a heavyweight capacity benchmark, a
verbose trace) run only when a PR carries a specific label, keeping their
cost off the default path while still making them one click away when
actually needed.
