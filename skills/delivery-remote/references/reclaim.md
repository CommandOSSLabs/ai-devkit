# Reclaim

Giving the host back what a run borrowed. Loaded from `SKILL.md` Phase 6, and
whenever the user asks what the host is holding.

**Contents:** [Status](#status) · [The two verdicts](#the-two-verdicts) ·
[Reclaim order](#reclaim-order) · [Quarantine](#quarantine) ·
[Merged trigger](#merged-trigger)

## Status

One read, answering both "how is my work going" and "what is this machine
holding". Run it over plain SSH — nothing here needs a credential — except the
pull-request state, which needs the tmux server like the rest of the return leg.

The repo's `scripts/host-status.sh` (see `references/host-provisioning.md` § The status
script) already implements the per-run half: `status` for one run, `runs` for
every record in the repo. Use it rather than retyping these reads; what it does
not cover is the host's own line at the end of this section.

**Mid-run, the state column is the whole answer.** `SKILL.md` Phase 5 polls this
same read:

| Signal | Reading |
|---|---|
| Sentinel absent, session alive | running |
| Sentinel absent, session **gone** | died without an exit code — the log tail is the evidence, report it as a failure |
| Sentinel present, `0` | finished; read the driver's result field |
| Sentinel present, non-zero | failed; the log tail is the evidence |

Per run, from its run record plus the host:

| Column | Where it comes from |
|---|---|
| CODE · slot · branch | run record |
| State | sentinel absent + session alive → running; sentinel `0` → done; sentinel non-zero → failed; sentinel absent + session gone → died |
| Heartbeat | the driver's `progress` field |
| Commits | `git -C <worktree> rev-list --count <BASE>..HEAD` |
| Containers | `docker compose -p <project> ps --format json`, or `docker ps --filter label=com.docker.compose.project=<project>` |
| Ports held | `lsof -nP -iTCP -sTCP:LISTEN` filtered to the run's block |
| PR | `gh pr list --head <branch> --json number,state,url` — **inside tmux** |
| Age | dispatch time in the run record |

Then the host's own line: free slots, `docker compose ls --all`, and any compose
project or worktree that no run record claims. **An unclaimed project is the
finding, not noise** — it is what a previous reclaim missed.

## The two verdicts

Every artifact a run left is either *reclaimable* or *quarantined*, and the test
is where the work lives, never how old it is.

**Reclaimable** — the commits are provably somewhere else:

- the branch tip is an ancestor of a commit already merged
  (`git merge-base --is-ancestor <tip> <merged base>`), **or**
- the branch exists on the remote at that tip, **or**
- the tip equals `BASE` — the run produced nothing.

**Quarantined** — anything else, including every run that simply stopped.

## Reclaim order

Enumerate before deleting, and delete in this order. Each step's output is what
the next step acts on.

1. **Processes.** `lsof +D <worktree>` finds them by open files and working
   directory. Stop them, then re-check.

   `pgrep -f <path>` is the wrong instrument here: measured, a `node` server
   running inside a run directory was found by `lsof +D` and matched by
   `pgrep -f` not at all, because its command line never contained the path.

2. **Containers, networks, volumes.** `docker compose -p <project> down -v
   --remove-orphans` from the worktree, with the same `-f` files the run used.
   Then confirm nothing is left with that project label.
3. **Ports.** Re-check the run's block is listening on nothing. A port still
   held after steps 1 and 2 means something was missed; stop and report it
   rather than releasing the slot.
4. **Worktree.** `git -C <RUNDIR> worktree remove <path>` — plain, never
   `--force`. Git refuses an unclean worktree, and that refusal is a
   quarantine signal, not an obstacle.
5. **Branch.** Delete the local branch only under a reclaimable verdict.
6. **Bookkeeping.** `git worktree prune`, release the slot, and mark the run
   closed in its record. The record itself stays — it is how an unclaimed
   artifact is recognised later.

## Quarantine

A quarantined run gives back everything expensive and keeps everything
irreplaceable. Run steps 1–3 — processes, containers, ports, slot — and stop
before step 4. The worktree and its branch stay on disk.

Disk is cheap and commits are not. An age policy may decide when to quarantine;
**no age policy may delete a quarantined worktree.** That deletion is a user's
call, made against a status view that shows what would be lost.

## Merged trigger

Reclaim fires when the run's pull request reaches merged, which is a state to be
read rather than assumed:

```
gh pr view <n> --json state,mergedAt,mergeCommit
```

`state: MERGED` with a `mergeCommit` is the trigger. `CLOSED` without a merge
commit is **not** — the branch was abandoned, the work is not upstream, and it
quarantines. A review that requests changes leaves the PR open and the run
untouched; the worktree is still wanted.

Same rule for `return: fetch`, where there is no PR: reclaimable means the tip
is an ancestor of something merged locally, or the branch was pushed. Otherwise,
quarantine.
