# Result envelope (rfeat-1.0)

## Contents

- [Required fields](#required-fields-every-run)
- [Finding rows](#finding-rows)
- [Banner](#banner)
- [Forbidden](#forbidden-in-the-envelope)

## Required fields (every run)

```text
advisory: true
schema_version: "1"
recipe_id: "rfeat-1.0"
mode: changes-since-checkpoint | full | brownfield-bootstrap
base: <sha>
head: <sha>
checkpoint:
  previous: <sha|null>
  advanced_to: <sha|null>   # set only after active-shard index; null if not writable
owns_coverage:
  with_owns: <int>
  registered: <int>
  ratio: <float>
findings: [ FindingRow, … ]  # length ≤ FINDINGS_MAX (12); truncated flag if more
findings_truncated: <bool>
notes: []                    # reliability notes; no silent cap
```

## Finding rows

Each finding is exactly one `change_class`:

| change_class | When |
|---|---|
| `known-impact` | Changed path matches a Recognized feature's Files/surface-root prefix |
| `new-capability-candidate` | Behavior-bearing surface with no Recognized owner strong enough |
| `no-spec-impact` | Classification rule 4 only (docs/comment/internal rename, no contract file). Generated/vendor/lockfile are dropped (rule 1), not this class |
| `uncertain` | Behavior-bearing but ownership ambiguous — never treat as clean |

```text
change_class: known-impact | new-capability-candidate | no-spec-impact | uncertain
confidence: high | medium | low
codes: [ CODE, … ]           # Recognized only; empty for new-capability-candidate
observation_id: OBS-<6hex>|null   # required for new-capability-candidate; else optional
evidence:
  items: [ { kind, locator, status }, … ]  # length ≤ EVIDENCE_MAX (8)
  truncated: <bool>
disposition: pending | absorbed | dismissed | attested-no-impact
# This skill's run emits disposition: pending for new/reopened OBS and
# unresolved findings. absorbed / dismissed / attested-no-impact are overlay
# cleanup after human disposition in the calling session — not this run.
```

`OBS-<6hex>`: lowercase hex of the first 6 characters of
`sha256(utf8(join "\n" of sorted unique evidence locators))`. Never derive the
id from a guessed Feature CODE. Never emit `OBS-LABL`-style proto-CODEs.

## Banner

> Advisory reverse-track — not merge enforcement. Observations are not Feature
> CODEs. Unresolved `pending` candidates must be surfaced before framing or
> realigning the touched surfaces.

## Forbidden in the envelope

- Assigning or proposing a new Feature CODE as decided
- `Status: Approved` (or any requirements Status) derived from code
- `depends_on` / committed graph projections
- Treating `uncertain` as `no-spec-impact`
- Claiming the consuming repo gained CI, hooks, or tracked reconciler scripts
