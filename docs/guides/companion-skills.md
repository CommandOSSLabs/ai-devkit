# Companion skills

Third-party skills this kit points at and does not copy. A companion is
installed by the operator, pinned by commit SHA, and used only when it is
already present. The kit never vendors one, and a skill never pipes a remote
installer.

## When to read

Before recommending a skill the kit does not ship, and when
`cmk:delivery-spec-plan` or `cmk:delivery-ship` reaches its optional
Plannotator step.

## Policy

- Vendor-org or named-maintainer repos only.
- Read the `SKILL.md` before adoption.
- Reject a setup that downloads an archive or pipes a remote script.
- Pin by commit SHA when a repo actually installs one. Star and install
  counts below were read on 2026-10-11 and will drift; they are not a pin.
- Pick one main design engine. Stacking several conflicts.
- Absence of a companion is a no-op. Do not install it to make a phase pass.

## Plannotator

Optional human gate. Not required, and not a substitute for
`cmk:delivery-review`.

| | |
|---|---|
| Repo | [backnotprop/plannotator](https://github.com/backnotprop/plannotator) |
| Pin | `5e38b793cb8fbf7257120547f6b6f2a26ed8e88d` (2026-10-12) |
| Install line in this kit | none. Its published installer is a curl pipe, which this policy rejects |
| Use | only when the operator has already installed it |

When it is present:

- `cmk:delivery-spec-plan`, after the plan is written, hands that plan to
  `/plannotator-annotate` and keeps the returned notes with the plan. The
  phase still ends when the plan is written. A missing install does not
  block exit.
- `cmk:delivery-ship`, before the PR opens, offers `/plannotator-review` on
  the diff and folds accepted notes into the diff. A missing install does
  not block the PR.

Neither skill installs Plannotator, mentions its installer, or treats a
skipped annotate or review as a failed gate.

## Table

Install lines are the `npx skills add` form. Pin the SHA at install time;
this table does not invent one.

### Design systems and UI taste

| Skill | What it does | Install |
|---|---|---|
| [frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Baseline "avoid generic AI UI" | `npx skills add anthropics/skills --skill frontend-design` |
| [impeccable](https://github.com/pbakaus/impeccable) | Design-language layer with `/polish`, `/audit`, `/typeset` | `npx skills add pbakaus/impeccable` |
| [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Style, palette, and WCAG lookup | `npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max` |
| [taste-skill](https://github.com/Leonxlnx/taste-skill) | Metric-driven layout and type rules | `npx skills add Leonxlnx/taste-skill --skill design-taste-frontend` |
| [emilkowalski/skills](https://github.com/emilkowalski/skills) | Motion and UI polish | `npx skills add emilkowalski/skills` |
| [web-design-guidelines](https://github.com/vercel-labs/agent-skills) | Review against Vercel's interface guidelines | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines` |
| [shadcn skill](https://ui.shadcn.com/docs/skills) | shadcn CLI, registry, Tailwind | `npx skills add shadcn/ui` |

### Explainers

| Skill | What it does | Install |
|---|---|---|
| [anatomy](https://github.com/wheresryan22/anatomy) | Explains an idea by building it as a working object | `npx skills add wheresryan22/anatomy` |
| [visual-explainer](https://github.com/nicobailon/visual-explainer) | HTML pages and decks for diffs, plans, and recaps | `npx skills add nicobailon/visual-explainer` |

### Workflow

| Skill | What it does | Install | Overlap |
|---|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | Brainstorming, plans, TDD, debugging | `npx skills add obra/superpowers` | brainstorming ≈ `cmk:requirements`; writing-plans ≈ `cmk:delivery-spec-plan` |
| [mattpocock/skills](https://github.com/mattpocock/skills) | grill-me, tdd, triage, handoff | `npx skills add mattpocock/skills` | grill-me beside `cmk:requirements` |
| [getsentry/skills](https://github.com/getsentry/skills) `security-review` | Reasoning-style security review | `npx skills add getsentry/skills --skill security-review` | lens inside `cmk:delivery-review`, not a replacement |
| [Plannotator](https://github.com/backnotprop/plannotator) | Annotate a plan; review a diff | none — see above | optional step in `cmk:delivery-spec-plan` and `cmk:delivery-ship` |

## Expected outcome

A reader can name which companion to use, how to install the ones this
policy allows, and which kit skill calls Plannotator when it is already
there. No skill in this repo gains an installer.
