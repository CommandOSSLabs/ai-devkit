---
name: cmk:enclave-secrets
description: This skill should be used when the user asks to "seal secrets into an enclave", "pack env into a TEE", "don't bake secrets into the EIF", "attestation-gated unwrap", "vendored enclave config", or needs to design how operator secrets reach a measured enclave without entering the image.
version: 0.1.0
---

# Enclave secrets

Pack operator secrets and runtime env into a **vendored enclave** so the
measured image stays secret-free and only the attested principal can
unwrap them. Vendor-neutral: Nitro, other TEEs, and any adapter a repo
vendors under that name. AWS Nitro / Nautilus mechanics are `cmk:nautilus`.

## Modes

**Init** (default) — name the image, the unwrap authority, the at-rest
store, and the seal step that binds current measurements.

**Update** — add a principal, a secret, or a new image revision; re-seal
under the new measurements before the new image is forced live.

**Verify** — report-only against `## Verify`; never mutates.

## Three planes

| Plane | Holds | Must not hold |
|---|---|---|
| **Measured image** | code, roots, layout | operator secrets, env plaintext, key material |
| **Host / parent** | transport, fetch, commodity TLS | plaintext secrets, unwrap capability on the custody key |
| **Attested principal** | unwrap + use | a second copy of the secret on the host |

The host is availability and transport. It is not the trusted computing
base for the secret. A parent that can `Decrypt` the custody key is a
broken design, not a convenience.

## The package, not the env file

Secrets travel as a **sealed package**: ciphertext plus enough public
metadata to fetch and bind it (key id, principal label, measurements).
An `.env` copied into the image, user-data, or a host unit is not a
package. The principal pulls the package at start (and at every
provision that commits a new digest) through one code path; the host
does not push plaintext as a unit-activation side effect.

Local, unattested, and attested profiles compose the same package.
Only the unwrap evidence changes. A local materialization that skips
the package and reads raw env is a forked path
(`cmk:infra`, `cmk:local-stack`).

## Attestation-gated unwrap

Unwrap is allowed only when the caller presents evidence the image
measurements (and any required principal binding) match the policy on
the secrets-manager key. KMS, a vault transit key, or an HSM are
instances of that class. The operator's **encrypt** window lands on a
**config-sealing** key, never on the enclave's long-lived custody
root.

When several principals share measurements (co-located seats on one
image), bind the package to a public principal label at wrap time
*and* as AEAD additional data. That is **binding**, not access
control: it fails closed on mis-route; it does not stop a peer that
deliberately presents a sibling label.

## Seal is part of publish

Seal after the image that will unwrap is built and its measurements
are known. Pin those measurements on the key policy, then encrypt.
Forcing a new image live under ciphertext sealed to the previous
measurements is a closed failure, not a rollout.

Re-sealing does not rewrite an already-admitted execution. A new
package gets a new digest; admission is the no-swap guard.

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
- Unwrap requires current image measurements (and principal binding
  when principals share measurements).
- Seal runs against the measurements of the image about to go live.
- Local / unattested / attested consume the same package shape.
- Operator encrypt cannot land on the enclave custody trust root.
