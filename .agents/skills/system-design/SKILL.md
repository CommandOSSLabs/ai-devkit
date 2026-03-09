---
name: cmk:system-design
description: Create or iterate system design documents covering architecture, tech stack, components, and cross-cutting concerns. Use whenever someone wants to draft, refine, or update a system design — whether discussing architecture decisions, tech stack changes, infrastructure layout, or scaling strategy. Also triggers for "how should we build this", "design the backend", or "update the architecture".
metadata:
  sdl_phase: "1"
  domain: "system-design"
---

# System Design

## Intents

```
Draft a system design for our payments service
```
```
Update the system design — we switched from PostgreSQL to DynamoDB
```
```
We're adding a message queue between the API and worker — update the architecture
```
```
How should we architect the notification system?
```
```
Use the scaling knowledge from our load tests to update the design
```

## References

Read `references/system-design-conventions.md` for placement rules and `references/system-design-template.md` for section structure.

## Scope

System design captures the technical "how" at architecture level. Product requirements belong in the PRD; implementation detail in feature specs. System-wide decisions should reference or create ADRs.

## Input

Synthesize from whatever the user provides: conversation context, existing PRD (`docs/prd.md`), local docs, external links, direct prompts, or `docs/knowledge/` entries (when explicitly referenced).

## Workflow: Create

1. Normalize input into architecture context: mission, design principles, tech stack, components, dependencies, cross-cutting concerns, constraints.
2. Map into template sections from `references/system-design-template.md`. Align to local convention if one exists.
3. Place at the repository's existing path, or fallback: `docs/system-design.md`.
4. Mark unknowns in `Open Points` — don't guess.
5. Link upstream PRD in `Related Documents` when one exists.
6. Set status to `draft`.

## Workflow: Iterate

1. Read the existing system design in full.
2. **Upstream check:** If `docs/prd.md` exists, scan its scope, success criteria, and status. Warn the user if the update conflicts with upstream PRD.
3. Identify what changed and why.
4. Update affected sections in place. Preserve unchanged content.
5. Update `Last updated` date.
6. Transition status when appropriate: `draft` → `active` → `shipped`, or any → `deprecated`.

## Output

- Create: complete system design at `docs/system-design.md`
- Iterate: targeted updates to affected sections only
- Unresolved decisions go in `Open Points`
- Design principles are opinionated and system-specific
- Architecture diagram matches component descriptions
- Security section is always present — includes assumptions, gaps, and controls
- No feature-level implementation detail
