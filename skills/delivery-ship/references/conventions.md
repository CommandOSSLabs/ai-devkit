# Resolve conventions — commit and PR

Load this file when `references/prepare.md` (`Resolve conventions`) runs. `references/prepare.md`
owns the local-authoring recipe and the Iron Law lives in SKILL.md; this
file is the **single home** of convention-source grades
(`commit_subject_grade` / `pr_structure_grade`). Finding grades live in
`references/prepare.md` only.

Produce one convention record and hold it in memory for the rest of the
session:

```
{ commit_subject_form, commit_subject_grade, pr_structure, pr_structure_grade }
```

`commit_subject_form` — the resolved shape for every commit subject this
session writes (e.g. a declared format, an inferred pattern, or the
reviewer-centred fallback shape).
`commit_subject_grade` — one of `declared` | `machine-enforced` | `inferred`,
resolved by the commit-convention ladder below and carried onto every
finding raised against `commit_subject_form`.
`pr_structure` — the resolved shape for the PR body (sections, required
fields) resolved separately from commit conventions.
`pr_structure_grade` — one of `declared` | `machine-enforced` | `inferred`,
resolved by the PR-convention resolution below and carried onto every
finding raised against `pr_structure`.

`commit_subject_form` and `pr_structure` resolve on two separate ladders and
routinely land on different grades in the same session — e.g. the commit
convention sampled from history (`inferred`) while the PR structure falls to
its own reviewer-centred fallback (`declared`). `commit_subject_grade` and
`pr_structure_grade` are independent fields for exactly this reason: never
collapse them into one shared `grade`, and never let one convention's grade
stand in for the other's.

<HARD-GATE>
Resolve conventions **at most once per session** and reuse the same
`{ commit_subject_form, commit_subject_grade, pr_structure, pr_structure_grade }`
record for every remaining commit and for the PR body in this session. Never
re-resolve mid-session, and never persist the record beyond the session — no
cache file, no write to `docs/agents/` or anywhere else. The next session
resolves fresh.
</HARD-GATE>

## Commit convention: the three-rung ladder

Walk this ladder in order and stop at the first rung that resolves:

1. **machine-enforced artifacts and declared repository documentation** —
   commitlint config, `.gitmessage`, `CONTRIBUTING.md`, or equivalent declared
   guidance. A resolution here is graded `declared` when it comes from
   documentation, or `machine-enforced` when it comes from an executable
   check (e.g. commitlint). Never inspect commit history when this rung
   resolves.
2. only when no declared or machine-enforced commit convention exists —
   sample **at most the 20 most recent non-merge commit subjects** on the
   current branch's history. Never read historical commit bodies or historical
   diffs while resolving conventions — this rung inspects the subject lines of
   the sample and nothing else. A convention resolved from this rung is
   graded `inferred`.
3. **neutral reviewer-centred fallback** — when neither preceding rung
   resolves, use a plain, imperative, reviewer-legible subject shape that
   invents no project-specific format. Grade this rung `declared`: it is the
   skill's own written default, stated here rather than sampled from the
   repository's commit history, so it takes the same non-advisory treatment
   as documentation-derived conventions.

### A mixed sample never widens

If the sampled subjects are mixed (no shared prefix/format/casing
convention) or too few to establish a pattern, fall straight to the neutral
fallback (rung 3). The sample size is fixed at 20 non-merge commit subjects;
a mixed or thin result is **never widened** to a larger sample, an older
window, or a different branch. Widening would trade a bounded, cheap read for
an unbounded one and still might not resolve — the fallback is strictly
cheaper and always resolves.

## PR convention: separate from commit history

Resolve `pr_structure` **only** from a repository **pull-request template**
(e.g. `.github/pull_request_template.md`) and declared project guidance (e.g.
`CONTRIBUTING.md` sections about PR structure).

This resolution is not derived from commit history — commit subjects say
nothing about how a PR body should be organized, and reading history for this
purpose would be reading data that cannot answer the question.

When no template or declared guidance exists, use the reviewer-centred fallback
below and grade it `declared`: it is the skill's own written default, not a
claim derived from repository history. A repository template always wins over
it; this shape is what fills the vacuum, not a house style to impose.

**Reviewer-centred fallback.** These sections, in this order, each dropped when
it would be empty:

| Section | Carries |
|---|---|
| `## Why` | the intent, and why this approach fits |
| `## Scope` | facts read off the diff — real symbols and paths, both sides of a rename, what is in and out when the boundary matters |
| `## Tradeoffs` | real choices only; no choices means no section |
| `## Blast Radius` | who and what the change touches, and why that is safe or risky |
| `## Verification` | how each check ran, at what rigor, and **its outcome** — never only the command name |

Screenshots and recordings attach after the sections, and only where they prove
a claim the text makes. Do not emit `## Summary` or `## Test plan`: the first
restates the diff a reviewer can already read, and the second names commands
without saying what they returned — which is the half that carries the proof.

## Grading and advisory treatment

| Grade | Source | Treatment of findings raised against it |
|---|---|---|
| `machine-enforced` | An executable check exists (e.g. commitlint) | **not run** when this session did not execute the check; **verify-routed** through the existing `cmk:evidence` failure path when the check ran and failed |
| `declared` | Written documentation (`.gitmessage`, `CONTRIBUTING.md`, PR template) **or** the skill's own reviewer-centred fallback shape (commit-ladder rung 3, or the PR-structure fallback when no template or guidance exists) | `reported` |
| `inferred` | Rung 2 — sampled from commit history | Labelled **inferred** and any finding raised against it is treated as **advisory** only — never a hard gate |

The "Treatment" column names the **finding** grade(s) a convention of that
source can produce — it is not a fourth convention grade. `references/prepare.md`
defines a four-value finding vocabulary — `advisory`, `reported`, `not run`,
`verify-routed` — kept explicitly distinct from this file's three-value
convention-record grades, `commit_subject_grade` and `pr_structure_grade`
(each independently one of `declared` | `machine-enforced` | `inferred`): a
`declared` convention's findings are always `reported`, an `inferred`
convention's findings are always `advisory`, and only a `machine-enforced`
convention can produce `not run` or `verify-routed`, depending on whether its
check executed this session. Apply this table to `commit_subject_grade` and
`pr_structure_grade` independently — a finding raised against
`commit_subject_form` takes its treatment from `commit_subject_grade`, and a
finding raised against `pr_structure` takes its treatment from
`pr_structure_grade`, even when the two grades differ in the same session.

## No persistent cache

Nothing resolved here is written to disk. The record lives only in the
session's working memory for the phases and commits that follow. There is no
persistent cache across sessions — the next `cmk:delivery-ship` invocation
resolves fresh from rung 1.
