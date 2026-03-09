---
name: cmk:prd
description: Create or iterate product requirements documents. Use whenever someone wants to draft, refine, or update a PRD — whether from conversation notes, research sessions, user feedback, Notion docs, or direct instructions. Also triggers when users discuss product scope, success criteria, user needs, or say things like "save this as requirements" or "let's define what we're building".
metadata:
  sdl_phase: "1"
  domain: "prd"
---

# PRD

## Intents

```
We just discussed the billing system requirements — save that as a PRD
```
```
Use this Notion doc to draft a PRD for the new onboarding flow: [link]
```
```
Update the PRD — we're cutting the SSO requirement from v1
```
```
Let's define what we're building for the payments feature
```
```
Use our infrastructure knowledge to inform the PRD requirements
```

## References

Read `references/prd-conventions.md` for placement rules and `references/prd-template.md` for section structure.

## Scope

PRDs capture product/business "what and why." Technical architecture belongs in system-design; implementation detail in feature specs.

## Input

Synthesize from whatever the user provides: conversation context, user research, local docs, external links (Notion, Google Docs), direct prompts, or `docs/knowledge/` entries (when explicitly referenced).

## Workflow: Create

1. Normalize input into product context: problem, timing, success criteria, user needs, scope.
2. Map into template sections from `references/prd-template.md`. Align to local convention if one exists.
3. Place at the repository's existing PRD path, or fallback: `docs/prd.md`.
4. Mark unknowns in `Open Points` — don't guess.
5. Set status to `draft`.

## Workflow: Iterate

1. Read the existing PRD in full.
2. Identify what changed and why.
3. Update affected sections in place. Preserve unchanged content.
4. Update `Last updated` date.
5. Transition status when appropriate: `draft` → `active` → `decomposed` → `shipped`, or any → `deprecated`.

## Output

- Create: complete PRD at `docs/prd.md` with known context populated
- Iterate: targeted updates to affected sections only
- Unresolved decisions go in `Open Points`
- Problem names a specific user segment with concrete pain
- Success criteria are measurable with targets
- No technical architecture detail
