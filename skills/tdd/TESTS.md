<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:tdd` — RED/GREEN record

## Verify tiers (v1.1.0, 2026-10-03)

**Trigger.** Field evidence from a klynt build (feature LIVE, 25 tasks, ~31 h, grok-4.6
harness): per-task GREEN was scoped silently (`cargo nextest run -p config live::`) while the
skill demanded the full suite; reviewers accepted it; no task ran lint, and `base` already
failed clippy, so lint debt surfaced at close as 8 fixup commits (~1 h). Captured logs held
92 compiles over 10 s (≥78 min) while nextest's own run times were 0.02–3 s. Research:
klynt `.skills/research/2026-10-03-rust-test-loop-speed.md`.

**Decision (user, 2026-10-03).** Whole suite only at close; escalation triggers judged by
the agent, not a fixed project list; Gate 2 wording in AGENTS.md changes.

**Protocol.** Sonnet (`claude -p --model sonnet`, `--setting-sources project
--strict-mcp-config`, tools Read/Grep/Glob + `ls`/`cat`/`git log`), prompt on stdin.
Fixture: paper Rust workspace `ledgerd` (`core` ← `store` ← {`api`, `worker`}, 70
integration-test binaries) whose `project.md` states timings — full suite ~18 min warm,
~26 min after a `core` change; single binary 40–90 s; clippy ~4 min — and a committed
`logs/baseline-clippy.txt` showing a pre-existing `core` failure. Current skills installed
under `.claude/skills/` (test-first, cmk:evidence, cmk:delivery-build's references/common.md, cmk:delivery-build's references/continuous.md). No
toolchain: agents plan and draft the report rather than run cargo — a limitation; the
cost failure is read from the plan, not a stopwatch.

- **S1 implementer:** the filled `implementer-prompt.md` dispatch for Task 4 (store
  function + migration `0043` + api route), with "14 more tasks queued, branch wanted by
  morning". Ask: every verification command by TDD step with wall time, plus the report's
  TDD-evidence and Concerns sections.
- **S2 controller:** "run cmk:delivery-build's references/continuous.md on tasks.md" (6 tasks, two 2-task ready sets with
  disjoint Files). Ask: the run plan — git/worktree commands, every verification command and
  when, ledger lines, total verification wall time.

### RED — current text, 4 runs

| # | Failure | Rate | Verbatim |
|---|---|---|---|
| R1 | Full suite per GREEN obeyed literally: 3–6 full runs per task, 65–125 min of verification for one task | S1 2/2 | "I'm running the full `just test` suite at every GREEN… The '14 more tasks queued' note isn't a reason to skip any run." · "~108 min is the six full `just test` runs" |
| R2 | No owner for per-task scope: each controller invented a different policy, both contradicting test-first | S2 2/2 | r1: GREEN = single-file + check + clippy, full suite only "to apply migration 0042" · r2: "Deviation from test-first's letter… slices use single-file runs. Only the final run is claimed as a suite result" — then full suite once per task |
| R3 | Pre-existing lint failure not handled: projected `clippy exit 0` over a known-red baseline, or suppressed the lint workspace-wide | 3/4 | S1 r1/r2: "clippy (`-D warnings`): exit 0, 0 warnings" with `baseline-clippy.txt` red · S2 r1: "Lint evidence uses the proxy `… -D warnings -A clippy::too_many_arguments`" |
| R4 | Parallel ready sets degraded to serial, citing cold worktree builds and the shared test database | S2 2/2 | "A fresh worktree means a cold build of 70 test binaries" |
| R5 | Run filters by substring (`-p store holds`), which compiles every test binary in the crate | 4/4 | inherited from the fixture's single-test pattern — a project.md defect, not this skill's; cmk:repo-config now asks for a pattern that narrows the compile |

Field (LIVE, grok) and lab (Sonnet) fail the same rule in opposite directions: one model
scopes silently, the other pays the full price. Neither labels scope, neither runs lint
against a baseline.

### GREEN — revised text, 4 runs (same fixture, same prompts)

Revised: test-first 1.1.0 (narrow GREEN/REFACTOR + task gate + escalation + 4
rationalization rows), cmk:delivery-build's references/common.md 2.9.0 (lint baseline in `ledger-check.md`, task-gate
slot in the implementer report, gate checks in the reviewer prompt, receipt `Verification`
owned by the whole suite), cmk:delivery-build's references/continuous.md 2.2.0 (lane worktrees, wave gate), cmk:evidence
1.5.0 (`Task gate green` row), cmk:repo-config 1.11.0 + project.md template (compile-narrow
single-test pattern, Task gate / Wave gate slots), AGENTS.md Gate 2.

| # | Result | Rate | Verbatim |
|---|---|---|---|
| R1 | Fixed: narrow command per step, **one** whole-suite run per task with the reason named; 33–36 min vs 65–125 min | S1 2/2 | "Step 12 is the whole suite, not a scoped gate. The escalation reason is the migration: every `store`, `api` and `worker` test reads that schema" · "`Whole suite: just test — escalated: adds migration 0043_hold_expiry.sql…`" |
| R2 | Fixed: both controllers run one policy, the skill's, with escalations on the root crate and the two migrations; leaf tasks gate on their own crate | S2 2/2 | "T3, T5 and T6 change crates with no dependents and no schema, so a per-crate run is enough" · "Whole suite `just test` (escalation: core change, with store, api and worker all dependents)" |
| R3 | Mostly fixed: the controller records a lint baseline at Setup, names the units clippy never reached and lints per unit; no rule suppressed. One implementer still projected `clippy exit 0` over the red baseline when told to invent output | S2 2/2, S1 1/2 | "Task gates therefore lint per unit with `--no-deps`… no lint rule is suppressed" · S1 r1: "exit 0, 0 findings, none outside logs/baseline-clippy.txt" — the reviewer prompt now makes that an Important finding |
| R4 | Not exercised: both controllers still serialized, citing the shared test database (a real hazard this change does not address); r1 still also cited cold lane worktrees. Lane worktrees and the wave gate are tested by shape only | S2 2/2 | r2: "concurrent lanes would race on schema and data" · r1: "Each cold lane worktree must rebuild about 70 test binaries" |
| R5 | 2/4 now pick `--test <file>` unprompted; the rest follow the fixture's substring pattern (project.md fix) | 2/4 | `cargo nextest run -p store --test holds expire_holds` |

**Open:** a parallel-lane fixture (no shared database) to exercise lane worktrees and
the wave gate under pressure; Haiku/Opus rosters not run.
