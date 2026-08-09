# Requirements Guidance (Directive, Not a Form)

How to shape a requirements document. There is no fixed section list: the
document takes the shape its product needs, and a doc that fills sections it
has nothing to say in has failed as surely as one that omits what matters.
What follows is what any strong requirements doc accomplishes, and the
recurring patterns that get it there.

## What the document must accomplish

Whatever its shape, a reader must be able to extract:

- **The problem** — who has it, what it costs them, how they cope today.
- **Why now** — what changed that makes this the right time.
- **Success, measurably** — outcomes with targets and a way to measure them.
- **Scope, both ways** — what's in, and what's out with the reason for each
  exclusion.
- **Open points** — unresolved product decisions, stated as open rather than
  guessed at.

Optional when they earn their place: user scenarios grounding abstract needs,
risk/assumption tables with "what breaks if wrong," and business or timeline
constraints.

## Normative vocabulary

Define the conformance vocabulary once at the entry point and use it
consistently: **MUST** is required for conformance, **SHOULD** is the default
unless a documented tradeoff justifies deviation, **MAY** is optional.
Downstream design docs may choose mechanisms but must not weaken these
requirements — say so explicitly. Normative language is what lets a
requirements doc act as a contract instead of a mood.

## Locked decisions

When product decisions accumulate, register them explicitly (numbered — D1,
D2, …) with a status line stating they are accepted and must not be silently
reopened. Open inputs can then be worked without re-litigating what's
settled; reversing a locked decision is a visible, deliberate act.

## Technical products get technical requirements

Requirements language is product language — and when the product is a
protocol, a platform, or a guarantee, the product language *is* technical.
Stating per-track guarantees, trust boundaries, and verifiability claims as
requirements is correct; prescribing the mechanism that delivers them is not.
The boundary is mechanism, not vocabulary.

## Progressive disclosure

A large product splits its requirements per product area or capability, with
a concise entry-point doc that indexes them: what each area covers and when
to read it. Readers — human or agent — load only the context the task needs.
Keep each area doc self-contained enough to be referenced as a unit; define
shared vocabulary once in the glossary (`cmk:glossary`) and link it rather
than redefining terms per doc.

## Coherence

Requirements sit upstream of design and decisions. Every doc names its
downstream design docs once they exist; a requirement change is checked
against them and cascaded, not committed in isolation. Cross-reference
related requirements docs (entry point ↔ area docs ↔ glossary) so the set
reads as one coherent contract.
