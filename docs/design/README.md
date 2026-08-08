# Design

Distilled system and feature design: how a subsystem works and why it is
shaped that way.

## Conventions

- One file per subsystem or feature: `<topic>.md`; system-wide design lives in
  `system.md`.
- Start from [`../templates/design.md`](../templates/design.md).
- Progress-neutral and tracker-neutral wording: no ticket IDs, no delivery
  status.
- Declare links: name the upstream docs this satisfies and the downstream docs
  it constrains.
- Distilled, not raw: a design doc is the curated source of truth, not a
  transcript of the exploration behind it.

## When to read

Before implementing or changing a subsystem — and read
[`../decisions/`](../decisions/) for the constraints it must honor.
