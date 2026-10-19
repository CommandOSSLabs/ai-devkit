---
name: cmk:delivery-ship
description: Use when a finished branch needs to land — open the pull request, merge it locally, keep it, discard it, or block it — producing reviewer-readable commits and pull-request text, with the ticket moved to in-review. Not for reviewing an existing PR (cmk:delivery-review) or cutting a version (cmk:release).
version: 1.0.0
---

# Finish a Branch

Resolve the requested outcome, prepare the branch, and perform that outcome.

## Invariants

```
REUSE EVIDENCE BOUND TO THE CURRENT REVISION.
FALL BACK TO VERIFICATION WHEN THAT EVIDENCE IS ABSENT OR STALE.
NEVER DELETE WORK WITHOUT LITERAL CONFIRMATION.
```

Agent-authored PR title and body remain reviewer truth. There is no package
approval loop and no `.skills/pr-packages/` tree.

## 1. Resolve intent

Walk this ladder and stop at the first rung that resolves:

1. explicit intent in the user's request: `pr`, `merge`, `keep`, `discard`, or
   `block` (ordinary equivalents such as “open the PR” count);
2. an existing PR for the head branch → `pr`;
3. `Default landing action:` in `docs/agents/project.md`, when its value is one
   of `pr`, `merge`, or `keep`;
4. ask one short question: “PR, local merge, or keep the branch?”

Never infer `discard` or `block`. An explicit action is already the user's
choice; do not show a second menu.

**Done when:** exactly one action is resolved.

## 2. Prepare locally

REQUIRED: load `references/prepare.md` and follow it through **Author commits**, then its
**Ship guard** and **Sequence the branch into verifiable units** sections for `pr`
and `merge`.
Resolve and memoize the base there. Author PR text only for `pr`.

Sequencing rewrites history on purpose: a reviewer reads the order, so the order
has to argue. It is anchored, not destructive — `references/prepare.md` records a recoverable
tip first. Any HEAD change, from a residue commit or a rewrite, makes an earlier
close receipt stale; step 3 owns that fallback, which is why sequencing runs here
and never after the evidence is established.

**Done when:** base, conventions, context, tickets, and commits are resolved, the
branch reads as an ordered sequence with its anchor recorded, and no in-scope
tracked residue is unhandled.

## 3. Establish crossing evidence

This step applies only to `pr` and `merge`. `keep`, `discard`, and `block` do
not claim the branch is verified.

REQUIRED: load `cmk:delivery-build`'s `references/close-receipt.md` and run its
fixed validation recipe against `.skills/<CODE>/close-receipt.md`.

- **Valid receipt:** consume it. Do not rerun equivalent verification,
  traceability, review, or acceptance checks.
- **Missing or stale receipt:** REQUIRED SUB-SKILL: use `cmk:evidence` to run
  every verify command and `cmk:traceability` fresh. If user-facing behavior has not
  been driven on the current revision, REQUIRED SUB-SKILL: use
  `cmk:acceptance`. A failure withholds only `pr` and `merge`; report the
  failing evidence and leave `keep`, `discard`, and `block` available.

If this session holds paste-ready banked blocks, reprint them and name
`/cmk:debt`; they never withhold the crossing.

**Done when:** `pr`/`merge` has a valid current-revision receipt or fresh green
fallback evidence, or the crossing is honestly withheld.

## 4. Detect the environment

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" && pwd -P)
```

| State | Meaning |
|---|---|
| equal | normal checkout — no worktree cleanup |
| differ, named branch | linked worktree — provenance-checked cleanup applies |
| differ, detached HEAD | externally managed workspace — no local merge or cleanup |

Use the base memoized by `references/prepare.md`; never re-select it from topology.

## 5. Record only configured boundaries

Read `docs/agents/project.md` `## Decision boundaries` when present. A record is
required only when a non-placeholder row matches `delivery-ship:<action>` or
`delivery-ship:*`. No section or no matching row means no record.

For a matching row, before the side effect REQUIRED SUB-SKILL: use
`cmk:verdict` with the resolved verdict, boundary type, tier/predicate facts,
and durable evidence inline. A publication failure withholds that configured
crossing. Never emit a record for `keep`.

**Done when:** no record is configured, or the required record published.

## 6. Execute the resolved action

### PR

Load `references/prepare.md` **Author PR text** (REQUIRED SUB-SKILL: use `cmk:prose`).
Push the branch — `--force-with-lease` when sequencing rewrote a published one —
then create or update the PR for the memoized base. Submit title/body bytes from
process-temp files, never interpolated as shell input; keep the worktree.

**Open it ready, never as a draft** — omit `--draft`, pass `draft: false` to a
tool that defaults to draft, and make ready any PR that still opened as one. A
draft is not a crossing. Post step 3's evidence onto the PR per `references/prepare.md`
**Post the verdict**, and move the ticket set per `references/tickets.md` **After the PR opens**. Then
report the URL and stop: name `/cmk:delivery-pr` for the CI
watch rather than waiting here, which stalls the next branch and burns runs on
commits a later push restarts.

### Local merge

Only explicit intent reaches this action. From the main repo root:

```bash
git checkout "<base>" && git pull && git merge "<feature-branch>"
```

The merged result is a new revision. Run the full verify suite on it before any
cleanup. On failure, keep the worktree and branch and report the failure. On
success, apply step 7 and delete the feature branch with `git branch -d`.

### Keep

Report branch name and worktree path. Change nothing.

### Discard

List the branch, commits, and worktree path that will be permanently deleted.
Require the user to type the literal word `discard`; “yes” and “confirm” do not
count. After confirmation, apply step 7 and delete with `git branch -D`.

### Block

Report the terminal block and leave the branch in place.

**Done when:** the resolved action completed or was withheld with its concrete
failure.

## 7. Worktree cleanup

Applies only after a green local merge or confirmed discard.

- Remove only a worktree below `.worktrees/` or `worktrees/`.
- Never remove a harness-owned or externally managed workspace.
- `cd` to the main repo root before removal, then run `git worktree prune`.

## 8. Close the loop

On PR or merge, inspect feature `Status:`:

| Status | Action |
|---|---|
| `Draft` | report missing approval; do not transition |
| `Approved` / `In-progress` + every task checked + clean trace + crossing evidence | REQUIRED SUB-SKILL: use `cmk:realign` |
| `Approved` / `In-progress` + partial evidence | report the missing evidence |
| `Implemented` / `Shipped`, no drift | skip |
| `Implemented` / `Shipped`, drift | REQUIRED SUB-SKILL: use `cmk:realign` |

For PR, merge, or keep: name `/cmk:explain <range>` when multi-task or risk paths are
present. It is optional and never withholds the resolved action.

## Red Flags

- Rerunning checks already proven by a valid current-revision receipt
- Trusting a receipt whose base, HEAD, clean-tree state, or required slot fails
- Showing a choice menu after the user already gave explicit intent
- Withholding PR/merge for a sample, study packet, team brief, or debt record
- Publishing a decision record when no matching project boundary config exists
- Inferring local merge, discard, or block from “land this”
- Removing a worktree before the merged result passes verification
- Accepting anything except literal `discard` for destructive confirmation
- Rewriting a branch without recording a recoverable anchor first
- Rewriting execute-family task commits, severing verdicts from what they judged
- Reusing evidence established before a rewrite
- Writing `.skills/pr-packages/` or adding a PR-text approval loop
- Pushing while `scripts/ship-guard.sh` still prints a `lockfile`, `generated` or `out-of-plan` row

| Thought | Reality |
|---|---|
| “Fresh means rerun even though exact HEAD is unchanged” | The receipt binds the proof to that revision; validate the binding instead of replaying the work. |
| “Auth path means sampling must block” | Sampling allocates human attention; it is advisory after review and acceptance. |
| “Open the PR is only a menu preference” | It is explicit intent. Execute it after evidence resolves. |
| “Every crossing deserves a custom record” | Platform history is the default; custom records are opt-in project policy. |

Using Linear? Read `references/linear.md`.
