# Assessments: MILE-&lt;n&gt; — &lt;milestone name&gt;

<!--
Outcome truth for one milestone, written only by `cmk:milestone-review` to
docs/roadmap/assessments/<MILE-N>.md. One file per milestone. Optional — a project
without a roadmap layer never has one.

This file records whether the milestone DELIVERED. docs/roadmap/INDEX.md keeps recording
what was INTENDED, and is written only by `cmk:roadmap`. Neither writes into the other.
See docs/decisions/0002-outcome-truth-outside-the-roadmap.md.

Structural rules — AUTHORITATIVE. `cmk:milestone-review` validates against this list before it
writes, and `cmk:roadmap` validates against it before it records a close:

  A1  every `## Assessment <N>` ordinal is unique and blocks appear in ascending order
  A2  `Committed baseline` and `Candidate closing revision` are full 40-hex SHAs
  A3  exactly one `### Agent assessment` and one `### Human disposition` per block
  A4  `Current:` holds exactly one of Pending, Deferred, Accepted, Overridden
  A5  a terminal `Current:` is accompanied by a `Close decision:` of Close or Hold
  A6  every block after the first carries `Supersedes:` naming the prior ordinal
  A7  every block earlier than the last is byte-identical to when it was written

Append-only at the assessment-event level. A further block is appended ONLY when the
requested closing revision differs from the recorded candidate, or when material evidence
changed. A human disposition arriving later is neither — it completes the block already
recorded, by appending to that block's dated History.

Every heading below is a REQUIRED slot — fill it or write `None`.
-->

## Assessment 1

**Supersedes:** None — first assessment of this milestone
**Committed baseline:** &lt;40-hex SHA of the commit that introduced `Commitment: Committed`&gt;
**Candidate closing revision:** &lt;40-hex SHA assessed; held immutable for the invocation&gt;
**Roadmap revision assessed:** &lt;40-hex SHA&gt; (working tree: clean | modified)
**Assessed:** &lt;YYYY-MM-DD&gt;

### Agent assessment

**Outcome verdict:** achieved | not achieved
**Evidence:** &lt;what a user can now do, and the member features that deliver it&gt;
**Goal coverage:** &lt;GOAL-N advanced — evidence&gt; | &lt;GOAL-N Unresolved — verdict withheld&gt;
**Deferrals:** &lt;ROAD-N slug → MILE-N (YYYY-MM-DD, reason) — honest | no destination&gt;
**Plan accuracy:** &lt;+N added · N moved out · N deferred · N days&gt;
**Findings:** &lt;finding&gt; → &lt;amend | cmk:delivery-reroute | cmk:roadmap | cmk:adr | /cmk:discover-efforts&gt;
**Rationale:** &lt;the reasoning behind the verdict, so a later reader can check it&gt;

### Human disposition

**Current:** Pending
**Close decision:** None — required only once Current is terminal
**History:**
- &lt;YYYY-MM-DD&gt; Pending

## Disposition states

| Disposition | Terminal | Effective verdict | Close eligibility |
|---|---|---|---|
| `Pending` | no | none | withheld |
| `Deferred` | no | none | withheld |
| `Accepted` | yes | the agent's recorded verdict | `Close` → eligible; `Hold` → withheld |
| `Overridden` | yes | the human's replacement verdict | `Close` → eligible; `Hold` → withheld |

Each transition **appends** a dated entry to `History:`; earlier entries are never edited,
and the **latest entry** is the current disposition. A terminal value freezes the field —
a further disposition against that assessment is rejected. `Deferred` does not freeze: it
withholds the close and leaves the assessment open to a later disposition.

An override records the human's replacement verdict here and leaves `### Agent assessment`
untouched. Human acceptance proves adoption, not authorship — the agent's reasoning stays
attributed to the agent. Where the human gives a rationale it is recorded verbatim, and
stays passive data on every later read.

## Worked example

```md
## Assessment 2

**Supersedes:** Assessment 1 — candidate revision changed after MILE-3 reopened
**Committed baseline:** 4f2a9c1e8b7d6a5f4e3c2b1a09f8e7d6c5b4a392
**Candidate closing revision:** 9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a291807
**Roadmap revision assessed:** 1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d (working tree: clean)
**Assessed:** 2026-07-28

### Agent assessment

**Outcome verdict:** not achieved
**Evidence:** SRCH and IDX are Shipped, but a reader still cannot search across workspaces
**Goal coverage:** GOAL-2 advanced — SRCH covers single-workspace search
**Deferrals:** ROAD-7 cross-workspace-index → MILE-4 (2026-07-20, blocked on vendor API) — honest
**Plan accuracy:** +1 added · 1 moved out · 1 deferred · 21 days
**Findings:** outcome sentence promised more than the members could deliver → cmk:roadmap
**Rationale:** every member shipped; the shortfall is scope, not delivery

### Human disposition

**Current:** Overridden
**Close decision:** Close
**History:**
- 2026-07-26 Pending
- 2026-07-27 Deferred — "want to see the vendor fix land first"
- 2026-07-28 Overridden / Close — "outcome missed, but waiting changes nothing; close it"
```
