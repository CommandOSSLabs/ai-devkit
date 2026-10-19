# System-docs consult recipe (one home)

**Load when:** a model-invoked skill consults optional Hybrid 1A system docs, or
suggests authoring them. Do **not** restate this recipe in full inside consumer
skills — point here and only add entry-specific applicability and paths.

## Authority (default single-file entries)

Unless the entry package defines a different **authority predicate**:

| State | Meaning |
|---|---|
| **Absent** | Canonical path missing |
| **Non-authoritative** | File present but `Status` ≠ `Approved`, or structural validator fails (includes external Draft) |
| **Approved** | `Status: Approved` **and** structural validator pass |

Validators live under `references/validators/<domain>/`.
Directory entries (e.g. `docs/decisions/`) use the entry package predicate, not a single Status header.

## Hard constraints outrank system docs

When planning or designing, these **outrank** any system doc:

1. Approved feature requirements / design for the work in flight  
2. Live `ARCH-N` invariants  
3. Standing project config already sourced by the skill (`docs/rules/common/` when present, else legacy guidelines fallback, else `docs/agents/project.md`)

On **conflict**: surface hard constraint vs doc rule; **preserve the hard constraint**;
suggest `/cmk:system-docs <entry-key>` to update the doc; never silently follow the doc.

## Consult behavior

**When Approved and the skill's applicability predicate holds:** load only the
artifact (or a bounded digest for the decision). Use it as standing guidance
within hard constraints.

**When Absent or Non-authoritative:** CONTINUE without failing solely for absence
(no-op / ARCH-2).

## Suggestion protocol

- **At most once per entry key per parent skill run**
- Name the exact action: `/cmk:system-docs <entry-key>`
- Explain why the artifact would help **now**
- Suppress further suggestions for that entry after decline for the rest of the run
- Persist defer only if the user supplies an explicit condition
- **NEVER auto-invoke** `cmk:system-docs` (user-invoked; ARCH-5)

## Red flags (consumers)

- Treating `proposal.md` or `.skills/system-docs/` ephemera as standing truth  
- Listing a skill as a catalog reader without a real consult hook  
- Skipping the red-capable loop because an ops runbook exists (root-cause)  
- Replacing `docs/agents/project.md` release commands with ops deployment narrative  
