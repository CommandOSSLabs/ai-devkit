---
name: cmk:feature-spec
description: Create or iterate feature specifications during requirements and design. Use whenever users ask to draft, refine, or restructure a feature spec from conversation notes, local docs, external links, or direct prompts.
metadata:
  sdl_phase: "1"
  domain: "feature-spec"
---

# Feature Spec

Use this skill for:
- Creating a new feature specification
- Iterating an existing feature specification

## Canonical References

- Spec conventions: `references/spec-conventions.md`
- Spec template: `references/feature-spec-template.md`

## Supported Input Sources

Collect and synthesize from one or more of:
- Current conversation context and decisions
- Local documents (existing specs, ADRs, notes)
- External docs/links (Notion, Google Docs, RFC links)
- Direct prompt requirements from the engineer

## Content Guidance

Write what matters, skip what's obvious. The template is a starting point — adapt it to fit the context.

## Workflow: Create

Use when no spec exists for the feature.

1. Normalize input into a shared decision log:
   - Problem statement
   - Target users/stakeholders
   - Constraints and assumptions
   - Open questions
2. Map normalized input into template sections in `references/feature-spec-template.md`.
   - If the target repository already has an existing spec template/convention, align to that local standard.
3. Apply canonical placement:
   - Use the repository's existing canonical spec path when available.
   - Fallback path when no local convention exists: `docs/specs/{NNNN}-{feature-name}/spec.md`
4. Mark unknowns in `Open Points` rather than guessing.

## Workflow: Iterate

Use when a spec already exists and needs to evolve.

1. Read the existing spec in full before making changes.
2. **Upstream check:** If upstream docs exist (`docs/prd.md`, `docs/system-design.md`), scan for conflicts with the changes being made. Warn the user if the update contradicts upstream scope, requirements, or architecture decisions.
3. Identify what changed and why — from conversation, new requirements, resolved questions, user feedback, or technical discovery.
4. Apply changes to the relevant sections:
   - **Revise sections** — rewrite content in place when the substance changes (e.g., Overview after scope shift, Requirements after new constraints)
   - **Add/remove requirements** — add new FR/NFR, revise existing ones, remove obsolete ones
   - **Add/remove flows** — add new flows for newly scoped behavior, remove flows that are descoped
   - **Update Boundaries** — adjust owns/does-not-own when scope or adjacent specs change
   - **Update Technical Decisions** — record new choices or revise rationale when trade-offs shift
   - **Resolve Open Points** — when a decision is made, move the outcome into the relevant section and remove from Open Points
   - **Add Known Issues** — surface gaps discovered during development
5. Preserve content that is still valid — do not rewrite sections that haven't changed.
6. Update `Last updated` date.

## Quality Checklist

- Overview explains problem, users, and intended outcome
- Requirements are concrete and evaluable (FR and NFR)
- Flows include success and failure paths
- Boundaries clearly define owns vs does-not-own
- Technical decisions include rationale and trade-offs
- Open Points only contains genuinely unresolved decisions (resolved items moved out)

## Output Contract

- If creating: produce a complete `spec.md` scaffold populated with known context
- If iterating: apply targeted updates to affected sections while preserving valid existing content
- Always call out unresolved decisions in `Open Points`
- Always update `Last updated` date when iterating
