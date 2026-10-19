## Agent skills

This repo is configured for a spec-driven skill set. Tickets move through a closed
workflow (`docs/agents/triage-labels.md` maps its states); the person approves, answers and
merges, and five commands do the rest: `/cmk:idea`, `/cmk:shape`, `/cmk:go`, `/cmk:board`,
`/cmk:release` (user-run).

- Feature flow: `cmk:scope` → `cmk:requirements` → `cmk:design` →
  `cmk:delivery-spec-plan` → `cmk:delivery-build`
- Vague ask you want turned into a prompt for a fresh session: `/cmk:prompt` (extras pack, user-run)
- Work you want an agent to keep doing unattended until it is verifiably done: `/cmk:goal` (extras pack, user-run)
- Bug on-ramp: `cmk:debug` (clear unexpected behavior first, then a guarded fix);
  deployed env (ops pack): `cmk:incident` then `cmk:debug`; telemetry readiness
  (ops pack): `cmk:observability`
- Capture a conversation/spec/idea into tracker issues: `cmk:discover-efforts`
- Incoming issues and PRs: `/cmk:triage` (user-run)
- Traceability check: the docs-only `cmk:traceability` skill — run by `cmk:evidence` and `cmk:release`;
  keep it clean
- Project docs (layer enabled, project pack): `/cmk:vision` maintains
  `docs/requirements/vision.md`, the `docs/design/` invariant spine, and
  `docs/requirements/guidelines.md`; the feature skills consult them

Repo config the skills read:

- verify commands, release steps, Remote environments: `docs/agents/project.md`
- cold-start drive (Launch / Doctor / Drive / Evidence): `docs/agents/verify.md`
- Team composition (roster, ownership notes, workflow band): `docs/agents/project.md` (`## Team`)
- Issue tracker operations: `docs/agents/issue-tracker.md`
- Triage label mapping: `docs/agents/triage-labels.md`
