# Requirements: <Feature Name>

Feature code: <CODE>
Status: Draft
Date: <YYYY-MM-DD>
Notation: ears

<!--
Rules:
- Feature code: 2-12 chars, A-Z0-9, starts with a letter, unique repo-wide.
  Register it in docs/specs/INDEX.md before use.
- Every acceptance criterion gets a hierarchical ID: <CODE>-<story>.<criterion>.
- Notation: ears unless outside implementers build against this document with
  obligations of different strength — then rfc2119 (MUST / SHOULD / MAY).
- With ears, criteria use EARS phrasing:
    WHEN <event/condition> THE SYSTEM SHALL <behavior>          (event-driven)
    WHILE <state> THE SYSTEM SHALL <behavior>                   (state-driven)
    IF <unwanted condition> THEN THE SYSTEM SHALL <behavior>    (unwanted behavior)
    WHERE <feature is included> THE SYSTEM SHALL <behavior>     (optional feature)
    THE SYSTEM SHALL <behavior>                                 (ubiquitous)
- Guard requirements protect existing behavior this feature touches:
    WHEN <condition> THE SYSTEM SHALL CONTINUE TO <existing behavior>
- IDs are immutable once Status is Approved. Retire a requirement by striking it
  through (~~**CODE-N.M**~~ reason) — never renumber.
-->

## 1. <Story title>

**Story:** As a <actor>, I want <capability>, so that <benefit>.

- **<CODE>-1.1** WHEN <event> THE SYSTEM SHALL <behavior>.
- **<CODE>-1.2** IF <unwanted condition> THEN THE SYSTEM SHALL <behavior>.

## 2. <Story title>

**Story:** ...

- **<CODE>-2.1** ...
- **<CODE>-2.2** (guard) WHEN <condition> THE SYSTEM SHALL CONTINUE TO <existing behavior>.

## <N>. Quality attributes

**Section-kind:** nfr

**Story:** As a stakeholder, I want measurable quality targets for this feature, so that how-well is not left implicit.

- **Performance:** **<CODE>-N.1** <target + verification method, or None — reason>
- **Security:** **<CODE>-N.2** <target + verification method, or None — reason>
- **Reliability:** **<CODE>-N.3** <target + verification method, or None — reason>
- **Accessibility:** **<CODE>-N.4** <target + verification method, or None — reason>

(Omit IDed lines only when the whole attribute is `None` with reason under the
bullet. Sections without `**Section-kind:** nfr` are user stories — **absent =
story**. Do not mark a behavioral story as nfr.)

## Out of Scope

- <explicitly excluded behavior — protects against scope creep during implementation>

## Open Questions

<!-- Empty before Status: Approved, OR only Owned unknowns from cmk:interview:
     - topic — owner — date — forbid-guess (AI/dev must not invent the answer)
     Bare "TBD" without owner/date/forbid-guess blocks Approve. -->

- <Owned unknown: topic — owner — date — forbid-guess; or delete this section when empty>
