# Testing

Load when: writing, reviewing, or extending a test.

Pick the lowest tier that can actually prove the behavior. Correctness,
completeness, and confidence per maintained scenario are the goal — not test
count, and not adherence to any particular process for getting there.

## Tiers

- **Unit** — pure logic, no IO, fast and deterministic. Co-locate with the
  code it proves.
- **Integration** — exercises a real boundary (a real database, a real
  network call, a real cross-language wire format). Never fake the boundary
  the test exists to verify; a mocked version of the exact thing under test
  proves nothing.
- **End-to-end** — golden paths and high-value regressions only. Expensive
  to run and maintain, so reserve it for scenarios that genuinely need real
  composition across the whole system.

## Name tests by behavior, not implementation

The test name is the spec; the body is the proof. A reader should learn what
guarantee is being protected from the name alone, without opening the body.
A test that cannot fail when the business logic it targets changes is wrong
— it is measuring something other than the behavior it claims to cover.

## Flakes are bugs

Root-cause a flaky test; never wrap it in a retry loop to make CI green. A
retry loop hides a real race, timing dependency, or shared-state leak that
will eventually surface somewhere more expensive to debug.

## Coverage contract

Keep changed-code coverage high and never let it regress:

- At least 99% changed-line coverage where tooling supports measuring it.
- 100% branch/condition coverage for changed decision logic.
- 100% coverage plus mutation or equivalent adversarial testing for
  security, authorization, consensus, wire-format, and other critical
  invariants.
- Any uncovered changed line needs an explicit, reviewed justification —
  never a silent exclusion.
- Never game the number with weak assertions, incidental execution that
  happens to touch a line, or blanket exclusions.

## Judge the suite, not the method

Test-driven development is a valid way to arrive at a good suite and may be
used whenever it helps, but it is never mandatory. Judge the resulting suite
by the confidence and behavior coverage it delivers, not by whether a
particular process produced it.

## Use the idiomatic runner

Run tests through whatever runner is idiomatic to the language and stack in
use; don't introduce a second test framework alongside an established one
without a documented reason.
