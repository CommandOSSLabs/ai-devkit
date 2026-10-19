# The workflow: five commands, one board

Every piece of work is a ticket. A ticket is always in exactly one state, and each move
between states belongs to exactly one command or one person, so the board always tells the
truth about what waits on whom. The design is [`../design/sdl-phases.md`](../design/sdl-phases.md);
the rules live in `cmk:delivery-workflow`.

## The five commands

| Command | What you get |
|---|---|
| `/cmk:idea <text>` | The idea is a ticket in Shaping, with its tier and its open questions |
| `/cmk:shape #N` | The spec (or the root cause, for a bug), stopping at each approval. When the plan is approved, the ticket is Ready |
| `/cmk:go [#N…]` | Each named ticket, or every Ready one, built, reviewed and opened as a PR. One message at the end |
| `/cmk:board` | Everything waiting on you, what the agents are doing, and where the board and the repo disagree |
| `/cmk:release` | A release. The tickets it ships read `shipped` |

Every other skill still works when you ask for it by name or by what you want done. The five
are the short path.

## The states

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

You own three gates: **approve** a spec or a plan, **answer** a question on a ticket, and
**merge** a PR. Agents do the rest, and they change state and comment only on the ticket they
are working.

## A day with it

1. `/cmk:idea Vessel owners get an SMS when an invoice goes overdue` → #28 in Shaping, tier 2,
   four open questions on the ticket.
2. `/cmk:shape #28` → `requirements.md`, waiting for your approval. `/cmk:board` lists it under
   Shaping with that line. You approve; `/cmk:shape #28` again writes the design, then the plan.
   Approving the plan makes #28 Ready.
3. Before you leave: `/cmk:go`. Every Ready ticket is claimed (Building), built, reviewed and
   opened as a PR (In review). A small fix with no spec gets its mini-spec written and its
   choices listed at the top of its PR; a feature with no spec goes back to Shaping with a
   comment saying what it lacks. You get one message.
4. Next morning: `/cmk:board` → "Waiting on you: PR #14 (decision: …), PR #15, #25's question."
   You answer and merge; the merges close the tickets.
5. End of the sprint: `/cmk:release` → v0.5.0, and its tickets read `shipped`.

A bug takes the same road. `cmk:triage` confirms it and sends it to Shaping while the cause is
open. `/cmk:shape #N` runs `cmk:debug`. When you accept the cause and approve the fix
requirement and its `SHALL CONTINUE TO` guard, the ticket is Ready.

## Setting it up

`cmk:repo-setup` (or `cmk:repo-config` alone) maps the state roles to your tracker: labels on
GitHub, `status:shaping`, `status:building`, `status:in-review` and `status:shipped` for the
newer ones; workflow states plus labels on Linear. Creating labels is a tracker write, so it
asks first.
