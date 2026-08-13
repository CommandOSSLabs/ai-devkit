# Enclave / secrets

Pack operator secrets and runtime env so only the attested principal
can unwrap them. Vendor-neutral: Nitro, other TEEs, and any adapter a
repo vendors under that name. The three planes live in the roof
(`cmk:enclave`). AWS Nitro / Nautilus mechanics are
`references/nautilus.md`.

## The package, not the env file

An `.env` copied into the image, user-data, or a host unit is not a
package. The package is ciphertext plus public metadata (key id,
principal label, measurements) so the host can fetch it and the
principal can bind it. The principal pulls the package at start and
at every provision that commits a new digest; the host does not push
plaintext as a unit-activation side effect.

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

## Verify

Report-only — never mutate:

- Unwrap requires current image measurements (and principal binding
  when principals share measurements).
- Seal runs against the measurements of the image about to go live.
- Operator encrypt cannot land on the enclave custody trust root.
