# Question card recipe

Load this file with the first card when the required output shape is uncertain.
`SKILL.md` remains authoritative for which slots are required.

## Contents

- Slot expansion (Radius through Stop)
- Recommendation argument
- Shape sub-slot
- Extra rationalizations (coverage / compat restatements)

## Slot expansion

Exactly **one** decision per message. Write cause-and-effect sentences in the
user's domain language. Preserve exact technical terms.

1. **Radius** — `architecture` · `data` · `auth/security` · `UX flow` ·
   `cmk:delivery-simplify`. Coverage ON adds `reliability` · `failure` · `operate`.
2. **Thread** — *Locked so far* · *This card* · *Still open after* (names, never
   "3 of 5").
3. **Territory** — grounded repo facts. Teach a blocking blindspot here. Do not
   invent. Do not ask the user to recall what you can read.
4. **Question** — the decision in plain language.
5. **Why it matters** — blast only (what rewrites if the answer flips). Graders
   are slot 7.
6. **Closes** — `known-unknown` · `unknown-known` · `blindspot-confirm`.
7. **Criteria (graders)** — 1–2 named pass/fail graders **above** Options on
   every high-blast radius. Recommendation cites them by name.
8. **Options (2–4)** — gains, pays, can break, better-fit. Bare labels are not
   options. **Shape** on `architecture` or `data`: caller-facing difference
   (signature, type, column, route, payload), ≤6 lines, no bodies, every option
   (not only the recommended one).
9. **Recommendation** — Pick · Decisive factors (Territory + named Criteria) ·
   Runner-up · Accepted trade-off · Confidence / evidence gap · Reopen trigger
   (observable; “if requirements change” is not a trigger).
10. **Stop.** Wait. Recompute the open set, then next card or close package.

Visible order: `Radius → Thread → Territory → Question → Why it matters →
Closes → Criteria → Options → Recommendation → Stop`.

## Extra rationalizations

These restated coverage/compat counters live here so the root table stays
short. They still bind when Coverage ON or Compat obligation is in play.

| Thought | Reality |
|---|---|
| "Production intent means treat every schema change as if users were on it" | Delivery intent is the quality bar; Compat obligation names who is committed. On None the clean in-place rewrite is the Production answer. |
| "Nothing in the repo confirms that migration never ran — stay additive" | Compat obligation None is that confirmation. |
| "Additive is bounded debt — one follow-up migration retires the old column" | The follow-up is the debt. On None ship one shape. |
| "Reliability is later / skip the map" | When Coverage ON, Missing cells stay open. |
| "TBD is fine — Open Questions will catch it" | When ON: unowned TBD blocks close; signer required. |
| "Absent/MVP/Early = Production coverage" | ON needs all three gate parts. |
| "Parent tier-0 brief still needs full coverage" | Brief / tier-0 ⇒ OFF. |
| "OFF — keep a partial coverage map anyway" | OFF omits the map. Core close is slots 4–6 + problem lock. |
| "Put TBD and accepted risk in one bucket" | When ON: three distinct close slots. See `references/production-coverage.md`. |
