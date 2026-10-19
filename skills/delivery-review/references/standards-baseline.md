# Standards Baseline

Twelve smells the Standards axis always checks, even in a repo that documents
nothing. Every hit is a labeled judgment call ("possible feature envy"), never
a hard violation; a documented repo standard overrides any item here; skip
anything the repo's tooling already enforces.

Each entry: **what it is → how to fix.**

**Contents** — Standards, always checked: 1 Duplicated knowledge · 2 Shallow
module · 3 Leaky abstraction · 4 Feature envy · 5 Long parameter list · 6 Dead
code · 7 Speculative generality · 8 Shotgun surgery · 9 Primitive obsession ·
10 Mysterious name · 11 Comment compensating for bad code · 12 Inconsistent
vocabulary. Security, only when the diff touches a trust boundary:
13 Injection · 14 Broken authz · 15 Secret exposure · 16 Unvalidated input
reaching a sink · 17 Sensitive data in the clear · 18 Weak or misused crypto.
Production readiness, only when the diff changes runtime behavior: 19 Unbounded
failure mode · 20 Silent degradation · 21 Unsafe default · 22 Irreversible
migration · 23 No operational signal · 24 Reader left behind.
Tests, only when the diff adds or changes test files: 25 Pins what the code
says · 26 Same failure, separate test · 27 Cannot fail.

1. **Duplicated knowledge** — one fact or rule (a formula, a validation, a
   mapping) encoded in two or more places in the diff, so a future change must
   find every copy. → Extract the single source of truth and make every site
   consume it.

2. **Shallow module** — a class, function, or file whose interface is nearly
   as complicated as what it hides; callers gain nothing by going through it.
   → Deepen it (pull real logic behind the interface) or delete it and let
   callers do the work directly.

3. **Leaky abstraction** — an interface that forces callers to know about its
   internals: exposed storage shapes, required call orderings, error types
   from three layers down. → Redesign the boundary so the caller can stay
   ignorant of the implementation.

4. **Feature envy** — a function that spends its time reading and picking
   apart another module's data rather than its own. → Move the behavior onto
   the module that owns the data.

5. **Long parameter list** — a signature taking so many arguments (or several
   that always travel together) that call sites become unreadable and
   error-prone. → Bundle the co-traveling values into one named type, or let
   the function fetch what it can derive.

6. **Dead code** — functions, branches, flags, or exports the diff adds or
   keeps that nothing reaches. → Delete it; version control remembers.

7. **Speculative generality** — abstraction, hooks, or parameters added for
   needs no requirement has: "we might need it later". → Remove it and inline
   until a real caller shows up.

8. **Shotgun surgery** — one logical change in the diff forcing small edits
   scattered across many files. → Gather the pieces that change together into
   one module so the next change lands in one place.

9. **Primitive obsession** — a bare string, number, or map standing in for a
   domain concept (an ID, a money amount, a state) that deserves its own type
   with its own rules. → Introduce the small domain type and move the
   validation into it.

10. **Mysterious name** — an identifier that hides what it does or holds
    (`data2`, `process`, `handleStuff`), or one that describes the mechanism
    instead of the purpose. → Rename to what it means; if no honest name
    exists, the design underneath is the problem.

11. **Comment compensating for bad code** — a comment that explains WHAT
    confusing code does, papering over structure that should explain itself.
    → Refactor until the comment is unnecessary; keep comments that explain
    WHY (constraints, trade-offs, gotchas).

12. **Inconsistent vocabulary** — the same concept under different names
    across the diff (or a name that contradicts docs/requirements/glossary.md's glossary), so
    readers must guess whether two terms are one thing. → Pick the repo's
    canonical term and use it everywhere; update docs/requirements/glossary.md if the term is
    genuinely new.

## Security — when the diff touches a trust boundary

The twelve above are quality smells; these are the security concerns the
Standards axis raises whenever the diff crosses a trust boundary — anywhere
untrusted input enters, a secret is handled, or a privileged action is taken.
Same rules as above: each is a labeled judgment call, a documented repo standard
or an existing scanner overrides it, and skip what tooling already enforces. When
the diff touches none of these boundaries, say so and move on — do not
manufacture findings.

13. **Injection** — untrusted input concatenated into a SQL query, shell
    command, HTML/DOM, template, or file path, so the input can change the
    command's structure. → Use parameterized queries, safe argument arrays,
    context-aware escaping, or an allow-list; never string-build the command.

14. **Broken authz / missing access check** — an endpoint, handler, or query
    that acts on a resource without confirming the caller is authenticated AND
    allowed to touch *that specific* resource (the classic IDOR: trusting an ID
    from the request). → Enforce the check server-side at the boundary, scoped
    to the caller.

15. **Secret exposure** — a credential, token, or key hard-coded in the diff,
    logged, returned in an error/response, or committed to config. → Read it
    from the environment or a secret store; keep it out of source, logs, and
    responses; rotate anything that landed in history.

16. **Unvalidated input reaching a sink** — request data used as a size, index,
    redirect target, deserialization payload, or outbound URL (SSRF) without
    validation. → Validate type, range, and shape at the boundary; allow-list
    redirect and fetch targets; never deserialize untrusted data into live
    objects.

17. **Sensitive data in the clear** — PII, secrets, or auth material stored or
    transmitted without encryption, or hashed passwords using a fast/plain
    digest instead of a slow salted KDF. → Encrypt in transit and at rest; use
    a purpose-built password hash (argon2/bcrypt/scrypt).

18. **Weak or misused crypto / randomness** — a non-cryptographic RNG for a
    token, password reset, or session ID; a home-rolled or deprecated
    algorithm; a missing signature/nonce check. → Use the platform's vetted
    crypto and CSPRNG; cmk:evidence signatures and reject replays.

## Production readiness — when the diff changes runtime behavior

The twelve above ask whether the code reads well; these ask whether it survives
being deployed. Raise them whenever the diff changes runtime behavior, storage,
a contract, or configuration — not for a docs-only or test-only diff. Same rules
as above: each is a labeled judgment call, a documented repo standard or an
existing scanner overrides it, and skip what tooling already enforces. Read them
against the running system, not the hunk: the question is what an operator sees
at 3am, not whether the lines are tidy.

19. **Unbounded failure mode** — a retry, loop, queue, buffer, cache, or wait
    with no cap, timeout, or backoff, so one dependency being slow or down
    becomes an unbounded hang or unbounded growth. → Give it a limit and a
    timeout, and decide what happens when the limit is hit.

20. **Silent degradation** — a `catch` or fallback that quietly returns a
    different answer (a stale value, a default, the old code path) with nothing
    recording that it happened, so the system looks healthy while producing
    wrong output. → Make the degraded path observable and decide deliberately
    whether it should degrade or fail loudly.

21. **Unsafe default** — a new flag, env var, or config knob whose default
    turns the new behavior on for everyone, or that is opt-*out* rather than
    opt-in, so shipping the diff is itself the rollout. → Default to today's
    behavior and turn the new path on deliberately.

22. **Irreversible migration** — a schema or data change with no reverse path,
    or one that relaxes or drops a constraint other readers still rely on, or
    that backfills without saying what happens to rows written mid-deploy. →
    Supply the reverse, and state which readers the relaxed constraint affects.

23. **No operational signal** — a new failure path, fallback, or state
    transition an operator would need to know about, with no log, metric, or
    trace attached; nobody can tell whether it is firing in production. →
    Emit one signal at the decision point, carrying enough to act on.

24. **Reader left behind** — a contract, persisted row, emitted event, or
    downstream consumer whose value, shape, or timing changes for a reader the
    diff does **not** update: unmigrated in-repo call sites, historical rows
    written under the old rule, external subscribers. Look past the diff — the
    readers that matter here are the files it did not touch. → Migrate the
    readers you own in this change; for the ones you cannot reach, name them
    and the follow-up that retires the old path.

## Tests — when the diff adds or changes test files

The twelve ask whether code reads well; these ask whether the tests earn
their run time. A suite pays for every test on every run, by every parallel
agent, so a test that cannot catch a defect is a cost with no return. Same
rules as above: each is a labeled judgment call and a documented repo standard
overrides it. Judge each *added or changed* test, not the old suite.

25. **Pins what the code says** — the assertion restates a literal, default,
    constant, or the implementation's own expression: `expect(DEFAULTS.x)`,
    `defaults_to_600`, `typeof result === "object"`, a mock returning what the
    test then asserts. It passes by construction and fails only when someone
    edits the number. → Delete it, or assert the behavior the value causes. A
    default that a requirement promises stays covered, as one row among others,
    not as a test of its own.

26. **Same failure, separate test** — two or more tests that differ only in the
    input value (`rejects_empty_access_key`, `rejects_empty_secret_key`) and
    would break for the same defect. → Fold into one table-driven or
    parameterized test, one row per case; keep a separate test only when a case
    can fail for its own reason.

27. **Cannot fail** — a test whose assertion is vacuous (`toBeDefined`, a type
    check the compiler already makes, `expect(true)`), whose subject is mocked
    away, or that would still pass with the behavior deleted. → Rewrite until
    deleting the behavior turns it red, or delete it.
