# Component Sourcing

When a UI component is provided as reference material — pasted code from an
external registry (shadcn, beui.dev, a design system), a screenshot, or a
"build something like this" link — adapt it into a real file under
`components/` in this repository. Never leave it as an external-only
reference, a dependency the project doesn't actually use, or a description
without a corresponding file.

Adapting means:

- **Reuse what's already installed.** Match the reference's dependency list
  against `package.json` before adding anything new. A package rename (e.g.
  `framer-motion` → `motion`, whose import path is `motion/react`) is not a
  new dependency — resolve it, don't install a duplicate.
- **Match this project's aliases and conventions**, not the source's.
  `@workspace/ui/lib/utils` becomes `@/lib/utils`; the source's own directory
  layout becomes wherever this project organizes that kind of component
  (e.g. `components/motion/` for motion-driven pieces).
- **Match this project's styling tokens**, not the source's default palette.
  Re-derive hardcoded colors against the CSS custom properties already
  defined in `app/globals.css` (`--bg-*`, `--text-*`, `--border-*`, the
  syntax palette) rather than copying the reference's raw hex/oklch values
  verbatim.
- **Verify before committing it.** Run `type-check`, `lint`, and `build` —
  reference code is written for a different project's setup and routinely
  doesn't compile as-is (wrong import paths, a CLI init step that rewrites
  unrelated files, a theme system that conflicts with this one).

## Why

A component that exists only as chat context or an external URL isn't
part of the codebase — it can't be reviewed, versioned, or reused, and the
next session has no way to find it. Treating "the user pasted some code" as
equivalent to "the feature is done" silently defers real integration work.

This surfaced twice in the same session: a `NotificationStack` (from
beui.dev) and a `CircuitBoard` (pasted framer-motion component) were both
initially at risk of staying as unintegrated reference snippets before being
hand-adapted into `components/motion/` using the project's own `motion`
dependency and `@/lib/utils` alias.

## Also watch for: tooling that rewrites unrelated files

A registry CLI's `init` step (e.g. `shadcn init`) may auto-detect "no
existing config" and rewrite core files — `app/layout.tsx`, `app/globals.css`
— to match its own defaults, discarding project-specific setup (custom fonts,
a hand-built CSS token system, dark-mode wiring) in the process. Prefer
hand-adapting the component over running an init/scaffold command in a
project that already has an established setup; if a CLI is unavoidable,
diff its changes against the previous commit before accepting them, and
revert anything outside the component files it was asked to add.
