# SDL Phases

**Status:** active
**Owner:** ai-devkit maintainers
**Last updated:** 2026-10-19
**Scope:** System-wide — the development lifecycle the `cmk:*` skills are shaped around

The lifecycle is a **closed workflow**: every ticket is in exactly one state, each move
between states belongs to one command or the person, and the person owns three gates —
**approve** a spec or plan, **answer** a question on a ticket, **merge** a PR. Agents do the
rest. The states and their movers are owned by `cmk:delivery-workflow`
(`skills/delivery-workflow/references/closed-workflow.md`); this page maps the phases onto
them and names what each phase writes. Why the lifecycle has this shape:
[`../decisions/0001-jdk-engine-cmk-shape.md`](../decisions/0001-jdk-engine-cmk-shape.md).

## Contents

- [The five commands](#the-five-commands)
- [Phase 1: Shape](#phase-1-shape)
- [Phase 2: Build](#phase-2-build)
- [Phase 3: Review and ship](#phase-3-review-and-ship)
- [Phase 4: Release](#phase-4-release)
- [How much each change needs](#how-much-each-change-needs)
- [Any phase](#any-phase)
- [Links](#links)

## The five commands

| Command | Moves | Output |
|---|---|---|
| `/cmk:idea` | Inbox → Shaping | The ticket, its tier and its open questions |
| `/cmk:shape #N` | Shaping → Ready (on the person's approval) | The spec triad, or the confirmed cause and mini-spec for a bug |
| `/cmk:go [#N…]` | Ready → Building → In review | One PR per ticket, one message at the end |
| `/cmk:board` | none | What waits on the person, what agents are doing, where board and repo disagree |
| `/cmk:release` | Done → Shipped | The version, the tag, the decision record |

Every skill below still works on its own; the five are the short path.

## Phase 1: Shape

**Goal:** settle what the change is before anyone builds it.

- `cmk:scope` sizes it (tier 0, 1 or 2 = scope band trivial, patch, feature) and frames it;
  `cmk:interview` closes the open decisions one card at a time.
- `cmk:requirements` writes `docs/specs/<date>-<feature>/requirements.md` — stories, EARS (or
  RFC 2119) criteria with stable IDs, guards for existing behavior. A product area's living
  requirements stay in `docs/requirements/<topic>.md`.
- `cmk:design` writes the triad's `design.md` (or `docs/design/system.md` and track docs);
  `cmk:adr` records a decision that is hard to reverse, surprising, and a real trade-off.
- `cmk:delivery-spec-plan` writes `tasks.md`; the person's approval of it makes the ticket Ready.
- The feature registry is `docs/specs/INDEX.md` and its catalog shards (`cmk:catalog`).

## Phase 2: Build

**Goal:** turn an approved plan into commits that are each proven.

- `cmk:delivery-pipeline` (behind `/cmk:go`) sizes any ready ticket with no spec, claims each
  eligible one, and runs `cmk:delivery-build` per ticket: continuous waves of subagents,
  human-gated story units, or inline.
- Every task is test-first (`cmk:tdd`) and reviewed on two axes before its ledger line;
  `cmk:debug` owns unexpected failures; `cmk:evidence` owns every "it works".
- `cmk:delivery-simplify` cleans the joined branch without changing behavior.

## Phase 3: Review and ship

**Goal:** a PR a person can merge on the strength of what it shows.

- `cmk:delivery-review` reviews the range on two separate axes — the repo's standards and the
  spec, ID by ID — plus invariants, UI and blast radius where they apply.
- `cmk:delivery-ship` ticks the ticket's criteria with their proof, opens the PR ready (never a
  draft), and moves the ticket to In review. `cmk:delivery-pr` watches CI.
- The person merges; `Closes #N` closes the ticket.

## Phase 4: Release

**Goal:** a named version whose tickets read Shipped.

- `/cmk:release` runs the gates, writes the version and tag, records the verdict
  (`cmk:verdict`), and marks the cut's tickets shipped.

## How much each change needs

| Scope band | Before it is built | Unattended (`/cmk:go`) |
|---|---|---|
| `trivial` | Nothing beyond the ticket | Built |
| `patch` | A mini-spec: the change requirement plus its guard | The pipeline writes the mini-spec, builds, and heads the PR with **Decisions taken** |
| `feature` | The approved triad | Never built without it — back to Shaping |

The table's home is `skills/delivery-workflow/references/scope-band.md`.

## Any phase

- `cmk:glossary` keeps the vocabulary normative — it fires whenever a term is coined,
  contested, or drifting.
- `cmk:learn` writes non-obvious findings into `docs/knowledge/`; `cmk:rule` promotes them into
  `docs/rules/`.
- `cmk:explain` and `cmk:research` answer how something works and why it is this way.
- `cmk:delivery-handoff` passes the work to another agent at any boundary.

## Links

- Decision: [`../decisions/0001-jdk-engine-cmk-shape.md`](../decisions/0001-jdk-engine-cmk-shape.md)
- Workflow guide: [`../guides/workflow.md`](../guides/workflow.md)
- Engineering rules: [`../rules/README.md`](../rules/README.md)
