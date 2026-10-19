---
name: cmk:design
description: Use when approved requirements need their technical design, or the user asks "how should we build this", "draft the system design", "update the architecture" — produces a feature's design.md (or docs/design/system.md / a track doc) spelling out HOW the requirements get built, with Satisfies traces, reuse, seams for testing and, at system level, a Security section. After cmk:requirements, before cmk:delivery-spec-plan.
version: 1.0.0
---

Produce `docs/specs/<YYYY-MM-DD>-<feature>/design.md`: HOW the approved requirements get satisfied. Start from the skill set's `references/templates/design.md`. Every heading in it is a
REQUIRED slot. The requirements file is your input contract — read it fully first.

## Two levels

The steps below write one feature's `design.md`. WHEN the design covers the whole system or
one sub-system / track (`docs/design/system.md`, `docs/design/<track>.md`), read
`references/system-and-track.md` and follow it instead. Asked for a whole-service design, a
baseline run noted the steps are "written for per-feature designs", improvised a layout, and
wrote 163 lines with no Security section: "no authentication in the code" appeared only in
one module's prose and as an open question.

Create a todo per step (1, 2, 2b, 3, 4) before starting, and complete them in order — this skill owns its own list, distinct from `cmk:requirements`' upstream and `cmk:delivery-spec-plan`'s downstream. Check each off only when its **Done when:** is met.

## Step 1: Context and decisions

Explain in 2–4 paragraphs what exists today, which constraint shapes the approach, and
the alternative that constraint rules out. Dispatch a **scan subagent** to map the touched
surface — signatures, data shapes, save/load paths — into a digest file (`.skills/<CODE>/scan.md`,
or `.skills/_pending-<slug>/scan.md` before CODE), not raw source; pull a specific file into
context only when a decision hinges on its exact contents. (No subagents? Read the surface
directly, only the parts a decision needs.)

WHEN the user has said they have never read the touched subsystem, **name**
`/cmk:explain` for them to run before treating a scan digest as a traced model.
Do not invoke it. The on-ramps table is the one home for that row.

**After the scan digest and before the reuse ladder:** run a **fresh** retrieval.
REQUIRED SUB-SKILL: use `cmk:feature-graph` seeded with the feature **CODE**,
requirement **terms**, and scan **candidate paths** (`neighbors` or `subgraph` as fits; schema
1.1) — not a stale parent package; fresh means current SSOT. **Grounded claims** (one home):
follow `cmk:feature-graph`'s `references/grounded-claims.md` — never invent `Reuse:`
from the envelope alone; climb the ladder for real reuse.

Record the decisions locked during discovery as a numbered list. Any decision that is hard to reverse AND surprising without context AND a real
trade-off also gets an ADR (REQUIRED SUB-SKILL: use `cmk:adr` — it owns the ADR
gate).

When a `docs/design/` spine exists, its `**ARCH-N**` invariants are inputs to this design:
read them and note which this feature relies on (cite them in Step 2). If a decision must
*contradict* an invariant, that is an ADR-or-supersede event — record the ADR, or supersede the
invariant by strikethrough in the spine — never a silent violation. No spine? Skip this; optional.

### Optional system docs (consult recipe)

WHEN the design crosses trust/compliance, reliability, a standards area, architecture shape,
or cross-module structure, read `references/system-docs.md` and follow it exactly.

**Done when:** the Context and decisions section names the binding constraint,
the alternative rejected because of it, fresh retrieval has run, and — where a
spine exists — the `**ARCH-N**` invariants this feature relies on.

## Step 2: Architecture — Satisfies, depth, and locality

One `###` section per **module** or area. Use the template slots in order; every
heading under Architecture is a REQUIRED shape, not free prose.

**Per-section contract** (fill every line the template names):

| Slot | Content |
|---|---|
| `Satisfies:` | Requirement IDs this module exists to meet. No Satisfies line → infrastructure (label it) or the section does not belong |
| `Reuse:` | Highest ladder rung that held + concrete target, or `none — new code (rung 7)` + reason |
| `Respects:` | `ARCH-N` when the design relies on a spine invariant (omit when no spine / no reliance) |
| `Surface:` | REQUIRED when this section changes the behavior, value, shape, or signature of something that **already has readers**; omit only for new code nothing reads yet. Find them by reference search — grep the symbol, column, route, event name — never from memory. List every affected reader (in-repo call sites, tests, persisted rows, emitted events, external subscribers, docs, config) and give each exactly one disposition: **`replace`** — migrated in this change, old path deleted; **`compat`** — both paths live, allowed only for readers this change cannot reach, and it names the follow-up that removes it; **`frozen`** — a contract this change may not alter *unilaterally*: an external subscriber, a persisted row, a published event. Two ways to discharge it, and the row states which — the design builds around the contract and leaves it untouched, or the requirement genuinely mandates the change and shipping it is **gated on that owner's agreement**, which the row names as a gate. Frozen bounds who may consent, not whether the value may ever change; a `frozen` row naming neither a workaround nor a gate is unfinished |
| `Security:` | Optional. When the design relies on standing security docs, list greppable `TB-N`, `THR-N`, and/or `CMP-N` IDs defined only in Approved `docs/security/threat-model.md` (TB/THR) or `docs/security/compliance.md` (CMP). Omit the field when not applicable. **Do not** put these IDs on `Respects:` (`Respects:` stays ARCH-only). |
| `Reliability:` | Optional. When the design relies on standing reliability objectives, list greppable `SLO-N` IDs defined only in Approved `docs/ops/reliability.md`. Omit when not applicable. |
| `Interface:` | What callers know — smaller than the implementation |
| `Depth:` | **Rung 7 (new module):** one-sentence **deletion test** — if this module vanished, what must callers still know to rebuild the behavior? Redesign until that answer is a *small* interface, not the full implementation. **Reuse of existing (rungs 2–5):** `n/a — extends <target>` |
| `Locality:` | Where a change for these Satisfies IDs lands, and neighbor impact on modules the Step-1 scan already saw: `leave` \| `extend` \| `extract` plus one short clause |

Structure quality is part of the design, not a later debt scan. Trace coverage (`Satisfies:`)
and structure quality (`Interface:` / `Depth:` / `Locality:`) are both done when the section
is complete.

`Locality:` records where the **edit** lands; `Surface:` records who is **affected**. A reader
that needs no edit still needs a disposition — a design that changes what a caller receives
while leaving its code untouched is the case this slot exists for.

Adopting a brand-new third-party dependency — one the project does not already use — is the
**user's decision**. When the ladder lands on a library the project hasn't adopted, stop and
put it to the user: what it is, why it fits, cost (maintain, footprint, supply chain). Ground
the pitch in current facts via the **Context7 MCP** (or `cmk:research`) before naming version or
API, and wait for agreement before writing it into the design; if they decline, fall back down
the ladder. An *already-installed* dependency (rung 5) needs no such ask — only the new-dependency
*adoption* is the user's call; the `Reuse:` line still records the rung that held.

Genuinely hard interface (new persistence, concurrency, plugin seam) — not CRUD or
an extra field: read `references/design-principles.md` and pick a base; graft ≤2 ideas; do not
average. One-obvious-shape work skips this.

Before committing to build any module, climb the **reuse ladder** and stop at the highest rung
that holds — the cheapest thing that already works beats new code:

1. **Does it need to exist at all?** No requirement forces it → cut it (YAGNI).
2. **Already in this codebase?** A helper, util, type, or pattern the Step-1 scan found →
   reuse or extend it.
3. **Standard library or language builtin does it?** Use it.
4. **A platform / framework / runtime feature covers it?** Prefer it over hand-rolled code.
5. **An already-installed dependency solves it?** Use it.
6. **Can it be one line?** One line.
7. **Only then** — the minimum new code that works (then fill `Depth:`).

The ladder climbs the Step-1 scan digest after you understand the problem. It never licenses
cutting a corner that matters: input validation at trust boundaries, error handling that
prevents data loss, security, accessibility, and everything the requirements asked for.

| Thought | Reality |
|---|---|
| "The signature didn't change, so callers need zero edits" | Zero edits is not zero impact. Give each reader a `Surface:` disposition. |
| "I named the callers in the prose above" | Prose is not an inventory. One row per reader, one disposition each. |

**Done when:** every architecture section has `Satisfies:`, `Reuse:`,
`Interface:`, `Depth:`, and `Locality:` filled per the table (and `Respects:` where a spine
invariant applies, and `Surface:` where the section changes something that already has readers).

## Step 2b: UI design — observable conditional

IF any `Satisfies:` ID is delivered through a browser-rendered surface (a
page, screen, component, or style the user sees) → fill the template's
`## UI design` section. IF none is → delete the section.

To fill it — lifting a locked `ui-brief.md` or building fresh against the repo's real
visual system — read `references/ui-design-recipe.md` and follow it exactly.

**Done when:** the section exists iff the predicate holds, and every surface
has all five slots filled — with a line for each reachable visible state.

## Step 3: Agree the seams for testing

Fill the "Seams for testing" table: the public boundaries tests will be written at, which
requirement IDs each seam covers, and the test kind (unit/integration/e2e). Prefer existing
seams; the ideal number of NEW seams is zero or one. The `cmk:tdd` skill refuses to write
tests at seams not agreed here — this table is the contract.
**Done when:** every requirement ID maps to at least one seam row.

## Step 4: Coverage self-check, then the approval gate

Walk requirements.md top to bottom: every ID appears in exactly one Satisfies line (or is
listed as deliberately unmapped, with a reason). Then scan for placeholders and internal
contradictions (a name used two ways, a data flow that skips a component).

- **Reuse coverage:** verify every architecture section has a `Reuse:` line
  that matches the ladder rung it claims.
- **Structure coverage:** verify every section has `Interface:`, `Depth:`,
  and `Locality:` per Step 2 — each rung-7 `Depth:` sentence must name what callers keep
  knowing; redesign any section whose Depth answer restates the whole implementation.
- **Surface coverage:** for every section carrying `Surface:`, re-run the
  reference search yourself and confirm the inventory is complete and each row carries a
  disposition. A `compat` row with no removal follow-up, or a changed external/persisted
  reader not marked `frozen`, fails this check.
- **UI coverage:** re-evaluate the Step 2b predicate against requirements.md
  — a `Satisfies:` ID delivered through a browser-rendered surface with no
  `## UI design` section fails this check. WHEN the section exists → every
  slot per surface is filled, colors are token names not raw hex, and any reachable
  visible state (empty, error, loading) has a `States:` line.

**Independent design review — dispatch, don't self-review.** Fresh context has no stake in
your framing (the bias that reinterprets a stale requirement rather than catching it). Dispatch
a review subagent with this design, requirements.md, the Step-1 scan digest when present, and the repo; have it verify:

1. **Code-facing claims** — named seams and paths exist (`file:line`). A
   behavioral property (exactly-once, atomic, idempotent) is derived from what
   the statement does under the failure it must survive — not from a precedent
   or a comment. Two of three runs mapped exactly-once onto `SKIP LOCKED` locks
   that release before the dispatch they were meant to guard.
2. **Structure claims** — `Interface:` smaller than the implementation; rung-7
   `Depth:` non-vacuous; `Locality:` matches the scan digest.

Findings go to `.skills/<CODE>/design-review.md`; you fix them without loading the code here.
(No subagents? Do this pass yourself in a fresh read of the code and the digest.)

**Upstream sync-back — do not skip.** Designing routinely surfaces a fact that contradicts an
*approved* requirement: a premise that turned out false, a mechanism the requirement named
wrong, a constraint that does not hold (e.g. the requirement says the stored body is ProseMirror-JSON but you discover it is
Markdown). When that happens you MUST correct the requirement's own text and
re-surface it for approval — never satisfy a requirement by quietly reinterpreting words you
now know are false. A `Satisfies:` line pointing at a requirement whose wording is wrong makes
the trace spine cite a lie, and the error survives all the way to code. The same holds for an
ADR you are writing that contradicts an existing one: supersede it explicitly by number. If
you changed any requirement, say exactly which and why when you present for approval.

Present the FILE to the user, section by section for large designs, and STOP for approval. On approval set `Status: Approved`.

## Exit

REQUIRED SUB-SKILL: use `cmk:delivery-spec-plan`.
