# Blast prove (runtime safety fact)

Loaded from `cmk:delivery-review` when the pinned range changes runtime behavior,
storage, a wire/contract shape, or configuration.

## Job

Item 24 finds readers beyond the diff. This lane adds: name the **one fact**
the change is safe because of, chase edges **grep on symbols misses**, and
**prove that fact by running code** — not a writeup alone.

## Steps

1. Read the diff. State what changed, including the non-obvious part.
2. Name the one safety fact (example: "only drops already-dead cache entries").
3. Hunt where name-search stops: JSON/wire keys, DB columns, other-language
   consumers, feature flags, teardown/microtask timing, pinned library behavior.
4. Grade each risk honestly (likely × cost). Keep confirmed risks; list cleared.
5. Prove the one fact: smallest script or test that imports the real code / drives
   the real consumer and fails loud if wrong. Paste the command and output.
   Cannot prove cheaply → mark **unproven** out loud. Do not round up.
6. Hand back under `## Blast prove`: What it does · The one fact (+ rung:
   said-so / pointed-at-line / walked-impossibility / ran-it / ran-in-app) ·
   Risks · Cleared · Before merge (cheapest catch).

## Rationalizations

| Thought | Reality |
|---|---|
| "Suite is green — safe" | Suite may never touch the other-language reader |
| "I listed the Python script in the writeup" | Listing ≠ running. Paste the output |
| "Item 24 already covers readers" | Item 24 is search; this is runtime proof |
| "A review already proved this kind of change once" | That run proved one diff. This lane proves this one |

*Done when: the one fact is proven by a command output, or explicitly unproven.*
