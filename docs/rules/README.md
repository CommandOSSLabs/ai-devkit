# Rules

Engineering standards: the conventions code in this repository is expected to
follow.

## Conventions

- Shared, language-agnostic standards live in [`common/`](./common/).
- Language and framework standards live in `rules/<language>/` and
  `rules/<framework>/`; add a folder only when it is actively used.
- One topic per file, `kebab-case`, written as actionable rules rather than
  advice.
- A narrower rule overrides a broader one; say so explicitly where it does.

## When to read

Before writing or reviewing code — start with `common/`, then the language or
framework folder that applies.
