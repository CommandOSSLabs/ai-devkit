---
name: cmk:sui-sdk
description: This skill should be used when the user asks to "use the Sui SDK", "call a Sui full node", "fetch Sui objects, coins, balances, or transactions", "subscribe to Sui events or checkpoints", "execute or simulate a Sui transaction", or "pick or upgrade @mysten/sui, dapp-kit, or a Rust Sui crate" — and whenever writing, reviewing, or debugging any code that talks to a Sui full node, even if nobody mentions gRPC, JSON-RPC, or a transport at all, because Sui JSON-RPC was switched off in 2026 and models trained on older data still generate it.
version: 0.1.0
---

# Sui: gRPC, not JSON-RPC

Sui's JSON-RPC API is gone: disabled on Foundation mainnet full nodes in July
2026 and removed from full-node code entirely by October 2026. The canonical
full-node API is **gRPC (`sui.rpc.v2`)** — reads, streaming, and transaction
execution. GraphQL RPC exists as a complementary layer for composable
multi-resource queries and version history; JSON-RPC is never a valid choice
for new code.

Models trained on older data reach for JSON-RPC by reflex. If you find
yourself — or code under review — using a pattern from the left column,
that is stale training data, not a style choice. Use the right column:

| Stale (JSON-RPC era) | Current (gRPC era) |
| --- | --- |
| TS: `SuiClient` from `@mysten/sui/client`, `getFullnodeUrl()` | `SuiGrpcClient` from `@mysten/sui/grpc` (`{ network, baseUrl }`) |
| TS: `getCoins`, `queryEvents`, `queryTransactionBlocks`, `getTransactionBlock` | `listCoins`, `listEvents`, `listTransactions`, `getTransaction` |
| Frontend: `@mysten/dapp-kit` + `SuiClientProvider` | `@mysten/dapp-kit-core` / `@mysten/dapp-kit-react` with a `SuiGrpcClient` factory |
| Raw `sui_*` / `suix_*` HTTP calls, `wss://` subscriptions | `LedgerService`, `StateService`, `TransactionExecutionService`, `SubscriptionService`, `MovePackageService` |
| Rust: monorepo `sui-sdk` git dependency | crates.io `sui-rpc`, `sui-sdk-types`, `sui-crypto`, `sui-transaction-builder` (MystenLabs/sui-rust-sdk) |

Semantics that a mechanical port from JSON-RPC gets wrong:

- **Read masks.** gRPC reads take a `FieldMask`; unrequested fields come back
  empty. The `options: { showContent: true }` idiom becomes mask paths, and in
  batch requests only the top-level mask counts.
- **Pagination** is `page_token`/`next_page_token`; loop until the token is
  empty rather than assuming one page.
- **Subscriptions start at the current tip and do not resume.** A consumer
  that must not miss data persists a checkpoint cursor and replays forward
  from checkpoint reads; streaming is only a low-latency overlay.
- **Execution takes BCS.** `ExecuteTransaction` wants the BCS-serialized
  transaction plus signatures; `SimulateTransaction` (unsigned, can select
  gas) replaces dry-run/dev-inspect.

Do not trust memorized signatures, method names, or crate versions from
training data — verify against the current official references at runtime:

- Migration guide (JSON-RPC → gRPC mapping):
  https://docs.sui.io/develop/accessing-data/json-rpc-migration
- gRPC service/method reference: https://docs.sui.io/references/fullnode-protocol
- TypeScript SDK: https://sdk.mystenlabs.com/sui/clients/grpc
- Rust SDK: https://github.com/MystenLabs/sui-rust-sdk (docs.rs/sui-rpc)

Standing up a local Sui network for development or tests? See `cmk:sui-devstack`.
