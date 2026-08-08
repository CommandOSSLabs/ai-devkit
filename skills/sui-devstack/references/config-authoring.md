# Authoring a devstack.config.ts

Patterns for writing one package's Devstack config well, illustrated with a
neutral example: an e2e suite for a `counter` Move package.

## Keep the config package-local

Place `devstack.config.ts`, the test runner's config, and a package-local
global setup module beside the e2e suite that owns them — not in a shared
top-level location. Each subject (an e2e test group, a benchmark, a day-to-day
dev topology) declares only the services, accounts, and packages it needs. A
custom global setup should replace whatever generic one the test runner or
Devstack's own integration would otherwise generate, since a generated default
setup module typically exports a helper without registering the lifecycle
hooks a package-local setup needs to hook into.

## Ephemeral accounts, one per concurrent scenario

Declare every test signer as an ephemeral account scoped to the config, and
give **each concurrent scenario its own account** rather than sharing one
across scenarios that may run in parallel. A shared address under parallel
execution means interleaved balances and gas objects that get spent at a
version another scenario already consumed — an intermittent, hard-to-reproduce
failure that looks like a race in the code under test but is actually a
fixture-sharing bug in the config. Pre-fund only the accounts that actually
need gas up front (a funding source, a sponsor account); leave every other
signer unfunded until the scenario funds it explicitly.

## Pass key paths, never key contents, across processes

When a second process (a different language runtime, a bridge test) needs to
act as one of the config's accounts, hand it the **absolute path** to that
account's key material — derived beneath the instance's own state root — never
the key's raw contents inline in an environment variable, argument, or log
line. This keeps key material from ending up somewhere it can be captured
incidentally (shell history, CI logs, process listings) and keeps the acting
process reading the same file the config wrote rather than a stale copy.

## Persist a publisher key only when identity must be permanent

Most publishers can be fresh ephemeral accounts recreated per instance. Persist
a publisher's key across restarts of the same instance only when a
capability minted at publish time is permanently bound to that specific
address — for example, an admin capability object that is `key`-only and
therefore mintable only once, by whoever published the package. In that case,
write the key file once, beside the instance's other persisted key material,
and reuse it on every subsequent start of that instance; a fresh key each
start would mean a fresh, unrecoverable admin identity every time.

## Local Move package staging

To publish a local Move package into an instance:

1. Copy the package's sources into a staging directory under the instance's
   state root (excluding VCS metadata, build artifacts, and any prior lock or
   publish-record file), so publication never mutates the checked-out source
   tree.
2. If one staged package depends on another staged package (a `counter`
   package depending on a shared `registry` package, say), patch the
   dependent's manifest to point its local dependency path at the *staged*
   copy of the dependency, not the original source location.
3. After the dependency publishes, rewrite the dependent's manifest with the
   dependency's on-chain package id (a `published-at` field or equivalent) so
   the dependent package builds and publishes against the address that
   actually exists on this instance's chain, not a placeholder.

## Publish-on-drift guard

When an instance persists published-package records across restarts, guard
against silently serving stale bytecode: record a digest of the source tree
behind each publication at publish time, and on a later start that would
otherwise reuse the existing chain, compare the current source digest against
the recorded one. Refuse to start (with an explicit error naming the package
and both digests) if they differ, rather than silently continuing to serve a
chain built from Move sources that no longer match the working tree.

Give the guard exactly two escape hatches, both explicit:

- **Reset** — wipe the instance (see `references/instance-isolation.md`) and
  let a cold start publish the current working tree fresh.
- **One-time adopt** — an explicit opt-in flag that records the current
  working tree as matching an instance that has no publish record at all
  (created before this guard existed, or migrated from elsewhere). This
  escape hatch is accepted only while no record exists yet; once a record
  exists, a genuine source change must go through reset, not another adopt.
