# Target contract

What a fully set-up repository looks like, repo-root-relative. Every line is
annotated with the facet that owns it and the check that verifies it. Not
every repo needs every line — which lines apply is the assess step's
judgment (see `## Applicability judgment` in the skill body), and a skipped
line is not a gap as long as its skip reason is recorded.

This contract covers only the facets that exist today. Later kit releases add
further branches to this tree as new facets ship — do not read the tree below
as exhaustive for all time.

```
<repo>/
├── CLAUDE.md                   # cmk:agent-instructions — thin: identity, layout
│                               #   map, invariants, commands, pointers into
│                               #   docs/rules/. Verify: exists, stays thin,
│                               #   every pointer resolves.
├── AGENTS.md → CLAUDE.md       # cmk:agent-instructions — symlink, not a copy.
│                               #   Verify: is a symlink target = CLAUDE.md.
├── .mcp.json                   # cmk:mcp-config — checked-in MCP servers, as
│                               #   applicable. Verify: parses; no inline
│                               #   secrets; per-vendor registrations agree.
├── docs/                       # cmk:docs — canonical taxonomy: navigation
│                               #   READMEs plus templates. Verify: Verify mode
│                               #   (per-directory README, no orphans/dangling
│                               #   links among canonical docs).
│                               #   docs/rules/common/ is seeded by
│                               #   cmk:agent-instructions and owned afterward
│                               #   by cmk:rule; verified as part of that
│                               #   facet's own checks, not cmk:docs's.
├── .local/                     # cmk:local-stack — gitignored, worktree-local
│                               #   root for state/scratch, as applicable.
│                               #   Verify: ignored, worktree-deterministic,
│                               #   no cross-worktree references.
├── .gitignore, runtime pins,   # cmk:toolchain — gitignore baseline, one
│   workspace config            #   version file per runtime, single
│                               #   workspace/lockfile per ecosystem, tool
│                               #   roles unambiguous. Layout of the
│                               #   workspace itself (which directories exist,
│                               #   what role each names) is cmk:project-layout;
│                               #   verify both together.
├── infra/                      # cmk:infra — isolated IaC packages, first-
│                               #   class environments, as applicable.
│                               #   Verify: no cross-package imports, every
│                               #   environment has a deploy path, no
│                               #   embedded credentials.
├── .github/workflows/          # cmk:cicd — path-filtered CI, one deploy
│                               #   workflow per deployable, taking the
│                               #   environment as input, as applicable.
│                               #   Verify: one gating CI workflow, 1:1:1
│                               #   stack/environment/deploy mapping,
│                               #   required checks pinned and matching,
│                               #   workflows/README.md current.
└── .agents/                    # cmk:agent-vendors — canonical vendored
    ├── skills/cmk-<name>/      #   skill home, per-vendor adapters and
    │                           #   bindings, as applicable. Verify:
    │                           #   frontmatter valid, adapters in sync.
    ├── skills.lock             # cmk:sync — upstream baseline per vendored
    │                           #   skill. Verify: parses, one entry per
    │                           #   vendored skill.
    └── bindings/<vendor>.md    # cmk:agent-vendors — capability binding
                                #   mechanics only, never policy.
```

Per-vendor adapter roots (`.claude/skills/cmk-<name>/`, `.grok/skills/cmk-<name>/`,
`.cursor/rules/cmk-<name>.mdc`, as applicable) are also `cmk:agent-vendors`'s —
see `cmk:agent-vendors` for the full tree and which vendor gets which tier.

`cmk:project-layout` doesn't add a single line of its own to this tree — it
governs the *shape* every other facet's files land inside (role-first
top-level directories, one workspace per ecosystem, where a shared library
graduates into `libs/`). Verify it by reading its own `## Verify` section
against whatever top-level directories the repo actually has.
