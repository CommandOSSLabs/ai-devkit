# Pulumi binding

Pulumi-specific mechanics for the principles in `SKILL.md`. Everything here
is Pulumi vocabulary; the isolation, environment, and ownership rules
themselves live in the skill body and apply the same way to any IaC tool.

## Stack-per-environment files

Each package keeps one `Pulumi.<env>.yaml` per environment, matching the
skill's environment vocabulary exactly: `Pulumi.production.yaml`,
`Pulumi.staging.yaml`, `Pulumi.dev.yaml`, `Pulumi.canary.yaml`. An ephemeral
per-effort stack gets its own generated stack name and config file at
creation time (`pulumi stack init <effort-name>`) and is destroyed with the
stack when the effort closes — it does not get a permanent checked-in file
alongside the four standing ones.

## Program layout

One package, one Pulumi program: a single entry point (`index.ts` or the
equivalent for the program's language) per package, not per environment —
the entry point is generic, and `Pulumi.<env>.yaml` supplies what varies.
Read environment-specific values through `pulumi.Config`, never through
hand-rolled branching on an environment-name string inside the program body.

Cross-package code imports are exactly the coupling the isolation rule
forbids: a program must not import another package's modules to reach into
its resources. When one package's output is a genuine input to another
(a shared network ID, a bucket ARN), consume it through a **stack
reference** (`new pulumi.StackReference(...)`), which reads the producing
stack's exported outputs without importing its code.

## State backend and secrets provider

Both are per-repo decisions with a real trade-off, not a default to copy
blindly:

- **State backend** — a managed backend (Pulumi's hosted service or
  equivalent) trades a per-seat/usage cost for built-in locking, history, and
  no self-hosted maintenance; a self-hosted backend (object storage plus a
  lock mechanism) trades that convenience for full control over where state
  lives and who can reach it. Pick one and record the choice and its
  rationale in `docs/rules/` or the repo's infra documentation — do not leave
  it implicit in whichever backend happened to get configured first.
- **Secrets provider** — a cloud provider's key-management service ties
  secret encryption to the same account/IAM boundary as the resources
  themselves, at the cost of a provider dependency; a passphrase-based
  provider has no such dependency but pushes passphrase distribution and
  rotation onto the team. Either is acceptable; state which one and why.

## Config vs. secret split

Every value in a `Pulumi.<env>.yaml` file is either plain config or a secret,
never a plaintext stand-in for one:

- Non-secret config (region, instance sizing, feature flags, resource names)
  lives directly in the stack file as plain values.
- Anything that grants access or proves identity (API keys, connection
  strings with embedded credentials, private keys) is set through
  `pulumi config set --secret`, which encrypts it via the configured secrets
  provider before it ever touches the checked-in file.
- Never place a secret value in a stack file unencrypted "temporarily" — the
  file is tracked, and a plaintext secret in history outlives the intent to
  remove it later.
