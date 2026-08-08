# The vendored layout

The consuming-repo tree, repo-root-relative:

```
<repo>/
├── AGENTS.md → CLAUDE.md          # generic-tier discovery (symlink, never a copy)
├── .agents/
│   ├── skills/cmk-<name>/         # canonical skills, vendored, evolve in place
│   ├── skills.lock                # upstream baseline per skill — owned by cmk:sync
│   └── bindings/<vendor>.md       # capability bindings: mechanics only
├── .claude/skills/cmk-<name>/     # adapter-mirror tier (generated)
├── .grok/skills/cmk-<name>/       # adapter-mirror tier (generated)
└── .cursor/rules/cmk-<name>.mdc   # rule-mirror tier (narrow subset)
```

## Naming mapping

Upstream directory `skills/<name>/`, vendored directory
`.agents/skills/cmk-<name>/`, frontmatter `name: cmk:<name>` identical on
both sides. The frontmatter name is the join key; sync never relies on
directory names matching across the two sides.

## The cross-package path rule

No file inside a skill package references anything outside that package by
relative traversal. A skill that needs a target-repo artifact names it
repo-root-relative (`docs/templates/design.md`); a skill that needs another
skill cites it by `cmk:` name. Content a skill emits *into* the target repo
follows the target tree's own conventions — the rule binds the package's own
references, not its templated output. Rationale: vendored packages travel
independently — a relative parent-directory escape resolves in one layout
and dangles in every other.

## The vendor set is open

The supported vendors are whichever ones a repo generates adapters or
config for — the tiers above cover any coding agent, and a new vendor joins
by adding its thin adapter or config entry, never by changing the canonical
skills. When a repo retires a vendor, delete its root in the same change; a
repo that wants a guard against a retired root silently coming back lists
the retired directories under `[vendors] retired` in `.agents/skills.lock`
(see `cmk:sync`'s `references/skills-lock.md`), and verify reports any
listed root that reappears. The list is optional — no entry, no check.
