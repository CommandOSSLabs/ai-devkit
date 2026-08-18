# Visualize: Repo Map

**Status:** draft
**Owner:** ai-devkit maintainers
**Last updated:** 2026-08-18
**Scope:** Feature-level. Deepens `docs/design/visualize.md` for one material
type: a map of a repository's own architecture, traced from its real code.
Resolves several Open Points that the parent doc left unresolved.

The parent doc specifies a Source Resolver, Form Selector, Renderer pipeline
over three source kinds: a doc path, a tracker query, an inline description.
This document adds a fourth source kind, the repository's own code, and
specifies the contract that makes the pipeline's promises enforceable rather
than aspirational.

## Mission

Produce a map of a codebase that a person and an agent can reason against
together, where every building and every connection carries the file that
proves it. The map exists to be discussed, not admired. A confident diagram
that quietly invents a relationship is worse than no diagram, because every
later conversation inherits the false premise.

## Principles

1. **Cited or absent.** A node or an edge without a `file:line` gathered in
   this run does not appear. This is enforced by schema validation, not by
   asking the model nicely.
2. **The model emits data, never pixels.** The analysis pass produces one
   validated JSON document. Renderers are fixed code. Nothing about how the
   map looks is decided per invocation by a language model.
3. **Legibility caps the map, not compute.** An isometric grid stops being
   readable near twenty buildings. Altitude is chosen to land inside that
   budget on any repo size.
4. **Say what was hidden.** Folding and unresolved relationships are first
   class fields in the document and are rendered in the explainer panel.
   Silent truncation is the failure this design most wants to prevent.
5. **Style is an axis, not the output.** Isometric 2.5D is one of several
   renderings of one dataset. A process flow forced into 3D buildings is
   worse than a clean flat diagram.

## Architecture

```
                                    ┌─── the contract ───┐
                                    │                    │
 ┌───────────────┐   ┌───────────┐  │  ┌──────────────┐  │  ┌────────────┐
 │Source Resolver│──▶│Form       │──┼─▶│ Scene Graph  │──┼─▶│ Renderers  │
 └───────────────┘   │Selector   │  │  │ (validated)  │  │  └────────────┘
   doc path          └───────────┘  │  └──────────────┘  │    iso 2.5D
   tracker query       type         │   nodes+citations  │    flat 2D
   inline text         style        │   edges+paths      │    full 3D
   ▸ repo code ◂       altitude     │   payload samples  │    static SVG
     (new)             form         │   folded[] gaps[]  │
                                    └────────────────────┘
```

The Scene Graph is the waist of the design. Every capability agreed for this
feature is a consequence of it: three visual styles are three consumers of one
dataset; the static SVG is a fourth consumer rather than a second pipeline;
drill down is a nested document rather than a new mechanism; and the website
playground's assets are reproducible because they are renderer output, not
screenshots.

## Components

### Repo Analyzer

**Location:** `skills/visualize/references/analysis.md`
**Owns:** what is true about this repository.
**Does not own:** layout, grouping aesthetics, style.

Reads `docs/ai/` when present, purely as a routing hint for where to look.
Otherwise enumerates entrypoints, manifests, and configuration itself. Either
path converges on the same next step: trace imports and call sites, recording a
`file:line` for every node and every edge discovered in this run. A stale
`docs/ai/` costs speed, never truth, because no citation is ever inherited from
it.

### Scene Graph schema

**Location:** `skills/visualize/references/scene-graph.md` and
`skills/visualize/assets/scene-graph.schema.json`
**Owns:** what a valid map is.
**Depends on:** nothing.

A machine checkable JSON Schema, not prose, so that validation is a gate rather
than a convention. Required structure:

1. `nodes[]`, each with an id, a label, a kind, and a non empty `citations[]`
   of `file:line` entries.
2. `edges[]`, each with a source, a target, a path kind of `control` or `data`,
   a non empty `citations[]`, and zero or more `samples[]`.
3. `samples[]`, each a real snippet with its own citation. These are what the
   moving dots carry and what a reader inspects on click.
4. `folded[]`, every group the altitude budget collapsed, each naming the files
   behind it.
5. `gaps[]`, every relationship the analyzer suspected but could not cite.
6. `children`, an optional nested scene graph per node, for drill down.

Schema validation rejects a document where any node or edge has an empty
`citations[]`. That single rule is what converts principle 1 from an intention
into a mechanism.

### Renderer bundle

**Location:** `skills/visualize/assets/renderer/`
**Owns:** how a map looks.
**Depends on:** the schema only.

Four consumers of one input: isometric 2.5D, flat 2D, full 3D, and static SVG.

Deterministic: the same scene graph must produce byte identical output. No
timestamps, no random seeds, no unordered iteration over maps or sets. Golden
tests and the reproducibility of the playground's twelve assets both rest on
this, so it is a renderer requirement rather than a nicety. Animation is driven
from values in the document, not from generation time entropy.

Vanilla and self contained: no CDN, no build step, and no dependency on the
website's `three` or `@react-three/fiber`. This is required, not preferred.
`cmk:agent-vendors` specifies a cross package path rule in
`references/vendored-layout.md`: no file inside a skill package may reference
anything outside it by relative traversal, because vendored packages travel
independently into consuming repos under `.agents/skills/cmk-visualize/`. A
renderer that reached for the website's dependencies would work here and dangle
everywhere else.

### Skill surface

**Location:** `skills/visualize/SKILL.md`, `TESTS.md`, `eval.json`

Trigger phrases, the Form Selector's four axes, the per invocation durable
versus ephemeral decision, and the rule that an invalid scene graph blocks
rendering outright.

### Playground surface

**Location:** `app/visualize/page.tsx`, `components/marketing/visualize/`,
`public/visualize/`

Not part of the vendored skill. Depends on the skill only through generated
output, never through imports. Specified in its own section below.

## Mechanisms

### Form selection

Four independent axes, resolved from explicit user language, falling back to
defaults:

1. **Diagram type.** System Architecture only in v1. Process Flow and
   AI / Data Flow are designed for and deferred.
2. **Visual style.** Isometric 2.5D by default, flat 2D, or full 3D.
3. **Altitude.** Budgeted by default, or a named subsystem.
4. **Output form.** Interactive artifact by default, or static SVG.

Independence is the point. Adding a diagram type later must not touch style,
altitude, or form.

### Altitude

Default is a node budget of twelve to twenty buildings. The analyzer picks the
grouping level that lands inside it: per file on a small repo, per package or
per service on a monorepo. Every collapse is recorded in `folded[]` with the
files behind it, so folding summarizes without destroying evidence.

A named subsystem is an explicit override for when the caller already knows
which slice they want, and traces that slice without folding.

### Drill down

Sub maps are generated eagerly, in the same pass, to a fixed depth cap. An
artifact that needs a second invocation to open a building is not self
contained. The depth cap is what keeps eager generation bounded on a large
repository.

### One invocation, end to end

1. Form Selector resolves the four axes.
2. Analyzer routes on the presence of `docs/ai/`.
3. Analyzer traces imports and call sites, collecting citations.
4. Altitude fold applies, recording `folded[]`.
5. Payload sampling attaches real snippets to edges.
6. Scene graph is validated. Invalid means no render and a report naming the
   offending element.
7. Style and form select one renderer.
8. Interactive output publishes as an artifact; static SVG writes into the repo
   when the invocation warrants durability.

## Failure paths

1. **Invalid scene graph.** Render blocked, offending node or edge named. Never
   a partial picture.
2. **Uncitable relationship.** Not drawn. Recorded in `gaps[]` and printed in
   the explainer panel.
3. **Budget exhausted.** Fold harder and record it. Never truncate silently.
4. **Host has no artifact capability.** The static SVG path still works, since
   it needs no runtime. Consistent with the parent doc's failure path.
5. **Stale `docs/ai/`.** Degrades speed, not correctness.
6. **Dynamic dispatch or an unparseable language.** Recorded in `gaps[]`, never
   guessed.
7. **Secret captured in a payload sample.** Redact by pattern at sample time,
   and never sample from files matching the repository's ignore and secret
   patterns.

## Cross-cutting concerns

### Security

Payload sampling reads real snippets out of real files, which is a new exposure
this feature introduces and the parent doc does not cover. Two rules bound it:
files matching ignore and secret patterns are never sampled, and sampled text is
redacted by pattern before it enters the scene graph. The scene graph is the
publishable artifact, so redaction happens before the document exists, not
before it renders.

An artifact publish is typically link shareable. A repo map exposes internal
structure and code snippets, so the skill confirms before publishing a map of a
private repository rather than treating render intent as share intent.

## Website playground

A dedicated surface for `cmk:visualize`, replacing the plainer showcase the
parent doc implies.

**Prompt composer.** Three knobs, with the prompt text updating live and changed
lines highlighted, so the effect of a choice is visible as a diff. A copy button
is the primary action.

**Knobs in v1.** Diagram type cannot be a knob while only one type exists, so
v1 exposes style times altitude times output form, three by two by two. Diagram
type becomes a fourth knob when the catalog grows, and the composer is built so
adding a knob does not mean rebuilding it.

**Preview matrix.** Twelve pre-rendered assets, one per knob combination, so
flipping a knob swaps to the real corresponding output rather than an
illustration. The assets are produced by running the real renderer over the
`ai-devkit` scene graph, which means they cannot drift from what the skill
emits, and regenerating them is a dogfooding pass rather than a maintenance
chore.

## Testing

1. **Schema gate tests.** Fixture scene graphs, valid and invalid, asserting
   that invalid documents block rendering rather than warn.
2. **Renderer golden tests.** Identical scene graph in, byte identical output,
   which is what makes the twelve playground assets reviewable as diffs.
3. **Analyzer honesty test.** Run against a fixture repository with a known
   structure and assert that every emitted citation resolves to a real
   `file:line` and that the claimed relationship is actually present there.
   This is the test that catches invention and is the most important one here.
4. **Kit conventions.** `TESTS.md` and `eval.json`, following
   `skills/interpret/`.
5. **Dogfood.** Run against `ai-devkit` itself. That run produces the
   playground's twelve assets, so the demo and the test fixture are the same
   artifact.

## Delivery sequence

This design covers two deliverables that want separate implementation plans,
because the second consumes the first's output:

1. **The skill.** Schema first, then analyzer, then renderers, then the skill
   surface. The schema is built first because every other piece is defined
   against it, and getting it wrong invalidates work downstream.
2. **The playground.** Cannot start until the skill can emit a real scene graph
   for `ai-devkit`, since its twelve assets are renderer output. Attempting it
   earlier would mean mocking the very thing the page exists to demonstrate.

## Constraints

1. First code carrying skill in this kit. Every existing skill is markdown only:
   `SKILL.md`, `eval.json`, `references/`, with one `agents/` directory. Shipping
   `assets/` is a new convention, accepted deliberately. It is compatible with
   `cmk:sync`, whose `content_hash` covers a package's files in sorted path
   order, so no change to sync is required.
2. The renderer must run with no network and no build step, per the cross
   package path rule above.
3. Interactive output depends on the host exposing an artifact style publish
   capability. Behavior without one is specified in Failure paths.

## Later checklist

Recorded so the ambition is not lost, and explicitly not designed here:

1. **Process Flow** and **AI / Data Flow** diagram types, which reuse the same
   analysis pass and slot in as diagram type values.
2. **The broader diagram generator surface**: Smart Factory and IoT scene
   diagrams, teaching and course content diagrams, 3D product structure
   diagrams, planning and travel route maps. These cannot reuse the repo
   analysis pass, since there is no codebase behind a travel route, and the
   citation invariant does not apply to them. Adopting them would make this two
   skills wearing one name, so any future move here should start by asking
   whether it is a separate skill.
3. **Diagram type as a fourth playground knob**, once more than one type exists.

## Open Points

1. **Trigger phrases.** Still inherited from the parent doc's Open Points and
   still unresolved. Needs a pass against this repo's frontmatter convention.
2. **Depth cap for eager drill down.** The mechanism is decided, the specific
   cap is not, and it should be set from a real monorepo measurement rather
   than guessed.
3. **Node budget boundaries.** Twelve to twenty is an eyeball figure. Worth one
   calibration pass against three real repositories of different sizes.
4. **Requirements doc.** Still none, so `cmk:design`'s upstream conflict check
   is still skipped, exactly as the parent doc records.

## Links

1. **Parent design:** `docs/design/visualize.md`
2. **Vendoring rules:** `cmk:agent-vendors`, `references/vendored-layout.md`
3. **Sync and hashing:** `cmk:sync`, `references/skills-lock.md`
4. **Related skills:** `cmk:codebase-docs` (routing hint source),
   `cmk:design` (parent doc owner), `cmk:glossary` (term promotion)
