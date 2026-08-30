---
name: cmk:codebase-docs
description: Use when the user asks to "document the codebase for AI", "bootstrap AI docs", "generate codebase map", "set up AI navigation docs", "update AI docs", "refresh docs after change", or mentions building progressive-disclosure docs so an AI can find the right source files quickly. Produces a tree of concise docs that *point to* code rather than duplicate it. Use even when the user only says "document this repo" without specifying the structure.
version: 0.1.3
---

# Codebase Docs for AI Navigation

Build a tree of short documentation files under `docs/ai/` whose only job is to help an AI (or a human skimming quickly) locate the right source file for a topic. Each doc describes **what a thing is and where it lives**, not how the code works line-by-line.

The tree mirrors how a newcomer would ask questions: start broad ("what is this repo?"), then drill down ("how does the TUI input loop work?"). At each level, the reader sees a short menu of sub-topics, each a one-line hook, and only descends into the ones that matter.

## When to use

Two explicit entry points — never run on autopilot:

- **Bootstrap** — user says something like "set up AI docs", "document the codebase for AI", or it's a fresh repo with nothing under `docs/ai/`. Build the whole tree from the top.
- **Update** — user says "update the AI docs for X", "I added feature Y, refresh the docs", or similar. Find the affected nodes and edit in place; don't rewrite everything.

If the mode is ambiguous, ask.

## References

Bootstrap? Read `references/bootstrap-workflow.md`.
Update? Read `references/update-workflow.md`.
Doc shape, principles, split heuristic, and what not to document? Read `references/doc-shape.md`.
Want a concrete sketch? Read `references/working-example.md`.
Failure modes? Read `references/failure-modes.md`.

## Final check

Before finishing, run the checklist in `references/failure-modes.md`.
