# Doc shape

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

**Progressive disclosure.** A doc should be readable in ten seconds and tell the reader where to go for more. If you catch yourself explaining a sub-concept in depth, apply the split heuristic: when both Bounded and Substantial hold, give it its own doc and link to it.

**Don't duplicate the code.** No copy-pasted function bodies, no snippets longer than a couple of lines. If a reader needs the actual logic, they open the file. The doc's value is knowing *which* file.

**Don't document the obvious.** Skip things whose purpose is clear from the name or from reading the first ten lines of the file. `src/main.rs: entry point` is noise. A non-obvious invariant ("this must run before `init_db` or migrations panic") is signal.

**Coherence over splitting.** If a topic is naturally one story, keep it in one doc even if it runs a bit long. Only split when there's a genuinely bounded sub-concept *and* the parent is getting unwieldy — see the split heuristic below.

**Match the code's vocabulary.** Use the same names the code uses (the folder-naming rule under "Output location and shape") — the doc's job is to be findable from the code's own terms, never through a more "descriptive" alias.

## Split heuristic

Split a topic into its own sub-doc when **both** are true:

1. **Bounded** — the sub-topic has a clear boundary a reader could land on directly without needing the parent's context.
2. **Substantial** — it would take more than a few bullets or a short paragraph to cover, *or* the parent doc is pushing past ~100–150 lines and getting hard to skim.

If only (1) holds and the sub-topic is a two-line bullet, leave it inline. If only (2) holds (the parent is long but the content is one continuous narrative), don't chop it artificially — rewrite for brevity first.

**Length contracts:** branch docs stay ~30–80 lines; leaf docs stay ~20–120 lines. A leaf past 200 lines is not one topic — split per the heuristic or trim.

## What NOT to document

- Entry points whose role is obvious from the filename (`main.*`, `index.*`, `app.*`, `cmd/*/main.go`, etc.).
- Boilerplate: standard package manifests (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `pom.xml`, `Gemfile`, etc.) and typical framework scaffolding.
- Anything already well-covered by a top-level `README.md` — link to it instead of restating.
- Generated code, vendored dependencies, lockfiles, migration files.
- Features that don't exist yet. Don't speculate.
