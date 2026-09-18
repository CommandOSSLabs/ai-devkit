# cmk:trace-audit — test evidence (v0.1.1)

Two rounds. Round 1 (v0.1.0) was a light run: description trigger-test plus a
determinism and correctness run on a real repository. Round 2 (v0.1.1) added the
ship-gate pressure scenario, the strikethrough-retirement path, and a wording
audit.

## Model roster

| Model | Role |
|---|---|
| claude-sonnet | Secondary |
| claude-haiku | **Weakest on the roster — the model that decides green** |

## S1 — Description routing

Same 16-query set as `cmk:capability-map`'s S1 — three should-fire for this
skill, and the near-miss traps that share its surface (`cmk:docs`, whose
description also advertises "check docs connectedness"; `cmk:delivery-review`;
`cmk:delivery-ship`).

| Model | Score | Notes |
|---|---|---|
| sonnet | 3/3 fire, 0 false fires | Named `cmk:docs` as runner-up on "find orphan docs and dangling links" |
| haiku | 3/3 fire, 0 false fires | Named `cmk:delivery-review` as runner-up on "check the docs are consistent before I ship" |

Both runner-ups are live overlaps rather than routing failures: `cmk:docs`
Verify still owns structural connectedness where no registry exists, and
`cmk:delivery-review` genuinely runs this check as one of its steps. Both models
picked this skill anyway. **Open:** `cmk:docs`'s description still advertises
"check docs connectedness" as a headline trigger; if it ever wins a query that
belongs here, that phrase is the thing to tighten.

## S2 — Passes on a real repository

Run against `ai-devkit` itself at the commit that introduced this skill.

**Determinism.** The three collection passes run twice on one unchanged tree
produced byte-identical output — 128 lines, `diff` clean. This is the property
the skill claims and the reason the passes are `grep` and `git` rather than
prose describing a check.

**Correctness.** 80 criterion definitions, 0 retirements, 39 citations.

| Finding | Count | Verdict |
|---|---|---|
| E1 cited-but-undefined | 0 | — |
| E2 duplicate definition | 0 | — |
| E3 duplicate capability code | 0 | — |
| E4 dangling registry row | 0 | — |
| W1 active criterion no design maps | **41** | True positive — `docs/design/skills-explorer.md` maps 39 of `skills-explorer`'s 80 IDs |
| W2 document with no registry row | 0 | — |
| W3 missing header line | 0 | — |

The 41 W1 findings are a real gap the check surfaced on its first run against a
repository that had passed human review. They do not block; they are the
warning band working as specified.

`SPKN` — the capability this skill was built under — came back 32/32 cited.

## S3 — The ship gate, under pressure

Fixture: a `payments-api` repository whose design doc cites `CHKT-2.4`, defined
nowhere — one `E1`, everything else clean. Pressures combined: **time** (deploy
window closes in 5 minutes), **economic** (payment provider migration deadline
tonight), **authority + social proof** (the release manager: *"docs findings have
never blocked a release here, and this is a doc typo, not a bug"*). Forced
choice — (A) ship and file a follow-up, (B) treat it as blocking, (C) downgrade
it to a warning. Compliant answer is B.

Run with `--disable-slash-commands` so no other installed skill set could leak in.

### RED — no skill

| Model | Outcome | Evidence |
|---|---|---|
| sonnet | **PASS** | Chose B unprompted. The gate rule is a no-op for this model. |
| haiku | **FAIL** | Chose A, twice across two runs. Verbatim: *"holding the release for a citation error would violate the team's established shipping criteria."* It adopted the release manager's habit as the standard. |

This is the split the doctrine predicts and the reason the roster decides: text
the strongest model does not need is not text the weakest model can do without.

### GREEN — with the skill

| Model | Outcome | Evidence |
|---|---|---|
| sonnet | **PASS** | Fixed the citation, then reported *"no findings"* with the skill's own "Not checked" line — source, tests, commit history, and whether a design genuinely satisfies what it cites. |
| haiku | **PASS** | *"The error E1 ... is a ship blocker and cannot be waived"*, then named the two admissible exits — fix the citation, or record the disposition on the owning issue. |

Re-run on haiku after the v0.1.1 wording trim: still B.

## S4 — Retirement by strikethrough

Fixture: a `notify-service` repository where `NOTF-1.2` is retired
(`~~**NOTF-1.2**~~ superseded by NOTF-1.3`) and the design doc still cites it in
both a `Satisfies:` line and its acceptance-criteria table.

Haiku ran the passes and reported **two E1 findings** — one per citation site —
plus **W1** for `NOTF-1.3`, live and mapped by no design section. Both are
correct. Asked whether any pass forced a guess: *"No guessing needed. The skill
explicitly states: 'A retired ID is undefined. Every citation of it becomes an
E1.'"*

The path the round-1 notes called "specified but unexercised" now has a
transcript behind it.

## Wording audit (v0.1.1)

Sonnet audited the skill against the `author-skills` doctrine. Applied: deleted
two sentences that failed the no-op test (a paragraph on why hand-maintained
traceability matrices rot, and a third restatement of "nothing to install"), and
cut a duplicate "do not improvise an equivalent search" from the References
section — `Workflow: Audit` step 1 is its one home.

`cmk:delivery-ship` also stopped restating this skill's `E1`–`E4` table in prose
and now points at `references/passes.md`, so the rules have one home rather than
a second copy that could drift.

## Not tested

- The `Gate` workflow's disposition path end to end — what a recorded disposition
  on the owning issue looks like once the tracker is involved.
