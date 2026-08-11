# Git workflow

Load when: committing, rebasing, or opening a pull request.

## History shape

Rebase over merge; squash on integration into the canonical branch. Keep
history linear so a later reader can follow one line of commits instead of
reconstructing a merge graph.

## Commit messages

Conventional Commits: `<type>(<scope>): <subject>`, using the standard types
(`feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `build`, `ci`, `chore`,
`revert`). Mark a breaking change with `!` after the type/scope or a
`BREAKING CHANGE:` footer.

- Subject ≤ 50 characters, imperative mood, lowercase after the type, no
  trailing period.
- Skip the body unless a single line genuinely can't carry the meaning; when
  a body is needed, keep it to roughly five lines focused on *why*, not
  *what* — the diff already shows what changed.
- One logical change per commit.
- Push rationale, alternatives considered, and test plans into the pull
  request description rather than the commit body.

## Attribution

Commits read as human-authored. No AI-attribution trailers or co-author
lines from an assistant.

## Branch naming

When the repository tracks work in an issue tracker, carry that issue's
identifier in the branch name so the two stay linked without a lookup.

## Pull requests

- Target the canonical integration branch (`main` or the repository's
  equivalent), except for a deliberately stacked child PR that temporarily
  targets its parent branch.
- Give reviewers enough context to act without reconstructing a
  conversation they weren't part of: what changed, why, and how it was
  verified.
- Address review feedback with follow-up commits on the same branch rather
  than rewriting history mid-review, unless the reviewer explicitly asks for
  a rebase.
- A pull request that cannot merge cleanly may run **no** checks at all rather than failing them. A host that tests a merge commit skips those workflows outright when that merge cannot be constructed — no queued run, no skipped run, nothing to click — and an empty check list looks exactly like "CI has not started yet". Workflows triggered off the base branch rather than the merge still fire, so a lone unrelated job succeeding is the signature of this state, not evidence that CI is healthy. Confirm the PR is mergeable before diagnosing absent checks as an outage, a disabled workflow, or a YAML error; the fix is to rebase and force-push. Closing and reopening the PR does not help here — that treats a different failure, where the PR object stays pinned to a superseded head commit.
- Before reading a `base...branch` diff as this branch's contribution, confirm the branch is not behind its base. A stale branch renders the base's newer commits as though this branch deleted them, so a clean read of that diff can hide a silent revert of someone else's merged work — and nothing in the diff itself reveals it. Rebase first, then review.
