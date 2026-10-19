<!-- Ported from jdk `docs/guide/workflow.md` and `templates/agents/triage-labels.md` (ADR 0001). -->
# The closed workflow

Every ticket is in exactly one state. Each move between states belongs to exactly one
command or one person, so the board always tells the truth about what waits on whom. The
repo's own label or Linear-state name for each role is in `docs/agents/triage-labels.md`
(written by `cmk:repo-config`).

```
          you                        you                       you
          approve                    answer                    merge
             ▼                          ▼                         ▼
Inbox ──► Shaping ──► Ready ──► Building ──► In review ──► Done ──► Shipped
  │          │          │          │   ▲          │
  │          ▼          │          ▼   │          ▼
  │     Needs input ◄───┴──── Needs input ◄── (review needs you)
  ▼
Won't do                 Human-only
```

| State | Role | Moved in by | Moved out by |
|---|---|---|---|
| Inbox | `needs-triage` | `/cmk:idea`, `cmk:triage` | `/cmk:idea` (after framing), `cmk:triage` |
| Shaping | `shaping` | `/cmk:idea`, `/cmk:shape`, `/cmk:go` (a ready ticket that fails the band's docs bar) | **the person approves**; then `cmk:delivery-spec-plan` publishes it Ready |
| Ready | `ready-for-agent` | `cmk:delivery-spec-plan`, `cmk:discover-efforts`, `cmk:triage` | the build that claims it |
| Building | `building` + assignee | the build's tracker sync (`cmk:delivery-build`) | `cmk:delivery-ship` when the PR opens |
| In review | `in-review` | `cmk:delivery-ship` | **the person merges**; `Closes #N` closes it |
| Done | closed | the merge | `/cmk:release` |
| Shipped | `shipped` | `/cmk:release` | — |
| Needs input | `needs-info` | whoever asks the person a question, on the ticket | **the person answers** |
| Human-only | `ready-for-human` | `cmk:triage` | the person |
| Won't do | `wontfix` | the person, or `cmk:triage` / `cmk:backlog` on their word | — |

The person owns three gates: **approve** (a spec, a plan, or a Notion draft when `Draft
surface` is `notion`), **answer** a question on a ticket, and **merge** a PR. Agents do the
rest, and write state and comments only on the ticket they are working.

Every triaged ticket carries exactly one category role (`bug` / `enhancement`) and one state
role. A skill that moves a ticket removes the old state role in the same edit.

## On Linear

Each role maps to a workflow state where the team has one (Backlog, Todo, In Progress, In
Review, Done) and to a label where it does not (`shipped`, `needs-info`, `ready-for-human`
become labels beside the state). The mapping is in `docs/agents/triage-labels.md`; a skill
reads it there and never assumes a state name.
