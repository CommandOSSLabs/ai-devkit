# Production coverage (SRE addendum)

Load **only when** `SKILL.md` **Production coverage gate** is **ON**. When OFF,
do not load this file and do not invent a coverage map.

## Contents

- [Coverage map](#coverage-map)
- [Radii and order](#radii-and-order)
- [Close slots 7–10](#close-slots-7-10)
- [Operate → cmk:observability](#operate--assess-observability)

## Coverage map

Cells and status only — not prose essays.

Statuses: `Clear` · `Partial` · `Missing` · `Owned-unknown (owner, date)` ·
`Accepted-risk (signer)`.

| Cell | Status |
|---|---|
| Frame | … |
| Journey | … |
| Contract | … |
| Reliability | … |
| Failure | … |
| Operate | … |
| Freeze | … |

**How cells close (one home):**

- **Frame** — problem lock (`SKILL.md`).
- **Journey** — CUJ + breakpoints + measured vs unmeasured. No Journey radius:
  close via `UX flow` or `architecture` CUJ cards, then Clear/Partial.
- **Contract** — API/state/idempotency/authz via `data` / `auth/security` /
  `architecture` cards.
- **Reliability** — SLI measure point + SLO-shaped target + error-budget
  *policy*. Cite `SLO-N` only from Approved docs; else prose or Owned unknown.
  Radius: `reliability`.
- **Failure** — SPOF/deps/partition/overload/operator-error; accept vs mitigate.
  Radius: `failure`.
- **Operate** — pageable alert, rollback, residual toil. Radius: `operate`.
  See Operate → cmk:observability.
- **Freeze** — not a radius. Clear only when Owned unknowns + Accepted risks are
  listable at close (each may be `none`).

**Open high-blast** = Missing/Partial cell names (one ledger). Reliability ·
Failure · Operate are high-blast — never “later NFR”. No reliability docs ⇒
prose targets or Owned unknowns; never invent SLO IDs.

## Radii and order

Radii may include `reliability` · `failure` · `operate`. Prefer Missing over
Partial. Never close while Reliability · Failure · Operate are Missing without
owner. Open-set recompute: `SKILL.md` home rule.

## Close slots 7–10

REQUIRED when this file is loaded:

7. **Coverage final** — status per cell (no Missing without owner).
8. **Owned unknowns** — undecided TBD as topic · **owner** · **date** ·
   **forbid-guess** (`cấm đoán`: do not invent the answer). Or `none`. Unowned
   TBD blocks close. Not the same as Accepted risks.
9. **Accepted risks** — decided keep-the-risk · why tolerable vs CUJ/SLO ·
   **signer**. Or `none`. Deferred number/policy → Owned unknown, not Accepted
   risk.
10. **Operability touch** — **rollback** (command / flag / restore) + **who is
    paged** for the top failure. One Owned unknown may defer *that ops line*
    only — not the whole Operate cell.

Not “later NFR” ceremony. Worked close shape: `references/example.md`.

## Operate → cmk:observability

Telemetry/tracing readiness gap → REQUIRED SUB-SKILL: use `cmk:observability`,
**then** one `operate` card on the finding. Rollback/page/toil alone → `operate`
card only (no assess).
