---
name: cmk:traceability
description: Use when checking that requirement IDs agree where they are defined and task-cited in docs/specs, or that the capability catalog INDEX / shards stay intact — the docs-only vertical pass invoked by cmk:evidence, cmk:release, cmk:realign, and cmk:delivery-spec-plan. Produces a traceability finding set (unknown citations, duplicate definitions, approved-but-uncited, Respects / system-ID integrity, duplicate Feature CODEs, OBS-<6hex> in Code cells, missing shard refs). Does not search application source or tests for requirement IDs.
version: 1.3.1
---

# Audit Trace

The vertical traceability check. It answers with evidence: **do requirement IDs
agree across the spec triad (and optional architecture docs), and does the
capability catalog stay free of duplicate CODEs, `OBS-<6hex>` in Code cells, and
broken shard refs?**

It is not a judgment call. Every input is gathered with `grep` and reads —
deterministic passes — and every finding follows a fixed rule. Two agents running
this on the same repo reach the same finding set.

**Docs-only:** this check never greps application source, test files, or commit
messages for requirement IDs. Coverage of behavior by tests is enforced by
execute-family Spec review, `cmk:tdd`, and cmk:evidence verify commands — not
by embedding `CODE-N.M` in code.

## What it produces

A finding set, each item an ERROR or a WARNING:

| Code | Tier | Condition |
|---|---|---|
| **E1** | error | A task cites an ID that no requirements file defines |
| **E3** | error | The same ID is defined (bold) in more than one file |
| **W1** | warn | An `Approved` or `In-progress` requirement is cited by no task |
| **W2** | warn | A `requirements.md` is missing its `Status:` or `Feature code:` line |
| **E4** | error | A `Respects:` line cites an `ARCH-N` no `docs/design/` file defines |
| **E5** | error | A `Respects:` line cites a retired (struck-through) `ARCH-N` |
| **W3** | warn | A live `**ARCH-N**` invariant is cited by no `design.md` |
| **E6** | error | A `Security:` line cites a `TB-N`/`THR-N`/`CMP-N` with no live bold definition in the canonical Approved security docs |
| **E7** | error | A `Security:` line cites a retired (struck-through) `TB-N`/`THR-N`/`CMP-N` |
| **E8** | error | The same `TB-N`/`THR-N`/`CMP-N`/`SLO-N` is bold-defined in more than one canonical file |
| **E9** | error | A `Reliability:` line cites an `SLO-N` with no live bold definition in Approved `docs/ops/reliability.md` |
| **E10** | error | A `Reliability:` line cites a retired (struck-through) `SLO-N` |
| **E11** | error | The same Feature CODE appears in more than one catalog row (across shards) |
| **E12** | error | A router `Feature catalog` path is missing or not a readable file under `docs/specs/` |
| **E14** | error | INDEX has a flat `| Code | … |` feature table (no Domain router) — shared catalog required |
| **E13** | error | A canonical catalog Code cell is `OBS-<6hex>` (`OBS-[0-9a-f]{6}`) |
| **W4** | warn | A catalog Spec pointer (not `—`/empty) names a missing directory under `docs/specs/` |
| **W5** | warn | The same `OBS-<6hex>` appears in more than one `.skills/reverse-features/active/*.md` card |

E4/E5/W3 come from the invariant passes, which only run when a spine exists.
E6–E10 come from system-ID passes; skip when the defining docs are absent or
non-authoritative. E11–E13 and W4 run only when `docs/specs/INDEX.md` exists.
W5 is grouped with those catalog passes and also skips when INDEX is absent,
even if `active/` exists. **Do not** warn merely because a live system ID has
no feature citation. **Do not** judge semantic conformance. Same docs-only rule.

**Retired:** **E2** (code-side ID presence for Implemented/Shipped) is not
emitted. Do not reintroduce a finding that greps the codebase for IDs.

Errors mean the traceability is broken. Warnings mean the traceability is incomplete but not
wrong. `cmk:evidence`/`cmk:release` treat any error as a failing gate; warnings are reported,
not fatal, unless the caller says otherwise.

## Inputs

- **Specs** live under `docs/specs/` (or the `specsDir` named in
  `docs/agents/project.md`). Definitions come from files ending `requirements.md`
  or `fixes.md`; task citations from files ending `tasks.md`.
- **Architecture** (optional): when `docs/design/` exists, invariant
  passes read that tree and `Respects:` lines in feature `design.md` files.
- **Decision records** (optional): when `.skills/decisions/` exists, run the
  shipped validator (see below).
- Skip `node_modules .git dist build target coverage .next .skills vendor` and any
  dotfile/dot-dir when walking trees other than the intentional decision-record path
  and the catalog OBS uniqueness pass (`.skills/reverse-features/active/` only).

Do **not** search application or test trees for requirement-ID coverage. Legacy
`/// REQ:` or test-title tags in a consumer repo are ignored by this check.

## The passes

Run these against the repo root and read the full output of each — under the
whole-tree rule in the NON-NEGOTIABLE section below.

**1. Definitions** — bold IDs in requirements/fixes files, minus retired ones.

```bash
# every bold **CODE-N.M** in a requirements/fixes file, retired (~~struck~~) ones deleted first
grep -rnE '\*\*[A-Z][A-Z0-9]{1,11}-[0-9]+\.[0-9]+\*\*' docs/specs \
  --include='*requirements.md' --include='fixes.md' \
  | sed -E 's/~~[^~]*~~//g' \
  | grep -E '\*\*[A-Z][A-Z0-9]{1,11}-[0-9]+\.[0-9]+\*\*'
```

Each surviving line is `path:line:text`; every bold ID left on it is a definition,
owned by `path`. The `sed` deletes `~~ … ~~` spans, so a **retired** ID cannot reach
the result. A plain (non-bold) ID in a requirements file is prose, not a definition.

**2. Statuses and feature codes** — per requirements file.

```bash
grep -rnE '^(Status:|Feature code:)' docs/specs --include='*requirements.md'
```

`Status:` is one of `Draft | Approved | In-progress | Implemented | Shipped` (first match wins).

**3. Task citations** — IDs on `_Requirements:` lines.

```bash
grep -roE '_Requirements:.*' docs/specs --include='*tasks.md' \
  | grep -oE '^[^:]+:|[A-Z][A-Z0-9]{1,11}-[0-9]+(\.[0-9]+)+' \
  | grep -E '^[^:]+:$|^[A-Z][A-Z0-9]{1,11}-[0-9]+\.[0-9]+$'
```

Only IDs on a line containing the literal `_Requirements:` are task citations. The
output alternates a `path:` line and the IDs cited in it — each ID belongs to the
`path:` above it. The trailing `grep` keeps only whole two-level tokens, so a
three-level `CODE-1.2.3` can never be read as a citation of `CODE-1.2`.

### Invariant passes — only when `docs/design/` exists

If the repo has no `docs/design/` directory, skip passes 4–5 entirely; the
finding set is passes 1–3, unchanged. WHEN the spine exists, read
`references/invariant-passes.md` and follow it exactly.

### System-ID passes — security and reliability (optional docs)

Skip entirely when the relevant canonical file is missing. WHEN
`docs/security/threat-model.md`, `docs/security/compliance.md`, or
`docs/ops/reliability.md` exists, read `references/system-id-passes.md` and
follow it exactly. Do **not** treat these IDs as task-footer citations, and do
**not** warn solely because a live system ID is uncited by any design.

### Catalog integrity passes — only when `docs/specs/INDEX.md` exists

If `docs/specs/INDEX.md` is missing, skip this section (the "nothing to check"
stop already applies when the whole specs tree is absent). WHEN INDEX exists,
read `references/catalog-passes.md` and follow it exactly. Do **not** judge
whether a Recognized card *should* have a triad (Spec `—` is allowed), and do
**not** promote OBS into CODEs here.

## The rules

Apply the **opening finding table** to the sets each pass built. Status
obligations for W1:

| Status | Needs a task (W1) |
|---|---|
| Draft | no |
| Approved / In-progress | **yes** |
| Implemented / Shipped | no (task history may remain; no code-side ID gate) |

`Status: Implemented` / `Shipped` evidence is process (tasks checked, verify green,
Spec review) — not a greppable ID in a test file.

## <NON-NEGOTIABLE> Task citation integrity is textual — do not judge it

An ID is **task-cited** when its string appears on a `_Requirements:` line. Full
stop. Do not read the task steps to decide whether the task "really" implements
the requirement. That judgment is Spec review / cmk:evidence, not this check.

Gather **every** matching requirements and tasks file under the specs tree.
Missing one requirements file invents a false E1; missing one tasks file invents
a false W1. Grep the specs tree; do not sample.

The same rule binds the invariant passes: E4/E5/W3 check only that a `Respects: ARCH-N`
citation names a *live* invariant — existence and liveness. Never judge whether the
design *actually* respects the invariant; that semantic call is `cmk:delivery-review`'s `references/invariants.md` /
`cmk:delivery-review`, not `cmk:traceability`.

### Decision-record passes — only when `.skills/decisions/` exists

If the repo has no `.skills/decisions/` directory, skip this section entirely; the
finding set from every pass that ran remains unchanged. WHEN it exists, read
`references/decision-record-pass.md` and follow it exactly.

## Output

Report the counts, then the findings:

```
trace: 24 requirements · 24 task-cited
  ERROR E1 task cites unknown requirement SHELL-9.9 (docs/specs/…/tasks.md)
  warn  W1 NOTES-2.1 (…/requirements.md, Approved) is not cited by any task
```

Exact wording and ordering are not contractual — the **finding set** is. If
`docs/specs/` does not exist, say there is nothing to check and stop. Gate: zero
errors. Catalog errors (E11–E13) count when INDEX exists; warnings W4–W5 stay
non-fatal unless the caller says otherwise.
