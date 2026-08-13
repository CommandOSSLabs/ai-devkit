# Enclave / nautilus

Application of `cmk:enclave` on **AWS Nitro Enclaves** and the Mysten
**Nautilus** adapter stack. Read the roof first. This facet names the
AWS surfaces; it does not fork the planes.

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

Co-located seats bind the label per `references/secrets.md`. On Nitro
that bind is **both** KMS `EncryptionContext` and bulk AAD. Distinct
images (party vs authority) get distinct CMKs and PCR bags.

## Seal is part of image publish

Generic seal-as-publish rules are `references/secrets.md`. Here:

1. Build the EIF; read `nitro.pcrs`.
2. Pin that bag on the role's config-sealing policy.
3. Seal every label that image will unwrap.
4. Then converge the parent / association.

Host `ExecStartPost` push is not the product contract — the principal
pulls, per the roof.

## Local profile

Same package shape (`cmk:local-stack`). An attested profile that
cannot present NSM evidence fails closed — never falls back to the
local unwrap.

## Verify

Report-only — never mutate:

- Parent IAM: `s3:GetObject` on envelopes; `kms:Decrypt` only as
  KMS gateway with `Recipient`; no Decrypt-to-self on custody keys.
- Each role's config-sealing CMK policy names that role's PCR bag.
- Seal wraps a DEK; bulk is AEAD-bound to the principal label.
- Secrets Manager ARNs are seal inputs, not enclave runtime calls.
- Publish order is pin-PCRs → seal → converge.
