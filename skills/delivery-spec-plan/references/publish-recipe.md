# Publish recipe (Step 5)

1. Read `docs/agents/issue-tracker.md`. Resolve **Publish unit** with this
   order (first match wins):
   - **`tasks`** only if the file sets `**Publish unit:** tasks`, **or** the
     user in this session explicitly orders per-task issues;
   - else **`feature`** (default when the field is absent or set to `feature`).
   Do not derive `tasks` from plan size, wave count, or "agents need tickets".
2. IF create/publish is blocked (no auth, permission denied, role cannot open
   issues) → report the failure, leave the plan intact, **skip** remote create;
   do not open N task issues as a fallback.
3. Resolve **reader reach** with one pass: `git check-ignore -q <path to this
   tasks.md>`. Exit 0 → **private**: the specs are git-ignored, so the people
   reading the tracker cannot open them. Otherwise → **shared**.
4. **WHEN unit is `feature`:** one issue per plan. When the operator named the feature's
   ticket, or `.skills/<CODE>/` records one, that ticket **is** the issue: update its
   title, body and labels in place, and create nothing. Otherwise create **exactly one**
   issue:
   - **Title:** shared → `[CODE] <feature outcome>`; private →
     `<feature outcome>`. Same sense as the plan Goal either way.
   - **Body** (behavior and interfaces, never file paths):
     - first line: `> *This issue was drafted by AI with \`cmk:delivery-spec-plan\`.*`
     - What ships (end-to-end), high-level acceptance
     - shared only: `Requirements covered:` — **union** of every task footer ID
     - shared only: `Plan:` path to this `tasks.md`
     - shared only: `Roadmap:` `ROAD-N` / `MILE-N` when INDEX binds them
     - Optional: task checklist as plain markdown (not tracker issues), each
       item its task title alone
   - Private means every line reads whole to someone holding only the tracker
     and the code. Measured: with `docs/specs/` ignored, 3/3 issues still sent
     `[QUOTA]`, `Requirements covered: QUOTA-1.1 … QUOTA-2.2` and `Plan:
     docs/specs/…/tasks.md` to a tech lead who assigns work from Linear and
     can open none of them. The acceptance lines already carry that meaning.
   - Label only this issue with the frontier role (`ready-for-agent` mapped
     string) when it is grabbable. Remove its current state role (`shaping`,
     `needs-triage`) in the same edit: a ticket carries one state role. Two of three
     baseline publishes onto #23 added `ready-for-agent` beside `status:shaping`, and the
     board read it as both being shaped and ready.
   - Record the issue id under `.skills/<CODE>/` for execute / `cmk:delivery-ship`.
     That record is where the ID ↔ issue trace lives when reach is private.
5. **WHEN unit is `tasks` (legacy only):** one issue per plan task in dependency
   order, each with its own `Requirements covered:` from that task's footer
   (shared only, as in step 4); record all ids under `.skills/<CODE>/`. Still no
   silent invent of this unit.

Work that never went through the triad uses `/cmk:discover-efforts` (multi-slice) —
do not re-file this plan there, and do not re-split a triad plan into
cmk:discover-efforts's references/publish.md slices under unit `feature`.
