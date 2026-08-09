# Design Guidance (Directive, Not a Form)

How to shape a design document. There is no fixed section list: the document
takes the shape its system needs. What follows is what any strong design doc
accomplishes, and the recurring patterns that get it there.

## Spec over implementation

A design doc is a technical spec: the approach, mechanism, solution, and
guarantees — stated so they hold regardless of which language or framework
implements them. State what each component owns, what it exposes, what it
depends on, what invariants it maintains, and how it fails. Stack choices
(runtime, framework, storage engine) are constraints or rationale, not the
spec itself; naming them is helpful, designing around them is not.
Implementation-agnostic never means vague: the spec must be thorough and
detailed enough that two independent implementations would agree on behavior
— and specific enough to disagree with.

## What the document must accomplish

Whatever its shape, a reader must be able to extract:

- **Mission** — what the system does, who it serves, why it exists.
- **Principles** — opinionated, system-specific tie-breakers, each with why.
- **Architecture** — components, boundaries, dependency direction,
  communication patterns; a diagram that matches the prose.
- **Mechanisms** — how the load-bearing parts actually work: state models,
  transition rules, protocols, trust boundaries, failure and recovery paths.
- **Cross-cutting concerns** — security always (assumptions, gaps, controls);
  data, observability, performance, resilience when there is something
  non-obvious to say.
- **Constraints** — givens not open for debate, including the decisions
  (ADRs) that bind this design.
- **Open points** — unresolved design questions, stated as open.

## Design levels

Design is layered, and each layer is its own doc (or tree):

- **System-wide** — the whole platform: layers, dependency direction,
  component map, composition of sub-systems.
- **Sub-system / track** — one product line or major component: its
  responsibilities, protocols, and how it composes the shared core without
  leaking into it.
- **Feature-level** — one feature: scope, flows (success and failure),
  boundaries, acceptance criteria when "done" isn't obvious.

Lower levels reference upward and never silently contradict the level above;
a conflict is surfaced and resolved at the higher level.

## Multi-doc design trees

A system too large for one doc becomes a tree: shared documents first
(architecture, contracts, protocols), then one branch per sub-system. The
tree's entry README is a "read this tree" navigation index — one line per doc
saying what it covers and when to read it, ordered shared-first — so a reader
loads the shared spine plus only the branch being changed.

## Coherence

Design sits between requirements (upstream) and decisions (constraining).
Every doc names the requirements it satisfies and the ADRs that bind it; a
design change is checked against both, and against sibling docs that
reference the changed component, before it lands. Use glossary terms
(`cmk:glossary`) for every system, component, and actor; a design doc that
invents synonyms for established terms is introducing drift, not clarity.
