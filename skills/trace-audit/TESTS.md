# cmk:trace-audit — test evidence (v0.1.0)

Light run per `author-skills`: description trigger-test plus a determinism and
correctness run of the passes on a real repository.

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

## Not tested

- Pressure scenarios against the **Gate** workflow ("one error, everything else
  is green — ship it"). No RED transcript behind that rationalization row yet.
- The strikethrough-retirement path (`E1` firing on a struck-through ID): no
  requirements document in this repository has retired an ID, so the rule is
  specified but unexercised.
- Behavior when `docs/capabilities/INDEX.md` is absent — specified as a reported
  skip, not yet run against a repository without one.
