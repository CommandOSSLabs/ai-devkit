# cmk:delivery-workflow — test evidence (v0.3.0)

## Model roster

| Model | Role |
|---|---|
| grok-4.5 | Primary |

## RED (pre-scope-band text v0.2.1)

Pipeline sibling RED (v0.4.2): on "feature, skip requirements, go implement" → `INVOKES_CMK_REQUIREMENTS: no`, `STATES_SCOPE_BAND: no`. Workflow lacked scope band / docs-ready vocabulary — gap this edit closes. Workflow-only RED subagent hung; evidence carried via pipeline sibling + missing sections in v0.2.1 text.

## GREEN (v0.3.0 + pipeline v0.5.0)

Pipeline GREEN: `STATES_SCOPE_BAND: yes (feature)`, `INVOKES_OR_REQUIRES_CMK_REQUIREMENTS_BEFORE_PHASE_3: yes`, `SKIPS_TO_IMPLEMENT: no`.

## Wording pass v0.3.1

- `scope-band.md`: real gate prose (removed meta "`<HARD-GATE>` style"); shorter patch row.
- Start-tracked-work step 4 → pointer-only to docs-ready (no restated feature/patch rules).
- Dropped no-op rationalization about "another kit".
- Micro-test: trimmed pipeline + scope-band gate still blocks implement under eng-lead pressure.
