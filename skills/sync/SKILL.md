---
name: cmk:sync
description: Use when the user asks to "sync skills with upstream", "pull upstream skill updates", "reconcile vendored skills", "update the skills lockfile", or whenever a repo's vendored `.agents/skills/` copies have drifted from the upstream kit.
version: 0.1.1
---

# Sync

Keep a consuming repo's vendored generic skill layer current with upstream
ai-devkit without flattening local evolution. Vendored skills evolve in
place; sync is a baseline-tracked semantic three-way reconciliation, never a
blind overwrite.

## What the lock records

`.agents/skills.lock` records, per vendored skill, the upstream skill name,
the upstream version (release tag or SHA), and the content hash of the
pristine upstream copy at vendor/sync time. Writing or validating the lock?
Read `references/skills-lock.md`.

## Modes

- **baseline** — record or refresh lock entries when a skill is first
  vendored or after a completed sync; hash the pristine upstream copy, not
  the local adaptation.
- **sync** — the three-way reconcile (below).
- **contribute** — review local amendments flagged as generic; prepare them
  as upstream contributions.

## Workflow (sync mode)

1. Read the lock.
2. Fetch the pristine *base* of each skill at its recorded ref.
3. Fetch current upstream (*theirs*).
4. Take the repo's evolved copy as *ours*.
5. Compute the upstream delta base→theirs per skill.
6. Re-express that delta over ours semantically — meaning-level merge, not
   line merge.
7. Surface genuine conflicts (an upstream change contradicts a local
   adaptation) for human decision — never auto-resolve.
8. Flag local amendments that look generic as upstream-contribution
   candidates.
9. Update the lock (new ref + new pristine hash) only for skills whose
   reconcile completed.

Running the reconcile? Read `references/reconciliation.md`.

## Scope rule

Truly project-owned skills (deploy steps, product workflows) are new skills,
not edits to generic ones; they carry no lock entry and sync never touches
them.

## Verify

Report-only — never mutate:

- `.agents/skills.lock` exists and parses.
- Every `.agents/skills/cmk-*/` directory has exactly one lock entry, and
  every entry has a directory.
- Each entry carries all three recorded facts (upstream skill name, upstream
  version, pristine content hash).
- Each skill's separable local amendments sit under a marked
  `## Project adaptations` section — warn, don't fail, when adaptations are
  interleaved instead.
- Report drift candidates: entries whose recorded ref is older than the
  newest upstream release. Never mutate.

Vendored layout and adapters are owned by `cmk:agent-vendors`.
