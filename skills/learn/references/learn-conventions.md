# Learning Conventions

## Canonical Placement

- Learning files: `docs/knowledge/{topic}.md`
- Examples: `docs/knowledge/infrastructure.md`, `docs/knowledge/api-quirks.md`, `docs/knowledge/payments.md`

## File Convention

- One file per topic — entries accumulate within the file over time
- Use `kebab-case` topic names that describe the domain, not the date or session
- Each file starts with a `# {Topic}` heading
- Entries are appended in reverse chronological order (newest first)

## Topic Naming

Choose topics by domain, not by session or date:
- `infrastructure` — cloud, networking, deployment, scaling
- `api-quirks` — third-party API behavior that differs from documentation
- `database` — query patterns, migration gotchas, connection management
- `auth` — authentication, authorization, token handling
- `payments` — billing, subscriptions, payment provider behavior
- `performance` — bottlenecks, optimization findings, load test results
- `testing` — test patterns, flaky test fixes, coverage gaps

Teams define their own topics based on what they're working on.

## Entry Format

Each entry follows this structure:

```markdown
### [Clear, specific title]
- **Date:** YYYY-MM-DD
- **Context:** [Where this came from — session, debugging, PR, incident, etc.]
- **Learning:** [The insight itself — concise and actionable]
- **Applies to:** [Downstream tags — e.g., system-design, deployment, feature-spec]
```

## Conflict Resolution

When a new learning contradicts an existing entry:
- Flag it to the user with both entries shown
- The user decides: replace, keep both, or discard
- If replaced, update the date to reflect when the understanding changed

## Downstream Use

Learnings are inputs for other skills:
- Feed a learning into `cmk:rule` to codify it as an engineering standard
- Feed a learning into `cmk:prd` to inform product requirements
- Feed a learning into `cmk:system-design` to update architecture
- Feed a learning into `cmk:feature-spec` to refine implementation details

The knowledge directory is a staging area — not the final destination for all insights.
