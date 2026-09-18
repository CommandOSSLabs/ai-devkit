# cmk:capability-map

## What

The horizontal layer of the docs tree: which capabilities exist, which part of
the codebase each one owns, and what each one deliberately declined. Owns
`docs/capabilities/INDEX.md` — the one registry of capability codes — and the
ask-time neighbor derivation read over it.

## Approach

An Iron Law forbids a derived graph file, a cache, and any row written without
explicit confirmation; derivation never gates, not even when it returns empty.
An absent registry is a supported state that no-ops, not a misconfiguration.
Two workflows: **Neighbors** derives ranked neighbors, their declined items
attributed by code, and `owns_coverage`, completing only when the difference
between the new work and its neighbors can be said out loud with evidence;
**Register** adds or amends a row. Callers point at
`references/neighbor-derivation.md` as the one home for the passes rather than
restating them.

## Where

- Skill body: `skills/capability-map/SKILL.md`
- Row grammar, code rules, card header: `skills/capability-map/references/registry-conventions.md`
- Passes, envelope, claim rules: `skills/capability-map/references/neighbor-derivation.md`
- Pressure-test record: `skills/capability-map/TESTS.md`
- The registry itself: `docs/capabilities/INDEX.md`
