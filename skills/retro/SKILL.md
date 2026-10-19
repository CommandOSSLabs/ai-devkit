---
name: cmk:retro
description: Mine the active session for durable process lessons and propose concrete skill edits — wait for approval before changing any skill.
version: 1.0.0
disable-model-invocation: true
---

# Reflect

Turn a finished hard session into skill-set improvements. Do not auto-apply.

<HARD-GATE>
OVERRIDE SHIP (2026-09-08): overlap research said `/cmk:skill-authoring` already
covers transcript→skill edit. User override required a dedicated `/cmk:retro`.
</HARD-GATE>

## When

User said `/cmk:retro`, or a complex task (many tool calls) just landed with a
generalizable path, dead-ends, or mid-task corrections. Skip trivial chats.

## Steps

1. **Locate transcript.** Prefer the harness transcript path for *this*
   workspace only. Do not glob other projects' private chats. If none, write a
   tight digest of the session.
2. **Three lenses in parallel** (read-only subagents; different models when
   possible): Judgment (what should have been non-negotiable), Tooling (what
   script/lint/check would have caught it), Divergent (what a skeptical peer
   would refuse). Templates in `references/` beside this file.
3. **Synthesize** into Accepted / Rejected / Backlog. Prefer encoding lessons
   as lint, test, metadata, or schema over more prose
   (`encode-lessons-in-structure`).
4. **Present and wait.** Show the full list. Apply only what the user approves.
5. **Apply via cmk:skill-authoring.** Trivial one-line fixes: parent edits.
   Substantive edits or new skills: name `/cmk:skill-authoring` and follow its
   RED→GREEN cycle — reflect never skips the failing-test bar for skill text.
6. **Summarize** edits applied, new skills, backlog filed, drops with reasons.

## Rationalizations

| Thought | Reality |
|---|---|
| "I'll just patch the skill — faster" | Unapproved skill edits hit every future agent. Wait |
| "cmk:skill-authoring is enough; skip reflect" | OVERRIDE: user wanted this entry point |
| "Backlog is optional" | File it; Accepted waits for approval |

## Done when

Approved Accepted items are applied under `/cmk:skill-authoring` discipline; Rejected
and Backlog are stated; no silent skill writes.
