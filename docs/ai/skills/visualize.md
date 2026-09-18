# cmk:visualize

## What

Traces a codebase into one validated JSON scene graph and renders it as an
interactive isometric map or a static SVG. Every node and every edge carries
the `file:line` that proves it; a relationship without one goes to `gaps[]`
rather than into the picture.

## Approach

The model emits data, never pixels. Analysis produces exactly one scene
graph document; the renderers are fixed code in `assets/`, not a drawing
decision made per invocation. `validateSceneGraph` gates rendering — an
invalid document reports its `errors` array instead of a map, with no
partial render. Four independent axes shape the output: diagram type
(`system-architecture` only so far), style (`isometric`/`flat`/`three-d`),
altitude (`budget` folds to 12–20 nodes; `subsystem` takes a named slice
unfolded), and the render target. Secrets are redacted before a sample
enters the document, because the scene graph is itself the publishable
artifact.

## Where

- Skill body: `skills/visualize/SKILL.md`
- Scene-graph contract: `skills/visualize/references/scene-graph.md`
- Analyzer procedure: `skills/visualize/references/analysis.md`
- Schema, validator, renderers: `skills/visualize/assets/`
- Pressure-test record: `skills/visualize/TESTS.md`
- Eval fixtures: `skills/visualize/eval.json`
- Design: `docs/design/visualize.md`, `docs/design/visualize-repo-map.md`
