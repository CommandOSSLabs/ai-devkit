---
name: cmk:adr
description: Create or update architecture decision records for system-level technical choices. Use whenever someone needs to record, revise, or document a technical decision with trade-offs — like choosing a database, communication protocol, or infrastructure pattern. Also triggers for "record this decision", "we decided to use X over Y", or "document why we chose this approach".
metadata:
  sdl_phase: "1"
  domain: "adr"
---

# ADR

## Intents

```
We decided to use event sourcing over CRUD for the audit trail — record that as an ADR
```
```
Record an ADR: chose Redis over Memcached for session caching because of pub/sub support
```
```
Update ADR-0003 — we revisited the decision and switched from REST to gRPC
```
```
Document why we chose Kafka over RabbitMQ
```
```
What architecture decisions have we recorded?
```

## References

Read `references/adr-conventions.md` for placement rules and `references/adr-template.md` for section structure.

## Scope

ADRs are for system-level decisions that affect multiple features or core architecture. Feature-scoped decisions belong in the feature `spec.md` under Technical Decisions.

## Workflow: Create

1. Gather decision context from conversation/docs/links.
2. Validate scope is system-wide (not feature-scoped).
3. Place at the repository's existing ADR path, or fallback: `docs/adrs/{NNNN}-{decision-title}.md`. Determine `{NNNN}` by scanning existing ADRs and incrementing (start at `0001` if none exist).
4. Fill template from `references/adr-template.md` (or local template if present).
5. Set status to `proposed`.

## Workflow: Iterate

1. Read the existing ADR in full.
2. **Upstream check:** If `docs/system-design.md` exists, check whether the revised decision conflicts with current architecture. Warn the user if so.
3. Identify what changed and why.
4. Update in place: revise decision/rationale, update alternatives and consequences, note what shifted.
5. Update `Last updated` date.
6. Transition status: `proposed` → `accepted` when team agrees. `accepted` stays `accepted` when decision evolves.

## Output

- Create: complete ADR file using canonical naming
- Iterate: update in place with current decision and rationale
- Decision statement is clear and implementable
- Alternatives section is always present with concrete trade-offs
- Consequences section is always present with short-term and long-term impact
- If decision changed, rationale explains what shifted
