# cmk:capability-map — test evidence (v0.2.0)

Light run per `author-skills`: description trigger-test plus a recipe-execution
test. Pressure scenarios for the confirm-before-write gate are **not** covered —
see [Not tested](#not-tested).

## Model roster

| Model | Role |
|---|---|
| claude-sonnet | Secondary |
| claude-haiku | **Weakest on the roster — the model that decides green** |

Run headless, fresh context per run: `claude -p --model <m>`.

## S1 — Description routing

16 queries against the full `cmk:*` description table, descriptions only, no
bodies. 8 should-fire (5 capability-map, 3 trace-audit), 8 should-not-fire drawn
from the neighbors whose scope abuts: `docs`, `requirements`, `design`,
`delivery-review`, `glossary`, `codebase-docs`, `discover-efforts`, `learn`.

### RED — v0.1.0

| Model | Score | Failure |
|---|---|---|
| sonnet | 16/16 | — (flagged `capability-map` vs `adr` as unseparated) |
| haiku | **15/16** | Q3 "we talked about this months ago and decided against it, where is that written down" → routed to `cmk:adr` |

Both models named the same gap verbatim: the descriptions *"don't cleanly
partition 'record a decision' from 'look up a past decision'"* (sonnet). Haiku
also flagged Q4 against `cmk:glossary` — "the word 'code' is ambiguous".

### GREEN — v0.2.0

Description gained the lookup phrasings the queries actually use
("was this already ruled out", "where did we write down that we decided against
it"), the outcome nouns (the registry, the advisory envelope), and one boundary
clause naming `cmk:adr` for the recording direction.

| Model | Score | Q3 | Q4 |
|---|---|---|---|
| sonnet | 16/16 | correct, cites the boundary clause | correct |
| haiku | **16/16** | correct, **no runner-up** | correct, **no runner-up** |

## S2 — Recipe execution (`references/neighbor-derivation.md`)

Real repository, real request: *"I want to add a command palette to the skills
catalog page. Which capabilities already share this surface?"* Seeds:
`app/skills/page.tsx`, `components/skills/skill-catalog.tsx`; terms `catalog`,
`palette`, `navigation`.

**Both models, both versions, produced the identical envelope** — `SKEX`,
`score 2033`, `shared_paths=2`, `terms=3`, coverage `2/2` — and surfaced the
declined entry that answers the request ("a command palette — a third navigation
surface before the two that exist are settled"). The derivation is green on the
weakest model.

### RED — v0.1.0, ambiguities the executing agents had to guess past

| # | Ambiguity | Found by |
|---|---|---|
| 1 | Pass S never says what a registry cell path resolves against | sonnet |
| 2 | Envelope example inconsistent: 1 declined item inline, 2 in the aggregate, no selection rule | sonnet + haiku |
| 3 | Splitting the `**Declined:**` value on `\|` never stated | haiku |
| 4 | "Denoise single segments" read as contradicting "a deeper path is kept" | haiku |
| 5 | `*` not covered by the normalization rules | haiku |
| 6 | Card text = raw markdown or the value after the label? | sonnet |
| 7 | Substring matching across a hyphenated compound (`skill-catalog` vs `catalog`) | haiku |

Sonnet on #2, verbatim: *"I resolved this by putting all four of SKEX's declined
items in both places, specifically because dropping the 'command palette' one —
the single fact this request most needed — would have violated the spirit of
'Grounded claims' even though the letter of the recipe never told me how many to
keep."* The recipe was one judgement call away from losing the answer.

### GREEN — v0.2.0

All seven closed as stated rules, not prose hints: resolution base named in
Pass S; **Every declined item, both places** stated after the envelope example
and the example itself made consistent; `|` split stated in Pass T; the denoise
rule reworded to reach only single-segment tokens; `*` explicitly kept;
card text defined as the value after the label; substring stated to cross word
boundaries with the `skill-catalog` case as the example.

Re-run on haiku: identical envelope, all four declined items in both places, and
no behavioral ambiguity left — its remaining notes are formatting observations,
one of which opens *"This is not ambiguous"*.

## Not tested

- Pressure scenarios against the **confirm-before-write** rule (time / authority /
  sunk cost). The Iron Law's "NO ROW WITHOUT CONFIRMATION" has no RED transcript
  behind it yet; it was written from the failure mode, not from an observed one.
- Backfill and Amend workflows end to end.
- Any model outside the roster above.
