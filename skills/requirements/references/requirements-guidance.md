# Requirements Guidance (Directive, Not a Form)

How to shape a requirements document. The narrative sections have no fixed
list: they take the shape the product needs, and a doc that fills sections it
has nothing to say in has failed as surely as one that omits what matters.
**Acceptance Criteria is the exception** — it is required, and so are the
`Notation:` and `ID prefix:` header lines it depends on. What follows is what
any strong requirements doc accomplishes, and the recurring patterns that get
it there.

- [What the document must accomplish](#what-the-document-must-accomplish)
- [Acceptance criteria](#acceptance-criteria) — the required section
  - [What one criterion is](#what-one-criterion-is)
  - [Choosing the notation](#choosing-the-notation) — `ears` vs `rfc2119`
  - [`ears`](#ears--one-trigger-one-behaviour-always-shall)
  - [`rfc2119`](#rfc2119--conformance-strength-per-statement)
- [Guarding existing behavior](#guarding-existing-behavior)
- [Locked decisions](#locked-decisions)
- [Technical products get technical requirements](#technical-products-get-technical-requirements)
- [Progressive disclosure](#progressive-disclosure)
- [Coherence](#coherence)

## What the document must accomplish

Whatever its shape, a reader must be able to extract:

- **The problem** — who has it, what it costs them, how they cope today.
- **Why now** — what changed that makes this the right time.
- **Success, measurably** — outcomes with targets and a way to measure them.
- **Scope, both ways** — what's in, and what's out with the reason for each
  exclusion.
- **Open points** — unresolved product decisions, stated as open rather than
  guessed at.

Optional when they earn their place: user scenarios grounding abstract needs,
risk/assumption tables with "what breaks if wrong," and business or timeline
constraints.

## Acceptance criteria

The sections above say what the product must achieve. Acceptance criteria say
it in statements a reader can check one at a time, in the document's own
`## Acceptance Criteria` section. Normative language is what lets a
requirements doc act as a contract instead of a mood.

### What one criterion is

One observable behaviour, one identifier, one grammar:

```
**<PREFIX>-<story>.<n>** <a single statement in this document's notation>
```

- **One behaviour.** A statement that needs "and" is usually two criteria.
  Split where a reader could accept one half and reject the other.
- **One identifier.** `<PREFIX>` is declared once in the header and is stable
  for the life of the document. Once status leaves `draft` an ID never changes
  meaning and is never renumbered — retire one by striking it through
  (`~~**BILL-1.2**~~ superseded by BILL-1.4`).
- **One grammar.** The whole section uses the notation named in the header. A
  trigger clause welded to a conformance modal — `WHEN the renewal fails, the
  system MUST retry` — is neither notation, and reads as neither.

### Choosing the notation

Declare it in the header (`**Notation:** ears` or `**Notation:** rfc2119`) and
write every criterion in it. Choose from what discovery already established,
not from taste:

| What discovery established | Notation |
|---|---|
| Someone outside this team writes an implementation against this document — a protocol, a wire format, a published API — and obligations differ in strength | `rfc2119` |
| The behaviour is observable by a user of the running system — a screen, a flow, a command, a state | `ears` |
| Neither is settled | Say so in `Open Points` and choose once it is. A notation picked before the audience is known gets rewritten. |

Local convention wins a tie, never a mismatch: a repo whose existing docs use
one notation keeps it for the same kind of product, and departs — saying why in
the header — when this document's audience differs from theirs.

### `ears` — one trigger, one behaviour, always SHALL

```
**AUTH-2.1** WHEN a user reloads the page with a valid refresh token
THE SYSTEM SHALL restore the session without showing the sign-in screen.

**AUTH-2.3** IF token refresh fails three times consecutively THEN THE SYSTEM
SHALL end the session and route to the sign-in screen with the reason shown.
```

Forms: `WHEN <event>` · `WHILE <state>` · `IF <unwanted condition> THEN` ·
`WHERE <feature is included>` · bare `THE SYSTEM SHALL` for an always-true
invariant. The subject is `THE SYSTEM`, the modal is `SHALL`, and no criterion
carries a second one.

### `rfc2119` — conformance strength per statement

```
**WIRE-3.1** A client MUST send `page_token` unchanged from the previous response.
**WIRE-3.2** A client SHOULD retry an `UNAVAILABLE` status with exponential backoff.
**WIRE-3.3** A client MAY omit the field mask.
```

**MUST** is required for conformance, **SHOULD** is the default unless a
documented tradeoff justifies deviation, **MAY** is optional. Define the three
once at the entry point. Downstream design docs may choose mechanisms but must
not weaken them — say so explicitly.

An `ears` document has no strength axis: every criterion is mandatory by
construction. A behaviour that would be `SHOULD` or `MAY` is not an acceptance
criterion — it is a design constraint (`docs/design/`) or an engineering rule
(`docs/rules/`).

## Guarding existing behavior

When Iterate (or Create that extends an existing surface) adds behavior beside
criteria that must keep working, write an explicit guard — do not rely on the
old criterion remaining "obviously" in force.

**EARS form:**

```
**<PREFIX>-<story>.<n>** (guard) WHEN <condition> THE SYSTEM SHALL CONTINUE TO
<existing observable behavior>.
```

**RFC 2119 form:** keep the existing MUST statement and add a companion that
the new behavior MUST NOT weaken it (or restate the MUST under the new
context). Prefer clarity over clever cross-references.

Rules:

- One guard per load-bearing existing behavior on the touched surface — not one
  vague "nothing else breaks" line.
- If a file or section has no behavior at risk, write an explicit
  `no behavior to guard` note in the change summary so the skip is visible.
- Guards carry ordinary IDs and stay in `## Acceptance Criteria`; they are not
  a separate informal list.

## Locked decisions

When product decisions accumulate, register them explicitly (numbered — D1,
D2, …) with a status line stating they are accepted and must not be silently
reopened. Open inputs can then be worked without re-litigating what's
settled; reversing a locked decision is a visible, deliberate act.

## Technical products get technical requirements

Requirements language is product language — and when the product is a
protocol, a platform, or a guarantee, the product language *is* technical.
Stating per-track guarantees, trust boundaries, and verifiability claims as
requirements is correct; prescribing the mechanism that delivers them is not.
The boundary is mechanism, not vocabulary.

## Progressive disclosure

A large product splits its requirements per product area or capability, with
a concise entry-point doc that indexes them: what each area covers and when
to read it. Readers — human or agent — load only the context the task needs.
Keep each area doc self-contained enough to be referenced as a unit; define
shared vocabulary once in the glossary (`cmk:glossary`) and link it rather
than redefining terms per doc.

## Coherence

Requirements sit upstream of design and decisions. Every doc names its
downstream design docs once they exist; a requirement change is checked
against them and cascaded, not committed in isolation. Cross-reference
related requirements docs (entry point ↔ area docs ↔ glossary) so the set
reads as one coherent contract.
