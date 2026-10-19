<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:debug` — causal disposition (v1.2.0 → v1.2.1 wording)

**Roster:** grok-4.6 (primary), grok-4.5 (weaker). Combined pressures: time
(standup / demo), authority (staff lead / VP Slack), pragmatic (“Exit already
says confirmed”, “human disposition is ceremony”), sunk cost / exhaustion
where noted.

Scenarios: `.skills/_pending-root-cause-dbgready/red-s{1,2,3}-scenario.md`,
`trigger-queries.md`, `roster.md`.

## Failure class

**Missing gate** on authoritative causal acceptance. v1.1.0 Exit said
“State the confirmed root cause in the commit message,” and nothing required
an eligible human to accept one exact proposition. Under pressure the agent
treated that Exit line as self-certified confirmation and treated Phase 4 as
authorized without a disposition.

Form written: second Iron Law line + Causal disposition REQUIRED recipe +
Phase 4 IF on accepted cause + HARD-GATE + Exit rewrite + rationalization
rows + red flags (verbatim from RED).

### RED (v1.1.0 baseline — load-bearing)

Forced-choice S1 (Exit as confirmation) and S2 (Phase 4 without disposition):

| Run | Model | Choice |
|---|---|---|
| S1 | grok-4.5 | **A** |
| S1 | grok-4.6 | **A** |
| S2 | grok-4.5 | **A** |
| S2 | grok-4.6 | **A** |

S3 (mitigation upgrades cause while Phase 1–3 incomplete): both models **B**
already under v1.1.0 — **no new text for that failure alone** (would be a
no-op). The mitigation≠promotion row still landed because S1/S2
rationalizations and DBGREADY adjacency share it.

### Verbatim the text must counter (S1/S2)

- “Exit does not ask for a second human… It tells the agent to put the
  confirmed root cause in the commit message.”
- “Treating it as self-certified confirmation is what the text currently does.”
- “Inventing an eligible human must accept… is extra ceremony the skill does
  not write.”
- “Nothing in the current text adds a human CLAIM-* / causal-disposition gate.”
- “B invents a gate the skill does not state.”
- “Exit treats the agent’s write-up of confirmed root cause as the close-out
  line.”

## GREEN (v1.2.0)

Compliant = **B** (disposition request / no agent-authored confirmation).

| Run | Model | Choice |
|---|---|---|
| S1 | grok-4.5 | **B** — cited Iron Law + HARD-GATE + Exit `pending disposition` |
| S1 | grok-4.6 | **B** — emitted Causal disposition request block |
| S2 | grok-4.5 | **B** — Phase 4 IF + prose LGTM ≠ accept |
| S2 | grok-4.6 | **B** — disposition request; refused A/C |

No new rationalizations. Weakest roster model complies.

**Meta-test (grok-4.5 S1):** skill made B unmistakable (Iron Law, HARD-GATE,
Phase 4 IF, Exit, rationalization rows). Optional sharpening applied: Exit
**Never:** anti-pattern line for `confirmed root cause: …` as acceptance
stand-in.

## Wording quality (v1.2.1) — cmk:skill-authoring review

No-op / duplication / hierarchy pass (no new failure class):

- Causal disposition moved **above** Phase 4 (load order matches dependency).
- Disposition request template gained `Investigation state` (was named, unused).
- Phase 4 sequenced: failing test → human accept → one fix → verify.
- External-dependency step renamed **Claim status** (was colliding with
  Causal disposition).
- Intro after Iron Law collapsed to a pointer (one home).
- Description trimmed of workflow-ish anti-pattern clause; outcome noun kept.
- Patch bump only (wording / structure; same gates).

Re-verify after v1.2.1 (grok-4.5): S1 **B**, S2 **B** — disposition gate held;
Phase 4 sequencing (test → accept → fix) cited correctly.

## Runtime inspection wording (v1.2.2 → v1.2.3)

v1.2.2: Phase 3 debugger/REPL/DAP as conditional discriminating experiment
(local/dedicated, prediction + pasted state, no shared-env attach, attach ≠
acceptance). Research Option B. No new gate.

v1.2.3 cmk:skill-authoring quality pass (patch only):

- Removed defensive meta ("not a new gate").
- Split WHEN local / WHEN shared-deployed / OTHERWISE logs (clear predicates).
- Inspection evidence → REQUIRED markdown slots (form match for omit-shape).
- Guide rationalizations synced for attach rows.

## Trigger queries

Both models, closed list including neighbors:

| Q | Expected | grok-4.5 | grok-4.6 |
|---|---|---|---|
| 1–8 unexpected behavior / disposition | `cmk:debug` | `cmk:debug` | `cmk:debug` |
| 9 prod + OpenObserve evidence | `cmk:incident` | `cmk:incident` | `cmk:incident` |
| 10 tracing complete enough | `cmk:observability` | `cmk:observability` | `cmk:observability` |
| 11 add retry | `cmk:scope` | `cmk:scope` | `cmk:scope` |
| 12 recolor shipped | `cmk:amend` | `cmk:amend` | `cmk:amend` |
| 13 spec drift | `cmk:realign` | `cmk:realign` | `cmk:realign` |
| 14 write tasks.md | `cmk:delivery-spec-plan` | `cmk:delivery-spec-plan` | `cmk:delivery-spec-plan` |
| 15 review PR | `cmk:delivery-review` | `cmk:delivery-review` | `cmk:delivery-review` |

## 2026-09-07 — length pass (v1.2.3 → v1.2.4)

Brought `SKILL.md` from 272 to 185 lines (target ≤195). No rule atoms lost —
gate content (Iron Law, HARD-GATE, Rationalizations table, Red Flags) was
never moved or thinned, per the length-pass bucket rules.

**Moved (Conditional bucket):** the "External dependency evidence after
Phase 2" recipe (steps 1–5, contract-diff table, unresolved-disposition
block, gate check — originally SKILL.md lines 90–134) relocated verbatim to
new sibling `references/external-dependency-evidence.md`. SKILL.md keeps the heading,
the `IF … THEN` skip condition, and a one-line pointer naming every step the
sibling covers (runtime identity, `cmk:research`-sourced owning docs,
contract-diff table, history check, claim status, gated disposition).

**Deleted:** nothing — no rule was cut, only reformatted or relocated.

**Reformatted (no words changed):** merged hard-wrapped paragraphs and list
items back onto single source lines across the frontmatter description,
Phase 1's deployed-environment IF, the After-Phase-2 ownership and Ops-docs
paragraphs, Phase 3's WHEN-local / WHEN-shared-deployed / OTHERWISE
sub-conditions, the Causal-disposition intro, and Phase 4's four numbered
steps. Pure line-break changes; every word is unchanged and in place.

**Atom count:** 77 atoms before → 70 in SKILL.md alone / 78 across
{SKILL.md, references/external-dependency-evidence.md} after (`skill-rule-inventory.py`).
The `--diff` run flagged 10 atoms as "no home" — all 10 are reformatting
artifacts from the line-merge above (the tool keys atoms to line
boundaries); each was confirmed present verbatim in SKILL.md by literal
`grep -F` (see below), not lost:

- `IF the reported failure is on a **deployed** environment (production…` —
  present in full on the Phase 1 paragraph line.
- `Phase 3 hypotheses: REQUIRED SUB-SKILL: use \`load-subgraph\` for
  ownership…` — present in the After-Phase-2 paragraph line.
- `IF the minimized failure path crosses a versioned external dependency…`
  — present as the (still-inline) skip-condition paragraph.
- `WHEN the process under test is **local or a dedicated checkout**…` —
  present in the Phase 3 debugger-preference line.
- `WHEN the failure lives only on a **shared deployed** environment…` —
  present in the Phase 3 shared-deployed line.
- Phase 4 numbered items 1–4 (`**Failing regression test first**…`,
  `**Human accept**…`, `**One fix**…`, `Watch the regression test pass…`) —
  all four present verbatim, one per numbered line.

**Anchors confirmed present** (machine-checked by `lint-skill-evals.py` via
`derived_from: "SKILL.md § …"`):
- `NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST` — Iron Law block.
- `NO AGENT-AUTHORED AUTHORITATIVE CAUSAL ACCEPTANCE` — Iron Law block.
- `Phase 1 — Build the feedback loop (the gate)` — heading unchanged.

**Lint results:** `lint-skill-frontmatter.py`, `lint-skill-templates.py`,
`lint-context7.py`, `lint-skill-evals.py`, `lint-write-handoffs.py` all pass.
`lint-skill-length.py` reports SKILL.md now under the 200-line limit and
asks for its stale entry to be deleted from
`scripts/skill-length-budget.json` via `--write` — left undone here since
that file sits outside `skills/execution/root-cause/` and this pass's scope
was that one directory; the reviewer should run
`python3 scripts/lint-skill-length.py --write` to close the ratchet.

Nothing was judged too risky to touch — the only gate-bucket content in this
file (Iron Law, HARD-GATE, Rationalizations, Red Flags) was left completely
untouched, word- and line-for-line.

## 1.3.0 — the artifact case, and the loop the old escape sent you round

Phase 1 gates on a red-capable command and says so absolutely: no red-capable
command, no Phase 2. That is right for a bug and wrong as a universal, because it
has no exit for the case where the evidence is a capture handed over after the
fact — a cpuprofile, a heap snapshot, a spindump, a trace.

The escape it did have was circular. "Genuinely cannot build one? ... ask the user
for a reproducing environment, **a captured artifact**, or permission" tells an
agent holding a cpuprofile to go and ask for a captured artifact.

This was found by reading, not by a baseline, and it is a defect in the text
rather than a behaviour gap: the instruction cannot be followed as written by the
reader it applies to. The fix names the case, says the artifact is the loop, and
sets the deliverable — reduce the capture to the frame, retainer chain, or blocked
thread carrying the symptom, attribute it to a file and symbol, hand back a cited
diagnosis, and re-enter Phase 1 when someone can state the symptom as a command
that goes red.

**Deliberately not built:** a forensics skill, or a metric-hillclimb skill. Both
were on the import list. There is no evidence in this repo's history of trace or
profile work, and a skill nobody runs is the ceremony this whole pass has been
cutting. The circular sentence was a real defect and got a real fix; the rest
waits for a reason.

## v1.4.0 — deferred accept for an unattended caller (2026-10-06)

Phase 4 step 2 now has an exception. When an unattended caller's brief says it
defers disposition to its close report, the fix is committed on the unmerged
branch marked `pending disposition`, and the request goes into that report.
Nothing merges before an eligible human accepts. The HARD-GATE is unchanged:
no agent-authored `confirmed`.

Evidence is in `run-dogfood/TESTS.md` § v4.0.0. On the v3.0.0 text, a fix
subagent's "awaiting human accept before landing" paused the whole dogfood run
in both RED runs. With this sentence plus the caller's verbatim brief line, the
GREEN run committed the fix as `pending disposition` and carried both
propositions into the close report's **Awaiting your accept** section. The
user chose this design (defer, not skip) on 2026-10-06. Root-cause's own evals
are unaffected: none of them sets up an unattended caller.


## Smoke after the cmk rename (2026-10-19)

skill-tester-haiku on harbor-ledger with the GitHub board (`KIT=cmk`, all skills): **PASS** — #28 same-day booking: red repro plus control, `nights()` rejects 0 nights so no invoice exists, causal disposition request, pricing decision left to the person, nothing fixed.
