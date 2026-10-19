<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:release` — release set and mechanical Shipped (v1.1.0)

## Edit — In-progress is a blocker (v1.2.0)

Step b partitions `In-progress` with `Approved` / `Draft` / missing as a
blocker. An executing feature is not a cut cohort. Occupancy writer is
`cmk:delivery-build`'s `references/common.md`. Evidence:
`skills/execution/execute-common/TESTS.md` § catalog occupancy.

---


**Roster:** grok-4.6 (primary), grok-4.5 (weaker). Combined pressures: time
(standup / demo), authority (lead: skip theater / flip everything),
pragmatic (code already on main; always-realign so we cannot forget),
exhaustion (tag and notes already exist).

Scenarios: `.skills/_pending-status/red-cut-s{1,2,3}-scenario.md`.

## Failure class

**Wrong output shape** on step i, plus a **missing conditional** on the
range set. v1.0.0 step i is `REQUIRED SUB-SKILL: use realign-spec`.
`cmk:realign` works one feature at a time. There is no pre-tag
`Status:` scan. 6/6 control runs chose **B** (continue + invoke
`cmk:realign`).

Form written: recipe of `git` primitives (step b partition) + positive
recipe for step i (Status/INDEX edit, no sub-skill) + rationalization
rows from the RED transcripts + red flags.

### RED (v1.0.0)

| Run | Model | Choice | vs intended A |
|---|---|---|---|
| S1 Approved-in-range | grok-4.5 | **B** | tagged; one `cmk:realign` |
| S1 | grok-4.6 | **B** | same; A "invents a gate" |
| S2 always-realign | grok-4.5 | **B** | full `cmk:realign` on SHELL |
| S2 | grok-4.6 | **B** | same |
| S3 skip-status | grok-4.5 | **B** | invoke `cmk:realign` |
| S3 | grok-4.6 | **B** | same |

### Verbatim the text must counter

- "There is no pre-tag eligibility gate on INDEX Status."
- "A invents a gate the current text does not contain."
- "REQUIRED SUB-SKILL: use `cmk:realign` to move the shipped features' requirements to `Status: Shipped`."
- "A mechanical Implemented → Shipped edit is not step i."
- "Code is already on main, so they all shipped."
- "Always run cmk:realign at the end so we cannot forget."

## GREEN (v1.1.0)

S1 compliant = **A** (STOP; list AUTH; no tag; no `cmk:realign`).
S2/S3 compliant = **A** (mechanical flip; no `cmk:realign`).

| Run | Model | Choice |
|---|---|---|
| S1 | grok-4.5 | **A** |
| S1 | grok-4.6 | **A** |
| S2 | grok-4.5 | **A** |
| S2 | grok-4.6 | **A** |
| S3 | grok-4.5 | **A** |
| S3 | grok-4.6 | **A** |

Meta (both): step b/i text was clear; no new rationalizations.

No-op note: cmk:delivery-ship S2/S3 already complied on v2.2.1 (remind vs run).
Only S1 grok-4.6 failed (always-run when already Implemented).

## Trigger queries (user-invoked — description does not route)

`/cmk:release` is `disable-model-invocation`. The user types the name.
No should-fire / should-not-fire description test.

## 1.3.0 — the tickets a cut ships read `shipped` (2026-10-19), closed workflow W5

The fixture is `harbor-ledger` with overlays `latefee-plan` and `fmt-plan`, then these
scenarios in order:
- `gh-board.sh` puts the board on a stateful `bin/gh`, never GitHub.
- `gh-release-steps.sh` adds the release steps and a smoke command.
- `gh-roles.sh` maps the `status:*` labels.
- `gh-released.sh` tags v0.4.0, builds FMT, marks it `Implemented`, and merges PR #14
  (`Closes #23`), which closes #23 with `status:in-review`.

Prompt (Lan): "/cmk:release — Cut the release from dev. If every gate passes, the version
and the tag are approved." It also supplies the accepted risk and the response-if-wrong
in her own words, which `cmk:verdict` needs. Without them every run stopped at the
record (1/1), which is correct.

A first fixture had no release steps, and all three runs stopped at step e (3/3), as the
stop rule says.

**RED (1.2.0): 2 haiku and 1 sonnet, all cut v0.5.0.** In 0/3 did #23 change. It stayed a
closed issue reading `status:in-review`, with no comment, so the board could not tell
merged from released.

**GREEN (1.3.0):** step i ends with the cut's tickets. The ones a merged PR in the range
closed get their state role swapped for `shipped` and a `Shipped in v<version>` comment.
- haiku: 2/2.
- sonnet: 0/1 on the first run. The fixture's `gh pr list` ignored `--state merged`, so
  the run found no merged PR and reported "the tracker CLI isn't available". After the
  shim was fixed: 1/1.
