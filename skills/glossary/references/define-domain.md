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

Update `docs/requirements/glossary.md` **inline, the instant a term is settled** — never batch glossary edits for later; batched terms get forgotten. If no `docs/requirements/glossary.md` exists yet, create it lazily when the first term settles (seed from `references/templates/glossary.md`).

`docs/requirements/glossary.md` holds exactly one kind of entry: a term definition. Decisions go to ADRs; implementation detail and spec fragments go to the specs. Write the entry in the shape `SKILL.md` § Entry shape gives, closing with the competitors it banishes:

```md
### Workspace

The top-level container a team collaborates in; owns all Notes and Folders. It is not a
deployment and not a billing account.
_Avoid_: project, space, tenant
```

Be opinionated: one canonical term, competitors banished to the `_Avoid_` list. Only project-specific concepts belong; general programming vocabulary does not.

A decision that settles while you work is not a glossary entry: offer an ADR through
`cmk:adr`, whose three-part gate decides whether it earns one.
