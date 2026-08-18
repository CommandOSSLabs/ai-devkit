# Visualize

**Status:** draft
**Owner:** ai-devkit maintainers
**Last updated:** 2026-08-13
**Scope:** Feature-level — a new `cmk:visualize` skill that renders existing
content (a doc, a tracker query, a description) into a reviewable visual;
it does not design systems or write specs — that is `cmk:design`'s job.

This document specifies `cmk:visualize`: a skill that turns content someone
already has — an architecture doc, a protocol flow, a week's resolved
tickets, a raw description given in the prompt — into a rendered visual
someone can actually look at, instead of a wall of markdown or a
general-purpose video tool. It does not invent content; it renders what
exists or what the user just described.

## Mission

Give every material type a reviewable rendered form, without forcing a
single output shape onto content that doesn't fit it. A rendered
architecture diagram, an animated protocol-flow teaser, and a slide deck
summarizing a week's shipped tickets are three different rendering
problems sharing one skill because they share the same three-stage shape
(resolve source → pick form → render), not because they share an output
format.

Serves anyone who already has content and wants it *seen*, not anyone who
needs help deciding what to build — that request routes to `cmk:design`,
`cmk:requirements`, or `cmk:adr` instead.

## Principles

- **Render, never invent.** The skill draws from a real source — an
  existing doc, a live tracker query, or content the user just described in
  the prompt. It never fabricates architecture, protocol steps, or progress
  that isn't in the source. If the source is thin, the render is thin; the
  skill does not pad it.
- **Durable vs. ephemeral is a per-invocation decision, not a
  per-material-type rule.** An architecture diagram usually belongs beside
  its spec in `docs/design/`; a marketing teaser for a protocol flow
  usually does not belong in the docs tree at all. The skill decides case
  by case (see Mechanisms § Render), not by a fixed table mapping "type A
  always writes a file."
- **Compose, don't duplicate.** Tracker access, doc reading, and content
  synthesis are already other skills' jobs (`cmk:delivery-workflow` for
  tracker state, `cmk:design`/`cmk:requirements`/`cmk:adr` for the docs
  themselves). This skill's own logic is limited to source resolution,
  form selection, and rendering — it calls into existing mechanisms for
  everything upstream of that rather than re-implementing tracker queries
  or doc parsing.
- **One skill, three stages — not four skills, one per material type.**
  Architecture, protocol, progress-report, and slide/demo output all pass
  through the same Source → Form → Render pipeline. Splitting by material
  type was considered and rejected (see Open Points) because the two
  motivating examples — a tracker-sourced slide and an animated marketing
  teaser — both cross whatever boundary a type-based split would draw.

## Architecture

```
        ┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
 input ─▶  Source Resolver   ─▶     Form Selector       ─▶     Renderer          ─▶ reviewable output
        └───────────────────┘     └───────────────────┘     └───────────────────┘
         doc | tracker query        static | animated          Artifact publish
         | inline description       diagram | slide deck       (+ durable doc
                                     | dashboard                 write, if warranted)
```

- **Source Resolver** — identifies what's being visualized and fetches it.
  Three source kinds: an existing doc path (`docs/design/*.md`,
  `docs/decisions/*.md`, `docs/reports/*.md`), a live tracker query (delegated
  to `cmk:delivery-workflow`'s tracker access — this skill does not talk to
  the tracker directly), or content given inline in the prompt with no
  backing doc. Owns: resolving "what does the user mean by *this*" to
  concrete content. Does not own: writing or editing the source content —
  read-only with respect to docs and tracker state.
- **Form Selector** — maps the request's intent to an output shape: static
  diagram, animated diagram, slide deck, or dashboard-style summary. Reads
  intent from explicit user language ("beautiful slide," "animation,"
  "teaser") over material type — a protocol flow can render as a static
  diagram *or* an animated teaser depending on what was asked. Owns:
  picking the shape and the durable-vs-ephemeral call. Does not own:
  the actual rendering.
- **Renderer** — produces the reviewable output. Publishes via the host
  agent's Artifact-equivalent capability (see Constraints) for the
  reviewable link; conditionally also writes a durable version into the
  docs tree per the Form Selector's call. Owns: visual quality and
  house style. Does not own: content accuracy — that's inherited from
  whatever the Source Resolver handed it.

## Mechanisms

### Source resolution

- **Doc source**: user names or implies an existing file. Resolver reads it
  in full; if the path doesn't exist, the skill says so and asks rather
  than guessing a path or inventing content to fill the gap.
- **Tracker source**: user describes a query in tracker terms ("tickets
  resolved this week"). Resolver delegates the actual query to
  `cmk:delivery-workflow`'s tracker access rather than re-implementing
  tracker API calls; this skill only shapes the *rendering* of whatever
  that returns.
- **Inline source**: user describes the content directly in the prompt
  (e.g., dictates a protocol flow with no backing doc). Resolver treats the
  prompt text itself as the source of truth for this render — it does not
  retroactively require a doc to exist first.
- **Ambiguous source**: if more than one of the above plausibly applies (a
  doc *and* a live tracker both seem relevant), the skill asks rather than
  picking one silently.

### Form selection

- Explicit output-shape language in the request ("slide," "animation,"
  "teaser," "diagram") wins over any default tied to material type.
- Absent explicit language, default by source kind: a design/decision doc
  defaults to a static diagram (cheapest, matches the doc's own
  implementation-agnostic register); a tracker query defaults to a
  dashboard/slide-style summary; an inline description defaults to
  whatever shape best fits what was described, decided at render time.
- The durable-vs-ephemeral call: a render is written into `docs/` only when
  it visualizes content that already lives there (i.e., it's a companion
  render of an existing design/decision/report doc) *and* the user hasn't
  signaled a one-off/marketing intent ("teaser," "for my product"). A
  tracker-sourced slide or an explicitly-marketing render is Artifact-only
  by default — nothing is committed unless the user asks for it to be.

### Render

- The reviewable output is always published through the host agent's
  Artifact-equivalent capability (this environment's `Artifact` tool is the
  reference implementation) — a rendered, link-shareable page, not a
  markdown dump back into chat.
- Visual quality follows whatever design-quality-bar mechanism the host
  environment provides for that capability (this environment's
  `artifact-design` skill is the reference) rather than the skill hand-rolling
  its own style rules.
- When the Form Selector calls for a durable copy, the skill writes it to
  the doc-appropriate location using **Mermaid embedded in the markdown**,
  not a bespoke component — this keeps the durable artifact dependency-free
  and natively viewable on GitHub without relying on the rendering
  capability that produced the reviewable version still existing later.
  The Artifact render and the durable Mermaid version are allowed to differ
  in polish; they are not required to be pixel-identical.

### Failure paths

- Source doesn't resolve (bad path, empty tracker result, prompt too thin
  to render anything meaningful) → the skill says so and asks for more,
  rather than rendering a placeholder.
- Host environment has no Artifact-equivalent capability available → the
  skill degrades to describing the intended visual in text and, if a
  durable Mermaid version is warranted, still writes that (Mermaid needs no
  special rendering capability) — it does not silently fail or fall back to
  producing a video.

## Cross-cutting concerns

### Security

- Artifact-equivalent publishing typically produces a link-shareable page.
  A render sourced from a live tracker query (e.g., "this week's resolved
  tickets") may surface information the team didn't intend to make
  shareable — the skill confirms before publishing anything tracker-sourced
  if the tracker content looks like it could include sensitive fields
  (assignee PII beyond names, customer identifiers, anything the tracker
  itself marks confidential), rather than assuming render intent implies
  share intent.
- The skill never reads credentials, tokens, or MCP configuration to
  satisfy a visualization request — if a tracker or doc source requires
  access the current session doesn't already have, it says so rather than
  attempting to escalate its own access.

## Constraints

- Depends on the host agent exposing an Artifact-equivalent
  publish-and-share capability; behavior without one is specified in
  Mechanisms § Failure paths, not left undefined.
- Tracker access is entirely inherited from `cmk:delivery-workflow` — this
  skill has no tracker-specific code of its own and breaks cleanly (asks,
  doesn't guess) if that skill or its tracker connection is unavailable.
- Trigger phrasing follows this repo's existing convention (natural-language
  quoted phrases in the skill's own frontmatter description, callable via
  `/cmk:visualize` too) — exact phrase set is an Open Point, not decided
  here.

## Open Points

- **Exact trigger phrases** — draft candidates from this conversation:
  `"visualize this"`, `"make me a slide/diagram of..."`, `"animate this
  flow"`, `"summarize this as a slide"` — needs a real pass against this
  repo's phrase-writing convention (see other `SKILL.md` frontmatter) before
  it ships.
- **Splitting demo/slides/presentation out later** — rejected for v1 (see
  Principles), but if slide-deck rendering ends up needing meaningfully
  different tooling (e.g. reveal.js/Marp) than diagram rendering, revisit
  whether Renderer needs two real backends behind one Form Selector rather
  than one.
- **Glossary terms** — this doc coins "Source Resolver," "Form Selector,"
  and "Renderer" inline because this repo has no `docs/requirements/glossary.md`
  yet (per `cmk:glossary`'s own convention). Once one exists, promote these
  terms there rather than leaving them defined only in this doc.
- **No requirements doc exists for this feature.** This design doc has
  nothing in `docs/requirements/` to link yet — normally `cmk:design` checks
  upstream requirements for conflicts; that check is skipped here because
  there's nothing to check against. Worth a `cmk:requirements` pass before
  this moves past `draft`.
- **Confirmation UX for the tracker-security check** — "confirms before
  publishing" (Cross-cutting § Security) isn't specified as an exact
  prompt/flow yet.

## Links

- **Requirements:** none yet — see Open Points.
- **Decisions:** none yet.
- **Related skills:** `cmk:design` (spec source for architecture/decision
  renders), `cmk:delivery-workflow` (tracker source), `cmk:glossary` (term
  promotion, once established).
