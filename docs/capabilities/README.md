# Capabilities

The capability registry: which capabilities exist in this repository, what part
of the codebase each one owns, and which documents specify it.

This directory holds exactly one substantive file — [`INDEX.md`](./INDEX.md).
It is a registry, not a document tree. Requirements live in
[`../requirements/`](../requirements/), design in [`../design/`](../design/).

## Conventions

- One row per capability, sorted by code.
- The **code** is the requirements document's `ID prefix` — one key, not two.
  It is unique across the repository and permanent: a retired capability keeps
  its row with `Status: deprecated` and never releases its code.
- An absent document or an unowned surface is written `— none —`, never left
  blank. A deliberate absence and an oversight must not read alike.
- Rows are written only after explicit confirmation — see `cmk:capability-map`.
- Nothing here is generated. Neighbors, overlaps and coverage are derived from
  this file and the design-doc card headers at the moment they are asked for.

## When to read

Before writing a requirements or design document — to find which capabilities
already share the surface, and what they already declined and why.
