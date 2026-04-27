---
name: cmk:codebase-docs
description: Generate or update hierarchical, AI-navigable documentation for a codebase under `docs/ai/`. Use whenever the user asks to "document the codebase for AI", "bootstrap AI docs", "generate codebase map", "set up AI navigation docs", "update AI docs", "refresh docs after change", or mentions building progressive-disclosure docs so an AI can find the right source files quickly. Produces a tree of concise docs that *point to* code rather than duplicate it. Use even when the user only says "document this repo" without specifying the structure.
version: 0.1.0
---

# Codebase Docs for AI Navigation

Build a tree of short documentation files under `docs/ai/` whose only job is to help an AI (or a human skimming quickly) locate the right source file for a topic. Each doc describes **what a thing is and where it lives**, not how the code works line-by-line.

The tree mirrors how a newcomer would ask questions: start broad ("what is this repo?"), then drill down ("how does the TUI input loop work?"). At each level, the reader sees a short menu of sub-topics, each a one-line hook, and only descends into the ones that matter.

## When to use

Two explicit entry points — never run on autopilot:

- **Bootstrap** — user says something like "set up AI docs", "document the codebase for AI", or it's a fresh repo with nothing under `docs/ai/`. Build the whole tree from the top.
- **Update** — user says "update the AI docs for X", "I added feature Y, refresh the docs", or similar. Find the affected nodes and edit in place; don't rewrite everything.

If the mode is ambiguous, ask.

## Output location and shape

```
docs/ai/
├── README.md                  # root: whole-repo overview + link menu
├── <area>/
│   ├── README.md              # area overview + link menu to topics/sub-areas
│   ├── <topic>.md             # a leaf doc for a bounded concept
│   └── <sub-area>/
│       ├── README.md
│       └── <topic>.md
```

- Folders with their own `README.md` act as branch nodes; leaves are plain `.md` files named after the topic (`session-loop.md`, not `00-session-loop.md` — no numeric prefixes).
- A branch's `README.md` lists children as a flat menu of one-liners with relative links. It does **not** re-explain what children cover.
- Keep folder names lowercase-kebab, matching the vocabulary the code already uses. Whatever the codebase calls a unit — package, module, service, app, crate, workspace — mirror that name. If the source folder is `billing-service/`, the doc folder is `billing-service/`, not `billing/` or `payments/`.

## What goes in one doc

Every doc answers three questions, in order, and then stops:

1. **What is this?** — one or two sentences, plain language.
2. **Why does it exist / what problem does it solve?** — only if non-obvious. Skip for things a reader can infer from the name.
3. **Where is it?** — file paths with a symbol hint (function, struct, class, or a grep-able phrase) so AI can jump directly. Use markdown bullets, not prose.

For a branch doc (`README.md`), replace (3) with a link menu to children.

If implementation approach matters (an unusual pattern, a deliberate trade-off, an invariant that isn't obvious from the code), add a short "Approach" section — a paragraph or two — and still point to the code for the actual details.

### Code reference format

Point to files with enough of a hint to let AI skip straight to the right lines. The pattern is `path → symbol-or-grep-hint`:

```
- One-line description of what this thing does.
  → `<path/from/repo/root>` — `<symbol or grep hint>`
```

Use a named symbol when one exists — function, class, struct, type, const, route, config key, whatever the language offers. Fall back to a short grep-able string from the code only if no named symbol covers it (e.g., a regex, a magic number, a CLI flag). Don't invent names — if you can't quickly find a hook, open the file and grab the real one.

**Always write paths relative to the repo root**, not bare filenames. `apps/api/src/server.ts`, not just `server.ts`. A doc about a sub-folder still writes the full path from the repo root when it references a file, because the reader (an AI or a human `find`-ing) starts at the repo root, not inside the doc's folder. Bare filenames force a guess-the-path step that the skill exists to eliminate. The only exception: when every path in a tight list is in the same directory and you've just named that directory one line above, shortening is fine — but err toward being explicit.

## Principles

**Progressive disclosure.** A doc should be readable in ten seconds and tell the reader where to go for more. If you catch yourself explaining a sub-concept in depth, that sub-concept probably deserves its own doc — link to it instead.

**Don't duplicate the code.** No copy-pasted function bodies, no snippets longer than a couple of lines. If a reader needs the actual logic, they open the file. The doc's value is knowing *which* file.

**Don't document the obvious.** Skip things whose purpose is clear from the name or from reading the first ten lines of the file. `src/main.rs: entry point` is noise. A non-obvious invariant ("this must run before `init_db` or migrations panic") is signal.

**Coherence over splitting.** If a topic is naturally one story, keep it in one doc even if it runs a bit long. Only split when there's a genuinely bounded sub-concept *and* the parent is getting unwieldy — see the split heuristic below.

**Match the code's vocabulary.** Use the same names the code uses. If the source folder is `rcp/` (or the package is `@org/rcp`, or the module is `rcp`), the doc folder is `rcp/` — not a more "descriptive" alias like `remote-control-protocol/`. The doc's job is to be findable from the code's own terms.

## Split heuristic

Split a topic into its own sub-doc when **both** are true:

1. **Bounded** — the sub-topic has a clear boundary a reader could land on directly without needing the parent's context.
2. **Substantial** — it would take more than a few bullets or a short paragraph to cover, *or* the parent doc is pushing past ~100–150 lines and getting hard to skim.

If only (1) holds and the sub-topic is a two-line bullet, leave it inline. If only (2) holds (the parent is long but the content is one continuous narrative), don't chop it artificially — rewrite for brevity first.

Rule of thumb: a good branch doc is ~30–80 lines. A good leaf doc is ~20–120 lines. If a leaf is heading past 200, ask whether it's really one topic.

## What NOT to document

- Entry points whose role is obvious from the filename (`main.*`, `index.*`, `app.*`, `cmd/*/main.go`, etc.).
- Boilerplate: standard package manifests (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `pom.xml`, `Gemfile`, etc.) and typical framework scaffolding.
- Anything already well-covered by a top-level `README.md` — link to it instead of restating.
- Generated code, vendored dependencies, lockfiles, migration files.
- Features that don't exist yet. Don't speculate.

## Bootstrap workflow

1. **Survey the repo.** Read the root `README.md`, any `CLAUDE.md` / `AGENTS.md`, the top-level directory layout, and whatever package/workspace manifest the stack uses (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `pom.xml`, `Gemfile`, etc.) for declared workspace members or sub-packages. Identify the 3–8 major areas — apps, services, packages, modules, significant subsystems. Note anything the existing README already explains well — don't duplicate it.

2. **Draft `docs/ai/README.md`.** One paragraph: what this repo is, what it does, who it's for. Then a link menu to the major areas, each a single sentence. Nothing else.

3. **For each area, decide branch vs. leaf.** If the area has ≥2 substantial sub-topics, make it a folder with its own `README.md`. If it's one coherent thing, make it a single `.md` at the parent level.

4. **Drill down recursively.** For each branch, identify its sub-topics by skimming the code (directory structure, module boundaries, key types/functions). Apply the split heuristic. Stop recursing when a sub-topic is either (a) obvious from its name + file path, or (b) small enough to fit as a bullet in its parent.

5. **Write leaf docs.** For each, read enough of the actual code to write a truthful what/why/where. Don't paraphrase from guesswork — open the file. Grab the real symbol names.

6. **Verify links.** All relative links resolve; all file paths exist; all symbol hints are real (grep for them). Broken references are worse than no reference.

7. **Sanity-check length.** Every doc under the length guidance above. Any doc that runs long, either split or trim.

## Update workflow

1. **Locate affected nodes.** Given the change (new feature, renamed module, deleted subsystem), find every doc that mentions it. `grep -r` on the old name is usually enough.

2. **Edit in place.** Preserve the existing structure; don't rewrite docs that still describe reality. Update file-path hints, symbol names, and one-line summaries as needed.

3. **Add new nodes if genuinely new.** A new area gets a new folder + `README.md`; a new topic inside an existing area gets a new leaf and a line in the parent's menu.

4. **Remove stale nodes.** If a subsystem is deleted, delete its doc and remove it from the parent's menu. Don't leave tombstones.

5. **Re-verify links and symbols** for every edited file.

## Working example (sketch)

The shape is the same regardless of stack — the folder names just mirror whatever the codebase calls its parts. A typical tree for a multi-area repo:

```
docs/ai/
├── README.md                         # one paragraph: what the repo is + a menu of areas
├── <area-1>/
│   ├── README.md                     # menu of sub-topics in this area
│   ├── <topic-a>.md                  # leaf: what / (why) / where
│   ├── <topic-b>.md
│   └── <sub-area>/
│       ├── README.md
│       └── <topic-c>.md
├── <area-2>/
│   ├── README.md
│   ├── <topic-d>.md
│   └── <topic-e>.md
└── <area-3>/
    └── README.md                     # small enough to stay single-doc
```

Concrete shape examples for different stacks:

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

## Common failure modes

- **Paraphrased code.** If the doc is explaining control flow line-by-line, delete that and just point to the function.
- **Essay-style prose.** Bullets and short paragraphs beat flowing prose for skim-reading.
- **Phantom references.** Never invent a function or file name. If you're unsure, open the file and check.
- **Over-splitting.** Eight three-line leaves are harder to navigate than one thirty-line doc. Err toward keeping related things together.
- **Under-splitting.** A single 500-line `README.md` with everything is exactly what this skill is trying to replace.
- **Documenting aspirations.** Only describe what's in the code now.

## Final check before finishing

- [ ] Root `docs/ai/README.md` exists and links to every top-level area.
- [ ] Every branch `README.md` has a link menu, not a wall of text.
- [ ] Every leaf has what / (why, if non-obvious) / where.
- [ ] Every `→` reference points to a real file and a real symbol (spot-check a few with grep).
- [ ] No doc is over the length guidance without a reason.
- [ ] No duplicated content between parent and child.
