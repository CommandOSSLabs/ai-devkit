# Optional system docs — consult recipe

WHEN `cmk:system-docs` is installed, also load `cmk:system-docs`'s `references/consult-recipe.md` (authority,
hard-constraint precedence, no-op, once-per-entry suggest, never auto-invoke). Without it,
this table and the rules below it are the whole recipe.

| When the design… | Consult if Approved | Cite as |
|---|---|---|
| Crosses trust / compliance | `docs/security/threat-model.md`, `compliance.md`, `posture.md` | optional `Security:` TB/THR/CMP only — never on `Respects:` |
| Sets reliability targets | `docs/ops/reliability.md` | optional `Reliability:` SLO only |
| Touches API/UI/a11y/security-coding/instrumentation | matching `docs/rules/common/<name>.md` | design constraints prose |
| Needs system/data/integrations/runtime shape | `docs/design/{system,data,integrations,runtime}.md` | narrative; spine ARCH-N stays `Respects:` only |
| Names cross-module structure | `docs/ai/` (`cmk:codebase-docs`) or `docs/design/codebase/{modules,ownership,dependencies}.md` | Locality / Reuse guidance |

Do not invent TB/THR/CMP/SLO numbers without bold definitions in Approved docs. Shape docs
never redefine ARCH-N. Suggest `/cmk:system-docs <entry-key>` only when that skill is installed and the gap is material.
