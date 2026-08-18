---
name: cmk:visualize
description: This skill should be used when the user asks to "visualize this repo", "map this codebase", "draw the architecture", "show me how this fits together", or wants a diagram of a system traced from its real code. Produces a validated scene graph and renders it as an interactive isometric map or a static SVG, citing the file behind every node and edge.
version: 0.1.0
---

# Visualize: Repo Map

Trace a codebase into one validated scene graph and render it as a map a person and an agent can discuss, where every building and every connection carries the file that proves it. This is the operational form of `docs/design/visualize-repo-map.md`; read that for the full contract behind what follows.

## The hard rule

```
EMIT DATA, NEVER PIXELS. VALIDATE BEFORE YOU RENDER. NEVER RENDER INVALID.
```

Analysis produces exactly one JSON scene graph. Renderers are fixed code, not a per-invocation drawing decision made by a language model. Before calling either renderer, pass the document to `validateSceneGraph` from `skills/visualize/assets/validate.mjs`. If `valid` is `false`, stop there: do not call `renderSvg` or `renderHtml`. Report the returned `errors` array to the user instead of a picture. There is no partial render and no "close enough" document — an invalid scene graph blocks rendering outright.

## The citation invariant

A node or an edge without a `file:line` gathered **in this run** does not appear in the document at all, not even as a low-confidence guess. This is not a judgment call you relax under time pressure: `validateSceneGraph` rejects any node or edge whose `citations` array is empty, and an invalid document cannot render (see above). If you suspect a relationship but cannot point at the line that proves it, it belongs in `gaps[]`, never in `edges[]`. Full field meaning, and why this rule is schema-enforced rather than a convention, is in `references/scene-graph.md`.

## Redaction

Before any payload sample enters the scene graph:

1. Never sample from a file matching the repository's ignore patterns (`.gitignore` and equivalents) or its secret patterns (`.env*`, key material, credential files, anything a secret scanner would flag). Skip the file entirely rather than sample from it.
2. Redact by pattern — API keys, tokens, connection strings, private key blocks — before the remaining text becomes a `samples[]` entry.

Redaction happens before the document exists, not before it renders: the scene graph itself is the publishable artifact, so a secret that reaches it has already leaked.

## Form: four independent axes

Resolve each from the user's own words; fall back to the default marked `*`. Independence is the point — choosing `three-d` never touches altitude, and choosing `subsystem` never touches style.

| Axis | Values |
|---|---|
| Diagram type | `system-architecture`\* (only type shipped) |
| Style | `isometric`\*, `flat`, `three-d` |
| Altitude | `budget`\* (12 to 20 nodes, folds to fit), `subsystem` (named slice, no folding) |
| Output form | interactive artifact\*, static SVG |

## Procedure

1. Resolve the four axes above from what was asked.
2. Trace the repository and build the scene graph. Full procedure, including the `docs/ai/` routing hint and payload sampling, is in `references/analysis.md`.
3. Validate with `assets/validate.mjs`. Invalid stops here — see The hard rule.
4. Render: `assets/render-html.mjs` (`renderHtml(doc, { style })`) for the interactive form, `assets/render-svg.mjs` (`renderSvg(doc)`) for static SVG. Publish the interactive form as an artifact when the host supports one; write the SVG into the repo when the invocation warrants durability, or when no artifact host is available.
5. Surface `folded` and `gaps` alongside the render, not buried in it. Say what was hidden — a fold or an unresolved relationship passing silently is the failure this skill exists to prevent.

## Drill down

`nodes[].children` is an optional nested scene graph, generated eagerly in the same pass rather than lazily on a later click, up to the depth cap of 3 enforced by `validateSceneGraph`. See `references/scene-graph.md` for the field.

## Routing hint, not a source of truth

If `docs/ai/` exists (built by `cmk:codebase-docs`), read it first as a map of where to look. Treat it strictly as a hint: a stale `docs/ai/` costs time, never correctness, because no citation is ever copied from it. Every citation in the scene graph must come from a `file:line` actually read in this run, whether or not `docs/ai/` pointed there first.

## Before publishing

An interactive artifact is typically link-shareable, and a repo map exposes internal structure and real code snippets. Confirm with the user before publishing a map of a private repository — rendering intent is not the same as sharing intent.

## References

- `references/analysis.md` — the tracing procedure: the `docs/ai/` routing hint, enumerating entrypoints and manifests, tracing imports and call sites with citations, the altitude fold, payload sampling with redaction, and what goes in `gaps[]`.
- `references/scene-graph.md` — field-by-field companion to `assets/scene-graph.schema.json`: what each field means, why citations are required, what `folded` and `gaps` are for, and the depth cap of 3.
