---
name: cmk:nautilus
description: This skill should be used when the user asks to "set up Nautilus", "Nitro enclave secrets", "AWS KMS PCR policy", "attested Decrypt", "parent proxy KMS gateway", "seal seat config", or is applying enclave secret delivery on AWS Nitro or Mysten Nautilus.
version: 0.1.0
---

# Nautilus (AWS Nitro)

Application of `cmk:enclave-secrets` on **AWS Nitro Enclaves** and the
Mysten **Nautilus** adapter stack. Read that skill first. This one
names the AWS surfaces; it does not fork the planes.

## Modes

**Init** — stand up per-role config-sealing CMKs, the ciphertext store,
the parent KMS gateway, and the seal script.

**Update** — new image revision or principal: pin PCRs, re-seal, then
converge the parent. Do not force association on ciphertext sealed to
the previous PCR bag.

**Verify** — report-only against `## Verify`.

## Map onto the three planes

| Plane | Nitro / Nautilus surface |
|---|---|
| Measured image | EIF; PCR0–PCR2 (and role-specific PCR bags) |
| Host / parent | EC2 parent + vsock; parent proxy `attested-kms` gateway; instance role |
| Attested principal | Enclave; NSM attestation document; in-enclave unwrap |

TLS to AWS stays **out of the measured image**. The parent holds
`kms:Decrypt` *as a gateway*: it attaches the enclave-supplied
attestation document as `Recipient` (`RSAES_OAEP_SHA_256`) and returns
`CiphertextForRecipient` unaltered. The parent never logs that blob
and never decrypts to its own key.

## KMS is the unwrap authority

Config-sealing CMKs are **per principal** (or per role when roles have
distinct images). Key policy admits:

- operator `kms:Encrypt` on the **config-sealing** alias only
- enclave `Decrypt` only when the recipient document's PCR bag matches
  that principal's published measurements **and** any required
  `EncryptionContext` (for example `seat=<label>`)

Never grant operator Encrypt, or parent Decrypt-to-self, on the
enclave custody root (`realKey` / party keys).

AWS **Secrets Manager** is an operator-side store for seal **inputs**
(database URLs, sponsor material). The enclave does not call
`GetSecretValue`. Seal reads the secret, rewrites any in-enclave view
(TLS flags, in-image CA path), and writes only the attested envelope.
The live Secrets Manager value stays untouched.

## Envelope, not a 4 KiB secret

`kms:Encrypt` plaintext is capped at 4 KiB. Seal an ephemeral
AES-256-GCM DEK over the bulk package (AAD = the principal label) and
wrap only the 32-byte DEK with KMS. Store `{key_id, label,
wrapped_dek, bulk}` as ciphertext in object storage the parent can
`GetObject`. Missing or malformed envelopes fail the fetch; no silent
skip.

Co-located principals that share PCR0–PCR2 bind the label in
**both** KMS `EncryptionContext` and bulk AAD. Shared measurements
mean a sibling that forges the label still unwraps — binding, not
isolation. Distinct images (party vs authority) get distinct CMKs and
PCR bags.

## Seal is part of image publish

1. Build the EIF; read `nitro.pcrs`.
2. Pin that bag on the role's config-sealing policy.
3. Seal every label that image will unwrap.
4. Then converge the parent / association.

Re-uploading an envelope does not change an already-admitted
execution. A new package is a new digest; admission refuses a
mid-execution swap.

The principal **pulls** the envelope at boot and at every provision
activation on one code path. Host `ExecStartPost` push is not the
product contract.

## Local profile

The same envelope shape materializes on the worktree-local stack
without Nitro evidence (`cmk:local-stack`). Do not invent a raw-env
path beside it. An attested profile that cannot present NSM evidence
fails closed — never falls back to the local unwrap.

## Verify

Report-only — never mutate:

- EIF build context has no operator secret or env plaintext.
- Parent IAM: `s3:GetObject` on envelopes; `kms:Decrypt` only as
  KMS gateway with `Recipient`; no Decrypt-to-self on custody keys.
- Each role's config-sealing CMK policy names that role's PCR bag.
- Seal wraps a DEK; bulk is AEAD-bound to the principal label.
- Secrets Manager ARNs are seal inputs, not enclave runtime calls.
- Publish order is pin-PCRs → seal → converge.
- Local / unattested / Nitro consume the same package shape.
