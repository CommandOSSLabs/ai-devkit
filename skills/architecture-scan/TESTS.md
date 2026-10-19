<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# cmk:architecture-scan — tests

## RED — the scan never took a posture (2026-09-16, Sonnet ×3, v1.1.0)

**Hypothesis.** The scan judges structure by reading code. It never counts what
the repo already states and enforces, so nothing it produces can be compared to
the previous scan.

**Fixture.** A local clone of a real 3,027-file monorepo (Rust backend + TS
frontend) at commit `ab6d3605`, which carries `docs/design/system.md` with
ten **ARCH-N** invariants, exactly one of them defended by a check
(`scripts/tests/arch-crate-layering.sh`, installed the same day). Invoked as
`/cmk:architecture-scan` through `claude -p`.

**Result: 3/3 produced a report with no posture in it.** Across the three runs:

| Asked of the report | Run 1 | Run 2 | Run 3 |
|---|---|---|---|
| rules mechanised / total | absent | absent | absent |
| prose-only invariant IDs named | absent | absent | absent |
| change-locality numbers | absent | absent | absent |
| anything a later scan can compare | absent | absent | absent |

Run 1 did reach for `git log --since="180 days ago"` unprompted and found the
repo's loudest co-change pair, so *using history at all* was not the gap — the
gap was that nothing was counted, named, or recorded. Run 2 mentioned
"ARCH-1…10" once in prose and never asked which of them a check defends.

The three runs also disagreed almost completely on candidates — gateway
composition root / desktop overlays / FinderApp glue (run 1), infra_facades /
capability fan-out / `decide()` (run 2), raw SQL bypass / persistence→memory_kernel
/ PersistenceFacade (run 3). Same repo, same model, three scans, near-disjoint
findings: without a fixed measured layer each scan is a fresh opinion.

## GREEN — v1.2.0, step 1 as a runnable recipe (2026-09-16, Sonnet)

First attempt wrote step 1 as prose ("From `git log …`: median files per commit,
…"). **It was skipped**: the run opened with "I'll start by reading the domain
context and ADRs" — step 2's own first line said to read `docs/requirements/glossary.md` *first*, so
two instructions competed for the opening move and the familiar one won. Fixes,
in order: (1) step 1 became one command, `scripts/posture.py`, shipped with the
skill; (2) step 1 absorbed the context reading and says the scan opens there;
(3) step 2 no longer claims the first move.

**Result: compliant.** First action is the script; `.skills/scan-architecture/posture.json`
written; the report opens with a Posture section carrying `1 / 10`, the nine
prose-only IDs, `4.0` / `1.0` / `28.1%`, the checker's eight dated exceptions, and
the 14×/13× co-change pairs. The chosen candidate is the config-mirror behind
those pairs. Closing line, unprompted by any example:

> Cheapest next mechanised check: give ARCH-6 … a grep-based ratchet, reusing
> ARCH-1's own dated-exception-list pattern … moves the mechanised count from
> 1/10 to 2/10 before the next scan.

## RED on the weakest model, twice (2026-09-16, Haiku 4.5)

Sonnet never exposed either of these; both came from Haiku and both are fixed.

**1. The script measured the wrong repository, silently.** Haiku ran it as
`cd /Users/jayden/.claude/skills/scan-architecture && python3 scripts/posture.py`.
The script resolved the repo from its working directory, found none, fell back to
`os.getcwd()`, printed a clean-looking `0 commits · 0/0 rules`, and wrote
`posture.json` **inside the installed skill folder**. A posture that looks valid
and measures nothing is worse than no posture. `posture.py` now resolves the repo
with `git rev-parse --show-toplevel`, exits 2 when there is none, and says the
working directory decides which repo is measured. SKILL.md shows the command as
`cd <repo root> && …`.

**2. The strip was retyped from memory, not copied.** With a correct
`posture.json` on disk (`1/10`, `28.1%`), Haiku's page read `Rules Mechanised
0/0 · First scan · Median files/commit — No recent commits indexed`, while its
chat summary said "1 of 10 rules mechanised (ARCH-2 only)" — the mechanised ID is
ARCH-1. Three different answers in one run. SKILL.md now requires the strip be
built from `posture.json` field by field, and names the failure: a strip reading
`0/0` or `first scan` while the file holds real numbers is a fabricated posture
that poisons the delta of every later scan.

**GREEN after both fixes (Haiku):** strip matches `posture.json` exactly —
`1 / 10`, nine prose-only IDs, `4.0`, `1.0`, `28.1%` — and candidate 1 is the
config-mirror pair. Both roster models comply.

## Not written

`posture.py` reports no thresholds and no score. File size confounds most code
metrics (El Emam et al., TSE 2001) and individual smells stop predicting
maintenance cost once size and churn are controlled (Sjøberg et al., TSE 2013);
what survives is coupling, where change concentrates, and whether a rule is
defended. Research notes behind this: `.skills/research/2026-09-15-codebase-design-principles.md`
and `.skills/research/2026-09-15-agent-friendly-codebase-design.md` (local).
