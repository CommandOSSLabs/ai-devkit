# Adapter templates

## Derivability principle

Adapter bodies are computed from a fixed template — never hand-written per
skill — so a checker can byte-compare every adapter against the template
output. The fenced blocks below are that byte-exact template, including
their line breaks and terminal newline; only the placeholders and the
frontmatter block are substituted per skill and vendor.

## Full-form template

Skills that name a capability binding get the full form:

```markdown
---
<frontmatter copied byte-for-byte from the canonical skill>
---

# <skill-dir>

This file is <Vendor>'s native discovery entry point. Before acting:

1. Read `.agents/skills/<skill-dir>/SKILL.md` completely.
2. Read the capability binding at `.agents/bindings/<vendor>.md`.
3. Follow the shared skill's phases, gates, artifacts, and acceptance
   exactly.

The <Vendor> adapter supplies mechanics only and must not replace the
shared skill.
```

## Short-form template

Pure-guidance skills with no runtime mechanics get the short form:

```markdown
---
<frontmatter copied byte-for-byte from the canonical skill>
---

# <skill-dir>

This file is <Vendor>'s native discovery entry point. Before acting, read
`.agents/skills/<skill-dir>/SKILL.md` completely and apply it.

The <Vendor> adapter supplies discovery only; the shared skill carries the
guidance.
```

## Which form a skill gets

Full form iff `.agents/bindings/<vendor>.md` exists for that vendor and the
skill's mechanics depend on it; short form otherwise. The test is per
vendor, not per repo — one vendor's missing binding never blocks another
vendor's full-form adapter.

## Rule-mirror (Cursor) shape

`.cursor/rules/<skill-dir>.mdc` with frontmatter `description:` (copied from
the canonical skill), `globs:` empty, `alwaysApply:` per the repo's judgment
(true only for standing-rule skills), and a two-line body directing the
agent to read the canonical SKILL.md completely and not copy, summarize, or
override it.

## Substitution table

| Placeholder | Meaning |
|---|---|
| `<Vendor>` | Product name (e.g. Claude Code, Grok Build). |
| `<vendor>` | Directory token (e.g. `claude`, `grok`). |
| `<skill-dir>` | Canonical skill directory name (e.g. `cmk-design`). |
