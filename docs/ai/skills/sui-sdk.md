# cmk:sui-sdk

## What
Corrective knowledge skill: the canonical Sui full-node API is gRPC
(`sui.rpc.v2`), not JSON-RPC — JSON-RPC was disabled on Foundation mainnet
full nodes in July 2026 and removed from full-node code by October 2026.
Guards against a model trained on older data reaching for JSON-RPC by
reflex, even when nobody names a transport at all.

## Approach
A stale-vs-current mapping table covers the TypeScript client
(`SuiGrpcClient` from `@mysten/sui/grpc`), method renames (`listCoins`,
`listEvents`, `listTransactions`, `getTransaction`), the dapp-kit-core /
dapp-kit-react frontend split, the gRPC service names, and the crates.io
Rust crates (`sui-rpc`, `sui-sdk-types`, `sui-crypto`,
`sui-transaction-builder`) that replace the monorepo `sui-sdk` git
dependency. Calls out four semantics a mechanical port gets wrong: read
field masks, page-token pagination, subscriptions that start at the tip and
don't resume, and BCS-serialized transaction execution. Points at the live
official migration guide, gRPC reference, and SDK docs rather than trusting
memorized signatures, since those are exactly what goes stale.

## Where
- Skill body: `skills/sui-sdk/SKILL.md` — single file, no `references/`
  directory: the stale/current table, the semantics list, and the official
  reference links are the whole skill.

## Links
Hands off to `cmk:sui-devstack` for standing up a local Sui network for
development or tests.
