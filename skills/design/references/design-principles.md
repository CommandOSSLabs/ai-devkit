# Design principles (leaf biases)

Loaded from `cmk:design` Step 2 when choosing among hard designs.
OVERRIDE SHIP (2026-09-08): 21 principle-* skills were dropped as a layer;
user override requires these biases inline.

Apply as decision checks, not new skills:

1. **Foundational thinking** — settle core data and shared state before
   dependent logic.
2. **Caller usage before types** — write how callers invoke the surface, then
   derive types/modules.
3. **Exhaust the design space** — for novel seams, keep 2–3 structurally
   different options before locking.
4. **Graft, don't average** — pick one base; port 1–2 ideas from losers; record
   rejections; re-frame if wildly divergent.
5. **Separate before serializing shared state** — concurrent writers get
   separate stores first; add locks only when sharing is proven necessary.
6. **Make operations idempotent** — retries and restarts converge.
7. **Migrate callers, then delete legacy** — internal APIs: move callers and
   delete old in the same wave when safe.
8. **Build the lever** — prefer a script/codemod/check the next agent can rerun.
9. **Redesign from first principles** — integrate a new requirement as if it
   had always been foundational, not bolted on.
10. **Scrap-when-wrong tells** — repeated workarounds, escape-hatch types, or
    "we need a lock" reflex → stop and redesign (hand to `cmk:delivery-reroute` if the
    approved plan cannot absorb it).
