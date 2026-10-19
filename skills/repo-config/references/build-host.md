# Build host recipe

Load this file **only when Decision N (Build host) is offered**.

Explainer: `cmk:delivery-remote` can run an approved `tasks.md` on a **remote machine
you own** instead of this one — under whichever agent CLI that machine runs —
and bring the branch back, or open the pull request from there. It reads
`docs/agents/host-build.md`. When that file is absent nothing changes: `cmk:delivery-spec-plan`
does not offer the option, and no skill mentions a host.

**Recommend skip.** There is no shared or default build host. Offering this to
someone who does not already have a second machine set up costs them a
provisioning session for a capability they cannot use yet. Offer it only when
the user says they have a host, or asks for one.

## What to confirm, when the user wants it

The values below go in the manifest; the schema and every setup command live in
the `cmk:delivery-remote` skill's `host-provisioning.md`, which is where you send the
user to actually stand the host up. Do not duplicate those steps here.

- **Reachability** — the ssh alias, plus fallbacks in preference order. Prefer
  an alias that resolves off the local network.
- **Default agent** — which CLI runs there. It must have a row in
  `cmk:delivery-remote`'s `runner-drivers.md`, and be logged in on that machine.
- **Run root** — where clones and worktrees live on the host.
- **Concurrency** — how many runs may share the machine, plus the port base and
  block size the slots carve.
- **Install and verify commands** — the repo's own, exactly as decision C
  recorded them.
- **Per-run movables** — the compose files this repo uses (`[]` when none), and
  the environment variable names that carry ports. A repo declaring neither can
  only run one build at a time on the host; record that rather than guess.
- **Env files** — names only, and only the ones that must travel.
- **Return mode** — `fetch` brings the branch back to this machine; `pr` has the
  host push and open the pull request with a credential of its own.

Never write a token, a password, or an env **value** into the manifest — it is a
committed file. `cmk:delivery-remote`'s `return-leg.md` owns where the credential goes.

Write step (Step 4, item 13): if decision N was confirmed, write
`docs/agents/host-build.md` from the schema in `cmk:delivery-remote`'s
`host-provisioning.md`. If skipped, write nothing — an absent file is the off
switch, and an empty one would read as a misconfigured host.

**Done when:** the manifest is written and the host answers its preflight, or
the decision is explicitly skipped and no `docs/agents/host-build.md` exists.
