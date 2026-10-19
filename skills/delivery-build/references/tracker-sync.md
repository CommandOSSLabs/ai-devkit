# Issue tracker sync

Loaded from `SKILL.md` **Session preflight** question 1, only when
`docs/agents/issue-tracker.md` names a configured tracker.

Read `docs/agents/issue-tracker.md` when present. IF a tracker is configured
(github / gitlab / linear / local / other named backend), resolve the tickets this build
delivers: one the operator named, one the branch name carries, or the feature issue
the plan was published as.

- **A ticket resolved:** the build syncs with it, and you do not ask. Write each ID to
  `.skills/<CODE>/tickets.md`. Implementer briefs and `cmk:delivery-ship` read that file.
  Then **claim** each ticket with the tracker's wayfinding ops, before any dispatch.
  Assign it to the session's tracker user. In the same edit, swap its state role for
  `building`, using the label mapped in `docs/agents/triage-labels.md`. If `building` has
  no mapped label, comment "Building on `<branch>`" instead, and name the missing role in
  the close report.
- **None resolved:** ask whether this build should sync, and take a short list of IDs. No
  answer, or no → empty ticket set; continue.

Three baseline builds of #23 ran with Lan naming it in her request. All three left it
`ready-for-agent` and unassigned through the build and the PR, so the board offered a
ticket that was being built as free to take. One run explained: "Tracker sync: declined,
so the ticket set is empty."
