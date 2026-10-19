---
name: cmk:debug
description: Use when anything behaves unexpectedly — a failing test, an error or exception, a crash, a reported bug, wrong output, a performance regression, a flaky CI job — and before proposing or applying any fix. Produces an evidence-backed investigation whose authoritative causal confirmation is a human disposition. Not for a failure that is only on a deployed environment with no pack yet (cmk:incident).
version: 1.4.0
---

# Root Cause

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
NO AGENT-AUTHORED AUTHORITATIVE CAUSAL ACCEPTANCE
```

Guess-and-patch wastes hours and plants new bugs. This process applies to every technical issue — and applies hardest when it's tempting to skip: emergencies, "obvious" one-liners, and the moment right after a previous fix didn't work.

Causal confirmation is human-only — see **Causal disposition** (one home).

## Phase 1 — Build the feedback loop (the gate)

IF the reported failure is on a **deployed** environment (production, staging, remote dev) and no remote evidence pack exists yet: when `cmk:incident` is installed, REQUIRED SUB-SKILL: use `cmk:incident` first — that pack **is** this Phase 1 signal; when it is not, the signal is the failing request and its logs or traces read from that environment, captured before any theory. Do not `kubectl exec` or replay mutating requests against production as the loop.

Before ANY theory-building, construct and RUN a **red-capable signal**: one command — a test invocation, a script, a curl — that is red now because of this exact bug and will go green when it is fixed. Build the right feedback loop and the bug is 90% fixed; every later phase merely consumes it.

Catch yourself reading code to form a theory before this command exists? Stop. No red-capable command, no Phase 2.

Tactics for constructing one, in rough order of preference:

1. Failing test at whatever seam reaches the bug (unit, integration, e2e)
2. curl / HTTP script against a running dev server
3. CLI invocation on a fixture input, diffed against known-good output
4. Headless browser script asserting on DOM/console/network
5. Replay of a captured cmk:traceability (saved request, payload, event log) through the code path
6. Throwaway harness: a minimal slice of the system exercising the bug path
7. Property/fuzz loop over random inputs when output is "sometimes wrong"
8. Bisection harness (`git bisect run`) when the bug appeared between two known states
9. Differential loop: same input through old vs new version, diff the outputs
10. Human-in-the-loop script — last resort, only when a human must physically act; script their steps so the loop stays structured

Then **tighten it**: faster (cache setup, narrow scope — seconds, not minutes), sharper (assert the user's exact symptom, not "didn't crash"), deterministic (pin time, seed randomness, isolate filesystem). Non-deterministic bug? Don't chase a clean repro — raise the reproduction rate (loop the trigger 100x, add stress, shrink timing windows) until it's high enough to root-cause against.

Genuinely cannot build one? Say so explicitly, list what you tried, and ask the user for a reproducing environment, a captured artifact, or permission to add temporary instrumentation. Do not proceed on vibes.

**WHEN the evidence you were handed *is* the artifact** — a cpuprofile, heap snapshot, spindump, trace, or captured event log dropped in after the fact — no red-capable command exists to build, and asking for a captured artifact you are already holding is a loop. The artifact is the loop. Read it, reduce it to the one frame, retainer chain, or blocked thread that carries the symptom, and attribute that back to a file and symbol. The deliverable is a cited diagnosis, not a fix: hand it back and re-enter Phase 1 once someone can state the symptom as a command that goes red.

**Gate check:** name the command, paste one run of its red output.

## Phase 2 — Reproduce and minimise

Run the loop; watch it go red with the failure the user described (a nearby different failure = wrong bug = wrong fix). Read the complete error — full message, full stack trace, line numbers; errors often contain the answer. Check recent changes: git diff, new dependencies, config, environment.

Shrink the repro one cut at a time (inputs, config, callers, steps), re-running after each cut, until **every remaining element is load-bearing** — removing any one turns it green. A minimal repro shrinks the hypothesis space and becomes the regression test.

For multi-component systems (CI → build → deploy, API → service → DB): instrument each boundary — log what enters and exits every layer — and run once to see WHERE it breaks, before touching any fix. When the error surfaces deep in a call chain, trace the bad value backward through its callers to the ORIGINAL trigger. Never fix only where the error appears; that is treating the symptom.

**Retrieval is not the red-capable loop.** During Phases 1–2, do **not** use
`cmk:feature-graph` / retrieval as the feedback signal. The red-capable command alone
gates progress.

## After Phase 2 — feature-ownership context (before Phase 3)

When Phase 2 is complete and you have a **path or stable term**, and **before** Phase 3 hypotheses: REQUIRED SUB-SKILL: use `cmk:feature-graph` for ownership / neighbor context (seed paths/terms; `neighbors` or `blast_radius` as fits). **Grounded claims** (one home): follow `cmk:feature-graph`'s `references/grounded-claims.md` — never invent root-cause hypotheses from the envelope; never skip the red loop because neighbors look suggestive.

### Ops docs after Phase 2 (optional — never replaces the red loop)

**Only after Phase 2** (Phases 1–2 still require a red-capable command first). **Load:** `cmk:system-docs`'s `references/consult-recipe.md`. **Paths when applicable:** `docs/ops/runbooks.md` (and runbook slugs), `docs/ops/observability.md`, `docs/ops/disaster-recovery.md` — advisory Phase 3+ context only, never a substitute for the red loop. No-op when absent; suggest once `/cmk:system-docs ops/runbooks|observability|disaster-recovery` if material; never auto-invoke.

### External dependency evidence after Phase 2 (conditional — before Phase 3)

IF the minimized failure path crosses a versioned external dependency — a library, framework, SDK, database, cache, search/observability platform, cloud service, external API, CLI, provider distribution, or protocol — THEN complete this evidence gate before writing hypotheses. The Phase 1 signal and Phase 2 minimal repro remain the gate; documentation never replaces either.

WHEN this applies, read `references/external-dependency-evidence.md` and follow it exactly: runtime identity, owning documentation via `cmk:research`, a contract-diff table, a history check on disagreement, and claim status — every step gated on the Phase 1 red output, with a verbatim unresolved disposition when runtime evidence is unavailable.

## Phase 3 — Hypothesise

Write 3–5 ranked hypotheses before testing any (a single hypothesis anchors you to the first plausible idea). Each must be falsifiable with a stated prediction: "if X is the cause, then changing Y makes the bug disappear". If you cannot state the prediction, it is a vibe — sharpen it or discard it. Show the ranked list to the user (they often re-rank it instantly); don't block if they're away.

Test the smallest hypothesis first. ONE variable at a time — never stack changes.

**Runtime inspection** — a discriminating experiment under this phase, not a substitute for Phase 1. Use the hypothesis's stated prediction. Attaching is not causal acceptance (see Causal disposition).

WHEN the process under test is **local or a dedicated checkout** (red signal and minimal repro already exist): prefer a debugger, REPL, or DAP session over log spam — one breakpoint or watch beats ten prints. Browser-only failures may use DevTools/CDP the same way. Record:

```markdown
## Inspection evidence
- Prediction: <from the hypothesis under test>
- Tool: <debugger | REPL | DAP | DevTools/CDP | profiler | [DBG-…] log>
- Commands: <literal>
- Observation: <frame / locals / snapshot / paste>
- Outcome: <confirms | falsifies | inconclusive>
```

WHEN the failure lives only on a **shared deployed** environment: do not `exec`/attach there — that boundary is `cmk:incident`. Run Phase 3 probes on a local or dedicated copy, or stick to non-mutating evidence.

OTHERWISE (no debugger available, or a log trail fits better): targeted logs with a unique prefix per probe (e.g. `[DBG-x7q2]`) so cleanup is one grep — never log-everything-and-grep.

Performance or memory-class bugs: measure a baseline first (profiler, sanitizer, timing harness), then bisect; logs mislead here.

Don't understand something? Say "I don't understand X" and investigate — never pretend and guess.

Hypothesis falsified? Strike it, move to the next. Don't pile a new fix on top of a failed one.

## Causal disposition — REQUIRED before authoritative confirmation

Keep **investigation state** (`open` / `unresolved` / `falsified` / `superseded`) independent from **requested strength** (`candidate` / `probable_contributor` / `confirmed_for_scope`). Requested strength is a proposition, not an accepted result.

```markdown
## Causal disposition request
- Proposition: <one exact causal claim>
- Investigation state: <open | unresolved | falsified | superseded>
- Requested strength: <candidate | probable_contributor | confirmed_for_scope>
- Scope: <reproduced condition / environment bound>
- Support set: <commands, outputs, artifacts that bear on this proposition>
- Contradictions / alternatives still live: <none | list>
- Ask: accept / reject / supersede (eligible human only)
```

<HARD-GATE>
Do not write agent-authoritative `confirmed root cause` in a commit, PR,
or close-out. Do not invent `probable_contributor` / `confirmed_for_scope`
as an agent disposition. Do not treat Exit, a filled brief, or a prose
LGTM as human acceptance of the proposition.
</HARD-GATE>

Operational success (rollback, mitigation, error rate recovered) does not
promote accepted causal strength.

Green Phases 1–3 = investigation ready to request disposition. **Confirmed** = eligible human accepted the proposition. Those are not the same.

## Phase 4 — Fix

1. **Failing regression test first** (REQUIRED SUB-SKILL: use `cmk:tdd`) once the proposition is on the disposition request. The test goes at a CORRECT seam — one that exercises the real bug pattern as it occurred. If no correct seam exists, that is itself a finding: document it and flag it for the post-mortem; a shallow test there is false confidence.
2. **Human accept** of that exact proposition (strength + scope + support set) before landing production-code as a corrective fix. A Slack "ship it" on prose, or Phases 1–3 feeling done, is not that acceptance. In-session, the user's explicit accept of the stated proposition counts. **Deferred accept:** when an unattended caller's brief says it defers disposition to its close report (`cmk:dogfood-run` does), apply the fix and commit it on that unmerged branch marked `pending disposition`. Do not ask mid-run. The request travels in the caller's close report, and the fix does not merge before an eligible human accepts it.
3. **One fix** addressing the accepted proposition. No "while I'm here" improvements, no bundled refactoring.
4. Watch the regression test pass, re-run the full suite, re-run the Phase 1 loop against the original un-minimised scenario.

**Three failed fix attempts = STOP.** The architecture is in question, not your latest hypothesis — especially if each fix reveals new coupling somewhere else. Discuss with the user before attempt 4.

## Exit — mini-spec, cleanup, post-mortem

- Tier-1 mini-spec: add a fix requirement plus a `SHALL CONTINUE TO` guard requirement to the owning feature's `requirements.md` (or `docs/specs/fixes.md` if no feature owns it). Map the regression test to that ID in the task report / Spec review — **docs-only spine**; do not require greppable IDs in test source for consumer apps.
- Remove ALL instrumentation: grep for your `[DBG-...]` prefixes; delete throwaway harnesses.
- In the commit/PR: state the **proposition**, requested or **human-accepted** strength, scope, and support pointers. If no human disposition yet, say `requested` / `pending disposition`. **Never:** `confirmed root cause: …` as the agent's acceptance stand-in.
- Route Task: "what would have prevented this bug?" If the answer is architectural (no good seam, hidden coupling, tangled callers), write the specifics down and tell the user to run `/cmk:architecture-scan` — after the fix lands, when you know the most.
- REQUIRED SUB-SKILL: use `cmk:evidence` before claiming the bug fixed.

## Rationalizations

| Thought | Reality |
|---|---|
| "Emergency, no time for process" | Root-cause debugging is FASTER than guess-and-check thrashing |
| "It's obviously X, let me just fix it" | Seeing a symptom is not understanding a cause |
| "Quick patch now, investigate later" | The patch becomes permanent and the cause strikes again |
| "Try several changes at once to save time" | You can't tell which one worked, and one of them broke something |
| "Too simple to need a repro" | Simple bugs have root causes too; the loop takes minutes |
| "I'll add the regression test after the fix" | Untested fixes regress; the red test is the proof the fix fixes |
| "One more attempt" (after 2+ failures) | Attempt 4 without an architecture discussion is thrashing |
| "Load the feature subgraph first — that is the loop" | Phases 1–2 need a red-capable command; retrieval only after Phase 2 |
| "Neighbor card says who owns it — skip minimize" | Ownership context is advisory after Phase 2; the minimal repro still gates Phase 3 |
| "I know this library; fetch docs after the likely fix" | Runtime identity and version-matched owning docs complete before external-behavior hypotheses |
| "Exit says state the confirmed root cause — that commit line is acceptance" | Exit records proposition + disposition status; only an eligible human accepts |
| "Phases 1–3 are done; human disposition is ceremony this repo doesn't write" | The Iron Law forbids agent-authored authoritative acceptance; the disposition request is the written gate |
| "Staff LGTM'd the narrative / ship the Exit" | Prose LGTM ≠ accept of one exact proposition against its support set |
| "Rollback worked — upgrade to confirmed" | Mitigation success is operational; it does not promote causal strength |
| "I attached the debugger, so the cause is confirmed" | Attach is an experiment; acceptance is still human disposition |
| "Prod/staging — just lldb/exec to see locals" | Shared deployed envs stay on `cmk:incident` read-only; probes start local |

## Red Flags — stop

- About to put agent-authored `confirmed root cause` in a commit or PR
- About to treat Phase 4 / Exit as human causal acceptance
- About to promote causal strength because rollback or error rate recovered
- About to skip the disposition request because "the skill used to say confirmed"
- About to attach/exec a debugger on a shared deployed environment
- About to treat "we used the debugger" as accepted cause

## User signals — return to Phase 1

| The user says | It means |
|---|---|
| "Stop guessing" | You proposed fixes without a root cause — back to Phase 1 |
| "Is that actually happening?" | You assumed without verifying — gather evidence |
| "Will that show us anything?" | Your probe maps to no prediction — restate hypotheses |
| "We're going in circles" | Count your failed fixes; you're probably at the architecture gate |
| "Who accepted that cause?" | You self-certified — run the disposition request |
