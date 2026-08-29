# Design: Skills Explorer

**Status:** active
**Owner:** @CommandOSSLabs
**Last updated:** 2026-08-29
**Scope:** Feature-level — the `/skills` catalog and the relationship visualization

## Mission

Turn `/skills` into a surface a developer can scan, and turn the reference graph
into something they can explore. The catalog answers "which skill", the map
answers "what does it sit between", and both hand off to the detail and
workspace surfaces that already exist.

## Design Principles

- **The repository is the only source of truth** — every skill, reference and
  category shown here is parsed from `skills/` at build time. Nothing is
  hand-maintained alongside it, so nothing can drift.
- **Deterministic placement beats organic placement** — a map you can refer back
  to next week is worth more than one that looks alive. A force simulation
  settles differently on every load; fixed lanes do not.
- **The list is a peer of the canvas, not a fallback** — it is the same data at
  the same fidelity, it is the default where a canvas would be unusable, and it
  is what keyboard and screen-reader users get without asking.
- **Interaction state belongs to the app, view state belongs to the library** —
  React Flow owns pan, zoom and drag; selection, pinning, URL sync and
  persistence stay ours, so swapping the renderer stays cheap.

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Runtime | Next.js 15, React 19 | App Router, `force-static` pages |
| Language | TypeScript | strict |
| Graph rendering | `@xyflow/react` 12 | DOM-based 2D canvas; pan, zoom, drag, minimap, controls |
| Data | Build-time filesystem read of `skills/` | no runtime API, no database |
| Styling | Tailwind 3 + CSS custom properties | `--skill-*` tokens carry graph meaning per theme |

## Architecture

```mermaid
graph TD
  A[skills/ directory] --> B[lib/skill-graph.ts]
  B --> C[lib/skill-graph-layout.ts]
  C --> D[SkillGraphView]
  D --> E[SkillGraphCanvas]
  D --> F[SkillGraphList]
  D --> G[SkillGraphInspector]
  E --> H[@xyflow/react]
  I[sessionStorage] --> E
  E --> I
```

### `lib/skill-graph.ts`

Parses every `SKILL.md` under `skills/` at build time and emits nodes, edges and
dangling references. A node now also carries `category` and `categoryLabel`,
taken from the same map the catalog uses, so the two surfaces cannot disagree
about which group a skill is in. Edge semantics are unchanged: a directed
`source → target` pair per `cmk:` handle found in a skill's files.

### `lib/skill-graph-layout.ts`

Owns placement and persistence, with no React and no renderer knowledge.

- `layoutSkillGraph(nodes)` assigns each node a position from a fixed category
  lane, alphabetically within the lane. Same input, same output, every time.
- `LAYOUT_VERSION` is bumped whenever lane geometry changes.
- `readStoredLayout()` / `writeStoredLayout()` persist dragged positions in
  `sessionStorage` under a versioned key, and reject a payload whose version or
  shape does not match.

### `SkillGraphView`

The application shell. Owns the view mode, the selected skill, URL
synchronization and the inspector. It renders either the canvas or the list, and
it renders the inspector itself so inspector content never depends on the
canvas mounting or on an exit animation finishing.

### `SkillGraphCanvas`

The React Flow boundary, loaded only when the canvas view is active. It converts
laid-out nodes and edges into React Flow's shapes, renders a custom node, and
reports drags back up. It owns nothing the app needs to know about except the
positions it emits.

Node dimensions are declared, not measured. React Flow keeps a node
`visibility: hidden` until it has measured it, and measurement rides on
ResizeObserver delivery; under a throttled rendering loop that delivery never
arrives, the whole map stays invisible, and `visibility: hidden` also makes
every node unfocusable. The layout already knows every size, so the node
objects carry `width` and `height` and the renderer never has to ask.

### `SkillGraphList`

A table of every skill with its outgoing and incoming references as links. Rows
are buttons, so selection works by keyboard, and it carries the same relationship
information the canvas draws.

## External Dependencies

- `@xyflow/react` — pan, zoom, node dragging, viewport controls and minimap.
  Failure behavior: the module is imported dynamically for the canvas view only.
  If it fails to load, the view falls back to the list, which needs no library.

## Acceptance Criteria

| Requirement | Satisfied by |
|---|---|
| SKEX-1.1, SKEX-1.2 | `SkillCard` in `components/skills/skill-catalog.tsx` |
| SKEX-1.3 | Category grouping in `SkillCatalog` |
| SKEX-1.4 | Existing 1440px inspector split in `SkillCatalog` |
| SKEX-1.5, SKEX-1.6 | Card stretched link plus separate workspace control |
| SKEX-2.1, SKEX-2.2, SKEX-2.3 | `SkillGraphCanvas` node and edge styling |
| SKEX-2.4 | `SkillGraphInspector`, rendered by `SkillGraphView` |
| SKEX-2.5 | No edge-mutation handlers are wired |
| SKEX-3.1, SKEX-3.2 | `layoutSkillGraph` |
| SKEX-3.3 | React Flow viewport and node drag |
| SKEX-3.4, SKEX-3.6 | `readStoredLayout` / `writeStoredLayout` |
| SKEX-3.5 | Reset layout control |
| SKEX-4.1, SKEX-4.4 | `SkillGraphList` |
| SKEX-4.2, SKEX-4.3 | View resolution in `SkillGraphView` |
| SKEX-4.5 | `useReducedMotion` guards on edges and transitions |
| SKEX-5.1 to SKEX-5.4 | Untouched detail, workspace and `normalizeSkillId` paths |
| SKEX-6.1 to SKEX-6.3 | Responsive audit and `--skill-*` / `--accent` tokens |

## Cross-Cutting Concerns

### Security

#### Assumptions

- Skill content is repository content, authored in the same review process as
  code — it is not user input, so it is rendered rather than sanitized as
  untrusted.

#### Known Gaps and Risks

| Gap | Severity | Impact | Root Cause | Mitigation / Acceptance |
|---|---|---|---|---|
| `sessionStorage` holds unvalidated coordinates | low | A crafted payload could place nodes off-screen | Positions are read back from the browser | Shape and version are validated on read; anything else is discarded and the canonical layout is used |

#### Controls

- Versioned storage key — a layout change cannot be poisoned by stale data.
- Read-only edges — no code path mutates the reference graph from the UI.

### Performance and Scalability

- The graph renderer is dynamically imported and reachable only from
  `/skills/visualize-interactions`. The catalog and workspace bundles do not
  include it.
- The markdown editor stays dynamically imported behind Edit, as before.
- The animated WebGL backdrop does not mount on the workspace, and the canvas
  route does not add a second one.
- At 34 nodes and 108 edges the graph is small enough that no virtualization or
  level-of-detail work is warranted; that changes if the kit passes a few
  hundred skills.

### Error Handling and Resilience

- Empty graph: the view renders an explanatory empty state rather than a blank
  canvas.
- Malformed or version-mismatched stored layout: discarded, canonical layout used.
- Unknown `?skill=` value: no selection, rather than an invented one.
- Unknown `?view=` value: the viewport default.

### Accessibility

- The list view is the complete non-canvas equivalent, and the default under
  768px.
- Below `lg` the inspector is a sheet over the map, with `role="dialog"`,
  `aria-modal`, a label, focus moved in on open, Tab trapped inside and Escape
  to close — the same contract as the workspace's file drawer.
- Canvas nodes are focusable, expose an accessible name including category and
  both degree counts, and toggle selection on Enter or Space. React Flow's own
  node focus is disabled so there is exactly one focus stop per node and the
  accessible name is the card's.
- Hover traces a skill without moving the pin: the trace follows the pointer
  while the pinned marker — fill, ring and a halo the hover state does not
  have — stays where it was.
- Selection is conveyed by fill, ring and halo together, never colour alone.
- `--skill-node`, `--skill-node-active`, `--skill-edge`, `--skill-edge-out` and
  `--skill-edge-in` resolve per theme so markers clear about 3:1 in both.
- Idle edges are deliberately quieter than 3:1: they are texture, and every
  relationship they hint at is available at full contrast in the traced state,
  the inspector and the list.
- `prefers-reduced-motion` removes edge animation and view transitions.

## Constraints

- Pages under `/skills` are `force-static`; anything read from the URL is read
  after mount, so no surface may depend on server-side search params.
- Tailwind 3 cannot apply an opacity modifier to an arbitrary custom property,
  and cannot disambiguate a bare `var()` in a `text-` utility — accent ink is
  written as `text-[color:var(--accent)]`.

## Architecture Rationale

Four options were considered for the visualization.

**Fixed SVG ring (the previous implementation).** Cheap and deterministic, but
every skill gets identical visual weight, the layout carries no grouping
information, and nothing can be rearranged. It answered "are these connected"
and nothing else.

**Force simulation.** Produces attractive clusters, but placement differs on
every load, so the map cannot be referred back to, and the simulation costs
frames on every visit for a graph whose structure never changes between builds.

**Three-dimensional force graph.** Rejected. It adds a WebGL context and a
physics loop to a page whose job is reading; occlusion makes labels unreliable;
touch interaction is significantly worse; and there is no honest accessible
equivalent of a 3D scene, so the list would become the real interface for a
large share of readers while the 3D view took the budget.

**Two-dimensional canvas with deterministic layout (chosen).** Keeps the
determinism of the ring, adds the exploration the ring lacked, groups by
category so position itself carries meaning, and degrades to a list that is a
genuine peer rather than an apology. React Flow supplies the interaction layer
so the code we own stays limited to layout, selection and persistence, which is
also what makes the choice reversible.

## Related Documents

- [Codebase Docs](../ai/) — AI-navigable map of the repo
- [Rules](../rules/README.md) — engineering standards

## Links

- Requirements: [docs/requirements/skills-explorer.md](../requirements/skills-explorer.md)
- Decisions: no ADR — feature-local and reversible
