## Agent skills

This repo is configured for a spec-driven skill set.

- Feature flow: `cmk:scope` → `cmk:requirements` → `cmk:design` →
  `cmk:delivery-spec-plan` → `cmk:delivery-build`'s `references/continuous.md`
- Vague ask you want turned into a prompt for a fresh session: `/cmk:prompt` (user-run)
- Work you want an agent to keep doing unattended until it is verifiably done: `/cmk:goal` (user-run)
- Bug on-ramp: `cmk:debug` (clear unexpected behavior first, then a guarded fix);
  deployed env: `cmk:incident` then `cmk:debug`; telemetry readiness:
  `cmk:observability`
- Capture a conversation/spec/idea into tracker issues: `/cmk:discover-efforts` (user-run)
- Incoming issues and PRs: `/cmk:triage` (user-run)
- Traceability check: the docs-only `cmk:traceability` skill — run by `cmk:evidence` and `cmk:release`;
  keep it clean
- Project docs (layer enabled): `/cmk:vision` maintains
  `docs/requirements/vision.md`, the `docs/design/` invariant spine, and
  `docs/requirements/guidelines.md`; the feature skills consult them

Repo config the skills read:

- verify commands, release steps, Remote environments: `docs/agents/project.md`
- cold-start drive (Launch / Doctor / Drive / Evidence): `docs/agents/verify.md`
- Team composition (roster, ownership notes, workflow band): `docs/agents/project.md` (`## Team`)
- Issue tracker operations: `docs/agents/issue-tracker.md`
- Triage label mapping: `docs/agents/triage-labels.md`
