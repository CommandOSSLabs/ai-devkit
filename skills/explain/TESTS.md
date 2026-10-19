<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# understand — test evidence

Replaces five learning skills: `tour-system` 1.1.0, `deepen-codebase` 1.1.0,
`study-change` 1.1.1, `teach-build` 1.0.0, and `teach-pack` 1.0.2. The user
reported (2026-10-06) that they "không hiệu quả vì quá nhiều thủ tục, nhiều
skills không biết sử dụng thế nào" — too much ceremony, and too many skills to
know which one to use. The shape follows Karpathy's post of 2026-10-02 on
reading LLM output: controlled language (ASD-STE100, softened), then diagrams,
then an interactive HTML page.

Model roster: **Sonnet only** (standing directive: skill tests run on Sonnet).
Every rep: fresh context, the `skill-tester` agent, its own fixture copy in a
random parent directory, skills installed at `.claude/skills/<name>/`.

Fixture: `ledgerly` — a stdlib Python billing service. The `refunds` feature
crosses six pre-existing parts: route registry `http.py`, pub/sub `events.py`,
job loop `worker.py`, `store.py`, `gateway.py`, and `notify.py`. Wiring happens
by import side effect in `__init__.py`. One passing test. Five teachables are
buried in the code:

- T1: `POST /refunds` returns 202 before any money moves.
- T2: idempotency keys live in a module-level dict.
- T3: an event with no subscriber is dropped silently.
- T4: the worker retries forever, with no backoff and no failed status.
- T5: the amount is checked per request, never as a cumulative total.

Prompt (terse, Vietnamese, realistic): *"Giúp tôi hiểu feature refunds trong
repo này — nó hoạt động thế nào, từ đầu đến cuối. Tôi mới vào dự án."*

Shape criteria, fixed before any run:

- S1: a visual primary form (a diagram or page), not prose only.
- S2: short sentences.
- S3: claims cite `file:line`.
- S4: the explanation crosses the pre-existing parts.
- S5: teachables T1–T5 are surfaced.
- S6: an active check (a question or a teach-back).
- S7: no ceremony or process words before the content.
- S8: the explanation comes in the first turn.

## RED — 2026-10-06

**A — no skill.** Chat-only markdown, about 600 words in six sections. No file
and no diagram. Content was strong: T1–T5 all surfaced, plus two extras
(double refund on a mid-job retry; `python3 -m unittest` runs 0 tests). Line
citations were sparse. No check question. It ended by offering to fix bugs.
S1 ✗, S5 5/5, S6 ✗.

**B — `/tour-system`.** Chat plus `.skills/study/refunds/ledger.md`. No
diagram. It opened with a preamble: no `docs/specs/INDEX.md` so no CODE, and
`.skills/` not ignored, so run `/cmk:repo-config`. Process words in the
user-facing text: Atlas, stop, Checkpoint, ledger, `open_gap`, `demonstrated`.
It self-graded the learner, who had produced nothing: *"Vì bạn nhờ tôi đi tour
thay, tôi ghi checkpoint này là `demonstrated`"*. It ended by routing to three
other skills: `/teach-pack`, `/study-change`, `/cmk:repo-config`. Content 5/5,
cited per stop. S1 ✗, S7 ✗.

**C — `/deepen-codebase`.** It replied **in English** to a Vietnamese message.
Four numbered setup questions: target language; familiarity, goal, and pace
(`slow-deep` / `time-boxed map`); project posture; subject lock. Zero
explanation. Three tool calls, none of them on the code. It promised next to
*"teach one layer per turn, starting with the fundamentals of the problem (what
a refund is and which constraints apply), before I read this repo's code."*
S5 0/5, S7 ✗, S8 ✗ (two or more turns before any explanation).

Prior evidence agreeing with A: `teach-build` RED 2026-08-18, terse arm reps
3–4 — chat-only dump, no file, zero diagrams.

**Conclusion.** Content is **not** the failure: both arms that read the code
found 5/5 unprompted, so text telling the agent what to look for would be a
no-op. A first draft carried a list of surprise kinds tuned to this fixture;
it was deleted before GREEN for that reason. The failures:

1. Shape: prose only and no figure, in every arm.
2. No active check (A).
3. Ceremony: setup questions, process words, and routing to siblings (B, C).

Classification per `cmk:skill-authoring`: wrong shape → a positive recipe. The
recipe starts with the answer, so it has no setup slot to fill.

## GREEN round 1 — v1.0.0 draft

Skill not named in the prompt. The agent was told only that installed skills
live under `.claude/skills/` and to load one whose description matches. All
three reps loaded `cmk:explain` and `cmk:visualize`.

- **G1 (refunds).** Vietnamese chat of 9 sentences, plus the page path and one
  question. Page with 5 sections in Vietnamese, 1 inline SVG, 3 `<details>`,
  0 external URLs; it parses.
- **G2 (refunds).** ✗ Chat **in English** to a Vietnamese user, about 25
  sentences, with the full Surprises list poured into chat. Page in
  Vietnamese. Ends on one question.
- **G3 (`"hàm gateway.refund hoạt động thế nào vậy?"`).** Vietnamese chat of
  about 9 sentences, ending on one question. It traced from the route down
  because step 1 said "start where the action enters", so it touched 3+ files
  and wrote a page. The page was **in English** while the chat was in
  Vietnamese.

Mechanical checks (author, not the reps' reports): section greps, SVG and
`<details>` counts, external-URL scan, HTML parse. Spot-checked cites
(`worker.py:19-21`, `refunds.py:4`, `http.py:11-15`) against the fixture: all
correct.

REFACTOR from these transcripts:

- **Language.** A **Language** paragraph now covers the chat *and* the page —
  headings, labels, buttons, and questions included. It replaced the
  mid-paragraph clause both G2 and G3 missed.
- **Chat shape.** The chat answer is now exactly three parts: the gist (≤5
  sentences with a page, ≤8 without), the page path, and one question. The
  walk, surprises, and other questions live on the page.
- **Scope.** Step 1 is now "Trace what they named". For a single function or
  class: its body, what it calls, and its direct callers — not the whole flow.

## GREEN round 2

- **R1 (refunds).** Vietnamese gist of 5 sentences, plus a short honesty note
  (page not opened in a browser; README test command runs 0 tests), the path,
  and one question. Page in Vietnamese.
- **R2 (refunds).** Vietnamese gist of 4 sentences, the path, one question.
  Page in Vietnamese.
- **R3 (`gateway.refund`).** Vietnamese, 5 sentences, one question. The trace
  stayed on the function, its caller, and the worker retry, and found a sixth
  teachable unprompted (`amount_cents` is ignored). That is 3 files, so it
  wrote a page — the predicate fired as written. Page in Vietnamese.

Browser check (Chrome, R1 page): the SVG sequence figure renders; Next moves
1/8 → 2/8 and shows the real excerpt plus the data at that step (*"key = 'k1',
chưa thấy. inv = (1, 1000, 1)…"*); the 3 `<details>` questions are present.
Two defects seen:

1. The buttons read `Back` / `Next` in English on a Vietnamese page — copied
   from the recipe's literal labels.
2. The SVG was clipped at the right edge (the `worker.py` lane was cut off).

Fixes: the recipe now says "two buttons to step back and forward, labelled in
the user's language", and the SVG "scales to the page width (`viewBox`, no
fixed width)".

## Trigger test

18 queries, each judged as a fresh session's first message, against the real
descriptions of the model-invocable neighbours (`cmk:research`'s `references/rationale.md`, `cmk:debug`,
`cmk:scope`, `cmk:research`, `cmk:delivery-review`, `cmk:feature-graph`, `cmk:spike`,
`cmk:glossary`'s `references/define-domain.md`). User-invoked skills are excluded because the deciding agent
never sees their descriptions.

Round 1 — 17/18 as intended:

- should-fire 8/9: end to end, walk me through, Vietnamese "giải thích",
  onboarding, what a PR changes, explain a file, quiz me, what a function does.
- should-not-fire 9/9: rationale → `cmk:research`'s `references/rationale.md`; 500 → `cmk:debug`; "let's add" →
  `cmk:scope`; review before merge → `cmk:delivery-review`; Stripe rate limit →
  `cmk:research`; prototype → `cmk:spike`; rename → none; glossary →
  `cmk:glossary`'s `references/define-domain.md`; run a test → none.
- ✗ Miss: "how does OAuth PKCE work?" → `none`, reason "general protocol
  knowledge question". That is the not-in-repo subject `deepen-codebase` used
  to own.

Fix: the description adds "— or a library, protocol, or concept they need for
it —".

Round 2, after widening — 10/10 as intended:

- PKCE "we use it in the login flow" → `cmk:explain`.
- Stripe rate limit → `cmk:research`.
- How React Server Components stream → `cmk:explain`.
- Postgres SERIALIZABLE block or abort → `cmk:research`.
- Glossary term → `cmk:glossary`'s `references/define-domain.md`.
- Why SQLite → `cmk:research`'s `references/rationale.md`.
- How the cart total is calculated → `cmk:explain`.
- Latest Next.js version → `cmk:research`.
- JWT refresh tokens in general → `cmk:explain`.
- Cart total wrong → `cmk:debug`.

The widening did not pull external-fact lookups away from `cmk:research`.

## GREEN round 3 — confirm after all fixes

One rep with the same refunds prompt and the final text:

- Chat: a Vietnamese gist of 5 sentences, the page path, and one question.
  Nothing else.
- Page: Vietnamese headings (*Tóm tắt · Bản đồ · Đi qua một ví dụ · Điều bất
  ngờ · Tự kiểm tra*), Vietnamese buttons (*Bước trước / Bước sau*), and an
  `<svg viewBox="0 0 1210 678">` with no fixed width. All 8 lanes render
  uncut in Chrome. 3 `<details>`, 0 external URLs.

No new rationalizations in any GREEN transcript. The remaining wobble — a
one-paragraph honesty note in R1's chat ("not opened in a browser") — is left
alone. It reports verification status and is not ceremony.

## Not yet run in this form

These rows of *When the subject is…* have no GREEN rep under `cmk:explain`:

- the diff/PR row;
- the finished-build row, carried from `teach-build`'s tested Journey section
  (its RED/GREEN of 2026-08-18 is in git history);
- the outside-concept row (trigger-tested only, see above);
- the quiz row.

Run a shape rep on each before treating it as proven.
