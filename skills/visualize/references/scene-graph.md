# Scene graph: field by field

Prose companion to `assets/scene-graph.schema.json`, which `assets/validate.mjs` enforces at runtime. Read this to understand *why* the schema is shaped this way; read the JSON Schema file for the exact machine-checked shape.

## Top level

| Field | Meaning |
|---|---|
| `version` | Must equal `SCENE_GRAPH_VERSION` (currently `1`), exported from `assets/validate.mjs`. A document from a future or past version fails validation rather than being silently reinterpreted. |
| `repo` | `{ name, commit }`. Both non-empty strings. Anchors the map to the exact state of the repository it was traced from — a scene graph is a snapshot, not a living view. |
| `diagramType` | Must be `"system-architecture"`, the only diagram type shipped. Present as a field now so a future diagram type is an enum addition, not a schema rewrite. |
| `altitude` | `{ mode, budget?, grouping? }`. `mode` is `"budget"` or `"subsystem"`. `budget` is a positive integer node target used only in budget mode. `grouping` is a free-text label for what the fold grouped by (directory, package, service). |
| `nodes` | Non-empty array. See below. |
| `edges` | Array, may be empty. See below. |
| `folded` | Array, always present (use `[]` when nothing was folded). See Folded and gaps. |
| `gaps` | Array, always present (use `[]` when nothing is unresolved). See Folded and gaps. |

## `nodes[]`

Each node needs `id` (unique, non-empty string), `label` (display text), `kind` (a free-text category such as `module`, `service`, `package`), and `citations` — a non-empty array of `{ file, line }` pairs. An optional `children` field holds a nested scene graph for drill down (see Depth cap, below).

**Why `citations` is required and non-empty:** this is the single mechanism behind the citation invariant in `SKILL.md`. `validateSceneGraph` rejects a node with `citations: []` outright — there is no "trust me" node. Every building on the map exists because a specific line of a specific file was read in the run that produced this document.

## `edges[]`

Each edge needs `source` and `target` (both must name a real `id` in `nodes[]` — `validateSceneGraph` rejects an edge pointing at an unknown node), `path` (`"control"` or `"data"`, which the renderers use to choose a solid or dashed line), and `citations`, held to the same non-empty rule as a node's. `samples[]` is optional: each sample is `{ text, citation }`, a real snippet with its own `file:line`, independent of the edge's own citations. Samples are what the renderer's moving dots carry and what a reader inspects on click — they are evidence, not decoration, so they carry their own citation rather than borrowing the edge's.

## Folded and gaps

Both are arrays that exist to make hiding something an honest, visible act instead of a silent one.

`folded[]` records every group the altitude budget collapsed — what got merged into one building, and the files behind it. A budget-mode map with a non-empty `folded[]` is not incomplete; it is a map that told you what it summarized. An empty `folded[]` in budget mode means nothing needed to collapse to fit the budget, which is itself informative.

`gaps[]` records every relationship the analysis suspected but could not cite to a `file:line` in this run. A suspected edge never becomes a real edge just because it seems likely — it goes here instead, described well enough to be useful (see `references/analysis.md` step 6). `gaps[]` is rendered in the explainer panel alongside `folded[]`, so a reader sees the shape of what the map does not know, not just what it drew.

## Depth cap of 3

`children` on a node is itself a full nested scene graph (same schema, recursively validated), so drill down does not require a new document format. `validateSceneGraph` enforces `MAX_DEPTH = 3`: nesting `children` deeper than that fails validation. Depth is bounded because drill-down maps are generated eagerly, in the same analysis pass, rather than lazily when a building is clicked — an unbounded depth would make eager generation unbounded too. Three levels is enough to go from a repo-wide map down through a subsystem to its internals without turning one invocation into an open-ended crawl.
