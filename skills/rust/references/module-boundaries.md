# Module boundaries

Mechanics for the module-boundaries facet in `SKILL.md`.

## The crate is not the smallest unit of design

`cmk:project-layout` decides which crate a piece of code lives in. Inside that crate, `pub mod` boundaries should still mirror the design's own concepts — a domain concern per module (`intake`, `settlement`, `posture`), not an incidental grouping (`utils`, `helpers`, `common`) that accretes whatever didn't obviously belong elsewhere. A module named after what it collects, not what it owns, is a sign the design boundary that should have decided its shape never got drawn.

## Two legitimate public-surface conventions — pick one per crate

**Curated facade**: the crate root re-exports the types a consumer actually needs, and consumers import from the crate root rather than reaching into submodules.

```rust
pub mod error;
pub mod intake;
pub mod settlement;

pub use error::RuntimeError;
pub use intake::{IntakeRequest, IntakeOutcome};
pub use settlement::SettlementReceipt;
```

This gives the crate a stable, curated public API independent of its internal module layout — submodules can be split or merged without breaking consumers.

**Full module-path imports**: no re-export layer; consumers write `crate_name::module::Type` directly.

```rust
pub mod error;
pub mod intake;
pub mod settlement;
// no `pub use` block — module paths are the public API
```

This keeps the crate's structure and its API identical, which is cheaper to maintain for crates with many types or an internal layout that's expected to stay stable.

Both are legitimate. What isn't: mixing them within one crate, where some types are re-exported and others of equal importance are not, for no stated reason — a consumer then has to remember, per type, which path reaches it.

## Visibility: three tiers, use the middle one deliberately

`pub` (crosses the crate boundary), `pub(crate)` (visible anywhere in this crate, nowhere outside it), and private (visible in this module and its children only) are three different promises. Skipping straight from private to `pub` because a sibling module needs access — instead of using `pub(crate)` — overexposes the item to every external consumer of the crate, not just the one internal caller that needed it. Reach for `pub(crate)` first for anything that exists to serve another part of the same crate; promote to `pub` only when an external consumer genuinely needs it.

## When a module deserves promotion to its own crate

`cmk:project-layout`'s library-promotion rule (a module used by more than one role-area moves to a shared library) is the authority here — this skill only adds the intra-crate signal that usually precedes it: a module with its own independent test suite, its own error type nothing else in the crate constructs, and no dependency on its crate-mates' internals is already crate-shaped. Promotion is a placement decision (`cmk:project-layout`), not a Rust-mechanical one.
