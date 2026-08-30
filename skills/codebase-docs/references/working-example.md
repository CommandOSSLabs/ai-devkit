# Working example (sketch)

The shape is the same regardless of stack — the tree under "Output location and shape" in `references/doc-shape.md`, with folder names mirroring whatever the codebase calls its parts. Concrete shape examples for different stacks:

- **TS monorepo (`apps/`, `packages/`)** — top-level menu mirrors workspace members: `docs/ai/apps/<app>/`, `docs/ai/packages/<pkg>/`.
- **Rust workspace (`crates/`)** — top-level menu mirrors crate names: `docs/ai/<crate>/`.
- **Python project (`src/<pkg>/`)** — menu mirrors top-level modules: `docs/ai/<module>/`.
- **Go services (`cmd/`, `internal/`, `pkg/`)** — menu mirrors services/packages: `docs/ai/<service>/`, `docs/ai/internal/<pkg>/`.
- **Single-app repo with no clear sub-packages** — group by domain concept (e.g. `auth/`, `billing/`, `ingest/`) and let the leaves point at files anywhere in `src/`.

A leaf doc — same structure regardless of language — might read in full:

```markdown
# Session loop

## What
The main driver of an interactive session. Each iteration reads one user
input, dispatches to the worker, streams output back, and returns to idle.
Keeps the input handler responsive across long-running calls.

## Approach
The loop is persistent rather than per-turn: a single task owns the input
channel and the output renderer for the whole session. Earlier versions
re-created the task per turn, which dropped events during transitions.
See commit 88af577 for the fix.

## Where
- Entry: `<path/to/session-file>` — `<symbol for the loop>`
- Input source: `<path/to/input-file>` — `<symbol for the input channel>`
- Output renderer: `<path/to/render-file>` — `<symbol for the render fn>`
```

That's the whole doc — ~15 lines, three clear hooks into the code, no copied source. Replace the placeholders with real paths and real symbol names from whatever language the project uses.
