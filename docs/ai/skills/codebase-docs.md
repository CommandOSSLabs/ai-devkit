# cmk:codebase-docs

## What
Skill that builds and maintains a hierarchical, AI-navigable tree under `docs/ai/` — the very directory you are reading. Every doc points at source files instead of duplicating them, optimized for an agent skimming for "where does X live?".

## Approach
Two explicit modes: **Bootstrap** (build the whole tree from a fresh repo) and **Update** (locate affected nodes and edit in place). The skill enforces structural rules — branch READMEs are link menus, leaves follow a what / (why) / where shape, file paths must be repo-root-relative, symbol hints must be real grep-able strings. There is also a split heuristic (bounded + substantial) and explicit length guidance (~30–80 line branches, ~20–120 line leaves, hard ceiling ~200).

This skill ships an `eval.json` with two scenarios — bootstrap on this repo and an update flow that adds a hypothetical `cmk:foo` skill — used by skill-creator to grade output against assertions.

## Where
- Skill body: `skills/codebase-docs/SKILL.md` — sections `Bootstrap workflow`, `Update workflow`, `Split heuristic`, `Final check before finishing`.
- Eval scenarios: `skills/codebase-docs/eval.json` — `eval_id` 1 (`bootstrap-ai-devkit`) and 2 (`update-add-new-skill`).
- Trigger phrases the host matches: see the `description` field in the frontmatter of `skills/codebase-docs/SKILL.md`.
- Output root: `docs/ai/` in the target repo (this directory).
