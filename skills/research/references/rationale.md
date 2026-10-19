<!-- Ported from jdk `why` 1.0.1 (ADR 0001). -->
# Why

Answer **why it was shaped this way**, not what it does. Evidence before narrative. Code is not intent.

<HARD-GATE>
OVERRIDE SHIP (2026-09-08): same-day baseline for "code is not intent" already
complied 2/2. User override required this skill anyway.
</HARD-GATE>

Companion: `cmk:explain` or a scan for mechanics; `cmk:research` for library/RFC facts.
This skill owns historical forcing functions.

## Iron Law

```
NO INTENT CLAIM WITHOUT A CITATION OR AN EXPLICIT INFERENCE LABEL
NO SHORTCUT BY READING CODE SHAPE AS MOTIVATION
```

## Steps

1. **Anchor.** Name target files/symbols. Seed with `git blame` / `git log --follow -p` / `gh pr view` for recent touches. Pass seeds to investigators.
2. **Coverage map.** List available tools/MCPs. Map each to a category: source control (always), issue tracker, long-form docs, team chat, infra observability, error tracking, product analytics. Spawn **one investigator per available category** in parallel (readonly tools ok; do not invent MCP access). Null result = finding. Skip only with a written reason (no MCP, or provably irrelevant).
3. **Synthesize.** Separate investigators from the synthesizer. Load `references/epistemics.md` beside this file and follow its tiers. Output sections in order:
   - The Question
   - The Code in Question
   - What We Found (direct evidence, cited)
   - What We Can Reasonably Infer (hedged, chain explicit)
   - Competing Hypotheses (if needed)
   - What We Don't Know (searches that returned empty)
   - Sources Consulted (one line per category, including nulls and skips)
4. **Present.** Do not flatten hedges into confident prose.

WHEN the `references/rationale.md` is a precursor to changing the code, append Preserve / Change / Avoid / Risk constraints for planning.

## Rationalizations

| Thought | Reality |
|---|---|
| "The null check proves they feared nulls" | Mechanics ≠ motivation. Find the ticket, PR, or incident |
| "One category is enough" | Default is coverage; nulls teach how the decision was made |
| "research already covers this" | research owns external facts; this owns design archaeology |
| "Baseline already complied — skip" | OVERRIDE: user required the skill |

## Red Flags

- Confident "because" with no citation
- Citing the code as proof of its own intent
- Skipping investigators by anticipation
- Empty "What We Don't Know"

## Done when

The note separates found / inferred / unknown, cites sources, and lists every category searched or skipped with reason.
