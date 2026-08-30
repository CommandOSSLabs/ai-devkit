---
name: cmk:agent-vendors
description: This skill should be used when the user asks to "vendor the kit's skills into this repo", "set up agent adapters", "add a coding-agent vendor", "wire skills for Claude Code / Codex / OpenCode / Grok Build / Cursor", or whenever a repo needs one canonical skill set discoverable by multiple coding agents.
version: 0.2.0
---

# Agent Vendors

One canonical, agent-agnostic skill home per consuming repo
(`.agents/skills/cmk-*/`), with each coding-agent vendor reaching it through
the thinnest surface that vendor supports. Policy lives once, in the
canonical skill; every vendor surface carries mechanics or discovery only.

## Vendor tiers

- **Adapter-mirror** — vendors with native per-skill file discovery get a
  thin generated adapter per skill (Claude Code `.claude/skills/<skill-dir>/SKILL.md`,
  Grok Build `.grok/skills/<skill-dir>/SKILL.md`).
- **Direct-discovery** — vendors that can read the canonical home directly
  need no adapters (Codex reads `.agents/skills/` directly; OpenCode points
  its skill-paths config at it).
- **Rule-mirror** — vendors whose unit is a rules file get a narrower mirror
  covering only the skills that function as standing rules (Cursor
  `.cursor/rules/<skill-dir>.mdc`).
- **Generic** — everything else reaches the repo's conventions through the
  root `AGENTS.md → CLAUDE.md` symlink.

## Mechanics, never policy

Adapters and capability bindings (`.agents/bindings/<vendor>.md`) supply
mechanics and discovery only; they never restate, summarize, or override the
canonical skill. Delivery-family binding semantics (invoking a skill,
spawning subagents, entering a worktree) stay owned by `cmk:delivery-workflow`.

## Modes

- **init** — establish the layout and generate adapters for the vendors this
  repo actually uses.
- **update** — regenerate adapters after a canonical skill changes, or add or
  retire a vendor.
- **verify** — report-only; see `## Verify`.

Setting up the tree itself, or deciding which vendor needs which surface?
Read `references/vendored-layout.md`.

Generating or regenerating an adapter body? Read
`references/adapter-template.md`.

Wiring a CI check that enforces this without ever writing? Read
`references/sync-check-ci.md`.

`cmk:sync` owns the upstream baseline (`.agents/skills.lock`) and
reconciliation.

## Verify

Report-only — never mutate:

- Every canonical skill under `.agents/skills/cmk-*/` has valid frontmatter.
- Every adapter-mirror vendor has exactly one adapter per canonical skill,
  frontmatter byte-identical to the canonical skill and body byte-identical
  to the template.
- No adapter exists for a canonical skill that no longer exists.
- No vendor root listed under `[vendors] retired` in `.agents/skills.lock`
  exists on disk (skip when no list is present).
- `AGENTS.md` is a symlink to `CLAUDE.md`, never a copy.
- Every skill file passes the cross-package path rule (see
  `references/vendored-layout.md`).
