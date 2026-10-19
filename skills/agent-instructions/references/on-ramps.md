# On-ramps

Seed for a consuming repo's `docs/guides/on-ramps.md` (`SKILL.md` § Verify). Copy it as is;
the repo may then edit it.

````markdown
# On-ramps

**One home** for which `cmk:*` skill starts a situation. Root agent instructions point
here; they do not restate this table.

| Situation | Start here |
|---|---|
| An idea to put on the board | `/cmk:idea` |
| Turn a ticket into an approved spec, or a bug into a confirmed cause | `/cmk:shape #N` |
| Build ready tickets to pull requests | `/cmk:go` (or `/cmk:go #N`) |
| What waits on me, what agents are doing | `/cmk:board` |
| Cut a release | `/cmk:release` |
| Size a change, decide what it needs before building | `cmk:scope` |
| Requirements and acceptance criteria | `cmk:requirements` |
| How to build it (feature, system, track) | `cmk:design` |
| Plan an approved design into tasks | `cmk:delivery-spec-plan` |
| Something is broken and the cause is unknown | `cmk:debug` |
| Write the test first | `cmk:tdd` |
| Prove a claim before calling it done | `cmk:evidence` |
| Review a diff or PR | `cmk:delivery-review` |
| Open the PR, merge, keep or discard a branch | `cmk:delivery-ship` |
| Understand how something works | `cmk:explain` |
| Why the code is this way, or an external fact with citations | `cmk:research` |
| Record a hard-to-reverse decision | `cmk:adr` |
| Lock a term, vocabulary drift | `cmk:glossary` |
| Turn a conversation or spec into tickets | `cmk:discover-efforts` |
| Hand off to another agent | `cmk:delivery-handoff` |
| New, adopted or drifted repo setup | `cmk:repo-setup` |
| Vendor skills, sync upstream | `cmk:agent-vendors` / `cmk:sync` |

Rules of thumb:

> A feature needs its approved spec before it is built; a patch needs its mini-spec
> (`cmk:delivery-workflow`).

> When two skills both seem to apply, the delivery or process skill wins; it calls the
> docs skill.
````
