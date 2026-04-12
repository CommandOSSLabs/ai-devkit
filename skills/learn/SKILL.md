---
name: cmk:learn
description: Extract and record non-obvious learnings, gotchas, and valuable knowledge from any input — conversations, research sessions, debugging, files, or user instructions. Use whenever someone wants to capture what they learned, save a gotcha, or preserve insights for future reference. Also triggers for "remember this", "save this learning", "that was a long session — capture the key findings", or "what do we know about X".
metadata:
  sdl_phase: "any"
  domain: "learn"
---

# Learn

## Intents

```
That was a long research session — extract the key learnings
```
```
Save that Redis connection pooling gotcha we just discovered
```
```
Remember that the Stripe webhook retry window is 72h, not 24h
```
```
Review our accumulated knowledge on infrastructure
```
```
Learn that batch inserts above 1000 rows cause OOM in our ORM
```

## References

Read `references/learn-conventions.md` for placement rules and entry format. Read `references/learn-template.md` for the topic file structure.

## Input

Accept whatever the user provides — there is no fixed set of sources. Conversation context, debugging sessions, research findings, files, links, direct statements, incident post-mortems, PR reviews. Understand the source from natural language context; don't ask the user to categorize.

## Extraction Rule

Extract knowledge that is **non-obvious, non-trivial, and worth preserving**: gotchas, counter-intuitive behavior, validated assumptions, hard-won fixes, discovered constraints.

Skip: common knowledge, decisions (→ `cmk:adr`), requirements (→ `cmk:prd` / `cmk:feature-spec`), opinions without evidence.

## Workflow: Extract

1. Read and understand the input.
2. Identify entries that meet the extraction rule.
3. Structure each entry: title, date, context, learning, applies-to tags (see `references/learn-template.md`).
4. Find or create the topic file in `docs/knowledge/{topic}.md`.
5. Check for conflicts with existing entries — flag contradictions to the user (they decide: replace, keep both, or discard).
6. Present entries for user review before writing.
7. Write approved entries.

## Workflow: Review

1. Read all files in `docs/knowledge/`.
2. Present summary: topics, entry count, date range.
3. Support: search by keyword/tag, clean up outdated entries, or promote entries to downstream skills (`cmk:rule`, `cmk:prd`, etc.).

## Output

- Entries go in `docs/knowledge/{topic}.md`, newest first
- Never write without user confirmation
- Flag conflicts between new and existing entries
- Every entry has: scannable title, date, context, actionable learning, applies-to tags
- No duplicates within a topic file
