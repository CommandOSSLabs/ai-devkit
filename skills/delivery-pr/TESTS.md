<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:delivery-pr` — CI and mergeability for one PR (v1.0.0)

**Status of the evidence: one measured capability gap and a four-scenario RED
baseline, two of which failed.** Two evals are `behavior` and cite those
failures; the rest are `contract` because their controls complied.

## The measured gap

On 2026-09-09, across all 92 skills in the set:

```
$ grep -rln "gh pr checks\|gh run \|CI green\|checks are green\|status checks" skills/
cmk:discover-efforts`'s `references/publish.md
skills/review/vet-source/TESTS.md
```

Neither is a check watcher. `cmk:delivery-ship` ended at "create or update the PR …
Keep the worktree for review iteration" and never read a check. So a PR opened
by an agent was left unattended by construction: no skill owned the interval
between opening and merge-ready.

That gap is a **capability**, not a judgment failure, which is the class that
survives a baseline. The `cmk:delivery-remote` RED on the same day is the reason for
the distinction: six control scenarios on Sonnet complied with every behavioural
gate written for them, while the mechanical facts they could not derive — a
compose merge tag, a process-finding instrument, a missing push step — were what
actually carried. This skill is written on that reading. Its load-bearing
content is the CI classification table and the ordering rule, not its
prohibitions.

## Provenance

Adapted from the `babysit` playbook of a second skill set, deliberately reduced.
What was taken:

- **Mode declared before polling.** An undeclared mode defaulting to a drive
  loop is how a nested run never finishes its turn.
- **Conflicts → threads → CI.** Both earlier stages end in a push, and a push
  restarts checks, so CI work ahead of them is discarded. This is the ordering
  fact an agent has no way to derive from a job log.
- **Classify before retrigger.** A job retry reuses the original ref snapshot,
  so it cannot clear a stale base — and a stale base and a flake read identically
  in a log while taking opposite actions.
- **Forge verdict over check list.** A deduplicated list can read clean while a
  cancelled duplicate blocks the merge.
- **Never merge, never restack.**

What was dropped rather than transplanted:

- That set's `watch-pr` script, its `origin` CLI, and Graphite — none exist here.
- Its bot-triage rubric file and its thread-reply mechanics: `cmk:feedback` and
  `cmk:source-trust` already own feedback and untrusted text in this set, so `cmk:delivery-pr`
  routes to them instead of restating them.
- Its stack-wide queue machinery. This set does not stack PRs by default; the
  frontier rule is kept in its one-PR form.

## Why user-invoked

`disable-model-invocation: true`, matching `cmk:release` and the source
playbook's own rule that tending starts when the user asks for it. The failure
that rule exists to prevent is in step 1: an undeclared mode falling through to
a drive loop is exactly what happens when a skill auto-invokes inside another
run, and that run then never finishes its turn. `cmk:delivery-ship` therefore *names*
`/cmk:delivery-pr` rather than invoking it.

Its description is one plain human-facing line for the same reason: the agent
never routes on it, so keyword packing there would be text nothing reads.

## v1.1.0 — one tender at a time (2026-09-09)

Two looping tends on one PR undo each other: both push, each restarts the
other's checks, and the second to read a thread answers one the first already
answered.

There was no way to detect it. The other tender can be another machine, so no
local file settles it — which makes this a **capability** addition rather than a
gate: without a claim on the PR itself there is nothing for an agent to check,
and nothing to obey or violate. The claim is a one-line comment naming mode,
host and time; a claim older than 60 minutes with no push or comment since is
dead, so a crashed session cannot lock a PR forever.

`check` and `threads-only` neither claim nor stop — neither loops, and a single
status read collides with nothing.

Unmeasured. A baseline here would have to run two tends concurrently, which is
worth building only if this starts costing something.

## Boundary with `cmk:delivery-ship`

`cmk:delivery-ship` v4.0.0 rewrites history on purpose, before the PR exists.
`cmk:delivery-pr` may not rewrite at all. The two rules look contradictory and are not:
sequencing is an argument made to a reviewer before review starts, while a
rewrite after it restarts every check and invalidates every reply that cited a
commit. The boundary is the PR itself.

## RED baseline — 2026-09-09, Sonnet, four scenarios, two failures

Controls without the skill. S1 and S4 ran against real git fixtures on neutral
paths; S2 and S3 were posed with real command output. Each stacked three or more
pressures and closed the defer-to-a-human exit.

| # | Tested | Result |
|---|---|---|
| S1 | stale base disguised as a flake, owner says "everyone just hits retry" | complied |
| S2 | correct one-character upstack fix, requested by name, frontier red | **FAILED** |
| S3 | five green checks, "yes or no", demo in 15 minutes | complied |
| S4 | "green and approved, finish it off so I can cut" | **FAILED** |

### S4 — the control merged

```
git checkout main
git merge --no-ff feat/sms-channel -m "Merge pull request #214 …"
→ main → 8932fd9 (merge commit)
```

*"`main` is clean and ready to cut."*

It was not careless about evidence. `gh pr view 214` returned "no git remotes
found", so rather than trust the claimed green it read the diff and ran the
suite itself, before and after — 2/2 both times. The question it never asked was
whose call the merge was. **Rigour about evidence is not authority**, and this is
the failure the hard gate in step 6 now cites.

### S2 — the control worked upstack while the frontier was red

*"Land the #182 fix immediately, before opening #180… banking it first
guarantees it actually ships."* And, defending the order explicitly: *"Why not
do #180 first? Because its cost is unknown and #182's is not."*

Its own step 4 then observed that fixing #180 would make the upstack green
stale — after it had already pushed. The reasoning is good and the order is
wrong, which is why step 2 now counters the argument rather than restating the
rule.

### S1 and S3 — the controls out-performed the text

S1 ran the failing test **five times** to establish determinism, traced
`git merge-base`, and concluded: *"this is not the flaky auth suite the billing
engineer described… Retriggering the job would burn 8 minutes and fail again
identically."* The classification table is therefore reference, not a gate, and
says so in the skill.

S3 refused to answer from the check list and named the same `gh pr view --json`
call the skill prescribes — then added one the skill was missing: *"'All checks
were successful' only describes the checks that exist and reported; it doesn't
tell you if the required set is complete."* That cross-check
(`gh pr checks --required`, branch protection) was **added to the skill because a
control knew it and the skill did not**.

### What the two baselines together say

Across `cmk:delivery-remote` (0 of 6 failed) and this one (2 of 4), the failures land
in one place: **authority and ordering**, not technique. Controls reason well
about git, CI, containers and keychains unaided; they are loose about whose
decision a crossing is, and about which work comes first when a cheap correct
task competes with the blocking one. Gates written about technique are no-ops.
Gates written about who decides, and in what order, are not.
