# System docs for NFR grounding (thin consult)

Loaded from Step 2b's `WHEN` pointer, once per quality attribute that is
material for this feature.

**Load:** `cmk:system-docs`'s `references/consult-recipe.md` (authority,
hard-constraint precedence, no-op when absent/non-authoritative, once-per-entry
suggest, never auto-invoke).

**When:** before writing each quality-attribute line that is **material** for
this feature (the attribute is not already headed for `None`). Do **not** load
architecture narrative, codebase map/modules/ownership/deps, or ops runbooks
here — those are cmk:design / cmk:delivery-spec-plan layer.

| Attribute material when… | Consult if Approved | Ground the NFR with… |
|---|---|---|
| Feature owns a measured latency/throughput surface | `docs/requirements/metrics.md` first; if Absent/non-authoritative, then `docs/ops/reliability.md` for latency/throughput **SLO** lines only | standing product metric, else greppable `SLO-N` that names this surface — never a freehand number when either doc defines one |
| Crosses authn/authz, tenant scope, public vs admin data, or compliance | `docs/security/threat-model.md`; also `compliance.md` when regulatory | greppable `TB-N` / `THR-N` / `CMP-N` **only** when bold-defined in those docs |
| Owns availability, error budget, recovery, or durability targets | `docs/ops/reliability.md` | greppable `SLO-N` (or stated error-budget rule) **only** when bold-defined. A pure latency SLO used under Performance does **not** force Reliability material |
| Ships UI a person perceives (not headless/API-only) | `docs/rules/common/accessibility.md` | house conformance target and keyboard/SR rules |

**Story actors (not an NFR slot):** WHEN a `**Story:**` line names a product role
and `docs/requirements/personas.md` is Approved, align the actor with standing persona
vocabulary — do not invent a parallel cast.

**Hard constraints for this step** (outrank any system doc — consult-recipe):
confirmed cmk:scope decisions and vision non-goals. Live `ARCH-N` the feature
already relies on stays binding; do not invent a contradicting NFR.

**Write rules after consult:**

- **Approved + material:** write the NFR EARS criterion so its measurable target
  (and any TB/THR/CMP/SLO ID you cite) comes from the Approved doc — not from
  industry habit or a number you invent. Name verification method as today.
- **Absent or non-authoritative (after the table's full path):** CONTINUE
  (no-op). Then, in order: (1) cmk:scope lock that already states a target →
  use it; (2) else domain-judgment EARS **without** a fabricated greppable ID;
  (3) else `None — no standing <entry> target`. Suggest
  `/cmk:system-docs <entry-key>` **at most once per entry** when the gap is
  material for *this* feature; never auto-invoke.
- **Do not invent** TB/THR/CMP/SLO (or product metric IDs) without a bold
  definition in an Approved doc. Prefer omitting the ID (prose target from a
  lock) or `None — no standing <entry> target` over a fabricated ID.
- Design-solution still owns HOW (`Security:` / `Reliability:` design slots,
  seams, modules). This step only mints **WHAT** quality criteria as `CODE-N.M`.

Write each applicable attribute as an EARS criterion (Step 2's forms) that names a
**measurable-or-checkable target AND its verification method**, carrying a
hierarchical `**CODE-N.M**` ID so it traces through tasks and tests exactly like
a behavioral criterion. Example (targets illustrated only — prefer standing docs
when Approved):

- `**CODE-3.1** WHEN the notes list renders 1,000 items THE SYSTEM SHALL paint
  the first screen within 200 ms at p95 — verified by a CI performance trace.`
