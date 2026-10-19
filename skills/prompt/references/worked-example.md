# Worked example — full four-card run

Referenced from `SKILL.md` § Worked example. Extracted here only to hold the line count down;
the compact version inline names every part in the same order.

Four cards in on `exports are broken for some customers, can you sort it out` — error information
first, then target identity, then boundary; the done signal came back unresolved and stayed that
way:

```
Empty CSV files are written for accounts whose export runs after a plan downgrade.

What this touches
- src/export/job.ts (runExport)                    [confirmed]
- src/export/query.ts (buildRowQuery)              [confirmed]
- the plan-downgrade path that reaches them        [unconfirmed]

Off limits
- src/export/schedule.ts
- the S3 bucket lifecycle rules
Must keep working
- scheduled nightly exports for active plans
- the existing ExportCompleted webhook payload shape

What is already known
- "wrote 0 rows, uploaded 214 B" — apps/api/logs, request id 8f2c-4b11; 2026-08-24
- Repro: npm run export:local -- --account=acct_downgraded_fixture

Not yet checked
- That the downgrade is the cause. Three of four reports share it; the fourth had no plan change

Open — ask me, do not assume
- Whether an empty result should fail loudly or upload a header-only file

Done when
- The downgraded-account fixture stops uploading an empty file, and npm test is green
```

Read what it does *not* say: no lane, no step, and no claim that this is a bug — only that
something is reported as misbehaving and here is the evidence. The suspected cause sits under
*Not yet checked*, and the one fork the user could not close stays open instead of being decided
for them.
