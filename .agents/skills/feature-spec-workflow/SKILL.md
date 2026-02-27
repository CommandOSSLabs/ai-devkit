---
name: feature-spec-workflow
description: Create or iterate feature specifications during requirements and design. Use whenever users ask to draft, refine, or restructure a feature spec from conversation notes, local docs, external links, or direct prompts.
metadata:
  sdl_phase: "1"
  domain: "feature-spec"
---

# Feature Spec Workflow

Use this skill for:
- Creating a new feature specification
- Iterating an existing feature specification

## Canonical References

- SDL phase definition: `docs/reference/sdl-phases.md`
- Spec conventions: `docs/specs/README.md`
- Spec template: `docs/templates/feature-spec.md`

## Supported Input Sources

Collect and synthesize from one or more of:
- Current conversation context and decisions
- Local documents (existing specs, ADRs, notes)
- External docs/links (Notion, Google Docs, RFC links)
- Direct prompt requirements from the engineer

## Workflow

1. Normalize input into a shared decision log:
   - Problem statement
   - Target users/stakeholders
   - Constraints and assumptions
   - Open questions
2. Map normalized input into template sections in `docs/templates/feature-spec.md`.
3. Apply canonical placement:
   - New spec: `docs/specs/{NNNN}-{feature-name}/spec.md`
   - Existing spec iteration: update existing `spec.md`
4. Preserve traceability:
   - Update `Changelog`
   - Update `Open Points` and `Known Issues` when applicable
5. Keep Phase 1 scope:
   - Product context is welcome
   - Technical specification quality remains primary

## Quality Checklist

- Overview explains problem, users, and intended outcome
- Design principles include functional and non-functional requirements
- Flows include success and failure paths
- Boundaries clearly define owns vs does-not-own
- Technical decisions include rationale and trade-offs

## Output Contract

- If creating: produce a complete `spec.md` scaffold populated with known context
- If iterating: apply targeted updates while preserving valid existing content
- Always call out unresolved decisions in `Open Points`
