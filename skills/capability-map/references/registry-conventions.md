# Registry Conventions

The grammar of `docs/capabilities/INDEX.md` and the design-doc card header it
pairs with. This is the **one home** for both.

## Contents

- [Canonical placement](#canonical-placement)
- [The row](#the-row)
- [Capability codes](#capability-codes)
- [Surface roots](#surface-roots)
- [The card header](#the-card-header)
- [Status](#status)
- [Growing past a flat table](#growing-past-a-flat-table)

## Canonical placement

- Registry: `docs/capabilities/INDEX.md` — one file, one table.
- Directory README: `docs/capabilities/README.md` — what lives here, when to read it.
- Nothing else lives under `docs/capabilities/`. It is a registry, not a doc tree.

## The row

```markdown
| Code | Capability | Requirements | Design | Status | Surface roots |
|---|---|---|---|---|---|
| BILL | Billing and invoices | ../requirements/billing.md | ../design/billing.md | active | src/billing/, src/invoice/ |
| CART | Shopping cart | ../requirements/cart.md | — none — | draft | src/cart/ |
```

| Cell | Rule |
|---|---|
| **Code** | `[A-Z][A-Z0-9]{1,11}`, 2–12 chars. Unique repo-wide, permanent. |
| **Capability** | The name a person would say. Uses glossary terms (`cmk:glossary`). |
| **Requirements** | Path relative to `docs/capabilities/`, or `— none —`. |
| **Design** | Path relative to `docs/capabilities/`, or `— none —`. |
| **Status** | See [Status](#status). |
| **Surface roots** | Comma-separated directories or globs. `— none —` when nothing is owned yet. |

An absent document is written `— none —`, never left blank. A blank cell and a
deliberate absence read identically, and only one of them is a gap worth
reporting.

Rows are sorted by code. A new row goes in sorted position, not at the end.

## Capability codes

- The code **is** the requirements document's `ID prefix`. One key, not two. A
  capability whose requirements doc declares `**ID prefix:** BILL` is `BILL`
  here, and its criteria are `BILL-1.1`, `BILL-1.2`, and so on.
- Unique across every row, **including rows with `Status: deprecated`**.
- Permanent. A retired capability keeps its row and its code; the code is never
  released back into the pool and never reused for different behavior.
- Chosen to be pronounceable and greppable. `BILL` beats `B1`; `AUTH` beats
  `AUTHENTICATION` (over 12 chars) and beats `A` (under 2).
- A capability with no requirements document still gets a code — it is how the
  registry addresses it, and it is the prefix its future requirements doc will
  declare.

## Surface roots

Coarse on purpose. A surface root is a directory, a glob, or a small set of
top-level files — the answer to "roughly where does this live", readable by
scanning one table.

- Directories end in `/`: `src/billing/`, not `src/billing`.
- Globs are allowed where a family is owned: `src/billing-*/`.
- A root claims its subtree. Do not enumerate children of a root already listed.
- Overlapping roots between two capabilities stay exactly as recorded — the
  overlap itself is the signal a spec author needs.

File-level precision belongs in the design doc's `**Owns:**` line, not here.

## The card header

A feature-level design document carries three header lines beneath the standard
ones. Together with the registry row they form the **capability card** — the
bounded unit a derivation loads instead of a document body.

```markdown
**Scope:** Feature-level — invoice generation and the billing history screen
**Capability:** BILL
**Owns:** `src/billing/`, `src/invoice/render.ts`, `components/billing-history/`
**Declined:** partial refunds — the ledger has no half-entry and adding one reopens reconciliation | per-customer invoice templates — one template, themed, was the decision
```

- **Capability** — the code. Must match a registry row.
- **Owns** — backticked, comma-separated file and directory paths. Repo-relative.
  This is the file-level truth; the registry's surface roots are its summary.
- **Declined** — pipe-separated entries, each naming the declined thing **and its
  reason** in one breath. Drawn from the document's `## Scope` out-of-scope
  narrative; the header is the retrievable summary, the section keeps the prose.

The header line is what makes a declined decision cheap to retrieve. An
out-of-scope item that exists only in a `## Scope` paragraph is invisible to
every future spec author, which is the failure this layer was built to fix.

A system-wide design doc may carry `Capability` and `Owns` without `Declined`
when it declines nothing in particular. A requirements doc needs no new header
line: its `ID prefix` is already the code.

## Status

Registry status tracks the capability, not a document:

| Status | Meaning |
|---|---|
| `draft` | Specified but not agreed |
| `active` | Agreed; built or being built |
| `shipped` | In production and stable |
| `deprecated` | Retired — the row and its code stay |

When the requirements and design documents disagree in status, the registry
takes the **less advanced** of the two. A capability is not `shipped` because
its design doc says so while its requirements doc is still `draft`.

## Growing past a flat table

The flat table is the shape until it stops being readable — roughly forty rows.
The split, when it comes, adds a domain router **above** these rows:

```markdown
| Domain | Scope | Surface roots | Capabilities |
|---|---|---|---|
| commerce | Cart, checkout, billing | `src/billing/`, `src/cart/` | [catalog](./catalog/commerce.md) |
```

Row grammar does not change; rows move into `docs/capabilities/catalog/<domain>.md`
unedited. Do not build the router early — a router over twelve rows is
navigation for navigation's sake.
