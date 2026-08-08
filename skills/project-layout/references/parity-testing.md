# Parity testing

## What a parity package pins

A cross-language parity package exists when the same wire format,
serialization, or protocol must produce byte-identical (or otherwise
strictly equivalent) output from more than one language implementation. The
package holds a shared set of **golden vectors** — fixed input/output
fixture pairs — that every language-side renderer must reproduce exactly.

## What it owns

- **Golden vectors**: the fixture data itself, checked in as the single
  source of truth for what "correct" output looks like across every
  implementation.
- **Renderers**: one per language side, each taking the same fixture input
  and producing output compared against the pinned vector.
- **A stale-fixture check**: a test (or CI gate) that fails when the vectors
  and the renderers have drifted apart — for example, a renderer changed its
  output shape but nobody regenerated the vectors, or a vector was
  hand-edited without any renderer able to reproduce it. This check is what
  turns drift into a build failure instead of a silent divergence discovered
  in production.

## Where it lives

`tests/parity/` (a private test package, not a shared library) is the
conventional location: it is private because its only purpose is proving
cross-language equivalence for its own repo, and it is a test package
because it owns its own runtime configuration rather than inheriting one
from any product package it tests.

## The update discipline

A wire/serialization format change is never partial. The same change that
alters the format also: regenerates or hand-updates every golden vector,
updates every language-side renderer to match, and leaves every golden test
green before merge. Landing a format change in only one language's
renderer — or updating vectors without updating a renderer — is exactly the
drift the stale-fixture check exists to catch; treat a failure there as a
correctness bug, not a flake to retry.

## Example

A protocol with a Rust implementation and a TypeScript implementation shares
one JSON-encoded message schema. `tests/parity/` holds vector files (e.g.
`vectors/message-v1.json`), a Rust renderer that deserializes and
re-serializes each vector and diffs the result, and a TypeScript renderer
doing the same. Both renderers run against the same vector files, so a
change to the schema that isn't reflected in both languages fails
immediately instead of silently compounding.
