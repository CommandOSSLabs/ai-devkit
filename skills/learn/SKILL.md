---
name: cmk:learn
description: This skill should be used when the user asks to "remember this", "save this learning", "capture the key findings", "what do we know about X", "save that gotcha", or needs to extract and record non-obvious learnings, gotchas, and valuable knowledge from conversations, research sessions, debugging, files, or user instructions.
version: 0.2.0
---

# Learn

Extract and record non-obvious learnings, gotchas, and valuable knowledge from any input. Accept whatever the user provides — conversation context, debugging sessions, research findings, files, links, direct statements, incident post-mortems, PR reviews. Understand the source from natural language context; never ask the user to categorize.

## References

Read `references/learn-conventions.md` for placement rules and entry format. Read `references/learn-template.md` for the topic file structure.

## Extraction Rule

Extract knowledge that is **non-obvious, non-trivial, and worth preserving**: gotchas, counter-intuitive behavior, validated assumptions, hard-won fixes, discovered constraints.

Skip: common knowledge, decisions (→ `cmk:adr`), requirements (→ `cmk:requirements` / `cmk:design`), opinions without evidence.

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
3. Support: search by keyword/tag, clean up outdated entries, or promote entries to downstream skills (`cmk:rule`, `cmk:requirements`, etc.).

## Output

- Entries go in `docs/knowledge/{topic}.md`, newest first
- Never write without user confirmation
- Flag conflicts between new and existing entries
- Every entry has: scannable title, date, context, actionable learning, applies-to tags
- No duplicates within a topic file
