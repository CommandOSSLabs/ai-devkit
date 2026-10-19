<!-- Ported from jdk `define-domain` 1.2.0 (ADR 0001). -->
# Define Domain

Actively build and sharpen the project's glossary while designing. Merely *reading* `docs/requirements/glossary.md` for vocabulary is a habit any skill has; this skill is for *changing* the model — challenging terms, probing edges, and writing settlements down the moment they happen.

## During the conversation

**When another skill owns the interview** (e.g. `cmk:interview` inside `cmk:scope`), you run as a passive side effect, not a second interviewer. Do the silent work directly — record a settled term to `docs/requirements/glossary.md`, cross-reference the code — but anything that needs the user (a challenge, a disambiguation, an edge-case probe) does **not** get its own turn: hand it to the interview's single question channel as the next question, asked one at a time in dependency order. Only when you are invoked standalone do you drive the questions yourself.

**Challenge terms against the glossary.** When the user's usage conflicts with `docs/requirements/glossary.md`, call it out on the spot: "Your glossary defines *cancellation* as voiding the whole order, but you seem to mean removing one line item — which is it?"

**Sharpen fuzzy language.** When a term is vague or overloaded, propose a precise canonical one: "You keep saying *account* — is that the Customer or the User? They differ here."

**Stress-test with edge-case scenarios.** When relationships between concepts come up, invent concrete scenarios that press on the boundaries: "A Member leaves mid-billing-cycle with an unpaid Invoice — what happens to their Workspace?" Force the boundary to be stated, not implied.

**Cross-reference the code.** When the user asserts how something works, check whether the code agrees. Surface contradictions explicitly: "The glossary (and you) say partial refunds exist, but the code only refunds full payments — which is right?" Never let the glossary and the code silently disagree.

## Updating docs/requirements/glossary.md

Update `docs/requirements/glossary.md` **inline, the instant a term is settled** — never batch glossary edits for later; batched terms get forgotten. If no `docs/requirements/glossary.md` exists yet, create it lazily when the first term settles (seed from the skill set's `references/templates/CONTEXT.md`. Resolve pack seeds in this order,.

`docs/requirements/glossary.md` holds exactly one kind of entry: a term definition. Decisions go to ADRs; implementation detail and spec fragments go to the specs. Term format:

```md
**Workspace**:
The top-level container a team collaborates in; owns all Notes and Folders.
_Avoid_: project, space, tenant
```

Be opinionated: one canonical term, competitors banished to the `_Avoid_` list. Definitions stay to one to three tight lines — what the thing *is*, not how it's built. Only project-specific concepts belong; general programming vocabulary does not.

## ADRs — sparingly, through the three-part gate

Offer an ADR only when **all three** hold:

1. **Hard to reverse** — changing course later carries real cost.
2. **Surprising without context** — a future reader would ask "why on earth this way?"
3. **A real trade-off** — genuine alternatives existed and one was chosen for specific reasons.

Any one missing → no ADR. For contrast — a decision that is surprising and a real trade-off but **cheap to reverse** earns none: a 200 ms debounce on the search box trades responsiveness against request volume, yet flipping it later is a one-line change, so it fails "hard to reverse." Record it in the code, not an ADR. Format: `docs/decisions/NNNN-slug.md` (create the directory lazily), numbered sequentially — scan for the highest existing number and add one. Body is a short title plus **1–3 sentences**: context, decision, why. That's the whole document; recording *that* and *why* is the value, not filling sections.

If a new decision contradicts an existing ADR, flag the conflict to the user and resolve it explicitly (supersede the old ADR by number).

## When pruning or auditing ADRs

The three-part gate decides whether to *write* an ADR. This section decides whether a live one still earns its place.

<NON-NEGOTIABLE>
Word count, age, and folder size are not archive criteria. A lead, a review tomorrow, or a quota does not replace classification.
</NON-NEGOTIABLE>

Classify every live file. *Done when: each one is keep, archive, or drop, with a one-line reason.*

- **Keep** — a future change still needs it: the decision still constrains the running system, or a rejected alternative is still being pitched and this file is why it lost.
- **Archive** — the decision shipped and the body will not guide a future change (closed UI chrome, implementation recap, process history now obvious from the code). Move it to `docs/decisions/archived/` and insert `Archived: YYYY-MM-DD` under the title. Do not rewrite the body.
- **Drop a rejection** only when the losing idea is no longer a plausible proposal. Otherwise keep it.

Tightening the folder by hiding a live constraint or a still-tempting rejection is not cleaning. *Done when: the live tree still holds every decision that binds or still guards a live bad idea.*

## Red Flags

- Archiving every file older than N days or longer than N words
- Emptying `docs/decisions/` so a review "looks tight"
- Treating "don't get precious / the point is the count" as a reason to skip classification

| Thought | Reality |
|---|---|
| "Judging each file against still-useful is the opposite of the lead's explicit criteria" | The quota is a discovery hint, not the test. Classification is the job |
| "A tight live folder by mechanical rule is what was ordered" | A tight folder that hid the decisions still in force is a hollow review |
| "Don't get precious about individual files; the point is the count" | The point is which decisions still bind. Count is a side effect |
