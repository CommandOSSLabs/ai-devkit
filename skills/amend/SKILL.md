---
name: cmk:amend
description: Use when an already-shipped, spec'd feature needs a small in-scope change — a recolor, a copy edit, a tweak, or a follow-on. Produces a tier decision and a light-lane route. Not for new features (cmk:scope), broken behavior (root-cause), or a drifted spec (cmk:realign).
version: 1.0.1
---

# Amend Feature

Evolve a feature that already shipped — without re-running the greenfield gate. The feature has an approved spec and working code; the job is to classify the change honestly against that spec, then route it to the lightest lane that still keeps the spec and the tests true.

This is a fast lane, not a gate bypass. Every path still exits through `cmk:tdd`, and anything with real design questions escalates to `cmk:scope`. "Small" is a claim you cmk:evidence against the existing spec, not a feeling.

## 1. Ground the change in the existing spec

Find the feature's spec — `docs/specs/<date>-<feature>/{requirements,design,tasks}.md` via `docs/specs/INDEX.md` — and read the requirements the change touches plus the design section that owns them. If the feature has **no** spec at all, cmk:amend is the wrong skill: a brand-new capability is `cmk:scope`, a break is `cmk:debug`.

**Done when:** you can name the requirement IDs the change affects.

## 2. Classify the change — out loud

State which case this is and why, the same way `cmk:scope` names a tier:

- **Tier 0 — no behavior change.** A recolor, an icon, a label, a copy edit; every existing acceptance criterion still reads true unchanged. → REQUIRED SUB-SKILL: use `cmk:tdd` (assert the visual/behavioral change at its seam). No spec edit beyond fixing a criterion whose wording is now stale.
- **Tier 1 — changes or extends existing spec'd behavior, ≤ ~half a day.** The change modifies what an existing requirement already promises, or adds a small follow-on to it. → mini-spec: add or cmk:amend the requirement plus a `... SHALL CONTINUE TO ...` guard for the behavior that must keep working (REQUIRED SUB-SKILL: use `cmk:requirements` in its **tier-1 mini-spec mode** — append the fix and guard to the owning feature's requirements.md; no new feature code, no whole-file review), then REQUIRED SUB-SKILL: use `cmk:tdd`.
- **Genuinely new scope.** New behavior the spec never covered, a real UX or design decision with live alternatives, more than ~half a day, or it spans subsystems. → STOP amending. REQUIRED SUB-SKILL: use `cmk:scope` — this earns the full cycle. Do not shape big new work here.

The honest test for the escalation: **does the existing spec's intent already cover this behavior?** If you are inventing what it should do, it is new scope — hand it up.

**Done when:** the tier is stated out loud and the case is chosen.

## 3. Keep the traceability honest

After the change lands through `cmk:tdd`, its new or changed requirement carries its ID into the test tag and the commit trailer like any other. If you edited `requirements.md`, `design.md`, or `tasks.md`, REQUIRED SUB-SKILL: use `cmk:realign` to realign `Status:` and the trace. Otherwise REQUIRED SUB-SKILL: use `cmk:traceability` directly and read its finding set. The check stays clean, or the change is not done.

**Done when:** the change is implemented test-first, its requirement ID traces end to end, and the `cmk:traceability` check reports no errors.

## Red flags — you are in the wrong lane

- You are inventing behavior the spec never described → that is `cmk:scope`, not amend.
- The "small" change grew a design decision with real alternatives → escalate; do not decide it by feel here.
- You are about to change code without touching a test → that is `cmk:tdd`, always.
- The feature was never spec'd, or it is simply broken → `cmk:scope` (new) or `cmk:debug` (broken), not amend.
- You are splitting one request into a trivial part and a new-behavior part → route each half separately: the tweak stays here, the new behavior goes to `cmk:scope`.
