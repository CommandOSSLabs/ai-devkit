# Error handling

Mechanics for the error-handling facet in `SKILL.md`.

## Three legitimate shapes — choose per type, state the choice

**Typed, propagated errors** — a `thiserror` enum, implementing `std::error::Error`, composed across layers with `#[from]` and `?`. Use this when callers need to match on *what* failed, not just display a message — the error crosses an API boundary another part of the system programs against.

```rust
#[derive(Debug, thiserror::Error)]
pub enum RuntimeError {
    #[error("database: {0}")]
    Database(#[from] sqlx::Error),
    #[error("posture rejected: {0}")]
    Posture(#[from] PostureError),
}

pub type Result<T> = std::result::Result<T, RuntimeError>;
```

**Boundary/opaque errors** — `anyhow::Result`, at the outermost edge of a binary (a `main`, a CLI command handler, an HTTP handler's top level) where a message gets logged or displayed and is never programmatically matched again. Converting a typed error into `anyhow` at this boundary is fine; converting it back the other way loses the structure a caller further out might have needed.

**Plain classification data** — a `#[derive(Debug, Clone, PartialEq)]` enum with no `Display`, no `std::error::Error` impl, consumed as data rather than propagated as failure (a policy decision, a rejection reason with an associated retry disposition). This is not a lesser error type — it's not an error type at all, and forcing it to implement `Error` just to satisfy a convention obscures that it was never meant to unwind a call stack.

A single crate legitimately using more than one shape (`thiserror` for its own typed errors, `anyhow` at its binary entry point) is deliberate layering, not inconsistency — the trap is a crate that picked a shape by habit rather than by what the error is actually for, or that lets `anyhow` leak past a boundary where a caller needed to match on failure kind.

## `.unwrap()` / `.expect()` outside tests

A bare `.unwrap()` on fallible I/O or parsing in non-test code asserts an invariant without stating it — the next reader has to reconstruct why it's safe. The one broadly legitimate production idiom is mutex-poison recovery, where the panic already means the program is in an unrecoverable state and the message documents that:

```rust
let guard = self.messages.lock().expect("chat store mutex poisoned");
```

Anywhere else, prefer propagating the error over asserting it can't happen — and if it genuinely can't, `.expect("<why>")` states the invariant instead of leaving it implicit.

## Never document secret-bearing errors by leaking the secret

An error's `Display` output often ends up in logs. An error type that wraps a credential, token, or key must be written (and tested) so its `Display` impl never includes the sensitive value — redact it in the `#[error(...)]` format string itself, not by convention at the call site, since every future call site would otherwise have to remember to redact by hand.
