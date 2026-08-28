# Review lenses

## Contents

- [The seven lenses](#the-seven-lenses)

## The seven lenses


1. **Correctness** — does the code do what it claims? Logic, boundaries,
   error paths, concurrency, resource lifecycle; would each new test fail
   if the behavior regressed?
2. **Spec/design/requirements/AC compliance** — line by line against the
   issue's *current* acceptance criteria, spec, design docs, and
   requirements. When criteria carry requirement IDs (`PREFIX-N.M`), cite
   those IDs on each compliance finding and on each checked-off criterion in
   the evidence trail. Under-delivery against the issue's *intent* is a
   finding even when a criterion's letter is met; a criterion checked in the
   tracker with no proof reachable from the issue is a finding, and so is
   one silently narrowed to match what got built rather than rescoped in
   the open.
3. **Code quality** — repo conventions (`docs/rules/common/naming.md`,
   the doc-comment bar, role-first layout per `cmk:project-layout`),
   language idioms, layering, over- and under-engineering, test quality.
4. **Cross-surface consistency** — do code, doc comments, `docs/`, the
   issue, and the PR text tell one story? Stale docs, drifted scope, and
   invalidated comments are findings.
5. **Edge cases** — inputs, states, and failure sequences the tests miss;
   on a changed surface, unmigrated consumers, dual old/new paths, and
   compat wiring with no recorded per-item disposition.
6. **Security** — think like a bad actor with the diff in hand: injection,
   authz gaps, trust-boundary confusion, resource exhaustion, secret
   handling, and anything touching signed payloads, domain separators,
   settlement, randomness, or wire parity.
7. **Production readiness** — audit against `cmk:delivery-pipeline`'s
   engineering-principles checklist and the spec's production-readiness
   section: failure modes, config, secrets, migrations, observability,
   rollout, limits, and host-runnable scripts (`cmk:cicd`). A shortcut that
   forks the production-ready foundation (local/CI/one-cloud-only, "harden
   later") is a finding. Accepted gaps need a durable statement; silent
   gaps are findings.
