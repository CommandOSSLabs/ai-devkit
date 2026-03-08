---
name: cmk:system-design
description: Create or iterate system design documents. Use whenever users ask to draft, refine, or update a system design covering architecture, tech stack, components, and cross-cutting concerns.
metadata:
  sdl_phase: "1"
  domain: "system-design"
---

# System Design

Use this skill for:
- Creating a new system design document
- Iterating an existing system design

## Canonical References

- System design conventions: `references/system-design-conventions.md`
- System design template: `references/system-design-template.md`

## Supported Input Sources

Collect and synthesize from one or more of:
- Current conversation context and decisions
- Existing PRD (`docs/prd.md`)
- Local documents (existing specs, ADRs, codebase)
- External docs/links (architecture diagrams, vendor docs, RFC links)
- Direct prompt requirements from the engineer

## Content Guidance

Write what matters, skip what's obvious. The template is a starting point — adapt it to fit the context.

## Scope Rule

System design captures the technical "how" at architecture level. Keep product requirements in the PRD and implementation detail in feature specs. System-wide decisions should reference or create ADRs.

## Workflow: Create

Use when no system design exists.

1. Normalize input into architecture context:
   - What the system does and who it serves (Mission)
   - Opinionated design principles that break ties
   - Technology choices per layer
   - Component boundaries and communication patterns
   - External dependencies and failure behavior
   - Cross-cutting concerns (security, data, observability, performance, resilience)
   - Architectural constraints
2. Map normalized input into template sections in `references/system-design-template.md`.
   - If the target repository already has an existing system design convention, align to that local standard.
3. Apply canonical placement:
   - Use the repository's existing system design path when available.
   - Fallback path when no local convention exists: `docs/system-design.md`
4. Mark unknowns in `Open Points` rather than guessing.
5. Link upstream PRD in `Related Documents` when one exists.
6. Set status to `draft`.

## Workflow: Iterate

Use when a system design already exists and needs to evolve.

1. Read the existing system design in full before making changes.
2. **Upstream check:** If `docs/prd.md` exists, scan its scope, success criteria, and status. If the update conflicts with upstream PRD (e.g., addresses a descoped requirement, drops a success criterion), warn the user before proceeding.
3. Identify what changed and why — from new requirements, tech stack changes, scaling needs, security findings, or resolved architecture questions.
4. Apply changes to the relevant sections:
   - **Revise Mission or Design Principles** — rewrite when the system's purpose or guiding principles shift
   - **Update Tech Stack** — add, remove, or change technology choices with rationale
   - **Update Architecture** — add/remove/revise components, update diagrams, adjust boundaries
   - **Update External Dependencies** — add new dependencies, update failure behavior
   - **Update Cross-Cutting Concerns** — revise security assumptions/gaps/controls, update data architecture, adjust performance targets, add resilience patterns
   - **Update Constraints** — add new constraints or remove lifted ones
   - **Resolve Open Points** — when an architecture decision is made, move the outcome into the relevant section (or create an ADR) and remove from Open Points
   - **Update Architecture Rationale** — connect new ADRs into the narrative
   - **Update Related Documents** — link new specs, ADRs, or upstream PRD changes
5. Preserve content that is still valid — do not rewrite sections that haven't changed.
6. Update `Last updated` date.
7. Transition status when appropriate:
   - `draft` → `active` when the design is agreed upon and implementation begins
   - `active` → `shipped` when the system is in production
   - Any → `deprecated` when the system is decommissioned

## Quality Checklist

- Mission is concise and explains what, who, and why
- Design principles are opinionated and system-specific (no generic truisms)
- Tech stack covers all relevant layers with version/constraint info
- Architecture diagram exists and matches the component descriptions
- Security section includes assumptions, known gaps, and notable controls
- Constraints are genuine givens, not preferences
- Open Points only contains genuinely unresolved decisions
- No feature-level implementation detail (that belongs in specs)

## Output Contract

- If creating: produce a complete system design populated with known context at `docs/system-design.md`
- If iterating: apply targeted updates to affected sections while preserving valid existing content
- Always call out unresolved decisions in `Open Points`
- Always update `Last updated` date when iterating
