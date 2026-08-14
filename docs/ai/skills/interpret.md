# cmk:interpret

## What

User-invoked companion session beside a live `cmk:requirements` /
`cmk:design` / `cmk:delivery-spec-plan` window (or any parallel technical
discussion). The user pastes the other window's reply; the skill produces
an understanding pass, a committed stance, and — once they decide — an
English message to carry back.

## Approach

Gate-ish discipline, not create/iterate and not a delivery phase. An Iron
Law forbids manufacturing a choice on a paste that has none and
withholding a pick on a paste that has one. Setup always asks companion
language, delivery intent, lifecycle stage, and feedback wanted — cmk
has no `docs/agents/project.md` to reuse. Library facts go through ctx7 /
Context7, not a `research` skill. Criterion IDs freeze when status leaves
`draft`; only the feature's design doc cites them.

## Where

- Skill body: `skills/interpret/SKILL.md`
- End-of-session digest: `skills/interpret/references/digest.md`
- Pressure-test record: `skills/interpret/TESTS.md`
- Eval fixtures: `skills/interpret/eval.json`
