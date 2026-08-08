# cmk:sui-devstack

## What
Teaches the worktree-safe selection layer `cmk:local-stack` prescribes on
top of Devstack, Mysten's tool for materializing a local Sui network (node,
accounts, published Move packages, optional Walrus) from a declarative
`devstack.config.ts`. Devstack's own CLI and plugin API stay authoritative
in Devstack's own docs — this skill covers only the repo-side conventions
layered on top.

## Approach
Maps `cmk:local-stack`'s `(worktree, config, instance)` primitive onto
Devstack's own naming: the worktree identity becomes Devstack's app name,
`<config>-<instance>` becomes the stack name, and the instance gets an
explicit root at `.local/devstack/<config>/<instance>/` with named `state/`
and `move-home/` children — never a shared, ambient home. There is no
single shared config: each e2e subject, benchmark, or dev topology owns its
own `devstack.config.ts` beside its tests. Join vs. select-distinct is
purely which instance name a caller passes in, never a separate mechanism.
Global-state prohibitions: never read or write `~/.sui` or `~/.move`, never
source another worktree's state, never wipe anything but the one explicitly
selected instance.

## Where
- Skill body: `skills/sui-devstack/SKILL.md` — sections What Devstack
  provides, The worktree-safe selection layer, Configs are package-owned,
  Join vs. select-distinct is instance naming nothing more, Global-state
  prohibitions.
- `references/config-authoring.md` — account-funding hygiene, cross-process
  key handling, local Move package staging, publish-on-drift guard shape.
- `references/instance-isolation.md` — the selection helper's three inputs,
  validation rules, and re-validation-at-boot requirement.

## Links
Layers on `cmk:local-stack`'s `(worktree, config, instance)` primitive;
transaction- and client-level guidance is `cmk:sui-sdk`'s job, not this
skill's.
