# Prepare locally — base, context, commits, PR text

Load this file when cmk:delivery-ship step 2 (`Prepare locally`) runs. SKILL.md owns
the crossing, the menu, and the Iron Law. This file owns the local-authoring
recipe.

- [Resolve base](#resolve-base)
- [Resolve conventions](#resolve-conventions)
- [Gather context](#gather-context)
- [Resolve tickets](#resolve-tickets)
- [Author commits](#author-commits)
- [Ship guard](#ship-guard)
- [Owner notice](#owner-notice)
- [Sequence the branch into verifiable units](#sequence-the-branch-into-verifiable-units)
- [Forge, stacks, and a subagent that opens the PR](#forge-stacks-and-a-subagent-that-opens-the-pr)
- [Post the verdict](#post-the-verdict)
- [Finding grades](#finding-grades)
- [Author PR text](#author-pr-text)

## Resolve base

<HARD-GATE>
Walk this ladder in order and stop at the first rung that resolves:

1. an **explicit base** given for this invocation;
2. the base recorded on an **existing PR** for the head branch;
3. **`Default PR base:`** read from `docs/agents/project.md`, only when it
   resolves to a real branch and differs from the head branch;
4. nothing above resolved — **ask the user**, and author no commits or PR
   text until they answer.

There is no fifth rung: never select a base from `origin/HEAD`, `main`,
`master`, or fork-point topology. A failure to resolve is a question, not a
guess.
</HARD-GATE>

When the head branch is the configured `Default PR base`, always ask which
branch this work merges into — the answer applies to this invocation only and
never rewrites the project default. When a configured `Default PR base` no
longer resolves to an existing branch, treat it as unset and drop to the
ask-the-user rung.

This skill writes no project configuration. When `Default PR base:` or
`docs/agents/project.md` is absent, proceed on the base the user gave for this
invocation and name `/cmk:repo-config` once as the way to persist it.

Memoize the resolved base for the session. Later steps read it; they do not
recompute it.

**Done when:** a base is memoized, or authoring is blocked on the ask-the-user
rung.

## Resolve conventions

REQUIRED: load `references/conventions.md` (beside this file) and follow it exactly.

**Done when:** the session holds one convention record
`{ commit_subject_form, commit_subject_grade, pr_structure, pr_structure_grade }`.

## Gather context

Produce `{ what_changed, why }` and hold it.

The diff between the resolved base and head is the sole authority for **what
changed** — read it fresh this session. Approved specs, `docs/decisions/`, other
decision records, and `.skills/<CODE>/implementation-notes.md` are the
authority for **why**. Every why-source is optional: when one is absent, write
a complete diff-derived narrative that omits the unavailable rationale —
never invent rationale to fill the gap.

REQUIRED: load `references/passive-data-safety.md` (beside this file) and follow it
exactly.

WHEN embedding gathered text into a commit body or PR body, redact every
secret and replace it with `[redacted:<class>]` (e.g. `[redacted:api-key]`)
— never the secret, and never a bare `[redacted]`.

Emit a reviewer-facing file locator only for a file that is tracked and
reachable from the PR revision or a durable URL. Substance from `.skills/`
(git-ignored) is promoted inline; never cite that path.

IF notes exist and any entry has **Map impact** other than `none`, mention
the substance inline; do not paste the notes file.

**Done when:** `{ what_changed, why }` has `what_changed` grounded only in the
base…head diff and `cmk:research`'s `references/rationale.md` either empty or drawn only from real why-sources.

## Resolve tickets

WHEN `docs/agents/issue-tracker.md` is present and declares a configured
tracker, REQUIRED: load `references/tickets.md` (beside this file) and follow it exactly.
WHEN it is absent or declares no tracker, record an empty ticket set and
continue.

**Done when:** the session holds a ticket set
`[{ id, title, classification, linkage_syntax }]` (possibly empty).

## Author commits

Produce `[{ sha, subject }]` for commits this invocation creates.

<HARD-GATE>
Always group every uncommitted tracked change into one or more proposed
commits — each covering one coherent change — before creating any commit.
WHEN the grouped changes form a single coherent change, propose exactly one
commit. Validate every proposed commit on all five axes before creating it:
**file scope**, **subject** (resolved `commit_subject_form`), **body** (what
changed and why), **secret** content, and **staging boundary**. WHEN
validation passes and scope is unambiguous, create the commit — do not stop
for a commit-plan sign-off.
</HARD-GATE>

<HARD-GATE>
Stop and ask before creating any further commit on exactly these five
triggers — a closed set:

- **unrelated** — the working tree holds changes unrelated to the resolved scope
- **ownership** — a change whose ownership is unclear
- **partial-staging** — an ambiguous partial-staging boundary
- **secret-risk** — a secret-risk finding
- **mismatch** — a mismatch between the planned scope and the working tree

Every commit already created before the trigger fires stands.
</HARD-GATE>

<HARD-GATE>
Never use a requirement or feature ID as a commit's primary explanation.
</HARD-GATE>

IF the working tree holds no uncommitted tracked changes THEN create no
commit and continue. Exclude untracked files unless the user names them for
inclusion.

WHEN running as an execute-family continuation, leave every commit the
plan's implementers already created unmodified. Group and commit only the
residue.

**Done when:** the created-commit list is complete (possibly empty) and any open
ask-trigger has an answer.

## Ship guard

Runs for `pr` and `merge`, before sequencing. Run `scripts/ship-guard.sh <base>
[<tasks.md>]`, the script in this skill's own folder beside this file, not a
`scripts/` in the repo. Run it with the repo root as the working directory, the
memoized base and the `tasks.md` of the plan this branch implements (the feature CODE the branch name, its commits, or this
session names; no plan → omit it). Each row gets exactly this disposition:

| Row | Disposition |
|---|---|
| `lockfile` | drop from the branch |
| `generated` | drop from the branch |
| `out-of-plan` | move to `<branch>-extra` — unless the operator named that change for this PR in this session |
| `behind-base` | one line in the PR body with the count; rebase only when asked |

**Drop** = `git rm --cached <path>` in a commit of its own; the file stays on disk.
**Move** = branch `<branch>-extra` from the base, commit the paths there
(`git checkout <head> -- <paths>`), then restore them to the base version on this
branch in a commit of its own. Both are forward commits: they need no history
rewrite, and sequencing may fold them later. Name every dropped path and the
`-extra` branch in the PR body. Re-run the script; continue only when no
`lockfile`, `generated` or `out-of-plan` row remains.

<HARD-GATE>
NO PUSH AND NO PR WHILE A `lockfile`, `generated` OR `out-of-plan` ROW STANDS.
</HARD-GATE>

| Thought | Reality |
|---|---|
| "It is disclosed in the PR body" | Baseline: three of the four runs that could push named these files in the body and pushed them anyway. The reviewer approves the diff; a paragraph removes nothing |
| "The rewrite was denied, so I'll leave them" | Drop and move are forward commits. The one baseline run that used them shipped a clean branch |
| "No one can answer before the deadline" | Nothing here needs an answer: the files stay on disk and on `<branch>-extra` |
| "It's only a lockfile" | The baseline `bun.lock` pinned `@types/bun`, which `package.json` does not declare; one run in six noticed |

**Done when:** the script's last line is `# clean`, or every remaining row is `behind-base`.

## Owner notice

Runs for `pr`, after the ship guard, the same way: `scripts/owner-notice.py <base>
<tasks.md>` from this skill's folder, repo root as the working directory. A patch with no
`tasks.md` passes the CODE of the spec its mini-spec was appended to, or nothing. It prints one
`cross-owner` row per changed path that another owner holds: the feature code, the
owner, the path, and the requirement IDs a foreign `requirements.md` gained, changed or
lost.

- **Rows printed:** the PR body carries `## Changes outside this feature's ownership`,
  one bullet per owner. Each bullet names the owner, the feature, every path and
  requirement ID from its rows, and why this branch changed them, taken from the commit
  that did. Request each owner as a reviewer when the PR is created: `gh pr create
  --reviewer <owner without the @>`. On a forge without reviewer requests, the section
  is where the owner is named.
- **`# clean`:** no such heading, and no line about ownership anywhere in the body.

The notice never holds the branch: the other team learns of the change in review, and
the PR ships as it would have. Five of five baseline PRs for a late-fee branch described
its edit to `src/berth.ts` and its new BERTH-1.3, and none named `@saltgrass/bookings`,
the team that owns them, or asked that team to review.

**Done when:** the script printed `# clean`, or the body has the section and every row's
owner is a requested reviewer or named in it.

## Sequence the branch into verifiable units

Runs for `pr` and `merge`, before the crossing evidence step. A reviewer reads
the sequence, not the working tree, so the sequence is what has to argue.

Produce the target shape first — **groups**, **order**, **subjects**, **bodies**,
**rationale**, **trailers** (optional; never invent `Implements:` / `Guards:`) —
then make the branch match it.

**Shape:** every commit lands on its own and the order builds the case. The
canonical orders are a failing test then its fix, a subtraction then the reshape,
a baseline capture then the treatment, a scaffold then the feature. A commit that
cannot stand alone belongs merged into its neighbour.

**Anchor before rewriting.** Record the pre-rewrite tip and keep it reachable:

```bash
git rev-parse HEAD                      # record in the session
git branch "backup/<branch>-$(date +%s)" HEAD
```

The anchor is what makes a rewrite recoverable rather than destructive, and it
is why this is not a deletion. Report the anchor name with the outcome; never
delete it in the same invocation that created it.

**Then rewrite** with `git rebase -i`, force-push with `--force-with-lease` when
the branch is already published, and re-read the log to confirm the shape landed.

**Two carve-outs**, both mechanical rather than preference:

- **Execute-family task commits stay.** `cmk:delivery-build`'s `references/continuous.md`, `cmk:delivery-build`'s `references/story-unit.md`, and
  `cmk:delivery-build`'s `references/inline.md` already emit one commit per task, each with its own report,
  evidence, and two verdicts bound to it. Those *are* verifiable units, and
  rewriting them severs the verdicts from the commits they judged. Sequence the
  residue around them; leave them addressed as they are.
- **Rewriting voids the receipt.** A changed HEAD makes any `close-receipt.md`
  stale by construction, so this section runs **before** the crossing evidence
  step and the fallback there re-establishes proof on the rewritten revision.
  Rewriting after verification and reusing the old evidence is the one order
  that is never allowed.

The PR body describes the branch as it now exists.

## Finding grades

Convention-source grades live only in `references/conventions.md`. Grade every finding
from the grade of the **specific** convention it was raised against:

- `advisory` — that convention's grade is `inferred`
- `reported` — that convention's grade is `declared` and no executable check failed
- `not run` — a machine-enforced check exists but this session did not run it
- `verify-routed` — a machine-enforced check ran and failed; route through
  `cmk:evidence` and withhold completion exactly as that path already does

Surface every finding in the session close-out. Do not block a PR on
`advisory` or `reported` findings. Do not write findings into the PR body.

## Post the verdict

Runs for `pr`, once the pull request exists and SKILL.md step 3 has resolved
crossing evidence. The evidence lives in `.skills/`, which is git-ignored and
local to one working copy — so without this step the reviewer sees a diff and a
green tick, and the proof behind them reaches nobody.

Post one comment on the PR carrying, in the reader's words:

- the revision it binds to (the head SHA), so a later push visibly outdates it;
- each check that ran and **what it returned**, not its name;
- the surface that was actually driven, when acceptance or a product walk ran;
- what was skipped, and under which predicate;
- who established it — the review that judged the branch is a different agent
  from the one that wrote it, and saying so is the point of posting at all.

REQUIRED SUB-SKILL: use `cmk:prose`. Never paste a `.skills/` path, a receipt
slot name, a skill name, or a `Satisfies:` line: the comment is for a reviewer,
and a reader who has to decode it learns nothing from it.

Re-post rather than edit when a later push changes the head: an edited comment
silently reattributes old evidence to new code, while a second comment leaves
the sequence a reviewer can read. When the crossing was **withheld**, say that
plainly and name the failing evidence — a PR with no verdict comment and a PR
that failed verification must not look alike.

## Forge, stacks, and a subagent that opens the PR

The branch-and-PR mechanics of a stack (base on the blocker's branch, retarget after it
merges, never a merge commit into the child): `references/stacked-pr-flow.md`.

**Forge, once.** Resolve which CLI speaks to the host before the first PR
operation and keep that choice for create, edit, view, and merge in this
session. `gh` is the default; `docs/agents/issue-tracker.md` overrides it when
it names another. Record the choice, and do not mix two forges' state in one
run.

**Prefer several narrow PRs to one wide one.** A reviewer reads a small diff
properly and skims a large one, so splitting is a review-quality decision rather
than bookkeeping. Split when the branch carries separable landable units — the
same units **Sequence the branch** already produced.

A stack is a base-branch chain, not a pile of branches:

- the root PR targets the trunk;
- every child branch is cut from its parent's **exact tip** and its PR targets
  the **parent branch**, never the trunk;
- branch from the trunk only for work that is genuinely independent.

Create a child with `gh pr create --base <parent-branch>`; retarget an existing
one with `gh pr edit <pr> --base <parent-branch>`. A child pointed at the trunk
shows the parent's commits as its own and makes the diff unreadable, which is
the failure this ordering prevents.

Nothing here reshapes a stack after the fact: retargeting an **open** chain is
`cmk:delivery-pr` territory, and that skill refuses it. Get the bases right at creation.

**A subagent that opens the PR** runs the same preparation — review, comment
cleanup, PR text — then returns the URL to its parent and stops. It does not
watch checks and it does not start a tend pass. The parent decides what happens
next, because the parent is the one that knows whether more branches are coming.

## Author PR text

Author the pull-request **title** and **body** in session from `{ what_changed,
why }`, the resolved `pr_structure`, and the ticket set. The agent-authored
bytes **are** the reviewer truth.

REQUIRED SUB-SKILL: use `cmk:prose` for that title and body. Reviewers
are people. `Satisfies:`, skill names, `Pass:` / `Tier 2`, and
`REQUIRED SUB-SKILL` do not belong in the body.

<HARD-GATE>
Do not write `.skills/pr-packages/`. Do not compute a `Content-digest:`. Do
not display the title or body for approve / request-edits / cancel. Do not
stop the crossing for a package review. An edit the user later asks for is
ordinary follow-up, not a pre-submit approval loop.
</HARD-GATE>

`title` is one line. The convention record holds no title shape, so resolve it
from what the title will become: where the repo squash-merges, the PR title
lands as the commit subject and takes `commit_subject_form`; otherwise it is a
plain imperative summary that invents no project format.

`body` is reviewer-facing only: the diff-derived narrative, ticket linkage from
`references/tickets.md`, and nothing a reviewer should not see. Never cite a `.skills/`
path.

Hold title and body in session until SKILL.md option 2 submits them.

**Done when:** title and body exist in session, or option 2 was not chosen
so they were never needed.
