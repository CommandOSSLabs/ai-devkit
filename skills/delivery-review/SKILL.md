---
name: cmk:delivery-review
description: Use when a branch, PR, diff, or set of changes needs review before merging — produces a two-axis verdict (repo-standards conformance plus spec/requirements conformance, reported separately) — when cmk:delivery-build's references/continuous.md reaches its final whole-branch review, or when the user asks to review work since some ref.
version: 1.0.0
---

# Delivery review

Review a diff on two independent axes, each run by its own subagent:

- **Standards** — does the code follow this repo's documented conventions and avoid the baseline smells?
- **Spec** — does the code implement what the requirements asked for, ID by ID?

The axes are deliberately separate because a change can pass one and fail the other: flawless code that builds the wrong thing, or a faithful implementation that tramples the repo's conventions. Merged reports let one axis mask the other.

## 1. Pin the range — fail fast

Take the base ref the caller supplied (a sha, branch, tag, or merge-base). Confirm it resolves — `git rev-parse <base>` — and that `git diff <base>...HEAD` is non-empty. A bad ref or empty diff must fail HERE, not inside two parallel subagents. Also capture `git log <base>..HEAD --oneline`. If no base was given, ask. *Done when: the ref resolves and the diff is non-empty.*

## 1b. Reverse-track the pinned range (scripts, read-only)

Run the cmk:catalog reverse runner on the pinned `base..HEAD` — **advisory
envelope only**, no dispose writes to INDEX/shards:

```bash
python3 <cmk:catalog skill root>/scripts/reconcile.py \
  --repo <root> --base <base> --head HEAD --mode full
```

Add `--write-overlay` only when `.skills/` is writable and gitignored (same
contract as `/cmk:catalog` dispose step 0). Hold the envelope it prints. Step 2
consumes it; do not mint Feature CODEs here. Pending OBS → **name** `/cmk:catalog`
for disposition; never auto-invoke it.
*Done when: the reverse envelope is held (or the runner’s explicit stateless
outcome).*

## 2. Locate the spec

Find the governing requirements, in order, **using the step-1b envelope**:

1. Envelope `known-impact` CODE → that feature’s `requirements.md`.
2. Else a `docs/specs/<date>-<feature>/requirements.md` matching the branch,
   feature name, or INDEX code for paths in the diff (exact CODE lookup per
   `catalog-query.md` — do not paste INDEX).
3. A path the caller handed you.
4. Envelope pending OBS / known-impact / uncertain on unowned paths → **not**
   “no spec.” Hold those handles; do not skip the Spec axis as absence.
5. Otherwise ask the user. If they confirm no spec **and** 1b has no pending
   OBS on those paths, skip the Spec axis and say so in the final report.

(Commit trailers are not required carriers of requirement IDs — docs-only spine.)

*Done when: you hold a requirements.md path, or pending OBS / uncertain handles
for unowned paths, or an explicit "no spec" after (5).*

## 3. Gather the standards sources

Collect how code here should be written: CLAUDE.md, lint/formatter configs, docs/requirements/glossary.md, prefer **`docs/rules/common/`**. Missing `docs/agents/project.md` → note it, suggest `cmk:repo-config`. Standards axis always carries `references/standards-baseline.md` (twelve smells + Security + Production-readiness). A documented repo standard overrides the baseline. Skip what tooling already enforces. *Done when: the source list and the baseline path are in hand.*

## 3a. Check for duplication against existing features

For the diff's changed source files (from the range pinned in step 1), REQUIRED
SUB-SKILL: use `cmk:feature-graph` with those paths and optional key terms from the
diff/PR summary so P0 and P1 both contribute. Hold neighbor **cards** from schema
1.1 fields (`path_evidence`, `term_evidence`, `via_traces`); surface
**`owns_coverage`**. **Grounded claims** (one home): follow
`cmk:feature-graph`'s `references/grounded-claims.md` for every conclusion
from the package (including reuse-miss for Spec).
*Done when: you hold the overlapping features' cards, or an explicit "no overlap"
with emptiness/coverage stated per grounded-claims.md.*

## 3b. Invariant conformance (advisory)

When `docs/design/` exists, REQUIRED SUB-SKILL: use `references/invariants.md` on the diff — it returns a per-`Respects: ARCH-N` verdict (respects / violates / unclear). Hold the violates/unclear verdicts for step 5. This lane is advisory by construction and stays OUT of the two hard axes — it never becomes a merge blocker. If `docs/design/` does not exist, skip this step and inject nothing. *Done when: you hold the invariant verdicts, or an explicit "no spine".*

## 3c. Codebase navigation docs (optional context)

**Applicability:** diff paths intersect modules, ownership, or dependency surfaces in
standing nav docs. **Load**, when `cmk:system-docs` is installed: `cmk:system-docs`'s
`references/consult-recipe.md`.

**Paths:** `docs/ai/` (`cmk:codebase-docs`), or `docs/design/codebase/modules.md`, `ownership.md`, `dependencies.md`.

**When Approved:** advisory Spec/Standards context only — flag conflicts with documented
boundaries/ownership/deps as advisory findings (not a hard merge gate by themselves).
Ownership docs are **not** access-control enforcement.

**When absent / non-authoritative:** CONTINUE (no-op). Suggest once
`/cmk:system-docs codebase/modules|ownership|dependencies`, when that skill is installed,
only when a missing nav doc would clarify the review; never auto-invoke.

*Done when: nav context is held or an explicit no-op for absence.*

## 3d. UI review — observable conditional

WHEN the step-1 range's `--name-only` list includes files a browser renders
(HTML, CSS/styling, JSX/TSX/Vue/Svelte components, templates) and `cmk:ui-review` is
installed → REQUIRED SUB-SKILL: use `cmk:ui-review` on the same range. Not installed →
say once in the report that rendered files went without a screenshot review. Hold its screenshot-backed
findings and its `needs-human-eyes` line for step 5. No rendered file in the
diff → skip, inject nothing. *Done when: you hold the UI findings, or an
explicit "no rendered surface".*

## 3e. Stage the spec

REQUIRED SUB-SKILL: use `cmk:working-set` before the Spec dispatch (and before
the inline Spec walk). Admit the IDs this pinned diff implements or
violates. Every other ID in the governing spec is **not in this range** —
still report that list once if the spec promised them; do not write a
full finding per non-home. *Done when: the Spec brief names the admitted
set and a one-line not-in-range list (or "all IDs are in range").*

## 3f. Blast prove — observable conditional

WHEN the pinned range changes runtime behavior, storage, a wire/contract
shape, or configuration → read `references/blast-prove.md` and follow
it exactly before the merge verdict. Hold the `## Blast prove` block for
step 5. Docs/test-only diffs → skip. *Done when: proven or explicitly
unproven, or "no runtime surface".*

## 4. Dispatch both subagents in parallel

Send ONE message containing both dispatches so they run concurrently and neither pollutes the other's context. Both are **read-only**: no mutation of the working tree, index, HEAD, or branch state; to inspect another revision, use a temporary worktree (`git worktree add <tmpdir> <sha>`), never move HEAD. Keep each brief under 400 words. Never pre-judge findings in a dispatch — no "do not flag", no pre-rated severities.

**Standards subagent** gets: the diff command and commit list; the standards-source paths; the path to `references/standards-baseline.md`, which it MUST read first.

Its report is a fixed shape — five parts, in order, each part complete before the next:

- **(a) Documented standards** — every place the diff breaks a repo-documented rule, citing the document and rule. Include docs/requirements/glossary.md vocabulary drift (a diff that renames or re-terms a glossary concept is a finding).
- **(b) The twelve smells** — one verdict line per smell, numbered 1–12, **including the ones that did not hit**. Write the smell's name then `HIT` (naming it and quoting the hunk) or `no hit`. A part-(b) section with fewer than twelve verdict lines is incomplete and gets re-run.
- **(c) Security** — items 13–18, only for hunks crossing a trust boundary (untrusted input, secret handling, a privileged action). No boundary crossed → say so once and move on; do not manufacture findings.
- **(d) Production readiness** — items 19–24, only when the diff changes runtime behavior, storage, a contract, or configuration. Name the item and what an operator would see when it bites. Item 24 MUST be answered from a search of the repo **beyond the diff** — the readers it asks about live in files the diff does not touch, so a diff-only reading always returns a false clean.
- **(e) Tests** — items 25–27, only when the diff adds or changes test files. One verdict line per added or changed test file, or per test when a file holds few: name the test and item number, quote the assertion. A test that restates a literal, repeats another test's failure, or could not fail is a finding; never report "covered" on the strength of a test that is one of these. No test files in the diff → say so once.

Parts (c), (d) and (e) are each scoped by their own predicate; a part that does not apply is reported as not applying, never silently dropped. Adding a later part never licenses shortening an earlier one — (b) is walked in full whether or not (c), (d) and (e) fire. Documented breaches may be hard findings; baseline smells, security and production-readiness items are always judgment calls; the repo's documents override the baseline; skip anything tooling enforces.

**Spec subagent** gets: the diff command and commit list; the requirements.md path; the step-3e admitted set and not-in-range list; the brief — walk **admitted** IDs and report (a) IDs that are missing or only partially implemented, (b) behavior in the diff no requirement asked for (scope creep), (c) IDs that look implemented but wrong; quote the requirement ID on every finding; list not-in-range IDs once (they stay missing-if-promised, not a per-ID essay); also check that each covered admitted ID has **behavior** covered by tests or acceptance evidence (domain-language tests — do **not** require ID tags in test source). When step 3a found overlapping features, the Spec subagent ALSO receives those neighbor cards (owned paths + Out-of-Scope) as context, and its brief directs it to flag — as a **reuse-miss** finding citing the neighbor's feature code — any place the diff reimplements behavior a shares-surface neighbor already owns.

*Done when: both reports are back.*

## 4b. Second Standards pass — when the harness can

The Standards axis is the one that carries most of what a review catches, and a
single pass over it leaves findings on the table. When the harness can dispatch
another read-only subagent, send a second Standards reviewer with the identical
brief in its own fresh context. Prefer a different model when the harness offers
a choice; take a second pass on the same model when it does not, because the
second pass is what pays and the model difference is a bonus nobody here has
measured. Name in the report which model each Standards pass ran on, or `unknown`
— never infer it from the harness name.

**Merge the two as a union, never as a vote.** A finding one reviewer raised and
the other missed is not weaker for being alone. Measured on a seeded diff, four
reviewers agreed on the first five findings and split on the rest, and the two
findings raised by exactly one reviewer were the deepest in the set — an audit
log that could not reconstruct the incident its own code enables, and an implicit
trust boundary in first-touch provisioning. Weighting by agreement would have
demoted both. Deduplicate where two reports describe one defect, keep both
framings when they name different failures of the same line, and drop nothing for
lack of a second voice.

## 5. Aggregate

Present the reports under `## Standards` and `## Spec` headings — lightly cleaned at most. Do NOT merge, dedupe across axes, or rerank one axis's findings against the other's; that reranking is exactly what the separation prevents. When step 3b produced invariant verdicts, present them under a separate `## Invariants (advisory)` heading — a third lane, never merged into or reranked against Standards/Spec. When step 3d ran, present `cmk:ui-review`'s findings under a `## UI` heading — its findings carry severities and count toward the verdict exactly like the two axes' (they are screenshot-backed, not advisory), and its `needs-human-eyes` line is reproduced verbatim. When step 3f ran, present its block under `## Blast prove` — an unproven safety fact blocks **Ready to merge? Yes**.

Every finding carries: severity (Critical / Important / Minor), file:line, why it matters, and a suggested fix unless obvious.

End with the verdict:

```
Ready to merge? Yes | No | With fixes
[1–2 sentences of technical reasoning]
```

Then the **banked** slot. Where the verdict ships with **Minor** findings nobody will action on this branch, those findings exist nowhere but this report. For **each** such Minor emit this block — same slot names as `cmk:debt`'s **The entry**, except the heading has **no** `DEBT-N` (`/cmk:debt` stamps the ID). Name `/cmk:debt` for the user to run. Critical and Important are never banked.

```
### `<path>` — <one-line finding>

- **Found:** `<YYYY-MM-DD>` · cmk:delivery-review on `<branch or range>`
- **Cost:** <what this makes harder or riskier, concretely>
- **Deferred because:** unactioned Minor on this branch
- **Fix shape:** <one line | Unknown>
- **Ticket:** none
- **Status:** open
```

A slot with no answer gets `Unknown` — never omit the line. "Just list the leftovers" / "don't invent a ledger format" is not a skip of these slots. Minting `**DEBT-N**` here is a collision; do not.

*Done when: both axis sections, the verdict, and the banked slot are delivered — banked as "none to bank" when no Minor survives unactioned.*

## Inline fallback (no subagent capability)

No subagent capability in this harness? Run the two axes yourself, sequentially, in one context: **Standards first** — read `references/standards-baseline.md`, walk the diff against each of its twelve smells, the Security section, and the Production-readiness section — then **Spec** — cmk:working-set first, then walk admitted IDs (not-in-range once) — then, when step 3d fired, the **UI lane** per `cmk:ui-review`. Finish and record one axis completely before starting the next, and still present them under separate `## Standards`, `## Spec` (and `## UI`) headings without reranking one against the other. This loses the context isolation two subagents provide, so the discipline of closing out one axis before opening the next is what keeps them from bleeding together.

Using Linear? Its synced Diff is the review surface — read `references/linear.md`.
