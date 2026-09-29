# cmk:blueprint-animation

## What
Design-family skill that builds one continuous, never-cutting animation of a
single screen, in 3–6 numbered steps, each explaining one UX decision
through a cyan blueprint drawing. Redesign mode (Before + After screens)
rebuilds only the parts that change; Explain mode (one screen) keeps the
design fixed and annotates each module's what and why. Ported from
[moguzbulbul/blueprint-animation](https://github.com/moguzbulbul/blueprint-animation)
v1.3.1; licensed CC BY-NC 4.0, not the repo's MIT.

## Approach
Figma fidelity outranks every other rule: values, fonts, and icons come
from the Figma file, and each built screen is pixel-diffed against the
Figma export before any motion is added. Each step runs a fixed phase
sequence — focus, scan-line blueprint in, construct (or annotate), scan-line
reveal, hold — with old→new swaps only while covered by the blueprint.
The scene builds on Claude Design's `animations_v3` starter and reuses the
blueprint kit from the bundled reference scene. Keeps the upstream §0–8
section numbering so cross-references survive the split into references.

## Where
- Skill body: `skills/blueprint-animation/SKILL.md` — §0 fidelity, §1
  gather and mode pick, §2 per-step sequence, §7 QA.
- `skills/blueprint-animation/references/blueprint-style.md` — §3 drawing
  style, §4 text/overlap rules.
- `skills/blueprint-animation/references/architecture.md` — §5 scene
  architecture, §6 performance budget.
- `skills/blueprint-animation/references/explain-mode.md` — §8 Explain
  mode: phase table, mark vocabulary, worked example.
- `skills/blueprint-animation/references/example-scene.jsx` — Redesign-mode
  reference scene (CRM record page, 5 steps).
- `skills/blueprint-animation/LICENSE` — CC BY-NC 4.0 legal code and
  attribution.

## Links
Standalone: cites no other `cmk:` skill.
