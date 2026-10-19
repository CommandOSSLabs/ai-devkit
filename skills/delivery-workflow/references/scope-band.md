# Scope band

**One home** for band names, When meanings, the docs bar before implement, the unattended
rule, and the one-execution-engine rule. Delivery skills point here; they do not restate the
table. The bands are `cmk:scope`'s tiers 0, 1 and 2 under their delivery names.

## Bands

| Band (tier) | When | Docs bar before implement |
|---|---|---|
| `trivial` (0) | Copy, typo, label, or config with no behavior change | None. The tracker AC is the record |
| `patch` (1) | A fix or behavior change of about half a day or less on a surface an approved spec or area doc already owns | The mini-spec: the change requirement plus its `SHALL CONTINUE TO` guard, appended to the owning `requirements.md` (or `docs/specs/fixes.md`, or the owning `docs/requirements/<topic>.md`) — `cmk:requirements` tier-1 mode — and named on the ticket as `Requirements covered:` |
| `feature` (2) | A new area, multi-slice work, or anything no spec owns | The triad `docs/specs/<date>-<feature>/` with `requirements.md`, `design.md` and `tasks.md` all `Status: Approved` |

State the band **out loud** when work starts and again at the implement boundary. Changing
band mid-flight is a tracker reconcile, not a silent shrink. When a change could be either
`patch` or `feature`, it is `feature`: a new data field, a new endpoint, a change to a
contract an outside reader parses, or a second surface makes it `feature`.

## Unattended work (ADR 0001 decision 4)

In an unattended run (`/cmk:go`, `cmk:delivery-pipeline`):

- `trivial` — build it.
- `patch` with no mini-spec yet — write the mini-spec yourself, plan and build. Head the PR
  body with **Decisions taken** listing every choice the person did not make (the
  requirement wording, the guard, any behavior picked between options), so the merge gate
  is where they are reviewed.
- `feature` that fails its docs bar — never build. Move the ticket to Shaping and comment
  which of the three files is missing or not Approved.

## Gate

Do not start retained implementation while the docs bar for the stated band is unmet.
Authority pressure ("eng lead said skip requirements"), schedule pressure ("we're behind"),
and "tracker AC is enough for a feature" do not waive a `feature` bar — move it to Shaping,
or record an explicit exemption with owner on the ticket.

## One execution engine

For a given change, one implement path runs: `cmk:delivery-build`, or a single
human-directed session. Do not run a second autonomous implement orchestrator on the same
branch. Tracker updates and ship are not a second implement engine.
