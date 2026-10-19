---
name: cmk:visualize
description: Use before the first line of markup for any HTML a human will look at — a dogfood test guide, a report, a dashboard, a landing page, a published artifact, a standalone .html handoff. Also when a primary figure, structure sketch, architecture diagram, sequence, or flowchart must be drawn inside that page or packet. Produces a written design plan (palette, type pairing, layout concept) and a page derived from it — and when a figure is warranted, a named figure job plus inline SVG from the diagram recipe — theme-aware, self-contained, specific to its subject instead of templated. Also when a page's colors, typography, dark mode, spacing, or visual treatment need deciding, or when a page has come out looking generic.
version: 1.1.4
---

# Craft Page

Approach this as the design lead at a small studio known for versatility: every
page gets a visual identity pitched at the treatment the job actually calls for.
The question is never *whether* to design — a memo deserves the same craft as a
landing page. What changes is the treatment that craft is delivered in.

## 1. Name the treatment

Say which one this is before planning anything:

- **Utilitarian** — a test guide, plan, memo, report, internal dashboard, demo.
  Real typographic hierarchy, considered spacing, a proper palette; no gigantic
  hero, flourishes tasteful and few. Most pages this skill set produces are here.
- **Editorial** — a landing page, a game, a tool the user will keep or share.
  Section 5 runs only for these.

Unsure? A well-composed page is never the wrong answer; an over-designed visual
identity sometimes is. *Done when: the treatment is named out loud.*

## 2. Establish precedence, then write the design plan

Precedence is fixed: **the user's own words, then the project's existing system,
then your choices.** Before inventing anything, look for a design system already
in the repo — an Approved `docs/rules/common/design-tokens.md`, `CLAUDE.md`,
`docs/agents/*.md`, a tokens or theme file, existing component styles. When one exists, apply it; everything below fills its gaps and
never overrides it.

Then write the plan — three REQUIRED slots, filled in before any markup:

- **Color** — 4–6 named hex values.
- **Type** — typefaces for 2+ roles: a characterful display face used with
  restraint, a complementary body face, and a utility face for captions or data
  if the page has any.
- **Layout** — the layout concept in one or two sentences.

WHEN the page or packet carries a **primary figure** (structure sketch,
topology, sequence, flowchart — including an `cmk:explain` Map figure), add a fourth REQUIRED slot:

- **Figure job** — exactly one of `before/after structure`,
  `topology / architecture`, `sequence`, `flowchart`.

Then load `references/diagram.md` and derive the figure from that job. This
slot fires even when page restyle is skipped. There is no fifth job in v1.

*Done when: the plan is written, every color and type decision in the page
traces back to a slot in it, and any primary figure names one of the four
jobs and follows `references/diagram.md`.*

## 3. Fundamentals — every page, every treatment

**Ground it in the subject.** Pin one concrete subject, its audience, and the
page's single job. The subject's own world — its materials, instruments,
vernacular — is where distinctive choices come from. Build with real content
throughout, never lorem.

**Pair typefaces.** Typography carries the page even when the page isn't about
typography. Don't link a webfont URL: a published artifact's CSP blocks font
CDNs and a handed-over `.html` gets opened offline — both fail silently to a
fallback face. Inline the face as an `@font-face` data URI, or design
deliberately with the system stack. Keep running text near 65 characters wide,
set a type scale and stay on it, give headings `text-wrap: balance`, and give
uppercase labels a touch of letter-spacing.

**Choose neutrals, don't default to them.** A pure mid-grey reads as
unconsidered; a grey biased slightly toward the accent's hue reads as chosen.
Pure white and near-black are fine grounds when they suit the subject — the
point is that the neutral was picked, not inherited.

**Design both themes, at the token level.** Define the palette as custom
properties on `:root`; redefine *only the tokens* under
`@media (prefers-color-scheme: dark)`; style components through the tokens,
never inside the media query; then redefine the tokens again under
`:root[data-theme="dark"]` and `:root[data-theme="light"]` so an explicit
viewer toggle overrides the OS preference in both directions. Give the second
theme the same care as the first — don't naively invert; keep contrast legible
and the accent working on both grounds. A page that deliberately commits to one
visual world (a neon arcade screen, a letterpress invitation) may stay
single-theme — as a stated choice, not an omission.

**Let layout do the spacing.** Lay out sibling groups with flex or grid and
`gap`, not per-element margins that silently collapse or double. Wide content —
tables, code, diagrams — gets `overflow-x: auto` on its own container so the
body never scrolls sideways. Use `font-variant-numeric: tabular-nums` wherever
digits line up in columns.

**Watch selector specificity.** It is easy to generate classes that cancel each
other out — a `.section` rule fighting a `.cta` rule over the padding between
sections. Structure the cascade so it can't silently undo your spacing.

**Build cleanly.** Visual bugs hide in the gap between source and output: close
every non-void element, double-quote attributes, give keyboard focus a visible
state, respect `prefers-reduced-motion`. WHEN the figure job is one of the four
in `references/diagram.md`, write inline SVG from that recipe — that SVG *is*
hand-built. For generative or decorative graphics that are not those jobs,
reach for Canvas or WebGL rather than long path data. Keep the page
self-contained — inline CSS and JS, embed assets as `data:` URIs.

**Write the copy from the user's side of the screen.** Words are design
material. Name things by what people recognize, not how the system is built (a
person manages *notifications*, not *webhook config*). Active voice; a control
says exactly what happens ("Publish", then a toast that says "Published").
Errors say what went wrong and how to fix it — no apologies, no vagueness.
Specific beats clever.

**Make structure encode something true.** Eyebrows, dividers, labels, and
numbered markers (01 / 02 / 03) are only right when the content actually is a
sequence — a real process, a typed timeline where order carries information the
reader needs. Otherwise they decorate.

**When it's a UI, not a document.** A dashboard or tool is scanned and operated,
not read top-to-bottom, so the craft shifts from typography to information
design. Surface the summary before the detail; encode state in form as well as
number — a pill, a chip, a severity stripe — so what needs attention reads at a
glance. Semantic color (good / warning / critical) is separate from the accent
and doesn't count as your accent. What's interactive looks interactive.

## 4. Spend the freedom somewhere other than the house style

AI-generated design currently clusters on a handful of looks. Where the user
pins a direction, follow it exactly — their words win, including when they ask
for one of these. Where nothing is specified, pick something else:

| The cluster | |
|---|---|
| Warm cream `#F4F1EA` + serif display + terracotta accent | Broadsheet hairline rules over dense columns |
| Near-black with one acid-green or vermilion pop | Purple-to-blue gradient hero on white |
| Inter or Space Grotesk as the "safe" face | Emoji as section markers |
| Everything centered | `rounded-lg` everywhere, accent rail on rounded cards |

## 5. When the treatment is editorial

The stance shifts: the client has already rejected proposals that felt
templated and is paying for a distinctive point of view. Make opinionated calls
and take one real aesthetic risk where it serves the work.

Before building, review the plan from section 2 against the subject: if any part
reads like the generic default you'd produce for any similar page, revise that
part and note what changed and why. Only then write the code, following the
revised plan exactly.

- **The hero is a thesis** — open with the most characteristic thing in the
  subject's world: headline, image, live demo, interactive moment.
- **Typography carries the personality** — pair display and body deliberately,
  not the families you'd reach for on any other project. Make the type treatment
  itself memorable, not a neutral delivery vehicle.
- **Motion is deliberate** — a page-load sequence, a scroll reveal, hover
  micro-interactions, ambient atmosphere. One orchestrated moment lands harder
  than scattered effects, and scattered effects are themselves a tell.
- **Match complexity to the vision** — maximalist directions need elaborate
  execution; minimal ones need precision in spacing, type, and detail. Elegance
  is executing the chosen vision well.
- **Spend boldness in one place** and keep everything around it quiet. If the
  accent fights the ground, shift it analogous or drop saturation rather than
  replacing it.

## Rationalizations

| Thought | Reality |
|---|---|
| "It's just an internal test guide / report — design doesn't apply" | Treatment is what varies, not craft. Utilitarian still means a real palette, a real type scale, and considered spacing |
| "I'll pick colors as I write the CSS" | A palette assembled tag by tag is the one that comes out generic. The plan is three lines and it's what makes the page specific |
| "The user didn't mention dark mode" | The viewer's theme decides, not the request. An undesigned second theme ships broken contrast |
| "I'll link the font from Google Fonts" | Blocked by CSP when published, unavailable offline when handed over — it fails silently to a fallback face and the type plan evaporates |
| "Cream, a serif, and a terracotta accent looks tasteful" | It is the current default look. Tasteful and templated at once — spend the freedom elsewhere unless the user asked for it |
| "I'll number the sections, it looks structured" | Numbering claims the content is a sequence. If order carries no information, it's decoration that lies |
| "Restyle was skipped, so cmk:visualize does not apply to the figure" | Figure-gated. A primary figure still names a job and loads `references/diagram.md` |
| "I'll load `dataviz` / `artifact-capabilities`" | Those names are not in this pack. Do not search for them. Charts are out of the v1 job set |
| "A flex row of boxes and → is a topology diagram" | Topology is inline SVG from the recipe. CSS arrows encode a path, not containment |
| "The figure needs its own rust/teal lock to read at a glance" | Inherit the page or shell tokens. A second palette is the one-color problem on the figure |

## Red Flags

- A primary figure with no spoken job, or a name that is not one of the four
- Writing the `cmk:explain` Map / scan sketch without loading
  `references/diagram.md`
- Hunting for `dataviz` or `artifact-capabilities`
- Mermaid, a webfont CDN, or a second `.svg`/PNG file next to the page
- CSS `→` lists or Canvas used for one of the four figure jobs
