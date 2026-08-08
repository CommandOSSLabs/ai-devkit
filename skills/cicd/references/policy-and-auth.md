# Policy and auth

Mechanics for the policy-and-auth facet in `SKILL.md`: what gates a change,
what makes a check required, and what identity automation runs as.

## Policy gates are ordinary workflows

Encode delivery policy as workflows, not documentation a reviewer has to
remember to check by hand:

- **Traceability**: a workflow checks that the branch name and PR description
  both reference the same tracked-work identifier, failing the check when
  they disagree or either is missing.
- **Test-evidence floor**: a workflow checks the PR description for a clearly
  labeled testing section containing a reproducible command or evidence link
  and a stated passing result — it judges only this one objective floor, not
  the rest of the description's structure.
- **Dangerous automation ships disabled by default.** Anything that mutates
  repository or delivery state on its own (auto-merge, auto-retarget, a
  conflict-resolution bot) is gated behind an explicit repository variable
  the operator must deliberately set to opt in; its absence is safe, not an
  error.

## Branch-protection ruleset contract

- Required checks are pinned **by exact job name**, and the change-detection
  job (see `ci-structure.md`) is itself required — a
  path-filtered job that doesn't run for a given diff still reports success,
  so if only the per-area jobs were required, an unrelated PR would pass
  every gate for free.
- Renaming or adding a required job updates both the ruleset and the
  `workflows/README.md` required-checks list in the same change — a job
  rename left out of the ruleset silently stops being enforced.
- Disable merge commits on protected branches; keep rebase and/or squash per
  the repository's own git-history policy.

## Automation auth

- **Pin every third-party action dependency** to a commit SHA (with a version
  comment), never a floating major-version tag.
- **Don't persist checkout credentials** (`persist-credentials: false`) in any
  job that doesn't need to push.
- **A repository-installed GitHub App identity**, not the built-in workflow
  token, for any automation whose own pushes must themselves trigger
  downstream CI — pushes authenticated with the default workflow token do not
  fire the standard push/PR events, so a rewritten ref would silently skip
  verification if the automation used it instead.
- **OIDC federation for cloud auth**, never a long-lived static cloud key
  sitting in a secret, wherever the target cloud supports it.

## Critical-invariant verification as its own job class

A change touching security-, authorization-, consensus-, or settlement-
critical logic gets its own required job distinct from ordinary unit or
integration tests — mutation testing or an equivalent adversarial check, not
line coverage alone — so a change that keeps every existing assertion green
but weakens the invariant itself still fails CI. This is the CI half of the
repository's broader testing doctrine (see `docs/rules/common/testing.md` or
the repo's equivalent); the coverage and mutation-testing bar itself is set
there, not re-specified here.
