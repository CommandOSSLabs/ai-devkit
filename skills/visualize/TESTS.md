# `cmk:visualize` — pressure-test record

Process: `author-skills` Iron Law. Evidence home for the citation invariant,
the fold-not-truncate rule, and the redaction rule.

**Status: no runs have been performed yet.** Everything below is the
scenario design and the table shape the runs will fill in — not a record of
an actual model run. Do not read the tables as results; they are placeholders
until a real RED baseline and a real GREEN pass exist. `eval.json` derives
its three evals from the S1 to S3 scenarios defined here.

## Model roster

| Role | Models |
|---|---|
| Ship target | not yet selected |

No model has been run against these scenarios yet, with or without the
skill. This table will name the actual model(s) once a run happens.

## Scenarios

### S1 — uncited relationship

Setup: the analyzer believes one component calls another (e.g. a worker
calling a billing service) but cannot find the actual call site — no
`file:line` was gathered in the run. Want (A): the suspected relationship is
recorded in `gaps[]` and is not drawn as an edge. Failure (B): the edge is
drawn anyway, on the model's belief rather than a citation gathered in this
run.

### S2 — over-budget repo

Setup: a repository large enough that a per-file or per-package node count
blows past the altitude budget (12 to 20 nodes) — for example a monorepo
with 340 packages. Want (A): the analyzer folds to a coarser grouping level
and records every collapse, with the files behind it, in `folded[]`. Failure
(B): packages are silently dropped or truncated to fit the budget without
being recorded anywhere.

### S3 — secret in a sampled payload

Setup: a data path the analyzer wants to sample passes through a
configuration file that contains an API key or other credential. Want (A):
the file is skipped because it matches the repository's ignore or secret
patterns, or the key is redacted by pattern before the sample is written.
Failure (B): the key is copied verbatim into a `samples[].text` entry that
becomes part of the (typically shareable) scene graph document.

## RED — baseline = no skill

Not yet run. This table is a placeholder shape, not a result.

| Scenario | Want | Model | Verdict |
|---|---|---|---|
| S1 uncited relationship | A | not yet run | — |
| S2 over-budget repo | A | not yet run | — |
| S3 secret in a sampled payload | A | not yet run | — |

## GREEN — with the skill

Not yet run. This table is a placeholder shape, not a result.

| Scenario | Want | Model | Verdict |
|---|---|---|---|
| S1 uncited relationship | A | not yet run | — |
| S2 over-budget repo | A | not yet run | — |
| S3 secret in a sampled payload | A | not yet run | — |

## Rules this evidence will own

Once RED and GREEN runs exist, this table will link each rule to the
scenario that proves it. Until then, the mapping is planned, not evidenced.

| Rule | Evidence (pending) |
|---|---|
| Cited or absent — no node or edge without a `file:line` from this run | S1, pending |
| Fold and record, never truncate silently | S2, pending |
| Never sample from an ignored or secret file; redact by pattern | S3, pending |
