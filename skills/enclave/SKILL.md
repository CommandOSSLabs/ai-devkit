---
name: cmk:enclave
description: Use when the user asks to "seal secrets into an enclave", "pack env into a TEE", "don't bake secrets into the EIF", "attestation-gated unwrap", "vendored enclave config", "set up Nautilus", "Nitro enclave secrets", "AWS KMS PCR policy", "attested Decrypt", "parent proxy KMS gateway", "seal seat config", or needs the attested boundary between a measured image, its host, and the principal that unwraps secrets.
version: 0.2.2
---

# Enclave

The attested boundary for a **vendored enclave**: three planes, one
package shape, vendor-neutral until a facet names a TEE. Secrets never
enter the measured image. Local, unattested, and attested profiles
compose the same production-ready path.

## Facets

Topic structure under one roof. Load this file first; open a facet
when the task is packing or a named TEE. Facets are not sibling
topics.

| Facet | File | Owns |
|---|---|---|
| **Boundary** | this file | planes; how the topic composes with infra, CI, local stack |
| **Secrets** | `references/secrets.md` | packing operator secrets and runtime env |
| **Nautilus** | `references/nautilus.md` | AWS Nitro / Mysten Nautilus application |

A later TEE joins as another facet, not a second roof.

## Modes

**Init** (default) — name the image, the unwrap authority, the at-rest
store, and the seal step that binds current measurements.

**Update** — add a principal, a secret, or a new image revision; re-seal
under the new measurements before the new image is forced live.

**Verify** — report-only against `## Verify` here and in the opened
facet; never mutates.

## Three planes

| Plane | Holds | Must not hold |
|---|---|---|
| **Measured image** | code, roots, layout | operator secrets, env plaintext, key material |
| **Host / parent** | transport, fetch, commodity TLS | plaintext secrets, unwrap capability on the custody key |
| **Attested principal** | unwrap + use | a second copy of the secret on the host |

The host is availability and transport. It is not the trusted computing
base for the secret. A parent that can `Decrypt` the custody key is a
broken design, not a convenience.

## One package, every profile

Secrets travel as a **sealed package**: ciphertext plus enough public
metadata to fetch and bind it. An `.env` copied into the image,
user-data, or a host unit is not a package. The principal pulls the
package at start (and at every provision that commits a new digest)
through one code path.

Local, unattested, and attested profiles compose the same package.
Only the unwrap evidence changes. A local materialization that skips
the package and reads raw env is a forked path.

## How this composes

Keep the tails. Do not restate this skill inside its peers.

- `cmk:infra` names environments and IaC packages. When a stack has an
  attested boundary, this skill owns that boundary.
- `cmk:cicd` composes the host-runnable scripts that build, seal, and
  publish. A GitHub-only seal step is unfinished.
- `cmk:local-stack` materializes the same package without TEE
  evidence. It does not invent a raw-env path.
- `cmk:design` specifies the planes once; environment differences stay
  at composition surfaces.

The no-shortcut rule in `cmk:delivery-pipeline`'s engineering
principles applies here: do not ship a local-only unwrap, a parent
Decrypt-to-self, or a "seal later" image env.

## What a project owns

Which TEE, which secrets-manager product, principal labels, where
ciphertext rests, and the operator seal script. This skill owns the
planes, the package, and the fail-closed rules.

## Verify

Report-only — never mutate:

- The measured image build context contains no operator secret or env
  plaintext.
- The host role can fetch ciphertext and cannot unwrap the custody or
  config-sealing key as itself.
- Local / unattested / attested consume the same package shape.
- Opened facets pass their own `## Verify` lists.
