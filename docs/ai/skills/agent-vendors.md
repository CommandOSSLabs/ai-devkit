# cmk:agent-vendors

## What
Skill that establishes one canonical, agent-agnostic skill home per
consuming repo (`.agents/skills/cmk-*/`), with each coding-agent vendor
reaching it through the thinnest surface that vendor supports. Policy lives
once, in the canonical skill; every vendor surface carries mechanics or
discovery only, never a restatement, summary, or override.

## Approach
Four vendor tiers: **adapter-mirror** (native per-skill file discovery gets a
thin generated adapter, e.g. Claude Code `.claude/skills/<dir>/SKILL.md`,
Grok Build `.grok/skills/<dir>/SKILL.md`), **direct-discovery** (Codex reads
`.agents/skills/` directly; OpenCode points its skill-paths config at it —
no adapters needed), **rule-mirror** (vendors whose unit is a rules file get
a narrower mirror covering only the skills that function as standing rules,
e.g. Cursor `.cursor/rules/<dir>.mdc`), and **generic** (everything else
reaches the repo's conventions through the root `AGENTS.md → CLAUDE.md`
symlink). Adapter bodies are computed from a fixed template — never
hand-written per skill — so a checker can byte-compare every adapter against
the template output; capability bindings (`.agents/bindings/<vendor>.md`)
supply mechanics and discovery only, with delivery-family binding semantics
staying owned by `cmk:delivery-workflow`. Three modes: **init** (establish
the layout and generate adapters for the vendors a repo actually uses),
**update** (regenerate adapters after a canonical skill changes, or add/retire
a vendor), **verify** (report-only). Ends with a report-only `## Verify`
section.

## Where
- Skill body: `skills/agent-vendors/SKILL.md` — sections `Vendor tiers`,
  `Mechanics, never policy`, `Modes`, `Verify`.
- `references/vendored-layout.md` — the consuming-repo tree, the naming
  mapping between upstream and vendored directories, the cross-package path
  rule (no skill file references outside its own package by relative
  traversal), and the unsupported-vendor-roots convention.
- `references/adapter-template.md` — the byte-exact full-form and short-form
  adapter templates, which form a skill gets, the rule-mirror shape, and the
  substitution table.
- `references/sync-check-ci.md` — the check-only CI convention: structure and
  safety checks only, never prose matching, with no write mode.

## Links
- Upstream baseline and reconciliation: `cmk:sync`.
- Delivery-family binding semantics: `cmk:delivery-workflow`.
