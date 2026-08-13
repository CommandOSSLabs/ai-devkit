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

## Profile neutrality

Mechanisms are specified once, neutral to the infrastructure environment
that will run them. The design is the production-ready foundation;
environments only profile it. A local-only, CI-only, or "harden later"
workaround is a second path — reject it (`cmk:delivery-pipeline`
engineering principles, No shortcut). Environment differences (local
stack vs cloud environments) appear only in composition and topology
sections as materialization choices — which launcher assembles the
parts, which plane delivers config and secrets, which infrastructure
declares the boundary. A design that forks product, protocol, or core
behavior per environment is a defect: push the difference down to a
composition surface or redesign. CI, deploy, and operator workflows
are specified as host-runnable script composition (`cmk:cicd`), not
as a GitHub-only procedure beside the real path. Local is a profile
and a debug/rollout host, not a second product. An attested boundary
is specified once in `cmk:enclave`; this file does not restate the
planes. Where the repository declares its own infra-profile
standard, that standard refines this rule and takes precedence.

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

Design is layered, and each layer is its own doc (or tree); the level
definitions and the never-silently-contradict rule live in
`references/design-conventions.md` § Design Levels.

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
